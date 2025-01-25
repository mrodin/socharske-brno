export const fetchWithAuth = async <T>(
  url: string,
  token: string,
  options: {
    method: "GET" | "POST";
    body?: object;
  }
): Promise<T> => {
  const response = await fetch(url, {
    method: options.method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    throw new Error(`Response to ${url.split("/").pop()} was not ok.`);
  }

  return response.json();
};
