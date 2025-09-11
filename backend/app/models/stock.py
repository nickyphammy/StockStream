from pydantic import BaseModel
from typing import Optional
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