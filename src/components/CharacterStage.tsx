import type { CSSProperties } from "react";

import { theme } from "../constants/theme";

type CharacterStageProps = {
  character: {
    label: string;
    palette?: {
      skin?: string;
      hair?: string;
      primary?: string;
      accent?: string;
      detail?: string;
      secondary?: string;
    };
  };
  state?: {
    sceneBackground?: string;
    animationClip?: string;
    bobAmount?: number;
    animationSpeed?: number;
  };
};

export function CharacterStage({ character, state }: CharacterStageProps) {
  const skin = character.palette?.skin ?? "#f7d9cf";
  const hair = character.palette?.hair ?? "#6b4a37";
  const primary = character.palette?.primary ?? "#f3f4f6";
  const accent = character.palette?.accent ?? "#585d66";
  const detail = character.palette?.detail ?? "#1f232b";

  return (
    <div style={{ ...styles.shell, background: `linear-gradient(180deg, ${state?.sceneBackground ?? "#f6f3ee"} 0%, #fff 100%)` }}>
      <div style={styles.stage}>
        <div style={{ ...styles.figure, transform: `translateY(${Math.round((state?.bobAmount ?? 0.04) * 18)}px)` }}>
          <div style={styles.shadow} />
          <div style={{ ...styles.head, backgroundColor: skin }}>
            <div style={{ ...styles.hair, backgroundColor: hair }} />
            <div style={{ ...styles.eye, left: "31%" }} />
            <div style={{ ...styles.eye, right: "31%" }} />
            <div style={{ ...styles.mouth, borderColor: detail }} />
          </div>
          <div style={{ ...styles.body, backgroundColor: primary, borderColor: accent }} />
          <div style={{ ...styles.leg, left: "34%" }} />
          <div style={{ ...styles.leg, right: "34%" }} />
          <div style={{ ...styles.arm, left: "12%" }} />
          <div style={{ ...styles.arm, right: "12%" }} />
          <div style={{ ...styles.accessory, borderColor: accent }} />
        </div>
      </div>
      <div style={styles.captionWrap}>
        <div style={styles.name}>{character.label}</div>
        <div style={styles.copy}>2D 파츠 미리보기는 나중에 실제 PNG로 교체할 수 있어요.</div>
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  shell: {
    height: 340,
    position: "relative",
    overflow: "hidden",
    borderRadius: 24,
    border: `1px solid ${theme.colors.border}`,
  },
  stage: {
    height: "100%",
    display: "grid",
    placeItems: "center",
  },
  figure: {
    position: "relative",
    width: 220,
    height: 290,
  },
  shadow: {
    position: "absolute",
    left: "50%",
    bottom: 10,
    width: 160,
    height: 24,
    borderRadius: 999,
    transform: "translateX(-50%)",
    background: "radial-gradient(circle, rgba(36,50,71,0.16), rgba(36,50,71,0) 72%)",
  },
  head: {
    position: "absolute",
    top: 14,
    left: "50%",
    transform: "translateX(-50%)",
    width: 92,
    height: 92,
    borderRadius: 999,
    border: `1px solid rgba(0,0,0,0.04)`,
    boxShadow: "0 10px 24px rgba(36,50,71,0.12)",
  },
  hair: {
    position: "absolute",
    left: -2,
    right: -2,
    top: -4,
    height: 42,
    borderRadius: "999px 999px 38px 38px",
  },
  eye: {
    position: "absolute",
    top: 44,
    width: 6,
    height: 6,
    borderRadius: 999,
    backgroundColor: theme.colors.ink,
  },
  mouth: {
    position: "absolute",
    left: "50%",
    top: 60,
    width: 20,
    height: 10,
    transform: "translateX(-50%)",
    borderBottomWidth: 3,
    borderBottomStyle: "solid",
    borderRadius: "0 0 999px 999px",
  },
  body: {
    position: "absolute",
    left: "50%",
    top: 102,
    width: 122,
    height: 124,
    transform: "translateX(-50%)",
    borderRadius: 28,
    borderWidth: 1,
    borderStyle: "solid",
    boxShadow: "0 20px 32px rgba(36,50,71,0.1)",
  },
  leg: {
    position: "absolute",
    bottom: 24,
    width: 22,
    height: 66,
    borderRadius: 999,
    backgroundColor: "#79808a",
  },
  arm: {
    position: "absolute",
    top: 132,
    width: 18,
    height: 76,
    borderRadius: 999,
    backgroundColor: "#f2d2c5",
  },
  accessory: {
    position: "absolute",
    left: "50%",
    top: 26,
    width: 116,
    height: 12,
    transform: "translateX(-50%)",
    borderTopWidth: 4,
    borderTopStyle: "solid",
    borderRadius: 999,
    opacity: 0.6,
  },
  captionWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 14,
    background: "linear-gradient(180deg, rgba(255,255,255,0), rgba(255,255,255,0.95) 45%, rgba(255,255,255,1))",
  },
  name: {
    color: theme.colors.ink,
    fontSize: 24,
    fontWeight: 900,
  },
  copy: {
    marginTop: 8,
    color: theme.colors.inkSoft,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: 700,
  },
};
