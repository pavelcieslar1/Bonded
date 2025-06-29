import { getMessages, sendMessage } from "../services/ChatServices.js"; 
import { checkAuth } from "../Auth.js";
import { getMessageHint } from "../services/GeminiServices.js";

declare var signalR: any;

type ChatMessage = {
  id: number;
  content: string;
  sentAt: string;
  senderId: string;
};

type ChatResponse = {
  chatId: number;
  partner: {
    userId: string;
    name: string;
    image: string;
  };
  messages: ChatMessage[];
};


let connection: any;
let currentChatId: number | null = null;

export async function renderChat(chatId: number) {
    const root = document.getElementById("app-root");
    if (!root) return;

    const user = await checkAuth();
    if(!user) window.location.hash = "#error/CC-MISSINGUSER-404-1";

    const messages: ChatResponse = await getMessages(chatId);
    currentChatId = chatId;

    // Inicializace SignalR připojení
    await initializeSignalR(chatId);

    // @ts-ignore
    root.innerHTML = window.DOMPurify.sanitize ( //html
    `
    <div class="d-flex justify-content-center align-items-center min-dvh-100">
      <div class="glass-card p-md-4 p-2 rounded-4 " style="max-width: 700px; width: 100%;">
          <div class="chat-container">
              <!-- Hlavička chatu -->
              <div class="chat-header">
                  <a href="#main" class="back-btn"><i class="bi bi-caret-left-fill m-icon"></i></a>
                  ${messages.partner.image ? `
                    <img src="${messages.partner.image ? messages.partner.image : "https://placehold.co/60x60/87CEEB/ffffff?text=?"}" alt="profile-image" class="profile-avatar circle-image"> 
                  ` : ""}
                  <div class="user-info">
                      <div class="user-name">${messages.partner.name}</div>
                  </div>
                  <div class="ms-auto d-flex gap-3">
                    <a href="#profile/${messages.partner.userId}" class="text-light"><i class="bi bi-person-fill m-icon"></i></a>
                </div>
              </div>
              <div class="overflow-auto scroll-hide" id="messages-container">
                  ${messages.messages.map((msg: any) => `
                    <div class="chat-messages d-flex flex-column">
                        <div class="message-bubble ${msg.senderId === localStorage.getItem("userId") ? "outgoing-message" : "incoming-message"}">
                            ${msg.content}
                            <div class="message-time">${new Date(msg.sentAt).toLocaleTimeString("cs-CZ", {
                                                                                          day: "2-digit",
                                                                                          month: "2-digit",
                                                                                          year: "numeric",
                                                                                          hour: "2-digit",
                                                                                          minute: "2-digit"
                                                                                        })}</div>
                        </div>
                    </div>
              `).join("")}
              </div>
              <!-- Gemini oblast -->
              <div id="chat-gemini-area" class="chat-gemini-area text-break text-light shadow-lg gemini-area-animated-background " hidden>

              </div>                                                                    
              <!-- Vstupní oblast -->
              <div class="chat-input-area ">
                  <input id="message-input" type="text" class="form-control" placeholder="Napište zprávu..." maxlength="1000">
                  <button id="send-message" class="btn btn-send"><i class="bi bi-send-fill"></i></button>
                  ${user.roles.some((role: string) => role === "Admin" || role === "Premium") ? //html
                    `
                    <button id="gemini-hint" class="btn btn-hint-gemini ms-2 "><img class="gemini-star" src="../assets/blank-gemini-star.png"/></button>
                    `
                    : ""
                  }
              </div>
          </div>
      </div>
    </div>
  `);

  const messagesContainer = document.getElementById("messages-container");
  if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  document.getElementById("send-message")?.addEventListener("click", async () => {
      const input = document.getElementById("message-input") as HTMLInputElement;
      const content = input.value.trim();
      if (!content) return;
      
      // Odešle zprávu přes API SignalR
      await sendMessage(chatId, content);
      input.value = "";
      
      // Přidá zprávu lokálně pro okamžitou odezvu
      addMessageToUI(content, localStorage.getItem("userId") || "", Date.now());
  });

  document.getElementById("message-input")?.addEventListener("keypress", async (e) => {
      if (e.key === "Enter") {
          const input = document.getElementById("message-input") as HTMLInputElement;
          const content = input.value.trim();
          if (!content) return;
          
          await sendMessage(chatId, content);
          input.value = "";
          
          addMessageToUI(content, localStorage.getItem("userId") || "", Date.now());
      }
  });

  document.getElementById("gemini-hint")?.addEventListener("click", async () => {
      const geminiButton = document.getElementById("gemini-hint")!;
      const geminiArea = document.getElementById("chat-gemini-area")!;
      const lastMessages = messages.messages.slice(-10);

      // @ts-ignore
      geminiButton.innerHTML = window.DOMPurify.sanitize(`
        <div class="spinner-grow text-light" role="status" style="width:50px; height:25px">
          <span class="visually-hidden">Loading...</span>
        </div>
      `);

      const chatContent = lastMessages
        .map((msg: ChatMessage) => {
          const senderName = msg.senderId === messages.partner.userId ? messages.partner.name : "Já";
          return `${senderName}: ${msg.content}`;
        })
        .join("\n");

      const message = await getMessageHint(messages.partner.userId, chatContent);
      resetGemini();
      
      geminiArea.hidden = false;
      // @ts-ignore
      geminiArea.innerHTML = window.DOMPurify.sanitize(`
      <p><img class="gemini-star mx-2 mt-2" src="../assets/blank-gemini-star.png"/></p>
      <p class="">${message}</p>
      `);

  });

  const geminiText = document.getElementById("chat-gemini-area");
  if(geminiText){
    geminiText.addEventListener("click", () => {
      const input = document.getElementById("message-input") as HTMLInputElement;
      const cleanedText = geminiText.innerText.replace(/['"]/g, "");
      input.value = cleanedText;
  })
  }

  function resetGemini() {
      const geminiButton = document.getElementById("gemini-hint")!;
      const geminiArea = document.getElementById("chat-gemini-area")!;
      
      // @ts-ignore
      geminiButton.innerHTML = window.DOMPurify.sanitize(`
        <img class="gemini-star" src="../assets/blank-gemini-star.png"/>
      `);

      geminiArea.hidden = false;
      geminiArea.innerHTML = "";
  }
}

async function initializeSignalR(chatId: number) {
    if (connection) {
        await connection.stop();
        connection = null;
    }

    try {
        connection = new signalR.HubConnectionBuilder()
            .withUrl("/chathub?chatId=" + chatId)
            .withAutomaticReconnect([0, 2000, 10000, 30000])
            .build();

        connection.on("ReceiveMessage", (userId: string, message: string, messageId: number, sentAt: string) => {
            // Přidej zprávu pouze pokud není od aktuálního uživatele
            if (userId !== localStorage.getItem("userId")) {
                addMessageToUI(message, userId, new Date(sentAt).getTime());
            }
        });

        connection.onclose((error: any) => {
            console.log("SignalR connection closed:", error);
        });

        await connection.start();
        console.log("SignalR connected successfully");
    } catch (err) {
        console.error("SignalR connection failed:", err);
    }
}

function addMessageToUI(content: string, senderId: string, timestamp: number) {
    const messagesContainer = document.getElementById("messages-container");
    if (!messagesContainer) return;

    const isOutgoing = senderId === localStorage.getItem("userId");
    const messageDiv = document.createElement("div");
    messageDiv.className = "chat-messages d-flex flex-column";
    
    messageDiv.innerHTML = `
        <div class="message-bubble ${isOutgoing ? "outgoing-message" : "incoming-message"}">
            ${content}
            <div class="message-time">${new Date(timestamp).toLocaleTimeString("cs-CZ", {
                day: "2-digit",
                month: "2-digit", 
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            })}</div>
        </div>
    `;

    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}
