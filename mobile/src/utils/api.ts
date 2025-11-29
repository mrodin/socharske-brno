import { supabase } from "./supabase";

export const fetchWithAuth = async <T>(
  url: string,
  token: string,
  options: {
    body?: object;
  }
): Promise<T> => {
  const { error, data } = await supabase.functions.invoke(url, {
    headers: { Authorization: `Bearer ${token}` },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (error) {
    throw new Error(`Response to ${url.split("/").pop()} was not ok.`);
  }

  return data;
};
