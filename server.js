// 🔥 Импортируем Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-storage.js";
import { getDatabase, push, ref as dbRef, onValue } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

// ⚙️ Твои настройки Firebase (вставь свои!)
const firebaseConfig = {
  apiKey: "AIzaSyBfr1wQcfF3aePju_cw3a6BqAhO5mPO6_I",
  authDomain: "my-7711d.firebaseapp.com",
  databaseURL: "https://my-7711d-default-rtdb.firebaseio.com",
  projectId: "my-7711d",
  storageBucket: "my-7711d.firebasestorage.app",
  messagingSenderId: "927734587826",
  appId: "1:927734587826:web:d5f47e7db523ac6a2ec4ab",
  measurementId: "G-PW7EEDMDLK"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getDatabase(app);

window.uploadVideo = () => {
  const file = document.getElementById('fileInput').files[0];
  if (!file) return alert("Выберите видео!");

  const storageRef = ref(storage, 'videos/' + Date.now() + '-' + file.name);
  const uploadTask = uploadBytesResumable(storageRef, file);

  uploadTask.on('state_changed',
    null,
    error => alert("Ошибка: " + error),
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then(url => {
        // Сохраняем ссылку в базу
        push(dbRef(db, 'videos'), { url });
        alert("Видео загружено!");
      });
    }
  );
};

const container = document.getElementById('videos');

// Загружаем список видео
onValue(dbRef(db, 'videos'), snapshot => {
  container.innerHTML = '';
  const data = snapshot.val();
  if (!data) {
    container.innerText = 'Пока нет видео.';
    return;
  }

  Object.values(data).reverse().forEach(video => {
    const el = document.createElement('video');
    el.src = video.url;
    el.controls = true;
    el.style.maxWidth = '100%';
    el.style.marginBottom = '10px';
    container.appendChild(el);
  });
});
