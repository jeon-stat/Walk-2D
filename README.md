# Walk 2D

Life Online 2D Edition을 위한 시작점입니다.  
3D, Live2D, Spine 없이 2D 파츠 레이어 조합으로 캐릭터를 표현하고, 나중에 AI 대화 / 기억 / 관계도 / 인벤토리 / 퀘스트 / 시간 흐름 / 장소 이동을 계속 붙이기 쉬운 구조로 정리했습니다.

## 프로젝트 설명

- React + Vite + TypeScript 기반
- 상태 관리는 Zustand 사용
- 서버 없이도 동작하는 mock 서비스 구조 분리
- 캐릭터는 PNG/SVG 파츠를 레이어로 겹쳐서 표현
- idle / walk / run 제자리 모션 지원
- 표정, 장소, 시간, 대화, 인벤토리, 관계도, 퀘스트를 한 화면에서 확인 가능
- 저장은 localStorage 기반이며, 나중에 서버 저장으로 교체하기 쉽게 분리

## 로컬 실행 방법

```bash
npm install
npm run dev
```

개발 서버 실행 후 브라우저에서 Vite가 안내하는 주소를 열면 됩니다.

### 확인 명령

```bash
npm run build
npm run preview
```

## GitHub Pages 배포 URL

- https://jeon-stat.github.io/Walk-2D/

## GitHub Pages 배포 설정

- `vite.config.ts`에 `base: "/Walk-2D/"`를 설정했습니다.
- `.github/workflows/deploy.yml`에서 `main` 브랜치 push 시 자동 배포되도록 구성했습니다.
- GitHub Repository Settings > Pages에서 Source를 GitHub Actions로 두면 됩니다.

## 폴더 구조

```txt
src/
  app/
  assets/
    character/
      placeholders/
  modules/
    character/
      components/
      data/
      types.ts
      characterStore.ts
    dialogue/
      components/
      dialogueService.ts
      mockDialogues.ts
      types.ts
    emotion/
    inventory/
    relationship/
    quest/
    time/
    world/
    location/
    save/
    services/
  shared/
    components/
    types/
    utils/
  styles/
```

## 2D 캐릭터 파츠 추가 방법

캐릭터 파츠는 [`src/modules/character/data/characterCatalog.ts`](./src/modules/character/data/characterCatalog.ts)에서 옵션을 추가하고, [`src/modules/character/data/assetRegistry.ts`](./src/modules/character/data/assetRegistry.ts)에서 실제 이미지 경로를 연결하도록 설계했습니다.

새 PNG/SVG를 넣을 때는 `getCharacterPartAsset()`만 교체하면 화면쪽 코드는 거의 건드리지 않아도 됩니다.

## 표정 추가 방법

표정은 [`src/modules/character/types.ts`](./src/modules/character/types.ts)와 [`src/modules/character/data/characterCatalog.ts`](./src/modules/character/data/characterCatalog.ts)의 `CharacterEmotion` / `emotionFaceMap`을 확장하면 됩니다.

`eyes`와 `mouth` 파츠는 감정 상태에 따라 자동으로 다른 placeholder를 보여줍니다.

## idle / walk / run 모션 프레임 추가 방법

모션 정의는 [`src/modules/character/data/animationRegistry.ts`](./src/modules/character/data/animationRegistry.ts)에 있습니다.

- `frameDurationMs`로 속도를 조정
- `frames` 배열에 `offsetY`, `scaleX`, `scaleY`, `rotate`를 추가

나중에 PNG 프레임으로 바꿀 때도 이 레지스트리만 교체하면 됩니다.

## Life Online 기능을 어디에 추가하면 되는지

- 캐릭터: `src/modules/character/`
- 세계/기본 상태: `src/modules/world/`
- 장소: `src/modules/location/`
- 대화: `src/modules/dialogue/`
- 감정: `src/modules/emotion/`
- 인벤토리: `src/modules/inventory/`
- 관계도: `src/modules/relationship/`
- 퀘스트: `src/modules/quest/`
- 시간 흐름: `src/modules/time/`
- 저장: `src/modules/save/`
- 외부 API 교체 지점: `src/modules/services/`

## GPT API를 나중에 어디에 연결하면 되는지

대화 생성부는 [`src/modules/dialogue/dialogueService.ts`](./src/modules/dialogue/dialogueService.ts)로 분리했습니다.

나중에 GPT API를 붙일 때는 이 파일 내부 구현만 바꾸고, UI 컴포넌트는 그대로 유지하면 됩니다.

## localStorage 저장 구조

저장은 [`src/modules/save/saveService.ts`](./src/modules/save/saveService.ts)에서 관리합니다.

현재 저장 구조는 다음과 같습니다.

```json
{
  "character": { "appearance": {}, "emotion": "normal", "motion": "idle" },
  "dialogue": { "selectedNpcId": "mina", "messages": [] },
  "inventory": { "items": [] },
  "relationships": { "npcs": [] },
  "quests": { "quests": [] },
  "world": { "locationId": "home", "currentDateISO": "...", "minutesOfDay": 0 }
}
```

서버 저장으로 바꿀 때는 이 서비스만 교체하면 되도록 만들었습니다.
