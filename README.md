# 헬스장 회원관리 시스템 — 프론트엔드

헬스장 회원의 신체 능력을 수치화·시각화하고 시간에 따른 변화를 추적하는 PT 관리 시스템의 프론트엔드입니다. [백엔드(NestJS + TypeORM)](https://github.com/jakesonny/newGym)와 REST API로 통신합니다.

## 주요 기능

- **인증**: JWT 기반 로그인/회원가입, 카카오 소셜 로그인, 역할(관리자/트레이너) 기반 라우팅 보호
- **회원 관리**: 회원 목록/상세, 3단계 위저드 등록, 회원 대시보드
- **체력평가 시각화**: 6영역(근력·심폐·근지구력·유연성·체성분·안정성) 레이더 차트, 평가 히스토리·비교
- **운동 기록 & 근력 분석**: 운동 기록 입력, 1RM 추정치, 볼륨/근력 추세 그래프(Recharts)
- **목표 분석**: 진행률 추적, 정체/급변 상태 표시
- **센터 대시보드**: 트레이너 전용 — 회원 평균, 위험 회원 목록

## 기술 스택

| 구분        | 기술                                             |
| ----------- | ------------------------------------------------ |
| Framework   | React 18 + TypeScript                            |
| Build Tool  | Vite                                             |
| Routing     | React Router v6                                  |
| 상태 관리   | React Context + Custom Hooks (`useAsyncData` 등) |
| HTTP Client | Axios                                            |
| 시각화      | Recharts                                         |
| 아이콘      | lucide-react                                     |
| 배포        | Vercel                                           |

## 프로젝트 구조

```
src/
├── components/          # 재사용 컴포넌트 (ProtectedRoute 등)
├── pages/                # 라우트 단위 페이지
├── hooks/                # 커스텀 훅 (useAsyncData, useSearch 등)
├── services/             # 백엔드 API 호출 모듈 (도메인별로 분리)
├── contexts/             # AuthContext (인증 상태)
├── utils/                # 포맷터, 검증 등 유틸리티
├── types/                # 공통 타입 정의
├── App.tsx               # 라우트 정의
└── main.tsx              # 진입점
```

## 로컬 실행

### 사전 요구사항

- Node.js 18+
- 로컬 또는 배포된 백엔드 API 서버

### 1. 의존성 설치 및 환경 변수 설정

```bash
npm install
cp .env.example .env
```

`.env`에서 백엔드 API 주소를 설정한다 (Vite 환경 변수는 `VITE_` 접두사 필수):

```env
VITE_API_BASE_URL=http://localhost:3001
```

### 2. 개발 서버 실행

```bash
npm run dev
# http://localhost:3000
```

### 3. 빌드 / 미리보기

```bash
npm run build     # dist/ 에 빌드 결과물 생성
npm run preview
```

## 라우트

| 경로                              | 설명            | 접근 권한 |
| --------------------------------- | --------------- | :-------: |
| `/login`, `/register`             | 로그인/회원가입 |  Public   |
| `/dashboard`                      | 센터 대시보드   |  TRAINER  |
| `/members`                        | 회원 목록       |   ADMIN   |
| `/members/:memberId`              | 회원 상세       | 인증 필요 |
| `/members/:memberId/goal-analyst` | 목표 분석       | 인증 필요 |
| `/strength-level`                 | 빅3 레벨 측정기 |  Public   |
| `/mypage`                         | 마이페이지      | 인증 필요 |

## 배포

- **프론트엔드**: Vercel (`vercel.json`의 SPA rewrite 설정 포함)
- **백엔드**: 별도 서버로 배포되며 프론트와는 HTTP API로만 통신한다(직접 import 없음)
- Vercel 환경 변수에 `VITE_API_BASE_URL`을 배포된 백엔드 URL로 설정한다

## 코드 스타일

- TypeScript, 함수형 컴포넌트 + Hooks
- camelCase(변수/함수), PascalCase(컴포넌트/타입)
- 모든 API 호출은 `src/services`의 도메인별 서비스 모듈을 통해 이루어진다

## 라이선스

ISC
