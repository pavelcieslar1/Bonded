var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { checkAuth } from "../Auth.js";
let userProfiles;
export function renderPeopleAroundComponent() {
    return __awaiter(this, void 0, void 0, function* () {
        const root = document.getElementById("app-root");
        if (!root)
            return;
        const user = yield checkAuth();
        if (!user)
            window.location.hash = "#login";
        const res = yield fetch("/api/user/random-users", {
            method: "GET",
            credentials: "include",
        });
        if (!res.ok) {
            window.location.hash = "#error/PAC-404";
            return;
        }
        userProfiles = yield res.json();
        // @ts-ignore
        root.innerHTML = window.DOMPurify.sanitize(//html
        `
    <div class="d-flex justify-content-center align-items-center w-100">
        <div class="w-100 p-4 p-md-5 glass-card m-2 min-dvh-100 " style="max-width: 100%;">
            <a href="#main" id="backBtn" class="btn btn-light rounded-circle shadow"><i class="bi bi-chevron-left"></i></a>
            <div class="row justify-content-center">
                <div class="col">
                    <div class="main-card">
                    
                        <h1 class="text-center mb-3 fw-light text-light">Lidé kolem vás</h1>
                        <div class="row g-4">
                            ${userProfiles
            .map((user) => {
            var _a;
            return `
                                <div class="col">
                                    <div class="nearby-user-card glass-card user-card" data-user-id="${user.id}">
                                        <div>
                                            <img src="${(_a = user.profileImageUrl) !== null && _a !== void 0 ? _a : `https://placehold.co/60x60/87CEEB/ffffff?text=${user.firstName[0] + user.lastName[0]}`}" alt="user-photo" class="nearby-user-avatar">
                                            <div class="nearby-user-name">${user.firstName}, ${user.age}</div>
                                            <div class="nearby-user-details">${user.city}</div>
                                        </div>
                                    </div>
                                </div>
                            `;
        })
            .join("")}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `);
        document.querySelectorAll(".user-card").forEach(card => {
            card.addEventListener("click", () => {
                const userId = card.getAttribute("data-user-id");
                window.location.hash = `#profile/${userId}`;
            });
        });
    });
}
