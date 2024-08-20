const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const mongoose = require('mongoose');

// Configuration de MongoDB
const mongoUri = 'mongodb+srv://noumsfinoana:mdppsad13@cluster0.gw4zu4y.mongodb.net/delivery?retryWrites=true&w=majority'; // Remplacez par l'URI de votre MongoDB

// Création d'une instance Express
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Connexion à MongoDB via Mongoose
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  });

// Gestion des connexions WebSocket
wss.on('connection', ws => {
  console.log('Client connected');

  ws.on('message', async message => {
    try {
      const data = JSON.parse(message);
      // Validation des données
      if (data.latitude && data.longitude && data.delivererId) {
        console.log('delivererId: ' + data.delivererId);
        console.log('longitude: ' + data.longitude);
        console.log('latitude: ' + data.latitude);

        // Accès direct à la collection "livreurs" sans passer par un modèle
        const collection = mongoose.connection.collection('users');
        await collection.updateOne(
          { _id: new mongoose.Types.ObjectId(data.delivererId) }, // Recherche par ObjectId
          { 
            $set: { 
              'currentLocation.latitude': data.latitude, 
              'currentLocation.longitude': data.longitude
            } 
          },
        );

        console.log('Livreur location updated successfully');
      } else {
        console.error('Invalid data format');
      }
    } catch (error) {
      console.error('Invalid message format', error);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Démarrer le serveur
const port = 8080;
server.listen(port, () => {
  console.log(`Server is listening on ws://localhost:${port}`);
});
