// chatbot.js

function sendMessage(event) {
  event.preventDefault();
  const input = event.target.elements.message;
  const newMessage = input.value.trim();

  if (newMessage !== "") {
    const messages = document.getElementById("chatMessages");
    const timestamp = new Date().toLocaleTimeString([], {
      hour: "numeric",
      minute: "numeric",
    });

    if (messages.childElementCount > 2) {
      messageContainer = document.getElementById("messageContainer");
      messageContainer.classList.remove("flex")
    }

    const userMessage = document.createElement("div");
    userMessage.className = "flex flex-col mb-2 items-end";
    userMessage.innerHTML = `
  <div class="flex items-end justify-center">
    <img src="./Assets/botImage.png" class="w-5 h-5 rounded-full mr-2 hidden" alt="" />
    <div class="p-2 bg-cyan-500 text-right text-white rounded-lg">
      ${newMessage}
    </div>
  </div>
  <div class="text-xs mt-2 text-gray-400 ml-8 text-right">
    ${timestamp}
  </div>
  `;
    messages.appendChild(userMessage);

    const botMessage = document.createElement("div");
    botMessage.className = "flex flex-col mb-2 items-start";
    botMessage.innerHTML = `
  <div class="flex items-end justify-center">
    <img src="./Assets/botImage.png" class="w-5 h-5 rounded-full mr-2 block" alt="" />
    <div class="p-2 bg-gray-100 text-left rounded-lg">
      Reply from Bot
    </div>
  </div>
  <div class="text-xs mt-2 text-gray-400 ml-8 text-left">
    ${timestamp}
  </div>
  `;
    messages.appendChild(botMessage);

    input.value = "";

    console.log(messages);
    scrollToBottom();
  }

  function scrollToBottom() {
    const scrollToBottomRef = document.getElementById("scrollToBottomRef");
    scrollToBottomRef.scrollIntoView({ behavior: "smooth", block: "end" });
  }
}
function toggleChatbot() {
  const chatbotContainer = document.getElementById("chat-bot__Container");
  chatbotContainer.classList.toggle("opacity-0");
  chatbotContainer.classList.toggle("opacity-100");
  chatbotContainer.classList.toggle("pointer-events-none");
  chatbotContainer.classList.toggle("pointer-events-auto");

  const modalButton = document.getElementById("ModalButton");
  modalButton.classList.toggle("opacity-0");
  const crossButton = document.getElementById("crossButton");
  crossButton.classList.toggle("opacity-100");
}