const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  delivererId: { type: String, required: true }, // Identifiant unique pour chaque livreur
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
});

const Location = mongoose.model('Location', locationSchema);

module.exports = Location;
