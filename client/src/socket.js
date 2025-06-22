import { io } from "socket.io-client";
const socket = io("https://live-polling-system-hu7o.onrender.com"); // Backend server
export default socket;
