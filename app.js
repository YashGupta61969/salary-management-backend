require('dotenv').config()
require('./models')
const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 8000;

app.use(express.urlencoded({extended:true}));
app.use(cors())
app.use(express.json())

// app.use('/user',userRoute)
// app.use('/posts',postsRoute)
// app.use('/comment',commentRoute)

app.listen(port,()=>{
    console.log(`listening at Port ${port}`)
})

