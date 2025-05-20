let user = null;

// Busca dados do usuário
function fetchUser() {
  fetch('/api/user', { credentials: 'include' })
    .then(res => {
      console.log('res.ok:', res.ok);
      if (!res.ok) throw new Error('401');
      return res.json();
    })
    .then(data => {
      console.log('Dados recebidos:', data);
      user = data;
      updateUserUI();
    })
    .catch(err => {
      console.error('Erro na requisição:', err);
      fallbackToLogin();
    });
}

// Atualiza UI com os dados do usuário
function updateUserUI() {
  document.getElementById('username').textContent = user.username;
  document.getElementById('avatar').src = user.avatar;
  document.getElementById('balance').textContent = user.balance;
  document.getElementById('level').textContent = user.level;
  document.getElementById('xp').textContent = `${user.xp}/100`;
}

// Mostra link de login e avatar padrão
function fallbackToLogin() {
  document.getElementById('username').innerHTML = `
    <a href="https://discord.com/oauth2/authorize?client_id=1367262830776029245&response_type=code&redirect_uri=https%3A%2F%2Fmisty-bot.netlify.app%2Fauth%2Fdiscord%2Fcallback&scope=identify+email"
      class="login-fallback">
      <i class="fa-solid fa-right-to-bracket"></i> Fazer login
    </a>`;
  document.getElementById('avatar').src = 'img/default-avatar.jpg';
}

// Troca de páginas no painel lateral
function setupSidebarNavigation() {
  document.querySelectorAll('.sidebar button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.sidebar button').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const page = btn.getAttribute('data-page');
      document.getElementById(page).classList.add('active');
    });
  });
}

// Configura clique nos cards de produtos
function setupProductCards() {
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
}

// Animação dos cookies voando
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

// Exibe popup de login
function showLoginPopup() {
  document.getElementById("popup-login").classList.remove("hidden");
}

// Exibe popup de confirmação de compra
function showConfirmPopup(cookies, preco) {
  if (!user) return;

  document.getElementById("user-id").textContent = user.userId;
  document.getElementById("user-name").textContent = user.username;
  document.getElementById("user-saldo").textContent = user.balance.toLocaleString() || 0;

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

// Configura popups (fechar ao clicar fora ou no X)
function setupPopups() {
  const popups = document.querySelectorAll('.popup');
  popups.forEach(popup => {
    const card = popup.querySelector('.popup-card');
    const closeBtn = popup.querySelector('.close-btn');

    if (closeBtn) {
      closeBtn.addEventListener('click', () => popup.classList.add('hidden'));
    }

    popup.addEventListener('click', (e) => {
      if (!card.contains(e.target)) {
        popup.classList.add('hidden');
      }
    });
  });
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  fetchUser();
  setupSidebarNavigation();
  setupProductCards();
  setupPopups();
});
