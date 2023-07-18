const express = require('express');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

// ! app initialization and middleware
const app = express();
app.use(cors());
app.use(express.json());


// * Handling routes
app.get('/', (req, res) => {
	res.send('Welcome to Car Doctor Server Side');
});

// app listening
app.listen(port);
