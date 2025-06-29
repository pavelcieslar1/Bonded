var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function loadHobbies() {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield fetch("/api/hobby");
        return yield res.json();
    });
}
function loadOccupations() {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield fetch("/api/occupation");
        return yield res.json();
    });
}
export function renderFirstLogin(isEditing) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const root = document.getElementById("app-root");
        if (root) {
            const hobbies = yield loadHobbies();
            const jobs = yield loadOccupations();
            // @ts-ignore
            root.innerHTML = window.DOMPurify.sanitize(//html
            `
        <div class="d-flex justify-content-center align-items-center min-vh-100">
            <div class="align-self-center text-center w-100 my-lg-4 my-md-3 glass-card">
                <div class="d-flex justify-content-left align-items-left gap-1 m-4">
                    <img src="./assets/logo.png"
                        alt="bonded_logo"
                        class="img-fluid"
                        width="50" />
                    <p class="mb-0 text-light my_font fs-3 fw-light">Bonded</p>
                </div>
                <div class="text-center text-wrap text-light m-5" id="container1">
                    <h1 class="fw-light text-uppercase text-muted display-5">Vítej u nás v Bonded</h1>
                    <p class="fw-light fs-5 text-muted">Než se pustíme do dotazníku osobnosti, musíme nastavit tvůj profil.</p>
                    <button type="button" class="my-btn-3 fs-5 mt-3" id="toContainer2">Pokračovat</button>
                </div>
                <div class="container mt-5"  >
                  <form id="firstLoginForm">
                  <div id="container2" style="display: none; ">
                    <h1 class="fw-light mt-3 text-dark display-4">Nastavení profilu</h1>
                      <div class="d-flex align-items-center gap-1 fs-5 justify-content-center mt-4">Volby označené <div class="gemini-star-colored align-middle"></div> hrají větší roli v algoritmu hledání partnera.</div>
                      <div class="d-flex align-items-center gap-1 fs-6 justify-content-center mt-4 text-muted">*Kvůli testovací databáze uživatelů jsou některé volby zakázané.</div>
                        <div class="row mb-3 mt-5 px-2">
                            <div class="col-lg-4 col-md-6 my-2">
                              <div class="form-floating">
                                <input type="name" class="form-control my-input-1" id="firstName" placeholder="Jméno" maxlength="50" reguired/>
                                <label class="mx-1" for="firstName">Jméno</label>
                              </div>
                            </div>
                            <div class="col-lg-4 col-md-6 my-2">
                              <div class="form-floating">
                                <input type="surname" class="form-control my-input-1" id="lastName" placeholder="Příjmení" maxlength="50" reguired/>
                                <label class="mx-1" for="lastName">Příjmení</label>
                              </div>
                            </div>
                            <div class="col-lg-4 col-md-6 my-2">
                                <div class="form-floating">
                                    <input type="date" class="form-control my-input-1" id="birthdate" placeholder="Datum narození" reguired>
                                    <label class="mx-1" for="birthdate">Datum narození</label>
                                </div>
                            </div>
                        </div>
                        <div class="row mb-3 px-3">
                            <div class="col-lg-3 col-md-6 my-2">
                              <div class="form-floating">
                                <select class="form-select my_select my-color-primary" id="state" aria-label="select state">
                                    <option selected disabled>Zvolte volbu</option>
                                    <option value="Česká Republika">Česká Republika</option>
                                </select>
                                <label for="state">Stát</label>
                              </div>
                            </div>
                            <div class="col-lg-3 col-md-6 my-2">
                              <div class="form-floating">
                                <select class="form-select my_select my-color-primary" id="city" aria-label="select city">
                                    <option selected disabled>Zvolte volbu</option>
                                    <option value="Ostrava">Ostrava</option>
                                    <option value="Praha">Praha</option>
                                </select>
                                <label for="city">Město</label>
                              </div>
                            </div>
                            <div class="col-lg-3 col-md-6 my-2">
                              <div class="form-floating">
                                <select class="form-select my_select my-color-primary" id="gender" aria-label="select gender">
                                    <option selected disabled>Zvolte volbu</option>
                                    <option value="Muž">Muž</option>
                                    <option value="Žena">Žena</option>
                                    <option value="Jiné">Jiné</option>
                                </select>
                                <label for="gender">Pohlaví</label>
                              </div>
                            </div>
                            <div class="col-lg-3 col-md-6 my-2">
                              <div class="form-floating">
                                <select class="form-select my_select my-color-primary" id="orientation" aria-label="select orientation">
                                    <option selected disabled>Zvolte volbu</option>
                                    <option value="Heterosexual">Heterosexual</option>
                                    <option value="Bisexual">Bisexual</option>
                                    <option value="Homosexual">Homosexual</option>
                                </select>
                                <label for="orientation">Orientace</label>
                              </div>
                            </div>
                        </div>
                        <div class="row mb-3 px-3">
                            <div class="col-lg-3 col-md-6 my-2">
                              <div class="form-floating">
                                <select class="form-select my_select my-color-primary" id="education" aria-label="select education">
                                    <option selected disabled>Zvolte volbu</option>
                                    <option value="Základní škola">Základní škola</option>
                                    <option value="Střední škola">Střední škola</option>
                                    <option value="Vysoká škola">Vysoká škola</option>
                                    <option value="Bez vzdělání">Bez vzdělání</option>
                                    <option value="Jiné">Jiné</option>
                                </select>
                                <label for="education">Vzdělání</label>
                              </div>
                            </div>
                            <div class="col-lg-3 col-md-6 my-2">
                              <div class="form-floating">
                                <select class="form-select my_select my-color-primary" id="status" aria-label="select relationship status">
                                    <option selected disabled>Zvolte volbu</option>
                                    <option value="Nezadaný">Nezadaný</option>
                                    <option value="Ve vztahu" disabled>Ve vztahu</option>
                                    <option value="Ve volném vztahu">Ve volném vztahu</option>
                                    <option value="V manželství" disabled>V manželství</option>
                                </select>
                                <label for="status">Status</label>
                                <div class="gemini-star-colored position-absolute top-0 start-100 translate-middle"></div>
                              </div>
                            </div>
                            <div class="col-lg-3 col-md-6 my-2">
                              <div class="form-floating">
                                <select class="form-select my_select my-color-primary" id="etnicity" aria-label="select ethicity">
                                      <option selected disabled>Zvolte volbu</option>
                                      <option value="Běloch -Evropského původu-">Běloch -Evropského původu-</option>
                                      <option value="Černoch -Afrického původu-">Černoch -Afrického původu-</option>
                                      <option value="Asiat -východoasijského původu-">Asiat -východoasijského původu-</option>
                                      <option value="Asiat -jihoasijského původu-">Asiat -jihoasijského původu-</option>
                                      <option value="Hispánec / Latinoameričan">Hispánec / Latinoameričan</option>
                                      <option value="Arab">Arab</option>
                                      <option value="Původní obyvatel">Původní obyvatel</option>
                                      <option value="Smíšené etnikum">Smíšené etnikum</option>
                                      <option value="Jiné / nespecifikováno">Jiné / nespecifikováno</option>
                                </select>
                                <label for="etnicity">Etnikum</label>
                              </div>
                            </div>
                            <div class="col-lg-3 col-md-6 my-2">
                              <div class="form-floating ">
                                <select class="form-select my_select" id="lookingFor" aria-label="select searching for">
                                    <option selected disabled>Zvolte volbu</option>
                                    <option value="Kamarádství">Kamarádství</option>
                                    <option value="Vážný vztah">Vážný vztah</option>
                                    <option value="Povyražení">Povyražení</option>
                                    <option value="Rozhlížím se">Rozhlížím se</option>
                                </select>
                                <label for="lookingFor">Hledám</label>
                                <div class="gemini-star-colored position-absolute top-0 start-100 translate-middle"></div>
                              </div>
                            </div>
                        </div>
                        <div class="row mb-3 px-3">
                            <div class="col-lg-3 col-md-6 my-2">
                              <div class="form-floating">
                                <select class="form-select my_select my-color-primary" id="religion" aria-label="select education">
                                    <option selected disabled>Zvolte volbu</option>
                                    <option value="Křesťanství">Křesťanství</option>
                                    <option value="Judaismus">Judaismus</option>
                                    <option value="Islám">Islám</option>
                                    <option value="Buddhismus">Buddhismus</option>
                                    <option value="Alternativní">Alternativní</option>
                                    <option value="Ateismus">Ateismus</option>
                                </select>
                                <label for="religion">Vyznání</label>
                              </div>
                            </div>
                            <div class="col-lg-3 col-md-6 my-2">
                              <div class="form-floating">
                                <select class="form-select my_select my-color-primary" id="astralSign" aria-label="select relationship status">
                                    <option selected disabled>Zvolte volbu</option>
                                    <option value="Beran">Beran</option>
                                    <option value="Býk">Býk</option>
                                    <option value="Blíženci">Blíženci</option>
                                    <option value="Rak">Rak</option>
                                    <option value="Lev">Lev</option>
                                    <option value="Panna">Panna</option>
                                    <option value="Váhy">Váhy</option>
                                    <option value="Štír">Štír</option>
                                    <option value="Střelec">Střelec</option>
                                    <option value="Kozoroh">Kozoroh</option>
                                    <option value="Vodnář">Vodnář</option>
                                    <option value="Ryby">Ryby</option>
                                </select>
                                <label for="astralSign">Znamení</label>
                              </div>
                            </div>
                            <div class="col-lg-3 col-md-6 my-2">
                              <div class="form-floating">
                                <select class="form-select my_select my-color-primary" id="smoker" aria-label="select ethicity">
                                    <option selected disabled>Zvolte volbu</option>
                                    <option value="Ano">Ano</option>
                                    <option value="Ne">Ne</option>
                                    <option value="Příležitostně">Příležitostně</option>
                                </select>
                                <label for="smokre">Kouření</label>
                              </div>
                            </div>
                            <div class="col-lg-3 col-md-6 my-2">
                              <div class="form-floating">
                                <select class="form-select my_select my-color-primary" id="alcohol" aria-label="select searching fot">
                                    <option selected disabled>Zvolte volbu</option>
                                    <option value="Ano">Ano</option>
                                    <option value="Ne">Ne</option>
                                    <option value="Příležitostně">Příležitostně</option>
                                    <option value="Jednou za čas">Jednou za čas</option>
                                </select>
                                <label for="alcohol">Alkohol</label>
                              </div>
                            </div>
                        </div>
                        <div class="row mb-3 px-3">
                          <div class="col-lg-3 col-md-6 my-2">
                            <div class="form-floating">
                                <select class="form-select my_select" id="chronotype" aria-label="select education">
                                    <option selected disabled>Zvolte volbu</option>
                                    <option value="Ranní typ">Ranní typ</option>
                                    <option value="Noční typ">Noční typ</option>
                                    <option value="Flexibilní / Nezáleží">Flexibilní / Nezáleží</option>
                                </select>
                                <label for="chronotype">Chronotyp</label>
                                <div class="gemini-star-colored position-absolute top-0 start-100 translate-middle"></div>
                              </div>
                            </div>
                            <div class="col-lg-3 col-md-6 my-2">
                              <div class="form-floating">
                                <select class="form-select my_select" id="life" aria-label="select relationship status">
                                    <option selected disabled>Zvolte volbu</option>
                                    <option value="Klidný a stabilní">Klidný a stabilní</option>
                                    <option value="Dobrodružný a spontánní">Dobrodružný a spontánní</option>
                                    <option value="Organizovaný a cílevědomý">Organizovaný a cílevědomý</option>
                                    <option value="Uvolněný a pohodový">Uvolněný a pohodový</option>
                                </select>
                                <label for="life">Životní rytmus</label>
                                <div class="gemini-star-colored position-absolute top-0 start-100 translate-middle"></div>
                              </div>
                            </div>
                            <div class="col-lg-3 col-md-6 my-2">
                              <div class="form-floating">
                                <select class="form-select my_select" id="kids" aria-label="select ethicity">
                                    <option selected disabled>Zvolte volbu</option>
                                    <option value="Ano, mám děti">Ano, mám děti</option>
                                    <option value="Nemám, ale chci v budoucnu">Nemám, ale chci v budoucnu</option>
                                    <option value="Nemám a nechci">Nemám a nechci</option>
                                    <option value="Nejsem si jistý">Nejsem si jistý</option>
                                </select>
                                <label for="kids">Děti</label>
                                <div class="gemini-star-colored position-absolute top-0 start-100 translate-middle"></div>
                              </div>
                            </div>
                            <div class="col-lg-3 col-md-6 my-2">
                              <div class="form-floating">
                                <select class="form-select my_select" id="personal-space" aria-label="select searching fot">
                                    <option selected disabled>Zvolte volbu</option>
                                    <option value="Potřebuji hodně osobního prostoru">Potřebuji hodně osobního prostoru</option>
                                    <option value="Občas potřebuji být sám/sama">Občas potřebuji být sám/sama</option>
                                    <option value="Většinu času chci trávit společně">Většinu času chci trávit společně</option>
                                    <option value="Nezáleží mi na tom">Nezáleží mi na tom</option>
                                </select>
                                <label for="personal-space">Osobní prostor</label>
                                <div class="gemini-star-colored position-absolute top-0 start-100 translate-middle"></div>
                              </div>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <div class="col-md-12">
                                <h3 class="text-dark fw-lighter mb-3 text-start ms-4 mt-2 p-2 display-7">Vyber své koníčky</h3>
                                <div class="container mb-3">
                                    <div class="row row-cols-2 row-cols-sm-4 row-cols-md-6 g-2 scroll-hide" style="max-height: 200px; overflow-y: auto;">
                                        ${hobbies
                .map((h) => `
                                                <div class="col-auto">
                                                <input type="checkbox" class="btn-check hobby-checkbox" id="hobby_${h.id}" autocomplete="off" value="${h.id}">
                                                <label class="btn btn-outline-light fw-light" for="hobby_${h.id}">${h.name}</label>
                                                </div>
                                            `).join("")}
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-12">
                                <h3 class="text-dark fw-lighter mb-3 display-7 text-start ms-4 mt-2 p-2">Vyber své pracovní zařazení</h3>
                                <div class="container mb-3">
                                    <div class="row row-cols-2 row-cols-sm-4 row-cols-md-6 g-2 scroll-hide" style="max-height: 200px; overflow-y: auto;">
                                        ${jobs
                .map((j) => `
                                                <div class="col-auto">
                                                <input type="checkbox" class="btn-check occupation-checkbox" id="job_${j.id}" autocomplete="off" value="${j.id}">
                                                <label class="btn btn-outline-light fw-light" for="job_${j.id}">${j.name}</label>
                                                </div>
                                            `).join("")}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col">
                                <h3 class="text-dark fw-light mb-3 display-7 text-start ms-3 p-2">Co ostatním povíš o sobe?</h3>
                                <div class="form-floating">
                                    <textarea class="form-control about-me-textarea" placeholder="Leave a comment here" id="about_me" maxlength="500" style="height: 300px"></textarea>
                                    <label class="my-color-primary" for="about_me">Napiš si něco na profil.</label>
                                </div>
                            </div>                        
                        </div>
                        <button type="button" class="my-btn-3 py-1 my-4 fs-4" id="toContainer3">Pokračovat</button>
                        ${isEditing ? `<button id="backBtn" href="#main" type="button" class="my-btn-2 py-1 my-4 fs-4 mx-2" id="toContainer3">Zrušit</button>` : ""}
                        </div>
                        <div class="m-5" id="container3" style="display: none">
                            <h2 class="text-muted fw-light text-uppercase mb-2 display-4">hotovo!</h2>
                            <p class="text-muted fw-light">Úspěšně si založil svůj profil.</p>
                            <p class="text-muted fw-light">Nezapomeň si vyplnít dotazník osobnosti.</p>
                            <p class="text-muted fw-light">Dotazník osobnosti slouží k nalezení perfektní shody s druhou osobou.</p>
                            <p class="text-muted fw-light">Na otázky odpovídej co nejpřesněji a pravdivě. </p>
                            <p class="text-muted fw-light">Nepravdivé informace povedou k nepřesnému párování.</p>
                            <button type="submit" class="my-btn-3 fs-4 py-1 mt-3">Potvrdit</button>
                        </div>  
                    </form>
                </div>
            </div>    
        </div>
        <!--Konec -->
    `);
        }
        if (isEditing) {
            yield loadProfileData();
        }
        const backBtn = document.getElementById("backBtn");
        backBtn === null || backBtn === void 0 ? void 0 : backBtn.addEventListener("click", () => { window.location.hash = "#main"; });
        const btnTo2 = document.getElementById("toContainer2");
        btnTo2 === null || btnTo2 === void 0 ? void 0 : btnTo2.addEventListener("click", () => {
            document.getElementById("container1").style.display = "none";
            document.getElementById("container2").style.display = "block";
        });
        const btnToPersonInfo2 = document.getElementById("toContainer3");
        btnToPersonInfo2 === null || btnToPersonInfo2 === void 0 ? void 0 : btnToPersonInfo2.addEventListener("click", () => {
            document.getElementById("container2").style.display = "none";
            document.getElementById("container3").style.display = "block";
        });
        (_a = document
            .getElementById("firstLoginForm")) === null || _a === void 0 ? void 0 : _a.addEventListener("submit", function (e) {
            return __awaiter(this, void 0, void 0, function* () {
                e.preventDefault();
                const data = {
                    firstName: document.getElementById("firstName")
                        .value,
                    lastName: document.getElementById("lastName")
                        .value,
                    dateOfBirth: document.getElementById("birthdate")
                        .value,
                    gender: document.getElementById("gender")
                        .selectedOptions[0].text,
                    state: document.getElementById("state")
                        .selectedOptions[0].text,
                    city: document.getElementById("city")
                        .selectedOptions[0].text,
                    orientation: document.getElementById("orientation")
                        .selectedOptions[0].text,
                    etnicity: document.getElementById("etnicity")
                        .selectedOptions[0].text,
                    education: document.getElementById("education")
                        .selectedOptions[0].text,
                    relationshitpStatus: document.getElementById("status")
                        .selectedOptions[0].text,
                    religion: document.getElementById("religion")
                        .selectedOptions[0].text,
                    astralSign: document.getElementById("astralSign")
                        .selectedOptions[0].text,
                    smoker: document.getElementById("smoker")
                        .selectedOptions[0].text,
                    alcohol: document.getElementById("alcohol")
                        .selectedOptions[0].text,
                    lookingFor: document.getElementById("lookingFor")
                        .selectedOptions[0].text,
                    chronotype: document.getElementById("chronotype")
                        .selectedOptions[0].text,
                    life: document.getElementById("life")
                        .selectedOptions[0].text,
                    kids: document.getElementById("kids")
                        .selectedOptions[0].text,
                    personalSpace: document.getElementById("personal-space")
                        .selectedOptions[0].text,
                    bio: document.getElementById("about_me").value,
                };
                const hobbies = Array.from(document.querySelectorAll(".hobby-checkbox:checked")).map((el) => parseInt(el.value));
                const occupations = Array.from(document.querySelectorAll(".occupation-checkbox:checked")).map((el) => parseInt(el.value));
                const payload = Object.assign(Object.assign({}, data), { hobbyIds: hobbies, occupationIds: occupations });
                // Odeslání na backend (PUT /api/user/me)
                const res = yield fetch("/api/user/me", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
                if (res.ok) {
                    window.location.hash = "#main";
                }
                else {
                    window.location.hash = "#error/FLC-404";
                }
            });
        });
        function loadProfileData() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const res = yield fetch("/api/user/me", {
                        method: "GET",
                        credentials: "include",
                    });
                    if (!res.ok)
                        throw new Error("Failed to fetch profile");
                    const data = yield res.json();
                    yield prefillForm(data);
                    yield prefillCheckboxes(".hobby-checkbox", data.hobbyIds);
                    yield prefillCheckboxes(".occupation-checkbox", data.occupationIds);
                }
                catch (error) {
                    console.error("Chyba při načítání profilu:", error);
                    window.location.hash = "#error/FLC-PROFILEERROR-404";
                }
            });
        }
        function prefillForm(data) {
            return __awaiter(this, void 0, void 0, function* () {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w;
                document.getElementById("firstName").value = (_a = data.firstName) !== null && _a !== void 0 ? _a : "";
                document.getElementById("lastName").value = (_b = data.lastName) !== null && _b !== void 0 ? _b : "";
                const dateOnly = (_d = (_c = data.dateOfBirth) === null || _c === void 0 ? void 0 : _c.split("T")[0]) !== null && _d !== void 0 ? _d : "";
                document.getElementById("birthdate").value = dateOnly;
                document.getElementById("gender").value = (_e = data.gender) !== null && _e !== void 0 ? _e : "";
                document.getElementById("state").value = (_f = data.state) !== null && _f !== void 0 ? _f : "";
                document.getElementById("city").value = (_g = data.city) !== null && _g !== void 0 ? _g : "";
                document.getElementById("orientation").value = (_h = data.orientation) !== null && _h !== void 0 ? _h : "";
                document.getElementById("etnicity").value = (_j = data.etnicity) !== null && _j !== void 0 ? _j : "";
                document.getElementById("education").value = (_k = data.education) !== null && _k !== void 0 ? _k : "";
                document.getElementById("status").value = (_l = data.relationshitpStatus) !== null && _l !== void 0 ? _l : "";
                document.getElementById("religion").value = (_m = data.religion) !== null && _m !== void 0 ? _m : "";
                document.getElementById("astralSign").value = (_o = data.astralSign) !== null && _o !== void 0 ? _o : "";
                document.getElementById("smoker").value = (_p = data.smoker) !== null && _p !== void 0 ? _p : "";
                document.getElementById("alcohol").value = (_q = data.alcohol) !== null && _q !== void 0 ? _q : "";
                document.getElementById("lookingFor").value = (_r = data.lookingFor) !== null && _r !== void 0 ? _r : "";
                document.getElementById("chronotype").value = (_s = data.chronotype) !== null && _s !== void 0 ? _s : "";
                document.getElementById("life").value = (_t = data.life) !== null && _t !== void 0 ? _t : "";
                document.getElementById("kids").value = (_u = data.kids) !== null && _u !== void 0 ? _u : "";
                document.getElementById("personal-space").value = (_v = data.personalSpace) !== null && _v !== void 0 ? _v : "";
                document.getElementById("about_me").value = (_w = data.bio) !== null && _w !== void 0 ? _w : "";
            });
        }
        function prefillCheckboxes(className, selectedIds) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!selectedIds)
                    return;
                document.querySelectorAll(className).forEach((input) => {
                    const id = parseInt(input.value);
                    input.checked = selectedIds.includes(id);
                });
            });
        }
    });
}
