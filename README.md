# Kanban Board

칸반 보드 애플리케이션입니다. 컬럼과 카드를 생성하고, 드래그 앤 드롭으로 카드를 이동할 수 있습니다.

## 실행 방법

### Node.js 버전 요구사항

- Node.js 18.x 이상 권장 (개발 환경: v18.18.0)

### 설치 및 실행 명령어

```bash
# 1. 루트 디렉토리로 이동
cd KanbanBoard

# 2. 모든 dependencies 설치 (선택사항)
npm run install:all

# 또는 각각 설치
cd server && npm install
cd ../frontend && npm install

# 3. 서버와 프론트엔드 동시 실행
npm run start

# 또는 개별 실행
npm run start:server    # 서버만 실행 (포트 4001)
npm run start:frontend  # 프론트엔드만 실행 (webpack dev server)
```

### 실행 후 접속

- Frontend: 브라우저가 자동으로 열립니다 (기본: http://localhost:3000)
- Backend API: http://localhost:4001/api

## 기술 스택

### Frontend

- **React 18.3** - UI 라이브러리
- **TypeScript 5.9** - 타입 안정성 및 개발 경험 향상
- **@tanstack/react-query 5.90** - 서버 상태 관리
  - 선택 이유: 데이터 캐싱, 자동 refetch, 낙관적 업데이트 등 서버 상태 관리에 특화
  - Redux보다 보일러플레이트가 적고 비동기 데이터 처리에 최적화
- **Axios 1.13** - HTTP 클라이언트
- **Webpack 5** - 번들러 및 개발 서버
- **Day.js** - 날짜 포맷팅 (경량 라이브러리)

### Backend

- **json-server 0.17** - Mock REST API 서버
  - 빠른 프로토타이핑 및 개발에 적합
  - 커스텀 미들웨어로 카드 이동 로직 구현

### 상태 관리 전략

- **React Query (TanStack Query)** 를 사용한 서버 상태 관리
  - 캐싱 전략: staleTime 5분, gcTime 10분 설정
  - 자동 refetch 비활성화 (refetchOnWindowFocus: false)
  - Optimistic Update를 통한 즉각적인 UI 반영

## 구현 기능

### 완료된 기능

- [x] 컬럼(Column) CRUD
  - 컬럼 생성, 읽기, 수정, 삭제
  - 컬럼 순서 관리 (order 필드)
- [x] 카드(Card) CRUD
  - 카드 생성, 읽기, 수정, 삭제
  - 제목, 설명, 마감일 필드 지원
- [x] 카드 상세 패널
  - 사이드 패널 형태의 상세 정보 표시
  - 인라인 편집 기능
- [x] 드래그 앤 드롭
  - 카드를 다른 컬럼으로 이동
  - 같은 컬럼 내에서 순서 변경
  - 드롭 인디케이터로 시각적 피드백 제공
- [x] 에러 처리
  - Toast UI로 사용자 친화적인 에러 메시지 표시
  - API 에러에 대한 통합 처리
- [x] 유효성 검증
  - 카드/컬럼 생성/수정 시 입력값 검증
  - 사용자에게 명확한 검증 메시지 제공
- [x] 클라이언트 UI 상태 관리
  - useState & Context API로 로컬하게 관리

### 미구현 기능

- [ ] 로딩 상태 UI 구현
  - 사유: 로딩 UI 기준 정의 및 영향 범위 산정 결정 보류
- [ ] 네트워크 에러 등 에러 발생 시 재시도 처리
  - 사유: 네트워크 오류에 대한 재시도 기능이 우선 범위에서 제외
- [ ] 사용자 인터랙션에 대한 세부 UI 전환과 애니메이션 구현
  - 사유: 사용성을 보완할 일정 지연

## 설계 결정

### 상태 관리 전략

**React Query 선택 이유:**

- 서버 상태와 클라이언트 상태를 명확히 분리
- 캐싱, 재시도, 백그라운드 업데이트 등의 기능 내장
- 보일러플레이트 코드 최소화

**캐싱 전략:**

- staleTime: 5분 - 불필요한 네트워크 요청 최소화
- gcTime: 10분 - 메모리 효율적 관리
- 자동 refetch 비활성화 - 명시적 데이터 갱신으로 예측 가능성 향상

### 컴포넌트 설계 원칙

**Feature-based 폴더 구조:**

```
src/
  ├── app/           # 앱 레벨 설정 (providers, config)
  ├── features/      # 기능별 컴포넌트 (board, cards, columns)
  ├── commons/       # 공통 컴포넌트 (Toast, Modal)
  └── services/      # API 관련 로직
```

**관심사의 분리:**

- UI 컴포넌트와 비즈니스 로직 분리
- Custom Hooks (useColumns, useCards)로 데이터 로직 캡슐화
- API 레이어 분리 (services/api/)

**컴포넌트 책임:**

- Board: 전체 레이아웃 및 드래그 앤 드롭 로직
- Column: 컬럼 표시 및 카드 컨테이너
- Card: 개별 카드 표시 및 드래그 이벤트
- CardDetailPanel: 카드 상세 정보 및 편집

### 기타 고민했던 부분과 결정 사항

**1. Frontend Architecture 구축**

- 결정: UI 컴포넌트와 비즈니스 로직을 분리
- 현재 과제 스코프에 맞는 아키텍처를 구성하되 확장성을 고려
- 단순한 구조로 명확한 코드구조 파악이 가능하도록 구축

**2. 개발 환경**

- Webpack Dev Server로 HMR(Hot Module Replacement) 지원
- json-server로 빠른 백엔드 프로토타이핑
- 별도 포트(4001, 3000)로 CORS 문제 해결

**3. 에러 처리 전략**

- 결정: Toast UI 기반 중앙 집중식 에러 처리
- Context API로 ToastProvider 구현
- 모든 API 호출에서 일관된 에러 메시지 표시

**4. API 통신**

- Axios 인터셉터로 baseURL 설정 및 공통 에러 처리
- 환경 변수(.env)로 API URL 관리
- React Query의 mutation으로 낙관적 업데이트 구현 가능

🧪 문서를 꼼꼼히 읽었습니다
