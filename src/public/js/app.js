const socket = io();

socket.on("new_message", (message) => {
    addMessage(message);
});

socket.on("welcome", () => {
    addMessage("someone joined!");
});

socket.on("bye", () => {
    addMessage("someone left");
});

const room = document.getElementById("room");
const chat = document.getElementById("chat");
chat.hidden = true;

const roomForm = room.querySelector("form");
roomForm.addEventListener("submit", handleRoomSubmit)

const chatForm = chat.querySelector("form");
chatForm.addEventListener("submit", handleChatSubmit)

let roomName;
function handleRoomSubmit(event) {
    event.preventDefault();
    const input = room.querySelector("input")
    roomName = input.value;

    socket.emit("enter_room", roomName, () => {
        room.hidden = true;
        chat.hidden = false;

        const h3 = chat.querySelector("h3");
        h3.innerText = `Room ${roomName}`;

        input.value = "";
    });
}

function handleChatSubmit(event) {
    event.preventDefault();
    const input = chat.querySelector("input");
    const message = input.value;

    socket.emit("new_message", roomName, message, () => {
        addMessage(`You: ` + input.value);
        input.value = "";
    })
}

function addMessage(message) {
    const ul = chat.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = message;
    ul.appendChild(li);
}
