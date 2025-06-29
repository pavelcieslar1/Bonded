import { checkAuth } from "../Auth.js";
import { renderGlobalFeedTile } from "../tiles/GlobalFeedTile.js";
import { renderPeopleAroundTile } from "../tiles/PeopleAroundTile.js";
import { renderHoroscopeTile } from "../tiles/HoroscopeTile.js";
import { renderChatListTile } from "../tiles/ChatListTile.js";
import { getHoroscope } from "../services/GeminiServices.js";


type UserProfile = {
  id: number;
  firstName: string;
  lastName: string;
  astralSign: string;
  profileImageUrl: string;
};

let userProfile: UserProfile;

export async function renderMainPage() {

  const root = document.getElementById("app-root");
  if (!root) return;

  const user = await checkAuth();
  if (!user.isAuthenticated) window.location.hash = "#login";

  const res = await fetch("/api/user/me", {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    window.location.hash = "#error/MPC-404";
    return;
  }
  userProfile = await res.json();
  localStorage.setItem("userId", userProfile.id?.toString());

  const globalFeedHtmlString: string = await renderGlobalFeedTile();
  const peopleAroundTile: string = await renderPeopleAroundTile();
  const horoscopeTile: string = await renderHoroscopeTile();
  const chatlist: string = await renderChatListTile();

  // @ts-ignore
  root.innerHTML = window.DOMPurify.sanitize ( //html
    `
    <div class="d-flex justify-content-center align-items-center m-lg-3">
        <div class="w-100 p-4 p-md-5 glass-card m-2 min-dvh-100 " style="max-width: 1200px;">
            <div class="row  justify-content-between align-items-center text-center my-3">
                <div class="col-auto">
                    <div class="d-flex gap-2 align-items-center">
                        <img src="../assets/logo.png" alt="logo" class="img" width="50" />
                        <p class="mb-0 text-light fw-light fs-3">Bonded</p>
                    </div>
                </div>
                <div class="col-auto ">
                    <a href="#profile" id="showPersonalProfile" class="text-color-5 mx-2"><i class="bi bi-person-circle m-icon icon-pointer"></i></a>
                    <a href="#" class="text-color-5 mx-2"  data-bs-toggle="modal" data-bs-target="#main-menu-modal" ><i class="bi bi-gear-fill m-icon"></i></a>
                    ${user.roles.includes("Admin") ?
                    `
                      <a href="#admin" class="text-color-5 mx-2" ><i class="bi bi-box-fill m-icon"></i></a>
                      `
                    : ""
                    }
                </div>
            </div>

            <!-- Nová dlaždice pro "Můj Profil" na vrchu -->
            <div class="row my-4 justify-content-center ">
                <div class="col-12">
                    <div class="glass-card d-flex align-items-center mb-3 p-3">
                        <img src="${userProfile.profileImageUrl ? userProfile.profileImageUrl : 'https://placehold.co/60x60/87CEEB/ffffff?text=KP'}" alt="Můj profil" class="profile-img me-3">
                        <div>
                            <h5 class="mb-0 fw-bold text-dark">${userProfile.firstName} ${userProfile.lastName}</h5>
                            <p class="mb-0 text-muted">${user.roles} ✨</p>
                        </div>
                        <a href="#edit" id="editPersonalProfile" class="ms-auto text-color-1"><i class="bi bi-pencil-square m-icon mx-3"></i></a>
                    </div>
                </div>
            </div>

            <div class="row g-4 justify-content-center">
                <!-- Karta "Chaty uživatelů" -->
                <div class="col-12 col-lg-8">
                    ${chatlist}
                </div>

                <!-- Karta "AI Vyhledávání shody" -->
                <div class="col-12 col-lg-4">
                    <div id="global-search" class="card h-100 glass-card p-3 text-center gemini-card">
                        <div id="test-ai" class="card-body d-flex flex-column justify-content-center align-items-center">
                            <i id="ai-icon" class="bi bi-heart text-light ml-icon "> <img src="./assets/blank-gemini-star.png" alt="gemini-star" class="gemini-star position-absolute"></i>
                            <h5 class="card-title fw-light mb-2 text-light fs-3">AI Vyhledávání shody</h5>
                            <p class="text-light" id="matching-status">Nechte umělou inteligenci najít vaši perfektní shodu!</p>
                        </div>
                    </div>
                </div>

                <!-- Karta "Filtrovat lidi" -->
                <div class="col-lg-4 col-12">
                    <div id="filter" class="card h-100 glass-card p-3 text-center d-flex flex-column justify-content-center align-items-center">
                        <i class="bi bi-person-lines-fill ml-icon text-color-3 mb-2"></i>
                        <h5 class="card-title fw-light fs-3 mb-2 text-dark">Vyhledávání osob</h5>
                        <p class="text-muted text-center pb-3">Poznejte lidi se stejnými zájmy.</p>
                    </div>
                </div>

                <!-- Karta "Lidé kolem" - nahrazuje Statistiky shody -->
                <div class="col-lg-8 col-12">
                    ${peopleAroundTile}
                </div>

                <!-- Karta "Global Feed" - nahrazuje Míra angažovanosti 
                <div class="col-lg-4 col-md-6">
                    ${globalFeedHtmlString};
                </div>-->

                <!-- Karta "Denní Horoskop" -->
                <div class="col-lg-8 col-12">
                    ${horoscopeTile}
                </div>
                
                <!-- Karta "Dotazník osobnosti" - nahrazuje Objevte nové profily -->
                <div class="col-lg-4 col-12">
                    <div id="showQuestionnerBtn" class="card h-100 glass-card p-3 text-center d-flex flex-column justify-content-center align-items-center ">
                        <i class="bi bi-file-person ml-icon text-color-3 mb-2"></i>
                        <h5 class="card-title fw-light fs-3 mb-2 text-dark">Dotazník Osobnosti</h5>
                        <p class="text-center text-muted pb-3">Vyplňte dotazník a najděte svou perfektní osobnostní shodu!</p>
                    </div>
                </div>

            </div>
        </div>
    </div>
    <!-- Modal -->
        <div class="modal fade" id="main-menu-modal" tabindex="-1" aria-labelledby="main-menu-label" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content glass-card">
                <!-- Výchozí obsah -->
                <div class="modal-header">
                    <h1 class="modal-title fs-5 text-light fw-light" id="main-menu-label">Menu</h1>
                </div>
                <div class="modal-body">
                    <button type="button" id="logout-btn" class="btn my-btn-2 fs-5 w-100">Odhlásit se</button>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn my-btn-1" data-bs-dismiss="modal" aria-label="Close">Zavřít</button>
                </div>
                </div>
            </div>
        </div>




    
  `);

  //ODKAZ NA SEZNAM CHATU
  // Event listenery pro klik na konverzaci
  document.querySelectorAll(".chat-item").forEach(el => {
    el.addEventListener("click", () => {
      const chatId = (el as HTMLElement).dataset.chatId;
      if (chatId) {
        window.location.hash = `#chat/${chatId}`;
      }
    });
  });

  //ODKAZ NA DOTAZNÍK
  const showFilterButton = document.getElementById("filter");
  if (showFilterButton) {
    showFilterButton.addEventListener("click", async () => {
      window.location.hash = "#filter"
    })
  }

  //ODKAZ NA DOTAZNÍK
  const showQuestionnerButton = document.getElementById("showQuestionnerBtn");
  if (showQuestionnerButton) {
    showQuestionnerButton.addEventListener("click", async () => {
      window.location.hash = "#questionnaire"
    })
  }

  //ODKAZ NA LIDÉ KOLEM
  const showPeopleAroundButton = document.getElementById("showPeopleAroundBtn");
  if (showPeopleAroundButton) {
    showPeopleAroundButton.addEventListener("click", async () => {
      window.location.hash = "#people-around";
    })
  }

  //ODKAZ NA GLOBAL FEED
  const showGlobalFeedButton = document.getElementById("showGlobalFeedBtn");
  if (showGlobalFeedButton) {
    showGlobalFeedButton.addEventListener("click", async () => {
      window.location.hash = "#global-feed";
    })
  }

  //GLOBÁLNÍ VYHLEDÁVÁNÍ SHOD
  const globalSearchButton = document.getElementById("global-search");
  if (globalSearchButton) {
    globalSearchButton.addEventListener("click", async () => {
      const statusText = document.getElementById("matching-status");
      const heartIcon = document.getElementById("test-ai");

      if (!statusText || !heartIcon) {
        window.location.hash = "#error/MPC-404";
        return;
      }

      heartIcon.classList.add("heart-pulse");
      statusText.textContent = "Vyhledávání nejlepší shody... může to chvíli trvat.";
      globalSearchButton.style.pointerEvents = "none";

      // @ts-ignore
      heartIcon.innerHTML = window.DOMPurify.sanitize(`
    <div class="spinner-grow text-light" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
    <p class="text-light mt-3">Vyhledávání nejlepší shody... může to chvíli trvat.</p>
    `);
      //await new Promise(resolve => setTimeout(resolve, 5000));

      try {
        window.location.hash = "#matching";
      } catch (error) {
        // @ts-ignore
        heartIcon.innerHTML = window.DOMPurify.sanitize(`
      <p class="text-light mt-3">Něco se pokazilo... zkuste to znovu.</p>
      `);
        await new Promise(resolve => setTimeout(resolve, 2000));
        renderMainPage();

      } finally {
        heartIcon.classList.remove("heart-pulse");
        globalSearchButton.style.pointerEvents = "auto";
      }
    });
  }


  //ODHLÁŠENÍ UŽIVATELE
  const logoutBtn = document.getElementById("logout-btn");
  logoutBtn?.addEventListener("click", async (e) => {
    e.preventDefault();

    const res = await fetch("/api/account/logout", {
      method: "POST",
      credentials: "include"
    });

    if (res.ok) {
      console.log("Uživatel byl úspěšně odhlášen");
      await location.reload();
    } else {
      window.location.hash = "#error/MPCL-404"
    }
  });


  const userZodiacSign: string = userProfile.astralSign;
  function toggleHoroscopeLoading(isLoading: boolean): void {
    const loadingSpinner = document.getElementById(
      "horoscopeLoading"
    ) as HTMLElement;
    const showHoroscopeBtn = document.getElementById(
      "showHoroscopeBtn"
    ) as HTMLButtonElement;
    const horoscopeTextElement = document.getElementById(
      "horoscopeText"
    ) as HTMLElement;
    const horoscopeSignElement = document.getElementById(
      "horoscopeSign"
    ) as HTMLElement;

    if (isLoading) {
      if (loadingSpinner) loadingSpinner.style.display = "block";
      if (showHoroscopeBtn) showHoroscopeBtn.disabled = true;
      if (horoscopeTextElement) horoscopeTextElement.textContent = ""; // Clears previous text
      if (horoscopeSignElement)
        horoscopeSignElement.textContent = userZodiacSign;
    } else {
      if (loadingSpinner) loadingSpinner.style.display = "none";
      if (showHoroscopeBtn) showHoroscopeBtn.disabled = false;
    }
  }

  //ZISKÁ AKTUALNI HOROSKOP PRO UŽIVATELE
  const showHoroscopeButton = document.getElementById("showHoroscopeBtn");
  if (showHoroscopeButton) {
    showHoroscopeButton.addEventListener("click", async () => {
      toggleHoroscopeLoading(true);
      const horoscopeTextElement = document.getElementById("horoscopeText") as HTMLElement;

      if (!userZodiacSign) {
        horoscopeTextElement.textContent = "Musíš vyplnit znamení ve svém profilu.";
        toggleHoroscopeLoading(false);
        return;
      }

      try {
        const horoscope: string = (await getHoroscope(userZodiacSign)).toString();
        horoscopeTextElement.textContent = horoscope;
      } catch (error) {
        console.error("Chyba volání Gemini API pro horoskop:", error);
        if (horoscopeTextElement) horoscopeTextElement.textContent = "Nastala chyba při načítání horoskopu. Zkuste to prosím později.";
      } finally {
        toggleHoroscopeLoading(false);
      }
    });
  }
}
