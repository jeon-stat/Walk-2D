import type { CSSProperties } from "react";

import { theme } from "../constants/theme";

type BottomTabItem = {
  id: string;
  label: string;
  icon: string;
};

type BottomTabsProps = {
  items: BottomTabItem[];
  activeId: string;
  onChange: (id: string) => void;
};

export function BottomTabs({ items, activeId, onChange }: BottomTabsProps) {
  return (
    <nav style={styles.shell} aria-label="Primary">
      <div style={styles.row}>
        {items.map((item) => {
          const active = item.id === activeId;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              style={{ ...styles.item, ...(active ? styles.itemActive : null) }}
            >
              <span style={{ ...styles.icon, ...(active ? styles.iconActive : null) }}>{item.icon}</span>
              <span style={{ ...styles.label, ...(active ? styles.labelActive : null) }}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

const styles: Record<string, CSSProperties> = {
  shell: {
    borderTopWidth: 1,
    borderTopStyle: "solid",
    borderTopColor: theme.colors.border,
    backgroundColor: "rgba(248,247,244,0.96)",
    padding: "8px 12px 12px",
  },
  row: {
    display: "flex",
    gap: 8,
  },
  item: {
    flex: 1,
    minHeight: 50,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    color: theme.colors.inkSoft,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  itemActive: {
    backgroundColor: theme.colors.ink,
    borderColor: theme.colors.ink,
    color: "#ffffff",
  },
  icon: {
    fontSize: 11,
    fontWeight: 900,
    color: theme.colors.muted,
  },
  iconActive: {
    color: "#ffffff",
  },
  label: {
    fontSize: 11,
    fontWeight: 900,
    color: theme.colors.inkSoft,
  },
  labelActive: {
    color: "#ffffff",
  },
};
