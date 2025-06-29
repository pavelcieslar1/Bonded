import { checkAuth } from "../Auth.js";

export async function renderErrorPage(error? : string){
    const root = document.getElementById("app-root");
    if (!root) return;

    const user = await checkAuth();
    if(!user) window.location.hash = "#login";

    // @ts-ignore
    root.innerHTML = window.DOMPurify.sanitize ( //html
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
                    ${error?.includes("404-1") ? 
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
}