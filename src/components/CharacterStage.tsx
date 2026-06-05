import type { CSSProperties } from "react";

import { theme } from "../constants/theme";
import basicCharacterPng from "../assets/character/basic-character.png";

type CharacterStageProps = {
  character: {
    label: string;
  };
  state?: unknown;
};

export function CharacterStage({ character }: CharacterStageProps) {
  return (
    <div style={styles.shell}>
      <div style={styles.stage}>
        <div style={styles.imageFrame}>
          <img src={basicCharacterPng} alt={character.label} style={styles.image} draggable={false} />
        </div>
      </div>
      <div style={styles.captionWrap}>
        <div style={styles.name}>{character.label}</div>
        <div style={styles.copy}>2D basic PNG character</div>
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
    background:
      "radial-gradient(circle at 50% 34%, rgba(255, 132, 54, 0.22) 0%, rgba(20, 10, 4, 0.92) 46%, #000 100%)",
  },
  stage: {
    height: "100%",
    display: "grid",
    placeItems: "center",
    padding: 16,
  },
  imageFrame: {
    width: "100%",
    height: "100%",
    display: "grid",
    placeItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    maxWidth: 250,
    maxHeight: 300,
    objectFit: "contain",
    objectPosition: "center center",
    userSelect: "none",
    pointerEvents: "none",
    filter: "drop-shadow(0 18px 32px rgba(0, 0, 0, 0.45))",
  },
  captionWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 14,
    background: "linear-gradient(180deg, rgba(0,0,0,0), rgba(0,0,0,0.82) 58%, rgba(0,0,0,0.94))",
  },
  name: {
    color: "#fff",
    fontSize: 20,
    fontWeight: 900,
  },
  copy: {
    marginTop: 6,
    color: "rgba(255,255,255,0.72)",
    fontSize: 13,
    lineHeight: 18,
    fontWeight: 700,
  },
};
