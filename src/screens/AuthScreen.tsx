import type { CSSProperties } from "react";
import { useMemo, useState } from "react";

import { useAuth } from "../auth/AuthProvider";
import { theme } from "../constants/theme";

const MODES = [
  { id: "signup", label: "아이디 만들기" },
  { id: "signin", label: "로그인" },
];

const ERROR_COPY: Record<string, string> = {
  invalid_profile: "아이디와 닉네임을 모두 입력해 주세요.",
  handle_taken: "이미 사용 중인 아이디예요.",
  account_not_found: "존재하지 않는 아이디예요.",
};

export function AuthScreen() {
  const { accounts, signIn, signUp } = useAuth();
  const [mode, setMode] = useState(accounts.length ? "signin" : "signup");
  const [handle, setHandle] = useState("");
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");

  const subtitle = useMemo(
    () =>
      mode === "signup"
        ? "숫자를 채우는 앱이 아니라, 내 캐릭터의 하루를 함께 돌보는 산책 앱이에요."
        : "저장된 아이디로 다시 들어와서 오늘의 산책을 이어갈 수 있어요.",
    [mode],
  );

  function handleSubmit() {
    setError("");

    try {
      if (mode === "signup") {
        signUp({ handle, nickname });
        return;
      }

      signIn(handle);
    } catch (nextError) {
      const key = nextError instanceof Error ? nextError.message : "unknown";
      setError(ERROR_COPY[key] ?? "다시 시도해 주세요.");
    }
  }

  return (
    <div style={styles.screen}>
      <div style={styles.heroCard}>
        <div style={styles.brand}>Life Online</div>
        <div style={styles.title}>내 캐릭터와 걷기</div>
        <div style={styles.subtitle}>{subtitle}</div>
      </div>

      <div style={styles.modeRow}>
        {MODES.map((item) => {
          const active = item.id === mode;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setMode(item.id)}
              style={{ ...styles.modeButton, ...(active ? styles.modeButtonActive : null) }}
            >
              <span style={{ ...styles.modeLabel, ...(active ? styles.modeLabelActive : null) }}>{item.label}</span>
            </button>
          );
        })}
      </div>

      <div style={styles.formCard}>
        <div style={styles.fieldLabel}>아이디</div>
        <input
          value={handle}
          onChange={(event) => setHandle(event.target.value)}
          autoCapitalize="none"
          autoCorrect="off"
          placeholder="예: jeonwalk"
          style={styles.input}
        />

        {mode === "signup" ? (
          <>
            <div style={styles.fieldLabel}>닉네임</div>
            <input
              value={nickname}
              onChange={(event) => setNickname(event.target.value)}
              autoCapitalize="none"
              autoCorrect="off"
              placeholder="예: 지안"
              style={styles.input}
            />
          </>
        ) : null}

        {error ? <div style={styles.error}>{error}</div> : null}

        <button type="button" onClick={handleSubmit} style={styles.submitButton}>
          <span style={styles.submitLabel}>{mode === "signup" ? "산책 시작하기" : "다시 들어가기"}</span>
        </button>
      </div>

      <div style={styles.noteCard}>
        <div style={styles.noteTitle}>이 앱만의 방향</div>
        <div style={styles.noteText}>
          기록을 많이 쌓는 것보다, 내 캐릭터가 산책 습관에 따라 성격과 추억을 얻는 느낌을 더 중요하게 만들고 있어요.
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  screen: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: "20px 20px 20px",
    display: "grid",
    gap: theme.spacing.md,
  },
  heroCard: {
    borderRadius: theme.radius.xl,
    padding: theme.spacing.xl,
    backgroundColor: "#eef7f0",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#dbe9de",
  },
  brand: {
    color: theme.colors.inkSoft,
    fontSize: 13,
    fontWeight: 900,
  },
  title: {
    marginTop: 8,
    color: theme.colors.ink,
    fontSize: 32,
    fontWeight: 900,
  },
  subtitle: {
    marginTop: 12,
    color: theme.colors.inkSoft,
    fontSize: 15,
    lineHeight: "23px",
    fontWeight: 700,
  },
  modeRow: {
    display: "flex",
    gap: 8,
  },
  modeButton: {
    flex: 1,
    minHeight: 48,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modeButtonActive: {
    backgroundColor: theme.colors.ink,
    borderColor: theme.colors.ink,
  },
  modeLabel: {
    color: theme.colors.inkSoft,
    fontSize: 13,
    fontWeight: 900,
  },
  modeLabelActive: {
    color: "#ffffff",
  },
  formCard: {
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: theme.colors.border,
  },
  fieldLabel: {
    marginTop: 12,
    marginBottom: 8,
    color: theme.colors.ink,
    fontSize: 13,
    fontWeight: 900,
  },
  input: {
    width: "100%",
    minHeight: 52,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: theme.colors.border,
    padding: "0 16px",
    color: theme.colors.ink,
    fontSize: 15,
    fontWeight: 700,
    backgroundColor: "#ffffff",
  },
  error: {
    marginTop: 12,
    color: "#b75643",
    fontSize: 13,
    fontWeight: 800,
  },
  submitButton: {
    marginTop: 18,
    minHeight: 54,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.ink,
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "none",
  },
  submitLabel: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: 900,
  },
  noteCard: {
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    backgroundColor: "#fff8ee",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#f0dfc1",
  },
  noteTitle: {
    color: theme.colors.ink,
    fontSize: 16,
    fontWeight: 900,
  },
  noteText: {
    marginTop: 8,
    color: theme.colors.inkSoft,
    fontSize: 14,
    lineHeight: "22px",
    fontWeight: 700,
  },
};
