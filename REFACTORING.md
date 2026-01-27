# 프론트엔드 리팩토링 완료 (2026-01-21)

## 목적
코드 간소화 및 유지보수성 향상을 위한 리팩토링

## 주요 변경 사항

### 1. 커스텀 훅 생성

#### `useAsyncData`
데이터 fetching과 로딩/에러 상태를 통합 관리하는 훅

**사용 전:**
```typescript
const [data, setData] = useState(null)
const [isLoading, setIsLoading] = useState(true)
const [error, setError] = useState('')

useEffect(() => {
  const fetchData = async () => {
    try {
      const result = await service.getData()
      setData(result)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }
  fetchData()
}, [])
```

**사용 후:**
```typescript
const { data, isLoading, error, refetch } = useAsyncData({
  fetchFn: () => service.getData(),
  dependencies: [memberId],
})
```

#### `useSearch`
검색 필터링 로직을 통합하는 훅

**사용 전:**
```typescript
const [searchQuery, setSearchQuery] = useState('')
const filteredData = data.filter(item => 
  item.name.toLowerCase().includes(searchQuery.toLowerCase())
)
```

**사용 후:**
```typescript
const { searchQuery, setSearchQuery, filteredData } = useSearch({
  data: members,
  searchFields: ['name', 'phone', 'email'],
})
```

### 2. 공통 컴포넌트 추출

#### `Loading`
로딩 상태 표시 컴포넌트
- 중복된 로딩 UI 제거
- 일관된 로딩 스피너 제공

#### `ErrorMessage`
에러 메시지 표시 컴포넌트
- 중복된 에러 UI 제거
- 재시도 기능 포함

#### `MetricCard`
메트릭 카드 컴포넌트 (BODY, STRENGTH, CONDITIONING 등)
- 3개 페이지에서 중복되던 메트릭 카드 통합
- 트렌드 배지, 점수, 항목 리스트를 props로 받음

#### `PageHeader`
페이지 헤더 컴포넌트
- 제목, 부제목, 뒤로가기 링크, 액션 버튼 통합
- 모든 페이지에서 일관된 헤더 제공

#### `SearchInput`
검색 입력 컴포넌트
- 검색 아이콘과 입력 필드 통합
- 여러 페이지에서 사용

#### `StepIndicator`
단계 표시기 컴포넌트
- 위저드 스타일 폼에서 단계 표시

### 3. 공통 유틸리티 함수

#### `errorHandler.ts`
- `getErrorMessage()`: 에러 객체를 문자열로 변환
- `logError()`: 에러 로깅 유틸리티

#### `dateFormatter.ts`
- `formatDate()`: 날짜 포맷팅 (full, short, date)
- `formatDateRange()`: 날짜 범위 포맷팅

### 4. 페이지 컴포넌트 리팩토링

#### 변경된 페이지
- `GoalAnalystPage`: useAsyncData, Loading, ErrorMessage, MetricCard, PageHeader 적용
- `MemberDetailPage`: useAsyncData, Loading, ErrorMessage, MetricCard, PageHeader 적용
- `CenterDashboardPage`: useAsyncData, useSearch, Loading, ErrorMessage, SearchInput, PageHeader 적용
- `MembersPage`: useAsyncData, useSearch, Loading, ErrorMessage, SearchInput, PageHeader, formatDate 적용
- `DashboardPage`: MetricCard, PageHeader 적용
- `StrengthLevelPage`: ErrorMessage, PageHeader, getErrorMessage 적용
- `LoginPage`: ErrorMessage, getErrorMessage 적용
- `RegisterPage`: ErrorMessage, getErrorMessage 적용
- `NewMemberPage`: ErrorMessage, PageHeader, StepIndicator, getErrorMessage 적용

### 5. CSS 중복 제거

#### 제거된 중복 스타일
- `.loading` - Loading 컴포넌트로 이동
- `.error`, `.error-message` - ErrorMessage 컴포넌트로 이동
- `.page-title`, `.page-subtitle` - PageHeader 컴포넌트로 이동
- `.back-link` - PageHeader 컴포넌트로 이동
- `.metric-header`, `.metric-score`, `.metric-details`, `.metric-item`, `.trend-badge` - MetricCard 컴포넌트로 이동
- `.search-wrapper`, `.search-icon`, `.search-input` - SearchInput 컴포넌트로 이동
- `.step-indicator` - StepIndicator 컴포넌트로 이동

## 개선 효과

### 코드 라인 수 감소
- **이전**: 각 페이지마다 로딩/에러 상태 관리 코드 반복 (약 15-20줄)
- **이후**: useAsyncData 훅으로 1줄로 축소
- **예상 감소량**: 약 200-300줄

### 유지보수성 향상
- 공통 컴포넌트 변경 시 모든 페이지에 자동 반영
- 일관된 UI/UX 제공
- 버그 수정 시 한 곳만 수정하면 됨

### 가독성 향상
- 페이지 컴포넌트가 비즈니스 로직에 집중
- 반복적인 보일러플레이트 코드 제거
- 컴포넌트 재사용성 향상

## 파일 구조

```
src/
├── components/
│   ├── Loading.tsx          # 새로 추가
│   ├── ErrorMessage.tsx      # 새로 추가
│   ├── MetricCard.tsx        # 새로 추가
│   ├── PageHeader.tsx        # 새로 추가
│   ├── SearchInput.tsx       # 새로 추가
│   ├── StepIndicator.tsx    # 새로 추가
│   └── ... (기존 컴포넌트)
├── hooks/
│   ├── useAsyncData.ts       # 새로 추가
│   ├── useSearch.ts          # 새로 추가
│   └── index.ts
├── utils/
│   ├── errorHandler.ts       # 새로 추가
│   ├── dateFormatter.ts      # 새로 추가
│   └── index.ts
└── pages/
    └── ... (리팩토링된 페이지들)
```

## 사용 예시

### useAsyncData 사용
```typescript
const { data, isLoading, error, refetch } = useAsyncData<Member>({
  fetchFn: () => membersService.getById(memberId),
  dependencies: [memberId],
  enabled: !!memberId,
  onSuccess: (data) => console.log('로드 완료:', data),
  onError: (error) => console.error('에러:', error),
})
```

### useSearch 사용
```typescript
const { searchQuery, setSearchQuery, filteredData } = useSearch({
  data: members,
  searchFields: [
    'name',
    'phone',
    (member) => member.email || '',
  ],
  debounceMs: 300, // 선택적
})
```

### MetricCard 사용
```typescript
<MetricCard
  title="BODY (체성분)"
  score={78}
  trend="up"
  icon={Heart}
  items={[
    { label: '체중', value: '80kg → 79.5kg' },
    { label: '골격근', value: '37.2kg → 37.5kg' },
  ]}
  borderColor="success"
/>
```

## 다음 단계 (선택)

1. **추가 공통 컴포넌트**
   - Table 컴포넌트 (MembersPage, CenterDashboardPage에서 사용)
   - Pagination 컴포넌트
   - FormField 컴포넌트 (Input + Label + Error 통합)

2. **추가 커스텀 훅**
   - usePagination
   - useForm (폼 상태 관리)
   - useDebounce

3. **스타일 통합**
   - 공통 CSS 변수 확장
   - 반응형 유틸리티 클래스

---

**리팩토링 완료일**: 2026-01-21
**주요 목표**: 코드 간소화 및 유지보수성 향상 ✅
