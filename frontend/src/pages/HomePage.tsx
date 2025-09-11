import { useState } from 'react'
import { StockService } from '../services'
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