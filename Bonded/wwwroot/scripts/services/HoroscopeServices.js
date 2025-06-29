var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export function getHorosope(userZodiacSign) {
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
            console.log(result);
            horoscopeText = result;
        }
        catch (error) {
            console.error("Chyba volání Gemini API pro horoskop:", error);
            horoscopeText = "Nastala chyba při načítání horoskopu. Zkuste to prosím později.";
        }
        return horoscopeText;
    });
}
