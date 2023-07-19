const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

// ! app initialization and middleware
const app = express();
app.use(cors());
app.use(express.json());

// * Handling Database
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.py4p8ya.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
});
async function run() {
	try {
		// Connect the client to the server
		await client.connect();
		// ! Database Collections
		const servicesCollection = client
			.db('carDoctor')
			.collection('services');
		const bookingsCollection = client
			.db('carDoctor')
			.collection('bookings');

		// * Handling routes
		app.get('/', (req, res) => {
			res.send('Welcome to Car Doctor Server Side');
		});

		app.get('/services', async (req, res) => {
			const services = await servicesCollection.find().toArray();
			res.send(services);
		});

		app.get('/service/:id', async (req, res) => {
			const serviceId = new ObjectId(req.params.id);
			const options = {
				projection: {
					title: 1,
					price: 1,
					service_id: 1,
					img: 1,
				},
			};
			const service = await servicesCollection.findOne(
				{
					_id: serviceId,
				},
				options
			);
			res.send(service);
		});

		app.post('/order', async (req, res) => {
			const orderDetails = req.body;
			const result = await bookingsCollection.insertOne(orderDetails);
			res.send(result);
		});

		// Send a ping to confirm a successful connection
		await client.db('admin').command({ ping: 1 });
		console.log(
			'Pinged your deployment. You successfully connected to MongoDB!'
		);
	} catch (err) {
		console.log(err);
	}
}
run().catch(console.dir);

// app listening
app.listen(port);
