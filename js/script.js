// GSAP is expected to be loaded in HTML via CDN
// https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js

document.addEventListener('DOMContentLoaded', () => {
    // Inject Dynamic Data
    injectData();

    // Load Audio
    initAudio();

    // Initial GSAP Animations
    if (typeof gsap !== 'undefined') {
        initAnimations();
    } else {
        console.warn("GSAP not loaded");
    }

    // Dynamic Background
    initBackgroundHearts();
});

function injectData() {
    const elements = document.querySelectorAll('[data-replace]');
    elements.forEach(el => {
        const key = el.getAttribute('data-replace');
        if (clientData[key]) {
            el.textContent = clientData[key];
        }
    });
}

function initAudio() {
    const audio = document.getElementById('bg-music');
    if (audio) {
        audio.src = clientData.musicFile;
        // Elegant fade in on play? 
        // Browsers block autoplay, so we wait for interaction
        const playAudio = () => {
            if (audio.paused) {
                audio.volume = 0;
                audio.play().then(() => {
                    // Fade in volume
                    let vol = 0;
                    const seed = setInterval(() => {
                        vol += 0.05;
                        if (vol >= 0.4) clearInterval(seed); // Max volume 40%
                        audio.volume = Math.min(vol, 1);
                    }, 200);
                }).catch(e => console.log("Audio play blocked", e));
            }
            document.removeEventListener('click', playAudio);
        };
        document.addEventListener('click', playAudio);
    }
}

function initAnimations() {
    // Global fade in for body content
    gsap.from("body", { opacity: 0, duration: 1.5, ease: "power2.out" });

    // Specific reveal animations
    if (document.querySelectorAll('.gsap-reveal').length > 0) {
        gsap.to(".gsap-reveal", {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.2,
            ease: "power3.out",
            delay: 0.5
        });
    }
}

// Helper for confetti/particles gold style
function triggerGoldConfetti() {
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#d4af37', '#fcd34d', '#ffffff'], // Gold and white
        shapes: ['circle'], // Cleaner look
        disableForReducedMotion: true
    });
}

function initBackgroundHearts() {
    // Create a container if needed, or just append to body
    const symbols = ['❤', '✨', '💖']; // Hearts and sparkles

    setInterval(() => {
        const heart = document.createElement('div');
        heart.classList.add('bg-heart');
        heart.innerHTML = symbols[Math.floor(Math.random() * symbols.length)];

        // Randomize
        const left = Math.random() * 100;
        const size = Math.random() * 20 + 10; // 10px to 30px
        const duration = Math.random() * 10 + 10; // 10s to 20s

        heart.style.left = `${left}vw`;
        heart.style.fontSize = `${size}px`;
        heart.style.animationDuration = `${duration}s`;

        // Color variation (Gold vs subtle Pink)
        if (Math.random() > 0.7) {
            heart.style.color = 'rgba(244, 114, 182, 0.15)'; // Subtle pink
        }

        document.body.appendChild(heart);

        // Cleanup
        setTimeout(() => {
            heart.remove();
        }, duration * 1000);
    }, 800); // New heart every 800ms
}
