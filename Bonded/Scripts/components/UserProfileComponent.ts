import { startChat } from "../services/ChatServices.js";
import { getMatch } from "../services/MatchServices.js";
import { checkAuth } from "../Auth.js";

type UserProfile = {
  id: number;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: string;
  height: number;
  state: string;
  city: string;
  orientation: string;
  etnicity: string;
  religion: string;
  education: string;
  relationshitpStatus: string;
  astralSign: string;
  smoker: string;
  alcohol: string;
  bio: string;
  lookingFor: string;
  hobbyNames: any;
  occupationNames: any;
  profileImageUrl: string;
  categoryScores: any;
};

type MatchData = {
  finalScore: number;
}

let userProfile: UserProfile;
let myProfile: boolean;
export async function renderUserProfile(userId?: string) {
  const root = document.getElementById("app-root");
  if (!root) return;

   const user = await checkAuth();
   if(!user) window.location.hash = "#error/CC-MISSINGUSER-404-1";

   const res = await fetch(userId 
    ? `/api/user/${userId}`   // jiný uživatel
    : `/api/user/me`,        // vlastní profil
    { credentials: "include",
      method: "GET"
    }
  );
  if (!res.ok) {
    window.location.hash = "#error/UPC-404";
    return;
  }
  userProfile = await res.json();
  userId ? myProfile = false : myProfile = true;


  // Helper: procento pro progress bar
  function bar(p: number) {
    return `<div class="profile-bar mb-1"><div class="profile-bar-fill" style="width:${p}%;"></div></div>`;
  }
  // @ts-ignore
  root.innerHTML = window.DOMPurify.sanitize ( //html
    `
        <div class="d-flex justify-content-center align-items-center w-100">
        <div class="container-fluid m-2 min-dvh-100" style="max-width: 100%;">
        <div class="profile-container d-lg-flex  fw-light">
        <div class="profile-left-col mb-2">
            <div class="profile-images-content glass-card">
                <!-- Hlavička profilu (Obrázek s tlačítky zpět/možnosti a překrytím) -->
                <div id="profile-header" class="profile-header" style="background-image: url(${
                  userProfile.profileImageUrl ?? `https://placehold.co/60x60/87CEEB/ffffff?text=${userProfile.firstName[0] + userProfile.lastName[0]}`
                });">
                    <div class="profile-header-overlay"></div>
                    <div class="profile-actions">
                        <button id="backBtn" class="btn btn-light rounded-circle shadow"><i class="bi bi-chevron-left"></i></button>
                    </div>
                    <div class="profile-actions">
                        <button id="start-chat" class="btn btn-light rounded-circle shadow"
                                data-user-id="${userId}" 
                                style="display:${myProfile ? "none" : "inline-block"}">
                                  <i class="bi bi-chat"></i>
                        </button>
                        <button class="btn btn-light rounded-circle shadow" data-bs-toggle="modal" data-bs-target="#user-profile-modal" style="display:${myProfile ? "inline-block" : "none"}" ><i class="bi bi-three-dots-vertical " ></i></button>                     
                    </div>
                </div>
                <!-- Sekce Galerie 
                <div class="gallery-section">
                    <h3 class="section-title position-relative fs-3"><span >Galerie</span>
                    <div class="gallery-items-wrapper">
                        <div class="gallery-item"><img src="https://placehold.co/200x150/FFD700/ffffff?text=Foto+1" alt="Galerie foto 1"></div>
                        <div class="gallery-item"><img src="https://placehold.co/200x150/008080/ffffff?text=Foto+2" alt="Galerie foto 2"></div>
                        <div class="gallery-item"><img src="https://placehold.co/200x150/DA70D6/ffffff?text=Foto+3" alt="Galerie foto 3"></div>
                    </div>
                </div>-->
                <div class="profile-content">
                  <div class="profile-rating-wrapper position-relative">
                      <h1 class="profile-name fw-light fs-1 mb-1">${userProfile.firstName} ${userProfile.lastName}</h1>
                      <p class="profile-age-location mb-3">${getBirthDate(
                        userProfile.dateOfBirth
                      )} let, ${userProfile.city}</p>
                      <div id="resultBtn" class="rating-badge position-absolute top-50 end-0 translate-middle-y mt-5" style="display:${
                        myProfile ? "none" : "initial"
                      }"><i class="bi bi-heart-fill xl-icon ${user.roles.some((role: string) => role === "Admin" || role === "Premium") ? "gemini-text heart-pulse" : "text-color-1 heart-pulse"} "><span id="resultText" class="position-absolute top-50 start-50 translate-middle fs-4 text-light fw-light text-center user-select-none"></span></i></div>
                  </div>

                  <!-- Sekce "O mně" -->
                  <span class="fw-light">${userProfile.firstName} hledá:</span><br>
                  <span class="fw-bold fs-3 text-color-1">${userProfile.lookingFor}</span>
                  ${userProfile.bio ? `
                  <h2 class="section-title mt-4 mb-3 pb-1 fs-3 fw-light">Bio</h2>
                  <p>
                      ${userProfile.bio}
                  </p>
                    ` : ""
                  }
                  <!-- Sekce "Něco o mě" -->
                  <h2 class="section-title mt-4 mb-3 pb-1 fs-3 fw-light">Něco o mě</h2>
                  <div class="tags-container">
                          ${
                            userProfile.education
                              ? `<span class="tag"><i class="bi bi-mortarboard"></i> ${userProfile.education}</span>`
                              : ""
                          }
                          ${
                            userProfile.height
                              ? `<span class="tag"><i class="bi bi-rulers"></i> ${userProfile.height}</span>`
                              : ""
                          }
                          ${
                            userProfile.alcohol
                              ? `<span class="tag"><i class="bi bi-cup-straw"></i> ${userProfile.alcohol}</span>`
                              : ""
                          }
                          ${
                            userProfile.smoker
                              ? `<span class="tag"><i class="bi bi-wind"></i> ${userProfile.smoker}</span>`
                              : ""
                          }
                          ${
                            userProfile.religion
                              ? `<span class="tag"><i class="bi bi-peace"></i> ${userProfile.religion}</span>`
                              : ""
                          }
                          ${
                            userProfile.astralSign
                              ? `<span class="tag"><i class="bi bi-moon-stars"></i> ${userProfile.astralSign}</span>`
                              : ""
                          }
                          ${
                            userProfile.etnicity
                              ? `<span class="tag"><i class="bi bi-globe-americas"></i> ${userProfile.etnicity}</span>`
                              : ""
                          }
                          ${
                            userProfile.orientation
                              ? `<span class="tag"><i class="bi bi-person"></i> ${userProfile.gender}</span>`
                              : ""
                          }
                          ${
                            userProfile.orientation
                              ? `<span class="tag"><i class="bi bi-arrow-through-heart"></i> ${userProfile.orientation}</span>`
                              : ""
                          }
                          ${
                            userProfile.relationshitpStatus
                              ? `<span class="tag"><i class="bi bi-people"></i> ${userProfile.relationshitpStatus}</span>`
                              : ""
                          }
                    </div>
                </div>
            </div>
        </div>

        <!-- Pravý sloupec pro desktop (hlavní obsah) -->
        <div class="profile-right-col ">
            <!-- Obsah profilu -->
            <div class="profile-content glass-card">

                <!-- Sekce "Zájmy a koníčky" -->
                <h2 class="section-title mt-4 mb-3 pb-1 fs-3 fw-light">Zájmy a koníčky</h2>
                <div class="tags-container">
                ${userProfile.hobbyNames
                  .map(
                    (h: any) => `
                            
                                <span class="tag">${h}</span>
                            
                        `
                  )
                  .join("")}
                </div>

                <!-- Sekce "Pracovní pozice" -->
                <h2 class="section-title mt-4 mb-3 pb-1 fs-3 fw-light">Pracovní pozice</h2>
                <div class="tags-container">
                    ${userProfile.occupationNames
                  .map(
                    (h: any) => `
                            
                                <span class="tag">${h}</span>
                            
                        `
                  )
                  .join("")}
                </div>

                <!-- Sekce "Osobnost" (s progress bary) -->
                <h2 class="section-title mt-4 mb-3 pb-1 fs-3 fw-light">Osobnost</h2>
                <div class="progress-section mt-4"> 
                ${userProfile.categoryScores
                  ?.map(
                    (cat: any) => `
                    <div class="progress-item mb-3 align-items-center "> 
                        <p class="progress-label fw-light px-2">${cat.categoryName}</p>
                        <div class="progress-bar-container">
                          <div class="progress-bar-fill" style="width: ${
                          (cat.points / cat.maxPoints) * 100
                        }%;">
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
        <!-- Modal -->
        <div class="modal fade" id="user-profile-modal" tabindex="-1" aria-labelledby="user-profile-label" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content glass-card" id="user-profile-modal-content">
                    <!-- Výchozí obsah -->
                    <div class="modal-header">
                        <h1 class="modal-title fs-5 text-light fw-light" id="user-profile-label">Profile menu</h1>
                    </div>
                    <div class="modal-body" id="user-profile-modal-body">
                        <button class="btn fw-light glass-card fs-4 bg-color-8 w-100" data-bs-toggle="modal" data-bs-target="#upload-modal"><i class="bi bi-upload"></i><span class="mx-3">Change profile photo</span></button> 
                    </div>
                    <div class="modal-footer" id="user-profile-modal-footer">
                        <button type="button" class="btn my-btn-2 shadow" data-bs-dismiss="modal" aria-label="Close">Close</button>
                    </div>
                </div>
            </div>
        </div>
        <!-- Modal -->
        <div class="modal fade" id="upload-modal" tabindex="-1" aria-labelledby="upload-label" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content glass-card bg-color-8" id="upload-modal-content">
                    <!-- Výchozí obsah -->
                    <div class="modal-header">
                        <h1 class="modal-title fs-5 text-color-1 fw-bold" id="upload-label">Upload Image</h1>
                    </div>
                    <div class="modal-body" id="upload-modal-body">
                        <input type="file" class="form-control my_input" id="uploaded-image-url" placeholder="Picture">
                    </div>
                    <div class="modal-footer" id="upload-modal-footer">
                        <button id="confirm-btn-upload" type="button" class="btn my-btn-1 shadow">Upload</button>
                        <button type="button" class="btn my-btn-2 shadow" data-bs-dismiss="modal" aria-label="Close">Close</button>
                    </div>
                </div>
            </div>
        </div>
        </div>
        </div>

  `);

  // Toast notifikace
  const toastContainer = document.createElement('div');
  toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
  toastContainer.style.zIndex = '9999';
  // @ts-ignore
  toastContainer.innerHTML = window.DOMPurify.sanitize(`
    <div id="errorToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="toast-header bg-danger text-white">
        <i class="bi bi-exclamation-circle-fill me-2"></i>
        <strong class="me-auto">Upozornění</strong>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
      </div>
      <div class="toast-body" id="errorToastBody">
        Pro výpočet shody musíte mít vyplněný dotazník osobnosti.
      </div>
    </div>
  `);
  document.body.appendChild(toastContainer);

  const startChatButton = document.getElementById("start-chat");
  if (startChatButton) {
    startChatButton.addEventListener("click", async () => {
      const recipientId = startChatButton.getAttribute("data-user-id");
      if (!recipientId) return;

      const chatId = await startChat(recipientId);
      if (chatId) {
        window.location.hash = `#chat/${chatId}`;
      }
    });
  }


  //ZPĚT NA HLAVNÍ STRÁNKU
  const showMainPageComponent = document.getElementById("backBtn");
  if (showMainPageComponent) {
    showMainPageComponent.addEventListener("click", async () => {
      window.location.hash = "#main";
    });
  }

  //VYPOČITÁNÍ SHODY
  const showMatchButton = document.getElementById("resultBtn");
  const showMatchText = document.getElementById("resultText");
  if (showMatchButton) {
    showMatchButton.addEventListener("click", async () => {
      if(user.roles.some((role: string) => role === "Admin" || role === "Premium")){
        // @ts-ignore
        showMatchText!.innerHTML = window.DOMPurify.sanitize(`
          <div class="spinner-grow text-light" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        `);
        try {
          window.location.hash = "#matching/"+userProfile.id.toString();
          } catch (error) {
            await new Promise(resolve => setTimeout(resolve, 2000));
            renderUserProfile();
            
          } finally {
            showMatchButton.style.pointerEvents = "auto";
          }
      }
      else{
        try {
          const data = await getMatch(userProfile.id.toString(), localStorage.getItem("userId")!);
          if(data === 0 || data === null){
            showToast("Pro výpočet shody musíte mít vyplněný dotazník osobnosti.", "error");
            return;
          }
          // @ts-ignore
          showMatchText!.innerHTML = window.DOMPurify.sanitize(data + "%");
        } catch (error) {
          console.error("Chyba při výpočtu shody:", error);
          // Zobrazit toast notifikaci
          showToast("Pro výpočet shody musíte mít vyplněný dotazník osobnosti.", "error");
        }
      }
    });
  }

  //NAHRÁNÍ PROFILOVÉ FOTKY NA CLOUDINARY A ODKAZ DO DATABAZE
  const fileInput = document.getElementById("uploaded-image-url") as HTMLInputElement;
  const modalBody = document.getElementById("upload-modal-body")!;
  const modalFooter = document.getElementById("upload-modal-footer")!;
  const uploadImage = document.getElementById("confirm-btn-upload");

  uploadImage?.addEventListener("click", async () => {
    if (!fileInput.files || fileInput.files.length === 0) return;

    // @ts-ignore
    modalBody.innerHTML = window.DOMPurify.sanitize(`
        <div class="d-flex justify-content-center my-3"><div class="spinner-border text-light" role="status"></div></div>
        `);
    modalFooter.innerHTML = "";

    const formData = new FormData();
    formData.append("file", fileInput.files[0]);
    formData.append("upload_preset", "profile-pictures");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dczkmh44m/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

    if (!res.ok) throw new Error();

      const data = await res.json();
      const imageUrl = optimizeImage(data.secure_url);

      await fetch("/api/user/profile-photo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl }),
        credentials: "include",
      });

      // @ts-ignore
      modalBody.innerHTML = window.DOMPurify.sanitize(`
        <p class="text-danger text-center">Úspěšně nahráno.</p>
        `);

    setTimeout(() => { location.reload();}, 1000);
    } catch {
        // @ts-ignore
        modalBody.innerHTML = window.DOMPurify.sanitize(`
        <p class="text-danger text-center">Nahrávání selhalo. Zkuste to znovu.</p>
        `);
        // @ts-ignore
        modalFooter.innerHTML = window.DOMPurify.sanitize(`
        <button type="button" class="btn btn-light" data-bs-dismiss="modal">Zavřít</button>
        `);
    }
  });

  function optimizeImage(originalUrl: string): string {
    // Příklad: vloží do URL řetězec pro optimalizaci
    // např. .../upload/ → .../upload/w_300,f_auto,q_auto/
    return originalUrl.replace("/upload/", "/upload/w_500,f_auto,q_auto/");
  }


  function getBirthDate(
    datumNarozeni: Date | string,
    dnesniDatum?: Date | string
  ): number {
    let narozky: Date;
    if (typeof datumNarozeni === "string") {
      narozky = new Date(datumNarozeni);
    } else {
      narozky = datumNarozeni;
    }

    let dnesek: Date;
    if (dnesniDatum === undefined) {
      dnesek = new Date();
    } else if (typeof dnesniDatum === "string") {
      dnesek = new Date(dnesniDatum);
    } else {
      dnesek = dnesniDatum;
    }

    let vek = dnesek.getFullYear() - narozky.getFullYear();
    const mesiceRozdil = dnesek.getMonth() - narozky.getMonth();
    const dnyRozdil = dnesek.getDate() - narozky.getDate();

    // Pokud ještě nebyly narozeniny v tomto roce nebo jsou narozeniny dnes, ale datum je dřívější
    if (mesiceRozdil < 0 || (mesiceRozdil === 0 && dnyRozdil < 0)) {
      vek--;
    }

    return vek;
  }

  // Funkce pro zobrazení toast notifikace
  function showToast(message: string, type: "error" | "success" = "error") {
    const toastElement = document.getElementById("errorToast");
    const toastBody = document.getElementById("errorToastBody");
    
    if (toastElement && toastBody) {
      toastBody.textContent = message;
      const toast = new (window as any).bootstrap.Toast(toastElement);
      toast.show();
    }
  }
}
