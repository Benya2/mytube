// 🔥 Импортируем Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-storage.js";
import {
  getDatabase,
  ref as dbRef,
  push,
  onValue
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

// ⚙️ Твои настройки Firebase (исправленный storageBucket!)
const firebaseConfig = {
  apiKey: "AIzaSyBfr1wQcfF3aePju_cw3a6BqAhO5mPO6_I",
  authDomain: "my-7711d.firebaseapp.com",
  databaseURL: "https://my-7711d-default-rtdb.firebaseio.com",
  projectId: "my-7711d",
  storageBucket: "my-7711d.appspot.com", // ✅ исправлено
  messagingSenderId: "927734587826",
  appId: "1:927734587826:web:d5f47e7db523ac6a2ec4ab",
  measurementId: "G-PW7EEDMDLK"
};

// 🚀 Инициализация Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getDatabase(app);

// 🟢 Функция загрузки видео
window.uploadVideo = () => {
  const file = document.getElementById("fileInput").files[0];
  if (!file) return alert("Выберите видео!");

  const fileName = Date.now() + "-" + file.name;
  const storageRef = ref(storage, "videos/" + fileName);

  const uploadTask = uploadBytesResumable(storageRef, file);

  uploadTask.on(
    "state_changed",
    snapshot => {
      const progress =
        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log("Загрузка: " + progress.toFixed(0) + "%");
    },
    error => {
      alert("Ошибка загрузки: " + error.message);
    },
    () => {
      // ✅ Когда загрузка завершена — получаем ссылку и сохраняем в базу
      getDownloadURL(uploadTask.snapshot.ref).then(url => {
        push(dbRef(db, "videos"), { url, name: fileName, time: Date.now() });
        alert("Видео успешно загружено!");
      });
    }
  );
};

// 🟡 Отображаем список видео
const container = document.getElementById("videos");

onValue(dbRef(db, "videos"), snapshot => {
  container.innerHTML = "";
  const data = snapshot.val();
  if (!data) {
    container.innerText = "Пока нет видео.";
    return;
  }

  Object.values(data)
    .reverse()
    .forEach(video => {
      const el = document.createElement("video");
      el.src = video.url;
      el.controls = true;
      el.style.maxWidth = "100%";
      el.style.marginBottom = "10px";
      container.appendChild(el);
    });
});
