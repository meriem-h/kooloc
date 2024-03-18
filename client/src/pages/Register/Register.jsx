import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Register.module.scss'

function Register() {
	const navigate = useNavigate()
	const [formData, setFormData] = useState({
		email: "",
		password: "",
		firstname: "",
		lastname: "",
	})

	const [error, setError] = useState(null)

	const handleSubmit = event => {
		event.preventDefault();
		fetch(`${process.env.REACT_APP_BACKEND_URL}/register`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(formData)
		})
			.then(response => response.json())
			.then(data => {
				if (data.status === "OK") {
					navigate("/login")
				} else {
					setError(data.response)
				}
			})
			.catch(error => setError(error))
	};

	const handleInputChange = event => {
		const { name, value } = event.target;
		setFormData({ ...formData, [name]: value });
	};

	return (
		<div className="pageContainer">
			<div>
				<p className='bigTitle mb-20'>Bienvenue sur Touareg</p>
			</div>
			<form className={styles.form} onSubmit={handleSubmit}>
				<div className={styles.inputContainer}>
					<div className={`${styles.formGroup} mr-5 flex-fill`}>
						<label className={styles.label} htmlFor="firstname">Prenom</label>
						<input id="firstname" type="text" name='firstname' value={formData.firtname} onChange={handleInputChange} />
						{
							error ?
								<span className='text-danger'>{error?.filter(x => x.path === "firstName")[0]?.message}</span>
								:
								null
						}
					</div>
					<div className={`${styles.formGroup} ml-5 flex-fill`}>
						<label className={styles.label} htmlFor="lastname">Nom</label>
						<input id="lastname" type="text" name='lastname' value={formData.lastname} onChange={handleInputChange} />
						{
							error ?
								<span className='text-danger'>{error?.filter(x => x.path === "lastName")[0]?.message}</span>
								:
								null
						}
					</div>
				</div>
				<div className={styles.formGroup}>
					<label className={styles.label} htmlFor="email">Email</label>
					<input id='email' type="email" name='email' value={formData.email} onChange={handleInputChange} />
					{
						error ?
							<span className='text-danger'>{error?.filter(x => x.path === "email" || x.path === "unique_email")[0]?.message}</span>
							:
							null
					}
				</div>
				<div className={styles.inputContainer}>
					<div className={`${styles.formGroup} mr-5 flex-fill`}>
						<label className={styles.label} htmlFor="password">Mot de passe</label>
						<input id="password" type="password" name='password' value={formData.password} onChange={handleInputChange} />
						{
							error ?
								<span className='mb-20 text-danger'>{error?.filter(x => x.path === "password")[0]?.message}</span>
								:
								null
						}
					</div>
					<div className={`${styles.formGroup} ml-5 flex-fill`}>
						<label className={styles.label} htmlFor="cpassword">Confirmation </label>
						<input id="cpassword" type="password" name='cpassword' />
					</div>
				</div>
				<div>
				</div>
				<div className='d-flex justify-content-center'>
					<button className='btn btn-primary'>S'inscire <i className="fa-solid fa-arrow-right"></i></button>
				</div>
			</form>
		</div>
	)
}

export default Register