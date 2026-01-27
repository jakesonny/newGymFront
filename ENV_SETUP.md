# 환경 변수 설정 가이드

## 백엔드 API 주소 설정

프론트엔드에서 백엔드 API 주소는 **환경 변수**로 관리됩니다.

## 설정 위치

### 1. 로컬 개발 환경
**파일**: `.env` (프로젝트 루트)

```env
VITE_API_BASE_URL=http://localhost:3001
```

### 2. 프로덕션 환경
**파일**: `.env.production` (프로젝트 루트)

```env
VITE_API_BASE_URL=https://newgym-1qof.onrender.com
```

## 사용 방법

### 현재 설정 확인
`src/services/api.ts` 파일에서 환경 변수를 읽어옵니다:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'
```

### 환경별 동작

1. **로컬 개발** (`npm run dev`):
   - `.env` 파일의 값 사용
   - 기본값: `http://localhost:3001`

2. **프로덕션 빌드** (`npm run build`):
   - `.env.production` 파일의 값 사용
   - 현재 설정: `https://newgym-1qof.onrender.com`

3. **환경 변수 없음**:
   - 기본값 `http://localhost:3001` 사용

## 파일 구조

```
gym-membership-front/
├── .env                 # 로컬 개발용 (git에 포함 안 됨)
├── .env.example         # 템플릿 파일 (git에 포함)
├── .env.production      # 프로덕션용 (git에 포함 가능)
└── src/
    └── services/
        └── api.ts       # 환경 변수 사용
```

## 주의사항

1. **Vite 환경 변수 규칙**:
   - 환경 변수는 반드시 `VITE_` 접두사로 시작해야 함
   - `import.meta.env.VITE_API_BASE_URL`로 접근

2. **.gitignore**:
   - `.env` 파일은 git에 포함되지 않음 (보안)
   - `.env.example`은 템플릿으로 git에 포함됨
   - `.env.production`은 선택적으로 포함 가능

3. **환경 변수 변경 후**:
   - 개발 서버 재시작 필요 (`npm run dev`)
   - 빌드 시에는 빌드 전에 환경 변수 설정 필요

## 배포 시 설정

### Vercel 배포 시:

1. **환경 변수 설정** (권장):
   - Vercel 대시보드 → Settings → Environment Variables
   - `VITE_API_BASE_URL` 추가
   - 값: Render로 배포한 백엔드 URL (예: `https://your-backend.onrender.com`)

2. **또는 .env.production 파일 사용**:
   - `.env.production` 파일에 프로덕션 주소 설정
   - 빌드 시 자동으로 사용됨

### 배포 구조

- **프론트엔드**: Vercel로 배포
- **백엔드**: Render로 배포
- **통신**: HTTP API를 통한 통신 (직접 import/export 없음)

자세한 배포 가이드는 `DEPLOYMENT.md` 파일을 참고하세요.

## 현재 백엔드 주소

- **로컬 개발**: `http://localhost:3001`
- **프로덕션**: Render로 배포한 백엔드 URL (환경 변수로 설정)

---

**업데이트**: 2026-01-22
