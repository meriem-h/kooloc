import React from "react";

export const FilesList = (props) => {
  const items = props.FilesList;

  return (
    <div>
      <thead>
        <tr>
          <th>Nom</th>
          <th>Taille</th>
          <th>Utilisateur</th>
          <th>Créé à</th>
        </tr>
      </thead>
      <tbody>
        {items
          ? items.map((item) => (
              <tr>
                <th>{item.name}</th>
                <th>{item.size}</th>
                <th>{item.user.firstName}</th>
                <th>{item.createdAt}</th>
              </tr>
            ))
          : null}
      </tbody>
    </div>
  );
};
