const express = require("express");
const app = express();
const port = 3000;

// Раздаём папку public
app.use(express.static("public"));

app.listen(port, () => {
  console.log(`✅ Сервер запущен: http://localhost:${port}`);
});
