import httpx
from typing import Optional
from ..models.stock import StockData

class StockService:
    """Service for fetching stock data from external APIs"""
    
    @staticmethod
    async def get_stock_data(symbol: str) -> Optional[StockData]:
        """
        Fetch stock data for a given symbol.
        Using Alpha Vantage API as an example (you'll need an API key).
        """
        # For now, return mock data until you set up a real API
        # You can replace this with Alpha Vantage, Yahoo Finance, or another API
        
        try:
            # Mock data for testing - replace with real API call
            mock_data = {
                "symbol": symbol.upper(),
                "name": f"{symbol.upper()} Inc.",
                "price": 150.25,
                "change": 2.5,
                "changePercent": 1.69,
                "high": 152.30,
                "low": 148.10,
                "volume": 1250000
            }
            
            return StockData(**mock_data)
            
        except Exception as e:
            print(f"Error fetching stock data for {symbol}: {e}")
            return None
    
    @staticmethod
    async def get_stock_data_from_api(symbol: str, api_key: str) -> Optional[StockData]:
        """
        Example implementation using Alpha Vantage API
        Uncomment and modify when you have an API key
        """
        # url = f"https://www.alphavantage.co/query"
        # params = {
        #     "function": "GLOBAL_QUOTE",
        #     "symbol": symbol,
        #     "apikey": api_key
        # }
        
        # async with httpx.AsyncClient() as client:
        #     try:
        #         response = await client.get(url, params=params)
        #         response.raise_for_status()
        #         data = response.json()
        #         
        #         quote = data.get("Global Quote", {})
        #         if not quote:
        #             return None
        #             
        #         return StockData(
        #             symbol=quote.get("01. symbol", symbol),
        #             name=f"{symbol} Corporation",  # API doesn't provide company name
        #             price=float(quote.get("05. price", 0)),
        #             change=float(quote.get("09. change", 0)),
        #             changePercent=float(quote.get("10. change percent", "0%").replace("%", "")),
        #             high=float(quote.get("03. high", 0)),
        #             low=float(quote.get("04. low", 0)),
        #             volume=int(quote.get("06. volume", 0))
        #         )
        #     except Exception as e:
        #         print(f"API Error: {e}")
        #         return None
        
        return None