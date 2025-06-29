export async function getGlobalMatch(userId: string) {

    let data;
  
    try {
      const currentUserId = userId;
      if (!currentUserId) throw new Error("User ID not found in localStorage.");

      const response = await fetch(`/api/match/global-matches?userId=${currentUserId}`, {method: "GET", credentials: "include",});
      
      if (response.status === 400) {
        // Uživatel nemá vyplněný dotazník
        const errorData = await response.text();
        throw new Error(errorData);
      }
      
      if (!response.ok) throw new Error("Failed to fetch global matches");

      data = await response.json();
      
    } catch (err) {
      console.error("Chyba při hledání shod:", err);
      throw err; 
    }

    return data ? data : null;
}

export async function getLocalMatch(params:any) {
    
}

export async function getMatchPremium(userAId: string, userBId: string) {

    let data: any;

    try {
      const response = await fetch(`/api/match/premium-match?userAId=${userAId}&userBId=${userBId}`, {method: "GET", credentials: "include",});
      
      if (response.status === 400) {
        // Uživatel nemá vyplněný dotazník
        const errorData = await response.text();
        throw new Error(errorData);
      }
      
      if (response.status === 404) {
        // Uživatel nebyl nalezen nebo nemá vyplněný dotazník
        throw new Error("Pro použití této funkce musíte mít vyplněný dotazník osobnosti.");
      }
      
      if (!response.ok) throw new Error("Failed to fetch premium match");

      data = await response.json();

      console.log("Match:", data);

    } catch (err) {
      console.error("Chyba při hledání shod:", err);
      throw err; 
    }

    return data ? data : null;
}

export async function getMatch(userAId: string, userBId: string) {

    let data: any;

    try {
      const response = await fetch(`/api/match/matches?userAId=${userAId}&userBId=${userBId}`, {method: "GET", credentials: "include",});
      
      if (response.status === 400) {
        // Uživatel nemá vyplněný dotazník
        const errorData = await response.text();
        throw new Error(errorData);
      }
      
      if (response.status === 404) {
        // Uživatel nebyl nalezen nebo nemá vyplněný dotazník
        throw new Error("Pro použití této funkce musíte mít vyplněný dotazník osobnosti.");
      }
      
      if (!response.ok) throw new Error("Failed to fetch match");

      data = await response.json();

      console.log("Match:", data);

    } catch (err) {
      console.error("Chyba při hledání shod:", err);
      throw err; 
    }

    return data ? data : null;
}