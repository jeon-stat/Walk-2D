import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

import { createLocalAccount, loadAuthState, loginWithHandle, logoutLocalAccount, type AuthAccount, type AuthState } from "./authStorage";

type AuthContextValue = {
  currentUser: AuthAccount | null;
  accounts: AuthAccount[];
  isAuthenticated: boolean;
  signUp: (input: { handle: string; nickname: string }) => void;
  signIn: (handle: string) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>(() => loadAuthState());

  const value = useMemo<AuthContextValue>(() => {
    const currentUser = authState.accounts.find((account) => account.id === authState.sessionId) ?? null;

    return {
      currentUser,
      accounts: authState.accounts,
      isAuthenticated: Boolean(currentUser),
      signUp: ({ handle, nickname }) => {
        const next = createLocalAccount({ handle, nickname });
        setAuthState(next);
      },
      signIn: (handle) => {
        const next = loginWithHandle(handle);
        setAuthState(next);
      },
      signOut: () => {
        const next = logoutLocalAccount();
        setAuthState(next);
      },
    };
  }, [authState]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
