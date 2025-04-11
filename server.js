const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Папка для хранения видео
const uploadFolder = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadFolder)) fs.mkdirSync(uploadFolder);

// Настройка загрузки видео через multer
const storage = multer.diskStorage({
  destination: uploadFolder,
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Раздача статических файлов
app.use(express.static('public'));
app.use('/videos', express.static('uploads'));

// ⬇️ Вот этот маршрут добавь после upload и до listen

// Получение списка всех видео
app.get('/list', (req, res) => {
  fs.readdir(uploadFolder, (err, files) => {
    if (err) return res.status(500).send('Ошибка');
    const videos = files.map(file => `/videos/${file}`);
    res.json(videos);
  });
});

// Обработка загрузки видео
app.post('/upload', upload.single('video'), (req, res) => {
  res.redirect('/');
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Сервер запущен: http://localhost:${port}`);
});
