interface SearchBarProps {
  searchSymbol: string
  loading: boolean
  error: string
  onSearchChange: (value: string) => void
  onSubmit: (e: React.FormEvent) => void
}

function SearchBar({ searchSymbol, loading, error, onSearchChange, onSubmit }: SearchBarProps) {
  return (
    <div className="max-w-2xl mx-auto mb-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-dark-text mb-2">
          Search Any Stock
        </h2>
        <p className="text-dark-text-muted">
          Get real-time prices and market data
        </p>
      </div>
      
      <form onSubmit={onSubmit} className="flex gap-3">
        <div className="flex-1">
          <input
            type="text"
            value={searchSymbol}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Enter stock symbol (e.g., AAPL, GOOGL, TSLA)"
            className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-lg 
                     text-dark-text placeholder-dark-text-muted
                     focus:ring-2 focus:ring-stock-blue focus:border-stock-blue
                     transition-colors"
            disabled={loading}
          />
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