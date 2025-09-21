import os
import finnhub
from typing import Optional, List
from datetime import datetime, timedelta
from dotenv import load_dotenv
from ..models.stock import StockData, NewsArticle

# Load environment variables
load_dotenv()

class StockService:
    """Service for fetching stock price data from Finnhub API"""
    
    def __init__(self):
        self.api_key = os.getenv("FINNHUB_API_KEY")
        if not self.api_key:
            raise ValueError("FINNHUB_API_KEY environment variable is required")
        
        # Initialize Finnhub client
        self.client = finnhub.Client(api_key=self.api_key)
    
    async def get_stock_data(self, symbol: str) -> Optional[StockData]:
        """
        Fetch real-time stock price data from Finnhub API
        """
        try:
            symbol = symbol.upper().strip()
            
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
            
            return stock_data
            
        except Exception as e:
            print(f"Error fetching stock data for {symbol}: {e}")
            return None

    async def get_company_news(self, symbol: str, days: int = 7) -> Optional[List[NewsArticle]]:
        """
        Fetch company news from Finnhub API
        Args:
            symbol: Stock symbol (e.g., AAPL)
            days: Number of days back to fetch news (default: 7)
        """
        try:
            symbol = symbol.upper().strip()

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

            return articles

        except Exception as e:
            print(f"Error fetching news for {symbol}: {e}")
            return None

# Create a singleton instance
stock_service_instance = None

def get_stock_service() -> StockService:
    """Get or create StockService instance"""
    global stock_service_instance
    if stock_service_instance is None:
        stock_service_instance = StockService()
    return stock_service_instance