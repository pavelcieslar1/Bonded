export async function getHoroscope(userZodiacSign: string){
      
    let horoscopeText: string = "";

    try {
        const res = await fetch("/api/gemini/get-horoscope", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userZodiacSign)
        });
        const result: string = await res.text();
        horoscopeText = result;
    } catch (error) {
        console.error("Chyba volání Gemini API pro horoskop:", error);
        horoscopeText = "Nastala chyba při načítání horoskopu. Zkuste to prosím později.";
    }
    
    return horoscopeText;
}

export async function getMessageHint(partnerId: string, chatContent: string){

    let messageText: string = "";

     try {
        const res = await fetch("/api/gemini/get-hint-message", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            partnerId: partnerId,
            chatContent: chatContent
        })
        });
        const result: string = await res.text();
        messageText = result;
    } catch (error) {
        console.error("Chyba volání Gemini API pro nápovědu");
        messageText = "Nastala chyba. Zkuste to později.";
    }

    return messageText;

}