# Walk-2D

`Walk-2D`는 기존 `Life Online`을 그대로 이어받되, **캐릭터 렌더링만 2D 파츠 조합 방식으로 바꾼 `Life Online 2D Edition`** 입니다.

새 데모나 축소판이 아니라, 원본 `Life Online`의 화면 흐름과 개발 구조를 최대한 유지하면서 3D 캐릭터 부분만 2D로 교체하는 것을 목표로 합니다.

## 기존 `Life Online`과 같은 점

- 모바일 우선 화면 구조
- 하단 탭 기반 내비게이션
- Home / History / Character / Friends 흐름
- 상태 중심의 화면 구성
- 확장 가능한 데이터/서비스 분리

## 다른 점

- 기존 3D 캐릭터 렌더링을 제거
- 2D 파츠 레이어 방식으로 캐릭터를 렌더링
- PNG/SVG 에셋만 교체하면 외형을 바꿀 수 있는 `asset registry` 구조 사용
- `idle / walk / run` 제자리 모션을 `animation registry`로 분리

## 실행 방법

```bash
npm install
npm run dev
```

빌드 확인:

```bash
npm run build
npm run preview
```

## 배포 URL

- https://jeon-stat.github.io/Walk-2D/

## GitHub Pages 배포

- `vite.config.ts`에 `base: "/Walk-2D/"` 설정
- `main` 브랜치 push 시 GitHub Actions 자동 배포
- `.github/workflows/deploy.yml`에 Pages 워크플로 구성

## 폴더 구조

```txt
src/
  app/
  assets/
    character/
      placeholders/
  components/
  modules/
    character/
      components/
      data/
      types.ts
      characterStore.ts
      assetRegistry.ts
      animationRegistry.ts
    dialogue/
      dialogueService.ts
      dialogueSeed.ts
      types.ts
    emotion/
    inventory/
    location/
    quest/
    relationship/
    save/
    services/
    time/
    world/
  screens/
  shared/
  styles/
```

## 2D 캐릭터 파츠 추가

- [`src/modules/character/data/characterCatalog.ts`](./src/modules/character/data/characterCatalog.ts)에 파츠 옵션 추가
- [`src/modules/character/data/assetRegistry.ts`](./src/modules/character/data/assetRegistry.ts)에서 실제 이미지 경로 연결
- 실제 PNG가 없으면 placeholder SVG가 먼저 동작

파츠 레이어:

- `body`
- `hair`
- `eyes`
- `mouth`
- `top`
- `bottom`
- `shoes`
- `accessory`

## 표정 추가

- [`src/modules/character/types.ts`](./src/modules/character/types.ts)의 감정 타입 확장
- [`src/modules/character/data/characterCatalog.ts`](./src/modules/character/data/characterCatalog.ts)의 감정-파츠 매핑 확장

현재 지원 감정:

- `normal`
- `happy`
- `sad`
- `angry`
- `surprised`
- `sleepy`

## idle / walk / run 모션 추가

- [`src/modules/character/data/animationRegistry.ts`](./src/modules/character/data/animationRegistry.ts)에서 프레임 정의
- `frameDurationMs`로 속도 조절
- `frames` 배열에 위치/스케일/회전 값을 넣어 제자리 모션 구성

## Life Online 기능을 어디에 이어서 개발하나

- 캐릭터: `src/modules/character/`
- 대화: `src/modules/dialogue/`
- 감정: `src/modules/emotion/`
- 인벤토리: `src/modules/inventory/`
- 관계도: `src/modules/relationship/`
- 퀘스트: `src/modules/quest/`
- 시간 흐름: `src/modules/time/`
- 장소: `src/modules/location/`
- 저장: `src/modules/save/`
- 외부 서비스 교체 지점: `src/modules/services/`

## GPT API 연결 지점

- 대화 생성은 [`src/modules/dialogue/dialogueService.ts`](./src/modules/dialogue/dialogueService.ts)에 분리
- 나중에 GPT API로 바꾸려면 이 서비스 구현만 교체하면 됩니다

## localStorage 저장 구조

- [`src/modules/save/saveService.ts`](./src/modules/save/saveService.ts)에서 관리
- 캐릭터/대화/인벤토리/관계/퀘스트/월드 상태를 한 번에 저장
- 서버 저장으로 바꾸기 쉽도록 서비스 단일 진입점으로 분리

## 배포 확인 방법

1. `main` 브랜치에 push
2. GitHub Actions `Deploy to GitHub Pages` 실행 확인
3. 배포 완료 후 `https://jeon-stat.github.io/Walk-2D/` 접속
