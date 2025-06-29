var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export function renderHoroscopeTile() {
    return __awaiter(this, void 0, void 0, function* () {
        return `
                    <div id="showHoroscopeBtn" class="card h-100 glass-card gemini-card text-color-2">
                        <div class="card-body d-flex flex-column">
                        <div class="flex-grow-1 d-flex flex-column justify-content-center align-items-center text-center ">
                        <h5 class="card-title fw-light fs-2"><i class="bi bi-moon-stars mx-2 m-icon"></i>Denní Horoskop</h5>
                                <p id="horoscopeSign" class="mb-1">Vaše znamení</p>
                                <div id="horoscopeText" class="horoscope-text text-light">Klikněte pro zobrazení denního horoskopu.</div>
                                <div id="horoscopeLoading" class="spinner-border text-info mt-3 pb-3" role="status" style="display: none;">
                                    <span class="visually-hidden">Načítání...</span>
                                </div>
                            </div>
                        </div>
                    </div>
    `;
    });
}
