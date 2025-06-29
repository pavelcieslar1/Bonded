var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let userProfiles;
export function renderPeopleAroundTile() {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield fetch("/api/user/random-users", {
            method: "GET",
            credentials: "include",
        });
        if (!res.ok) {
            window.location.hash = "#main";
        }
        userProfiles = yield res.json();
        return `

                    <div id="showPeopleAroundBtn" class="card h-100 glass-card p-3 ">
                        <h5 class="card-title fw-light mb-3 text-dark fs-4">Lidé ve vašem okolí</h5>
                        <div class="row row-cols-lg-5 row-cols-md-4 g-2 text-center">
                            ${userProfiles
            .map((user) => {
            var _a;
            return `
                                <div class="col nearby-user">
                                    <img src="${(_a = user.profileImageUrl) !== null && _a !== void 0 ? _a : `https://placehold.co/60x60/87CEEB/ffffff?text=${user.firstName[0] + user.lastName[0]}`}" alt="Profile-image" class="nearby-user-img rounded-circle shadow">
                                    <div class="nearby-user-name">${user.firstName}</div>
                                    <div class="nearby-user-distance">${user.city}</div>
                                </div>
                                
                            `;
        })
            .join("")}
                        </div>
                    </div>

                `;
    });
}
;
