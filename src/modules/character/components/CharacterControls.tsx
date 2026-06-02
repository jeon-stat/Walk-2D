import { partOptions } from "../data/characterCatalog";
import { emotions, motions } from "../types";
import { useCharacterStore } from "../characterStore";

export function CharacterControls() {
  const character = useCharacterStore();

  return (
    <div className="character-control-stack">
      <div className="control-block">
        <p className="control-title">Motion</p>
        <div className="button-grid">
          {motions.map((motion) => (
            <button
              key={motion}
              className={motion === character.motion ? "button active" : "button"}
              onClick={() => character.setMotion(motion)}
            >
              {motion}
            </button>
          ))}
        </div>
      </div>

      <div className="control-block">
        <p className="control-title">Emotion</p>
        <div className="button-grid">
          {emotions.map((emotion) => (
            <button
              key={emotion}
              className={emotion === character.emotion ? "button active" : "button"}
              onClick={() => character.setEmotion(emotion)}
            >
              {emotion}
            </button>
          ))}
        </div>
      </div>

      <div className="control-block">
        <p className="control-title">Parts</p>
        {Object.entries(partOptions).map(([part, options]) => (
          <div key={part} className="button-grid" style={{ marginBottom: "8px" }}>
            {options.map((option) => (
              <button
                key={option.id}
                className={character.appearance[part as keyof typeof character.appearance] === option.id ? "button active" : "button subtle"}
                onClick={() => character.setPart(part as keyof typeof character.appearance, option.id)}
              >
                {part}:{option.label}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
