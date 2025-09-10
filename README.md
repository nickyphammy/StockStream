# 📈 StockStream

Search any stock and instantly view its **price, chart, and related news**.  
Built with a **FastAPI backend** and a **React frontend**, StockStream integrates with the **Finnhub API** to deliver a clean stock dashboard experience.

---

## ✨ Features
- 🔎 Search stocks by ticker or company name  
- 💹 View live stock quotes (price, change, % change)  
- 📈 Interactive charts of historical prices  
- 📰 Aggregated company news articles, ranked by relevance  
- 🔐 JWT authentication for secure API access  
- ⚡ Redis caching + background jobs to stay under API limits  

---

## 🛠️ Tech Stack
**Frontend:** React, Chart.js/Recharts, Tailwind (optional)  
**Backend:** FastAPI (Python), Pydantic, APScheduler  
**Database:** PostgreSQL + Alembic  
**Cache:** Redis  
**External API:** [Finnhub](https://finnhub.io/) (stock quotes + news)  
**Infra/DevOps:** Docker, GitHub Actions CI/CD, Render/Railway/AWS (optional deployment)

---
