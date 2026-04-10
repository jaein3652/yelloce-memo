const notesDiv = document.getElementById("notes");
const right = document.getElementById("right");
const resizer = document.getElementById("resizer");
const left = document.getElementById("left");

let idCounter = 0;
let isResizing = false;

/* 메모 생성 */
function addNote(text = "", x = "50px", y = "50px") {
  const id = "note_" + idCounter++;

  const note = document.createElement("div");
  note.className = "note";
  note.contentEditable = true;
  note.innerText = text;
  note.dataset.id = id;

  note.addEventListener("input", () => {
    updateCard(id, note.innerText);
    saveNotes();
  });

  notesDiv.appendChild(note);

  createCard(id, text, x, y);
  saveNotes();
}

/* 카드 생성 */
function createCard(id, text, x, y) {
  const card = document.createElement("div");
  card.className = "card";
  card.innerText = text || "새 메모 내용을 입력하세요.";
  card.dataset.id = id;

  card.style.left = x;
  card.style.top = y;

  makeDraggable(card);

  right.appendChild(card);
}

/* 카드 업데이트 */
function updateCard(id, text) {
  const card = document.querySelector(`.card[data-id='${id}']`);
  if (card) {
    card.innerText = text || "새 메모 내용을 입력하세요.";
  }
}

/* 드래그 */
function makeDraggable(el) {
  let offsetX = 0, offsetY = 0, isDown = false;

  el.addEventListener("mousedown", (e) => {
    isDown = true;
    offsetX = e.offsetX;
    offsetY = e.offsetY;
    el.style.zIndex = 1000;
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    el.style.left = (e.pageX - right.offsetLeft - offsetX) + "px";
    el.style.top = (e.pageY - offsetY) + "px";
  });

  document.addEventListener("mouseup", () => {
    if (isDown) {
      isDown = false;
      el.style.zIndex = 10;
      saveNotes();
    }
  });
}

/* 저장 */
function saveNotes() {
  const data = [];
  document.querySelectorAll(".note").forEach(note => {
    const id = note.dataset.id;
    const text = note.innerText;
    const card = document.querySelector(`.card[data-id='${id}']`);
    if (card) {
      data.push({
        id,
        text,
        x: card.style.left,
        y: card.style.top
      });
    }
  });
  localStorage.setItem("memo_moodboard_data", JSON.stringify(data));
}

/* 불러오기 */
function load() {
  const saved = JSON.parse(localStorage.getItem("memo_moodboard_data") || "[]");

  if (saved.length === 0) {
    // 저장된 데이터가 없을 때 초기 샘플 메모 생성
    addNote("여기에 메모를 작성해 보세요!", "100px", "100px");
  } else {
    saved.forEach(item => {
      const id = item.id;
      const num = parseInt(id.split('_')[1]);
      if (num >= idCounter) idCounter = num + 1;

      const note = document.createElement("div");
      note.className = "note";
      note.contentEditable = true;
      note.innerText = item.text;
      note.dataset.id = id;

      note.addEventListener("input", () => {
        updateCard(id, note.innerText);
        saveNotes();
      });

      notesDiv.appendChild(note);

      const card = document.createElement("div");
      card.className = "card";
      card.innerText = item.text || "새 메모 내용을 입력하세요.";
      card.dataset.id = id;
      card.style.left = item.x;
      card.style.top = item.y;

      makeDraggable(card);
      right.appendChild(card);
    });
  }
}

/* 리사이저 로직 */
resizer.addEventListener("mousedown", () => {
  isResizing = true;
  document.body.style.cursor = 'col-resize';
});

document.addEventListener("mousemove", (e) => {
  if (!isResizing) return;
  const newWidth = e.clientX;
  if (newWidth > 200 && newWidth < window.innerWidth * 0.6) {
    left.style.width = newWidth + "px";
  }
});

document.addEventListener("mouseup", () => {
  isResizing = false;
  document.body.style.cursor = 'default';
});

// Initialize
window.onload = load;
window.addNote = addNote;
