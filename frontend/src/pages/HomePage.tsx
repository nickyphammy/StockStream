import { useState } from 'react'
import { StockService, type StockData } from '../services'
import { SearchBar } from '../components'

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
        <SearchBar
          searchSymbol={searchSymbol}
          loading={loading}
          error={error}
          onSearchChange={setSearchSymbol}
          onSubmit={handleSearch}
        />

        {/* Stock Data Display - Simple Text Box */}
        {stockData && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-dark-card border border-dark-border rounded-lg p-6">
              <h3 className="text-xl font-semibold text-dark-text mb-4">
                Stock Data Received from Backend:
              </h3>
              <pre className="bg-black/50 border border-dark-border rounded p-4 overflow-x-auto">
                <code className="text-green-400 text-sm">
                  {JSON.stringify(stockData, null, 2)}
                </code>
              </pre>
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-dark-text">
                <div>
                  <span className="text-dark-text-muted">Symbol:</span> {stockData.symbol}
                </div>
                <div>
                  <span className="text-dark-text-muted">Price:</span> ${stockData.price.toFixed(2)}
                </div>
                <div>
                  <span className="text-dark-text-muted">Change:</span>
                  <span className={stockData.change >= 0 ? 'text-green-400' : 'text-red-400'}>
                    {' '}{stockData.change >= 0 ? '+' : ''}{stockData.change.toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="text-dark-text-muted">Change %:</span>
                  <span className={stockData.changePercent >= 0 ? 'text-green-400' : 'text-red-400'}>
                    {' '}{stockData.changePercent >= 0 ? '+' : ''}{stockData.changePercent.toFixed(2)}%
                  </span>
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