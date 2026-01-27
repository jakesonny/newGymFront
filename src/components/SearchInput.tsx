import { Search } from 'lucide-react'
import { Input } from './Input'
import './SearchInput.css'

interface SearchInputProps {
  placeholder?: string
  value: string
  onChange: (value: string) => void
  className?: string
}

export function SearchInput({ placeholder = '검색...', value, onChange, className = '' }: SearchInputProps) {
  return (
    <div className={`search-wrapper ${className}`}>
      <Search size={20} className="search-icon" />
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="search-input"
      />
    </div>
  )
}
