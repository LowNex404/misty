// Carregar dados do usuário
fetch('/api/user', { credentials: 'include' }) // envia o cookie
  .then(res => {
    console.log('res.ok:', res.ok);
    if (!res.ok) throw new Error('401');
    return res.json();
  })
  .then(data => {
    console.log('Dados recebidos:', data);
    user = data;

    document.getElementById('username').textContent = user.username;
    document.getElementById('avatar').src = user.avatar;
    document.getElementById('balance').textContent = user.balance;
    document.getElementById('level').textContent = user.level;
    document.getElementById('xp').textContent = `${user.xp}/100`;
  })
  .catch(err => {
    console.error('Erro na requisição:', err);
    document.getElementById('username').innerHTML = `
      <a href="https://discord.com/oauth2/authorize?client_id=1367262830776029245&response_type=code&redirect_uri=https%3A%2F%2Fmisty-bot.netlify.app%2Fauth%2Fdiscord%2Fcallback&scope=identify+email"
        class="login-fallback">
        <i class="fa-solid fa-right-to-bracket"></i> Fazer login
      </a>`;
    document.getElementById('avatar').src = 'img/default-avatar.jpg';
  });

// Troca de página
document.querySelectorAll('.sidebar button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.sidebar button').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    const page = btn.getAttribute('data-page');
    document.getElementById(page).classList.add('active');
  });
});

// Manipulação dos cards
document.querySelectorAll('.produto-card').forEach(card => {
  card.addEventListener('click', () => {
    explodeCookies(card);

    const cookies = card.dataset.cookies;
    const preco = card.dataset.preco;

    if (!user) {
      showLoginPopup();
    } else {
      showConfirmPopup(cookies, preco);
    }
  });
});

function explodeCookies(element) {
  for (let i = 0; i < 20; i++) {
    const cookie = document.createElement('div');
    cookie.className = 'cookie';
    cookie.textContent = '🍪';
    cookie.style.left = `${element.offsetLeft + element.offsetWidth / 2}px`;
    cookie.style.top = `${element.offsetTop + element.offsetHeight / 2}px`;
    cookie.style.setProperty('--x', `${(Math.random() - 0.5) * 300}px`);
    cookie.style.setProperty('--y', `${(Math.random() - 0.5) * 300}px`);
    document.body.appendChild(cookie);
    setTimeout(() => cookie.remove(), 1000);
  }
}

function showLoginPopup() {
  document.getElementById("popup-login").classList.remove("hidden");
}

function showConfirmPopup(cookies, preco) {
  if (!user) return;

  document.getElementById("user-id").textContent = user.userId;
  document.getElementById("user-name").textContent = user.username;
  document.getElementById("user-saldo").textContent = user.balance.toLocaleString() || 0;

  document.getElementById("popup-confirmar").classList.remove("hidden");

  document.getElementById("btn-confirmar").onclick = () => {
    try {
    const resposta = await fetch("https://misty-bot.onrender.com//criar-pagamento", {

    const dados = await resposta.json();
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: preco,
        description: "Compra de cookies",
        expiresIn: 600
      })
    });
  const dados = await resposta.json();

   
  document.getElementById("valor-pagamento").textContent = data.amount.toFixed(2);
  document.getElementById("qr-code").src = data.qrcode_image_url;
  document.getElementById("codigo-pix").value = data.brcode;
  document.getElementById("popup-pagamento").classList.remove("hidden");

  iniciarContagemRegressiva(new Date(data.expires_at));
  monitorarStatusPagamento(data.id);

  } catch (err) {
    console.error("Erro ao criar pagamento:", err);
  }
};

function monitorarStatusPagamento(id) {
  const intervalo = setInterval(() => {
    fetch(`https://api.abacatepay.com/v1/pixQrCode/check?id=${id}`, {
      headers: {
        "Authorization": "Bearer abc_dev_XfyPhpmk5XsyQmLUSM2Jc4EX"
      }
    })
    .then(res => res.json())
    .then(data => {
      const status = data.data.status;
      document.getElementById("status-pagamento").textContent = status;

      if (status === "PAID") {
        clearInterval(intervalo);
        alert("Pagamento confirmado!");
        enviarMensagemDiscord();
        fecharPopup();
      } else if (status === "EXPIRED") {
        clearInterval(intervalo);
        alert("Tempo expirado. Por favor, tente novamente.");
        fecharPopup();
      }
    });
  }, 5000);
}

function enviarMensagemDiscord() {
  fetch("/api/enviarMensagemDiscord", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      userId: user.userId,
      mensagem: "Pagamento confirmado! Seus cookies estão a caminho."
    })
  });
}

function iniciarContagemRegressiva(expiracao) {
  const tempoElemento = document.getElementById("tempo-restante");

  const intervalo = setInterval(() => {
    const agora = new Date();
    const diferenca = expiracao - agora;

    if (diferenca <= 0) {
      clearInterval(intervalo);
      tempoElemento.textContent = "Expirado";
      return;
    }

    const minutos = Math.floor(diferenca / 60000);
    const segundos = Math.floor((diferenca % 60000) / 1000);
    tempoElemento.textContent = `${minutos}m ${segundos}s`;
  }, 1000);
}

function fecharPopup() {
  document.getElementById("popup-pagamento").classList.add("hidden");
}

function copiarCodigo() {
  const codigoPix = document.getElementById("codigo-pix");
  codigoPix.select();
  document.execCommand("copy");
  alert("Código copiado para a área de transferência!");
}

document.addEventListener('DOMContentLoaded', () => {
  const popups = document.querySelectorAll('.popup');

  popups.forEach(popup => {
    const card = popup.querySelector('.popup-card');
    const closeBtn = popup.querySelector('.close-btn');

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        popup.classList.add('hidden');
      });
    }

    popup.addEventListener('click', (e) => {
      if (!card.contains(e.target)) {
        popup.classList.add('hidden');
      }
    });
  });
});
