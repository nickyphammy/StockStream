import { useState, useEffect, useRef } from 'react'
import { StockService, type SearchResult } from '../services/stockService'

interface SearchBarProps {
  searchSymbol: string
  loading: boolean
  error: string
  onSearchChange: (value: string) => void
  onSubmit: (e: React.FormEvent) => void
  onSelectStock: (symbol: string) => void
}

function SearchBar({ searchSymbol, loading, error, onSearchChange, onSubmit, onSelectStock }: SearchBarProps) {
  const [suggestions, setSuggestions] = useState<SearchResult[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  // Search for suggestions when user types
  useEffect(() => {
    if (searchSymbol.length < 2) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    // Clear previous timeout
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current)
    }

    // Debounce search
    searchTimeout.current = setTimeout(async () => {
      setSearchLoading(true)
      try {
        const results = await StockService.searchStocks(searchSymbol)
        setSuggestions(results)
        setShowSuggestions(true)
      } catch (err) {
        console.error('Search failed:', err)
        setSuggestions([])
      } finally {
        setSearchLoading(false)
      }
    }, 300) // 300ms debounce

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current)
      }
    }
  }, [searchSymbol])

  // Handle clicking outside suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelectSuggestion = (result: SearchResult) => {
    onSearchChange(result.symbol)
    onSelectStock(result.symbol)
    setShowSuggestions(false)
    setSelectedIndex(-1)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1))
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault()
      handleSelectSuggestion(suggestions[selectedIndex])
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
      setSelectedIndex(-1)
    }
  }

  return (
    <div className="max-w-2xl mx-auto mb-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-dark-text mb-2">
          Search Any Stock
        </h2>
        <p className="text-dark-text-muted">
          Search by company name or stock symbol
        </p>
      </div>

      <form onSubmit={onSubmit} className="relative">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchSymbol}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              placeholder="Enter company name or symbol (e.g., Apple, AAPL)"
              className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-lg
                       text-dark-text placeholder-dark-text-muted
                       focus:ring-2 focus:ring-stock-blue focus:border-stock-blue
                       transition-colors"
              disabled={loading}
              autoComplete="off"
            />

            {/* Search loading indicator */}
            {searchLoading && (
              <div className="absolute right-3 top-3.5">
                <div className="animate-spin h-5 w-5 border-2 border-stock-blue border-t-transparent rounded-full" />
              </div>
            )}

            {/* Suggestions dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div
                ref={suggestionsRef}
                className="absolute z-10 w-full mt-1 bg-dark-card border border-dark-border rounded-lg shadow-lg max-h-60 overflow-y-auto"
              >
                {suggestions.map((result, index) => (
                  <div
                    key={`${result.symbol}-${index}`}
                    className={`px-4 py-3 hover:bg-black/30 cursor-pointer transition-colors ${
                      index === selectedIndex ? 'bg-black/30' : ''
                    }`}
                    onClick={() => handleSelectSuggestion(result)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-medium text-dark-text">{result.symbol}</div>
                        <div className="text-sm text-dark-text-muted">{result.description}</div>
                      </div>
                      <div className="text-xs text-dark-text-muted ml-2">
                        {result.type}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={!searchSymbol.trim() || loading}
            className="px-6 py-3 bg-stock-blue text-white rounded-lg
                     hover:bg-blue-600 focus:ring-2 focus:ring-stock-blue
                     disabled:bg-gray-600 disabled:cursor-not-allowed
                     transition-colors font-medium"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
          <p className="text-red-400">{error}</p>
        </div>
      )}
    </div>
  )
}

export default SearchBar