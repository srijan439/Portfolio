// SCROLL PROGRESS
window.addEventListener('scroll', () => {
  const h = document.documentElement;
  const prog = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
  document.getElementById('scroll-progress').style.width = prog + '%';
});

// THEME TOGGLE
function toggleTheme() {
  const html = document.documentElement;
  const newTheme = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
}

// Initialize Theme
(function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
})();

// MOBILE MENU
function toggleMenu() {
  document.getElementById('mobile-menu').classList.toggle('open');
  document.querySelector('.hamburger').classList.toggle('active');
}

window.addEventListener('mousemove', (e) => {
  const { clientX: x, clientY: y } = e;
  
  // Content Tilt
  const tiltEl = document.getElementById('hero-tilt');
  if (tiltEl) {
    const rx = (window.innerWidth / 2 - x) / 50;
    const ry = (window.innerHeight / 2 - y) / 50;
    tiltEl.style.transform = `rotateY(${rx}deg) rotateX(${ry}deg)`;
  }
});

// MAGNETIC BUTTONS
document.querySelectorAll('.magnetic').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

// STAGGERED ENTRANCE TRIGGER
window.addEventListener('load', () => {
  document.querySelectorAll('[data-animate]').forEach(el => {
    el.classList.add('animate-in');
  });
});

// REVEAL ON SCROLL
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); }
  });
}, { threshold: 0.1 });
revealEls.forEach(el => io.observe(el));

// SKILL BARS
const skillIo = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.skill-fill').forEach(bar => {
        bar.style.width = bar.dataset.pct + '%';
      });
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.skill-category').forEach(el => skillIo.observe(el));

// INFINITE SLIDERS LOGIC
const sliders = ['projects', 'certs'];

sliders.forEach(id => {
  const track = document.getElementById(`${id}-track`);
  const wrapper = document.querySelector(`.${id}-wrapper`);
  if (!track || !wrapper) return;

  // Clone content for infinite feel
  track.innerHTML += track.innerHTML;

  let isPaused = false;
  let scrollSpeed = 0.5; // Pixels per frame

  function step() {
    if (!isPaused) {
      wrapper.scrollLeft += scrollSpeed;
      handleWrap(wrapper);
    }
    requestAnimationFrame(step);
  }

  function handleWrap(el) {
    const half = el.scrollWidth / 2;
    if (el.scrollLeft >= half) {
      el.scrollLeft -= half;
    } else if (el.scrollLeft <= 0) {
      el.scrollLeft += half;
    }
  }

  // Start auto-scroll
  requestAnimationFrame(step);

  // Pause on hover
  wrapper.addEventListener('mouseenter', () => isPaused = true);
  wrapper.addEventListener('mouseleave', () => {
    // Only resume if not recently interacted via buttons
    if (!wrapper.interactionTimer) isPaused = false;
  });

  // Add wrap-around check on every scroll
  wrapper.addEventListener('scroll', () => handleWrap(wrapper), { passive: true });

  // Export control functions to wrapper for external access
  wrapper.handleWrap = handleWrap;
  wrapper.setPaused = (p) => {
    isPaused = p;
    if (!p) return;
    clearTimeout(wrapper.interactionTimer);
    wrapper.interactionTimer = setTimeout(() => {
      isPaused = false;
      wrapper.interactionTimer = null;
    }, 5000);
  };
});

// SLIDER NAVIGATION
function moveSlider(id, direction) {
  const wrapper = document.querySelector(`.${id}-wrapper`);
  if (!wrapper) return;
  
  wrapper.setPaused(true);
  
  const scrollAmount = 350;
  const targetScroll = wrapper.scrollLeft + (direction * scrollAmount);
  
  wrapper.scrollTo({
    left: targetScroll,
    behavior: 'smooth'
  });
}


// MONTHLY ACTIVITY CHART (PREMIUM LINE GRAPH)
function generateActivityChart() {
  const container = document.getElementById('activity-chart');
  if (!container) return;
  
  const data = [15, 35, 52, 70, 70, 70, 58, 42, 60, 80, 95, 100];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const width = container.offsetWidth;
  const height = 200;
  const paddingX = 40; // Space for Y-axis labels
  const paddingY = 20;
  const chartWidth = width - paddingX - 20;
  const chartHeight = height - paddingY * 2;
  
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.setAttribute("class", "activity-svg");
  
  // 1. Gradients
  const defs = document.createElementNS(svgNS, "defs");
  const gradient = document.createElementNS(svgNS, "linearGradient");
  gradient.setAttribute("id", "activity-gradient");
  gradient.setAttribute("x1", "0%"); gradient.setAttribute("y1", "0%");
  gradient.setAttribute("x2", "0%"); gradient.setAttribute("y2", "100%");
  const stops = [
    { offset: "0%", opacity: "0.3" },
    { offset: "100%", opacity: "0" }
  ];
  stops.forEach(s => {
    const stop = document.createElementNS(svgNS, "stop");
    stop.setAttribute("offset", s.offset);
    stop.setAttribute("stop-color", "var(--accent)");
    stop.setAttribute("stop-opacity", s.opacity);
    gradient.appendChild(stop);
  });
  defs.appendChild(gradient);
  svg.appendChild(defs);

  // 2. Grid & Axis
  for(let i = 0; i <= 4; i++) {
    const yVal = paddingY + (i * chartHeight / 4);
    const pct = 100 - (i * 25);
    
    // Horizontal Grid Line
    const line = document.createElementNS(svgNS, "line");
    line.setAttribute("x1", paddingX);
    line.setAttribute("y1", yVal);
    line.setAttribute("x2", width - 20);
    line.setAttribute("y2", yVal);
    line.setAttribute("class", "grid-line");
    svg.appendChild(line);
    
    // Y-Axis label
    const text = document.createElementNS(svgNS, "text");
    text.setAttribute("x", paddingX - 10);
    text.setAttribute("y", yVal + 4);
    text.setAttribute("text-anchor", "end");
    text.setAttribute("class", "axis-text");
    text.textContent = pct + "%";
    svg.appendChild(text);
  }

  // Vertical Axis line
  const yAxis = document.createElementNS(svgNS, "line");
  yAxis.setAttribute("x1", paddingX); yAxis.setAttribute("y1", paddingY);
  yAxis.setAttribute("x2", paddingX); yAxis.setAttribute("y2", height - paddingY);
  yAxis.setAttribute("class", "axis-line");
  svg.appendChild(yAxis);

  // Horizontal Axis line
  const xAxis = document.createElementNS(svgNS, "line");
  xAxis.setAttribute("x1", paddingX); xAxis.setAttribute("y1", height - paddingY);
  xAxis.setAttribute("x2", width - 20); xAxis.setAttribute("y2", height - paddingY);
  xAxis.setAttribute("class", "axis-line");
  svg.appendChild(xAxis);

  // 3. Points Calculation
  const points = data.map((val, i) => ({
    x: paddingX + (i * (chartWidth / (months.length - 1))),
    y: height - paddingY - (val / 100 * chartHeight),
    val, month: months[i]
  }));

  // 4. Smooth Line Generation (Cubic Bezier)
  function getPath(pts) {
    let d = `M ${pts[0].x} ${pts[0].y} `;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(i - 1, 0)];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[Math.min(i + 2, pts.length - 1)];
      
      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;
      
      d += `C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y} `;
    }
    return d;
  }

  const areaD = getPath(points) + ` L ${points[points.length-1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;
  const areaPath = document.createElementNS(svgNS, "path");
  areaPath.setAttribute("d", areaD);
  areaPath.setAttribute("class", "activity-area");
  svg.appendChild(areaPath);

  const linePath = document.createElementNS(svgNS, "path");
  linePath.setAttribute("d", getPath(points));
  linePath.setAttribute("class", "activity-line");
  svg.appendChild(linePath);

  // 5. Interactive Elements
  const crosshair = document.createElementNS(svgNS, "line");
  crosshair.setAttribute("class", "activity-crosshair");
  crosshair.setAttribute("y1", paddingY);
  crosshair.setAttribute("y2", height - paddingY);
  svg.appendChild(crosshair);

  const tooltip = document.createElement('div');
  tooltip.className = 'activity-tooltip';
  container.appendChild(tooltip);

  points.forEach((p, i) => {
    const circle = document.createElementNS(svgNS, "circle");
    circle.setAttribute("cx", p.x); circle.setAttribute("cy", p.y);
    circle.setAttribute("class", "activity-point");
    circle.style.transitionDelay = (0.5 + i * 0.05) + 's';
    
    circle.addEventListener('mouseenter', () => {
      crosshair.setAttribute("x1", p.x);
      crosshair.setAttribute("x2", p.x);
      crosshair.style.opacity = "0.5";
      tooltip.innerHTML = `<span style="opacity:0.6">${p.month}</span><br><b>${p.val}%</b> Progress`;
      tooltip.style.left = p.x + 'px';
      tooltip.style.top = p.y + 'px';
      tooltip.classList.add('visible');
    });
    
    circle.addEventListener('mouseleave', () => {
      crosshair.style.opacity = "0";
      tooltip.classList.remove('visible');
    });
    
    svg.appendChild(circle);
  });

  container.appendChild(svg);

  // 6. X-Axis Labels
  const labels = document.createElement('div');
  labels.className = 'activity-labels';
  months.forEach(m => {
    const span = document.createElement('span');
    span.className = 'month-label';
    span.textContent = m;
    labels.appendChild(span);
  });
  container.appendChild(labels);
}
generateActivityChart();

// HANDLE RESIZE FOR CHART
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    const container = document.getElementById('activity-chart');
    if (container) {
      container.innerHTML = '';
      generateActivityChart();
    }
  }, 300);
});

// FORM SUBMIT
function handleSubmit() {
  const btn = document.querySelector('.form-submit');
  btn.textContent = 'Message sent! ✓';
  btn.style.background = '#26a641';
  setTimeout(() => {
    btn.textContent = 'Send Message ↗';
    btn.style.background = '';
  }, 3000);
}

// NAV ACTIVE SCROLL HIGHLIGHT
window.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-icon-link');
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 150) current = s.id;
  });
  links.forEach(l => {
    l.classList.remove('active');
    if (l.getAttribute('href') === `#${current}`) l.classList.add('active');
  });
});

// TYPEWRITER EFFECT
const texts = ["Computer Science Engineer.", "AI & ML Enthusiast.", "Full Stack Developer."];
let count = 0;
let index = 0;
let currentText = "";
let letter = "";
let isDeleting = false;

(function type() {
  if (count === texts.length) { count = 0; }
  currentText = texts[count];
  if (isDeleting) {
    letter = currentText.slice(0, --index);
  } else {
    letter = currentText.slice(0, ++index);
  }
  const tw = document.getElementById('typewriter');
  if (tw) tw.textContent = letter;
  
  let typeSpeed = isDeleting ? 40 : 100;
  if (!isDeleting && letter.length === currentText.length) {
    typeSpeed = 2000;
    isDeleting = true;
  } else if (isDeleting && letter.length === 0) {
    isDeleting = false;
    count++;
    typeSpeed = 500;
  }
  setTimeout(type, typeSpeed);
})();

// NAV DYNAMIC TRANSITION
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (window.scrollY > 50) {
    nav.classList.remove('nav-at-top');
  } else {
    nav.classList.add('nav-at-top');
  }
});

VanillaTilt.init(document.querySelectorAll(".project-card, .stat-card, .cert-card, .about-card, .skill-category, .platforms-container"), {
  max: 8,
  speed: 400,
  glare: true,
  "max-glare": 0.15,
});
