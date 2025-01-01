const express = require('express');
const path = require('path');
const admin = require('firebase-admin');

const app = express();

// Initialize Firebase Admin SDK
const serviceAccount = require('../path/to/your/serviceAccountKey.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// Serve HTML pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.get('/add-purchy', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'add-purchy.html'));
});

app.get('/search', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'search.html'));
});

app.get('/update-status', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'update-status.html'));
});

// API routes
app.post('/api/add-purchy', async (req, res) => {
    try {
        const purchy = req.body;
        await db.collection('purchies').add(purchy);
        res.status(201).json({ message: 'Purchy added successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add purchy' });
    }
});

app.get('/api/search', async (req, res) => {
    try {
        const { searchTerm } = req.query;
        let results = await db.collection('purchies')
            .where('farmer_name', '==', searchTerm)
            .get();

        if (results.empty) {
            results = await db.collection('purchies')
                .where('code_no', '==', searchTerm)
                .get();
        }

        const data = results.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to search purchies' });
    }
});

app.put('/api/update-status', async (req, res) => {
    try {
        const { code_no, new_status } = req.body;
        const purchies = await db.collection('purchies')
            .where('code_no', '==', code_no)
            .get();

        if (purchies.empty) {
            return res.status(404).json({ error: 'No purchy found with the given code number' });
        }

        const batch = db.batch();
        purchies.forEach(doc => {
            batch.update(doc.ref, { transport_status: new_status });
        });
        await batch.commit();

        res.json({ message: 'Transport status updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update transport status' });
    }
});

module.exports = app;

