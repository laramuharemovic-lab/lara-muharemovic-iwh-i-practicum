require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

app.set('view engine', 'pug');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const HUBSPOT_ACCESS_TOKEN = process.env.HUBSPOT_ACCESS_TOKEN;
const CUSTOM_OBJECT_ID = 'contacts';

const BASE_URL = 'https://api.hubapi.com';
const headers = {
Authorization: 'Bearer ' + HUBSPOT_ACCESS_TOKEN,
'Content-Type': 'application/json'
};

// RUTA 1: Početna stranica - prikaz tabele
app.get('/', async (req, res) => {
try {
const response = await axios.get(
BASE_URL + '/crm/v3/objects/' + CUSTOM_OBJECT_ID,
{
headers,
params: {
properties: 'firstname,genre,author'
}
}
);

const records = response.data.results || [];

res.render('homepage', { records: records });
} catch (error) {
console.error('Greska:', error.response?.data || error.message);
res.status(500).send('Doslo je do greske.');
}
});

// RUTA 2: Forma za dodavanje kontakta
app.get('/update-cobj', (req, res) => {
res.render('updates', {
pageTitle: 'Update Contact Form | Integrating With HubSpot I Practicum'
});
});

// RUTA 3: Obrada forme
app.post('/update-cobj', async (req, res) => {
const { firstname, genre, author } = req.body;

const crmObject = {
properties: {
firstname: firstname,
genre: genre,
author: author
}
};

try {
await axios.post(
BASE_URL + '/crm/v3/objects/' + CUSTOM_OBJECT_ID,
crmObject,
{ headers }
);
res.redirect('/');
} catch (error) {
console.error('Greska:', error.response?.data || error.message);
res.status(500).send('Doslo je do greske.');
}
});

app.listen(port, () => {
console.log('Aplikacija slusa na http://localhost:' + port);
});