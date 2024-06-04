const confetti = {
  maxCount: 100,
  start: null,
  stop: null,
};

(function () {
  confetti.start = startConfetti;
  confetti.stop = stopConfetti;

  const colors = ["#017EFE", "#925CA2", "#FFFFFF", "#FE9D2C"];
  let streamingConfetti = false;
  let lastFrameTime = Date.now();
  const particles = [];
  let waveAngle = 0;
  let context = null;
  let canvas = null;

  function resetParticle(particle, width, height) {
    particle.color = colors[Math.floor(Math.random() * colors.length)];
    particle.color2 = colors[Math.floor(Math.random() * colors.length)];
    particle.x = Math.random() * width;
    particle.y = Math.random() * height - height;
    particle.diameter = Math.random() * 10 + 5;
    particle.tilt = Math.random() * 10 - 10;
    particle.tiltAngleIncrement = Math.random() * 0.07 + 0.05;
    particle.tiltAngle = Math.random() * Math.PI;
    return particle;
  }

  function runAnimation() {
    const now = Date.now();
    const delta = now - lastFrameTime;

    let frameInterval = 15;

    if (delta > frameInterval) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      updateParticles();
      drawParticles(context);
      lastFrameTime = now - (delta % frameInterval);
    }

    animationTimer = requestAnimationFrame(runAnimation);
  }

  function startConfetti(timeout) {
    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas = document.getElementById("confetti-canvas");
    if (!canvas) {
      canvas = document.createElement("canvas");
      canvas.id = "confetti-canvas";
      canvas.style.cssText =
        "display:block;z-index:999999;pointer-events:none;position:fixed;top:0";
      document.body.prepend(canvas);
      canvas.width = width;
      canvas.height = height;
      window.addEventListener(
        "resize",
        function () {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
        },
        true
      );
      context = canvas.getContext("2d");
    } else if (!context) {
      context = canvas.getContext("2d");
    }

    let count = confetti.maxCount;

    while (particles.length < count) {
      particles.push(resetParticle({}, width, height));
    }

    streamingConfetti = true;
    runAnimation();

    if (timeout) {
      window.setTimeout(stopConfetti, timeout);
    }
  }

  function stopConfetti() {
    streamingConfetti = false;
  }

  function drawParticles(context) {
    let particle, x, x2, y2;
    for (let i = 0; i < particles.length; i++) {
      particle = particles[i];
      context.beginPath();
      context.lineWidth = particle.diameter;
      x2 = particle.x + particle.tilt;
      x = x2 + particle.diameter / 2;
      y2 = particle.y + particle.tilt + particle.diameter / 2;
      const gradient = context.createLinearGradient(x, particle.y, x2, y2);
      gradient.addColorStop("0", particle.color);
      gradient.addColorStop("1.0", particle.color2);
      context.strokeStyle = gradient;
      context.moveTo(x, particle.y);
      context.lineTo(x2, y2);
      context.stroke();
    }
  }

  function updateParticles() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    let particle;
    let speed = 5;

    waveAngle += 0.01;
    for (let i = 0; i < particles.length; i++) {
      particle = particles[i];
      if (!streamingConfetti && particle.y < -15) {
        particle.y = height + 100;
      } else {
        particle.tiltAngle += particle.tiltAngleIncrement;
        particle.x += Math.sin(waveAngle) - 0.5;
        particle.y += (Math.cos(waveAngle) + particle.diameter + speed) * 0.5;
        particle.tilt = Math.sin(particle.tiltAngle) * 15;
      }
      if (particle.x > width + 20 || particle.x < -20 || particle.y > height) {
        if (streamingConfetti && particles.length <= confetti.maxCount) {
          resetParticle(particle, width, height);
        } else {
          particles.splice(i, 1);
          i--;
        }
      }
    }
  }
})();
