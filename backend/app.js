const express = require("express");
const { info, error } = require("./utils/logger");
const app = express();
const cors = require("cors");
const middleweare  = require('./utils/middleware')
const userRouter = require('./controllers/users');
const reservationRouter = require('./controllers/reservations');
const loginRouter = require("./controllers/login");
const signupRouter = require("./controllers/signup");
const classroomRouter = require("./controllers/classrooms");


app.use(cors());
app.use(express.json());
app.use(middleweare.requestLogger)
app.use(middleweare.getTokenFrom)



// app.use(middleweare.unknownEndpoint)
app.get('/', (req, rep) => {
  rep.send('<h1> Hello World </h1>')
})



//routers


app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)
app.use('/api/signup', signupRouter)
app.use('/api/reservations', reservationRouter)
app.use('/api/classrooms', classroomRouter)

app.use(middleweare.unknownEndpoint)
app.use(middleweare.errorHandler)

module.exports = app


