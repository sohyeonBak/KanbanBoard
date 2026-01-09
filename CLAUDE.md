# CLAUDE.MD

이 문서는 Claude Code를 사용하여 Kanban Board 프로젝트를 개발할 때 참고해야 할 가이드라인입니다.

## 개발 환경

### 필수 요구사항

- **Node.js**: v18.18.0 이상 (v18.x 권장)
- **패키지 매니저**: npm

### 기술 스택

#### Backend (현재 디렉토리)

- **json-server**: 0.17.4
- **포트**: 4001
- **API 경로**: `/api`

#### Frontend

- **React**: 18.3
- **TypeScript**: 5.9
- **@tanstack/react-query**: 5.90 (서버 상태 관리)
- **Axios**: 1.13 (HTTP 클라이언트)
- **Webpack**: 5 (번들러 및 개발 서버)
- **Day.js**: 날짜 포맷팅

### 실행 환경

```bash
# 서버 실행 (루트 디렉토리에서)
npm run start:server    # 포트 4001

# 프론트엔드 실행 (루트 디렉토리에서)
npm run start:frontend  # webpack dev server (포트 3000)

# 동시 실행
npm run start
```

## 코딩 스타일 가이드

### TypeScript (Frontend)

#### 타입 정의

- **명시적 타입 선언**: 모든 함수 매개변수와 반환값에 타입 명시
- **인터페이스 우선**: 객체 구조는 `interface` 사용
- **타입 내보내기**: 공통 타입은 `src/services/types.ts`에 정의

```typescript
// Good
interface Card {
  id: string;
  column_id: string;
  title: string;
  description: string;
  due_date: string | null;
  order: number;
}

function updateCard(id: string, data: Partial<Card>): Promise<Card> {
  // ...
}

// Bad
function updateCard(id, data) {
  // ...
}
```

#### 컴포넌트 작성

- **함수형 컴포넌트**: 화살표 함수로 작성
- **Props 타입**: 각 컴포넌트의 Props는 인터페이스로 정의
- **명확한 반환 타입**: `JSX.Element` 또는 `React.ReactNode` 명시

```typescript
// Good
interface CardProps {
  card: Card;
  onUpdate: (data: Partial<Card>) => void;
}

const Card: React.FC<CardProps> = ({ card, onUpdate }) => {
  return <div>{card.title}</div>;
};

export default Card;
```

### JavaScript (Backend)

#### 변수 선언

- `const` 우선 사용, 재할당이 필요한 경우만 `let` 사용
- `var` 사용 금지

#### 함수 작성

- 화살표 함수 우선 사용
- 콜백 함수는 명확한 에러 핸들링 포함

```javascript
// Good
server.patch("/api/cards/:id/move", (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Invalid request" });
  }

  // 로직...
});
```

### 네이밍 컨벤션

#### 변수 및 함수

- **camelCase**: 변수, 함수, 메서드
- **PascalCase**: 컴포넌트, 클래스, 인터페이스, 타입
- **UPPER_SNAKE_CASE**: 상수

```typescript
// Good
const cardList = [];
const MAX_RETRIES = 3;

interface CardData {}
const CardDetailPanel: React.FC = () => {};
```

#### 파일명

- **컴포넌트**: PascalCase (예: `CardDetailPanel.tsx`)
- **유틸/훅**: camelCase (예: `useCards.ts`, `errorUtils.ts`)
- **설정 파일**: kebab-case 또는 camelCase (예: `axiosConfig.ts`)

### 코드 구조

#### Import 순서

1. React 관련
2. 외부 라이브러리
3. 내부 모듈 (절대 경로)
4. 타입 정의
5. 스타일

```typescript
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { useCards } from "../../services/hooks/useCards";
import { Card } from "../../services/types";

import "./Card.css";
```

#### 주석

- **JSDoc 스타일**: 함수 설명이 필요한 경우
- **인라인 주석**: 복잡한 로직에 대한 간단한 설명
- **TODO 주석**: 향후 개선 사항 표시

```typescript
/**
 * 카드를 다른 컬럼으로 이동
 * @param cardId - 이동할 카드 ID
 * @param targetColumnId - 목표 컬럼 ID
 * @param newOrder - 새로운 순서
 */
function moveCard(cardId: string, targetColumnId: string, newOrder: number) {
  // 낙관적 업데이트를 위한 현재 상태 저장
  const previousCards = queryClient.getQueryData(["cards"]);

  // TODO: 에러 발생 시 재시도 로직 추가
}
```

## ESLint 규칙 준수 필수사항

현재 프로젝트에는 별도의 ESLint 설정이 없으나, TypeScript 컴파일러 옵션에서 엄격한 검사를 수행합니다.

### TypeScript Compiler 옵션 (tsconfig.json)

```json
{
  "strict": true, // 엄격 모드
  "noUnusedLocals": true, // 미사용 지역 변수 금지
  "noUnusedParameters": true, // 미사용 매개변수 금지
  "noFallthroughCasesInSwitch": true, // switch 문 fallthrough 금지
  "forceConsistentCasingInFileNames": true // 파일명 대소문자 일관성
}
```

### 준수해야 할 규칙

1. **사용하지 않는 변수/매개변수 제거**

   - 미사용 코드는 즉시 제거
   - 의도적으로 미사용 시 `_` prefix 사용

2. **명시적 타입 선언**

   - `any` 타입 사용 최소화
   - 가능한 한 구체적인 타입 지정

3. **Null 체크**
   - Optional chaining (`?.`) 활용
   - Nullish coalescing (`??`) 활용

```typescript
// Good
const title = card?.title ?? "Untitled";

// Bad
const title = card && card.title ? card.title : "Untitled";
```

## Git 커밋 규칙

### Commit Message 형식

```
<type>(<scope>): <subject>
```

### Type 종류

- **feat**: 새로운 기능 추가
- **fix**: 버그 수정
- **docs**: 문서 수정
- **refactor**: 코드 리팩토링 (기능 변경 없음)
- **style**: 코드 포맷팅, 세미콜론 누락 등
- **test**: 테스트 코드
- **chore**: 빌드 업무, 패키지 매니저 설정 등

### Scope 예시

- **cards**: Card 관련 기능
- **columns**: Column 관련 기능
- **board**: Board 관련 기능
- **api**: API 관련
- **ui**: UI 컴포넌트

### 커밋 메시지 예시

```bash
# 좋은 예시
feat(cards): Card 이동 기능 구현
fix(api): API baseURL config 설정 수정
docs: README 파일 작성

# 나쁜 예시
update code
fix bug
add feature
```

### 최근 커밋 히스토리 참고

```
3b6653d docs: README 파일 수정
c8c95f6 docs: README 파일 작성
877f4c4 fix: API baseURL config 설정 수정
59ac201 feat: api 에러 toast UI 처리
a98c9fa feat(cards): Card 기능 구현(server router 추가)
```

## 프로젝트 구조

### Backend 구조 (server/)

```
server/
├── db.json              # JSON Server 데이터베이스
├── routes.json          # 라우팅 설정
├── json-server.json     # JSON Server 설정
├── server.js            # 서버 진입점 및 커스텀 라우트
└── package.json
```

### Frontend 구조 (frontend/)

```
frontend/
├── src/
│   ├── index.tsx                     # 앱 진입점
│   ├── app/                          # 앱 레벨 설정
│   │   ├── App.tsx
│   │   ├── config/
│   │   │   └── config.ts             # 환경 설정
│   │   └── providers/
│   │       ├── ToastProvider.tsx     # Toast 컨텍스트
│   │       └── queryClient.ts        # React Query 설정
│   ├── features/                     # 기능별 컴포넌트
│   │   ├── board/
│   │   │   ├── Board.tsx             # 보드 메인
│   │   │   └── index.ts
│   │   ├── cards/
│   │   │   ├── Card.tsx              # 카드 컴포넌트
│   │   │   ├── CardDetailPanel.tsx   # 카드 상세 패널
│   │   │   ├── AddCardForm.tsx       # 카드 추가 폼
│   │   │   └── index.ts
│   │   └── columns/
│   │       ├── Column.tsx            # 컬럼 컴포넌트
│   │       ├── AddColumnForm.tsx     # 컬럼 추가 폼
│   │       └── index.ts
│   ├── commons/                      # 공통 컴포넌트
│   │   ├── Toast.tsx
│   │   ├── ToastContainer.tsx
│   │   ├── ConfirmModal.tsx
│   │   └── index.ts
│   └── services/                     # 비즈니스 로직
│       ├── types.ts                  # 공통 타입 정의
│       ├── axiosConfig.ts            # Axios 설정
│       ├── api/
│       │   ├── cards.ts              # Card API
│       │   └── columns.ts            # Column API
│       ├── hooks/
│       │   ├── useCards.ts           # Card 커스텀 훅
│       │   └── useColumns.ts         # Column 커스텀 훅
│       ├── errors/
│       │   ├── errors.ts             # 커스텀 에러 클래스
│       │   └── errorUtils.ts         # 에러 유틸
│       └── validation/
│           ├── cardValidation.ts     # Card 유효성 검사
│           └── columnValidation.ts   # Column 유효성 검사
├── public/
│   └── index.html
├── webpack.config.js
├── tsconfig.json
└── package.json
```

### 아키텍처 원칙

1. **Feature-based 구조**: 기능별로 컴포넌트 그룹화
2. **관심사 분리**: UI와 비즈니스 로직 분리
3. **재사용성**: 공통 컴포넌트는 `commons/`에 위치
4. **계층 구조**:
   - `app/`: 앱 레벨 설정 및 프로바이더
   - `features/`: 기능별 UI 컴포넌트
   - `commons/`: 재사용 가능한 공통 컴포넌트
   - `services/`: 데이터 처리 및 비즈니스 로직

## 공통 컴포넌트 수정 시 주의사항

공통 컴포넌트는 여러 곳에서 사용되므로 수정 시 신중해야 합니다.

### 주의해야 할 공통 컴포넌트

#### 1. ToastProvider & Toast (`commons/Toast.tsx`, `app/providers/ToastProvider.tsx`)

- **사용처**: 전역 에러 메시지 표시
- **영향도**: 앱 전체
- **주의사항**:
  - `showToast` 함수 시그니처 변경 금지
  - Toast 표시 로직 변경 시 모든 에러 처리 동작 확인

#### 2. ConfirmModal (`commons/ConfirmModal.tsx`)

- **사용처**: 삭제 확인 등 사용자 확인이 필요한 작업
- **영향도**: 카드 삭제, 컬럼 삭제
- **주의사항**:
  - Props 인터페이스 변경 시 모든 사용처 수정 필요
  - 모달 표시/숨김 로직 변경 시 UX 검증

#### 3. React Query 설정 (`app/providers/queryClient.ts`)

- **사용처**: 모든 서버 상태 관리
- **영향도**: 앱 전체
- **주의사항**:
  - `staleTime`, `gcTime` 변경 시 캐싱 전략 영향
  - 기본 옵션 변경 시 모든 API 호출 동작 검증

#### 4. Axios 설정 (`services/axiosConfig.ts`)

- **사용처**: 모든 API 호출
- **영향도**: 앱 전체
- **주의사항**:
  - `baseURL` 변경 시 모든 API 경로 확인
  - 인터셉터 수정 시 에러 처리 로직 검증

### 영향도 체크 방법

공통 컴포넌트 수정 전 다음 단계를 따르세요:

1. **파일 검색**: 수정할 컴포넌트가 어디서 사용되는지 확인

   ```bash
   # 예: Toast 사용처 검색
   grep -r "showToast" frontend/src/
   grep -r "useToast" frontend/src/
   ```

2. **타입 체크**: TypeScript 컴파일 에러 확인

   ```bash
   cd frontend && npm run build
   ```

3. **수동 테스트**: 영향받는 모든 기능 수동 테스트

   - 카드 생성/수정/삭제
   - 컬럼 생성/수정/삭제
   - 카드 이동 (드래그 앤 드롭)
   - 에러 발생 시나리오

4. **문서 업데이트**: 주요 변경 사항은 README.md에 반영

### 수정 가이드라인

```typescript
// Bad: 기존 인터페이스 변경
interface ToastContextType {
  showToast: (message: string, type: "success" | "error" | "warning") => void; // type 추가로 기존 코드 영향
}

// Good: 하위 호환성 유지
interface ToastContextType {
  showToast: (message: string, type?: "success" | "error") => void; // Optional로 하위 호환
}
```

## Claude Code 토큰 관리 가이드

Claude Code 사용 시 토큰 사용량을 효율적으로 관리하세요.

### 토큰 소모가 큰 작업

1. **파일 읽기**: 큰 파일이나 많은 파일을 읽을 때
2. **코드 생성**: 긴 코드나 여러 파일 생성
3. **프로젝트 탐색**: 전체 프로젝트 구조 분석
4. **리팩토링**: 여러 파일에 걸친 대규모 수정

### 토큰 절약 팁

1. **구체적인 요청**: 명확하고 구체적으로 요청하여 불필요한 탐색 방지

   ```
   // Good
   "Card.tsx 파일에서 드래그 시작 핸들러 함수만 수정해줘"

   // Bad
   "드래그 앤 드롭 기능 개선해줘"
   ```

2. **파일 경로 제공**: 수정할 파일 경로를 명시

   ```
   "frontend/src/features/cards/Card.tsx 파일의 handleDragStart 함수 수정"
   ```

3. **단계별 작업**: 큰 작업은 작은 단위로 분할

   ```
   1단계: 타입 정의 추가
   2단계: API 함수 구현
   3단계: 컴포넌트에 적용
   ```

4. **불필요한 파일 제외**: 검색 시 node_modules, dist 등 제외

### 대량 토큰 소모 작업 시 사전 안내

다음과 같은 작업을 요청할 때는 토큰 사용량이 많을 수 있으니 유의하세요:

- 전체 프로젝트 리팩토링
- 새로운 주요 기능 추가 (인증, 실시간 업데이트 등)
- 프레임워크 마이그레이션 (예: CRA → Vite)
- 대규모 의존성 업데이트

이런 작업은 단계별로 나누어 요청하거나, 핵심 파일만 먼저 작업하는 것을 권장합니다.

---

## 추가 참고 사항

### 상태 관리 전략

- **서버 상태**: React Query로 관리 (API 데이터)
- **클라이언트 상태**: useState + Context API로 관리 (UI 상태)
- **캐싱 전략**:
  - `staleTime`: 5분 (불필요한 네트워크 요청 최소화)
  - `gcTime`: 10분 (메모리 효율)
  - 자동 refetch 비활성화 (`refetchOnWindowFocus: false`)

### 에러 처리 전략

1. **API 에러**: Axios 인터셉터에서 자동으로 Toast 표시
2. **유효성 검증 에러**: 각 폼에서 검증 후 Toast 표시
3. **예상치 못한 에러**: try-catch로 포착 후 Toast 표시

### 성능 최적화

- React Query 캐싱으로 불필요한 API 호출 방지
- 낙관적 업데이트로 즉각적인 UI 반응
- 필요한 경우에만 리렌더링 (React.memo 고려)

---

이 문서는 프로젝트 진행에 따라 지속적으로 업데이트됩니다.
