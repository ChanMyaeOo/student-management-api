const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({ origin: true }));


var serviceAccount = require("./permissions.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://landing-page-d5993.firebaseio.com"
});
const db = admin.firestore();
// Routes
app.get('/', (req, res) => {
    return res.status(200).send('Student Management API')
})

// Create
// post
app.post('/api/create', async (req, res) => {
    try {
        db.collection('students').doc('/'+  req.body.id + '/')
        .create({
            name: req.body.name,
            phone: req.body.phone,
            parent: req.body.parent,
            address: req.body.address
        })
        return res.status(201).send();
    }catch(error) {
        console.log(error);
        return res.status(500).send(error);
    }
})

// Read a specific student based on ID
// Read
// get
app.get('/api/read/:id', async (req, res) => {
    try {
        const document = db.collection('students').doc(req.params.id);
        let student = await document.get();
        let response = student.data();

        return res.status(200).send(response);
    } catch(error) {
        console.log(error);
        return res.status(500).send(error);
    }
})

// Read all students
// Read
// get
app.get('/api/read', async (req, res) => {
    try {
        let query = db.collection('students');
        let response = [];

        await query.get().then(querySnapshot => {
            let docs =  querySnapshot.docs;     // result of the query

            for(let doc of docs) {
                const selectedItem = {
                    id: doc.id,
                    name: doc.data().name,
                    phone: doc.data().phone,
                    parent: doc.data().parent,
                    address: doc.data().address
                }
                response.push(selectedItem)
            }   
            return response;
        })
        return res.status(200).send(response);
    } catch(error) {
        console.log(error);
        return res.status(500).send(error)
    }
})

// Update
// put
app.put('/api/update/:id', async (req, res) => {
    try {
        const document = db.collection('students').doc(req.params.id);
        await document.update({
            name: req.body.name,
            phone: req.body.phone,
            parent: req.body.parent,
            address: req.body.address
        })

        return res.status(200).send();
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
})

// Delete
// delete
app.delete('/api/delete/:id', async (req, res) => {
    try {
        const document = db.collection('students').doc(req.params.id);
        await document.delete();
        return res.status(200).send();
    } catch(error) {
        console.log(error);
        return res.status(500).send(error);
    }
})

// Export the api to Firebase Cloud Functions
exports.app = functions.https.onRequest(app);