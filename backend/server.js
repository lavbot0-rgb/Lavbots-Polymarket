require('dotenv').config()
const express = require('express')
const http = require('http')
const socketIo = require('socket.io')
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express()
const server = http.createServer(app)
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
})

// Middleware
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Routes
const apiRouter = require('./routes/api')
app.use('/api', apiRouter)

// Socket.io connection
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id)

  // Send initial market data
  socket.emit('marketUpdate', generateMockMarketData())

  // Send periodic updates
  const interval = setInterval(() => {
    socket.emit('marketUpdate', generateMockMarketData())
  }, 10000)

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id)
    clearInterval(interval)
  })

  // Handle bot control
  socket.on('botControl', (data) => {
    console.log('Bot control received:', data)
    socket.emit('botStatus', { status: data.action, timestamp: new Date().toISOString() })
  })
})

// Mock data generator
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

  return {
    markets,
    timestamp: new Date().toISOString()
  }
}

// Start server
const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`)
})

module.exports = { app, server, io }
