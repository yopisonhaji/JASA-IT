document.addEventListener('DOMContentLoaded', () => {
    // Loader
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }, 1500);

    // Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Menu
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');

    mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        // Animate hamburger
        const bars = mobileToggle.querySelectorAll('.bar');
        // Simple toggle logic can be expanded for animation
    });

    // Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
                // Close mobile menu if open
                navMenu.classList.remove('active');
            }
        });
    });

    // Intersection Observer for Scroll Animations
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Elements to animate
    document.querySelectorAll('.service-card, .feature-box').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // CSS class handling for animations
    const style = document.createElement('style');
    style.innerHTML = `
        .animate-up {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // --- MODAL & BOOKING LOGIC ---

    const modal = document.getElementById('bookingModal');
    const softwareModal = document.getElementById('softwareModal');

    const closeBtn = document.querySelector('.close-modal');
    const closeSwBtn = document.querySelector('.close-software');

    // Open Hardware Modal
    const hardwareBtn = document.querySelector('.btn-primary');
    if (hardwareBtn) {
        hardwareBtn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.classList.add('show');
        });
    }

    // Open Software Modal
    const softwareBtn = document.querySelector('.btn-secondary');
    if (softwareBtn) {
        softwareBtn.addEventListener('click', (e) => {
            e.preventDefault();
            softwareModal.classList.add('show');
        });
    }

    // Close Modals
    closeBtn.addEventListener('click', () => modal.classList.remove('show'));
    if (closeSwBtn) closeSwBtn.addEventListener('click', () => softwareModal.classList.remove('show'));

    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('show');
        if (e.target === softwareModal) softwareModal.classList.remove('show');
    });

    // Cost Calculation Logic
    const transportMap = {
        'Jakarta': 10000, // Base
        'Depok': 25000,
        'Bogor': 35000,
        'Tangerang': 30000,
        'Bekasi': 30000
    };

    // Dummy Technician Data
    const techMap = {
        'Jakarta': { name: 'Rudi', rating: '4.9', dist: '5 KM' },
        'Depok': { name: 'Ahmad', rating: '4.8', dist: '8 KM' },
        'Bogor': { name: 'Dedi', rating: '4.7', dist: '12 KM' },
        'Tangerang': { name: 'Budi', rating: '4.9', dist: '7 KM' },
        'Bekasi': { name: 'Siti', rating: '5.0', dist: '6 KM' }
    };

    const citySelect = document.getElementById('city');
    const transportDisplay = document.getElementById('transportCost');
    const totalDisplay = document.getElementById('totalCost');

    // Create Tech Info Element if not exists
    let techInfoDiv = document.createElement('div');
    techInfoDiv.className = 'est-row tech-info';
    techInfoDiv.style.marginTop = '10px';
    techInfoDiv.style.color = '#00f2ff';
    techInfoDiv.style.fontSize = '0.8rem';
    techInfoDiv.style.display = 'none'; // Hidden initially

    const estBox = document.querySelector('.estimation-box');
    if (estBox) estBox.appendChild(techInfoDiv);

    const baseService = 150000;

    citySelect.addEventListener('change', () => {
        const city = citySelect.value;
        const transport = transportMap[city] || 0;

        transportDisplay.textContent = `Rp ${transport.toLocaleString('id-ID')}`;
        totalDisplay.textContent = `Rp ${(baseService + transport).toLocaleString('id-ID')}`;

        // Update Tech Info
        if (techMap[city]) {
            const tech = techMap[city];
            techInfoDiv.innerHTML = `<i class="fas fa-user-astronaut"></i> Teknisi Terdekat: <b>${tech.name}</b> (${tech.dist}) ⭐${tech.rating}`;
            techInfoDiv.style.display = 'block';
        } else {
            techInfoDiv.style.display = 'none';
        }
    });

    // Form Submission -> WhatsApp (Hardware)
    const bookingForm = document.getElementById('bookingForm');
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const serviceType = document.getElementById('serviceType').value;
        const deviceType = document.getElementById('deviceType').value;
        const city = document.getElementById('city').value;
        const address = document.getElementById('address').value;
        const time = document.getElementById('bookingTime').value;
        const payment = document.querySelector('input[name="paymentMethod"]:checked').value;

        // Calculate estimated total again to be sure
        const transport = transportMap[city] || 0;
        const total = baseService + transport;

        // Tracking Link (Mockup)
        const trackingLink = `https://satujalan-demo.com/tracking?id=HW-${Math.floor(Math.random() * 1000)}`;

        const waNumber = '6282138004443';
        const message = `Halo SatuJalan, saya ingin booking service:
        
📋 *FORM BOOKING HARDWARE*
--------------------------------
🔧 *Layanan:* ${serviceType}
💻 *Device/Masalah:* ${deviceType}
🏙️ *Kota:* ${city}
📍 *Alamat:* ${address}
⏰ *Waktu:* ${time}
💳 *Pembayaran:* ${payment}
--------------------------------
💰 *Estimasi Total:* Rp ${total.toLocaleString('id-ID')}
🔗 *Ref Tracking:* ${trackingLink}

Mohon konfirmasi jadwal & teknisi.`;

        window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`, '_blank');
        modal.classList.remove('show');
    });

    // Form Submission -> WhatsApp (Software)
    const softwareForm = document.getElementById('softwareForm');
    if (softwareForm) {
        softwareForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const type = document.getElementById('swServiceType').value;
            const desc = document.getElementById('projectDesc').value;
            const budget = document.getElementById('budget').value;
            const timeline = document.getElementById('timeline').value;
            const onsite = document.querySelector('input[name="onsite"]:checked').value;

            const waNumber = '6282138004443';
            const message = `Halo SatuJalan, saya tertarik project software:
            
💻 *REQUEST PROJECT*
--------------------------------
🌐 *Tipe:* ${type}
📝 *Deskripsi:* ${desc}
💰 *Budget:* ${budget}
⏱️ *Timeline:* ${timeline}
🤝 *Meeting:* ${onsite}

Mohon info proposal & penawaran.`;

            window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`, '_blank');
            softwareModal.classList.remove('show');
        });
    }
});
