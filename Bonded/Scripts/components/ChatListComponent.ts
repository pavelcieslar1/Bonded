import { getChats } from "../services/ChatServices.js";

type ChatPreview = {
  chatId: number;
  participants: {
    userId: string;
    firstName: string;
    profileImageUrl: string;
  }[];
}


export async function renderChatList() {
    const root = document.getElementById("app-root");
    if (!root) return;

    const chats: ChatPreview[] = await getChats();

    // @ts-ignore
    root.innerHTML = window.DOMPurify.sanitize ( //html
    `
    <h2>Moje konverzace</h2>
    <ul class="list-group">
      ${chats.map((chat: any) => `
        <li class="list-group-item chat-item" data-chat-id="${chat.chatId}">
          💬 ${chat.participants.map((p: any) => p.firstName).join(", ")}
        </li>
      `).join("")}
    </ul>
  `);

    // Event listenery pro klik na konverzaci
    document.querySelectorAll(".chat-item").forEach(el => {
        el.addEventListener("click", () => {
            const chatId = (el as HTMLElement).dataset.chatId;
            if (chatId) {
                window.location.hash = `#chat/${chatId}`;
            }
        });
    });
}
