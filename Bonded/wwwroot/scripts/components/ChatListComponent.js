var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getChats } from "../services/ChatServices.js";
export function renderChatList() {
    return __awaiter(this, void 0, void 0, function* () {
        const root = document.getElementById("app-root");
        if (!root)
            return;
        const chats = yield getChats();
        // @ts-ignore
        root.innerHTML = window.DOMPurify.sanitize(//html
        `
    <h2>Moje konverzace</h2>
    <ul class="list-group">
      ${chats.map((chat) => `
        <li class="list-group-item chat-item" data-chat-id="${chat.chatId}">
          💬 ${chat.participants.map((p) => p.firstName).join(", ")}
        </li>
      `).join("")}
    </ul>
  `);
        // Event listenery pro klik na konverzaci
        document.querySelectorAll(".chat-item").forEach(el => {
            el.addEventListener("click", () => {
                const chatId = el.dataset.chatId;
                if (chatId) {
                    window.location.hash = `#chat/${chatId}`;
                }
            });
        });
    });
}
