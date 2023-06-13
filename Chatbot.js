// chatbot.js
const wss = new WebSocket("wss://s9170.blr1.piesocket.com/v3/1?api_key=wBcoKk96vynh1Z6xI7DNGGjkrsLAKu4agE5ko9Zl&notify_self=1")

let noCount = 0;

function handleNo(e) {
  noCount++;
  console.log("no count: " + noCount);
  if (noCount === 3) {

    const helpfulElements = document.getElementsByClassName("chatbot-helpful");

    Array.from(helpfulElements).forEach((helpfulElement) => {
      helpfulElement.remove();
    });

    const messages = document.getElementById("chatMessages");

    const supportCountdown = document.createElement("div");
    supportCountdown.className = "flex flex-col mb-2 items-end";
    supportCountdown.innerHTML = `
  <div class="flex items-end justify-center  mt-2">
    <div class="p-2 bg-[#212334] text-center  rounded-lg">
      <p class="text-[#B4B4B4] text-sm">Support executive will be assisting 
      you in 
      <span id="chatbot_timer" class="text-[#C73838]">00:15</span>
      </p>
    </div>
  </div>
  `;
    messages.appendChild(supportCountdown);

    const countdownElement = document.querySelector('#chatbot_timer');


    const duration = 5;


    let timer = duration;


    const countdownInterval = setInterval(() => {

      const minutes = Math.floor(timer / 60).toString().padStart(2, '0');
      const seconds = (timer % 60).toString().padStart(2, '0');
      const countdownText = `${minutes}:${seconds}`;


      countdownElement.textContent = countdownText;


      timer--;


      if (timer < 0) {

        clearInterval(countdownInterval);

        countdownElement.parentNode.parentNode.parentNode.parentNode.remove();
        const customerSupport = document.createElement("div");
        customerSupport.className = "flex flex-col mb-2 items-end";
        customerSupport.innerHTML = `
          <div class="flex items-end justify-center w-full">
            <div class="p-2 bg-[#212334] text-center rounded-lg w-full">
              <p class="text-[#B4B4B4] text-sm">Support executive is on-line to help you
              </p>
            </div>
          </div>
          `;
        messages.appendChild(customerSupport);

      }
    }, 1000);
  }
}



wss.addEventListener("open", ws => {
  console.log("websocket connected");
})




function sendMessage(event) {
  event.preventDefault();
  const input = event.target.elements.message;
  const newMessage = input.value.trim();

  // console.log(newMessage)
  // fetch(`ws://13.126.248.19:8000/chatbot?user_input=${newMessage}`)
  //   .then(res => res.json())
  //   .then(data => console.log(data));

  wss.send(newMessage);


  // console.log(botMessage)

  if (newMessage !== "") {
    const messages = document.getElementById("chatMessages");
    const timestamp = new Date().toLocaleTimeString([], {
      hour: "numeric",
      minute: "numeric",
    });

    if (messages.childElementCount > 1) {
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

    const helpfulElements = document.getElementsByClassName("chatbot-helpful");

    Array.from(helpfulElements).forEach((helpfulElement) => {
      helpfulElement.remove();
    });


    wss.addEventListener("message", (data) => {
      let botMessageText = data.data;
      const botMessage = document.createElement("div");
      botMessage.className = "flex flex-col mb-2 items-start";
      botMessage.innerHTML = `
  <div class="flex flex-col items-end justify-center">
    <div class="flex items-end justify-center">
    <img src="./Assets/botImage.png" class="w-5 h-5 rounded-full mr-2 block" alt="" />
    <div class="text-left">
      <div class="p-2 bg-gray-100 w-fit text-left rounded-lg">
        ${botMessageText}
      </div>
      <div class="p-2 bg-gray-100 text-left rounded-lg mt-2">
        Was this answer helpful?
      </div>
    </div>
    </div>
    <div class="block w-full ps-7 chatbot-helpful">
        <button class="px-3 py-2 border border-[#0BB2C0] text-[#0BB2C0] w-fit text-left rounded-lg mt-2">Yes</button>
        <button  class="px-3 py-2  border border-[#0BB2C0] text-[#0BB2C0] w-fit text-left rounded-lg mt-2"  onClick="handleNo()">No</button>
      </div>
    </div>
  
  `;
      messages.appendChild(botMessage);
    })

    input.value = "";
    // <div class="text-xs mt-2 text-gray-400 ml-8 text-left">
    //   ${timestamp}
    // </div>
    console.log(messages);
    setTimeout(scrollToBottom, 500);
  }
}

function scrollToBottom() {
  const scrollToBottomRef = document.getElementById("scrollToBottomRef");
  scrollToBottomRef.scrollIntoView({ behavior: "smooth", block: "end" });
}
// function scrollToBottom() {
//   const messages = document.getElementById("chatMessages");
//   messages.scrollTop = messages.scrollHeight;
// }

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