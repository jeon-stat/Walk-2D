import type { CSSProperties } from "react";

import { useAuth } from "../auth/AuthProvider";
import { theme } from "../constants/theme";
import { useStepData } from "../data/stepDataProvider";
import { buildCharacterViewModel } from "../game/characterState";

const LONG_TERM_META: Record<
  string,
  { label: string; description: string; color: string; softBg: string; border: string; icon: string }
> = {
  WEAK: {
    label: "허약",
    description: "아직은 자주 쉬고 싶어해요.",
    color: "#b06d57",
    softBg: "#fff3ee",
    border: "#f0d1c5",
    icon: "😵",
  },
  HEALTHY: {
    label: "건강",
    description: "안정적으로 산책할 수 있어요.",
    color: "#4f7a57",
    softBg: "#eef8ee",
    border: "#cfe8cf",
    icon: "🙂",
  },
  ACTIVE: {
    label: "활발",
    description: "움직임이 가볍고 에너지가 넘쳐요.",
    color: "#c06b3e",
    softBg: "#fff2e4",
    border: "#f3d0b0",
    icon: "✨",
  },
};

const CUSTOMIZATION_SLOTS = [
  { key: "hair", label: "헤어", note: "준비 중" },
  { key: "clothes", label: "의상", note: "준비 중" },
  { key: "expression", label: "표정", note: "준비 중" },
  { key: "background", label: "배경", note: "준비 중" },
];

export function CharacterScreen() {
  const { currentUser, signOut } = useAuth();
  const { today, history, goal, admin } = useStepData();
  const viewState = buildCharacterViewModel({ todayRecord: today, history, goal, admin });

  const profileName = currentUser?.nickname?.trim() || "내 산책 파트너";
  const profileHandle = currentUser?.handle ? `@${currentUser.handle}` : "@walk";
  const longTermMeta = LONG_TERM_META[viewState.longTermState] ?? LONG_TERM_META.HEALTHY;
  const growth = viewState.growth ?? {};

  return (
    <div style={styles.screen}>
      <div style={styles.content}>
        <div style={styles.pageTitleWrap}>
          <div style={styles.pageTitle}>캐릭터</div>
        </div>

        <div style={styles.profileCard}>
          <div style={styles.profileHeader}>
            <div style={styles.profileCopy}>
              <div style={styles.profileKicker}>내 캐릭터</div>
              <div style={styles.profileName}>{profileName}</div>
              <div style={styles.profileHandle}>{profileHandle}</div>
            </div>

            <div style={{ ...styles.stateBadge, backgroundColor: longTermMeta.softBg, borderColor: longTermMeta.border }}>
              <div style={styles.stateBadgeLabel}>{longTermMeta.icon}</div>
              <div style={{ ...styles.stateBadgeValue, color: longTermMeta.color }}>{longTermMeta.label}</div>
            </div>
          </div>

          <div style={styles.profileGrid}>
            <MiniStat icon="👣" label="누적" value={`${formatNumber(growth.lifetimeSteps ?? 0)}보`} />
            <MiniStat icon="🏁" label="달성" value={`${growth.achievedDays ?? 0}일`} />
            <MiniStat icon="🔥" label="연속" value={`${growth.streak ?? 0}일`} />
          </div>

          <div style={styles.profileFooter}>
            <button type="button" onClick={signOut} style={styles.signOutButton}>
              <span style={styles.signOutLabel}>로그아웃</span>
            </button>
          </div>
        </div>

        <div style={styles.card}>
          <SectionHeader title="장기 상태" />
          <div style={{ ...styles.longTermBanner, backgroundColor: longTermMeta.softBg, borderColor: longTermMeta.border }}>
            <div style={styles.longTermIcon}>{longTermMeta.icon}</div>
            <div style={styles.longTermCopy}>
              <div style={{ ...styles.longTermBannerLabel, color: longTermMeta.color }}>{longTermMeta.label}</div>
              <div style={styles.longTermBannerDescription}>{longTermMeta.description}</div>
            </div>
          </div>
        </div>

        <div style={styles.card}>
          <SectionHeader title="성장 기록" />
          <div style={styles.metricGrid}>
            <MetricCard icon="👣" label="누적" value={`${formatNumber(growth.lifetimeSteps ?? 0)}보`} />
            <MetricCard icon="🏁" label="달성" value={`${growth.achievedDays ?? 0}일`} />
            <MetricCard icon="🔥" label="연속" value={`${growth.streak ?? 0}일`} />
            <MetricCard icon="✨" label="기록" value={viewState.growthLabel ?? "성장 중"} />
          </div>
        </div>

        <div style={styles.card}>
          <SectionHeader title="피부 톤" />
          <div style={styles.skinToneGrid}>
            {(admin.skinTones ?? []).map((tone) => {
              const selected = admin.skinToneId === tone.id;

              return (
                <button
                  key={tone.id}
                  type="button"
                  onClick={() => admin.setSkinTone?.(tone.id)}
                  style={{ ...styles.skinToneChip, ...(selected ? styles.skinToneChipSelected : null) }}
                >
                  <div style={{ ...styles.skinToneSwatch, backgroundColor: tone.color }} />
                  <div style={styles.skinToneTextBlock}>
                    <div style={styles.skinToneLabel}>{tone.label}</div>
                    <div style={styles.skinToneNote}>{selected ? "선택됨" : "탭해서 적용"}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div style={styles.card}>
          <SectionHeader title="준비 중" />
          <div style={styles.customizationGrid}>
            {CUSTOMIZATION_SLOTS.map((slot) => (
              <div key={slot.key} style={styles.placeholderCard}>
                <div style={styles.placeholderLabel}>{slot.label}</div>
                <div style={styles.placeholderNote}>{slot.note}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div style={styles.sectionHeader}>
      <div style={styles.sectionTitle}>{title}</div>
    </div>
  );
}

function MiniStat({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div style={styles.infoTile}>
      <div style={styles.infoTileLabel}>
        {icon} {label}
      </div>
      <div style={styles.infoTileValue}>{value}</div>
    </div>
  );
}

function MetricCard({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div style={styles.metricCard}>
      <div style={styles.metricLabel}>
        {icon} {label}
      </div>
      <div style={styles.metricValue}>{value}</div>
    </div>
  );
}

function formatNumber(value: number) {
  return Number(value ?? 0).toLocaleString("ko-KR");
}

const styles: Record<string, CSSProperties> = {
  screen: {
    flex: 1,
    backgroundColor: theme.colors.appBackground,
  },
  content: {
    padding: "16px 16px 16px",
    display: "grid",
    gap: theme.spacing.md,
  },
  pageTitleWrap: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "4px 0",
  },
  pageTitle: {
    color: theme.colors.ink,
    fontSize: 22,
    fontWeight: 900,
    letterSpacing: 0.6,
  },
  profileCard: {
    borderRadius: theme.radius.xl,
    padding: 18,
    backgroundColor: "#fffaf2",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#f0dcc3",
    boxShadow: "0 8px 18px rgba(36,50,71,0.08)",
    display: "grid",
    gap: 14,
  },
  profileHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
  },
  profileCopy: {
    flex: 1,
    display: "grid",
    gap: 4,
  },
  profileKicker: {
    color: "#c57c3a",
    fontSize: 11,
    fontWeight: 900,
    letterSpacing: 1.1,
    textTransform: "uppercase",
  },
  profileName: {
    color: theme.colors.ink,
    fontSize: 26,
    lineHeight: "32px",
    fontWeight: 900,
  },
  profileHandle: {
    color: theme.colors.inkSoft,
    fontSize: 13,
    fontWeight: 800,
  },
  stateBadge: {
    minWidth: 96,
    borderRadius: theme.radius.lg,
    padding: "10px 12px",
    borderWidth: 1,
    borderStyle: "solid",
    display: "grid",
    gap: 2,
    alignItems: "flex-start",
  },
  stateBadgeLabel: {
    fontSize: 14,
    fontWeight: 900,
  },
  stateBadgeValue: {
    fontSize: 13,
    fontWeight: 900,
  },
  profileGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
  },
  infoTile: {
    width: "31.8%",
    borderRadius: theme.radius.lg,
    padding: 12,
    backgroundColor: "#fffdf9",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: theme.colors.border,
    display: "grid",
    gap: 4,
  },
  infoTileLabel: {
    color: theme.colors.inkSoft,
    fontSize: 10,
    fontWeight: 800,
  },
  infoTileValue: {
    color: theme.colors.ink,
    fontSize: 13,
    fontWeight: 900,
  },
  profileFooter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  signOutButton: {
    padding: "9px 12px",
    borderRadius: theme.radius.pill,
    backgroundColor: "#162d28",
    color: "#ffffff",
    border: "none",
  },
  signOutLabel: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: 900,
  },
  card: {
    borderRadius: theme.radius.xl,
    padding: 16,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: theme.colors.border,
    display: "grid",
    gap: 12,
  },
  sectionHeader: {
    display: "grid",
    gap: 4,
  },
  sectionTitle: {
    color: theme.colors.ink,
    fontSize: 17,
    fontWeight: 900,
  },
  longTermBanner: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    borderRadius: theme.radius.lg,
    padding: 14,
    borderWidth: 1,
    borderStyle: "solid",
  },
  longTermIcon: {
    fontSize: 22,
  },
  longTermCopy: {
    flex: 1,
    display: "grid",
    gap: 2,
  },
  longTermBannerLabel: {
    fontSize: 18,
    fontWeight: 900,
  },
  longTermBannerDescription: {
    color: theme.colors.inkSoft,
    fontSize: 12,
    lineHeight: "18px",
    fontWeight: 700,
  },
  metricGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
  },
  metricCard: {
    width: "48.5%",
    borderRadius: theme.radius.lg,
    padding: 14,
    backgroundColor: theme.colors.surfaceMuted,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: theme.colors.border,
    display: "grid",
    gap: 4,
  },
  metricLabel: {
    color: theme.colors.inkSoft,
    fontSize: 10,
    fontWeight: 800,
  },
  metricValue: {
    color: theme.colors.ink,
    fontSize: 16,
    fontWeight: 900,
  },
  skinToneGrid: {
    display: "grid",
    gap: 8,
  },
  skinToneChip: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: 12,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surfaceMuted,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: theme.colors.border,
    textAlign: "left",
  },
  skinToneChipSelected: {
    borderColor: "#d99d78",
    backgroundColor: "#fff7ef",
  },
  skinToneSwatch: {
    width: 26,
    height: 26,
    borderRadius: 999,
    border: "1px solid rgba(0,0,0,0.08)",
  },
  skinToneTextBlock: {
    flex: 1,
  },
  skinToneLabel: {
    color: theme.colors.ink,
    fontSize: 13,
    fontWeight: 900,
  },
  skinToneNote: {
    marginTop: 2,
    color: theme.colors.inkSoft,
    fontSize: 11,
    fontWeight: 700,
  },
  customizationGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
  },
  placeholderCard: {
    width: "48.5%",
    minHeight: 92,
    borderRadius: theme.radius.lg,
    padding: 14,
    backgroundColor: theme.colors.surfaceMuted,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: theme.colors.border,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  placeholderLabel: {
    color: theme.colors.ink,
    fontSize: 14,
    fontWeight: 900,
  },
  placeholderNote: {
    color: theme.colors.inkSoft,
    fontSize: 12,
    fontWeight: 700,
  },
};
