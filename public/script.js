fetch('http://localhost:3000/servidores')
  .then(res => res.json())
  .then(servidores => {
    const container = document.getElementById('server-track');

    // Cria os ícones reais
    servidores.forEach(servidor => {
      if (servidor.icone) {
        const img = document.createElement('img');
        img.src = servidor.icone;
        img.alt = servidor.nome;
        img.title = servidor.nome;
        container.appendChild(img);
      }
    });

    // Repete ícones até preencher pelo menos 2x a largura da tela
    const baseIcons = Array.from(container.children);
    const screenWidth = window.innerWidth;
    const iconWidth = 100; // 80px + gap estimado

    const requiredCopies = Math.ceil((screenWidth * 2) / (baseIcons.length * iconWidth));

    for (let i = 0; i < requiredCopies; i++) {
      baseIcons.forEach(icon => {
        container.appendChild(icon.cloneNode(true));
      });
    }
  });

//cursor
const coords = { x: 0, y: 0 };
const circles = document.querySelectorAll(".circle");

circles.forEach(function (circle) {
  circle.x = 0;
  circle.y = 0;
});

window.addEventListener("mousemove", function(e){
  coords.x = e.clientX;
  coords.y = e.clientY;

  // Detecta se o elemento sob o cursor é interativo
  const target = document.elementFromPoint(e.clientX, e.clientY);
  const isHoverSensitive = target?.closest('.buttons, .avatar, .server-track, .footer-content strong, .social-icons');

  // Define opacidade conforme hover
  circles.forEach(circle => {
    circle.style.opacity = isHoverSensitive ? '0' : '1';
  });
});

function animateCircles() {
  let x = coords.x;
  let y = coords.y;

  circles.forEach(function (circle, index) {
    circle.style.left = x - 12 + "px";
    circle.style.top = y - 12 + "px";
    
    circle.style.scale = (circles.length - index) / circles.length;
    
    circle.x = x;
    circle.y = y;

    const nextCircle = circles[index + 1] || circles[0];
    x += (nextCircle.x - x) * 0.2;
    y += (nextCircle.y - y) * 0.2;
  });

  requestAnimationFrame(animateCircles);
}

animateCircles();
