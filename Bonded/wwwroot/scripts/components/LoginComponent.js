var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { startStaticHeartEffect } from "../HearthEffect.js";
export function renderLogin() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const root = document.getElementById("app-root");
        if (root) {
            // @ts-ignore
            root.innerHTML = window.DOMPurify.sanitize(//html
            `
      
        <div class="d-flex justify-content-center align-items-center min-vh-100">
            <div class="login-container d-flex rounded-5 shadow overflow-hidden w-100 flex-column flex-lg-row">
                <div class="info-panel p-5 d-flex flex-column align-items-center text-center justify-content-center bg-color-2 text-color-1">
                    <div class="logo-section d-flex flex-column align-items-center mb-2">
                        <div class="d-flex align-items-center">
                            <i class="bi bi-heart l-icon"></i>
                            <h1 class="app-title mb-0 fs-1 fw-light mx-2">Bonded</h1>
                        </div>
                    </div>
                    <p class="tagline mt-1 fs-5 text-color-1">
                        Najděte spřízněnou duši, objevte společné zájmy a vybudujte trvalé vztahy.
                        Naše inteligentní algoritmy vám pomohou najít ideálního partnera,
                        který se k vám dokonale hodí. Připojte se ještě dnes a začněte svou cestu lásky!
                    </p>
                    <div class="d-flex  mt-2">
                        <span class="text-color-5">Powered by Gemini AI</span>
                        <img class="gemini-star-colored" alt="Gemini Logo" style="height: 24px;">
                    </div>
                </div>

                <!-- Formulářový panel -->
                <div class="login-form-panel p-5 d-flex flex-column justify-content-center position-relative">
                    <!-- Testovací účty ikonka -->
                    <div class="position-absolute top-0 end-0 m-3">
                        <i class="bi bi-info-circle-fill text-color-5 fs-4" 
                           data-bs-toggle="tooltip" 
                           data-bs-placement="left"
                           data-bs-html="true"
                           title="<strong>Testovací účty:</strong><br>
                                  <strong>Admin:</strong> na dotaz<br>
                                  <strong>Premium:</strong> tereza@tereza.cz / Tereza123456.<br>
                                  <strong>Standard:</strong> pavel@pavel.cz / Pavel123456.">
                        </i>
                    </div>
                    
                    <h2 class="fs-1 mb-3 text-center fw-light text-color-5">Přihlášení</h2>
                    <form id="loginForm">
                        <div class="mb-3">
                            <label for="email" class="form-label visually-hidden">E-mail</label>
                            <input type="email" class="form-control my-input-1" id="email" placeholder="E-mail" required>
                        </div>
                        <div class="mb-3">
                            <label for="password" class="form-label visually-hidden">Heslo</label>
                            <input type="password" class="form-control my-input-1" id="password" placeholder="Heslo" required>
                        </div>
                        <div class="d-grid">
                            <button id="loginBtn" type="submit" class="btn my-btn-1">Přihlásit se</button>
                        </div>
                    </form>
                    <div id="regError"></div>
                    <div class="links text-center fs-6">
                        <a href="#">Zapomněli jste heslo?</a><br>
                        <a href="#register">Nemáte účet? Zaregistrujte se</a>
                    </div>
                </div>
            </div>
        </div>
    
        `);
            startStaticHeartEffect();
        }
        (_a = document.getElementById("regBtn")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
            window.location.hash = "#register";
        });
        const errorElem = document.getElementById("regError");
        (_b = document.getElementById("loginForm")) === null || _b === void 0 ? void 0 : _b.addEventListener("submit", handleLogin);
        function handleLogin(e) {
            return __awaiter(this, void 0, void 0, function* () {
                e.preventDefault();
                errorElem.textContent = "";
                const loginButton = document === null || document === void 0 ? void 0 : document.getElementById("loginBtn");
                const email = document.getElementById("email").value.trim();
                const password = document.getElementById("password").value;
                const userName = email;
                // Validace
                if (!email || !password) {
                    errorElem.textContent = "Vyplňte všechny údaje!";
                    return;
                }
                // Odeslání na backend
                try {
                    // @ts-ignore
                    loginButton.innerHTML = window.DOMPurify.sanitize(`
            <div class="spinner-border text-light" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            `);
                    const res = yield fetch("/api/account/login", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email, password, userName })
                    });
                    if (!res.ok) {
                        const data = yield res.json();
                        throw new Error(data[0] || "Přihlášení se nezdařilo.");
                    }
                    // Úspěch
                    loginButton.innerHTML = "Přihlásit se";
                    window.location.hash = "#main";
                }
                catch (e) {
                    loginButton.innerHTML = "Přihlásit se";
                    errorElem.textContent = "Chyba při přihlášení.";
                }
            });
        }
        // Inicializace Bootstrap tooltipů
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new window.bootstrap.Tooltip(tooltipTriggerEl);
        });
    });
}
