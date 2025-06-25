export async function fetchWithAuth(input: RequestInfo, init?: RequestInit) {
  const res = await fetch(input, init);

  if (res.status === 403 && typeof window !== "undefined") {
    window.location.href = "/";
    return Promise.reject(new Error("Acesso não autorizado"));
  }

  return res;
}