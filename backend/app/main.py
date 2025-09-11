from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import stocks

# Create FastAPI application
app = FastAPI(
    title="StockStream API",
    description="Backend API for StockStream application",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(stocks.router)

@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "StockStream API is running!", "status": "healthy"}

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "StockStream API"}