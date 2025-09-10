// Types for stock data
export interface StockData {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  high: number
  low: number
  volume: number
}

// Placeholder service for stock API calls
export class StockService {
  static async getStockData(_symbol: string): Promise<StockData> {
    // TODO: Implement real API call
    throw new Error('Stock API not implemented yet')
  }

  static async searchStocks(_query: string): Promise<StockData[]> {
    // TODO: Implement stock search
    throw new Error('Stock search not implemented yet')
  }
}