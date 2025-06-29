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
export function renderChatListTile() {
    return __awaiter(this, void 0, void 0, function* () {
        const root = document.getElementById("app-root");
        if (!root)
            return "No chats";
        const chats = yield getChats();
        chats.sort((a, b) => {
            const dateA = a.lastMessage ? new Date(a.lastMessage.sentAt).getTime() : 0;
            const dateB = b.lastMessage ? new Date(b.lastMessage.sentAt).getTime() : 0;
            return dateB - dateA;
        });
        return `
                    <div id="chat-list" class="h-100 glass-card p-3 overflow-hidden rounded-4 scroll-hide">
                        <h5 class="card-title fw-light mb-3 text-dark fs-4">Chaty uživatelů</h5>
                        <div class="chat-list">
                            <!-- Placeholder pro chat zprávy -->
                            ${chats.map((chat) => {
            var _a;
            return `
                                ${chat.lastMessage ? `
                                <div class="chat-card d-flex align-items-center mb-3 my-3 chat-item" data-chat-id="${chat.chatId}"> 
                                    <img src="
                                        ${(_a = chat.participants.map((p) => p.profileImageUrl).join(", ")) !== null && _a !== void 0 ? _a : `https://placehold.co/60x60/87CEEB/ffffff?text=${chat.participants.map((p) => p.firstName[0]).join(", ")}`}" 
                                                class="rounded-circle me-3 circle-image list-user-img shadow" alt="Uživatel">
                                        <div>
                                            <h6 class="mb-0 text-dark">${chat.participants.map((p) => p.firstName).join(", ")}</h6>
                                            <small class="text-nowrap 
                                            ${chat.participants.map((p) => p.userId).join("") == chat.lastMessage.senderId ?
                "text-bold" : "text-muted"}
                                            ">
                                                ${chat.lastMessage ?
                (chat.lastMessage.content.length > 30 ?
                    chat.lastMessage.content.substring(0, 30) + "..." : chat.lastMessage.content) :
                "Žádné zprávy"}
                                            </small>
                                        </div>
                                        <small class="ms-auto text-muted">
                                            ${chat.lastMessage ? new Date(chat.lastMessage.sentAt).toLocaleTimeString("cs-CZ", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }) : ""}
                                        </small>
                                </div>
                                ` : ""}
                            `;
        }).join("")}
                        </div>
                    </div>
    `;
    });
}
;
