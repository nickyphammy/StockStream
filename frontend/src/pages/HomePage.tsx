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