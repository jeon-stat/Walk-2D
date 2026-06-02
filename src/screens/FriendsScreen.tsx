import { useInventoryStore } from "../modules/inventory/inventoryStore";
import { useQuestStore } from "../modules/quest/questStore";
import { useRelationshipStore } from "../modules/relationship/relationshipStore";
import { npcCatalog } from "../modules/dialogue/dialogueSeed";

export function FriendsScreen() {
  const relationships = useRelationshipStore();
  const inventory = useInventoryStore();
  const quests = useQuestStore();

  return (
    <div className="screen screen-friends">
      <div className="screen-title-block">
        <p className="screen-kicker">Life Online</p>
        <h2>친구</h2>
      </div>

      <section className="card info-card">
        <div className="card-head">
          <div>
            <p className="card-label">Relationship</p>
            <h3>관계도</h3>
          </div>
        </div>
        <div className="relationship-list">
          {relationships.npcs.map((npc) => (
            <article key={npc.id} className="relationship-card">
              <div>
                <strong>{npc.name}</strong>
                <p>{npc.title}</p>
              </div>
              <div className="status-pill">호감도 {npc.affinity}</div>
            </article>
          ))}
        </div>
      </section>

      <section className="card info-card">
        <div className="card-head">
          <div>
            <p className="card-label">Inventory</p>
            <h3>인벤토리</h3>
          </div>
        </div>
        <div className="summary-list">
          {inventory.items.map((item) => (
            <article key={item.id} className="summary-row">
              <strong>{item.name}</strong>
              <p>{item.quantity}개 · {item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="card info-card">
        <div className="card-head">
          <div>
            <p className="card-label">Quest</p>
            <h3>퀘스트</h3>
          </div>
        </div>
        <div className="summary-list">
          {quests.quests.map((quest) => (
            <article key={quest.id} className="summary-row">
              <strong>{quest.title}</strong>
              <p>{quest.progress}/{quest.goal} · {quest.statusLabel}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="card info-card">
        <div className="card-head">
          <div>
            <p className="card-label">NPC Registry</p>
            <h3>연결 가능한 대상</h3>
          </div>
        </div>
        <div className="button-grid">
          {Object.values(npcCatalog).map((npc) => (
            <button key={npc.id} type="button" className="button subtle">
              {npc.name}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
