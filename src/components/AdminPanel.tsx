import type { CSSProperties } from "react";

import { theme } from "../constants/theme";

const ENERGY_OPTIONS = [
  { key: null, label: "Auto" },
  { key: 0, label: "0" },
  { key: 1, label: "1" },
  { key: 2, label: "2" },
  { key: 3, label: "3" },
  { key: 4, label: "4" },
  { key: 5, label: "5" },
  { key: 6, label: "6" },
];

const LONG_TERM_OPTIONS = [
  { key: null, label: "Auto" },
  { key: "WEAK", label: "Weak" },
  { key: "HEALTHY", label: "Healthy" },
  { key: "ACTIVE", label: "Active" },
];

const ENERGY_LABELS: Record<number, string> = {
  0: "Sitting Idle",
  1: "Yawn",
  2: "Breathing Idle",
  3: "Neutral Idle",
  4: "Walking",
  5: "Running",
  6: "Special",
};

const ENERGY_6_SPECIAL_OPTIONS = [
  { key: null, label: "Auto" },
  { key: "hipHopDancing", label: "Special 1" },
];

export function AdminPanel({
  admin,
  behavior,
}: {
  admin: {
    visible: boolean;
    canOverride: boolean;
    skinTones: ReadonlyArray<{ id: string; label: string; color: string }>;
    skinToneId: string | null;
    forcedEnergyLevel: number | null;
    forcedLongTermState: string | null;
    forcedSpecialActionKey: string | null;
    setSkinTone: (id: string | null) => void;
    toggleVisible: () => void;
    setForcedEnergyLevel: (value: number | null) => void;
    setForcedLongTermState: (value: string | null) => void;
    setForcedSpecialActionKey: (value: string | null) => void;
    resetBehavior?: () => void;
  };
  behavior?: {
    energyLevel?: number;
    longTermState?: string;
    animationClip?: string;
    specialActionPool?: Array<{ key: string; label?: string; weight: number }>;
    specialActionChance?: number;
  } | null;
}) {
  if (!admin?.visible || !admin?.canOverride) {
    return null;
  }

  const currentEnergyLevel = behavior?.energyLevel ?? 3;
  const currentEnergyLabel = ENERGY_LABELS[currentEnergyLevel] ?? "Unknown";
  const selectedSkinTone = admin.skinTones?.find((tone) => tone.id === admin.skinToneId) ?? null;
  const forcedEnergyLevel = admin.forcedEnergyLevel ?? null;
  const forcedLongTermState = admin.forcedLongTermState ?? null;
  const forcedSpecialActionKey = admin.forcedSpecialActionKey ?? null;
  const specialChanceRows = buildSpecialChanceRows(behavior?.specialActionPool ?? []);
  const specialChanceLabel = formatSpecialChanceLabel(behavior?.specialActionChance ?? 1);
  const forcedSpecialActionLabel = formatSpecialActionSelectionLabel(forcedSpecialActionKey);

  return (
    <div style={styles.shell}>
      <div style={styles.title}>개발자 패널</div>
      <div style={styles.caption}>
        에너지 단계, 스페셜 동작, 장기 상태, 피부톤만 조작할 수 있는 개발자용 패널이에요.
      </div>

      <div style={styles.summaryCard}>
        <SummaryLine label="Current Energy" value={`${currentEnergyLevel} / ${currentEnergyLabel}`} />
        <SummaryLine label="Current Long Term" value={behavior?.longTermState ?? "Unknown"} />
        <SummaryLine label="Current Clip" value={behavior?.animationClip ?? "neutral-idle"} />
        <SummaryLine
          label="Forced Energy"
          value={forcedEnergyLevel === null ? "Auto" : `${forcedEnergyLevel} / ${ENERGY_LABELS[forcedEnergyLevel] ?? "Unknown"}`}
        />
        <SummaryLine label="Energy 6 Special" value={forcedSpecialActionLabel} />
        <SummaryLine label="Forced Long Term" value={forcedLongTermState ?? "Auto"} />
        <SummaryLine label="Skin Tone" value={selectedSkinTone ? selectedSkinTone.label : "None"} />
      </div>

      <Section title="Energy Override">
        <OptionRow items={ENERGY_OPTIONS} selected={forcedEnergyLevel} onSelect={admin.setForcedEnergyLevel} />
      </Section>

      <Section title="Long-Term State">
        <OptionRow items={LONG_TERM_OPTIONS} selected={forcedLongTermState} onSelect={admin.setForcedLongTermState} />
      </Section>

      <Section title="Energy 6 Special">
        <div style={styles.sectionNote}>Choose which special action to force when Energy Level is 6.</div>
        <OptionRow items={ENERGY_6_SPECIAL_OPTIONS} selected={forcedSpecialActionKey} onSelect={admin.setForcedSpecialActionKey} />
      </Section>

      <Section title="Energy 6 Chance">
        <div style={styles.sectionNote}>Only used when Energy Level is 6.</div>
        <div style={styles.sectionNote}>{specialChanceLabel}</div>
        {specialChanceRows.length ? (
          <div style={styles.chanceList}>
            {specialChanceRows.map((row) => (
              <div key={row.key} style={styles.chanceRow}>
                <div style={styles.chanceLabel}>{row.label}</div>
                <div style={styles.chanceValue}>{row.percentLabel}</div>
              </div>
            ))}
          </div>
        ) : (
          <div style={styles.sectionNote}>No special-action pool is available.</div>
        )}
      </Section>

      <Section title="Skin Tone">
        <div style={styles.skinToneGrid}>
          {(admin.skinTones ?? []).map((tone) => {
            const selected = admin.skinToneId === tone.id;
            return (
              <button
                key={tone.id}
                type="button"
                onClick={() => admin.setSkinTone(tone.id)}
                style={{ ...styles.skinToneChip, ...(selected ? styles.skinToneChipSelected : null) }}
              >
                <div style={{ ...styles.skinToneSwatch, backgroundColor: tone.color }} />
                <div style={styles.skinToneLabel}>{tone.label}</div>
              </button>
            );
          })}
        </div>
      </Section>

      <button
        type="button"
        onClick={() => {
          admin.resetBehavior?.();
          admin.setSkinTone(admin.skinTones?.[0]?.id ?? null);
        }}
        style={styles.resetButton}
      >
        <div style={styles.resetLabel}>Reset Admin Overrides</div>
      </button>
    </div>
  );
}

function SummaryLine({ label, value }: { label: string; value: string }) {
  return (
    <div style={styles.summaryLine}>
      <div style={styles.summaryLabel}>{label}</div>
      <div style={styles.summaryValue}>{String(value)}</div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={styles.section}>
      <div style={styles.sectionTitle}>{title}</div>
      {children}
    </div>
  );
}

function OptionRow({
  items,
  selected,
  onSelect,
}: {
  items: Array<{ key: string | number | null; label: string }>;
  selected: string | number | null;
  onSelect: (value: any) => void;
}) {
  return (
    <div style={styles.optionRow}>
      {items.map((item) => {
        const active = selected === item.key;
        return (
          <button
            key={String(item.key ?? "auto")}
            type="button"
            onClick={() => onSelect?.(item.key)}
            style={{ ...styles.optionChip, ...(active ? styles.optionChipSelected : null) }}
          >
            <div style={styles.optionLabel}>{item.label}</div>
          </button>
        );
      })}
    </div>
  );
}

function buildSpecialChanceRows(actions: Array<{ key: string; label?: string; weight: number }>) {
  const validActions = actions.filter((action) => Number.isFinite(action.weight) && action.weight > 0);
  const totalWeight = validActions.reduce((sum, action) => sum + action.weight, 0);

  if (!totalWeight) {
    return [];
  }

  return validActions.map((action, index) => {
    const label = `Special ${index + 1}`;
    const actionLabel = action.label ?? action.key;
    const percent = Math.round((action.weight / totalWeight) * 100);

    return {
      key: action.key,
      label: `${label} (${actionLabel})`,
      percentLabel: `${percent}%`,
    };
  });
}

function formatSpecialChanceLabel(specialChance = 1) {
  const percent = Math.max(0, Math.min(100, Math.round(specialChance * 100)));
  return `Special actions total: ${percent}%`;
}

function formatSpecialActionSelectionLabel(key: string | null) {
  if (key === null) {
    return "Auto";
  }

  if (key === "hipHopDancing") {
    return "Special 1 (Hip Hop Dancing)";
  }

  return String(key);
}

const styles: Record<string, CSSProperties> = {
  shell: {
    position: "relative",
    width: "100%",
    maxWidth: "100%",
    borderRadius: theme.radius.xl,
    padding: 14,
    backgroundColor: "rgba(255, 250, 244, 0.96)",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#efd7c4",
    boxShadow: "0 8px 18px rgba(0,0,0,0.09)",
    display: "grid",
    gap: 12,
  },
  title: {
    color: theme.colors.ink,
    fontSize: 17,
    fontWeight: 900,
  },
  caption: {
    color: theme.colors.inkSoft,
    fontSize: 12,
    lineHeight: "17px",
    fontWeight: 700,
  },
  summaryCard: {
    borderRadius: theme.radius.lg,
    padding: 12,
    backgroundColor: "#fffdf9",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#efcfbc",
    display: "grid",
    gap: 7,
  },
  summaryLine: {
    display: "grid",
    gap: 2,
  },
  summaryLabel: {
    color: theme.colors.inkSoft,
    fontSize: 10,
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  summaryValue: {
    color: theme.colors.ink,
    fontSize: 13,
    fontWeight: 900,
  },
  section: {
    display: "grid",
    gap: 8,
  },
  sectionTitle: {
    color: theme.colors.ink,
    fontSize: 12,
    fontWeight: 900,
  },
  sectionNote: {
    color: theme.colors.inkSoft,
    fontSize: 11,
    lineHeight: "16px",
    fontWeight: 700,
  },
  optionRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
  },
  optionChip: {
    minWidth: 56,
    borderRadius: theme.radius.pill,
    padding: "9px 12px",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#efcfbc",
    color: theme.colors.ink,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  optionChipSelected: {
    backgroundColor: "#fff0e5",
    borderColor: "#b45c3a",
  },
  optionLabel: {
    color: theme.colors.ink,
    fontSize: 12,
    fontWeight: 900,
  },
  chanceList: {
    display: "grid",
    gap: 8,
  },
  chanceRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: theme.radius.md,
    padding: "10px 10px",
    backgroundColor: "#fff8f2",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#efd6c2",
  },
  chanceLabel: {
    color: theme.colors.ink,
    fontSize: 12,
    fontWeight: 900,
  },
  chanceValue: {
    color: "#9f4e33",
    fontSize: 12,
    fontWeight: 900,
  },
  skinToneGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
  },
  skinToneChip: {
    minWidth: 82,
    borderRadius: theme.radius.md,
    padding: "10px 10px",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#efcfbc",
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  skinToneChipSelected: {
    backgroundColor: "#fff0e5",
    borderColor: "#b45c3a",
  },
  skinToneSwatch: {
    width: 18,
    height: 18,
    borderRadius: 999,
    border: "1px solid rgba(0,0,0,0.08)",
  },
  skinToneLabel: {
    color: theme.colors.ink,
    fontSize: 12,
    fontWeight: 900,
  },
  resetButton: {
    marginTop: 2,
    borderRadius: theme.radius.md,
    padding: "12px 0",
    border: "none",
    backgroundColor: "#fce7d8",
    color: "#9f4e33",
  },
  resetLabel: {
    color: "#9f4e33",
    fontSize: 12,
    fontWeight: 900,
    textAlign: "center",
  },
};
