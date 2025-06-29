export async function checkAuth() {
    const res = await fetch("/api/account/me", {method: "GET", credentials: "include" });
    if (res.ok) {
        const user = await res.json();
        console.log("Authorized")
        return user;
    } else {
        console.log("unauthorized")
        return null;
    }
}
