# Walk-2D

`Walk-2D`는 [`jeon-stat/Life-Online`](https://github.com/jeon-stat/Life-Online) 을 그대로 이어받는 **Life Online 2D Edition** 입니다.

핵심 목표는 하나입니다.

- UI / UX / 화면 구성 / 데이터 흐름 / 개발 흐름은 `Life Online`과 최대한 동일하게 유지
- 차이점은 **캐릭터 렌더링만 2D 파츠 조합 방식**으로 바꾸는 것
- 3D / Live2D / Spine은 사용하지 않음

배포 URL:

- https://jeon-stat.github.io/Walk-2D/

## 같은 점

- 인증 화면
- 하단 탭 구조
- Home / History / Character / Friends 화면 흐름
- 개발자 패널 구조
- localStorage 기반 상태 보존
- Life Online의 확장 구조를 그대로 이어서 개발하기 쉬운 폴더 분리

## 다른 점

- 3D 캐릭터 대신 2D 캐릭터
- 2D 캐릭터는 나중에 PNG/SVG 파츠로 교체 가능한 구조
- 캐릭터 애니메이션은 `idle / walk / run` 중심으로 이어 붙일 수 있게 분리

## 실행 방법

```bash
npm install
npm run dev
```

확인용 빌드:

```bash
npm run build
npm run preview
```

## GitHub Pages 배포

- `vite.config.ts`에 `base: "/Walk-2D/"` 설정
- `main` 브랜치 push 시 GitHub Actions가 `docs/` 산출물을 갱신
- GitHub Pages는 `Deploy from a branch` / `gh-pages` / `/(root)` 조합으로 사용

배포 확인 URL:

- https://jeon-stat.github.io/Walk-2D/

### 배포 설정 순서

1. GitHub 저장소 `Settings > Pages` 로 이동
2. `Source` 를 `Deploy from a branch` 로 선택
3. `Branch` 는 `gh-pages`
4. `Folder` 는 `/(root)`
5. 저장 후 몇 분 기다렸다가 URL 확인

## 폴더 구조

```txt
src/
  auth/
  components/
  constants/
  data/
  game/
  generated/
  screens/
  styles/
  characters.ts
  App.tsx
```

## 2D 캐릭터 파츠 추가 방법

캐릭터의 실제 이미지 교체는 `src/modules/character/` 쪽이 아니라, 현재 구조에서는 `src/components/CharacterStage.tsx` 와 `src/characters.ts` 를 기준으로 연결하면 됩니다.

권장 방식:

1. 파츠별 PNG/SVG를 준비
2. `CharacterStage` 안에서 레이어 순서를 유지한 채 이미지 교체
3. `src/characters.ts` 의 `palette` / `animationMap` 을 확장

현재 캐릭터 레이어 개념:

- body
- hair
- eyes
- mouth
- top
- bottom
- shoes
- accessory

## 표정 추가 방법

표정 상태를 더 늘리려면:

- 캐릭터 상태 타입에 표정 키를 추가
- `CharacterStage` 또는 전용 asset registry에서 눈 / 입 파츠를 교체
- 필요하면 `emotion` registry를 별도 파일로 분리

추천 표정 키:

- `normal`
- `happy`
- `sad`
- `angry`
- `surprised`
- `sleepy`

## idle / walk / run 모션 추가 방법

모션은 현재 `src/game/behavior.ts` 와 `src/components/CharacterStage.tsx` 를 기준으로 이어서 확장할 수 있습니다.

추가 방법:

1. `animation registry`에 프레임 시퀀스 추가
2. `CharacterStage`에서 현재 clip 이름을 받아 프레임 전환
3. `idle / walk / run` 을 제자리 애니메이션으로 유지

권장 구조:

- `idle`: 가만히 서 있기
- `walk`: 제자리 걷기
- `run`: 제자리 뛰기

## Life Online 기능을 이어서 개발하는 위치

현재는 `Life Online`의 화면과 흐름을 유지하는 뼈대이므로, 이어서 기능을 추가할 때는 아래 위치를 기준으로 잡으면 됩니다.

- 인증: `src/auth/`
- 화면 셸과 탭: `src/App.tsx`, `src/components/BottomTabs.tsx`
- 홈 / 기록 / 캐릭터 / 친구 화면: `src/screens/`
- 캐릭터 상태 계산: `src/game/`
- 친구 랭킹 / 그룹 / 목록: `src/data/mockFriendData.ts`
- step 데이터 / 개발자 패널: `src/data/stepDataProvider.tsx`

## GPT API 연결 위치

나중에 대화형 AI를 붙이려면 아래 위치를 쓰면 됩니다.

- `src/modules/dialogue/` 같은 별도 서비스 계층을 만들기
- 또는 현재 구조 기준으로 `src/game/behavior.ts` 와 별도 `dialogueService` 를 분리
- 화면에서는 `AppShell` 또는 `HomeScreen` 에서 결과만 받아 렌더링

## localStorage 저장 구조

현재 저장은 브라우저 localStorage 기반입니다.

- 인증 상태: `life-online-auth-v1`
- mock step 데이터: `mock` 기반으로 메모리/저장 분리

추후 서버 저장으로 바꿀 때는:

1. `authStorage` 를 서버 API로 교체
2. `stepDataProvider` 의 mock 데이터를 실제 API 응답으로 교체
3. 저장/불러오기 책임을 서비스 계층으로 옮기면 됩니다

## 개발 메모

- `npm run build` 통과
- `npm run typecheck` 통과
- `npm run export:web` 는 `dist/` 결과를 `docs/` 에 동기화

