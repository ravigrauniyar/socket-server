import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Enable CORS for all routes
app.use(cors());

io.on("connection", (socket) => {
  console.log("A user connected to /ws/socket.io");

  socket.on("disconnect", () => {
    console.log("User disconnected from /ws/socket.io");
  });
});

// Add a route to handle the specified HTTP request
app.get("/ws/socket.io", (req, res) => {
  const { EIO, transport, t } = req.query;

  // Check if the required query parameters are present
  if (EIO === "4" && transport === "polling" && t) {
    // Respond with a hello message
    res.send(req.headers["x-chainlit-session-id"]);
  } else {
    // Respond with an error if the parameters are incorrect
    res.status(400).send("Invalid request parameters");
  }
});

const PORT = process.env.PORT || 4000;

httpServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
