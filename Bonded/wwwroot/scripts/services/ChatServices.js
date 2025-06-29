var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export function getChats() {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield fetch("/api/chat/list", { credentials: "include" });
        if (!res.ok) {
            console.error("Nepodařilo se načíst seznam chatů");
            return [];
        }
        return yield res.json();
    });
}
export function getMessages(chatId) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield fetch(`/api/chat/${chatId}`, { credentials: "include" });
        return res.ok ? yield res.json() : [];
    });
}
export function sendMessage(chatId, content) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield fetch(`/api/chat/${chatId}/message`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(content)
        });
    });
}
export function startChat(recipientId) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield fetch(`/api/chat/start/${recipientId}`, {
            method: "POST",
            credentials: "include"
        });
        if (!res.ok)
            return null;
        const data = yield res.json();
        return data.chatId;
    });
}
