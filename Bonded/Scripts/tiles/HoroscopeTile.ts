export async function renderHoroscopeTile() : Promise<string>{
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
}

