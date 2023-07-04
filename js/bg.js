const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let stars = [];
for (let i = 0; i < 100; i++) {
  stars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 2 + 1,
    color: 'white'
  });
}

let shootingStars = [];
function createShootingStar() {
  shootingStars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 3 + 1,
    color: 'white',
    velocity: {
      x: (Math.random() - 0.5) * 8,
      y: (Math.random() - 0.5) * 8
    }
  });
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const star of stars) {
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fillStyle = star.color;
    ctx.fill();
  }
  for (const shootingStar of shootingStars) {
    ctx.beginPath();
    ctx.arc(shootingStar.x, shootingStar.y, shootingStar.radius, 0, Math.PI * 2);
    ctx.fillStyle = shootingStar.color;
    ctx.fill();
    shootingStar.x += shootingStar.velocity.x;
    shootingStar.y += shootingStar.velocity.y;
    shootingStar.radius -= 0.05;
  }
  shootingStars = shootingStars.filter(shootingStar => shootingStar.radius > 0);
  if (Math.random() < 0.05) {
    createShootingStar();
  }
  requestAnimationFrame(animate);
}

animate();