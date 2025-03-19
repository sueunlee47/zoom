import express from 'express';
import path from 'path';

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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});