const express = require('express')
const router = express.Router()

// Mock database
let botConfig = {
  strategy: 'arbitrage',
  maxTradeAmount: 1000,
  minProbability: 0.6,
  maxProbability: 0.8,
  stopLoss: 0.1,
  takeProfit: 0.15,
}

let botStatus = 'stopped'

// Get bot configuration
router.get('/bot/config', (req, res) => {
  res.json({ success: true, config: botConfig })
})

// Update bot configuration
router.post('/bot/config', (req, res) => {
  try {
    botConfig = { ...botConfig, ...req.body }
    res.json({ success: true, config: botConfig })
  } catch (error) {
    res.status(400).json({ success: false, error: error.message })
  }
})

// Get bot status
router.get('/bot/status', (req, res) => {
  res.json({ success: true, status: botStatus })
})

// Control bot
router.post('/bot/control', (req, res) => {
  const { action } = req.body
  if (action === 'start' || action === 'stop') {
    botStatus = action === 'start' ? 'running' : 'stopped'
    res.json({ success: true, status: botStatus })
  } else {
    res.status(400).json({ success: false, error: 'Invalid action' })
  }
})

// Get markets data
router.get('/markets', (req, res) => {
  // In a real app, this would fetch from Polymarket API
  const mockMarkets = generateMockMarketData()
  res.json({ success: true, markets: mockMarkets.markets })
})

// Get bot statistics
router.get('/bot/stats', (req, res) => {
  const mockStats = {
    totalTrades: 42 + Math.floor(Math.random() * 20),
    profitableTrades: 31 + Math.floor(Math.random() * 15),
    losingTrades: 11 + Math.floor(Math.random() * 10),
    totalProfit: 1245.67 + Math.random() * 500,
    winRate: 73.8 + Math.random() * 10,
  }
  res.json({ success: true, stats: mockStats })
})

// Helper function to generate mock market data
function generateMockMarketData() {
  const markets = []
  const categories = ['Crypto', 'Stocks', 'Economy', 'Politics', 'Tech']
  const titles = [
    'Bitcoin > $50,000 by December 31, 2024',
    'Ethereum > $3,000 by June 30, 2024',
    'S&P 500 > 5,500 by end of 2024',
    'Fed cuts rates by September 2024',
    'Donald Trump wins 2024 election',
    'Joe Biden wins 2024 election',
    'AI achieves AGI by 2030',
    'Apple stock > $250 by EOY',
    'Tesla delivers 2M cars in 2024',
    'Gold > $2,500 by end of 2024'
  ]

  for (let i = 0; i < 10; i++) {
    const baseProbability = 0.4 + Math.random() * 0.6
    const change = (Math.random() - 0.5) * 0.05
    const newProbability = Math.min(0.99, Math.max(0.01, baseProbability + change))

    markets.push({
      id: i + 1,
      title: titles[i % titles.length],
      probability: parseFloat(newProbability.toFixed(2)),
      volume: Math.floor(100000 + Math.random() * 5000000),
      change: parseFloat(change.toFixed(4)),
      category: categories[i % categories.length],
      timestamp: new Date().toISOString()
    })
  }

  return { markets }
}

module.exports = router
