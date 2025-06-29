import { renderUserProfile } from "./components/UserProfileComponent.js";
import { renderChat } from "./components/ChatComponent.js";
import { renderChatList } from "./components/ChatListComponent.js";
import { renderLogin } from "./components/LoginComponent.js";
import { renderRegister } from "./components/RegisterComponent.js";
import { renderFirstLogin } from "./components/FirstLoginComponent.js";
import { renderQuestionnaire } from "./components/QuestionnaireComponent.js";
import { renderMainPage } from "./components/MainPageComponent.js";
import { checkAuth } from "./Auth.js";
import { renderGlobalFeedComponent } from "./components/GlobalFeedComponent.js";
import { renderPeopleAroundComponent } from "./components/PeopleAroundComponent.js";
import { renderMatchComponent } from "./components/MatchComponent.js";
import { renderPeopleFilterComponent } from "./components/PeopleFilterComponent.js";
import { renderAdminPanel } from "./components/AdminPanelComponent.js";
import { renderErrorPage } from "./components/ErrorPanelComponent.js";

// Hlavní router
async function handleRouting() {

  const user = await checkAuth();
  const hash = window.location.hash || "#login";

  // Ověření přístupu
  if (!user && hash !== "#register") {
    await renderLogin();
    window.location.hash = "#login";
    return;
  }

  if (hash.startsWith("#profile/")) {
    const userId = hash.split("/")[1];
    await renderUserProfile(userId);
    return;
    }

  if (hash.startsWith("#chat/")) {
    const chatId = parseInt(hash.split("/")[1]);
    if (!isNaN(chatId)) {
        await renderChat(chatId);
        return;
      }
  }

  if(hash.startsWith("#error/")) {
    const error = hash.split("/")[1];
    await renderErrorPage(error);
    return
  }

  if(hash.startsWith("#matching/")){
    const userId = hash.split("/")[1];
    await renderMatchComponent(userId);
    return;
  }

  switch (hash) {
    case "#main":
      await renderMainPage();
      break;
    case "#profile":
      await renderUserProfile();
      break;
    case "#questionnaire":
      await renderQuestionnaire();
      break;
    case "#first-login":
      await renderFirstLogin(false);
      break;
    case "#edit":
      await renderFirstLogin(true);
      break;
    case "#register":
      await renderRegister();
      break;
    case "#global-feed":
      await renderGlobalFeedComponent();
      break;
    case "#people-around":
      await renderPeopleAroundComponent();
      break;
    case "#questionnaire":
      await renderQuestionnaire();
      break;
    case "#chat-list":
      await renderChatList();
      break;
    case "#matching":
      await renderMatchComponent();
      break;
    case "#filter":
      await renderPeopleFilterComponent();
      break;
    case "#admin":
      if(user.roles.includes("Admin")){
        await renderAdminPanel();
      }
      break;
    default:
      await renderLogin();
      window.location.hash = "#login";
  }
}

// Při načtení stránky i při změně hashe
window.addEventListener("DOMContentLoaded", handleRouting);
window.addEventListener("hashchange", handleRouting);
