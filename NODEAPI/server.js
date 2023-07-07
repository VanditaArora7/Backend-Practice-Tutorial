import express from 'express'
import { connectdb } from './data/db.js'
import { app } from './app.js'

connectdb()

app.listen(process.env.PORT, () => {
  console.log('Server has started working')
})
