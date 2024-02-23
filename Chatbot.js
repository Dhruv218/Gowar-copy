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
  .then(res => {
    return res.json();
  })
  .then(data => {
    console.log(data);
    chatRoomID = data.room;
    attachBotMessage({ "data": '{ "message": "Hello! I am Wall-E powered by ChatGPT. How can I help you?", "sender": "bot" }' });
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
  });

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
  supportCountdown.id = "support_countdown"
  supportCountdown.innerHTML = `
  <div class="flex items-end justify-center mt-2 w-full">
    <div class="py-[10px] px-[65px] bg-[#212334] text-center rounded-2xl w-full" id="support_init">
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

function handleNo() {
  const helpfulElements = document.getElementsByClassName("chatbot-helpful");

  Array.from(helpfulElements).forEach((helpfulElement) => {
    helpfulElement.remove();
  });

  const support_init = document.getElementById("support_init");
  support_init.remove();

}



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
        <div class="p-2 bg-gray-100 w-fit text-left rounded-2xl  rounded-bl-none">
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
  const timestamp = new Date().toLocaleTimeString([], {
    hour: "numeric",
    minute: "numeric",
  });
  const support_element = document.getElementById("support_countdown");


  if (agentChat && support_element) {
    support_element.remove();
    const customerSupport = document.createElement("div");
    customerSupport.className = "flex flex-col mb-2 items-center w-full align-middle justify-center";
    customerSupport.innerHTML = `
        <div class="flex items-end justify-center w-full">
          <div class="py-[10px] px-[65px] bg-[#212334] text-center rounded-2xl w-full">
            <p class="text-[#B4B4B4] text-sm">Support executive is on-line
            to help you
            </p>
          </div>
        </div>
        `;
    messages.appendChild(customerSupport);
  }



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
              <div class="px-4 py-3 bg-gray-100 text-left rounded-2xl rounded-bl-none max-w-[250px] w-fit break-words">
                <p>${botPlaceHolder}</p>
              </div>
              <p class="text-white text-[10px] mt-[7.5px]">message from ${botMessageText.sender === "bot" ? "Bot" : "Agent"}
              <span class="text-xs mt-2 text-gray-400 ml-1 text-right">
                  ${timestamp}
              </span>
              </p>
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
      <div class="px-4 py-3 bg-gray-100 w-fit text-left rounded-2xl max-w-[250px] break-words">
        <p>${botMessageText.message}</p>
      </div>
      <p class="text-white text-[10px] mt-[7.5px]">
      message from  ${botMessageText.sender === "bot" ? "Bot" : "Agent"}
      <span class="text-xs mt-2 text-gray-400 ml-1 text-right">
                  ${timestamp}
      </span>
      </p>
      <div class="px-4 py-3  bg-gray-100 w-fit text-left rounded-2xl rounded-bl-none mt-2" id="support_init">
        Do you want to chat with Customer Support?
      </div>
    </div>
    </div>
    <div class="block w-full ps-7 chatbot-helpful">
        <button class="px-3 py-2 border border-[#0BB2C0] text-[#0BB2C0] w-fit text-left rounded-2xl mt-2" onClick="handleYes()">Yes</button>
        <button  class="px-3 py-2  border border-[#0BB2C0] text-[#0BB2C0] w-fit text-left rounded-2xl mt-2" onClick="handleNo()">No</button>
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
    <div class="px-4 py-3 bg-[#0fb4c1] text-right text-white rounded-2xl rounded-br-none w-auto ml-5 max-w-[250px] break-words">
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
