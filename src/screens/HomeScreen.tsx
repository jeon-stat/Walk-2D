import type { CSSProperties } from "react";
import { useMemo } from "react";

import { CharacterStage } from "../components/CharacterStage";
import { StepProgressCard } from "../components/StepProgressCard";
import { CHARACTER_CLASSES } from "../characters";
import { theme } from "../constants/theme";
import { useStepData } from "../data/stepDataProvider";
import { LAST_UPDATED_LABEL } from "../generated/buildInfo";
import { buildCharacterViewModel } from "../game/characterState";

const ENERGY_STAGE_LABELS: Record<number, string> = {
  0: "완전 휴식",
  1: "졸림",
  2: "숨 고르기",
  3: "평온",
  4: "산책",
  5: "달리기",
  6: "최고",
};

const BACKGROUND_META: Record<string, { label: string; tone: string }> = {
  LOW_ENERGY: { label: "조용한 배경", tone: "#f2f0ea" },
  NORMAL_ENERGY: { label: "편안한 배경", tone: "#eef3f7" },
  HIGH_ENERGY: { label: "활발한 배경", tone: "#edf8f0" },
};

export function HomeScreen() {
  const { today, history, goal, admin } = useStepData();
  const character = useMemo(() => {
    const baseCharacter = CHARACTER_CLASSES[0];
    const selectedSkinTone = admin?.skinTones?.find((tone) => tone.id === admin?.skinToneId);

    if (!selectedSkinTone) {
      return baseCharacter;
    }

    return {
      ...baseCharacter,
      palette: {
        ...baseCharacter.palette,
        skin: selectedSkinTone.color,
      },
      skinTone: selectedSkinTone.color,
    };
  }, [admin?.skinToneId, admin?.skinTones]);

  const viewState = buildCharacterViewModel({ todayRecord: today, history, goal, admin });
  const currentActionLabel = viewState.currentAction?.label ?? viewState.animationClip ?? "Unknown";
  const backgroundLabel = BACKGROUND_META[viewState.backgroundState]?.label ?? "현재 배경";

  return (
    <div style={styles.screen}>
      <div style={styles.content}>
        <div style={styles.updatedAt}>{LAST_UPDATED_LABEL}</div>

        <div style={styles.stageWrap}>
          <CharacterStage character={character} state={viewState} />
        </div>

        <div style={styles.todayCard}>
          <div style={styles.cardHeader}>
            <div style={styles.cardTitle}>오늘 상태</div>
            <div style={styles.cardPrimary}>{viewState.statusLabel}</div>
          </div>

          <div style={styles.metaGrid}>
            <MetaChip icon="⚡" value={`E${viewState.energyLevel} · ${ENERGY_STAGE_LABELS[viewState.energyLevel] ?? "?"}`} />
            <MetaChip icon="🎯" value={`${Math.round(viewState.progressPercent ?? 0)}%`} />
            <MetaChip icon="👣" value={`${formatNumber(viewState.steps)}보`} />
          </div>

          <div style={styles.metaGridBottom}>
            <MetaLine label="배경" value={backgroundLabel} swatch={BACKGROUND_META[viewState.backgroundState]?.tone} />
            <MetaLine label="모션" value={currentActionLabel} />
          </div>
        </div>

        <StepProgressCard
          steps={viewState.steps}
          goal={viewState.goal}
          progressPercent={viewState.progressPercent}
          statusLabel={viewState.statusLabel}
        />
      </div>
    </div>
  );
}

function MetaChip({ icon, value }: { icon: string; value: string }) {
  return (
    <div style={styles.metaChip}>
      <div style={styles.metaIcon}>{icon}</div>
      <div style={styles.metaValue}>{value}</div>
    </div>
  );
}

function MetaLine({ label, value, swatch = null }: { label: string; value: string; swatch?: string | null }) {
  return (
    <div style={styles.metaLine}>
      <div style={styles.metaLineLabel}>{label}</div>
      <div style={styles.metaLineValueRow}>
        {swatch ? <div style={{ ...styles.metaSwatch, backgroundColor: swatch }} /> : null}
        <div style={styles.metaLineValue}>{value}</div>
      </div>
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
    padding: "6px 16px 16px",
    display: "grid",
    gap: theme.spacing.md,
  },
  updatedAt: {
    alignSelf: "flex-end",
    color: theme.colors.muted,
    fontSize: 11,
    fontWeight: 700,
  },
  stageWrap: {
    marginTop: 0,
    marginLeft: -6,
    marginRight: -6,
  },
  todayCard: {
    borderRadius: theme.radius.xl,
    padding: 18,
    backgroundColor: "rgba(255,255,255,0.88)",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "rgba(215, 198, 176, 0.9)",
    display: "grid",
    gap: 12,
  },
  cardHeader: {
    display: "grid",
    gap: 4,
  },
  cardTitle: {
    color: theme.colors.inkSoft,
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  cardPrimary: {
    color: theme.colors.ink,
    fontSize: 28,
    lineHeight: "34px",
    fontWeight: 900,
  },
  metaGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
  },
  metaChip: {
    flex: 1,
    minWidth: "30%",
    borderRadius: theme.radius.lg,
    padding: "10px 12px",
    backgroundColor: "#fffdf9",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: theme.colors.border,
    display: "grid",
    gap: 4,
  },
  metaIcon: {
    fontSize: 14,
    fontWeight: 900,
  },
  metaValue: {
    color: theme.colors.ink,
    fontSize: 12,
    lineHeight: "17px",
    fontWeight: 900,
  },
  metaGridBottom: {
    display: "flex",
    gap: 10,
  },
  metaLine: {
    flex: 1,
    minWidth: 0,
    paddingTop: 4,
  },
  metaLineLabel: {
    color: theme.colors.inkSoft,
    fontSize: 10,
    fontWeight: 800,
  },
  metaLineValueRow: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
  },
  metaLineValue: {
    color: theme.colors.ink,
    fontSize: 12,
    fontWeight: 900,
    minWidth: 0,
  },
  metaSwatch: {
    width: 16,
    height: 16,
    borderRadius: 999,
    border: "1px solid rgba(0,0,0,0.08)",
    flex: "0 0 auto",
  },
};
