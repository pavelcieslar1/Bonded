var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export function renderGlobalFeedTile() {
    return __awaiter(this, void 0, void 0, function* () {
        return `
                
                    <div id="showGlobalFeedBtn" class="card h-100 glass-card p-3">
                        <h5 class="card-title fw-bold mb-3 text-dark">Global Feed</h5>
                        <div class="scroll-hide" style="max-height: 250px; overflow-y: auto;">
                            <div class="feed-item mb-3">
                                <div class="d-flex align-items-center mb-1">
                                    <img src="https://placehold.co/30x30/FFA07A/ffffff?text=K" class="rounded-circle me-2" alt="Avatar">
                                    <strong class="text-dark">Karel Novák</strong> <small class="feed-user-city">(Plzeň)</small><small class="text-muted ms-auto">před 5 min</small>
                                </div>
                                <p class="feed-content mb-1">"Krásný den všem! Co dnes podnikáte?"</p>
                                <small class="feed-meta"><i class="bi bi-heart me-1"></i> 12 <i class="bi bi-chat me-1 ms-2"></i> 3</small>
                            </div>
                            <div class="feed-item mb-3">
                                <div class="d-flex align-items-center mb-1">
                                    <img src="https://placehold.co/30x30/ADD8E6/ffffff?text=V" class="rounded-circle me-2" alt="Avatar">
                                    <strong class="text-dark">Veronika D.</strong> <small class="feed-user-city">(Plzeň)</small><small class="text-muted ms-auto">před 1 hod</small>
                                </div>
                                <p class="feed-content mb-1">"Hledám parťáka na výlet na horách o víkendu!"</p>
                                <small class="feed-meta"><i class="bi bi-heart me-1"></i> 25 <i class="bi bi-chat me-1 ms-2"></i> 7</small>
                            </div>
                            <div class="feed-item pb-2">
                                <div class="d-flex align-items-center mb-1">
                                    <img src="https://placehold.co/30x30/DDA0DD/ffffff?text=P" class="rounded-circle me-2" alt="Avatar">
                                    <strong class="text-dark">Petr M.</strong> <small class="feed-user-city ml-3">(Plzeň)</small><small class="text-muted ms-auto">včera</small>
                                </div>
                                <p class="feed-content mb-1">"Užívám si večer u dobré knížky. 😊" </p>
                                <small class="feed-meta"><i class="bi bi-heart me-1"></i> 18 <i class="bi bi-chat me-1 ms-2"></i> 2</small>
                            </div>
                        </div>
                    </div>
                
                `;
    });
}
;
