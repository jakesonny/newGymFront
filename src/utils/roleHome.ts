/**
 * 로그인 후(또는 루트 진입 시) 역할별 기본 랜딩 경로.
 * MEMBER는 관리 대시보드(TRAINER 전용)에 들어갈 수 없어 /mypage로,
 * TRAINER/ADMIN은 회원 관리 대시보드로 보낸다.
 */
export function getHomeRouteForRole(role: string | undefined): string {
  if (role === 'TRAINER' || role === 'ADMIN') {
    return '/dashboard'
  }
  return '/mypage'
}
