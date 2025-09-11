# 📈 StockStream

Search any stock and instantly view its **price, chart, and related news**.  
Built with a **FastAPI backend** and a **React frontend**, StockStream integrates with the **Finnhub API** to deliver a clean stock dashboard experience.

---

## ✨ Features
- 💹 Get real-time stock prices for any symbol
- 📈 View price changes and percentage changes
- 📊 Daily high, low, open, and previous close prices
- 🚀 Real-time data from Finnhub API
- ⚡ Fast and simple API endpoint

---

## 🛠️ Tech Stack
**Frontend:** React, TypeScript, Tailwind CSS, Vite  
**Backend:** FastAPI (Python), Pydantic, Finnhub API  
**External API:** [Finnhub](https://finnhub.io/) (real-time stock data)

---

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- Finnhub API key (free at [finnhub.io](https://finnhub.io/register))

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd StockStream/backend
   ```

2. **Activate virtual environment:**
   ```bash
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Create `.env` file:**
   ```bash
   # Create .env file in the backend directory
   echo "FINNHUB_API_KEY=your_api_key_here" > .env
   ```
   Replace `your_api_key_here` with your actual Finnhub API key.

5. **Start the server:**
   ```bash
   python run.py
   ```

   The API will be available at `http://localhost:8000`

### Testing the Backend

1. **Health Check:**
   ```bash
   curl http://localhost:8000/api/stocks/health
   ```

2. **Test with Apple Stock (AAPL):**
   ```bash
   curl http://localhost:8000/api/stocks/quote/AAPL | python3 -m json.tool
   ```
   
   Expected response:
   ```json
   {
       "success": true,
       "data": {
           "symbol": "AAPL",
           "price": 226.79,
           "change": -7.56,
           "changePercent": -3.2259,
           "high": 232.42,
           "low": 225.95,
           "open": 232.185,
           "previousClose": 234.35,
           "timestamp": "2025-09-10T21:51:11.897773"
       }
   }
   ```

3. **Test with other stocks:**
   ```bash
   curl http://localhost:8000/api/stocks/quote/TSLA | python3 -m json.tool
   curl http://localhost:8000/api/stocks/quote/GOOGL | python3 -m json.tool
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd StockStream/frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:5173`

---

## 📋 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stocks/health` | Health check and API status |
| GET | `/api/stocks/quote/{symbol}` | Get real-time stock price data |

---

## 🔧 Environment Variables

Create a `.env` file in the `backend/` directory:

```env
FINNHUB_API_KEY=your_finnhub_api_key_here
```

---

## 🐛 Troubleshooting

### Backend Issues

1. **API Key Error:**
   - Ensure your `.env` file is in the `backend/` directory
   - Verify your Finnhub API key is valid
   - Check the health endpoint: `curl http://localhost:8000/api/stocks/health`

2. **Module Not Found:**
   - Ensure virtual environment is activated: `source venv/bin/activate`
   - Reinstall dependencies: `pip install -r requirements.txt`

3. **Port Already in Use:**
   - Kill existing processes: `pkill -f "python run.py"`
   - Or use a different port in `run.py`

### Testing Commands

```bash
# Quick test sequence
cd StockStream/backend
source venv/bin/activate
python run.py &
sleep 3
curl http://localhost:8000/api/stocks/quote/AAPL | python3 -m json.tool
```

---
