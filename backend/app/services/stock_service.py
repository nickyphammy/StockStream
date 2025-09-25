import os
import finnhub
from typing import Optional, List, Dict, Any, Tuple
from datetime import datetime, timedelta
from dotenv import load_dotenv
from ..models.stock import StockData, NewsArticle, SearchResult

# Load environment variables
load_dotenv()

class StockService:
    """Service for fetching stock price data from Finnhub API with caching"""

    def __init__(self):
        self.api_key = os.getenv("FINNHUB_API_KEY")
        if not self.api_key:
            raise ValueError("FINNHUB_API_KEY environment variable is required")

        # Initialize Finnhub client
        self.client = finnhub.Client(api_key=self.api_key)

        # Initialize cache storage
        self._cache: Dict[str, Tuple[Any, datetime]] = {}

        # Cache TTL settings (in seconds)
        self._quote_ttl = 60  # Stock quotes: 1 minute
        self._news_ttl = 300  # News: 5 minutes
        self._search_ttl = 120  # Search results: 2 minutes

    def _get_from_cache(self, cache_key: str, ttl_seconds: int) -> Optional[Any]:
        """Get data from cache if valid"""
        if cache_key in self._cache:
            cached_data, timestamp = self._cache[cache_key]
            if datetime.now() - timestamp < timedelta(seconds=ttl_seconds):
                print(f"Cache hit for key: {cache_key}")
                return cached_data
            else:
                # Remove expired cache entry
                del self._cache[cache_key]
                print(f"Cache expired for key: {cache_key}")
        return None

    def _set_cache(self, cache_key: str, data: Any) -> None:
        """Store data in cache with current timestamp"""
        self._cache[cache_key] = (data, datetime.now())
        print(f"Cached data for key: {cache_key}")

    def clear_cache(self) -> None:
        """Clear all cached data"""
        self._cache.clear()
        print("Cache cleared")
    
    async def get_stock_data(self, symbol: str) -> Optional[StockData]:
        """
        Fetch real-time stock price data from Finnhub API with caching
        """
        try:
            symbol = symbol.upper().strip()
            cache_key = f"quote_{symbol}"

            # Check cache first
            cached_data = self._get_from_cache(cache_key, self._quote_ttl)
            if cached_data:
                return cached_data

            # Get stock quote (real-time price data)
            quote_data = self.client.quote(symbol)

            # Check if we got valid data
            if not quote_data or quote_data.get('c') is None:
                print(f"No quote data found for symbol: {symbol}")
                return None

            # Map Finnhub data to our StockData model - focus on price data only
            stock_data = StockData(
                symbol=symbol,
                price=float(quote_data['c']),  # Current price
                change=float(quote_data['d']),  # Change
                changePercent=float(quote_data['dp']),  # Change percent
                high=float(quote_data['h']),  # High price of the day
                low=float(quote_data['l']),   # Low price of the day
                open=float(quote_data['o']),  # Open price of the day
                previousClose=float(quote_data['pc']),  # Previous close price
                timestamp=datetime.now()
            )

            # Store in cache
            self._set_cache(cache_key, stock_data)

            return stock_data

        except Exception as e:
            print(f"Error fetching stock data for {symbol}: {e}")
            return None

    async def get_company_news(self, symbol: str, days: int = 7) -> Optional[List[NewsArticle]]:
        """
        Fetch company news from Finnhub API with caching
        Args:
            symbol: Stock symbol (e.g., AAPL)
            days: Number of days back to fetch news (default: 7)
        """
        try:
            symbol = symbol.upper().strip()
            cache_key = f"news_{symbol}_{days}"

            # Check cache first
            cached_data = self._get_from_cache(cache_key, self._news_ttl)
            if cached_data is not None:
                return cached_data

            # Calculate date range (Finnhub uses YYYY-MM-DD format)
            end_date = datetime.now()
            start_date = end_date - timedelta(days=days)

            # Format dates for Finnhub API
            from_date = start_date.strftime('%Y-%m-%d')
            to_date = end_date.strftime('%Y-%m-%d')

            # Get company news from Finnhub
            news_data = self.client.company_news(symbol, _from=from_date, to=to_date)

            if not news_data:
                print(f"No news found for symbol: {symbol}")
                # Cache empty result too to avoid repeated API calls
                self._set_cache(cache_key, [])
                return []

            # Convert to our NewsArticle model
            articles = []
            for article in news_data[:10]:  # Limit to 10 most recent articles
                try:
                    news_article = NewsArticle(
                        id=article.get('id', 0),
                        headline=article.get('headline', 'No headline'),
                        summary=article.get('summary', 'No summary available'),
                        url=article.get('url', ''),
                        image=article.get('image', None),
                        source=article.get('source', 'Unknown'),
                        category=article.get('category', 'General'),
                        datetime=article.get('datetime', int(datetime.now().timestamp())),
                        related=symbol
                    )
                    articles.append(news_article)
                except Exception as e:
                    print(f"Error processing news article: {e}")
                    continue

            # Store in cache
            self._set_cache(cache_key, articles)

            return articles

        except Exception as e:
            print(f"Error fetching news for {symbol}: {e}")
            return None

    async def search_symbols(self, query: str) -> Optional[List[SearchResult]]:
        """
        Search for stocks by company name or symbol with caching
        Args:
            query: Search query (company name or partial symbol)
        """
        try:
            query = query.strip()

            if not query:
                return []

            cache_key = f"search_{query.lower()}"

            # Check cache first
            cached_data = self._get_from_cache(cache_key, self._search_ttl)
            if cached_data is not None:
                return cached_data

            # Use Finnhub's symbol search endpoint
            search_results = self.client.symbol_lookup(query)

            if not search_results or 'result' not in search_results:
                # Cache empty result
                self._set_cache(cache_key, [])
                return []

            # Convert to our SearchResult model
            results = []
            for item in search_results['result'][:10]:  # Limit to 10 results
                try:
                    # Filter to only include stocks (not forex, crypto, etc)
                    if item.get('type', '').lower() in ['common stock', 'stock', 'equity', 'adr']:
                        search_result = SearchResult(
                            symbol=item.get('symbol', ''),
                            description=item.get('description', ''),
                            type=item.get('type', 'Stock'),
                            displaySymbol=item.get('displaySymbol', item.get('symbol', '')),
                            currency=item.get('currency', 'USD')
                        )
                        results.append(search_result)
                except Exception as e:
                    print(f"Error processing search result: {e}")
                    continue

            # Store in cache
            self._set_cache(cache_key, results)

            return results

        except Exception as e:
            print(f"Error searching for '{query}': {e}")
            return None

# Create a singleton instance
stock_service_instance = None

def get_stock_service() -> StockService:
    """Get or create StockService instance"""
    global stock_service_instance
    if stock_service_instance is None:
        stock_service_instance = StockService()
    return stock_service_instance