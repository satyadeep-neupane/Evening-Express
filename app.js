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
const categoryRoute = require('./app/routes/route.category');
const authRoute = require('./app/routes/route.auth');

const verifyJwt = require('./app/middleware/verifyJWT');


mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true }, () => { console.log('Connected to DB!') });

app.use('/api', authRoute);
app.use('/api/user', userRoute);

// protected routes
app.use(verifyJwt);
app.use('/api/category', categoryRoute);

// app listen
app.listen(process.env.PORT, () => { console.log(`Server is running on port ${process.env.PORT}`) });