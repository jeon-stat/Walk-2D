import { CharacterViewer } from "../modules/character/components/CharacterViewer";
import { useCharacterStore } from "../modules/character/characterStore";
import { useDialogueStore } from "../modules/dialogue/dialogueStore";
import { useInventoryStore } from "../modules/inventory/inventoryStore";
import { useQuestStore } from "../modules/quest/questStore";
import { useRelationshipStore } from "../modules/relationship/relationshipStore";
import { useWorldStore } from "../modules/world/worldStore";
import { locationCatalog } from "../modules/location/locationCatalog";
import { timePeriodLabel } from "../modules/time/timeUtils";

type HomeScreenProps = {
  onAction: (actionId: "talk" | "move" | "time" | "save" | "load") => void;
};

export function HomeScreen({ onAction }: HomeScreenProps) {
  const character = useCharacterStore();
  const world = useWorldStore();
  const dialogue = useDialogueStore();
  const inventory = useInventoryStore();
  const relationships = useRelationshipStore();
  const quests = useQuestStore();

  const location = locationCatalog[world.locationId];
  const currentNpcName = dialogue.selectedNpcId;
  const latestMessage = dialogue.messages[dialogue.messages.length - 1];

  return (
    <div className="screen screen-home">
      <div className="screen-title-block">
        <p className="screen-kicker">Life Online</p>
        <h2>오늘의 상태</h2>
      </div>

      <section className="card stage-card">
        <div className="card-head">
          <div>
            <p className="card-label">Character</p>
            <h3>{location.name}</h3>
          </div>
          <div className="status-pill">
            {character.emotion} · {character.motion}
          </div>
        </div>
        <CharacterViewer />
      </section>

      <section className="card info-card">
        <div className="info-grid">
          <SummaryStat label="장소" value={location.name} detail={location.flavor} />
          <SummaryStat label="시간" value={world.currentTimeLabel} detail={timePeriodLabel(world.minutesOfDay)} />
          <SummaryStat label="대화" value={currentNpcName} detail={latestMessage?.text ?? "대기 중"} />
          <SummaryStat label="관계" value={`${relationships.npcs.length}명`} detail={`관계 항목 ${relationships.npcs.length}`} />
        </div>
      </section>

      <section className="card info-card">
        <div className="card-head">
          <div>
            <p className="card-label">Quick Actions</p>
            <h3>바로 이어서 하기</h3>
          </div>
        </div>
        <div className="button-grid">
          <button type="button" className="button" onClick={() => onAction("talk")}>대화</button>
          <button type="button" className="button" onClick={() => onAction("move")}>장소 이동</button>
          <button type="button" className="button" onClick={() => onAction("time")}>시간 진행</button>
          <button type="button" className="button" onClick={() => onAction("save")}>저장</button>
          <button type="button" className="button" onClick={() => onAction("load")}>불러오기</button>
        </div>
      </section>

      <section className="card info-card">
        <div className="card-head">
          <div>
            <p className="card-label">Summary</p>
            <h3>현재 데이터</h3>
          </div>
        </div>
        <div className="summary-grid">
          <MiniSummary label="인벤토리" value={`${inventory.items.length}개`} />
          <MiniSummary label="퀘스트" value={`${quests.quests.length}개`} />
          <MiniSummary label="관계" value={`${relationships.npcs.length}명`} />
          <MiniSummary label="대화 로그" value={`${dialogue.messages.length}개`} />
        </div>
      </section>
    </div>
  );
}

function SummaryStat({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="summary-stat">
      <span className="summary-stat-label">{label}</span>
      <strong className="summary-stat-value">{value}</strong>
      <p className="summary-stat-detail">{detail}</p>
    </div>
  );
}

function MiniSummary({ label, value }: { label: string; value: string }) {
  return (
    <div className="mini-summary">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
