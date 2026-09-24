const form = document.querySelector("#form");
const input = document.querySelector("#input");
const chat = document.querySelector("#chat");

const messages = [];

function addMessage(text, who) {
  const el = document.createElement("div");
  el.className = `message ${who}`;
  el.textContent = text;

  chat.appendChild(el);
  chat.scrollTop = chat.scrollHeight;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const text = input.value.trim();
  if (!text) return;

  input.value = "";

  addMessage(text, "user");
  messages.push({
    role: "user",
    content: text
  });

  addMessage("Думаю... 🤔", "ai");
  const thinking = chat.lastElementChild;

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ messages })
    });

    const data = await response.json();

    thinking.remove();

    if (!response.ok) {
      throw new Error(data.error || "Ошибка");
    }

    addMessage(data.text, "ai");

    messages.push({
      role: "assistant",
      content: data.text
    });

  } catch (error) {
    thinking.remove();
    addMessage("Упс! " + error.message, "ai");
  }
});
