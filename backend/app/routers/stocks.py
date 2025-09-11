from fastapi import APIRouter, HTTPException
from ..models.stock import StockResponse
from ..services.stock_service import get_stock_service

router = APIRouter(prefix="/api/stocks", tags=["stocks"])

@router.get("/quote/{symbol}", response_model=StockResponse)
async def get_stock_quote(symbol: str):
    """Get real-time stock price data for a given symbol"""
    if not symbol or len(symbol.strip()) == 0:
        raise HTTPException(status_code=400, detail="Stock symbol is required")
    
    try:
        service = get_stock_service()
        stock_data = await service.get_stock_data(symbol.strip().upper())
        
        if stock_data is None:
            return StockResponse(
                success=False,
                error=f"Could not fetch price data for symbol: {symbol}. Please check if the symbol is valid."
            )
        
        return StockResponse(
            success=True,
            data=stock_data
        )
        
    except ValueError as e:
        # Handle API key missing error
        raise HTTPException(
            status_code=500,
            detail="API configuration error. Please check server configuration."
        )
    except Exception as e:
        print(f"Unexpected error in get_stock_quote: {e}")
        raise HTTPException(
            status_code=500, 
            detail=f"Internal server error: {str(e)}"
        )

@router.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        service = get_stock_service()
        return {
            "status": "healthy", 
            "service": "stock_prices",
            "api_configured": bool(service.api_key)
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "service": "stock_prices", 
            "error": str(e)
        }