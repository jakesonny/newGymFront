# 프론트엔드 리팩토링 V2 완료 (2026-01-21)

## 목적
놓친 부분 확인 및 추가 개선사항 적용

## 주요 변경 사항

### 1. StatusBadge 컴포넌트 추출

여러 페이지에서 중복되던 status badge 로직을 통합 컴포넌트로 추출

**이전:**
```typescript
// MembersPage.tsx
<span className={`status-badge status-${member.status?.toLowerCase() || 'active'}`}>
  {member.status === 'ACTIVE' ? '활성' : member.status === 'INACTIVE' ? '비활성' : '정지'}
</span>

// CenterDashboardPage.tsx
const getRiskStatusColor = (status: string) => { ... }
const getRiskStatusLabel = (status: string) => { ... }
<span className="status-badge" style={{ color: getRiskStatusColor(...) }}>
  <span className="status-dot" style={{ backgroundColor: getRiskStatusColor(...) }} />
  {getRiskStatusLabel(...)}
</span>
```

**이후:**
```typescript
// 모든 페이지에서 통일된 사용
<StatusBadge status={member.status || 'ACTIVE'} type="member" />
<StatusBadge status={member.riskStatus} type="risk" showDot />
```

**장점:**
- 일관된 UI 제공
- 상태 로직 중앙 관리
- 재사용성 향상

### 2. Status 유틸리티 함수 추출

`statusUtils.ts` 파일 생성
- `getRiskStatusColor()`: 위험 상태 색상 반환
- `getRiskStatusLabel()`: 위험 상태 라벨 반환
- `getMemberStatusLabel()`: 회원 상태 라벨 반환

### 3. 임포트 경로 정리 (Barrel Export 활용)

**이전:**
```typescript
import { Layout } from '@/components/Layout'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { Loading } from '@/components/Loading'
import { ErrorMessage } from '@/components/ErrorMessage'
import { PageHeader } from '@/components/PageHeader'
import { SearchInput } from '@/components/SearchInput'
```

**이후:**
```typescript
import { Layout, Card, Button, Loading, ErrorMessage, PageHeader, SearchInput } from '@/components'
```

**장점:**
- 임포트 문 간소화
- 유지보수 용이 (컴포넌트 경로 변경 시 한 곳만 수정)
- 가독성 향상

### 4. DashboardPage 개선

- 불필요한 `useEffect`, `useState` 제거
- `Loading` 컴포넌트 임포트 추가 (실제 사용 준비)
- TODO 주석으로 향후 `useAsyncData` 적용 계획 명시

### 5. 중복 CSS 제거

**제거된 중복 스타일:**
- `.status-badge` - StatusBadge 컴포넌트로 이동
- `.status-active`, `.status-inactive`, `.status-suspended` - StatusBadge 컴포넌트로 이동
- `.status-green` - StatusBadge 컴포넌트로 이동
- `.member-meta` 중복 정의 제거

## 변경된 파일 목록

### 새로 생성된 파일
- `src/components/StatusBadge.tsx`
- `src/components/StatusBadge.css`
- `src/utils/statusUtils.ts`

### 수정된 파일
- `src/components/index.ts` - StatusBadge export 추가
- `src/utils/index.ts` - statusUtils export 추가
- `src/pages/CenterDashboardPage.tsx` - StatusBadge 사용, barrel export 적용
- `src/pages/MembersPage.tsx` - StatusBadge 사용, barrel export 적용
- `src/pages/MemberDetailPage.tsx` - StatusBadge 사용, barrel export 적용
- `src/pages/DashboardPage.tsx` - barrel export 적용, 코드 정리
- `src/pages/GoalAnalystPage.tsx` - barrel export 적용
- `src/pages/StrengthLevelPage.tsx` - barrel export 적용
- `src/pages/LoginPage.tsx` - barrel export 적용
- `src/pages/RegisterPage.tsx` - barrel export 적용
- `src/pages/NewMemberPage.tsx` - barrel export 적용
- `src/pages/MembersPage.css` - 중복 CSS 제거
- `src/pages/MemberDetailPage.css` - 중복 CSS 제거
- `src/pages/CenterDashboardPage.css` - 중복 CSS 제거

## 개선 효과

### 코드 일관성
- 모든 페이지에서 동일한 임포트 패턴 사용
- StatusBadge 컴포넌트로 상태 표시 통일

### 유지보수성
- StatusBadge 변경 시 모든 페이지에 자동 반영
- 컴포넌트 경로 변경 시 barrel export만 수정하면 됨

### 코드 간소화
- 임포트 문 평균 50% 감소
- 중복 CSS 제거로 스타일 파일 크기 감소

## StatusBadge 컴포넌트 사용법

### 회원 상태 표시
```typescript
<StatusBadge status="ACTIVE" type="member" />
<StatusBadge status="INACTIVE" type="member" />
<StatusBadge status="SUSPENDED" type="member" />
```

### 위험 상태 표시 (점 포함)
```typescript
<StatusBadge status="GREEN" type="risk" showDot />
<StatusBadge status="YELLOW" type="risk" showDot />
<StatusBadge status="RED" type="risk" showDot />
<StatusBadge status="FOUNDATION" type="risk" showDot />
```

## 다음 단계 (선택)

1. **추가 공통 컴포넌트**
   - Table 컴포넌트 (MembersPage, CenterDashboardPage에서 사용)
   - Pagination 컴포넌트
   - ProgressBar 컴포넌트

2. **추가 유틸리티**
   - 날짜 계산 함수 (D-day 계산 등)
   - 숫자 포맷팅 함수

3. **타입 안정성 향상**
   - StatusBadge props 타입 강화
   - 더 엄격한 타입 체크

---

**리팩토링 완료일**: 2026-01-21
**주요 목표**: 놓친 부분 확인 및 추가 개선 ✅
