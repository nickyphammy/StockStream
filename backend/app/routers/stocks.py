from fastapi import APIRouter, HTTPException
from ..models.stock import StockResponse
from ..services.stock_service import StockService

router = APIRouter(prefix="/api/stocks", tags=["stocks"])

@router.get("/quote/{symbol}", response_model=StockResponse)
async def get_stock_quote(symbol: str):
    """Get stock quote data for a given symbol"""
    if not symbol or len(symbol.strip()) == 0:
        raise HTTPException(status_code=400, detail="Stock symbol is required")
    
    try:
        stock_data = await StockService.get_stock_data(symbol.strip().upper())
        
        if stock_data is None:
            return StockResponse(
                success=False,
                error=f"Could not fetch data for symbol: {symbol}"
            )
        
        return StockResponse(
            success=True,
            data=stock_data
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Internal server error: {str(e)}"
        )

@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "stocks"}