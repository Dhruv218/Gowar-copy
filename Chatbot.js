var agentChat = false;
var showSupportOption = false;
var generatingMessage = true;
var chatRoomID;
var wss;
var hostURL = "https://test.gowarranty.in"
// var hostURL = "http://localhost:8000"

var hostURLWebSocket = "wss://test.gowarranty.in"
// var hostURLWebSocket = "ws://localhost:8000"

fetch(`${hostURL}/chat/room/`)
  .then(res => res.json())
  .then(data => {
    console.log(data);
    chatRoomID = data.room;
    attatchBotMessage({ "data": '{ "message": "Hello! I am Wall-E powered by ChatGPT. How can I help you?", "sender": "bot" }' })
  })
connectWebSocket();

function handleYes(e) {

  showSupportOption = false;
  fetch(`${hostURL}/chat/join-agent-by-choice/?room_name=${chatRoomID}`)


  const helpfulElements = document.getElementsByClassName("chatbot-helpful");

  Array.from(helpfulElements).forEach((helpfulElement) => {
    helpfulElement.remove();
  });
  agentChat = true
  const messages = document.getElementById("chatMessages");

  const supportCountdown = document.createElement("div");
  supportCountdown.className = "flex flex-col mb-2 items-end w-full align-middle justify-center";
  supportCountdown.innerHTML = `
  <div class="flex items-end justify-center mt-2 w-full">
    <div class="p-2 bg-[#212334] text-center rounded-lg w-[14.5rem]" id="support_init">
      <p class="text-[#B4B4B4] text-sm">Support executive will be assisting 
      you in \n
      <span id="chatbot_timer" class="text-[#C73838]">\n2 Minutes</span>
      
      </p>
    </div>
  </div>
  `;
  messages.appendChild(supportCountdown);

  const countdownElement = document.querySelector("#chatbot_timer");
  const duration = 2000;
  var timer = duration;
  const countdownInterval = setInterval(() => {
    timer--;

    if (timer < 0) {
      clearInterval(countdownInterval);

      countdownElement.parentNode.parentNode.parentNode.parentNode.remove();
      const customerSupport = document.createElement("div");
      customerSupport.className = "flex flex-col mb-2 items-end";
      customerSupport.innerHTML = `
          <div class="flex items-end justify-center w-[12.5rem]">
            <div class="p-2 bg-[#212334] text-center rounded-lg w-full">
              <p class="text-[#B4B4B4] text-sm">Support executive is on-line to help you
              </p>
            </div>
          </div>
          `;
      messages.appendChild(customerSupport);
    }
  }, 100);
}

function checkMessage(userInput) {
  const lowerUserInput = userInput.toLowerCase();
  const foundKeyword = keywords.find((keyword) =>
    lowerUserInput.includes(keyword.toLowerCase())
  );

  return !!foundKeyword;
}


const messages = document.getElementById("chatMessages");



function addTyping() {
  const messages = document.getElementById("chatMessages");
  const typingAnimation = document.createElement("div");
  typingAnimation.setAttribute("id", "typing");
  typingAnimation.className = "flex flex-col mb-2 items-start";
  typingAnimation.innerHTML = `
  <div class="flex flex-col items-end justify-center">
    <div class="flex items-end justify-center">
      <img src="./Assets/botImage.png" class="w-5 h-5 rounded-full mr-2 block" alt="Bot" />
      <div class="text-left pe-9">
        <div class="p-2 bg-gray-100 w-fit text-left rounded-lg  rounded-bl-none">
          <div class="flex">
            <div class="w-[10px] h-[10px] bg-[#D9D9D9] rounded-full mr-1 animate-wave-1"></div>
            <div class="w-[10px] h-[10px] bg-[#D9D9D9] rounded-full mr-1 animate-wave-2"></div>
            <div class="w-[10px] h-[10px] bg-[#D9D9D9] rounded-full animate-wave-3"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
`;
  messages.appendChild(typingAnimation);
}

function removeTyping() {
  const typingDiv = document.getElementById("typing");
  if (typingDiv && typingDiv.parentNode) {
    typingDiv.parentNode.removeChild(typingDiv);
  }
}

function attatchBotMessage(data) {
  console.log("inside message event");
  removeTyping();
  let botMessageText = JSON.parse(data.data);
  console.log(data);
  const botMessage = document.createElement("div");
  botMessage.className = "flex flex-col mb-2 items-start";
  let botPlaceHolder = botMessageText.message;
  console.log(botPlaceHolder)
  if (typeof botPlaceHolder.text !== "undefined") {
    botPlaceHolder = botPlaceHolder.text;
  }
  if (!showSupportOption || agentChat) {
    botMessage.innerHTML = `
          <div class="flex flex-col items-end justify-center">
            <div class="flex items-end justify-center">
            <img src="./Assets/botImage.png" class="w-5 h-5 rounded-full mr-2 block" alt="Bot" />
            <div class="text-left pe-9">
              <div class="p-2 bg-gray-100 w-fit text-left rounded-lg rounded-bl-none">
                <p>${botPlaceHolder}</p>
              </div>
              <p class="text-white text-[10px] mt-[7.5px]">message from ${botMessageText.sender === "bot" ? "Bot" : "Agent"}</p>
            </div>
            </div>
            </div>
          `;
    messages.appendChild(botMessage);
  } else {
    botMessage.innerHTML = `
  <div class="flex flex-col items-end justify-center">
    <div class="flex items-end justify-center">
    <img src="./Assets/botImage.png" class="w-5 h-5 rounded-full mr-2 block" alt="Bot" />
    <div class="text-left pe-9">
      <div class="p-2 bg-gray-100 w-fit text-left rounded-lg">
        <p>${botMessageText.message}</p>
      </div>
      <p class="text-white text-[10px] mt-[7.5px]">message from  ${botMessageText.sender === "bot" ? "Bot" : "Agent"}</p>
      <div class="p-2 bg-gray-100 w-fit text-left rounded-lg rounded-bl-none mt-2">
        Do you want to chat with Customer Support?
      </div>
    </div>
    </div>
    <div class="block w-full ps-7 chatbot-helpful">
        <button class="px-3 py-2 border border-[#0BB2C0] text-[#0BB2C0] w-fit text-left rounded-lg mt-2" onClick="handleYes()">Yes</button>
        <button  class="px-3 py-2  border border-[#0BB2C0] text-[#0BB2C0] w-fit text-left rounded-lg mt-2">No</button>
      </div>
    </div>
  
  `;
    messages.appendChild(botMessage);
  }
  setTimeout(scrollToBottom, 500);
}

function sendMessage(event) {
  event.preventDefault();
  const input = event.target.elements.message;
  const newMessage = input.value.trim();

  if (checkMessage(newMessage)) {
    showSupportOption = true;
  } else {
    showSupportOption = false;
  }
  if (wss && wss.readyState === WebSocket.OPEN) {
    wss.send(
      JSON.stringify({
        message: newMessage,
        sender: "visitor",
        pk: 0,
      })
    );
  }

  console.log("send message called");
  if (newMessage !== "") {
    const timestamp = new Date().toLocaleTimeString([], {
      hour: "numeric",
      minute: "numeric",
    });

    if (messages.childElementCount > 2) {
      messageContainer = document.getElementById("messageContainer");
      messageContainer.classList.remove("flex");
    }

    const userMessage = document.createElement("div");
    userMessage.className = "flex flex-col mb-2 items-end";
    userMessage.innerHTML = `
  <div class="flex items-end justify-center">
    <img src="./Assets/botImage.png" class="w-5 h-5 rounded-full mr-2 hidden" alt="bot" />
    <div class="ps-9">
    <div class="p-2 bg-cyan-500 text-right text-white rounded-lg rounded-br-none w-auto ml-5">
      <p>${newMessage}</p>
    </div>
    </div>
  </div>
  <div class="text-xs mt-2 text-gray-400 ml-8 text-right">
    ${timestamp}
  </div>
  `;
    messages.appendChild(userMessage);
    addTyping();

    const helpfulElements = document.getElementsByClassName("chatbot-helpful");

    Array.from(helpfulElements).forEach((helpfulElement) => {
      helpfulElement.remove();
    });

    input.value = "";
    console.log(messages);
    setTimeout(scrollToBottom, 500);
  }
}

function scrollToBottom() {
  const scrollToBottomRef = document.getElementById("scrollToBottomRef");
  scrollToBottomRef.scrollIntoView({ behavior: "smooth", block: "end" });
}

function connectWebSocket() {
  console.log("Connecting");

  wss = new WebSocket(
    `${hostURLWebSocket}/ws/chat/${chatRoomID}/`
  );

  wss.addEventListener("open", () => {
    console.log("WebSocket connected");
  });

  wss.addEventListener("message", (data) => {
    timer = 0;
    attatchBotMessage(data);
  });

  wss.addEventListener("close", () => {
    connectWebSocket()
  });
}


function toggleChatbot() {
  // Function to establish a WebSocket connection
  if (!wss || wss.readyState === WebSocket.CLOSED) {
    // WebSocket is not defined or closed, establish a new connection
    removeTyping()
    if (!chatRoomID) {
      fetch(`${hostURL}/chat/room/`)
        .then(res => res.json())
        .then(data => {
          console.log(data);
          chatRoomID = data.room;
        })
    }
    connectWebSocket();
  };


  // Rest of your code for toggling the chatbot container
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
