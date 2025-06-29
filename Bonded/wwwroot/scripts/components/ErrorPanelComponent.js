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
export function renderErrorPage(error) {
    return __awaiter(this, void 0, void 0, function* () {
        const root = document.getElementById("app-root");
        if (!root)
            return;
        const user = yield checkAuth();
        if (!user)
            window.location.hash = "#login";
        // @ts-ignore
        root.innerHTML = window.DOMPurify.sanitize(//html
        `
    <div class="d-flex justify-content-center align-items-center min-vh-100">
        <div class="login-container glass-card d-flex rounded-5 shadow overflow-hidden w-100 flex-column flex-lg-row">
            <div class="error-container text-center p-4 w-100">
                <i class="bi bi-exclamation-triangle-fill error-icon xl-icon"></i>
                <h1 class="display-3 mb-4">Něco se pokazilo!</h1>
                <p class="error-message mb-4 fs-5">
                    Omlouváme se, došlo k neočekávané chybě.
                    Zkuste to prosím znovu za chvíli.
                </p>
                <p class="mb-4 fs-3">Kód chyby: ${error}</p>
                <div class="error-actions">
                    ${(error === null || error === void 0 ? void 0 : error.includes("404-1")) ?
            ` 
                        <a href="#login" class="btn btn-danger">Zpět na úvodní stránku</a>
                        ` :
            ` 
                        <a href="#main" class="btn btn-warning">Zpět na profil</a>
                        `}
                    <a href="" class="btn btn-outline-secondary">Kontaktovat podporu</a>
                </div>
            </div>
        </div>
    </div>
    `);
    });
}
