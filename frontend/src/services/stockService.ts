import axios from 'axios'

// Backend API URL
const API_BASE_URL = 'http://localhost:8000'

// Types matching your backend API
export interface StockData {
  symbol: string
  price: number
  change: number
  changePercent: number
  high: number
  low: number
  open: number
  previousClose: number
  timestamp?: string
}

export interface StockResponse {
  success: boolean
  data?: StockData
  error?: string
}

export interface NewsArticle {
  id: number
  headline: string
  summary: string
  url: string
  image?: string
  source: string
  category: string
  datetime: number
  related: string
}

export interface NewsResponse {
  success: boolean
  data?: NewsArticle[]
  error?: string
}

// Service for stock API calls
export class StockService {
  static async getStockData(symbol: string): Promise<StockData> {
    try {
      const response = await axios.get<StockResponse>(`${API_BASE_URL}/api/stocks/quote/${symbol.toUpperCase()}`)

      if (response.data.success && response.data.data) {
        return response.data.data
      } else {
        throw new Error(response.data.error || 'Failed to fetch stock data')
      }
    } catch (error) {
      console.error('Stock data fetch failed:', error)
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new Error(`Stock symbol "${symbol}" not found`)
        } else if (error.code === 'ECONNREFUSED') {
          throw new Error('Backend server is not running')
        }
      }
      throw new Error(`Failed to fetch data for ${symbol}`)
    }
  }

  static async getStockNews(symbol: string, days: number = 7): Promise<NewsArticle[]> {
    try {
      const response = await axios.get<NewsResponse>(`${API_BASE_URL}/api/stocks/news/${symbol.toUpperCase()}?days=${days}`)

      if (response.data.success && response.data.data) {
        return response.data.data
      } else {
        throw new Error(response.data.error || 'Failed to fetch news data')
      }
    } catch (error) {
      console.error('Stock news fetch failed:', error)
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new Error(`No news found for symbol "${symbol}"`)
        } else if (error.code === 'ECONNREFUSED') {
          throw new Error('Backend server is not running')
        }
      }
      throw new Error(`Failed to fetch news for ${symbol}`)
    }
  }

  static async searchStocks(_query: string): Promise<StockData[]> {
    // TODO: Implement stock search if needed
    throw new Error('Stock search not implemented yet')
  }
}