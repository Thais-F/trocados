export async function readErrorMessage(res: Response, fallback = "Algo deu errado.") {
  try {
    const data = await res.json();
    return data?.error ?? fallback;
  } catch {
    return fallback;
  }
}
