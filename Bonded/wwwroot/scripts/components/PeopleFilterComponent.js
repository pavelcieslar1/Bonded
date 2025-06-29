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
function loadHobbies() {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield fetch("/api/hobby");
        return yield res.json();
    });
}
export function renderPeopleFilterComponent() {
    return __awaiter(this, void 0, void 0, function* () {
        const root = document.getElementById("app-root");
        if (!root)
            return;
        const user = yield checkAuth();
        const hobbies = yield loadHobbies();
        const res = yield fetch("/api/user/me", {
            method: "GET",
            credentials: "include",
        });
        if (!res.ok) {
            window.location.hash = "#error/PFC-404";
            return;
        }
        const userProfile = yield res.json();
        // @ts-ignore
        root.innerHTML = window.DOMPurify.sanitize(//html
        `
    <div class="d-flex justify-content-center align-items-center">
        <div class="w-100 p-md-5 glass-card min-dvh-100" style="max-width: 1200px;">
            <div class="rounded-4" style="width: 100%;">
                <a href="#main" id="backBtn" class="btn btn-light rounded-circle my-3 mx-2"><i class="bi bi-chevron-left"></i></a>
                <div class="main-content-area p-2">
                    <h1 class="text-center mb-3 fs-1 fw-light">Filtrovat uživatele podle koníčků</h1>
                    <div class=" container filter-card mb-3 border-0 p-3 shadow-sm overflow-hidden">
                        <h5 class="fw-bold mb-3 text-dark">Vyberte koníčky k filtrování</h5>
                        <div id="hobbiesCheckboxesContainer" class="hobby-checkbox-container row">
                        ${hobbies
            .map((h) => `
                                    <div class="col-auto mb-2">
                                        <input type="checkbox" class="btn-check hobby-checkbox" id="hobby_${h.id}" autocomplete="off" value="${h.id}">
                                        <label class="btn btn-outline-light" for="hobby_${h.id}">${h.name}</label>
                                    </div>
                                `)
            .join("")}
                        </div>
                        <h5 class="fw-bold mb-3 text-dark my-3 mt-5">Zvolte lokalizaci výběru</h5>
                        <div class="row mb-3 px-3">
                                    <div class="col-lg-6 col-md-6 my-2">
                                        <select class="form-select my_select my-color-primary" id="state" aria-label="select state" ${user.roles.some((role) => role === "Admin" || role === "Premium") ? "" : "disabled"}>
                                            <option selected>${userProfile.state}</option>
                                            <option value="1">Česká Republika</option>
                                            <option value="2">Slovensko</option>
                                        </select>
                                    </div>
                                    <div class="col-lg-6 col-md-6 my-2">
                                        <select class="form-select my_select my-color-primary" id="city" aria-label="select city" ${user.roles.some((role) => role === "Admin" || role === "Premium") ? "" : "disabled"}>
                                            <option selected>${userProfile.city}</option>
                                            <option value="1">Ostrava</option>
                                            <option value="2">Praha</option>
                                            <option value="3">Třinec</option>
                                            <option value="4">Opava</option>
                                            <option value="5">Olomouc</option>
                                        </select>
                                    </div>
                        </div>
                        <div class="d-grid gap-2 col-6 mx-auto my-3">
                            <button class="btn my-btn-1 fs-4 " id="applyFilterBtn">Filtrovat</button>
                        </div>
                    </div>

                    <!-- Sekce pro zobrazení uživatelů -->
                    <div id="userProfilesContainer" class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                        <!-- Zde se budou dynamicky vkládat karty uživatelů -->
                    </div>

                    <div class="text-center mt-4">
                        <p id="noResultsMessage" class="text-muted" style="display: none;">
                            Žádní uživatelé neodpovídají zadaným koníčkům.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `);
        const filterUserButton = document.getElementById("applyFilterBtn");
        filterUserButton === null || filterUserButton === void 0 ? void 0 : filterUserButton.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
            const hobbies = Array.from(document.querySelectorAll(".hobby-checkbox:checked")).map((el) => parseInt(el.value));
            console.log(hobbies);
            const city = document.getElementById("city")
                .selectedOptions[0].text;
            const state = document.getElementById("state")
                .selectedOptions[0].text;
            const currentUserId = localStorage.getItem("userId");
            const result = yield fetchFilteredUsers(city, state, hobbies, currentUserId);
            renderUserProfiles(result);
        }));
        function fetchFilteredUsers(city, state, hobbyIds, currentUserId) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!currentUserId)
                    return;
                const params = new URLSearchParams();
                if (city)
                    params.append("city", city);
                if (state)
                    params.append("state", state);
                if (currentUserId)
                    params.append("currentUserId", currentUserId);
                hobbyIds.forEach((id) => params.append("hobbyIds", id.toString()));
                const response = yield fetch(`/api/user/filter?${params.toString()}`);
                if (!response.ok)
                    throw new Error("Chyba při načítání uživatelů");
                return yield response.json();
            });
        }
        // Funkce pro vykreslení uživatelských karet:
        function renderUserProfiles(users) {
            const container = document.getElementById("userProfilesContainer");
            if (!container)
                return;
            // Smaž předchozí profily
            container.innerHTML = "";
            if (users.length === 0) {
                // @ts-ignore
                container.innerHTML = window.DOMPurify.sanitize(`<div class="col"><div class="alert alert-warning text-center">Nenalezen žádný uživatel podle zadaných kritérií.</div></div>`);
                return;
            }
            users.forEach((user) => {
                user.hobbyNames.length > 0
                    ? (container.innerHTML += // @ts-ignore
                        window.DOMPurify.sanitize(`
                        <div class="col mb-4">
                            <div class="card user-profile-card glassy text-center p-2 h-100 flex-column justify-content-between d-flex shadow-sm" data-chat-id="${user.id}">
                                <div>
                                    <img src="${user.profileImageUrl ||
                            "https://placehold.co/60x60/87CEEB/ffffff?text=?"}" alt="" class="profile-avatar mb-2" style="width:80px; height:80px; border-radius:50%;">
                                    <div class="user-name-age fw-semibold">${user.firstName || ""} ${user.lastName || ""}</div>
                                    <div class="user-location text-muted mb-2"><i class="bi bi-geo-alt-fill me-1"></i>${user.city || ""}</div>
                                </div>
                                <div class="hobbies-list mt-2">
                                    ${user.hobbyNames && user.hobbyNames.length
                            ? user.hobbyNames
                                .map((h) => `<span class="badge rounded-pill text-bg-light mx-1 mb-1">${h}</span>`)
                                .join("")
                            : '<span class="text-muted">Bez vyplněných koníčků</span>'}
                                </div>
                            </div>
                        </div>
                    `))
                    : "";
            });
            loadUserTiles();
        }
        function loadUserTiles() {
            document.querySelectorAll(".user-profile-card").forEach((el) => {
                el.addEventListener("click", () => {
                    const chatId = el.dataset.chatId;
                    if (chatId) {
                        window.location.hash = `#profile/${chatId}`;
                    }
                });
            });
        }
    });
}
