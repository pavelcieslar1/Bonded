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
import { getGlobalMatch, getMatchPremium } from "../services/MatchServices.js";
export function renderMatchComponent(partnerId) {
    return __awaiter(this, void 0, void 0, function* () {
        const root = document.getElementById("app-root");
        if (!root)
            return;
        const user = yield checkAuth();
        if (!user)
            window.location.hash = "#login";
        const userId = localStorage.getItem("userId");
        if (!userId)
            window.location.hash = "#error/UID-404";
        let partnerProfilesData;
        let isPremium = false;
        if (partnerId && user.roles.some((role) => role === "Admin" || role === "Premium")) {
            partnerProfilesData = yield getMatchPremium(userId, partnerId);
            isPremium = true;
            console.log("premium-matching");
        }
        else if (!partnerId) {
            console.log("matching");
            try {
                partnerProfilesData = yield getGlobalMatch(userId);
            }
            catch (error) {
                console.error("Chyba při načítání matchů:", error);
                // Nejprve vyrenderujeme stránku s toast notifikací
                // @ts-ignore
                root.innerHTML = window.DOMPurify.sanitize(`
                <div class="d-flex justify-content-center align-items-center">
                    <div class="glass-card p-3 p-md-4 rounded-4 w-100 min-dvh-100" style="max-width: 1250px;">
                        <a href="#main" id="backBtn" class="btn btn-light rounded-circle shadow"><i class="bi bi-chevron-left"></i></a>
                        <h1 class="fw-light text-center mb-4 py-3 display-4">Vaše nejlepší shody</h1>
                        <div class="text-center">
                            <p class="fs-5 text-muted">Chyba při načítání shod.</p>
                            <p class="fs-5 text-muted">Prosím zkontrolujte zda máte vyplněný dotazník osobnosti.</p>
                        </div>
                    </div>
                </div>

                <!-- Toast notifikace -->
                <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 9999;">
                    <div id="errorToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
                        <div class="toast-header bg-danger text-white">
                            <i class="bi bi-exclamation-circle-fill me-2"></i>
                            <strong class="me-auto">Upozornění</strong>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
                        </div>
                        <div class="toast-body" id="errorToastBody">
                            Pro použití globálního vyhledávání shod musíte mít vyplněný dotazník osobnosti.
                        </div>
                    </div>
                </div>
            `);
                // Zobrazit toast
                setTimeout(() => {
                    const toastElement = document.getElementById("errorToast");
                    if (toastElement) {
                        const toast = new window.bootstrap.Toast(toastElement);
                        toast.show();
                    }
                }, 100);
                // Vrátit se na hlavní stránku po 4 sekundách
                setTimeout(() => {
                    window.location.hash = "#main";
                }, 4000);
                return;
            }
        }
        else {
            console.log("no-matching");
            window.location.hash = "#error/MC-NOAUTH";
            return;
        }
        if (!partnerProfilesData)
            return;
        partnerProfilesData.forEach((item) => {
            if (item.finalScore === 0) {
                window.location.hash = "#error/chyba-dotazniku";
            }
        });
        // @ts-ignore
        root.innerHTML = window.DOMPurify.sanitize(//html
        `
    <div class="d-flex justify-content-center align-items-center">
    <div class="glass-card p-3 p-md-4 rounded-4 w-100 min-dvh-100" style="max-width: 1250px;">
        <a href="#main" id="backBtn" class="btn btn-light rounded-circle shadow"><i class="bi bi-chevron-left"></i></a>
            <h1 class="fw-light text-center  mb-4 py-3 display-4">${isPremium ? `Analýza vztahu` : `Vaše nejlepší shody`}</h1>
            <div id="top-matches-container" class="row row-cols-1 ${isPremium ? `row-cols-lg-1` : `row-cols-lg-2`} g-4 align-items-start">
                <!-- Data pro simulaci partnerů -->
                ${partnerProfilesData
            .map((partner) => //html 
         `
                        <div class="col">
                            <div class="glass-card p-3 text-center d-flex flex-column justify-content-between h-100 ">
                               <div class="profile-actions">
                                    <a href="#profile/${partner.bProfileDTO.id}" id="backBtn" class="btn btn-light rounded-circle shadow"><i class="bi bi-person-fill"></i></a>
                                </div>
                                <div>
                                    <img src="${partner.bProfileDTO.profileImageUrl ? partner.bProfileDTO.profileImageUrl : `https://placehold.co/250x250/87CEEB/ffffff?text=${partner.bProfileDTO.firstName[0] + partner.bProfileDTO.lastName[0]}`}" alt="${partner.bProfileDTO.firstName}" class="rounded-circle border border-light match-image shadow">
                                    <h2 class="my-3 fs-1 fw-light">${partner.bProfileDTO.firstName} ${partner.bProfileDTO.lastName}</h2>
                                    <p class="fs-4 mb-4"><i class="bi bi-geo-alt-fill me-1"></i>${partner.bProfileDTO.city}</p>
                                    <div class="match-percentage fs-1 my-color-primary">${partner.finalScore}%</div>
                                    
                                    ${partner.strongCategories.length > 0 ? `
                                    <div class="row text-start gap-1 mx-2">
                                        <h4 class="fs-2 fw-light my-3">Silné hodnoty</h4>
                                        ${partner.strongCategories
            .map((h) => `   
                                                <div class="col-auto pill p-2 my-bg-success text-light fs-5 text-nowrap">${h}</div>
                                                    `)
            .join("")}
                                    </div>
                                    ` : ""}
                                    
                                    ${partner.weakCategories.length > 0 ? `
                                    <div class="row text-start gap-1 mx-2">
                                        <h4 class="fs-2 fw-light my-3">Slabé hodnoty</h4>
                                        ${partner.weakCategories
            .map((h) => ` 
                                                <div class="col-auto pill p-2 my-bg-danger text-light fs-5 text-nowrap">${h}</div>
                                                    `)
            .join("")}
                                    </div>
                                    ` : ""}
                                    
                                    ${partner.sharedHobbies.length > 0 ? `
                                    <div class="row text-start gap-1 mx-2">
                                        <h4 class="fs-2 fw-light my-3">Společné zájmy</h4>
                                        ${partner.sharedHobbies
            .map((h) => ` 
                                                    <div class="col-auto pill py-1 px-2 my-bg-success text-light fs-5 text-nowrap">${h}</div>
                                                    `)
            .join("")}
                                    </div>
                                      ` : ""}
                                    
                                    
                                    ${partner.conflictingHobbies.length > 0 ? `
                                    <div class="row text-start gap-1 mx-2">
                                        <h4 class="fs-2 fw-light my-3">Rozdílné zájmy</h4>
                                        ${partner.conflictingHobbies
            .filter((h, idx, arr) => arr.findIndex(x => x.hobbyB.toLowerCase() === h.hobbyB.toLowerCase()) === idx).map((h) => ` 
                                                    <div class="col-auto pill py-1 px-2 bg-color-3 text-light fs-5 text-nowrap">${h.hobbyB}</div>  
                                                    `)
            .join("")}
                                    </div>
                                        ` : ""} 
    
                                    <div class="about-section my-4 fs-5 text-start mx-2">
                                        <h4 class="fs-2 fw-light my-3">O mně</h4>
                                        <p class="fw-light">${partner.bProfileDTO.bio}</p>
                                    </div>
                                </div>
                                <!-- Žádné tlačítko pro detaily - informace jsou přímo zde -->
                                <!-- AI analyza -->
                                <div class="gemini-card p-3 text-center d-flex flex-column text-light glassy">
                                    <h4 class=" fs-5">AI Analýza</h4>
                                    <span class="fw-light">${partner.geminiSummary}</span>
                                    <span class="fs-4 text-center my-3">Powered by Gemini AI <img src="./assets/blank-gemini-star.png" alt="gemini-star" class="gemini-star"></span>
                                    
                                </div>
                            </div>
                        </div>
                            
                        `)
            .join("")}
            </div>
        </div>
    </div>
    `);
    });
}
