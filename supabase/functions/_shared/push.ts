export type ExpoPushMessage = {
  to: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
};

export type ExpoPushTicket = {
  status: "ok" | "error";
  id?: string;
  message?: string;
  details?: Record<string, unknown>;
};

const EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";
const EXPO_BATCH_SIZE = 100;

/**
 * Sends push notifications via the Expo Push API.
 * Returns one ticket per message, in the same order as the input array.
 * On a batch-level HTTP failure, all messages in that batch get an error ticket.
 */
export async function sendExpoPushNotifications(
  messages: ExpoPushMessage[],
  expoAccessToken: string,
): Promise<ExpoPushTicket[]> {
  const allTickets: ExpoPushTicket[] = [];

  for (let i = 0; i < messages.length; i += EXPO_BATCH_SIZE) {
    const batch = messages.slice(i, i + EXPO_BATCH_SIZE);

    let response: Response;
    try {
      response = await fetch(EXPO_PUSH_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${expoAccessToken}`,
        },
        body: JSON.stringify(batch),
      });
    } catch (err) {
      console.error("Expo API fetch error:", err);
      allTickets.push(...batch.map(() => ({ status: "error" as const, message: "fetch failed" })));
      continue;
    }

    if (!response.ok) {
      console.error(`Expo API HTTP error: ${response.status}`);
      allTickets.push(...batch.map(() => ({ status: "error" as const, message: `HTTP ${response.status}` })));
      continue;
    }

    const result = await response.json();
    const tickets: ExpoPushTicket[] = result.data ?? [];
    allTickets.push(...tickets);
  }

  return allTickets;
}
