const socket = io();

socket.on("connect", () => {
    console.log(`Connected to Server`);
})

socket.on("message", (message) => {
    console.log(`New message: ${message}`)
})

socket.on("disconnect", () => {
    console.log(`Disconnected from Server`);
})
socket.emit("message", "This is a message from the Browser");