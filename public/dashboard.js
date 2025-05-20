let user = null; // Variável global para guardar os dados do usuário

// Ao carregar os dados do usuário
fetch('/api/user')
  .then(res => res.json())
  .then(data => {
    if (data && data.userId) {
      user = data; // Agora os dados estão acessíveis globalmente

      // Preenche os dados na interface principal
      document.getElementById('username').textContent = data.username || 'Sem Nome';
      document.getElementById('avatar').src = data.avatar || 'default-avatar.jpg';
      document.getElementById('balance').textContent = user.balance || '0';
      document.getElementById('level').textContent = user.level || '1';
      document.getElementById('xp').textContent = `${user.xp || 0}/100`;
    } else {
      throw new Error('Usuário não logado ou dados incompletos');
    }
  })
  .catch(error => {
    console.error('Erro ao carregar os dados do usuário:', error);
    // Exibe opção de login
    document.getElementById('username').innerHTML = `
      <a href="https://discord.com/oauth2/authorize?client_id=1367262830776029245&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fdiscord%2Fcallback&scope=identify+email"
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
  document.getElementById("user-saldo").textContent = user.balance || 0;

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
