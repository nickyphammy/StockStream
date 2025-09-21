from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class StockData(BaseModel):
    """Stock price data model - focused on essential price information"""
    symbol: str  # Stock symbol (e.g., AAPL)
    price: float  # Current price
    change: float  # Price change from previous close
    changePercent: float  # Percent change from previous close
    high: float  # Day's high price
    low: float  # Day's low price
    open: float  # Day's opening price
    previousClose: float  # Previous day's closing price
    timestamp: Optional[datetime] = None  # When data was retrieved

class StockResponse(BaseModel):
    """API response wrapper for stock data"""
    success: bool
    data: Optional[StockData] = None
    error: Optional[str] = None

class NewsArticle(BaseModel):
    """News article model"""
    id: int  # Article ID
    headline: str  # Article headline
    summary: str  # Article summary
    url: str  # Article URL
    image: Optional[str] = None  # Article image URL
    source: str  # News source
    category: str  # News category
    datetime: int  # Unix timestamp
    related: str  # Related symbol

class NewsResponse(BaseModel):
    """API response wrapper for news data"""
    success: bool
    data: Optional[List[NewsArticle]] = None
    error: Optional[str] = None

class SearchResult(BaseModel):
    """Search result for company/symbol search"""
    symbol: str  # Stock symbol (e.g., AAPL)
    description: str  # Company name (e.g., Apple Inc)
    type: str  # Security type (e.g., Common Stock)
    displaySymbol: Optional[str] = None  # Display symbol
    currency: Optional[str] = None  # Currency

class SearchResponse(BaseModel):
    """API response wrapper for search results"""
    success: bool
    data: Optional[List[SearchResult]] = None
    error: Optional[str] = None