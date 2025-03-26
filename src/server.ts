import express from 'express';
import path from 'path';
import { createServer } from 'http';
import { Server, Socket } from "socket.io";

class SocketCustom extends Socket {
  nickname?: string;
}

const app = express();
const PORT = 3000;

// 템플릿 엔진 - view engine 을 PUG 로 설정
app.set('view engine', 'pug');

// 템플릿이 있는 디렉토리 설정
app.set('views', path.join(__dirname, 'views'));

// TODO > babel 이나 webpack 사용해서 ts 파일 사용 가능하도록 설정 예정
//        현재 ts 파일로 설정하면, 에러 발생 Refused to execute script from 'http://localhost:3000/public/js/app.ts' because its MIME type ('video/mp2t') is not executable.
// app.use(경로, 콜백) 명령어는 지정된 경로에 지정된 미들웨이를 마운트함
// express.static 는 정적(static) 파일을 제공함
// 현재 public/js/app.js 
app.use('/public', express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
  // 템플릿이 있는 곳(src/views)의 home 으로 렌더해줌
  // Rendering HTML views 명령어가  render임
  res.render("home")
});

// "/" 페이지 외 다른 경로로 페이지 접근 시, redirect 해줌
app.get("/*", (req, res) => {
  res.redirect("/")
});

const server = createServer(app);

const io = new Server(server, {
  // options
});

function publicRooms() {
  const rooms = [...io.sockets.adapter.rooms.keys()];
  const sids = [...io.sockets.adapter.sids.keys()];

  const publicRooms = rooms.filter(v => !sids.includes(v));
  return publicRooms;
}

io.on('connection', (socket: SocketCustom) => {
  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) => socket.to(room).emit("bye", socket.nickname))
  })

  socket.on("disconnect", () => {
    io.sockets.emit("room_change", publicRooms())
  })

  socket.on("nickname", (nickname: string, done: () => void) => {
    socket.nickname = nickname;
    done();
  })

  socket.on("enter_room", (roomName: string, done: () => void) => {
    socket.join(roomName);
    socket.to(roomName).emit("welcome", socket.nickname);
    io.sockets.emit("room_change", publicRooms())
    done();
  })

  socket.on("new_message", (roomName: string, message: string, done: () => void) => {
    socket.to(roomName).emit("new_message", `${socket.nickname}: ${message}`);
    done();
  })
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

