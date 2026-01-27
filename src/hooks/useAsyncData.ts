import { useState, useEffect, useCallback, useRef } from 'react'

interface UseAsyncDataOptions<T> {
  fetchFn: () => Promise<T>
  dependencies?: unknown[]
  enabled?: boolean
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
}

export function useAsyncData<T>({
  fetchFn,
  dependencies = [],
  enabled = true,
  onSuccess,
  onError,
}: UseAsyncDataOptions<T>) {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>('')
  
  // fetchFn을 ref로 저장하여 의존성 문제 해결
  const fetchFnRef = useRef(fetchFn)
  const onSuccessRef = useRef(onSuccess)
  const onErrorRef = useRef(onError)
  
  // ref 업데이트 (의존성 변경 시)
  useEffect(() => {
    fetchFnRef.current = fetchFn
    onSuccessRef.current = onSuccess
    onErrorRef.current = onError
  }, [fetchFn, onSuccess, onError])

  const fetchData = useCallback(async () => {
    if (!enabled) return

    setIsLoading(true)
    setError('')

    try {
      const result = await fetchFnRef.current()
      setData(result)
      onSuccessRef.current?.(result)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '데이터를 불러오는데 실패했습니다.'
      setError(errorMessage)
      onErrorRef.current?.(err instanceof Error ? err : new Error(errorMessage))
    } finally {
      setIsLoading(false)
    }
  }, [enabled])

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchData, ...dependencies])

  const refetch = useCallback(() => {
    fetchData()
  }, [fetchData])

  return { data, isLoading, error, refetch }
}
