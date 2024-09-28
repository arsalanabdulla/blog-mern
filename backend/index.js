const express = require("express");
const cors = require("cors");
const { connect } = require("mongoose");
const upload =require('express-fileupload')
require("dotenv").config();

const userRoutes=require('./routes/userRoutes')
const postRoutes=require('./routes/postRoutes');
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();
app.use(upload())
app.use('/uploads',express.static(__dirname+'/uploads'))
app.use(express.json({extended:true}))
app.use(express.urlencoded({extended:true}))
app.use(cors({credentials:true,origin:'http://localhost:5173'}))

app.use('/api/users', userRoutes)
app.use('/api/posts', postRoutes)

app.use(notFound)
app.use(errorHandler)

connect(process.env.MONGO_URI)
  .then(
    app.listen(process.env.PORT || 3000, () => {
      console.log(`running on ${process.env.PORT}`);
    })
  ).catch((error) => console.log(error));
