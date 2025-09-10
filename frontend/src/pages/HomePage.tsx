import { useState } from 'react'
import { StockService } from '../services'

function HomePage() {
  const [searchSymbol, setSearchSymbol] = useState<string>('')
  const [stockData, setStockData] = useState<StockData | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchSymbol.trim()) return

    setLoading(true)
    setError('')
    
    try {
      const data = await StockService.getStockData(searchSymbol)
      setStockData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stock data')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-bg text-dark-text">
      {/* Header */}
      <header className="bg-dark-card border-b border-dark-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center space-x-3">
            <div className="text-3xl">📈</div>
            <h1 className="text-3xl font-bold text-dark-text">StockStream</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Search Section */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-dark-text mb-2">
              Search Any Stock
            </h2>
            <p className="text-dark-text-muted">
              Get real-time prices and market data
            </p>
          </div>
          
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="flex-1">
              <input
                type="text"
                value={searchSymbol}
                onChange={(e) => setSearchSymbol(e.target.value)}
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

        {/* Results Section */}
        {stockData && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-dark-card rounded-lg border border-dark-border p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-dark-text">{stockData.symbol}</h3>
                  <p className="text-dark-text-muted">{stockData.name}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-dark-text">
                    ${stockData.price.toFixed(2)}
                  </div>
                  <div className={`flex items-center justify-end mt-1 ${
                    stockData.change >= 0 ? 'text-stock-green' : 'text-stock-red'
                  }`}>
                    <span className="mr-1">
                      {stockData.change >= 0 ? '▲' : '▼'}
                    </span>
                    <span>${Math.abs(stockData.change).toFixed(2)}</span>
                    <span className="ml-1">({Math.abs(stockData.changePercent).toFixed(2)}%)</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-6 text-sm">
                <div className="text-center">
                  <div className="text-dark-text-muted mb-1">High</div>
                  <div className="text-dark-text font-semibold">${stockData.high.toFixed(2)}</div>
                </div>
                <div className="text-center">
                  <div className="text-dark-text-muted mb-1">Low</div>
                  <div className="text-dark-text font-semibold">${stockData.low.toFixed(2)}</div>
                </div>
                <div className="text-center">
                  <div className="text-dark-text-muted mb-1">Volume</div>
                  <div className="text-dark-text font-semibold">
                    {stockData.volume.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Welcome Message */}
        {!stockData && !loading && (
          <div className="text-center py-16">
            <div className="text-6xl mb-6">📊</div>
            <h3 className="text-xl font-semibold text-dark-text mb-2">
              Welcome to StockStream
            </h3>
            <p className="text-dark-text-muted max-w-md mx-auto">
              Enter a stock symbol above to get started with real-time market data, 
              charts, and analysis.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}

export default HomePage