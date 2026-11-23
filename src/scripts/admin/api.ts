// Browser-side calls to the API from /admin. /api is on the same origin
// (nginx in production, Vite's proxy in development). The JWT from the login
// is kept in localStorage and sent as a Bearer token; a 401 sends the user
// back to the login page.

const TOKEN_KEY = "umut-admin-token";
export const LOGIN_PATH = "/admin/connexion";

export const getToken = (): string | null => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const setToken = (token: string) => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // Private mode with storage blocked: the session lasts until reload
  }
};

export const clearToken = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // Nothing to clear
  }
};

export const goToLogin = () => {
  const next = encodeURIComponent(location.pathname);
  location.assign(`${LOGIN_PATH}?next=${next}`);
};

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

// The API answers in English; these are the messages Umut may see
const translate = (status: number, message: string): string => {
  // 0: no network; 502–504: nginx (or Vite's proxy) can't reach the API
  if (status === 0 || (status >= 502 && status <= 504))
    return "Le serveur ne répond pas. Vérifiez votre connexion et réessayez dans un instant.";
  if (status >= 500) return "Erreur du serveur. Réessayez ; si cela continue, prévenez votre développeur.";
  if (status === 401) return "Identifiant ou mot de passe incorrect.";
  if (status === 413) return "Fichier trop lourd (15 Mo maximum).";
  if (status === 429) return "Trop de tentatives. Réessayez dans quelques minutes.";
  // Only unique field edited in /admin: a programme's slug
  if (status === 409) return "Cette adresse de page est déjà utilisée par une autre offre.";
  if (/validation failed/i.test(message)) return `Champ invalide : ${message.replace(/^.*validation failed:\s*/i, "")}`;
  // Messages written in French by the API (consent, upload formats…) are kept
  if (/[àâçéèêëîïôûùüÿœ]/i.test(message)) return message;
  return `Erreur ${status} : ${message}`;
};

export const api = async <T = unknown>(path: string, init: RequestInit & { json?: unknown } = {}): Promise<T> => {
  const headers = new Headers(init.headers);
  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const { json, ...rest } = init;
  let body = rest.body ?? null;
  if (json !== undefined) {
    headers.set("Content-Type", "application/json");
    body = JSON.stringify(json);
  }

  let res: Response;
  try {
    res = await fetch(`/api${path}`, { ...rest, headers, body });
  } catch {
    throw new ApiError(0, translate(0, ""));
  }

  if (res.status === 401 && token) {
    // Expired or revoked session (the login call itself has no token yet)
    clearToken();
    goToLogin();
    throw new ApiError(401, "Session expirée.");
  }
  if (res.status === 204) return undefined as T;
  const data = (await res.json().catch(() => ({}))) as { message?: string };
  if (!res.ok) throw new ApiError(res.status, translate(res.status, data.message ?? res.statusText));
  return data as T;
};

/** Run on every admin page except the login: no token → login page */
export const requireLogin = () => {
  if (!getToken()) goToLogin();
};

export const errorText = (err: unknown) => (err instanceof Error ? err.message : "Une erreur est survenue.");
