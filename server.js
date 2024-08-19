const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const mongoose = require('mongoose');
const Location = require('./models/location'); // Assurez-vous que ce chemin est correct

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
      if (data.latitude && data.longitude) {
        console.log('longitude: ' + data.longitude);
        console.log('latitude: ' + data.latitude);
        
        // Mise à jour ou insertion dans MongoDB via Mongoose
        await Location.updateOne(
          { delivererId: 1 }, // Utilisation de l'identifiant unique pour trouver le document
          { $set: { latitude: data.latitude, longitude: data.longitude, timestamp: new Date() } },
          { upsert: true } // Crée un nouveau document si aucun n'est trouvé
        );
        console.log('Location updated successfully');
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
