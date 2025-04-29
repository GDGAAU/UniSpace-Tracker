const express = require("express");
const http = require("http");
const { info, error } = require("./utils/logger");
const app = express();
const cors = require("cors");
const middleweare  = require('./utils/middleware')
const userRouter = require('./controllers/users');
const reservationRouter = require('./controllers/reservations');
const loginRouter = require("./controllers/login");
const signupRouter = require("./controllers/signup");
const classroomRouter = require("./controllers/classrooms");
const occupancyRouter = require("./controllers/occupancy");
const { notificationRouter } = require("./controllers/notification");


const {Server} = require("socket.io");
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:9000', //Should be updated
    methods: ['GET', 'POST'],
  },
});


app.use(cors());
app.use(express.json());
app.use(middleweare.requestLogger)
app.use(middleweare.getTokenFrom)
app.set('io', io);



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
app.use('/api/occupancy', occupancyRouter)
app.use('/api/notifications', notificationRouter)


io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  socket.on('joinUserRoom', (userId) => {
    socket.join(`user:${userId}`);
    console.log(`User ${userId} joined room user:${userId}`);
  });
  socket.on('disconnect', () => console.log('User disconnected:', socket.id));
});


app.use(middleweare.unknownEndpoint)
app.use(middleweare.errorHandler)

module.exports = app


