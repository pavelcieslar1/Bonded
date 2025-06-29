type AnswerOption = {
  id: number;
  label: string;
  score: number;
  displayOrder: number;
};

type Question = {
  id: number;
  text: string;
  category: string;
  categoryDescription?: string;
  displayOrder: number;
  answers: AnswerOption[];
};

let questions: Question[] = [];
let current = 0;
let selected: number | null = null;
let userAnswers: { questionId: number; answerValue: number; answerId: number; }[] = [];

export async function renderQuestionnaire() {

  async function loadQuestions() {
    const res = await fetch("/api/questionnaire/questions");

    if (!res.ok) {
        window.location.hash = "#error/QC-404";
        return;
    }

    questions = await res.json();
    renderQuestion();
  }

  function renderQuestion() {
    const root = document.getElementById("app-root");
    if (!root || !questions.length) return;
    const q = questions[current];

    // Progress jako procenta
    const progress = Math.round(((current + 1) / questions.length) * 100);
    
    // @ts-ignore
    root.innerHTML = window.DOMPurify.sanitize ( //html
      `
    <div class="d-flex justify-content-center align-items-center min-vh-100">
      <div class="container fw-light glass-card my-5 mx-2" style="max-width: 1000px; width: 100%;">
        <div class="px-2 mb-3 mt-2">
          <div class="profile-actions">
            <button id="backBtn" class="btn btn-light rounded-circle my-3 mx-2"><i class="bi bi-chevron-left"></i></button>
          </div>
              <div class="text-center pt-5 mb-3">
                  <h1 class="fw-light fs-1">Dotazník osobnosti</h1>
              </div>
              <!-- Progress bar -->
              <div class="progress mb-3">
                  <div class="progress-bar" role="progressbar" style="width: ${progress}%;" aria-valuenow="${progress}" aria-valuemin="0" aria-valuemax="100"></div>
              </div>
              <!-- Otázka, kategorie -->
              <div class="row my-3">
                <div class="col-lg-6 col-md-12">
                <!-- Definice kategorie -->
                <div class="category-description glass-card text-muted fs-5 fw-light mt-3 p-3">
                <div class="text-dark fs-1">Otázka č. ${q.displayOrder}</div>
                  <div class="fw-light text-dark">
                    Kategorie: <span class="text-color-1 fw-bold">${q.category}</span>
                  </div>
                      ${q.categoryDescription || "Popisek"}
                  </div>
                </div>
                  <div class="col-lg-6 col-md-12">
                    <div class="fw-light my-2 fs-4 text-break">${q.text}</div>
                    <!-- Možnosti odpovědi -->
                      <div class="d-flex flex-column gap-1 mb-1" id="answer-list">
                      ${q.answers
                        .map(
                          (ans, i) => `
                          <button type="button"
                          class="question-answer glass-card btn w-100 my-1 fw-normal py-1${
                            selected === i ? " active" : ""
                          }"
                          data-index="${i}"
                          style="background:${
                            selected === i ? "#5c4d7d" : "rgba(255, 255, 255, 0.4)"
                          };color:${
                            selected === i ? "#fff" : "#5c4d7d"
                          };border:0px solid rgba(255, 255, 255, 0.2);border-radius:16px;font-weight:500;font-size:1.1rem;transition:.17s;text-align:left;word-wrap: break-word;white-space: normal;">
                          ${ans.label}
                          </button>`
                        )
                        .join("")}
                      </div>
                  </div>
                </div>
              <div class="text-center fw-light lh-sm fs-6 text-muted">* Pro nejlepší výsledky zodpovídej na otázky přesně a pravdivě. Jedině tak ti dokážeme najít dokonalého partnera.</div>
      
          <!-- Tlačítko další otázka -->
              <div class="text-center m-3">
                  <button id="nextBtn" class="my-btn-3 mt-1" ${
                    selected === null ? "disabled" : ""
                  }>
                      ${
                        current < questions.length - 1
                          ? "Další otázka"
                          : "Dokončit"
                      }
                  </button>
              </div>
          </div>
      </div>
    </div>
  `);
  
  async function saveAnswers() {
    const payload = {
        answers: userAnswers
      };

    await fetch("/api/user/answers", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    })
      .then((res) => {
        const root = document.getElementById("app-root");
        if (root) {
          // @ts-ignore
          root.innerHTML = window.DOMPurify.sanitize( //html
            `
                        <div class="d-flex justify-content-center align-items-center min-vh-100">
                          <div class="container fw-light glass-card p-3 m-3" style="max-width: 800px; width: 100%;">
                            <div class="d-flex justify-content-left align-items-left gap-1 m-2">
                                <img src="./assets/logo.png"
                                    alt="bonded_logo"
                                    class="img-fluid"
                                    width="50" />
                                <p class="mb-0 text-light my_font fs-3 fw-light">Bonded</p>
                            </div>
                            <div class="d-flex flex-column justify-content-center align-items-center text-center my-5">
                              <h2 class="fs-3 fw-light text-color-1">Děkujeme za vyplnění dotazníku!</h2>
                              <p class="fs-6 fw-light text-muted px-2">Na základě tvých odpovědí ti doporučíme nejvhodnější partnery.</p>
                              <button id="backBtn" type="button" class="my-btn-1 mt-3 fw-light fs-5">Potvrdit</button>
                            </div>
                          </div>
                        </div>
        `);
          const showMainPageComponent = document.getElementById("backBtn");
          if(showMainPageComponent){
            showMainPageComponent.addEventListener("click", async () => {
                window.location.hash = "#main";
            })
          }
        }
      })
      .catch(() => {
        alert("Chyba při ukládání odpovědí. Zkuste to prosím znovu.");
      });
  }

  const showMainPageComponent = document.getElementById("backBtn");
  if(showMainPageComponent){
    showMainPageComponent.addEventListener("click", async () => {
        window.location.hash = "#main";
    })
  }

  

    // Event listenery na odpovědi
    const answerBtns = root.querySelectorAll(".question-answer");
    answerBtns.forEach((btn, i) => {
      btn.addEventListener("click", () => {
        selected = i;
        // Znovu vykresli, aby se zvýraznila odpověď a povolil nextBtn
        renderQuestion();
      });
    });

    // Listener na "Další otázka"
    const nextBtn = document.getElementById("nextBtn");
    nextBtn?.addEventListener("click", () => {
      if (selected !== null) {
        // Uložíme odpověď
        userAnswers[current] = {
            questionId: q.id,
            answerValue: q.answers[selected].score,
            answerId: q.answers[selected].id
        };
        if (current < questions.length - 1) {
            current++;
            selected = userAnswers[current]?.answerId
                ? q.answers.findIndex((a) => a.id === userAnswers[current].answerId)
            : null;
          renderQuestion();
        } else {
          // Odeslat odpovědi na backend
          saveAnswers();
        }
      }
    });
  }

  // Při načtení stránky načti otázky
  loadQuestions();
}
