var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export function getGlobalMatch(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        let data;
        try {
            const currentUserId = userId;
            if (!currentUserId)
                throw new Error("User ID not found in localStorage.");
            const response = yield fetch(`/api/match/global-matches?userId=${currentUserId}`, { method: "GET", credentials: "include", });
            if (response.status === 400) {
                // Uživatel nemá vyplněný dotazník
                const errorData = yield response.text();
                throw new Error(errorData);
            }
            if (!response.ok)
                throw new Error("Failed to fetch global matches");
            data = yield response.json();
        }
        catch (err) {
            console.error("Chyba při hledání shod:", err);
            throw err;
        }
        return data ? data : null;
    });
}
export function getLocalMatch(params) {
    return __awaiter(this, void 0, void 0, function* () {
    });
}
export function getMatchPremium(userAId, userBId) {
    return __awaiter(this, void 0, void 0, function* () {
        let data;
        try {
            const response = yield fetch(`/api/match/premium-match?userAId=${userAId}&userBId=${userBId}`, { method: "GET", credentials: "include", });
            if (response.status === 400) {
                // Uživatel nemá vyplněný dotazník
                const errorData = yield response.text();
                throw new Error(errorData);
            }
            if (response.status === 404) {
                // Uživatel nebyl nalezen nebo nemá vyplněný dotazník
                throw new Error("Pro použití této funkce musíte mít vyplněný dotazník osobnosti.");
            }
            if (!response.ok)
                throw new Error("Failed to fetch premium match");
            data = yield response.json();
            console.log("Match:", data);
        }
        catch (err) {
            console.error("Chyba při hledání shod:", err);
            throw err;
        }
        return data ? data : null;
    });
}
export function getMatch(userAId, userBId) {
    return __awaiter(this, void 0, void 0, function* () {
        let data;
        try {
            const response = yield fetch(`/api/match/matches?userAId=${userAId}&userBId=${userBId}`, { method: "GET", credentials: "include", });
            if (response.status === 400) {
                // Uživatel nemá vyplněný dotazník
                const errorData = yield response.text();
                throw new Error(errorData);
            }
            if (response.status === 404) {
                // Uživatel nebyl nalezen nebo nemá vyplněný dotazník
                throw new Error("Pro použití této funkce musíte mít vyplněný dotazník osobnosti.");
            }
            if (!response.ok)
                throw new Error("Failed to fetch match");
            data = yield response.json();
            console.log("Match:", data);
        }
        catch (err) {
            console.error("Chyba při hledání shod:", err);
            throw err;
        }
        return data ? data : null;
    });
}
