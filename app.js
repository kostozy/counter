const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express()
const port = 3001

app.use(cors())
app.use(bodyParser.json())

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/getCount', (req, res) => {
  console.log(req.body)
  res.json({ egg_count: 100 })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
