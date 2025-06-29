import { checkAuth } from "../Auth.js";

type UserProfile = {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  city: string;
  profileImageUrl: string;
};

let userProfiles : UserProfile[];
export async function renderPeopleAroundComponent() {
    const root = document.getElementById("app-root");
    if (!root) return;

    const user = await checkAuth();
    if(!user) window.location.hash = "#login";

    const res = await fetch("/api/user/random-users", {
    method: "GET",
    credentials: "include",
    });
    if (!res.ok) {
        window.location.hash = "#error/PAC-404";
        return;
    }
    userProfiles = await res.json();

    // @ts-ignore
    root.innerHTML = window.DOMPurify.sanitize ( //html
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
                            .map(
                                (user: UserProfile) => `
                                <div class="col">
                                    <div class="nearby-user-card glass-card user-card" data-user-id="${user.id}">
                                        <div>
                                            <img src="${user.profileImageUrl ?? `https://placehold.co/60x60/87CEEB/ffffff?text=${user.firstName[0] + user.lastName[0]}`}" alt="user-photo" class="nearby-user-avatar">
                                            <div class="nearby-user-name">${user.firstName}, ${user.age}</div>
                                            <div class="nearby-user-details">${user.city}</div>
                                        </div>
                                    </div>
                                </div>
                            `
                            )
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
}