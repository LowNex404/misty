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
    <a href="https://discord.com/oauth2/authorize?client_id=1367262830776029245&response_type=code&redirect_uri=https%3A%2F%2Fmisty-bot.onrender.com%2Fdashboard.html&scope=identify+email"
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


  
