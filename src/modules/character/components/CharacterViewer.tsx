import { useEffect, useState } from "react";
import { getCharacterPartAsset } from "../data/assetRegistry";
import { motionRegistry } from "../data/animationRegistry";
import { characterParts } from "../types";
import { useCharacterStore } from "../characterStore";

export function CharacterViewer() {
  const character = useCharacterStore();
  const motion = motionRegistry[character.motion];
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    let active = true;
    const tick = () => {
      if (!active) {
        return;
      }
      setFrameIndex((current) => (current + 1) % motion.frames.length);
    };

    const id = window.setInterval(tick, motion.frameDurationMs);
    return () => {
      active = false;
      window.clearInterval(id);
    };
  }, [motion]);

  const frame = motion.frames[frameIndex];
  const visualScale = character.motion === "run" ? 1.03 : character.motion === "walk" ? 1.015 : 1;

  return (
    <div className="character-viewer">
      <div className="character-stage">
        <div
          className="character-silhouette"
          style={{
            transform: `translateY(${frame.offsetY}px) scale(${frame.scaleX * visualScale}, ${frame.scaleY}) rotate(${frame.rotate}deg)`
          }}
        >
          {characterParts.map((part) => (
            <img
              key={part}
              className="character-part"
              alt={part}
              src={getCharacterPartAsset(part, character.appearance[part], character.emotion)}
            />
          ))}
        </div>
      </div>
      <div className="character-floor" />
    </div>
  );
}
