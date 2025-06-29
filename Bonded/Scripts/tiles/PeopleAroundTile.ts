type UserProfile = {
  firstName: string;
  lastName: string;
  profileImageUrl: string;
  city: string;
};

let userProfiles : UserProfile[];
export async function renderPeopleAroundTile() : Promise<string>{
    const res = await fetch("/api/user/random-users", {
    method: "GET",
    credentials: "include",
    });
    if (!res.ok) {
        window.location.hash = "#main";
    }
    userProfiles = await res.json();

    return `

                    <div id="showPeopleAroundBtn" class="card h-100 glass-card p-3 ">
                        <h5 class="card-title fw-light mb-3 text-dark fs-4">Lidé ve vašem okolí</h5>
                        <div class="row row-cols-lg-5 row-cols-md-4 g-2 text-center">
                            ${userProfiles
                            .map(
                                (user: UserProfile) => `
                                <div class="col nearby-user">
                                    <img src="${user.profileImageUrl ?? `https://placehold.co/60x60/87CEEB/ffffff?text=${user.firstName[0] + user.lastName[0]}`}" alt="Profile-image" class="nearby-user-img rounded-circle shadow">
                                    <div class="nearby-user-name">${user.firstName}</div>
                                    <div class="nearby-user-distance">${user.city}</div>
                                </div>
                                
                            `
                            )
                            .join("")}
                        </div>
                    </div>

                `
                
};
