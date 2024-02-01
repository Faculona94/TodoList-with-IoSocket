// Import dependencies
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const flash = require("connect-flash");
const cors = require("cors");

// Initialize app and server
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO with CORS options
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST", "PUT"],
  },
});

// Initialize Passport
const initializePassport = require("./passport-config");
initializePassport(passport);

// Import routes
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes")(io);

// Connect to MongoDB
mongoose.connect("mongodb://localhost/todo-app", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Middleware for parsing request bodies and handling sessions
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  session({
    secret: "asdfghjkl",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

// Initialize Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Middleware for flash messages and CORS
app.use(flash());
app.use(
  cors({
    origin: "http://localhost:3001",
    credentials: true,
  })
);

// Route handlers
app.use("/auth", authRoutes);
app.use("/todo", taskRoutes);

// Socket.IO connection handlers
io.on("connection", (socket) => {
  console.log("New client connected");
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Start the server
server.listen(3000, () => {
  console.log("Server listening on port 3000");
});
