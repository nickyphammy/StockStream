from pydantic import BaseModel
from typing import Optional

class StockData(BaseModel):
    symbol: str
    name: str
    price: float
    change: float
    changePercent: float
    high: float
    low: float
    volume: int

class StockResponse(BaseModel):
    success: bool
    data: Optional[StockData] = None
    error: Optional[str] = None