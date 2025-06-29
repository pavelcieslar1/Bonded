var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export function renderRegister() {
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
                <div class="login-form-panel p-5 d-flex flex-column justify-content-center">
                    <h2 class="fs-1 mb-3 text-center fw-light text-color-5">Přihlášení</h2>
                    <form id="registerForm">
                        <div class="mb-3">
                            <label for="email" class="form-label visually-hidden">E-mail</label>
                            <input type="email" class="form-control my-input-1" id="email" placeholder="E-mail" required>
                        </div>
                        <div class="mb-3">
                            <label for="password" class="form-label visually-hidden">Heslo</label>
                            <input type="password" class="form-control my-input-1" id="password1" placeholder="Heslo" required>
                        </div>
                        <div class="mb-3">
                            <label for="password" class="form-label visually-hidden">Heslo znovu</label>
                            <input type="password" class="form-control my-input-1" id="password2" placeholder="Heslo znovu" required>
                        </div>
                        <div class="d-grid">
                            <button type="submit" class="btn my-btn-1">Zaregistrovat se</button>
                        </div>
                    </form>
                    <div id="regError"></div>
                    <div class="links text-center fs-6 mb-3">
                        <a href="#login">Přihlásit se</a>
                    </div>
                </div>
            </div>
        </div>
        `);
        }
        const errorElem = document.getElementById("regError");
        (_a = document.getElementById("registerForm")) === null || _a === void 0 ? void 0 : _a.addEventListener("submit", handleRegister);
        (_b = document.getElementById("loginBtn")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => {
            window.location.hash = "#login";
        });
        function handleRegister(e) {
            return __awaiter(this, void 0, void 0, function* () {
                e.preventDefault();
                errorElem.textContent = "";
                const email = document.getElementById("email").value.trim();
                const password = document.getElementById("password1").value;
                const password2 = document.getElementById("password2").value;
                const userName = email;
                // Validace
                if (!email || !password || !password2) {
                    errorElem.textContent = "Vyplňte všechny údaje!";
                    return;
                }
                if (!validateEmail(email)) {
                    errorElem.textContent = "Neplatný email!";
                    return;
                }
                if (password.length < 6) {
                    errorElem.textContent = "Heslo musí mít aspoň 6 znaků!";
                    return;
                }
                if (password !== password2) {
                    errorElem.textContent = "Hesla se neshodují!";
                    return;
                }
                // Odeslání na backend
                try {
                    const res = yield fetch("/api/account/register", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email, password, userName })
                    });
                    if (!res.ok) {
                        const data = yield res.json();
                        throw new Error(data[0] || "Registrace se nezdařila.");
                    }
                    // Úspěch
                    alert("Účet byl úspěšně vytvořen! Nyní budete přihlášení.");
                    const res2 = yield fetch("/api/account/login", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email, password, userName })
                    });
                    if (!res.ok) {
                        const data = yield res.json();
                        throw new Error(data[0] || "Přihlášení se nezdařilo.");
                    }
                    else {
                        window.location.hash = "#first-login";
                    }
                }
                catch (e) {
                    errorElem.textContent = e.message || "Chyba při registraci.";
                }
            });
        }
        function validateEmail(email) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        }
    });
}
