import type { CSSProperties } from "react";

import { theme } from "../constants/theme";

export function StepProgressCard({
  steps,
  goal,
  progressPercent,
  statusLabel,
}: {
  steps: number;
  goal: number;
  progressPercent: number;
  statusLabel: string;
}) {
  const progressWidth = `${Math.max(0, Math.min(progressPercent, 100))}%`;

  return (
    <section style={styles.card}>
      <div style={styles.header}>
        <div style={styles.title}>👣 오늘</div>
        <div style={styles.status}>{statusLabel}</div>
      </div>

      <div style={styles.valueRow}>
        <div style={styles.steps}>{steps.toLocaleString()}</div>
        <div style={styles.goal}>/ {goal.toLocaleString()}보</div>
      </div>

      <div style={styles.track}>
        <div style={{ ...styles.fill, width: progressWidth }} />
      </div>

      <div style={styles.caption}>🎯 {Math.round(progressPercent)}%</div>
    </section>
  );
}

const styles: Record<string, CSSProperties> = {
  card: {
    borderRadius: theme.radius.lg,
    padding: "16px 18px",
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: theme.colors.border,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  title: {
    color: theme.colors.ink,
    fontSize: 16,
    fontWeight: 900,
  },
  status: {
    color: theme.colors.inkSoft,
    fontSize: 12,
    fontWeight: 800,
  },
  valueRow: {
    display: "flex",
    alignItems: "flex-end",
    marginTop: 10,
  },
  steps: {
    color: theme.colors.ink,
    fontSize: 32,
    fontWeight: 900,
    letterSpacing: -1,
  },
  goal: {
    marginLeft: 6,
    marginBottom: 4,
    color: theme.colors.muted,
    fontSize: 14,
    fontWeight: 800,
  },
  track: {
    marginTop: 14,
    height: 10,
    borderRadius: theme.radius.pill,
    overflow: "hidden",
    backgroundColor: "#ebe6de",
  },
  fill: {
    height: "100%",
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.accent,
  },
  caption: {
    marginTop: 8,
    color: theme.colors.inkSoft,
    fontSize: 12,
    fontWeight: 700,
  },
};
