fetch('comandos.json')
  .then(res => res.json())
  .then(comandos => {
    const container = document.getElementById('comandos-container');

    comandos.forEach(cmd => {
      const card = document.createElement('div');
      card.classList.add('card');

      card.innerHTML = `
        <h3>${cmd.nome}</h3>
        <p><strong>Categoria:</strong> ${cmd.categoria}</p>
        <p><strong>Uso:</strong> ${cmd.uso}</p>
        <p><strong>Aliases:</strong> ${cmd.aliases.join(', ')}</p>
        <p><strong>Descrição:</strong> ${cmd.descricao}</p>
      `;

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
      
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
      
        const deltaX = x - centerX;
        const deltaY = y - centerY;
      
        const rotateX = (-deltaY / centerY) * 10; // -10° a 10°
        const rotateY = (deltaX / centerX) * 10;
      
        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
      

      card.addEventListener('mouseleave', () => {
        // Suaviza a rotação de volta ao neutro
        card.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease';
        card.style.transform = 'rotateX(0deg) rotateY(0deg)';
      
        // Move o glow junto com o mouse, e só depois esmaece
        const fadeTimeout = setTimeout(() => {
          card.style.setProperty('--mouse-x', `50%`);
          card.style.setProperty('--mouse-y', `50%`);
        }, 100); // tempo até o centro, antes de desaparecer o glow
      
        // Caso precise limpar (opcional)
        card.dataset.fadeTimeout = fadeTimeout;
      });
      
      container.appendChild(card);
    });
  });
