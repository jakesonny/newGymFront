import { useState, useMemo } from 'react'

interface UseSearchOptions<T> {
  data: T[]
  searchFields: Array<keyof T | ((item: T) => string)>
  debounceMs?: number
}

export function useSearch<T>({ data, searchFields }: UseSearchOptions<T>) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data

    const query = searchQuery.toLowerCase()
    return data.filter((item) => {
      return searchFields.some((field) => {
        if (typeof field === 'function') {
          return field(item).toLowerCase().includes(query)
        }
        const value = item[field]
        return value ? String(value).toLowerCase().includes(query) : false
      })
    })
  }, [data, searchQuery, searchFields])

  return {
    searchQuery,
    setSearchQuery,
    filteredData,
  }
}
