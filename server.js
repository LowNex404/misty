require('dotenv').config();
const express = require('express');
const session = require('express-session');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const User = require('./models/user');

const app = express();

const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', () => {
  console.log(`Bot online como ${client.user.tag}`);
});

client.login(process.env.TOKEN_DISCORD);

// Sessão
app.use(session({ secret: 'segredo', resave: false, saveUninitialized: true }));

// MongoDB
mongoose.connect('mongodb+srv://lownex:fred2008@cluster0.y2p8hpu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.error('Erro no MongoDB:', err));

// Middleware
app.use(express.static('public'));
app.use(express.json());

// Enviar servidores
app.get('/servidores', async (req, res) => {
  const servers = client.guilds.cache.map(guild => ({
    nome: guild.name,
    id: guild.id,
    icone: guild.icon
      ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`
      : null,
  }));
  res.json(servers);
});

// Autenticação Discord
app.get('/auth/discord/callback', async (req, res) => {
  const code = req.query.code;

  try {
    const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', new URLSearchParams({
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      grant_type: 'authorization_code',
      code,
      redirect_uri: process.env.REDIRECT_URI,
      scope: 'identify email'
    }), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    const { access_token } = tokenResponse.data;

    const userResponse = await axios.get('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${access_token}` }
    });

    const discordUser = userResponse.data;
    req.session.userId = discordUser.id;

    let user = await User.findOne({ userId: discordUser.id });
    if (!user) {
      user = await User.create({ userId: discordUser.id });
    }

    req.session.userData = {
      username: `${discordUser.username}`,
      avatar: `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`,
    };

    res.redirect('/dashboard.html');
  } catch (err) {
    res.redirect('/erro.html');
  }
});

// Middleware de autenticação
function ensureAuthenticated(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  }
  res.redirect('/');
}

// Dados do usuário logado
app.get('/api/user', ensureAuthenticated, async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.session.userId });
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado.' });

    const allUsers = await User.find().sort({ balance: -1 });
    const ranking = allUsers.findIndex(u => u.userId === req.session.userId) + 1;

    res.json({
      userId: req.session.userId,
      username: req.session.userData.username,
      avatar: req.session.userData.avatar,
      balance: user.balance,
      level: user.level,
      xp: user.xp,
      bio: user.bio,
      ranking,
      bannerColor: user.bannerColor || '#7289da'
    });
  } catch (error) {
    console.error('Erro ao buscar dados do usuário:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

const app = express();
app.use(cors()); // Libera para seu frontend se precisar
app.use(bodyParser.json());

const ABACATEPAY_API_KEY = 'SUA_CHAVE_AQUI'; // NUNCA coloque isso no frontend!

// 1. Rota para gerar o QR Code Pix
app.post('/criar-pagamento', async (req, res) => {
  try {
    const { nomeCliente, valor } = req.body;

    const response = await axios.post(
      'https://api.abacatepay.com/v1/pixQrCode',
      {
        nome: nomeCliente,
        valor: valor,
        id: `pedido-${Date.now()}`,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.ABACATEPAY_API_KEY}`,
        }
      }
    );

    res.json(response.data); // Retorna o QR Code para o frontend
  } catch (error) {
    console.error('Erro ao gerar pagamento:', error.response?.data || error.message);
    res.status(500).json({ erro: 'Erro ao gerar pagamento' });
  }
});

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Backend rodando na porta ${PORT}`);
});


// Listen
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando em https://misty-bot.onrender.com`));
