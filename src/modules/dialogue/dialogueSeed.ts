import { CharacterEmotion } from "../character/types";

export type NpcRecord = {
  id: string;
  name: string;
  role: string;
};

export const npcCatalog: Record<string, NpcRecord> = {
  mina: { id: "mina", name: "Mina", role: "classmate" },
  jun: { id: "jun", name: "Jun", role: "coworker" }
};

export const dialoguePresets: Record<
  string,
  {
    greeting: { systemLine: string; npcLine: string; emotion: CharacterEmotion };
    actions: Record<
      string,
      { playerLine: string; npcLine: string; emotion: CharacterEmotion; affinityDelta: number; questProgressDelta: number }
    >;
  }
> = {
  mina: {
    greeting: {
      systemLine: "Mina에게 말을 걸었습니다.",
      npcLine: "오늘도 반가워! 뭐부터 할까?",
      emotion: "happy"
    },
    actions: {
      talk: {
        playerLine: "요즘 어떻게 지내?",
        npcLine: "괜찮아. 네가 와줘서 좀 더 기분이 좋아졌어.",
        emotion: "happy",
        affinityDelta: 2,
        questProgressDelta: 1
      },
      gift: {
        playerLine: "작은 선물이야.",
        npcLine: "정말? 고마워! 이런 배려는 오래 기억할게.",
        emotion: "happy",
        affinityDelta: 4,
        questProgressDelta: 1
      },
      ask: {
        playerLine: "도움이 필요해. 학교 근처에서 뭐 본 거 있어?",
        npcLine: "새 카페가 생겼어. 거기서 만나면 이야기하기 좋을 것 같아.",
        emotion: "surprised",
        affinityDelta: 1,
        questProgressDelta: 1
      },
      quest: {
        playerLine: "우리 약속한 일, 조금씩 진행해볼까?",
        npcLine: "좋아. 이번에는 꼭 끝까지 같이 해보자.",
        emotion: "normal",
        affinityDelta: 3,
        questProgressDelta: 2
      }
    }
  },
  jun: {
    greeting: {
      systemLine: "Jun과 대화를 시작했습니다.",
      npcLine: "잠깐 숨 돌릴 시간 있지? 커피 한 잔 할래?",
      emotion: "normal"
    },
    actions: {
      talk: {
        playerLine: "오늘 업무는 어땠어?",
        npcLine: "생각보다 무난했어. 같이 정리하면 더 빨라질 것 같아.",
        emotion: "normal",
        affinityDelta: 2,
        questProgressDelta: 0
      },
      gift: {
        playerLine: "커피 쿠폰을 준비했어.",
        npcLine: "이건 정말 센스 좋네. 당장 오늘 써야겠어.",
        emotion: "happy",
        affinityDelta: 3,
        questProgressDelta: 1
      },
      ask: {
        playerLine: "최근에 들은 소식 있어?",
        npcLine: "박람회 일정이 바뀌었다고 해. 나중에 같이 확인하자.",
        emotion: "surprised",
        affinityDelta: 1,
        questProgressDelta: 1
      },
      quest: {
        playerLine: "프로젝트 체크리스트를 맞춰보자.",
        npcLine: "좋아, 이번 주 안에 방향을 잡아보자.",
        emotion: "angry",
        affinityDelta: 2,
        questProgressDelta: 2
      }
    }
  }
};
