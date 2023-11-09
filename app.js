const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');

app.set('view engine', 'ejs');
app.use(express.static('public')); // Create a 'public' folder for your CSS files
app.use(bodyParser.json());

app.get('/getApiData', async (req, res) => {
    try {
        const start = parseInt(req.query.start) || 0; // Starting record index
        const length = parseInt(req.query.length) || 10; // Number of records per page
        const token = '182b3c56789mnbaoil';
        const search = req.query.search.value || ''; 
        const apiUrl = `http://209.126.0.154/get/test/records?page=${start / length + 1}`;

        const response = await axios.get(apiUrl, {
            headers: {
                'Token': token,
            },
        });

        const { count, results } = response.data;

        const filteredResults = results.filter(record => {
            const recordData = Object.values(record).join(' ').toLowerCase();
            return recordData.includes(search.toLowerCase());
        });


        res.json({
            draw: req.query.draw, // Required when using server-side processing
            recordsTotal: count, // Total records in the dataset
      recordsFiltered: search?filteredResults.length:count, // Total records after filtering
            data: filteredResults,
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to fetch data.' });
    }
});

app.get('/', async (req, res) => {
        res.render('index');    
});
app.get('/view/:id', async (req, res) => {
    const { id } = req.params;
    try {

        const token = '182b3c56789mnbaoil';
        const apiUrl = `http://209.126.0.154/get/test/records?id=${id}`;

        const response = await axios.get(apiUrl, {
            headers: {
                'Token': token,
            },
        });

        const { results } = response.data;


        res.render('singleRecord', { data: results });
    } catch (error) {
        console.error('Error:', error);s
        res.render('index', { data: [], page: 1, totalPages: 1 });
    }
});

app.post('/purchase/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { updated_by } = req.body;
        // Make a POST request to the API to update the purchased column
        const apiUrl = `http://209.126.0.154/test/update/true`;
        
        const response = await axios.post(apiUrl, {
            id,
            updated_by,
        }, {
            headers: {
                'Token': '182b3c56789mnbaoil',
            },
        });

        // Handle the response from the API, update the UI if needed
        res.json(response.data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to update purchased status.' });
    }
});

app.post('/revert/:id', async (req, res) => {
    try {
        const id = req.params.id;

        // Make a POST request to the API to update the purchased column to false
        const apiUrl = `http://209.126.0.154/test/update/false`;

        const response = await axios.post(apiUrl, {
            id,
        }, {
            headers: {
                'Token': '182b3c56789mnbaoil',
            },
        });

        // Handle the response from the API, update the UI if needed
        res.json(response.data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to update purchased status.' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
