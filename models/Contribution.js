const mongoose = require('mongoose');

const contributionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  topic: {
    type: String,
    required: true,
  },
  pdfPath: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Contribution', contributionSchema);
