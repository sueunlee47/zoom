import express from 'express';
import path from 'path';

const app = express();
const PORT = 3000;

// 템플릿 엔진 - view engine 을 PUG 로 설정
app.set('view engine', 'pug');

// 템플릿이 있는 디렉토리 설정
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  // 템플릿이 있는 곳(src/views)의 home 으로 렌더해줌
  // Rendering HTML views 명령어가  render임
  res.render("home")
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});