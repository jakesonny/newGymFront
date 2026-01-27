# Gym Membership Frontend - 프로젝트 개요

> 헬스장 회원 관리 및 PT 프로그램 관리 시스템 프론트엔드

---

## 1. 기술 스택

| 구분 | 기술 |
|------|------|
| Framework | React 18 |
| Language | TypeScript |
| Build Tool | Vite |
| Routing | React Router |
| HTTP Client | Axios |
| State Management | React Context / Hooks |

---

## 2. 프로젝트 구조

```
src/
├── components/          # 재사용 가능한 컴포넌트
│   ├── common/          # 공통 컴포넌트 (Button, Input, Modal 등)
│   ├── layout/          # 레이아웃 컴포넌트 (Header, Sidebar, Footer 등)
│   └── charts/          # 차트 컴포넌트 (레이더 차트, 그래프 등)
├── pages/               # 페이지 컴포넌트
│   ├── auth/            # 인증 페이지 (Login, Register)
│   ├── members/         # 회원 관리 페이지
│   ├── assessments/     # 평가 시스템 페이지
│   ├── workouts/        # 운동 기록 페이지
│   └── dashboard/       # 대시보드 페이지
├── hooks/               # 커스텀 훅
│   ├── useAuth.ts       # 인증 관련 훅
│   ├── useMembers.ts    # 회원 관련 훅
│   └── useApi.ts        # API 호출 훅
├── services/            # API 서비스
│   ├── api.ts           # Axios 인스턴스 설정
│   ├── auth.service.ts  # 인증 API
│   ├── member.service.ts # 회원 API
│   └── assessment.service.ts # 평가 API
├── utils/               # 유틸리티 함수
│   ├── formatters.ts    # 날짜, 숫자 포맷팅
│   ├── validators.ts    # 폼 검증
│   └── constants.ts    # 상수 정의
├── types/               # TypeScript 타입 정의
│   ├── index.ts         # 공통 타입
│   ├── member.types.ts  # 회원 관련 타입
│   └── api.types.ts     # API 응답 타입
├── contexts/            # React Context
│   ├── AuthContext.tsx  # 인증 컨텍스트
│   └── ThemeContext.tsx # 테마 컨텍스트
├── styles/              # 전역 스타일
│   ├── variables.css    # CSS 변수
│   └── global.css       # 전역 스타일
├── App.tsx              # 루트 컴포넌트
└── main.tsx             # 애플리케이션 진입점
```

---

## 3. 주요 기능

### 3.1 인증
- 로그인/로그아웃
- JWT 토큰 관리
- 카카오 소셜 로그인
- 권한 기반 라우팅

### 3.2 회원 관리
- 회원 목록 조회
- 회원 상세 정보
- 회원 등록 (3단계 위저드)
- 회원 수정/삭제
- 회원 대시보드

### 3.3 평가 시스템
- 초기 평가 입력
- 정기 평가 입력
- 6영역 레이더 차트 시각화
- 평가 히스토리 조회
- 평가 비교 기능

### 3.4 운동 기록
- 운동 기록 입력
- 운동 기록 조회
- 볼륨 분석
- 근력 진행 상황
- 1RM 추정치

### 3.5 분석 및 인사이트
- 센터 대시보드
- 위험 회원 목록
- 목표 분석
- 진행률 추적

---

## 4. API 통신

### 4.1 Axios 설정
- 기본 URL: `http://localhost:3001/api`
- 요청 인터셉터: JWT 토큰 자동 추가
- 응답 인터셉터: 401 에러 시 자동 로그아웃

### 4.2 API 서비스 구조
```typescript
// services/member.service.ts
export const memberService = {
  getMembers: () => api.get<Member[]>('/members'),
  getMember: (id: number) => api.get<Member>(`/members/${id}`),
  createMember: (data: CreateMemberDto) => api.post('/members', data),
  // ...
}
```

---

## 5. 상태 관리

### 5.1 React Context
- `AuthContext`: 인증 상태 관리
- `ThemeContext`: 테마 상태 관리

### 5.2 Custom Hooks
- `useAuth`: 인증 관련 로직
- `useMembers`: 회원 데이터 관리
- `useApi`: API 호출 및 로딩/에러 상태 관리

---

## 6. 라우팅

### 6.1 주요 라우트
```
/                    # 홈
/login               # 로그인
/members             # 회원 목록
/members/:id         # 회원 상세
/members/:id/dashboard # 회원 대시보드
/assessments         # 평가 목록
/workouts            # 운동 기록
/dashboard           # 센터 대시보드
```

### 6.2 권한 기반 라우팅
- Public Routes: 로그인 없이 접근 가능
- Protected Routes: 인증 필요
- Admin Routes: 관리자 권한 필요

---

## 7. 스타일링

### 7.1 CSS 변수
```css
:root {
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  --success-color: #28a745;
  --danger-color: #dc3545;
  --warning-color: #ffc107;
  --info-color: #17a2b8;
}
```

### 7.2 반응형 디자인
- Mobile First 접근
- Breakpoints: 768px, 1024px, 1440px

---

## 8. 개발 환경 설정

### 8.1 환경 변수
```env
VITE_API_BASE_URL=http://localhost:3001
```

### 8.2 개발 서버
```bash
npm run dev
# http://localhost:3000
```

### 8.3 빌드
```bash
npm run build
# dist/ 폴더에 빌드 결과물 생성
```

---

## 9. 개발 가이드

### 9.1 코드 스타일
- TypeScript 사용
- camelCase 네이밍 (변수, 함수)
- PascalCase 네이밍 (컴포넌트, 타입)
- 함수형 컴포넌트 및 Hooks 사용

### 9.2 컴포넌트 구조
```typescript
// components/Example.tsx
import { useState } from 'react'

interface ExampleProps {
  title: string
}

export const Example = ({ title }: ExampleProps) => {
  const [state, setState] = useState<string>('')
  
  return (
    <div>
      <h1>{title}</h1>
    </div>
  )
}
```

### 9.3 API 호출 패턴
```typescript
// hooks/useMembers.ts
import { useState, useEffect } from 'react'
import { memberService } from '@/services/member.service'

export const useMembers = () => {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true)
        const response = await memberService.getMembers()
        setMembers(response.data.data || [])
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }
    fetchMembers()
  }, [])

  return { members, loading, error }
}
```

---

## 10. 개발 상태 요약

| Phase | 내용 | 상태 |
|-------|------|------|
| 1 | 프로젝트 기초 구조 | ✅ 완료 |
| 2 | 인증 시스템 | 📋 예정 |
| 3 | 회원 관리 UI | 📋 예정 |
| 4 | 평가 시스템 UI | 📋 예정 |
| 5 | 차트 시각화 | 📋 예정 |

---

*마지막 업데이트: 2026-01-21*
