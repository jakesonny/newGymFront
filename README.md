# 헬스장 회원관리 시스템 - 프론트엔드

헬스장 회원의 신체 능력을 수치화·평균화·시각화하고 시간에 따른 변화를 추적하는 데이터 기반 헬스 관리 시스템의 프론트엔드입니다.

## 기술 스택

- **React** - UI 라이브러리
- **TypeScript** - 타입 안정성
- **Vite** - 빌드 도구
- **React Router** - 라우팅
- **Axios** - HTTP 클라이언트

## 프로젝트 구조

```
src/
├── components/          # 재사용 가능한 컴포넌트
├── pages/               # 페이지 컴포넌트
├── hooks/               # 커스텀 훅
├── services/            # API 서비스
├── utils/               # 유틸리티 함수
├── types/               # TypeScript 타입 정의
├── contexts/            # React Context
├── styles/              # 전역 스타일
├── App.tsx              # 루트 컴포넌트
└── main.tsx             # 애플리케이션 진입점
```

## 설치 및 실행

### 사전 요구사항

- **Node.js** v18 이상
- **npm** 또는 **yarn**

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.example` 파일을 복사하여 `.env` 파일을 생성하세요:

```bash
# Windows
copy .env.example .env

# Linux/Mac
cp .env.example .env
```

그 다음 `.env` 파일을 열어 실제 환경에 맞게 값을 수정하세요:

- `VITE_API_BASE_URL`: 백엔드 API 기본 URL
  - 로컬 개발: `http://localhost:3001`
  - 프로덕션: Render로 배포한 백엔드 URL (예: `https://your-backend.onrender.com`)

**참고**: 
- `.env` 파일은 로컬 개발용입니다
- 프로덕션 빌드 시 Vercel 환경 변수 또는 `.env.production` 파일이 사용됩니다
- 환경 변수는 `VITE_` 접두사가 필요합니다 (Vite 요구사항)
- **프론트엔드와 백엔드는 별도로 배포되며, 직접적인 import/export는 사용하지 않습니다**

### 3. 애플리케이션 실행

```bash
# 개발 모드
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 미리보기
npm run preview
```

개발 서버는 기본적으로 `http://localhost:3000`에서 실행됩니다.

## 주요 기능

### 인증
- 로그인/로그아웃
- JWT 토큰 관리
- 카카오 소셜 로그인

### 회원 관리
- 회원 목록 조회
- 회원 상세 정보
- 회원 등록/수정/삭제
- 회원 대시보드

### 평가 시스템
- 초기 평가 입력
- 정기 평가 입력
- 능력치 레이더 차트 시각화
- 평가 히스토리 조회

### 운동 기록
- 운동 기록 입력
- 운동 기록 조회
- 볼륨 분석
- 근력 진행 상황

### 분석 및 인사이트
- 센터 대시보드
- 위험 회원 목록
- 목표 분석

## 개발 가이드

### 코드 스타일

- TypeScript 사용
- camelCase 네이밍 (변수, 함수)
- PascalCase 네이밍 (컴포넌트, 타입)
- 함수형 컴포넌트 및 Hooks 사용

### API 통신

모든 API 호출은 `src/services` 디렉토리의 서비스 파일을 통해 이루어집니다.

```typescript
import { memberService } from '@/services/member.service'

const members = await memberService.getMembers()
```

### 라우팅

React Router를 사용하여 라우팅을 관리합니다.

```typescript
<Route path="/members" element={<MemberList />} />
<Route path="/members/:id" element={<MemberDetail />} />
```

## 라이선스

ISC
