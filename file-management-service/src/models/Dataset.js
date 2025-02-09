const mongoose = require('mongoose');

const DatasetSchema = new mongoose.Schema({
  owner: { type: String, required: true }, // ID de l'utilisateur (propriétaire)
  name: { type: String, required: true },
  images: [
    {
      file_path: { type: String, required: true },
      uploaded_at: { type: Date, default: Date.now },
    },
  ],
  json_data: [
    {
      file_path: { type: String, required: true },
      uploaded_at: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model('Dataset', DatasetSchema);
