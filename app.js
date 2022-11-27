const express = require('express');
const app = express();
app.use(express.json());

const cors = require('cors');

app.use(cors());

// includes
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();


// router include
const userRoute = require('./app/routes/route.user');
const authRoute = require('./app/routes/route.auth');

const verifyJwt = require('./app/middleware/verifyJwt');


mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true }, () => { console.log('Connected to DB!') });

app.use('/api', authRoute);
app.use('/api/user', userRoute);

// app listen
app.listen(process.env.PORT, () => { console.log(`Server is running on port ${process.env.PORT}`) });