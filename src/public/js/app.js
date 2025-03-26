const socket = io();

socket.on("new_message", (message) => {
    addMessage(message);
});

socket.on("welcome", (nickname) => {
    addMessage(`${nickname} joined!`);
});

socket.on("bye", (nickname) => {
    addMessage(`${nickname} left`);
});

socket.on("room_change", (publicRooms) => {
    const ul = room.querySelector("ul");
    publicRooms.map(room => {
        const li = document.createElement("li");
        li.innerText = room;
        ul.appendChild(li);
    })
});

const user = document.getElementById("user");
const room = document.getElementById("room");
const chat = document.getElementById("chat");
room.hidden = true;
chat.hidden = true;

const userFrom = user.querySelector("form");
userFrom.addEventListener("submit", handleUserSubmit)

const roomForm = room.querySelector("form");
roomForm.addEventListener("submit", handleRoomSubmit)

const chatForm = chat.querySelector("form");
chatForm.addEventListener("submit", handleChatSubmit)

let nickname;
function handleUserSubmit(event) {
    event.preventDefault();
    const input = user.querySelector("input")
    nickname = input.value;

    socket.emit("nickname", nickname, () => {
        user.hidden = true;
        room.hidden = false;
    });
}

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
