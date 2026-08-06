/*=========================================
Dark Mode + RTL Mode
=========================================*/

(function () {

    if (window.__melodyHouseThemeControlsInitialized) return;
    window.__melodyHouseThemeControlsInitialized = true;

    const DARK_MODE_KEY = "mh-dark-mode";
    const RTL_MODE_KEY = "mh-rtl-mode";
    const DARK_TOGGLE_SELECTOR = ".dark-toggle, .dark-mode-toggle";
    const RTL_TOGGLE_SELECTOR = ".rtl-toggle";
    const HEADER_LOGO_SELECTOR = ".logo img, .mh-quoteheader-logo img, .mh-loginpage-logo img, .mh-registerpage-logo img";
    const DARK_LOGO_SRC = "images/logo-light.png";
    const LIGHT_LOGO_SRC = "images/logo.png";
    const BRAND_LOGO_SELECTOR = ".mh-brand-item img, .mh-brand-logo img";
    const BRAND_LOGO_SRC_MAP = {
        "yamaha-logo.png": "yamaha-logo-white.png",
        "roland-logo.png": "roland-logo-white.png",
        "fender-logo.png": "fender-logo-white.png",
        "casio-logo.png": "casio-logo-white.png",
        "korg-logo.png": "korg-logo-white.png",
        "gibson-logo.png": "gibson-logo-white.png",
        "ibanez-logo.png": "ibanez-logo-white.png",
        "pearl-logo.png": "pearl-logo-white.png"
    };
    const CTA_IMAGE_SELECTOR = ".mh-cta-wrapper img";
    const DARK_CTA_BACKGROUNDS = [
        { selector: ".mh-aboutcta-section", image: "images/about-cta-bg.jpg" },
        { selector: ".mh-finalcta-section", image: "images/home2-cta-bg.jpg" },
        { selector: ".mh-instrumentcta-section", image: "images/instrument-cta.jpg" },
        { selector: ".mh-rentalcta-section", image: "images/rental-cta.jpg" }
    ];

    const root = document.documentElement;
    const pageBody = document.body;

    function readPreference(key) {

        try {

            return localStorage.getItem(key) === "true";

        } catch (error) {

            return false;

        }

    }

    function writePreference(key, value) {

        try {

            localStorage.setItem(key, String(value));

        } catch (error) {

            // Ignore storage failures so the rest of the site keeps working.

        }

    }

    function syncDarkMode(enabled) {

        root.setAttribute("data-theme", enabled ? "dark" : "light");

        if (pageBody) {

            pageBody.setAttribute("data-theme", enabled ? "dark" : "light");

        }

        document.querySelectorAll(DARK_TOGGLE_SELECTOR).forEach(button => {

            button.setAttribute("aria-pressed", String(enabled));

            const icon = button.querySelector("i");

            if (!icon) return;

            icon.classList.toggle("fa-moon", !enabled);
            icon.classList.toggle("fa-sun", enabled);

        });

        document.querySelectorAll(HEADER_LOGO_SELECTOR).forEach(logo => {

            logo.src = enabled ? DARK_LOGO_SRC : LIGHT_LOGO_SRC;

        });

        updateBrandLogos(enabled);

    }

    function updateBrandLogos(isDark) {

        document.querySelectorAll(BRAND_LOGO_SELECTOR).forEach(image => {

            if (!image.dataset.brandOriginalSrc) {
                image.dataset.brandOriginalSrc = image.getAttribute("src");
            }

            const originalSrc = image.dataset.brandOriginalSrc;
            const fileName = originalSrc.split("/").pop().split("?")[0];
            const whiteFileName = BRAND_LOGO_SRC_MAP[fileName];

            if (!whiteFileName) return;

            image.src = isDark ? `images/${whiteFileName}` : originalSrc;

        });

    }

    function syncRtlMode(enabled) {

        root.setAttribute("dir", enabled ? "rtl" : "ltr");

        if (pageBody) {

            pageBody.setAttribute("dir", enabled ? "rtl" : "ltr");

        }

        document.querySelectorAll(RTL_TOGGLE_SELECTOR).forEach(button => {

            button.setAttribute("aria-pressed", String(enabled));

            const icon = button.querySelector("i");

            if (!icon) return;

            icon.classList.remove("fa-left-right");
            icon.classList.add("fa-right-left");

        });

    }

    function syncDarkCtaBackgrounds(enabled) {

        DARK_CTA_BACKGROUNDS.forEach(({ selector, image }) => {

            document.querySelectorAll(selector).forEach(section => {

                if (enabled) {

                    section.style.backgroundImage = `url("${image}")`;

                } else {

                    section.style.removeProperty("background-image");

                }

            });

        });

    }

    function syncDarkCtaMotion(enabled) {

        document.querySelectorAll(CTA_IMAGE_SELECTOR).forEach(image => {

            if (enabled) {

                image.style.transition = "none";

            } else {

                image.style.removeProperty("transition");

            }

        });

    }

    function applySavedPreferences() {

        syncDarkMode(readPreference(DARK_MODE_KEY));
        syncRtlMode(readPreference(RTL_MODE_KEY));
        syncDarkCtaBackgrounds(readPreference(DARK_MODE_KEY));
        syncDarkCtaMotion(readPreference(DARK_MODE_KEY));

    }

    applySavedPreferences();

    document.addEventListener("click", (event) => {

        const darkButton = event.target.closest(DARK_TOGGLE_SELECTOR);
        const rtlButton = event.target.closest(RTL_TOGGLE_SELECTOR);

        if (!darkButton && !rtlButton) return;

        event.preventDefault();

        if (darkButton) {

            const nextValue = root.getAttribute("data-theme") !== "dark";
            writePreference(DARK_MODE_KEY, nextValue);
            syncDarkMode(nextValue);
            syncDarkCtaBackgrounds(nextValue);
            syncDarkCtaMotion(nextValue);

        }

        if (rtlButton) {

            const nextValue = root.getAttribute("dir") !== "rtl";
            writePreference(RTL_MODE_KEY, nextValue);
            syncRtlMode(nextValue);

        }

    });

    window.addEventListener("pageshow", applySavedPreferences);

    window.addEventListener("storage", (event) => {

        if (event.key === DARK_MODE_KEY) {

            const enabled = event.newValue === "true";
            syncDarkMode(enabled);
            syncDarkCtaBackgrounds(enabled);
            syncDarkCtaMotion(enabled);

        }

        if (event.key === RTL_MODE_KEY) {

            syncRtlMode(event.newValue === "true");

        }

    });

})();

/*=========================================
Mobile Menu
=========================================*/

const menuToggle = document.querySelector(".menu-toggle");

const menuClose = document.querySelector(".menu-close");

const navMenu = document.querySelector(".nav-menu");
const overlay = document.querySelector(".menu-overlay");

function closeMobileMenu() {

    navMenu?.classList.remove("active");
    overlay?.classList.remove("active");

    if (window.innerWidth <= 1199) {

        dropdownToggles.forEach(dt => dt.parentElement.classList.remove("active"));

    }

}

if (menuToggle && navMenu) {

    menuToggle.addEventListener("click", () => {

        navMenu.classList.add("active");
        overlay?.classList.add("active");

    });

}

if (menuClose && navMenu) {

    menuClose.addEventListener("click", () => {

        closeMobileMenu();

    });

}

/*=========================================
Close Menu On Navigation Click
=========================================*/

const navLinks = document.querySelectorAll(".nav-links a:not(.dropdown-toggle)");

navLinks.forEach(link => {

    link.addEventListener("click", () => {

        if (window.innerWidth <= 1199) {

            closeMobileMenu();

        }

    });

});

/*=========================================
Mobile Dropdown
=========================================*/

const dropdownToggles = document.querySelectorAll(".dropdown-toggle");

dropdownToggles.forEach(toggle => {

    toggle.addEventListener("click", function (e) {

        if (window.innerWidth <= 1199) {

            e.preventDefault();

            e.stopPropagation();

            this.parentElement.classList.toggle("active");

        }

    });

});

/*=========================================
Close Menu Outside Click
=========================================*/

document.addEventListener("click", (e) => {

    if (window.innerWidth <= 1199) {

        if (

            navMenu && menuToggle &&

            !navMenu.contains(e.target)

            &&

            !menuToggle.contains(e.target)

        ) {

            closeMobileMenu();

        }

    }

});

/*=========================================
Close Menu On Resize
=========================================*/

window.addEventListener("resize", () => {

    if (window.innerWidth > 1199) {

        closeMobileMenu();

    }

});

/*=========================================
Close Menu With ESC
=========================================*/

document.addEventListener("keydown", (e) => {

    if (e.key === "Escape") {

        closeMobileMenu();

    }

});

/*=========================================
Sticky Header
=========================================*/

const header = document.querySelector(".header");

window.addEventListener("scroll", () => {

    if (window.scrollY > 80) {

        if (header) header.classList.add("sticky");

    }

    else {

        if (header) header.classList.remove("sticky");

    }

});

if (overlay && navMenu) {

    overlay.addEventListener("click", () => {

        closeMobileMenu();

    });

}

/*=========================================
Hero Slider
=========================================*/

const heroSlides = document.querySelectorAll(".hero-slide");

const heroDots = document.querySelectorAll(".hero-dot");

let currentSlide = 0;

function showSlide(index) {

    heroSlides.forEach((slide) => {

        slide.classList.remove("active");

    });

    heroDots.forEach((dot) => {

        dot.classList.remove("active");

    });

    heroSlides[index].classList.add("active");

    heroDots[index].classList.add("active");

    scheduleHeroAnimationLock(heroSlides[index]);

}

const HERO_ANIMATION_LOCK_MS = 900;

function scheduleHeroAnimationLock(slide) {

    if (!slide || slide.dataset.heroAnimated === "true" || slide.dataset.heroAnimationPending === "true") {

        return;

    }

    slide.dataset.heroAnimationPending = "true";

    window.setTimeout(() => {

        slide.dataset.heroAnimated = "true";
        delete slide.dataset.heroAnimationPending;

    }, HERO_ANIMATION_LOCK_MS);

}

if (heroSlides.length) {

    const activeHeroSlide = document.querySelector(".hero-slide.active") || heroSlides[0];

    scheduleHeroAnimationLock(activeHeroSlide);

}

/*=========================================
Pagination Click
=========================================*/

heroDots.forEach((dot, index) => {

    dot.addEventListener("click", () => {

        currentSlide = index;

        showSlide(currentSlide);

    });

});

/*=========================================
Auto Slide
=========================================*/

setInterval(() => {

    currentSlide++;

    if (currentSlide >= heroSlides.length) {

        currentSlide = 0;

    }

    showSlide(currentSlide);

}, 6000);



/*=========================================
Password Eye Toggle
=========================================*/

function passwordToggle(inputId, toggleId) {

    const passwordInput = document.getElementById(inputId);
    const passwordToggle = document.getElementById(toggleId);

    if (!passwordInput || !passwordToggle) return;

    passwordToggle.addEventListener("click", function () {

        const icon = this.querySelector("i");

        if (passwordInput.type === "password") {

            passwordInput.type = "text";

            icon.classList.remove("fa-eye");
            icon.classList.add("fa-eye-slash");

        } else {

            passwordInput.type = "password";

            icon.classList.remove("fa-eye-slash");
            icon.classList.add("fa-eye");

        }

    });

}

/*=========================================
Initialize
=========================================*/

passwordToggle("loginPassword", "loginPasswordToggle");

passwordToggle("registerPassword", "registerPasswordToggle");

passwordToggle("registerConfirmPassword", "registerConfirmPasswordToggle");

/*=========================================
Premium FAQ
=========================================*/

const faqItems = document.querySelectorAll(".mh-premiumfaq-item");

faqItems.forEach(item => {

    const button = item.querySelector(".mh-premiumfaq-question");

    button.addEventListener("click", () => {

        faqItems.forEach(faq => {

            if (faq !== item) {

                faq.classList.remove("active");

            }

        });

        item.classList.toggle("active");

    });

});

/*=========================================
Featured Collection Tabs
=========================================*/

const collectionData = {

    guitar: {

        image: "images/tab-guitar.jpg",

        category: "Premium Collection",

        title: "Signature Guitars",

        description: "Discover handcrafted acoustic and electric guitars with exceptional sound quality and premium finishes.",

        features: [
            "Premium Wood Finish",
            "Professional Performance",
            "International Brands",
            "Warranty Included"
        ],

        miniImages: [
            "images/guitar-1.jpg",
            "images/guitar-2.jpg",
            "images/guitar-3.jpg"
        ],

        miniTitles: [
            "Acoustic Series",
            "Electric Series",
            "Limited Edition"
        ]

    },

    piano: {

        image: "images/tab-piano.jpg",

        category: "Luxury Collection",

        title: "Grand Pianos",

        description: "Elegant grand and upright pianos crafted for concert performance and timeless musical expression.",

        features: [
            "Rich Natural Tone",
            "Premium Keys",
            "Concert Quality",
            "Long Warranty"
        ],

        miniImages: [
            "images/piano-1.jpg",
            "images/piano-2.jpg",
            "images/piano-3.jpg"
        ],

        miniTitles: [
            "Grand Piano",
            "Digital Piano",
            "Upright Piano"
        ]

    },

    violin: {

        image: "images/tab-violin.jpg",

        category: "Classic Collection",

        title: "Orchestra Strings",

        description: "Premium violins, violas and cellos carefully selected for orchestras and solo performances.",

        features: [
            "Handcrafted",
            "Professional Setup",
            "Premium Wood",
            "Protective Case"
        ],

        miniImages: [
            "images/violin-1.jpg",
            "images/violin-2.jpg",
            "images/violin-3.jpg"
        ],

        miniTitles: [
            "Violins",
            "Violas",
            "Cellos"
        ]

    },

    studio: {

        image: "images/tab-studio.jpg",

        category: "Studio Collection",

        title: "Studio Equipment",

        description: "Everything you need for recording, production and live performances in one premium collection.",

        features: [
            "Professional Audio",
            "Studio Monitors",
            "Recording Gear",
            "Premium Accessories"
        ],

        miniImages: [
            "images/studio-1.jpg",
            "images/studio-2.jpg",
            "images/studio-3.jpg"
        ],

        miniTitles: [
            "Microphones",
            "Mixers",
            "Studio Monitors"
        ]

    }

};

const tabButtons = document.querySelectorAll(".mh-tabcollection-btn");

tabButtons.forEach(button => {

    button.addEventListener("click", () => {

        tabButtons.forEach(btn => btn.classList.remove("active"));

        button.classList.add("active");

        const tab = collectionData[button.dataset.tab];

        document.getElementById("mhTabCollectionImage").src = tab.image;

        document.getElementById("mhTabCollectionCategory").textContent = tab.category;

        document.getElementById("mhTabCollectionTitle").textContent = tab.title;

        document.getElementById("mhTabCollectionDescription").textContent = tab.description;

        const featureList = document.querySelector(".mh-tabcollection-features");

        featureList.innerHTML = "";

        tab.features.forEach(feature => {

            featureList.innerHTML += `<li>${feature}</li>`;

        });

        document.getElementById("mhMiniImage1").src = tab.miniImages[0];
        document.getElementById("mhMiniImage2").src = tab.miniImages[1];
        document.getElementById("mhMiniImage3").src = tab.miniImages[2];

        document.getElementById("mhMiniTitle1").textContent = tab.miniTitles[0];
        document.getElementById("mhMiniTitle2").textContent = tab.miniTitles[1];
        document.getElementById("mhMiniTitle3").textContent = tab.miniTitles[2];

    });

});


/*=========================================
    Instrument Search + Filter + Sort
=========================================*/

const filterButtons = document.querySelectorAll(".mh-filter-btn");
const productGrid = document.querySelector(".mh-instrumentcatalog-grid");
const productCards = Array.from(document.querySelectorAll(".mh-instrumentcatalog-card"));
const searchInput = document.getElementById("mhInstrumentSearch");
const sortSelect = document.getElementById("mhInstrumentSort");
const resultCounter = document.querySelector(".mh-instrumentcatalog-results");
const popularChips = document.querySelectorAll(".mh-popular-chip");

let activeCategory = "all";

/*=========================================
Render Products
=========================================*/

function renderProducts() {

    const searchTerm = searchInput ? searchInput.value.trim() : "";
    const searchValue = searchTerm.toLowerCase();

    const noResult = document.querySelector(".mh-no-results");

    let filteredCards = productCards.filter(card => {

        const category = card.dataset.category.toLowerCase();

        const text = card.textContent.toLowerCase();

        return (
            (activeCategory === "all" || category === activeCategory) &&
            text.includes(searchValue)
        );

    });

    /*=========================
    Sort
    =========================*/

    if (sortSelect.value === "az") {

        filteredCards.sort((a, b) => {

            return a.querySelector("h3").textContent.localeCompare(
                b.querySelector("h3").textContent
            );

        });

    }

    if (sortSelect.value === "popular") {

        filteredCards.reverse();

    }

    /*=========================
    Hide Animation
    =========================*/

    productCards.forEach(card => {

        card.classList.add("hide");
        card.classList.remove("show");

    });

    setTimeout(() => {

        productGrid.innerHTML = "";

        /*=========================
        Products
        =========================*/

        if (filteredCards.length > 0) {

            productGrid.style.display = "grid";

            if (noResult) {

                noResult.style.display = "none";

            }

            filteredCards.forEach(card => {

                productGrid.appendChild(card);

                requestAnimationFrame(() => {

                    card.classList.remove("hide");
                    card.classList.add("show");

                });

            });

        }

        /*=========================
        No Result
        =========================*/

        else {

            productGrid.style.display = "none";

            if (noResult) {

                noResult.style.display = "flex";

            }

        }

        /*=========================
        Result Counter
        =========================*/

        if (resultCounter) {

            resultCounter.textContent = searchTerm
                ? `Showing ${filteredCards.length} ${filteredCards.length === 1 ? "Result" : "Results"} for "${searchTerm}"`
                : `Showing ${filteredCards.length} Premium ${filteredCards.length === 1 ? "Instrument" : "Instruments"}`;

            resultCounter.classList.toggle("is-empty", filteredCards.length === 0);

        }

    }, 250);

}

/*=========================================
Filter Buttons
=========================================*/

filterButtons.forEach(button => {

    button.addEventListener("click", function () {

        filterButtons.forEach(btn => {

            btn.classList.remove("active");

        });

        this.classList.add("active");

        activeCategory = this.dataset.filter;

        renderProducts();

    });

});

/*=========================================
Search
=========================================*/

if (searchInput) searchInput.addEventListener("input", renderProducts);

/*=========================================
Popular Search Chips
=========================================*/

popularChips.forEach(chip => {

    chip.addEventListener("click", function () {

        if (!searchInput) return;

        searchInput.value = this.dataset.popularSearch || "";
        searchInput.dispatchEvent(new Event("input", { bubbles: true }));
        searchInput.focus();

    });

});

/*=========================================
Sort
=========================================*/

if (sortSelect) sortSelect.addEventListener("change", renderProducts);

/*=========================================
Initial Load
=========================================*/

if (productGrid) renderProducts();


/*=========================================
Rental FAQ Accordion
=========================================*/

const rentalFaqItems = document.querySelectorAll(".mh-rentalfaq-item");

rentalFaqItems.forEach(item => {

    const button = item.querySelector(".mh-rentalfaq-question");

    button.addEventListener("click", () => {

        rentalFaqItems.forEach(faq => {

            if (faq !== item) {

                faq.classList.remove("active");

            }

        });

        item.classList.toggle("active");

    });

});

/*=========================================
Scroll Reveal + Counter Animations
=========================================*/

(function () {

    if (window.__melodyHouseRevealInitialized) return;

    window.__melodyHouseRevealInitialized = true;

    const root = document.documentElement;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const supportsObserver = typeof IntersectionObserver !== "undefined";
    const revealQueue = new Set();
    const counterQueue = new Set();
    const defaultRevealDuration = 800;
    const revealThreshold = prefersReducedMotion ? 0 : 0.18;

    root.classList.add("mh-scroll-animations");

    const revealObserver = !prefersReducedMotion && supportsObserver
        ? new IntersectionObserver((entries, observer) => {

            entries.forEach(entry => {

                if (!entry.isIntersecting) return;

                entry.target.classList.add("mh-reveal-visible");
                observer.unobserve(entry.target);

            });

        }, {
            threshold: revealThreshold,
            rootMargin: "0px 0px -8% 0px"
        })
        : null;

    const counterObserver = !prefersReducedMotion && supportsObserver
        ? new IntersectionObserver((entries, observer) => {

            entries.forEach(entry => {

                if (!entry.isIntersecting) return;

                animateCounter(entry.target);
                observer.unobserve(entry.target);

            });

        }, {
            threshold: 0.35,
            rootMargin: "0px 0px -10% 0px"
        })
        : null;

    function registerReveal(element, options = {}) {

        if (!element || revealQueue.has(element)) return;

        revealQueue.add(element);

        const variant = options.variant || "up";
        let delay = Math.max(0, options.delay || 0);

        let duration = options.duration || defaultRevealDuration;

        // Speed up reveal for the last 8 cards inside the instrument catalog grid.
        try {
            const parent = element.parentElement;
            if (parent && parent.matches('.mh-instrumentcatalog-grid')) {
                const siblings = Array.from(parent.querySelectorAll('.mh-instrumentcatalog-card'));
                const idx = siblings.indexOf(element);
                if (idx >= 0 && (siblings.length - idx) <= 8) {
                    duration = 220; // faster reveal for last 8
                    // also cap delay so cards appear promptly when scrolled into view
                    delay = Math.min(delay, 40);
                }
            }
        } catch (e) {
            // ignore and fall back to default duration
        }

        // Clamp duration to a sensible range (200ms - 900ms)
        duration = Math.min(Math.max(duration, 200), 900);

        element.classList.add("mh-reveal", `mh-reveal-${variant}`);
        element.style.setProperty("--mh-reveal-delay", `${delay}ms`);
        element.style.setProperty("--mh-reveal-duration", `${duration}ms`);

        if (prefersReducedMotion || !revealObserver) {

            element.classList.add("mh-reveal-visible");

            return;

        }

        revealObserver.observe(element);

    }

    function revealContainerChildren(containerSelector, options = {}) {

        document.querySelectorAll(containerSelector).forEach(container => {

            Array.from(container.children).forEach((child, index) => {

                if (options.skip && child.matches(options.skip)) return;

                registerReveal(child, {
                    variant: options.variant || "up",
                    delay: (options.delay || 0) + (index * (options.stagger || 100)),
                    duration: options.duration || defaultRevealDuration
                });

            });

        });

    }

    function revealGridChildren(gridSelector, childSelector, options = {}) {

        document.querySelectorAll(gridSelector).forEach(grid => {

            const children = Array.from(grid.children).filter(child => child.matches(childSelector));

            children.forEach((child, index) => {

                registerReveal(child, {
                    variant: options.variant || "up",
                    delay: (options.delay || 0) + (index * (options.stagger || 100)),
                    duration: options.duration || defaultRevealDuration
                });

            });

        });

    }

    function revealSplitSection(wrapperSelector, firstSelector, secondSelector, firstVariant, secondVariant, duration = 850) {

        document.querySelectorAll(wrapperSelector).forEach(wrapper => {

            const first = wrapper.querySelector(firstSelector);
            const second = wrapper.querySelector(secondSelector);

            if (!first || !second) return;

            const firstBeforeSecond = !!(first.compareDocumentPosition(second) & Node.DOCUMENT_POSITION_FOLLOWING);

            if (firstBeforeSecond) {

                registerReveal(first, { variant: firstVariant, duration });
                registerReveal(second, { variant: secondVariant, duration });

            } else {

                registerReveal(first, { variant: secondVariant, duration });
                registerReveal(second, { variant: firstVariant, duration });

            }

        });

    }

    function animateCounter(element) {

        if (!element || element.dataset.counterAnimated === "true") return;

        element.dataset.counterAnimated = "true";

        const originalText = element.textContent.trim();
        const match = originalText.match(/^([0-9][0-9,]*?(?:\.[0-9]+)?)([KkMm]?)(.*)$/);

        if (!match) {

            return;

        }

        const startValue = 0;
        const targetValue = parseFloat(match[1].replace(/,/g, ""));
        const scaleSuffix = match[2] || "";
        const trailingSuffix = match[3] || "";
        const decimalPlaces = (match[1].split(".")[1] || "").length;
        const duration = 2300;
        const startTime = performance.now();

        function render(value) {

            const formatted = decimalPlaces > 0
                ? value.toFixed(decimalPlaces)
                : Math.round(value).toLocaleString("en-US");

            element.textContent = `${formatted}${scaleSuffix}${trailingSuffix}`;

        }

        function tick(now) {

            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const nextValue = startValue + ((targetValue - startValue) * eased);

            render(nextValue);

            if (progress < 1) {

                window.requestAnimationFrame(tick);

            } else {

                render(targetValue);

            }

        }

        render(startValue);
        window.requestAnimationFrame(tick);

    }

    const headerContainers = [
        ".mh-luxhero-content",
        ".mh-contacthero-content",
        ".mh-quoteintro-header",
        ".mh-category-header",
        ".mh-instrumentcatalog-header",
        ".mh-corevalues-header",
        ".mh-companyjourney-header",
        ".mh-whychoose-header",
        ".mh-achievement-header",
        ".mh-premiumfaq-content",
        ".mh-brand-header",
        ".mh-expgallery-header",
        ".mh-tabcollection-header",
        ".mh-journeyflow-header",
        ".mh-expertteam-header",
        ".mh-review-header",
        ".mh-rentalplans-header",
        ".mh-rentalprocess-header",
        ".mh-rentalbenefits-content",
        ".mh-rentalfaq-header",
        ".mh-purchasequote-content",
        ".mh-rentalquote-content",
        ".mh-schoolquote-content",
        ".mh-quotepromise-content",
        ".mh-loginpage-card",
        ".mh-registerpage-card",
        ".mh-brandstory-content",
        ".mh-promise-header",
        ".mh-aboutcta-wrapper",
        ".mh-cta-content",
        ".mh-instrumentcta-content",
        ".mh-finalcta-content",
        ".mh-repaircta-content",
        ".mh-rentalcta-content",
        ".mh-insightshowcase-header"
    ];

    headerContainers.forEach(selector => {

        revealContainerChildren(selector, { variant: "up", stagger: 120 });

    });

    const gridConfigs = [
        [".mh-category-grid", ".mh-category-card"],
        [".mh-corevalues-grid", ".mh-corevalues-card"],
        [".mh-companyjourney-timeline", ".mh-companyjourney-item"],
        [".mh-achievement-grid", ".mh-achievement-card"],
        [".mh-whychoose-content", ".mh-whychoose-item"],
        [".mh-expertteam-grid", ".mh-expertteam-card"],
        [".mh-premiumfaq-accordion", ".mh-premiumfaq-item"],
        [".mh-rentalfaq-wrapper", ".mh-rentalfaq-item"],
        [".mh-contactinfo-grid", ".mh-contactinfo-card"],
        [".mh-quoteintro-grid", ".mh-quoteintro-card"],
        [".mh-instrumentcatalog-grid", ".mh-instrumentcatalog-card"],
        [".mh-rentalplans-grid", ".mh-rentalplans-card"],
        [".mh-rentalprocess-timeline", ".mh-rentalprocess-step"],
        [".mh-rentalbenefits-list", ".mh-rentalbenefits-item"],
        [".mh-expgallery-grid", ".mh-expgallery-card"],
        [".mh-journeyflow-wrapper", ".mh-journeyflow-item"],
        [".mh-promise-grid", ".mh-promise-item"],
        [".mh-insightshowcase-grid", ".mh-insightshowcase-card"],
        [".mh-brand-grid", ".mh-brand-card"],
        [".mh-brand-track", ".mh-brand-item"],
        [".mh-review-grid", ".mh-review-card"],
        [".mh-luxhero-stats", ".mh-luxhero-stat"]
    ];

    gridConfigs.forEach(([gridSelector, childSelector]) => {

        revealGridChildren(gridSelector, childSelector, { variant: "up", stagger: 100 });

    });

    const splitConfigs = [
        [".mh-brandstory-wrapper", ".mh-brandstory-image", ".mh-brandstory-content", "right", "left", 850],
        [".mh-whychoose-wrapper", ".mh-whychoose-image", ".mh-whychoose-content", "right", "left", 850],
        [".mh-rentalbenefits-wrapper", ".mh-rentalbenefits-image", ".mh-rentalbenefits-content", "right", "left", 850],
        [".mh-contactform-layout", ".mh-contactform-panel", ".mh-locationmap-panel", "right", "left", 850],
        [".mh-purchasequote-layout", ".mh-purchasequote-content", ".mh-purchasequote-image", "left", "right", 850],
        [".mh-rentalquote-layout", ".mh-rentalquote-image", ".mh-rentalquote-content", "right", "left", 850],
        [".mh-schoolquote-layout", ".mh-schoolquote-content", ".mh-schoolquote-image", "left", "right", 850],
        [".mh-luxhero-wrapper", ".mh-luxhero-content", ".mh-luxhero-image", "left", "right", 900],
        [".mh-tabcollection-wrapper", ".mh-tabcollection-image", ".mh-tabcollection-content", "right", "left", 850]
    ];

    splitConfigs.forEach(([wrapperSelector, firstSelector, secondSelector, firstVariant, secondVariant, duration]) => {

        revealSplitSection(wrapperSelector, firstSelector, secondSelector, firstVariant, secondVariant, duration);

    });

    const counterSelectors = [
        ".mh-luxhero-stat h3",
        ".mh-achievement-number",
        "[data-counter]"
    ];

    const counterTargets = new Set();

    counterSelectors.forEach(selector => {

        document.querySelectorAll(selector).forEach(element => {

            if (counterTargets.has(element)) return;

            counterTargets.add(element);

            if (prefersReducedMotion || !counterObserver) {

                animateCounter(element);

            } else {

                counterObserver.observe(element);

            }

        });

    });

})();
