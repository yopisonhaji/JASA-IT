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
        'Jakarta': 10000,
        'Depok': 25000,
        'Bogor': 35000,
        'Tangerang': 25000, // Updated to match HTML
        'Bekasi': 30000,
        'Lainnya': 0,
        'GPS': 0 // Dynamic
    };

    // BSD Serpong Coordinates (Base Station)
    const BASE_COORDS = { lat: -6.3090, lng: 106.6713 }; // Example: Around BSD

    function getDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Radius of the earth in km
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c; // Distance in km
        return d;
    }

    function deg2rad(deg) {
        return deg * (Math.PI / 180);
    }

    // Dummy Technician Data
    const techMap = {
        'Jakarta': { name: 'Rudi', rating: '4.9', dist: '5 KM' },
        'Depok': { name: 'Ahmad', rating: '4.8', dist: '8 KM' },
        'Bogor': { name: 'Dedi', rating: '4.7', dist: '12 KM' },
        'Tangerang': { name: 'Budi', rating: '4.9', dist: '7 KM' },
        'Bekasi': { name: 'Siti', rating: '5.0', dist: '6 KM' },
        'GPS': { name: 'System', rating: '5.0', dist: 'Calculating...' }
    };

    const citySelect = document.getElementById('city');
    const serviceSelect = document.getElementById('serviceType');
    const transportDisplay = document.getElementById('transportCost');
    const totalDisplay = document.getElementById('totalCost');
    const gpsGroup = document.getElementById('gps-group');
    const btnLocation = document.getElementById('btn-location');
    const locStatus = document.getElementById('location-status');
    const userLatInput = document.getElementById('user-lat');
    const userLongInput = document.getElementById('user-long');
    const calcDistInput = document.getElementById('calc-distance');

    // Handle City Change (Show/Hide GPS Button)
    citySelect.addEventListener('change', () => {
        if (citySelect.value === 'GPS') {
            gpsGroup.style.display = 'block';
            updateCost(); // Reset
        } else {
            gpsGroup.style.display = 'none';
            updateCost();
        }
    });

    // Handle GPS Button Click
    if (btnLocation) {
        btnLocation.addEventListener('click', () => {
            if ("geolocation" in navigator) {
                locStatus.textContent = "Sedang mengambil lokasi...";
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const lat = position.coords.latitude;
                        const long = position.coords.longitude;

                        userLatInput.value = lat;
                        userLongInput.value = long;

                        const dist = getDistance(BASE_COORDS.lat, BASE_COORDS.lng, lat, long);
                        calcDistInput.value = dist.toFixed(2);

                        locStatus.innerHTML = `<span style="color: #00f2ff;">Lokasi Ditemukan! Jarak dari Base (BSD): <b>${dist.toFixed(1)} KM</b></span>`;

                        updateCost();
                    },
                    (error) => {
                        console.error("Error GPS:", error);
                        locStatus.textContent = "Gagal mengambil lokasi. Pastikan GPS aktif.";
                    }
                );
            } else {
                locStatus.textContent = "Browser tidak mendukung Geolocation.";
            }
        });
    }

    // Create Tech Info & Error Elements
    let techInfoDiv = document.createElement('div');
    techInfoDiv.className = 'est-row tech-info';
    techInfoDiv.style.marginTop = '10px';
    techInfoDiv.style.fontSize = '0.8rem';
    techInfoDiv.style.display = 'none';

    const estBox = document.querySelector('.estimation-box');
    if (estBox) estBox.appendChild(techInfoDiv);

    function updateCost() {
        const city = citySelect.value;
        const service = serviceSelect.value;

        // Validation: Out of Area (Manual)
        if (city === 'Lainnya') {
            transportDisplay.textContent = '-';
            totalDisplay.textContent = '-';
            techInfoDiv.innerHTML = `<span style="color: #ff4757;"><i class="fas fa-times-circle"></i> Maaf, kami belum melayani area ini.</span>`;
            techInfoDiv.style.display = 'block';
            return;
        }

        let transport = transportMap[city] || 0;

        // GPS Dynamic Pricing Logic
        if (city === 'GPS') {
            const distance = parseFloat(calcDistInput.value);
            if (!isNaN(distance)) {
                // Formula: Base 15k + (2.5k per KM)
                transport = 15000 + (distance * 2500);
                // Round to hundreds
                transport = Math.ceil(transport / 100) * 100;
            } else {
                transport = 0; // Waiting for GPS
            }
        }

        let baseService = 150000;
        let serviceText = "Rp 150.000";

        // Logic: Seikhlasnya for "Install Ulang"
        if (service.includes('Install Ulang')) {
            baseService = 0; // Seikhlasnya logic
            serviceText = "Seikhlasnya";

            const serviceCostSpan = document.querySelector('.estimation-box .est-row:first-child span:last-child');
            if (serviceCostSpan) serviceCostSpan.textContent = serviceText;
        } else {
            const serviceCostSpan = document.querySelector('.estimation-box .est-row:first-child span:last-child');
            if (serviceCostSpan) serviceCostSpan.textContent = "Rp 150.000";
        }

        if (city === 'GPS' && transport === 0) {
            transportDisplay.textContent = "Menunggu GPS...";
        } else {
            transportDisplay.textContent = `Rp ${transport.toLocaleString('id-ID')}`;
        }

        if (baseService === 0) {
            totalDisplay.textContent = `Rp ${transport.toLocaleString('id-ID')} + Jasa Seikhlasnya`;
        } else {
            totalDisplay.textContent = `Rp ${(baseService + transport).toLocaleString('id-ID')}`;
        }

        // Update Tech Info for Manual Cities
        if (city !== 'GPS' && techMap[city]) {
            const tech = techMap[city];
            techInfoDiv.innerHTML = `<span style="color: #00f2ff;"><i class="fas fa-user-astronaut"></i> Teknisi Terdekat: <b>${tech.name}</b> (${tech.dist}) ⭐${tech.rating}</span>`;
            techInfoDiv.style.display = 'block';
        } else if (city === 'GPS' && parseFloat(calcDistInput.value) > 0) {
            techInfoDiv.innerHTML = `<span style="color: #00f2ff;"><i class="fas fa-satellite"></i> Akurasi GPS Tinggi. Biaya Transport Real-time.</span>`;
            techInfoDiv.style.display = 'block';
        } else {
            techInfoDiv.style.display = 'none';
        }
    }

    // citySelect.addEventListener('change', updateCost); // Already added logic above for GPS toggle
    serviceSelect.addEventListener('change', updateCost); // Also update when service changes

    // Initial cost calculation on load
    updateCost();

    // Form Submission -> WhatsApp (Hardware)
    const bookingForm = document.getElementById('bookingForm');
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const serviceType = document.getElementById('serviceType').value;
        const deviceType = document.getElementById('deviceType').value;
        const city = document.getElementById('city').value;
        let address = document.getElementById('address').value; // let, cause we might append MAP link
        const time = document.getElementById('bookingTime').value;
        const payment = document.querySelector('input[name="paymentMethod"]:checked').value;

        // Grab values for logic
        let transport = transportMap[city] || 0;

        // Dynamic GPS values for submission
        if (city === 'GPS') {
            const dist = parseFloat(calcDistInput.value);
            const lat = userLatInput.value;
            const long = userLongInput.value;

            if (lat && long) {
                // Append Map Link to Address
                address += `\n📍 *Peta Lokasi:* https://www.google.com/maps?q=${lat},${long}`;
            }

            if (!isNaN(dist)) {
                transport = 15000 + (dist * 2500);
                transport = Math.ceil(transport / 100) * 100;
            }
        }

        // Use global baseService logic re-calculation or assume default 150k / 0 for Seikhlasnya
        // For simplicity reusing the check:
        let currentBase = 150000;
        if (serviceType.includes('Install Ulang')) currentBase = 0;

        const total = currentBase + transport;

        // Tracking Link (Real Local Link)
        // In production, this would be a real domain. For now, we assume relative path works if they open it on same device,
        // or we just mock it properly.
        const trackingId = `HW-${Math.floor(Math.random() * 1000)}`;
        const trackingLink = `${window.location.origin}/tracking.html?id=${trackingId}`;

        const waNumber = '6282138004443';
        const message = `Halo SatuJalan, saya ingin booking service:
        
📋 *FORM BOOKING HARDWARE*
--------------------------------
🔧 *Layanan:* ${serviceType}
💻 *Device/Masalah:* ${deviceType}
🏙️ *Kota/Mode:* ${city}
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
    // --- ENVATO DOWNLOAD LOGIC ---

    // 1. Sliding Text Animation
    const subtitleText = document.getElementById('subtitle-text');
    const messages = [
        "Instal ulang Windows dengan biaya <span class='highlight'>Seiklasnya</span>. Didukung solusi teknis menyeluruh dari hardware hingga software, tanpa ribet—kami datang ke lokasi Anda.",
        "Harga <span class='highlight'>mulai 10k untuk download di Envato</span>. Dapatkan aset premium dengan harga terjangkau!",
        "Pembuatan <span class='highlight'>web mulai dari 700 ribu</span>, Anda sudah memiliki web pribadi untuk menunjang value Anda."
    ];
    let msgIndex = 0;

    if (subtitleText) {
        setInterval(() => {
            // Slide Out
            subtitleText.classList.add('text-slide-out');

            setTimeout(() => {
                // Change Text
                msgIndex = (msgIndex + 1) % messages.length;
                subtitleText.innerHTML = messages[msgIndex];

                // Prepare for Slide In (Move to start position)
                subtitleText.classList.remove('text-slide-out');
                subtitleText.classList.add('text-slide-in');

                // Trigger Reflow to restart animation
                void subtitleText.offsetWidth;

                // Slide In (Move to natural position)
                subtitleText.classList.remove('text-slide-in');
            }, 500); // Wait for slide-out transition
        }, 5000); // Every 5 seconds
    }

    // 2. Download Modal
    const downloadModal = document.getElementById('downloadModal');
    const downloadBtn = document.getElementById('btn-download');
    const closeDownBtn = document.querySelector('.close-download');

    if (downloadBtn) {
        downloadBtn.addEventListener('click', (e) => {
            e.preventDefault();
            downloadModal.classList.add('show');
        });
    }

    if (closeDownBtn) {
        closeDownBtn.addEventListener('click', () => {
            downloadModal.classList.remove('show');
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === downloadModal) downloadModal.classList.remove('show');
    });

    // 3. Download Form Submission
    const downloadForm = document.getElementById('downloadForm');
    if (downloadForm) {
        downloadForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const link = document.getElementById('envatoLink').value;
            const payment = document.querySelector('input[name="dlPayment"]:checked').value;

            const waNumber = '6282138004443';
            const message = `Halo SatuJalan, saya mau Request Download File Envato:
            
📥 *REQUEST DOWNLOAD ENVATO*
--------------------------------
🔗 *Link:* ${link}
💳 *Metode Bayar:* ${payment}
💰 *Harga:* Mulai Rp 10.000 / File

Mohon diproses, terima kasih.`;

            window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`, '_blank');
            downloadModal.classList.remove('show');
        });
    }

    // --- DYNAMIC LOGO MARQUEE (SEPARATED) ---

    const initMarquee = (containerId, logoList, folderName) => {
        const container = document.getElementById(containerId);
        if (!container) return;

        // Create objects
        const logos = logoList.map(filename => ({
            src: `${folderName}/${filename}`,
            alt: filename.replace('.png', '')
        }));

        // Helper to create img
        const createLogo = (logo) => {
            const img = document.createElement('img');
            img.src = logo.src;
            img.alt = logo.alt;
            img.className = 'logo-item';
            return img;
        };

        // Populate (Need enough duplicates for smooth infinite scroll)
        // For visual density, we want at least 20-30 items
        const minItems = 20;
        const iterations = Math.ceil(minItems / logos.length);

        for (let i = 0; i < iterations; i++) {
            logos.forEach(logo => {
                container.appendChild(createLogo(logo));
            });
        }
    };

    // 1. Brand Logos (Hardware) -> Scroll Left
    const brandLogos = [
        'logo acer.png', 'logo asus.png', 'logo dell.png',
        'logo hp.png', 'logo iphone.png', 'logo lenovo.png',
        'logo predator.png'
    ];
    initMarquee('brand-marquee', brandLogos, 'logo brend');

    // 2. Code Logos (Software) -> Scroll Right
    const codeLogos = [
        'logo html.png', 'logo js.png', 'logo microsoft .net.png',
        'logo php.png', 'logo python.png', 'logo react js.png',
        'logo vs code.png'
    ];
    initMarquee('code-marquee', codeLogos, 'logo code');

    // --- LANGUAGE SWITCHER ---
    const langToggle = document.getElementById('lang-toggle');
    let currentLang = 'id'; // Default

    const translations = {
        // Navbar
        'nav-home': { id: 'Beranda', en: 'Home' },
        'nav-hardware': { id: 'Hardware', en: 'Hardware' },
        'nav-software': { id: 'Software', en: 'Software' },
        'nav-coverage': { id: 'Area Layanan', en: 'Coverage' },
        'nav-portfolio': { id: 'Portofolio', en: 'Portfolio' },
        'nav-contact': { id: 'Hubungi Kami', en: 'Contact Us' },

        // Hero
        'hero-badge': { id: '🚀 Layanan 24 Jam Jabodetabek', en: '🚀 24/7 Service Jabodetabek' },
        'hero-title': { id: 'Satu Jalan, <span class="gradient-text">Semua Solusi</span>', en: 'One Way, <span class="gradient-text">All Solutions</span>' },
        'btn-hardware': { id: 'Servis Hardware', en: 'Hardware Repair' },
        'btn-software': { id: 'Buat Software', en: 'Create Software' },
        'btn-download': { id: 'Jasa Download', en: 'Download Service' },
        'stat-ready': { id: 'Siap Panggil', en: 'Ready to Call' },
        'stat-eta': { id: 'Estimasi Tiba', en: 'ETA Arrival' },
        'stat-rating': { id: 'Rating Teknisi', en: 'Tech Rating' },

        // Sections
        'hw-title': { id: 'Solusi <span class="highlight-blue">Hardware</span>', en: '<span class="highlight-blue">Hardware</span> Solutions' },
        'hw-desc': { id: 'Teknisi profesional kami datang langsung ke rumah atau kantor Anda.', en: 'Our professional technicians come directly to your home or office.' },

        'sw-title': { id: 'Solusi <span class="highlight-purple">Software</span>', en: '<span class="highlight-purple">Software</span> Solutions' },
        'sw-desc': { id: 'Transformasi ide bisnis Anda menjadi produk digital modern.', en: 'Transform your business ideas into modern digital products.' },

        'testimoni-tag': { id: 'APA KATA MEREKA?', en: 'WHAT THEY SAY?' },
        'testimoni-title': { id: 'Testimoni <span class="highlight">Pelanggan</span>', en: 'Customer <span class="highlight">Testimonials</span>' },
        'testimoni-desc': { id: 'Pengalaman nyata dari klien yang telah menggunakan jasa SatuJalan.', en: 'Real experiences from clients who have used SatuJalan services.' },

        'cov-title': { id: 'Area Layanan Kami', en: 'Our Service Area' },
        'cov-desc': { id: 'Kami melayani panggilan ke seluruh wilayah <strong>JABODETABEK</strong> dengan perhitungan biaya transport yang transparan.', en: 'We serve calls throughout <strong>JABODETABEK</strong> with transparent transport cost calculation.' },

        'cta-title': { id: 'Butuh Bantuan Sekarang?', en: 'Need Help Now?' },
        'cta-desc': { id: 'Teknisi kami siap meluncur ke lokasi Anda.', en: 'Our technicians are ready to dispatch to your location.' },
        'cta-btn': { id: 'Chat WhatsApp Sekarang', en: 'Chat WhatsApp Now' },

        // Portfolio
        'port-tag': { id: 'PORTFOLIO', en: 'PORTFOLIO' },
        'port-title': { id: 'Portofolio <span class="highlight-blue">Unggulan</span>', en: 'Featured <span class="highlight-blue">Portfolio</span>' },
        'port-desc': { id: 'Bukti nyata dedikasi kami dalam menghadirkan solusi digital berkualitas tinggi.', en: 'Real proof of our dedication in delivering high-quality digital solutions.' }
    };

    if (langToggle) {
        langToggle.addEventListener('click', () => {
            // Toggle State
            currentLang = currentLang === 'id' ? 'en' : 'id';

            // Update Button
            langToggle.textContent = currentLang === 'id' ? '🇺🇸 EN' : '🇮🇩 ID';

            // Update Text
            const elements = document.querySelectorAll('[data-lang]');
            elements.forEach(el => {
                const key = el.getAttribute('data-lang');
                if (translations[key]) {
                    // Check if content has HTML
                    if (translations[key][currentLang].includes('<')) {
                        el.innerHTML = translations[key][currentLang];
                    } else {
                        el.textContent = translations[key][currentLang];
                    }
                }
            });
        });
    }


    // --- TESTIMONIAL MARQUEE LOGIC ---
    // --- TESTIMONIAL SLIDER LOGIC (Auto-Scroll + Swipe) ---
    const testimonialTrack = document.getElementById('testimonial-track');
    if (testimonialTrack) {
        // Clone items for infinite scroll effect
        const items = testimonialTrack.innerHTML;
        testimonialTrack.innerHTML = items + items;

        let scrollAmount = 0;
        let scrollSpeed = 1; // Pixels per tick
        let isPaused = false;
        let autoScroll;

        const startAutoScroll = () => {
            autoScroll = setInterval(() => {
                if (!isPaused) {
                    testimonialTrack.scrollLeft += scrollSpeed;

                    // Infinite Loop Logic
                    // If we scrolled past half the width (original content width), reset to 0
                    if (testimonialTrack.scrollLeft >= (testimonialTrack.scrollWidth / 2)) {
                        testimonialTrack.scrollLeft = 0;
                    }
                }
            }, 20); // 50fps
        };

        // Initialize
        startAutoScroll();

        // Pause on Hover / Touch
        testimonialTrack.addEventListener('mouseenter', () => isPaused = true);
        testimonialTrack.addEventListener('mouseleave', () => isPaused = false);
        testimonialTrack.addEventListener('touchstart', () => isPaused = true);
        testimonialTrack.addEventListener('touchend', () => {
            setTimeout(() => isPaused = false, 1000); // Wait a bit before resuming
        });

        // Optional: Manual Drag (Mouse)
        let isDown = false;
        let startX;
        let scrollLeft;

        testimonialTrack.addEventListener('mousedown', (e) => {
            isPaused = true;
            isDown = true;
            testimonialTrack.classList.add('active'); // Add grabbing cursor class if valid
            startX = e.pageX - testimonialTrack.offsetLeft;
            scrollLeft = testimonialTrack.scrollLeft;
        });

        testimonialTrack.addEventListener('mouseleave', () => {
            isDown = false;
            isPaused = false;
            testimonialTrack.classList.remove('active');
        });

        testimonialTrack.addEventListener('mouseup', () => {
            isDown = false;
            isPaused = false; // Will be handled by mouseleave usually, but good fallback
            testimonialTrack.classList.remove('active');
        });

        testimonialTrack.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - testimonialTrack.offsetLeft;
            const walk = (x - startX) * 2; // Scroll-fast
            testimonialTrack.scrollLeft = scrollLeft - walk;
        });
    }

    // --- PORTFOLIO LOGIC ---

    // 1. Filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active to click
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.classList.remove('hide');
                    item.classList.add('show');
                } else {
                    item.classList.remove('show');
                    item.classList.add('hide');
                }
            });
        });
    });

    // 2. Lightbox
    const portfolioModal = document.getElementById('portfolioModal');
    const lightboxImg = document.getElementById('lightboxImg');
    const captionText = document.getElementById('caption');
    const closeLightbox = document.querySelector('.close-lightbox');

    portfolioItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            const h4 = item.querySelector('h4');
            const p = item.querySelector('p');

            portfolioModal.style.display = "block";
            lightboxImg.src = img.src;
            captionText.innerHTML = `<strong>${h4.innerText}</strong><br>${p.innerText}`;
        });
    });

    if (closeLightbox) {
        closeLightbox.addEventListener('click', () => {
            portfolioModal.style.display = "none";
        });
    }

    // Close lightbox when clicking outside image
    if (portfolioModal) {
        portfolioModal.addEventListener('click', (e) => {
            if (e.target === portfolioModal) {
                portfolioModal.style.display = "none";
            }
        });
    }


    // --- ADVANCED PRICING TOGGLE ---
    const toggleAdvancedBtn = document.getElementById('toggle-advanced-btn');
    const advancedGrid = document.getElementById('advanced-pricing-grid');

    if (toggleAdvancedBtn && advancedGrid) {
        toggleAdvancedBtn.addEventListener('click', () => {
            // Check current visual state
            const isHidden = window.getComputedStyle(advancedGrid).display === 'none';

            if (isHidden) {
                // Show
                advancedGrid.style.display = 'grid';
                // Trigger reflow for transition
                void advancedGrid.offsetWidth;

                advancedGrid.classList.remove('advanced-hidden');
                advancedGrid.classList.add('advanced-visible');

                // Update Button
                toggleAdvancedBtn.innerHTML = '<i class="fas fa-chevron-up"></i> Tampilkan Lebih Sedikit';
            } else {
                // Hide
                advancedGrid.classList.remove('advanced-visible');
                // Re-add hidden class for opacity transition
                advancedGrid.classList.add('advanced-hidden');

                // Wait for transition (0.5s) then hide display
                setTimeout(() => {
                    advancedGrid.style.display = 'none';
                }, 500);

                // Update Button
                toggleAdvancedBtn.innerHTML = '<i class="fas fa-chevron-down"></i> Lihat Paket Lanjutan';
            }
        });
    }

});

// --- CHAT WIDGET LOGIC ---
document.addEventListener('DOMContentLoaded', () => {
    const chatBox = document.getElementById('chatBox');
    const toggleChat = document.getElementById('toggleChat');
    const closeChat = document.getElementById('closeChat');
    const chatInput = document.getElementById('chatInput');
    const sendMessage = document.getElementById('sendMessage');
    const chatMessages = document.getElementById('chatMessages');

    if (toggleChat) {
        toggleChat.addEventListener('click', () => {
            chatBox.classList.add('active');
            toggleChat.style.display = 'none'; // Hide button when open
            chatInput.focus();
        });
    }

    if (closeChat) {
        closeChat.addEventListener('click', () => {
            chatBox.classList.remove('active');
            setTimeout(() => {
                toggleChat.style.display = 'flex'; // Show button when closed
            }, 300);
        });
    }

    // Send Message Logic
    async function sendUserMessage() {
        const text = chatInput.value.trim();
        if (!text) return;

        // 1. Add User Message
        addMessage(text, 'user-message');
        chatInput.value = '';

        // 2. Show Loading
        const loadingId = addMessage('...', 'bot-message', true);

        try {
            // 3. Call Local API
            const response = await fetch('http://localhost:5000/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text })
            });

            const data = await response.json();

            // 4. Update with Bot Reply
            updateMessage(loadingId, data.reply || "Maaf, tidak ada respon.");

        } catch (error) {
            console.error('Chat Error:', error);
            const errorMsg = `
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    <span>⚠️ <b>Sistem AI Offline</b></span>
                    <span style="font-size: 0.85rem; opacity: 0.8;">Maaf, server AI sedang tidak aktif. Hubungi admin langsung:</span>
                    <div style="background: rgba(37, 211, 102, 0.1); border: 1px solid #25d366; padding: 8px; border-radius: 8px; margin-top: 5px;">
                        <span style="display: block; font-weight: bold; color: #25d366; margin-bottom: 5px;"><i class="fab fa-whatsapp"></i> 0821-3800-4443</span>
                        <a href="https://wa.me/6282138004443?text=Assalammualaikum%0ANama%20%3A%0ASaya%20mau%20bertanya%20perihal..." target="_blank" style="display: inline-block; background: #25d366; color: white; padding: 4px 10px; border-radius: 4px; text-decoration: none; font-size: 0.8rem;">Chat Sekarang</a>
                    </div>
                </div>
            `;
            updateMessage(loadingId, errorMsg);
        }
    }

    function addMessage(text, className, isLoading = false) {
        const div = document.createElement('div');
        div.classList.add('message', className);
        div.innerHTML = text; // Changed to innerHTML for formatting
        if (isLoading) div.id = 'msg-' + Date.now();

        chatMessages.appendChild(div);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return div.id;
    }

    function updateMessage(id, newText) {
        const msgDiv = document.getElementById(id);
        if (msgDiv) {
            msgDiv.innerHTML = newText; // Changed to innerHTML for formatting
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }

    if (sendMessage) {
        sendMessage.addEventListener('click', sendUserMessage);
    }

    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendUserMessage();
        });
    }
});
