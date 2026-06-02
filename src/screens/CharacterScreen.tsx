import { CharacterViewer } from "../modules/character/components/CharacterViewer";
import { useCharacterStore } from "../modules/character/characterStore";
import { emotions, motions } from "../modules/character/types";
import { partOptions } from "../modules/character/data/characterCatalog";

export function CharacterScreen() {
  const character = useCharacterStore();

  return (
    <div className="screen screen-character">
      <div className="screen-title-block">
        <p className="screen-kicker">Life Online</p>
        <h2>캐릭터</h2>
      </div>

      <section className="card stage-card">
        <div className="card-head">
          <div>
            <p className="card-label">2D Parts</p>
            <h3>캐릭터 미리보기</h3>
          </div>
          <div className="status-pill">{character.emotion} · {character.motion}</div>
        </div>
        <CharacterViewer />
      </section>

      <section className="card info-card">
        <div className="card-head">
          <div>
            <p className="card-label">Motion</p>
            <h3>idle / walk / run</h3>
          </div>
        </div>
        <div className="button-grid">
          {motions.map((motion) => (
            <button
              key={motion}
              type="button"
              className={character.motion === motion ? "button active" : "button"}
              onClick={() => character.setMotion(motion)}
            >
              {motion}
            </button>
          ))}
        </div>
      </section>

      <section className="card info-card">
        <div className="card-head">
          <div>
            <p className="card-label">Emotion</p>
            <h3>표정</h3>
          </div>
        </div>
        <div className="button-grid">
          {emotions.map((emotion) => (
            <button
              key={emotion}
              type="button"
              className={character.emotion === emotion ? "button active" : "button"}
              onClick={() => character.setEmotion(emotion)}
            >
              {emotion}
            </button>
          ))}
        </div>
      </section>

      <section className="card info-card">
        <div className="card-head">
          <div>
            <p className="card-label">Parts Registry</p>
            <h3>파츠 교체</h3>
          </div>
        </div>

        {Object.entries(partOptions).map(([part, options]) => (
          <div key={part} className="part-block">
            <strong className="part-title">{part}</strong>
            <div className="button-grid">
              {options.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className={character.appearance[part as keyof typeof character.appearance] === option.id ? "button active" : "button subtle"}
                  onClick={() => character.setPart(part as keyof typeof character.appearance, option.id)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
