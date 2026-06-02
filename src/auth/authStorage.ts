export type AuthAccount = {
  id: string;
  handle: string;
  nickname: string;
  createdAt: string;
};

export type AuthState = {
  accounts: AuthAccount[];
  sessionId: string | null;
};

const STORAGE_KEY = "life-online-auth-v1";

let memoryState: AuthState = {
  accounts: [],
  sessionId: null,
};

function canUseLocalStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function normalizeState(value: Partial<AuthState> | null | undefined): AuthState {
  return {
    accounts: Array.isArray(value?.accounts) ? value.accounts : [],
    sessionId: value?.sessionId ?? null,
  };
}

export function loadAuthState(): AuthState {
  if (!canUseLocalStorage()) {
    return normalizeState(memoryState);
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return normalizeState(memoryState);
    return normalizeState(JSON.parse(raw) as Partial<AuthState>);
  } catch {
    return normalizeState(memoryState);
  }
}

export function saveAuthState(nextState: AuthState): AuthState {
  const normalized = normalizeState(nextState);
  memoryState = normalized;

  if (!canUseLocalStorage()) {
    return normalized;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  } catch {
    return normalized;
  }

  return normalized;
}

export function createLocalAccount({ handle, nickname }: { handle: string; nickname: string }): AuthState {
  const current = loadAuthState();
  const normalizedHandle = String(handle ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "");
  const normalizedNickname = String(nickname ?? "").trim();

  if (!normalizedHandle || !normalizedNickname) {
    throw new Error("invalid_profile");
  }

  if (current.accounts.some((account) => account.handle === normalizedHandle)) {
    throw new Error("handle_taken");
  }

  const account: AuthAccount = {
    id: `account-${Date.now()}`,
    handle: normalizedHandle,
    nickname: normalizedNickname,
    createdAt: new Date().toISOString(),
  };

  return saveAuthState({
    accounts: [account, ...current.accounts],
    sessionId: account.id,
  });
}

export function loginWithHandle(handle: string): AuthState {
  const current = loadAuthState();
  const normalizedHandle = String(handle ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "");

  const account = current.accounts.find((item) => item.handle === normalizedHandle);
  if (!account) {
    throw new Error("account_not_found");
  }

  return saveAuthState({
    ...current,
    sessionId: account.id,
  });
}

export function logoutLocalAccount(): AuthState {
  const current = loadAuthState();
  return saveAuthState({
    ...current,
    sessionId: null,
  });
}
