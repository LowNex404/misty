// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    username: { type: String }, // ← novo: salva o nome do usuário
    avatar: { type: String },   // ← novo: salva o avatar (URL ou ID)
    email: { type: String },    // ← novo: se quiser associar um email
    ranking: { type: Number },  // ← novo: ranking calculado e salvo (opcional)
    balance: { type: Number, default: 0 },
    bio: { type: String, default: 'Sem bio definida' },
    bannerColor: { type: String, default: '#7289DA' }, // ← cor padrão
    lastDaily: { type: Date },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
});

module.exports = mongoose.model('User', userSchema);
