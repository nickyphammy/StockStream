from fastapi import APIRouter, HTTPException, Query
from ..models.stock import StockResponse, NewsResponse, SearchResponse
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

@router.get("/search", response_model=SearchResponse)
async def search_stocks(q: str = Query(..., min_length=1, description="Search query")):
    """Search for stocks by company name or symbol"""
    try:
        service = get_stock_service()
        search_results = await service.search_symbols(q)

        if search_results is None:
            return SearchResponse(
                success=False,
                error="Search service temporarily unavailable"
            )

        return SearchResponse(
            success=True,
            data=search_results
        )

    except ValueError as e:
        raise HTTPException(
            status_code=500,
            detail="API configuration error. Please check server configuration."
        )
    except Exception as e:
        print(f"Unexpected error in search_stocks: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )

@router.get("/news/{symbol}", response_model=NewsResponse)
async def get_stock_news(symbol: str, days: int = Query(7, ge=1, le=30)):
    """Get company news for a given symbol"""
    if not symbol or len(symbol.strip()) == 0:
        raise HTTPException(status_code=400, detail="Stock symbol is required")

    try:
        service = get_stock_service()
        news_data = await service.get_company_news(symbol.strip().upper(), days)

        if news_data is None:
            return NewsResponse(
                success=False,
                error=f"Could not fetch news for symbol: {symbol}. Please check if the symbol is valid."
            )

        return NewsResponse(
            success=True,
            data=news_data
        )

    except ValueError as e:
        # Handle API key missing error
        raise HTTPException(
            status_code=500,
            detail="API configuration error. Please check server configuration."
        )
    except Exception as e:
        print(f"Unexpected error in get_stock_news: {e}")
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
            "api_configured": bool(service.api_key),
            "cache_entries": len(service._cache)
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "service": "stock_prices",
            "error": str(e)
        }

@router.post("/cache/clear")
async def clear_cache():
    """Clear all cached data"""
    try:
        service = get_stock_service()
        service.clear_cache()
        return {
            "success": True,
            "message": "Cache cleared successfully"
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to clear cache: {str(e)}"
        )