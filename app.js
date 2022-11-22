const express = require('express');
const app = express();
app.use(express.json());

// includes
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();


// router include
const userRoute = require('./app/routes/route.user');

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true }, () => { console.log('Connected to DB!') });

app.use('/api/user', userRoute);

// app listen
app.listen(process.env.PORT, () => { console.log(`Server is running on port ${process.env.PORT}`) });