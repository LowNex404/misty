// Fazendo a requisição para o endpoint que retorna os dados do usuário
fetch('/api/user')
  .then(res => res.json())
  .then(data => {
    // Preenche os elementos com os dados do usuário
    document.getElementById('username').textContent = data.username || 'Nome não disponível';
    document.getElementById('avatar').src = data.avatar || 'default-avatar.jpg';  // Imagem padrão caso falte avatar
    document.getElementById('balance').textContent = data.balance || '0';
    document.getElementById('level').textContent = data.level || '1';
    document.getElementById('xp').textContent = `${data.xp || 0}/100`;
  })
  .catch(error => {
    console.error('Erro ao carregar os dados do usuário:', error);
    // Tratamento de erro, caso não consiga carregar os dados
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
      // Remove active de todos
      document.querySelectorAll('.sidebar button').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  
      // Ativa o botão e a página correta
      btn.classList.add('active');
      const page = btn.getAttribute('data-page');
      document.getElementById(page).classList.add('active');
    });
  });
  
  
  // Dados do usuário (simulação)
  document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/user')
      .then(res => res.json())
      .then(data => {
        document.getElementById('username').textContent = data.username || 'Sem Nome';
        document.getElementById('avatar').src = data.avatar || 'default-avatar.jpg';
      });
  });


let user = null; // Variável global que armazenará os dados do usuário
let isLoggedIn = false; // Inicialmente falso

// Requisição para verificar se o usuário está logado
fetch('/api/user')
  .then(res => {
    if (!res.ok) throw new Error('Usuário não autenticado');
    return res.json();
  })
  .then(data => {
    user = data;
    isLoggedIn = true;

    // Preencher dados visuais
    document.getElementById('username').textContent = data.username || 'Nome não disponível';
    document.getElementById('avatar').src = data.avatar || 'default-avatar.jpg';
    document.getElementById('balance').textContent = data.balance || '0';
    document.getElementById('level').textContent = data.level || '1';
    document.getElementById('xp').textContent = `${data.xp || 0}/100`;
  })
  .catch(error => {
    console.warn('Usuário não logado:', error);

    // Tratamento visual para usuário deslogado
    document.getElementById('username').innerHTML = `
      <a href="https://discord.com/oauth2/authorize?client_id=1367262830776029245&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fdiscord%2Fcallback&scope=identify+email"
          class="login-fallback" >
        <i class="fa-solid fa-right-to-bracket"></i> Fazer login
      </a>`;
    document.getElementById('avatar').src = 'img/default-avatar.jpg';
  });

// Evento de clique nos cards
document.querySelectorAll('.produto-card').forEach(card => {
  card.addEventListener('click', () => {
    explodeCookies(card);

    const cookies = card.dataset.cookies;
    const preco = card.dataset.preco;

    if (!isLoggedIn) {
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
  document.getElementById("user-id").textContent = user.id;
  document.getElementById("user-name").textContent = user.username;
  document.getElementById("user-saldo").textContent = user.saldo || 0;

  document.getElementById("popup-confirmar").classList.remove("hidden");

  document.getElementById("btn-confirmar").onclick = () => {
    fetch("/api/comprar", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ userId: user.id, cookies: cookies, preco: preco })
    })
    .then(res => res.json())
    .then(data => {
      if (data.pagamento_url) {
        window.location.href = data.pagamento_url;
      }
    });
  };
}

