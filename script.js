fetch("https://ipapi.co/json/")
  .then((res) => res.json())
  .then((data) => {
    return fetch("/.netlify/functions/log-visitor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ip: data.ip,
        city: data.city,
        region: data.region,
        country: data.country_name,
        page: window.location.pathname,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
      }),
    });
  })
  .then((res) => res.json())
  .then((result) => console.log("Visitor logged:", result))
  .catch((err) => console.error("Logging error:", err));



function openModal(id) {
  document.getElementById(id).style.display = 'flex';
}
// function closeModal(id) {
//   document.getElementById(id).style.display = 'none';
// }
function closeModal(id) {
  const modal = document.getElementById(id);
  modal.classList.add('closing');

  // Wait for CSS transition to finish (400ms here)
  setTimeout(() => {
    modal.classList.remove('closing');
    modal.style.display = 'none';
  }, 400);  // match this to your CSS transition duration
}



// Grab all the animated cards
const cards = document.querySelectorAll('.card.glass');

function scrubCard(card) {
  const rect = card.getBoundingClientRect();
  const winH = window.innerHeight;
  
  // Define the window slice over which the animation should run
  const start = winH * 0.8;     // animation starts when card.top < 80% viewport
  const end   = winH * 0.2;     // finishes when card.top < 20% viewport

  // Compute raw progress (0 → 1)
  let progress = (start - rect.top) / (start - end);
  progress = Math.min(Math.max(progress, 0), 1);

  // Apply transform & opacity based on which class it has
  if (card.classList.contains('anim-left')) {
    card.style.opacity = progress;
    card.style.transform = `translateX(${ -50 * (1 - progress) }px)`;
  }
  else if (card.classList.contains('anim-right')) {
    card.style.opacity = progress;
    card.style.transform = `translateX(${  50 * (1 - progress) }px)`;
  }
  else if (card.classList.contains('anim-center')) {
    card.style.opacity = progress;
    const scale = 0.5 + 0.5 * progress;
    const rot   = -45 + 45 * progress;
    card.style.transform = `scale(${scale}) rotate(${rot}deg)`;
  }
  else if (card.classList.contains('anim-up')) {
    card.style.opacity = progress;
    card.style.transform = `translateY(${  50 * (1 - progress) }px)`;
  }
}

function onScroll() {
  cards.forEach(scrubCard);
}

// Run on scroll and on load (in case some are already in view)
window.addEventListener('scroll', onScroll);
window.addEventListener('load',  onScroll);


//parallax bg

/*const layerClouds = document.getElementById('layer-clouds');
const layerStars = document.getElementById('layer-stars');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;

  layerClouds.style.transform = `translateY(${scrollY * 0.4}px)`;
  layerStars.style.transform = `translateY(${scrollY * 0.6}px)`;
});
*/

// Parallax scroll effect
window.addEventListener('scroll', () => {
  const scrollValue = window.scrollY;

  // Adjust speed for parallax layers
  const clouds = document.getElementById('layer-clouds');
  const particles = document.getElementById('particles-js');

  if (clouds) clouds.style.transform = `translateY(${scrollValue * 0.3}px)`;
  if (particles) particles.style.transform = `translateY(${scrollValue * 0.1}px)`; // subtle movement
});




//Glass card hover




// ripple-bg
const canvas = document.getElementById('ripple-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let ripples = [];

document.addEventListener('mousemove', (e) => {
  ripples.push({
    x: e.clientX,
    y: e.clientY,
    radius: 0,
    opacity: 1,
  });
});

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ripples.forEach((ripple, index) => {
    ripple.radius += 2;
    ripple.opacity -= 0.02;

    const gradient = ctx.createRadialGradient(
      ripple.x,
      ripple.y,
      0,
      ripple.x,
      ripple.y,
      ripple.radius
    );
    gradient.addColorStop(0, `rgba(255, 255, 255, ${ripple.opacity * 0.1})`);
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
    ctx.fill();

    if (ripple.opacity <= 0) {
      ripples.splice(index, 1);
    }
  });

  requestAnimationFrame(animate);
}

animate();


// Initialize tilt.js on elements with the data-tilt attribute
VanillaTilt.init(document.querySelectorAll('.card.glass'), {
  max: 1.5,            // Maximum tilt rotation (degrees)
  speed: 2000,         // Speed of tilt transition (in milliseconds)
  glare: false,        // Enable glare effect (shine effect on the card)
  "max-glare": 0.05   // Maximum glare intensity
});


//particles now
particlesJS("particles-js", {
  particles: {
    number: { value: 1000, density: { enable: true, value_area: 800 } },
    color: { value: "#ffffff" },
    shape: { type: "circle" },
    opacity: { value: 0.2, random: true },
    size: { value: 2.5, random: true },
    line_linked: {
      enable: true,
      distance: 150,
      color: "#ffffff",
      opacity: 0,
      width: 1
    },
    move: {
      enable: true,
      speed: 0.8,
      direction: "none",
      out_mode: "out"
    }
  },
  interactivity: {
    detect_on: "canvas",
    events: {
      onhover: { enable: true, mode: "repulse" },
      onclick: { enable: false }
    },
    modes: {
      repulse: { distance: 100, duration: 0.4 }
    }
  },
  retina_detect: true
});




// new function to show popup for skills
function showSkillPopup(skillName, proficiencyPercent) {
  const popup = document.getElementById('skill-popup');
  const skillNameEl = document.getElementById('popup-skill-name');
  const progressFill = document.getElementById('popup-progress-fill');
  const skillLevelEl = document.getElementById('popup-skill-level');
  const percentageEl = document.getElementById('popup-percentage');

  // Set skill name and level
  skillNameEl.textContent = skillName;
  percentageEl.textContent = '0%';  // reset counter

  // Reset progress bar
  progressFill.style.width = '0%';

  // Show popup
  popup.style.display = 'flex';

  // Animate progress after slight delay
  setTimeout(() => {
    progressFill.style.width = proficiencyPercent + '%';
    animatePercentage(percentageEl, proficiencyPercent);
  }, 100);
}

function closeSkillPopup() {
  const popup = document.getElementById('skill-popup');
  const content = popup.querySelector('.popup-content');

  // Add closing classes
  popup.classList.add('closing');
  content.classList.add('closing');

  // Wait for animation to finish (300ms) before hiding and cleaning up
  setTimeout(() => {
    popup.style.display = 'none';
    popup.classList.remove('closing');
    content.classList.remove('closing');
  }, 300);
}

// Close when clicking outside the popup box
document.getElementById('skill-popup').addEventListener('click', closeSkillPopup);

// Percentage count-up animation
function animatePercentage(element, target) {
  let current = 0;
  const duration = 600; // ms total
  const stepTime = Math.max(Math.floor(duration / target), 10);

  const timer = setInterval(() => {
    current++;
    element.textContent = current + '%';
    if (current >= target) {
      clearInterval(timer);
    }
  }, stepTime);
}




//New greetings js
window.addEventListener('load', () => {
  const overlay = document.getElementById('greeting-overlay');
  const greetingText = document.getElementById('greeting-text');
  document.getElementById('greeting-subtext').style.visibility = 'visible';
  const hasVisited = localStorage.getItem('hasVisited');

  if (hasVisited) {
    // Skip greeting if already visited
    overlay.style.display = 'none';
  } else {
    // Get current hour
    const now = new Date();
    const hour = now.getHours();
    let greeting = "Welcome!";

    if (hour >= 5 && hour < 12) {
      greeting = "☀️ Good morning!";
    } else if (hour >= 12 && hour < 17) {
      greeting = "🌤️ Good afternoon!";
    } else if (hour >= 17 && hour < 21) {
      greeting = "🌆 Good evening!";
    } else {
      greeting = "🌙 Good night!";
    }

    // Set greeting text
    greetingText.textContent = `${greeting} 👋Welcome to My Portfolio!`;

    // Wait 1 seconds, then fade out
    setTimeout(() => {
      overlay.classList.add('hidden');
      setTimeout(() => {
        overlay.style.display = 'none';
      }, 800);
    }, 1000);
  }
});
//End of new greetings js

//Scroll arrow
window.addEventListener('DOMContentLoaded', () => {
  const scrollArrow = document.getElementById('scroll-arrow');

  // On arrow click → scroll to next section and hide arrow
  scrollArrow.addEventListener('click', () => {
    const nextSection = document.querySelector('section:nth-of-type(2)');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
    scrollArrow.classList.add('hidden');
  });

  // On scroll → hide if scrolled down, show if back near top
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      scrollArrow.classList.add('hidden');
    } else {
      scrollArrow.classList.remove('hidden');
    }
  });
});
//End of scroll arrow js