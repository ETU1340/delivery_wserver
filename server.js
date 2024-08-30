const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const { Server } = require('socket.io');

// Configuration de MongoDB
const mongoUri = 'mongodb+srv://noumsfinoana:mdppsad13@cluster0.gw4zu4y.mongodb.net/delivery?retryWrites=true&w=majority'; // Remplacez par l'URI de votre MongoDB

// Création d'une instance Express
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Connexion à MongoDB via Mongoose
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  });

// Gestion des connexions Socket.IO
io.on('connection', (socket) => {
  console.log('Client connected: ' + socket.id);

  // Événement pour la mise à jour de la localisation du livreur
  socket.on('updateLocation', async (data) => {
    try {
      if (data.latitude && data.longitude && data.delivererId) {
        console.log('delivererId: ' + data.delivererId);
        console.log('longitude: ' + data.longitude);
        console.log('latitude: ' + data.latitude);

        // Mise à jour de la localisation du livreur dans MongoDB
        const collection = mongoose.connection.collection('users');
        await collection.updateOne(
          { _id: new mongoose.Types.ObjectId(data.delivererId) },
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
      console.error('Error updating location', error);
    }
  });

  // Événement pour la gestion du chat
  // Événement pour les messages de chat
  socket.on('sendMessage', (messageData) => {
    console.log('Message received:', messageData);
    io.to(messageData.receiverId).emit('receiveMessage', messageData); // Envoie le message au destinataire
  });
 
  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(`Client joined room: ${roomId}`);
  });


  socket.on('disconnect', () => {
    console.log('Client disconnected: ' + socket.id);
  });
});

// Démarrer le serveur
const port = 8080;
server.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});
