import { checkAuth } from "../Auth.js";
declare var bootstrap: any;

export async function renderAdminPanel() {

  const root = document.getElementById("app-root");
  if (!root) return;


      const user = await checkAuth();
      if(user.roles.some((role: string) => role !== "Admin"))
        {
           window.location.hash = "error/APC-NOENTRY" 
        }

    // @ts-ignore
    root.innerHTML = window.DOMPurify.sanitize ( //html
    `
        <div class="d-flex justify-content-center align-items-center m-3">
            <div class="w-100 glass-card min-dvh-100" style="max-width: 1200px;">
                <div class="main-content-area p-4">
                    <a href="#main" id="backBtn" class="btn btn-light rounded-circle my-3 mx-2"><i class="bi bi-chevron-left"></i></a>
                    <h1 class="text-center display-3">Admin Panel</h1>

                    <!-- Sekce vyhledávání uživatelů -->
                    <div class="search-card">
                        <h5 class="fw-light mb-3 text-dark display-6">Vyhledat uživatele</h5>
                        <div class="row g-3">
                            <div class="col-md-4">
                                <div class="form-floating">
                                    <input type="text" class="form-control my-input-1" id="searchName" placeholder="Zadejte jméno">
                                    <label for="searchName" class="mx-1">Jméno</label>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-floating">
                                    <input type="email" class="form-control my-input-1" id="searchEmail" placeholder="Zadejte e-mail">
                                    <label for="searchEmail" class="form-label">E-mail</label>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-floating">
                                    <input type="text" class="form-control my-input-1" id="searchId" placeholder="Zadejte ID">
                                    <label for="searchId" class="form-label">ID</label>
                                </div>
                            </div>
                            <div class="col-12 d-grid">
                                <button type="button" class="btn my-btn-1" id="searchBtn">Vyhledat</button>
                            </div>
                        </div>
                    </div>

                    <!-- Tabulka uživatelů -->
                    <div class="table table-borderless mt-3 overflow-x-auto glass-card">
                        <table class="user-table w-100">
                            <thead>
                                <tr>
                                    <th scope="col">Uživatel</th>
                                    <th scope="col">E-mail</th>
                                    <th scope="col">Role</th>
                                    <th scope="col">Akce</th>
                                </tr>
                            </thead>
                            <tbody id="userListBody">
                                
                            </tbody>
                        </table>
                    </div>

                    <div class="text-center mt-4">
                        <p id="noResultsMessage" class="text-muted" style="display: none;">
                            Žádní uživatelé neodpovídají zadaným kritériím.
                        </p>
                    </div>
                </div>
        </div>

        <!-- Modal -->
        <div class="modal fade" id="editUserModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content glass-card">
                <div class="modal-header"><h5 class="modal-title ">Editace uživatele</h5></div>
                <div class="modal-body">
                    <input type="hidden" id="modalUserId">
                    <div>
                        <div class="form-floating">
                            <input type="text" id="modalEmail" readonly class="form-control my-input-1">
                            <label for="modalEmail">Email:</label>
                        </div>
                    </div>
                    <div class="mt-4">
                        <div class="form-floating">
                            <select id="modalRole" class="form-control my_select">
                                <option value="Standard">Standard</option>
                                <option value="Premium">Premium</option>
                                <option value="Admin">Admin</option>
                            </select>
                            <label>Role:</label>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button id="modalSaveBtn" class="btn my-btn-3">Uložit změny</button>
                    <button id="modalDeleteBtn" class="btn my-btn-1">Smazat profil</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal pro potvrzení smazání -->
    <div class="modal fade" id="deleteConfirmModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content glass-card">
                <div class="modal-header">
                    <h5 class="modal-title text-color-1">
                        <i class="bi bi-exclamation-triangle-fill me-2"></i>
                        Potvrzení smazání
                    </h5>
                </div>
                <div class="modal-body">
                    <p class="text-light fw-bold">Opravdu chcete smazat uživatele <strong id="deleteUserName"></strong>?</p>
                    <p class="text-light small">Tato akce je nevratná a smaže všechna data uživatele včetně profilu, koníčků a odpovědí na dotazník.</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Zrušit</button>
                    <button id="confirmDeleteBtn" class="btn btn-danger">Smazat uživatele</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Toast notifikace -->
    <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 9999;">
        <div id="successToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header bg-success text-white">
                <i class="bi bi-check-circle-fill me-2"></i>
                <strong class="me-auto">Úspěch</strong>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
            </div>
            <div class="toast-body">
                Uživatel byl úspěšně smazán.
            </div>
        </div>
        
        <div id="errorToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header bg-danger text-white">
                <i class="bi bi-exclamation-circle-fill me-2"></i>
                <strong class="me-auto">Chyba</strong>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
            </div>
            <div class="toast-body">
                Při mazání uživatele došlo k chybě.
            </div>
        </div>
    </div>
    `);

    // 1. Funkce na získání uživatelů podle filtru
    async function fetchUsers(name: string, email: string, id: string): Promise<any[]> {
        const params = new URLSearchParams();
        if (name) params.append('name', name);
        if (email) params.append('email', email);
        if (id) params.append('id', id);
        const res = await fetch('/api/user/list?' + params.toString());
        if (!res.ok) console.log('Chyba načítání');
        return await res.json();
    }

    // 2. Funkce na render tabulky
    function renderUserTable(users: any[]) {
        const tbody = document.getElementById("userListBody");
        if (!tbody) return;
        console.log(users);
        tbody.innerHTML = "";

        users.forEach(u => {
            const row = document.createElement("tr");
            // @ts-ignore
            row.innerHTML = window.DOMPurify.sanitize(`
                                    <td>
                                        <div class="d-flex align-items-center">
                                            <span>${u.firstName} ${u.lastName}</span>
                                        </div>
                                    </td>
                                    <td>${u.email}</td>
                                    <td><span class="user-role-badge role-${u.role}">${u.role}</span></td>
                                    <td>
                                        <button class="btn btn-sm my-btn-3 action-btn edit-user-btn fs-6" data-id="${u.id}" data-email="${u.email}" data-role="${u.role}">
                                            <i class="bi bi-pencil-fill"></i> 
                                            Upravit
                                        </button>
                                    </td>
            `);
            tbody.appendChild(row);
        });

        document.querySelectorAll(".edit-user-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const t = e.currentTarget as HTMLElement;
                showEditModal(
                    t.getAttribute("data-id")!,
                    t.getAttribute("data-email")!,
                    t.getAttribute("data-role")!
                );
            });
        });
        
    }

    // 3. Ovládání filtru
    document.getElementById("searchBtn")?.addEventListener("click", async () => {
        const name = (document.getElementById("searchName") as HTMLInputElement).value.trim();
        const email = (document.getElementById("searchEmail") as HTMLInputElement).value.trim();
        const id = (document.getElementById("searchId") as HTMLInputElement).value.trim();
        const users = await fetchUsers(name, email, id);
        renderUserTable(users);
    });

    
    // 4. Modal logika
    function showEditModal(id: string, email: string, role: string) {
        (document.getElementById("modalUserId") as HTMLInputElement).value = id;
        (document.getElementById("modalEmail") as HTMLInputElement).value = email;
        (document.getElementById("modalRole") as HTMLSelectElement).value = role;
        // Zobrazit modal (Bootstrap 5+)
        const modal = new bootstrap.Modal(document.getElementById('editUserModal')!);
        modal.show();
    }

    // 5. Uložení změn
    document.getElementById("modalSaveBtn")?.addEventListener("click", async () => {
        const id = (document.getElementById("modalUserId") as HTMLInputElement).value;
        const role = (document.getElementById("modalRole") as HTMLSelectElement).value;
        await fetch("/api/role/assign", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            credentials: "include",
            body: JSON.stringify({ userId: id, roleName: role })
        });
        // Znovu načti uživatele a zavři modal
        document.getElementById("searchBtn")?.click();
        bootstrap.Modal.getInstance(document.getElementById('editUserModal')!)?.hide();
    });

    // 6. Smazání účtu
    document.getElementById("modalDeleteBtn")?.addEventListener("click", async () => {
        const id = (document.getElementById("modalUserId") as HTMLInputElement).value;
        const email = (document.getElementById("modalEmail") as HTMLInputElement).value;
        
        // Zobrazit modal pro potvrzení
        (document.getElementById("deleteUserName") as HTMLElement).textContent = email;
        const confirmModal = new bootstrap.Modal(document.getElementById('deleteConfirmModal')!);
        confirmModal.show();
        
        // Skrýt edit modal
        bootstrap.Modal.getInstance(document.getElementById('editUserModal')!)?.hide();
    });

    // 7. Potvrzení smazání
    document.getElementById("confirmDeleteBtn")?.addEventListener("click", async () => {
        const id = (document.getElementById("modalUserId") as HTMLInputElement).value;
        
        try {
            const response = await fetch(`/api/user/delete/${id}`, { 
                method: "DELETE", 
                credentials: "include" 
            });
            
            if (response.ok) {
                // Zobrazit úspěšnou notifikaci
                const successToast = new bootstrap.Toast(document.getElementById('successToast')!);
                successToast.show();
                
                // Znovu načti uživatele
                document.getElementById("searchBtn")?.click();
            } else {
                // Zobrazit chybovou notifikaci
                const errorToast = new bootstrap.Toast(document.getElementById('errorToast')!);
                errorToast.show();
            }
        } catch (error) {
            console.error('Chyba při mazání uživatele:', error);
            // Zobrazit chybovou notifikaci
            const errorToast = new bootstrap.Toast(document.getElementById('errorToast')!);
            errorToast.show();
        }
        
        // Skrýt potvrzovací modal
        bootstrap.Modal.getInstance(document.getElementById('deleteConfirmModal')!)?.hide();
    });

}