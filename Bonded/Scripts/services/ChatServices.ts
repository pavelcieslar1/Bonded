export async function getChats() {
      const res = await fetch("/api/chat/list", { credentials: "include" });
  if (!res.ok) {
    console.error("Nepodařilo se načíst seznam chatů");
    return []; 
  }

  return await res.json();
}

export async function getMessages(chatId: number) {
    const res = await fetch(`/api/chat/${chatId}`, { credentials: "include" });
    return res.ok ? await res.json() : [];
}

export async function sendMessage(chatId: number, content: string) {
    return await fetch(`/api/chat/${chatId}/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(content)
    });
}

export async function startChat(recipientId: string): Promise<number | null> {
    const res = await fetch(`/api/chat/start/${recipientId}`, {
        method: "POST",
        credentials: "include"
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.chatId;
}
