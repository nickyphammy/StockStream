import { useState } from 'react'
import { StockService, type StockData, type NewsArticle } from '../services'
import { SearchBar } from '../components'

function HomePage() {
  const [searchSymbol, setSearchSymbol] = useState<string>('')
  const [stockData, setStockData] = useState<StockData | null>(null)
  const [newsData, setNewsData] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [loadingNews, setLoadingNews] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchSymbol.trim()) return

    setLoading(true)
    setLoadingNews(true)
    setError('')

    try {
      // Fetch stock data and news in parallel
      const [stockResult, newsResult] = await Promise.allSettled([
        StockService.getStockData(searchSymbol),
        StockService.getStockNews(searchSymbol, 7)
      ])

      // Handle stock data
      if (stockResult.status === 'fulfilled') {
        setStockData(stockResult.value)
      } else {
        setError(stockResult.reason?.message || 'Failed to fetch stock data')
      }

      // Handle news data
      if (newsResult.status === 'fulfilled') {
        setNewsData(newsResult.value)
      } else {
        console.warn('Failed to fetch news:', newsResult.reason?.message)
        setNewsData([]) // Clear news on error but don't show error to user
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data')
    } finally {
      setLoading(false)
      setLoadingNews(false)
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
          onSelectStock={async (symbol) => {
            setSearchSymbol(symbol)
            // Automatically search when a stock is selected
            const e = { preventDefault: () => {} } as React.FormEvent
            await handleSearch(e)
          }}
        />

        {/* Stock Data Display - Formatted */}
        {stockData && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-dark-card border border-dark-border rounded-lg p-6">
              {/* Stock Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-dark-text">{stockData.symbol}</h2>
                  <p className="text-sm text-dark-text-muted mt-1">
                    Last updated: {stockData.timestamp ? new Date(stockData.timestamp).toLocaleString() : 'Just now'}
                  </p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  stockData.change >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {stockData.change >= 0 ? '↑ Up' : '↓ Down'}
                </div>
              </div>

              {/* Main Price Display */}
              <div className="mb-6">
                <div className="flex items-baseline gap-4">
                  <span className="text-5xl font-bold text-dark-text">
                    ${stockData.price.toFixed(2)}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className={`text-2xl font-semibold ${
                      stockData.change >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {stockData.change >= 0 ? '+' : ''}{stockData.change.toFixed(2)}
                    </span>
                    <span className={`text-lg px-2 py-1 rounded ${
                      stockData.changePercent >= 0
                        ? 'bg-green-500/10 text-green-400'
                        : 'bg-red-500/10 text-red-400'
                    }`}>
                      {stockData.changePercent >= 0 ? '+' : ''}{stockData.changePercent.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Detailed Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-black/30 rounded-lg p-3">
                  <p className="text-xs text-dark-text-muted mb-1">Open</p>
                  <p className="text-lg font-semibold text-dark-text">${stockData.open.toFixed(2)}</p>
                </div>
                <div className="bg-black/30 rounded-lg p-3">
                  <p className="text-xs text-dark-text-muted mb-1">Previous Close</p>
                  <p className="text-lg font-semibold text-dark-text">${stockData.previousClose.toFixed(2)}</p>
                </div>
                <div className="bg-black/30 rounded-lg p-3">
                  <p className="text-xs text-dark-text-muted mb-1">Day High</p>
                  <p className="text-lg font-semibold text-green-400">${stockData.high.toFixed(2)}</p>
                </div>
                <div className="bg-black/30 rounded-lg p-3">
                  <p className="text-xs text-dark-text-muted mb-1">Day Low</p>
                  <p className="text-lg font-semibold text-red-400">${stockData.low.toFixed(2)}</p>
                </div>
              </div>

              {/* Day Range Bar */}
              <div className="mt-6">
                <p className="text-sm text-dark-text-muted mb-2">Day Range</p>
                <div className="relative bg-black/30 rounded-full h-2">
                  <div
                    className="absolute top-0 h-2 bg-gradient-to-r from-red-500 to-green-500 rounded-full"
                    style={{
                      left: '0%',
                      width: `${((stockData.price - stockData.low) / (stockData.high - stockData.low)) * 100}%`
                    }}
                  />
                  <div
                    className="absolute -top-1 w-4 h-4 bg-white rounded-full shadow-lg"
                    style={{
                      left: `calc(${((stockData.price - stockData.low) / (stockData.high - stockData.low)) * 100}% - 8px)`
                    }}
                  />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-dark-text-muted">${stockData.low.toFixed(2)}</span>
                  <span className="text-xs text-dark-text font-semibold">${stockData.price.toFixed(2)}</span>
                  <span className="text-xs text-dark-text-muted">${stockData.high.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* News Display */}
        {(newsData.length > 0 || loadingNews) && (
          <div className="max-w-4xl mx-auto mt-8">
            <div className="bg-dark-card border border-dark-border rounded-lg p-6">
              <h3 className="text-xl font-semibold text-dark-text mb-4">
                Recent News {stockData && `for ${stockData.symbol}`}
              </h3>

              {loadingNews ? (
                <div className="text-center py-8">
                  <div className="text-dark-text-muted">Loading news...</div>
                </div>
              ) : (
                <div className="space-y-4">
                  {newsData.map((article) => (
                    <div key={article.id} className="border-b border-dark-border pb-4 last:border-b-0">
                      <div className="flex gap-4">
                        {article.image && (
                          <img
                            src={article.image}
                            alt=""
                            className="w-20 h-20 object-cover rounded flex-shrink-0"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                          />
                        )}
                        <div className="flex-1">
                          <a
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 font-medium"
                          >
                            {article.headline}
                          </a>
                          <p className="text-dark-text-muted text-sm mt-1 line-clamp-2">
                            {article.summary}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-dark-text-muted">
                            <span>{article.source}</span>
                            <span>{new Date(article.datetime * 1000).toLocaleDateString()}</span>
                            <span className="bg-dark-border px-2 py-1 rounded">{article.category}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {newsData.length === 0 && !loadingNews && (
                <div className="text-center py-8 text-dark-text-muted">
                  No recent news found for this symbol.
                </div>
              )}
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