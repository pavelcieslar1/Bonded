var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export function getHoroscope(userZodiacSign) {
    return __awaiter(this, void 0, void 0, function* () {
        let horoscopeText = "";
        try {
            const res = yield fetch("/api/gemini/get-horoscope", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userZodiacSign)
            });
            const result = yield res.text();
            horoscopeText = result;
        }
        catch (error) {
            console.error("Chyba volání Gemini API pro horoskop:", error);
            horoscopeText = "Nastala chyba při načítání horoskopu. Zkuste to prosím později.";
        }
        return horoscopeText;
    });
}
export function getMessageHint(partnerId, chatContent) {
    return __awaiter(this, void 0, void 0, function* () {
        let messageText = "";
        try {
            const res = yield fetch("/api/gemini/get-hint-message", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    partnerId: partnerId,
                    chatContent: chatContent
                })
            });
            const result = yield res.text();
            messageText = result;
        }
        catch (error) {
            console.error("Chyba volání Gemini API pro nápovědu");
            messageText = "Nastala chyba. Zkuste to později.";
        }
        return messageText;
    });
}
