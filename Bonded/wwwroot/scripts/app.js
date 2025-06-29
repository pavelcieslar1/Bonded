var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
function handleRouting() {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield checkAuth();
        const hash = window.location.hash || "#login";
        // Ověření přístupu
        if (!user && hash !== "#register") {
            yield renderLogin();
            window.location.hash = "#login";
            return;
        }
        if (hash.startsWith("#profile/")) {
            const userId = hash.split("/")[1];
            yield renderUserProfile(userId);
            return;
        }
        if (hash.startsWith("#chat/")) {
            const chatId = parseInt(hash.split("/")[1]);
            if (!isNaN(chatId)) {
                yield renderChat(chatId);
                return;
            }
        }
        if (hash.startsWith("#error/")) {
            const error = hash.split("/")[1];
            yield renderErrorPage(error);
            return;
        }
        if (hash.startsWith("#matching/")) {
            const userId = hash.split("/")[1];
            yield renderMatchComponent(userId);
            return;
        }
        switch (hash) {
            case "#main":
                yield renderMainPage();
                break;
            case "#profile":
                yield renderUserProfile();
                break;
            case "#questionnaire":
                yield renderQuestionnaire();
                break;
            case "#first-login":
                yield renderFirstLogin(false);
                break;
            case "#edit":
                yield renderFirstLogin(true);
                break;
            case "#register":
                yield renderRegister();
                break;
            case "#global-feed":
                yield renderGlobalFeedComponent();
                break;
            case "#people-around":
                yield renderPeopleAroundComponent();
                break;
            case "#questionnaire":
                yield renderQuestionnaire();
                break;
            case "#chat-list":
                yield renderChatList();
                break;
            case "#matching":
                yield renderMatchComponent();
                break;
            case "#filter":
                yield renderPeopleFilterComponent();
                break;
            case "#admin":
                if (user.roles.includes("Admin")) {
                    yield renderAdminPanel();
                }
                break;
            default:
                yield renderLogin();
                window.location.hash = "#login";
        }
    });
}
// Při načtení stránky i při změně hashe
window.addEventListener("DOMContentLoaded", handleRouting);
window.addEventListener("hashchange", handleRouting);
