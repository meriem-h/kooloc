require('dotenv').config()
const express = require('express')
const app = express()
const http = require('http')
const { Server } = require('socket.io')
const cors = require("cors")
const bodyParser = require("body-parser")
const cookieParser = require('cookie-parser')
const { jwtCheck } = require("./middlewares/AuthMiddleware")
const jwt = require("jsonwebtoken")
const db = require('./models/index')
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_KOOLOC,
    pass: process.env.PASSWORD_KOOLOC
  }
});



const { login, authByToken, register, authenticateJWT, isAuth } = require("./controllers/AuthController")


const HouseRouter = require('./routes/HouseRouter.js')
const ShoppingListRouter = require('./routes/ShoppingListRouter')
const ExpenseController = require('./routes/ExpenseRouter')
const CategoryController = require('./routes/CategoryRouter')
const DocumentController = require("./routes/DocumentRouter")
const ChatroomRouter = require('./routes/ChatroomRouter.js')
const EventRouter = require("./routes/EventRouter")
const PollRouter = require("./routes/PollRouter")
const UserRouter = require("./routes/UserRouter")
const { where } = require('sequelize')

app.use(cors())
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/house", jwtCheck, HouseRouter)
app.use("/shoppinglists", ShoppingListRouter)
app.use("/expenses", ExpenseController)
app.use("/categories", CategoryController)
app.use("/chatroom", ChatroomRouter)
app.use("/documents", DocumentController)
app.use("/event", jwtCheck,EventRouter)
app.use("/polls",jwtCheck,PollRouter)
app.use("/user", jwtCheck,UserRouter)


const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
})

io.on('connection', (socket) => {
  console.log('Client connecté');

  socket.use((packet, next) => {

    // try {
    //   const token = socket.handshake.auth.token;
    //   jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    //     if (user) {
    //       socket.user = user
    //       next()
    //     } else {
    //       throw err
    //     }
    //   })
    // } catch (err) {
    //   console.log(err)
    // }

    next()

  });

  socket.on("logingIn", async (data) => {
    const houseShareId = data.houseShareId;
    const userId = data.userId;
    const liste = await db.Chatroom.findAll({
      where: {
        isPrivate: false
      },
      include : [
        {
          model: db.HouseShare,
          as: 'houseShare',
          required: true,
          where:
          {
            id: houseShareId
          }
        }
      ]
    });

    const private_liste = await db.Chatroom.findAll({
      where: {
        houseShareId: houseShareId,
        isPrivate: true
      },
      include: [
        {
          model: db.User,
          required: true,
          where:
          {
            id: userId
          }
        }
      ]
    });
    const full_list = liste.concat(private_liste);

    full_list.forEach(room => {
      socket.join("Chatroom_" + room.id)
    })
  })

  socket.on('createShoppingList', async (data, callback) => {
    let uuid = uuidv4();
    let shoppinglist = await db.ShoppingList.create({
      name: data.name,
      uuid: uuid,
      isPrivate: data.isPrivate,
      CreatedBy: data.CreatedBy,
      houseShareId: data.houseShareId
    })

    let user = await db.User.findOne({ where : { id : data.CreatedBy }})
    shoppinglist.addUser(user)

    io.to('Shopping').emit('newShoppingList', { shoppinglist });
  });

  socket.on('deleteShoppingList', async (data, callback) => {
    await db.ShoppingList.destroy({ where : { id : data.id }});
    io.to(`Shopping`).emit('deleteShoppingList', { list : { id : data.id }});
  })

  socket.on('addToPrivate', async (data, callback) => {
    const list = await db.ShoppingList.findOne({ where : { id : data.list.id }})
    const user = await db.User.findOne({ where : { id : data.user.id }})
    if(list.addUser(user)){
      io.to(`Shopping_${data.list.id}`).emit('refresh');
      io.to(`Shopping`).emit('refresh', data);
    };
  })

  socket.on('removeFromPrivate', async (data, callback) => {
    const list = await db.ShoppingList.findOne({ where : { id : data.list.id }})
    const user = await db.User.findOne({ where : { id : data.user.id }})
    if(list.removeUser(user)){
      io.to(`Shopping_${data.list.id}`).emit('refresh');
      io.to(`Shopping`).emit('refresh', data);
    };
  })

  socket.on("joinRoom", (data, callback) => {
    socket.join(data.roomName)
    io.to(`${data.roomName}`).emit('message', 'vous avez rejoint la room ' + data.roomName);
  })

  socket.on("newExpense", async (data, callback) => {

    if (data.newCategory) {

      let categories = await db.ExpenseCategory.findAll();
      let categoryExist = categories.filter(x => x.name.toUpperCase() === data.newCategory.toUpperCase())

      if (categoryExist.length <= 0) {
        var category = await db.ExpenseCategory.create({
          name: data.newCategory.toUpperCase(),
          primaryColor: data.newColor
        })
      } else {
        category = categoryExist[0]

      }
    }
    if (data.id) {
      await db.Expense.update(
        {
          isFinalised: true,
          price: data.price * 1000,
          CategoryId: data.category ?? category.id,
          description: data.description,
          CreatedBy: data.CreatedBy
        }, {
        where: {
          id: data.id
        }
      })

    } else {
      let expense = await db.Expense.create({
        name: data.name,
        price: data.price * 1000,
        CategoryId: data.category ?? category.id,
        description: data.description,
        CreatedBy: data.CreatedBy
      })
    }

    io.emit('newExpense', { status: "ok" })
  })


  socket.on("addItem", async (data, callback) => {
    const itemList = await db.ShoppingItem.create({
      content: data.content,
      ShoppingListId: data.shopListId,
      creatorId: data.creatorId
    })
    io.to(`Shopping_${data.shopListId}`).emit('addItem2', itemList);
  })

  socket.on("checkItem", async ({ id, isComplete }, callback) => {
    try {
      await db.ShoppingItem.update({ isComplete: isComplete }, {
        where: {
          id: id
        }

      });

      const item = await db.ShoppingItem.findByPk(id)
      io.to(`Shopping_${item.ShoppingListId}`).emit('addItem2', item.ShoppingListId);
    } catch (error) {

    }
  })

  socket.on("deleteItem", async (data, callback) => {
    let shoppingListId = null;
    for (let i = 0; i < data.id.length; i++) {
      const id = data.id[i]
      let item = await db.ShoppingItem.findByPk(id)
      shoppingListId = item.ShoppingListId
      const count = await db.ShoppingItem.destroy({ where: { id: id } });
    }
    io.to(`Shopping_${shoppingListId}`).emit('addItem2', shoppingListId);
  })

  socket.on("toExpense", async (data, callback) => {
    for (let i = 0; i < data.id.length; i++) {
      const id = data.id[i]
      let item = await db.ShoppingItem.update(
        { isOnSpend: true },
        { where: { id: id } })

      let shopppingItem = await db.ShoppingItem.findByPk(id)
      console.log(data)

      let expense = await db.Expense.create({
        name: shopppingItem.content,
        isFinalised: false,
        CreatedBy: data.CreatedBy
      })


    }

    io.emit('addItem2', data.shoppingListId)
  })


  socket.on('upload', (data) => {
    console.log(data)
    const fichier = `src/uploads/${data.name}`;
    const buffer = data.buffer
    const offset = 0;
    const length = buffer.length;
    const position = 0;

    if(!fs.existsSync('src/uploads')){
      fs.mkdirSync('src/uploads');
    }
    
    fs.open(fichier, 'w', (err, fd) => {
      if (err) {
        throw err;
      }
      fs.write(fd, buffer, offset, length, position, (err) => {
        if (err) {
          throw err;
        }
        fs.close(fd, (err) => {
          if (err) {
            throw err;
          }
          console.log(`Le fichier ${data.name} a été créé avec succès !`);
          db.File.create({
            name: data.name,
            size: data.size / 1000 + 'kB',
            type: data.name.match(/\.([^.]+)$/)[1],
            userId:data.userId,
            houseShareId:data.houseShareId
          })
          io.emit('newDocument', { status: "ok" })
        });
      });
    });
  })

  socket.on("deleteFile", async (data) => {
    console.log(data)
    const count = await db.File.destroy({ where: { id: data.id } });
    fs.unlink('src/uploads/' + data.fileName, (err) => {
      if (err) throw err;
      console.log('Le fichier a été supprimé');
      io.emit('deleteFile', { id: data.id })
    });
  })

  socket.on("newPoll", async (data) => {
    const newPoll = await db.Poll.create({
      question:data.question,
      houseshareId:data.houseShareId,
      userId:data.userId
    })
    console.log(newPoll)
    data.choices.forEach(async choices => {
      let suggestion = await db.Suggestion.create({
        title:choices.text,
        pollId:newPoll.id
      })
    });

    io.emit('newPoll', {id:newPoll.id})
    socket.emit("newPollSelect",{id:newPoll.id})
  })

  socket.on('newVote', async (data) => {
    console.log(data)
    data.votes.forEach(async v => {
      // console.log(v)
      await db.Vote.create({
        userId:data.userId,
        pollId:data.pollId,
        suggestionId:v.id
      })
    })
    socket.emit("updateAfterVote",{id:data.pollId})
  })

  socket.on('deletePoll',async data => {
    const count = await db.Poll.destroy({ where: { id: data.id } });
    socket.emit("deletePoll",{count})
  })

  socket.on('createChatroom', async (data, callback) => {
    let chatroom = await db.Chatroom.create({
      name: data.name,
      isPrivate: data.isPrivate,
      CreatedBy: data.CreatedBy,
      houseShareId: data.houseShareId
    })

    let user = await db.User.findOne({ where : { id : data.CreatedBy }})
    chatroom.addUser(user)

    socket.join("Chatroom_" + chatroom.id)

    io.emit('newChatroom', { chatroom });
  });

  socket.on('sendMessage', async data => {
    await db.ChatroomMessage.create({
      active: true,
      content: data.message,
      chatroomId: data.room,
      createdBy: data.user
    })
    io.to('Chatroom_' + data.room).emit('newMessage', {id: data.room})
  })
});

app.get('/', (req, res) => { res.send('Hello World!') })
app.post('/login', login)
app.post("/register", register);
app.post("/authbytoken", authByToken);
app.post("/isAuth", jwtCheck, isAuth);


server.listen(8000, () => {
  console.log(`Example app listening on port 8000`)
})