# 배포 가이드

## 배포 구조

- **프론트엔드**: Vercel로 배포
- **백엔드**: Render로 배포
- **통신**: HTTP API를 통한 통신 (직접 import 없음)

## Vercel 배포 설정

### 1. 환경 변수 설정

Vercel 대시보드에서 다음 환경 변수를 설정하세요:

```
VITE_API_BASE_URL=https://your-backend-render-url.onrender.com
```

**설정 방법**:
1. Vercel 프로젝트 대시보드 접속
2. Settings → Environment Variables
3. `VITE_API_BASE_URL` 추가
4. 값: Render로 배포한 백엔드 URL (예: `https://newgym-1qof.onrender.com`)

### 2. 빌드 설정

Vercel은 자동으로 다음을 감지합니다:
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 3. 배포 명령어

```bash
# Vercel CLI를 통한 배포
npm i -g vercel
vercel

# 또는 Git Push를 통한 자동 배포
git push origin main
```

## Render 배포 설정 (백엔드)

### 1. 환경 변수 설정

Render 대시보드에서 필요한 환경 변수를 설정하세요:
- `DATABASE_URL`
- `JWT_SECRET`
- `PORT` (기본값: 3001)
- 기타 필요한 환경 변수

### 2. CORS 설정

백엔드에서 프론트엔드 도메인을 허용하도록 CORS 설정이 필요합니다:

```typescript
// 백엔드 src/main.ts 또는 cors 설정 파일
const allowedOrigins = [
  'http://localhost:3000', // 로컬 개발
  'https://your-frontend-vercel-url.vercel.app', // Vercel 배포 URL
]
```

## 환경별 설정

### 개발 환경

**프론트엔드** (`.env`):
```env
VITE_API_BASE_URL=http://localhost:3001
```

**백엔드**: 로컬에서 실행 (`npm run start:dev`)

### 프로덕션 환경

**프론트엔드** (Vercel 환경 변수):
```env
VITE_API_BASE_URL=https://your-backend-render-url.onrender.com
```

**백엔드**: Render에서 실행

## 주의사항

1. **환경 변수 접두사**: Vite는 `VITE_` 접두사가 있는 환경 변수만 클라이언트에 노출됩니다.

2. **CORS 설정**: 백엔드에서 프론트엔드 도메인을 명시적으로 허용해야 합니다.

3. **HTTPS**: 프로덕션 환경에서는 반드시 HTTPS를 사용해야 합니다.

4. **환경 변수 보안**: 
   - `.env` 파일은 git에 포함하지 않음
   - Vercel/Render 환경 변수는 대시보드에서 관리

## 배포 확인

### 프론트엔드 확인
1. Vercel 배포 URL 접속
2. 브라우저 개발자 도구 → Network 탭
3. API 요청이 Render 백엔드 URL로 전송되는지 확인

### 백엔드 확인
1. Render 대시보드에서 서비스 상태 확인
2. 로그에서 에러 확인
3. CORS 에러가 없는지 확인

## 문제 해결

### CORS 에러
- 백엔드 CORS 설정에 프론트엔드 도메인 추가
- `Access-Control-Allow-Origin` 헤더 확인

### 환경 변수 미적용
- Vercel에서 환경 변수 설정 후 재배포
- 빌드 로그에서 환경 변수 확인

### API 연결 실패
- 백엔드 URL이 올바른지 확인
- 네트워크 탭에서 요청 URL 확인
- 백엔드 서비스가 실행 중인지 확인
