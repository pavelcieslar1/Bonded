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
import { renderLogin } from "./LoginComponent.js";
export function renderGlobalFeedComponent() {
    return __awaiter(this, void 0, void 0, function* () {
        const root = document.getElementById("app-root");
        if (!root)
            return;
        const user = yield checkAuth();
        if (!user)
            yield renderLogin();
        // @ts-ignore
        root.innerHTML = window.DOMPurify.sanitize(//html
        `
<div class="container-fluid">
        <div class="row justify-content-center">
            <div class="col-12 col-lg-8">
                <div class="main-card">
                    <h1 class="text-center mb-4 fw-bold text-dark">Global Feed</h1>

                    <!-- Karta pro nový příspěvek -->
                    <div class="card post-input-card">
                        <div class="d-flex align-items-center mb-3">
                            <img src="https://placehold.co/50x50/87CEEB/ffffff?text=ME" alt="Můj avatar" class="post-user-avatar me-3">
                            <input type="text" class="form-control rounded-pill py-2 px-3" placeholder="Co máte na srdci, Bonded komunito?">
                        </div>
                        <div class="d-flex justify-content-end">
                            <button class="btn btn-primary">Publikovat</button>
                        </div>
                    </div>

                    <!-- Sekce příspěvků ve feedu -->
                    <div id="feed-posts-container">
                        <!-- Příklad příspěvku -->
                        <div class="card feed-post-card">
                            <div class="d-flex align-items-center">
                                <img src="https://placehold.co/50x50/FFA07A/ffffff?text=K" alt="Avatar" class="post-user-avatar me-3">
                                <div class="post-user-info">
                                    <div class="user-name">Karel Novák</div>
                                    <div class="user-location-time">Praha • před 5 min</div>
                                </div>
                            </div>
                            <p class="post-content">
                                "Krásný den všem! Co dnes podnikáte? Užívám si sluníčko a doufám, že i vy máte skvělý den! 😊"
                            </p>
                            <div class="post-actions">
                                <div class="action-item"><i class="bi bi-heart"></i> 12 Lajků</div>
                                <div class="action-item"><i class="bi bi-chat-text"></i> 3 Komentáře</div>
                            </div>
                        </div>

                        <!-- Další příklad příspěvku -->
                        <div class="card feed-post-card">
                            <div class="d-flex align-items-center">
                                <img src="https://placehold.co/50x50/ADD8E6/ffffff?text=V" alt="Avatar" class="post-user-avatar me-3">
                                <div class="post-user-info">
                                    <div class="user-name">Veronika D.</div>
                                    <div class="user-location-time">Brno • před 1 hod</div>
                                </div>
                            </div>
                            <p class="post-content">
                                "Hledám parťáka na výlet na horách o víkendu! Mám ráda turistiku, ale sama se mi nechce. Někdo se přidá? ⛰️🌲"
                            </p>
                            <div class="post-actions">
                                <div class="action-item"><i class="bi bi-heart"></i> 25 Lajků</div>
                                <div class="action-item"><i class="bi bi-chat-text"></i> 7 Komentářů</div>
                            </div>
                        </div>

                        <!-- Další příklad příspěvku -->
                        <div class="card feed-post-card">
                            <div class="d-flex align-items-center">
                                <img src="https://placehold.co/50x50/DDA0DD/ffffff?text=P" alt="Avatar" class="post-user-avatar me-3">
                                <div class="post-user-info">
                                    <div class="user-name">Petr M.</div>
                                    <div class="user-location-time">Ostrava • včera</div>
                                </div>
                            </div>
                            <p class="post-content">
                                "Užívám si večer u dobré knížky a šálku čaje. Někdo tipy na dobrou fantasy literaturu? 📚☕"
                            </p>
                            <div class="post-actions">
                                <div class="action-item"><i class="bi bi-heart"></i> 18 Lajků</div>
                                <div class="action-item"><i class="bi bi-chat-text"></i> 2 Komentáře</div>
                            </div>
                        </div>

                        <!-- Další příklad příspěvku -->
                        <div class="card feed-post-card">
                            <div class="d-flex align-items-center">
                                <img src="https://placehold.co/50x50/90EE90/ffffff?text=A" alt="Avatar" class="post-user-avatar me-3">
                                <div class="post-user-info">
                                    <div class="user-name">Anna K.</div>
                                    <div class="user-location-time">Plzeň • před 2 hod</div>
                                </div>
                            </div>
                            <p class="post-content">
                                "Kdo se přidá na procházku parkem a pak si dáme zmrzku? Ideální počasí na to! 🍦☀️"
                            </p>
                            <div class="post-actions">
                                <div class="action-item"><i class="bi bi-heart"></i> 8 Lajků</div>
                                <div class="action-item"><i class="bi bi-chat-text"></i> 1 Komentář</div>
                            </div>
                        </div>

                        <!-- Další příklad příspěvku -->
                        <div class="card feed-post-card">
                            <div class="d-flex align-items-center">
                                <img src="https://placehold.co/50x50/FFC0CB/ffffff?text=J" alt="Avatar" class="post-user-avatar me-3">
                                <div class="post-user-info">
                                    <div class="user-name">Jana S.</div>
                                    <div class="user-location-time">Liberec • před 4 hod</div>
                                </div>
                            </div>
                            <p class="post-content">
                                "Dneska super trénink v posilovně! Cítím se skvěle. Kdo taky maká na sobě? 💪"
                            </p>
                            <div class="post-actions">
                                <div class="action-item"><i class="bi bi-heart"></i> 20 Lajků</div>
                                <div class="action-item"><i class="bi bi-chat-text"></i> 5 Komentářů</div>
                            </div>
                        </div>
                    </div>

                    <div class="text-center">
                        <button class="btn btn-outline-primary load-more-btn">Načíst starší příspěvky</button>
                    </div>

                </div>
            </div>
        </div>
    </div>

    `);
    });
}
