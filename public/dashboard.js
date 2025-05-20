fetch('/api/user', { credentials: 'include' })   // <‑‑ manda o cookie
  .then(res => {
    console.log('res.ok:', res.ok); // <- adicionado
    if (!res.ok) throw new Error('401');
    return res.json();
  })
  .then(data => {
    console.log('Dados recebidos:', data);
     user = data;

    document.getElementById('username').textContent = user.username;
    document.getElementById('avatar').src            = user.avatar;
    document.getElementById('balance').textContent   = user.balance;
    document.getElementById('level').textContent     = user.level;
    document.getElementById('xp').textContent        = `${user.xp}/100`;
  })
  .catch(() => {
     console.error('Erro na requisição:', err);
    document.getElementById('username').innerHTML =
      `<a href="https://discord.com/oauth2/authorize?client_id=1367262830776029245&response_type=code&redirect_uri=https%3A%2F%2Fmisty-bot.netlify.app%2Fauth%2Fdiscord%2Fcallback&scope=identify+email"
          class="login-fallback" >
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
  // Verifica se user está definido e popula os dados
  if (!user) return;

  document.getElementById("user-id").textContent = user.userId;
  document.getElementById("user-name").textContent = user.username;
  document.getElementById("user-saldo").textContent = user.balance.toLocaleString()|| 0;

  document.getElementById("popup-confirmar").classList.remove("hidden");

  document.getElementById("btn-confirmar").onclick = () => {
    fetch("/api/comprar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.userId, cookies, preco })
    })
    .then(res => res.json())
    .then(data => {
      if (data.pagamento_url) {
        window.location.href = data.pagamento_url;
      }
    });
  };
}

 document.addEventListener('DOMContentLoaded', () => {
    const popups = document.querySelectorAll('.popup');

    popups.forEach(popup => {
      const card = popup.querySelector('.popup-card');
      const closeBtn = popup.querySelector('.close-btn');

      // Fechar ao clicar no botão "X"
      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          popup.classList.add('hidden');
        });
      }

      // Fechar ao clicar fora do .popup-card
      popup.addEventListener('click', (e) => {
        if (!card.contains(e.target)) {
          popup.classList.add('hidden');
        }
      });
    });
  });
