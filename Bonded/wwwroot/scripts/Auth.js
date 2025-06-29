var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export function checkAuth() {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield fetch("/api/account/me", { method: "GET", credentials: "include" });
        if (res.ok) {
            const user = yield res.json();
            console.log("Authorized");
            return user;
        }
        else {
            console.log("unauthorized");
            return null;
        }
    });
}
