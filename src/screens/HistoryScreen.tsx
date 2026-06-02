import { useDialogueStore } from "../modules/dialogue/dialogueStore";
import { useWorldStore } from "../modules/world/worldStore";
import { timePeriodLabel } from "../modules/time/timeUtils";

export function HistoryScreen() {
  const dialogue = useDialogueStore();
  const world = useWorldStore();

  return (
    <div className="screen screen-history">
      <div className="screen-title-block">
        <p className="screen-kicker">Life Online</p>
        <h2>기록</h2>
      </div>

      <section className="card info-card">
        <div className="card-head">
          <div>
            <p className="card-label">Timeline</p>
            <h3>최근 이벤트</h3>
          </div>
          <div className="status-pill">{world.currentDateLabel}</div>
        </div>

        <div className="timeline-list">
          {world.events.length ? (
            world.events.slice().reverse().map((event) => (
              <article key={event.id} className="timeline-item">
                <div className="timeline-head">
                  <strong>{event.title}</strong>
                  <span>{event.timestampLabel}</span>
                </div>
                <p>{event.detail}</p>
                <small>{event.kind}</small>
              </article>
            ))
          ) : (
            <div className="empty-state">
              <strong>아직 기록이 없습니다.</strong>
              <p>행동, 대화, 장소 이동이 여기에 쌓입니다.</p>
            </div>
          )}
        </div>
      </section>

      <section className="card info-card">
        <div className="card-head">
          <div>
            <p className="card-label">Dialogue</p>
            <h3>대화 로그</h3>
          </div>
          <div className="status-pill">{timePeriodLabel(world.minutesOfDay)}</div>
        </div>

        <div className="dialogue-log">
          {dialogue.messages.slice().reverse().map((message) => (
            <div key={message.id} className={`bubble ${message.speaker}`}>
              <span className="bubble-label">
                {message.speaker === "player" ? "나" : message.speaker === "npc" ? message.npcId ?? "NPC" : "System"}
              </span>
              <p>{message.text}</p>
              {message.emotion ? <small>{message.emotion}</small> : null}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
