window.history.scrollRestoration = "manual";

window.addEventListener("beforeunload", () => {
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
});



function initHomeVideo() {
  function resizeVimeoIframe(iframe) {
    const container = iframe.parentElement;
    const containerW = container.offsetWidth;
    const containerH = container.offsetHeight;
    const containerRatio = containerW / containerH;
    const videoRatio = 16 / 9;
    let width, height;

    if (containerRatio > videoRatio) {
      width = containerW;
      height = containerW / videoRatio;
    } else {
      width = containerH * videoRatio;
      height = containerH;
    }

    iframe.style.width = `${width}px`;
    iframe.style.height = `${height}px`;
    iframe.style.top = '50%';
    iframe.style.left = '50%';
  }

  function setupVimeoCovers() {
    document.querySelectorAll('.vimeo-bg').forEach(el => {
      const id = el.dataset.vimeoId;
      if (!id) return;

      const iframe = document.createElement('iframe');
      iframe.src = `https://player.vimeo.com/video/${id}?background=1&autoplay=1&loop=1&muted=1&byline=0&title=0`;
      iframe.frameBorder = '0';
      iframe.allow = 'autoplay; fullscreen';
      iframe.allowFullscreen = true;
      iframe.className = 'vimeo-iframe';

      el.appendChild(iframe);

      iframe.onload = () => resizeVimeoIframe(iframe);
      window.addEventListener('resize', () => resizeVimeoIframe(iframe));
    });
  }

  setupVimeoCovers();
}







// --- DYNAMIC LIBRARY LOADER (at the very top) ---
function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = false;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(script);
  });
}

async function loadAllLibraries() {
  await loadScript("https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js");
  await loadScript("https://gsapfiles.netlify.app/scrolltrigger.min.js");
  await loadScript("https://gsapfiles.netlify.app/splittext.min.js");
  await loadScript("https://cdnjs.cloudflare.com/ajax/libs/gsap/3.9.0/ScrollToPlugin.min.js");
  await loadScript("https://unpkg.com/imagesloaded@5/imagesloaded.pkgd.min.js");
  await loadScript("https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.7.8/lottie.min.js");
}



async function startApp() {
  await loadAllLibraries();
  

  // UserWay widget
  (function(d) {
    var s = d.createElement("script");
    s.setAttribute("data-account", "a37OvQJfVJ");
    s.setAttribute("src", "https://cdn.userway.org/widget.js");
    (d.body || d.head).appendChild(s);
  })(document);

  // Show loader on all pages
  animateLoaderCounter(() => {
    refreshbreakingpoints();
    initInteractiveCursor();
    initMegaMenu();
    initPageTransitions();
    initInfinityGallery();
    initHomeVideo();
    requestAnimationFrame(() => {
      initNavbarShowHide();
      initGsapAnimations();
      initSplitTextAnimations();
      
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(true);
      if (typeof initCustomSmoothScrolling === 'function') initCustomSmoothScrolling();
    });
  }, 1000);
}
document.addEventListener("DOMContentLoaded", startApp);
// --- END DYNAMIC LOADER ---

function initAllFunctions() {
    // Register GSAP plugins (fallback)
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && typeof SplitText !== 'undefined') {
        gsap.registerPlugin(SplitText, ScrollTrigger);
    }
  
    initPageTransitions();
   initHomeVideo();
    refreshbreakingpoints();
  initNavbarShowHide();
  
    
    // Ensure GSAP and ScrollTrigger are ready before animations
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        
        // Initialize animations with proper timing
        requestAnimationFrame(() => {
            initGsapAnimations();
            initSplitTextAnimations();
           initInfinityGallery();
         
            ScrollTrigger.refresh(true);
          initCustomSmoothScrolling();
   
        });
    }
  
  
}

 /* ==============================================
Custom Smooth Scrolling
============================================== */


function initCustomSmoothScrolling() {
    const l = (s, e, t) => s * (1 - t) + e * t;
    const c = (v, m, M) => Math.max(m, Math.min(v, M));
    let d = false;
    let i = null;
    let p = 0;

    class S {
        constructor() {
            const m = window.innerWidth < 750;
            const isIPad = /iPad|Macintosh/.test(navigator.userAgent) && 'ontouchend' in document;
            
            this.w = window;
            this.c = document.documentElement;
            this.l = m ? 0.1 : 0.05;
            this.d = m ? 1.5 : 1.5;
            this.e = (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t));
            this.wm = 0.8;
            
            // Improved touch sensitivity for iPad
            if (isIPad) {
                this.tm = 1.8; // Reduced for slower, more controlled iPad touch (was 2.2, now 1.8)
                this.dm = 1.8; // Reduced drag multiplier to match (was 2.2, now 1.8)
                this.l = 0.08; // Keep lerp close to desktop
            } else {
                this.tm = m ? 3 : 1.5;
                this.dm = m ? 3 : 1.8;
            }
            
            this.ts = 0;
            this.cs = 0;
            this.se = false;
            this.dr = false;
            this.sx = 0;
            this.sy = 0;
            this.lft = performance.now();
            this.v = 0;
            this.dir = 0;
            this.ct = 0;
            this.r = false;
            this.rc = false;
            this.sliderTouchActive = false;
            this.sliderTouchStartX = undefined;
            this.sliderTouchStartY = undefined;
            this.init();
        }

        init() {
            this.as();
            this.ud();
            this.be();
            setTimeout(() => {
                this.se = true;
                this.fsu();
                this.sl();
            }, 10);
        }

        as() {
            if (window.isMenuOpen && window.isMenuOpen()) {
                document.body.style.overflow = "hidden";
                document.body.style.position = "fixed";
                document.body.style.width = "100%";
                document.body.style.top = `-${window.scrollY}px`;
            } else {
                document.body.style.overflow = "";
                document.body.style.position = "";
                document.body.style.width = "";
                document.body.style.top = "";
            }
            document.documentElement.style.scrollBehavior = "auto";
            document.documentElement.style.touchAction = "pan-x pan-y";
            // Disable zoom at the viewport level
            const viewport = document.querySelector('meta[name="viewport"]');
            if (viewport) {
                viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
            }
        }

        ud() {
            const w = this.w === window ? document.documentElement : this.w;
            const c = this.c;
            this.dim = {
                width: w.clientWidth,
                height: w.clientHeight,
                sw: c.scrollWidth,
                sh: c.scrollHeight
            };
            const s = document.querySelector(".wrapper");
            if (s) {
                document.body.style.height = `${s.clientHeight}px`;
            }
        }

        be() {
            window.addEventListener("wheel", (e) => {
                if (!this.se || d || (window.isMenuOpen && window.isMenuOpen())) return;
                const t = e.deltaY * this.wm;
                this.os(t);
                e.preventDefault();
            }, { passive: false });

            window.addEventListener("touchstart", (e) => {
                if (e.touches.length > 1) {
                    e.preventDefault(); // Prevent multi-touch gestures
                    return;
                }
                if (window.isMenuOpen && window.isMenuOpen()) return;
                
                // Check if touch is on slider-wrapper specifically
                const target = e.target;
                const isOnSliderWrapper = target.closest('.slider-wrapper');
                if (isOnSliderWrapper) {
                    this.sliderTouchStartX = e.touches[0].clientX;
                    this.sliderTouchStartY = e.touches[0].clientY;
                    this.sliderTouchActive = false; // Will be set to true only if dragging
                }
                
                this.std(e);
            }, { passive: false });

            window.addEventListener("touchmove", (e) => {
                if (e.touches.length > 1) {
                    e.preventDefault(); // Prevent multi-touch gestures
                    return;
                }
                if (window.isMenuOpen && window.isMenuOpen()) return;
                
                // Check if we're actively dragging the slider-wrapper
                if (this.sliderTouchStartX !== undefined) {
                    const touchX = e.touches[0].clientX;
                    const touchY = e.touches[0].clientY;
                    const deltaX = touchX - this.sliderTouchStartX;
                    const deltaY = Math.abs(touchY - this.sliderTouchStartY);
                    
                    // Only consider it dragging if horizontal movement is significant and greater than vertical
                    if (Math.abs(deltaX) > 10 && Math.abs(deltaX) > deltaY) {
                        this.sliderTouchActive = true;
                        e.preventDefault(); // Prevent page scrolling only when actively dragging
                        return;
                    }
                }
                
                // If slider is not being actively dragged, allow normal page scrolling
                if (!this.sliderTouchActive) {
                    this.otd(e);
                }
            }, { passive: false });

            window.addEventListener("touchend", (e) => {
                this.sliderTouchActive = false;
                this.sliderTouchStartX = undefined;
                this.sliderTouchStartY = undefined;
                this.etd();
            });

            window.addEventListener("mousedown", (e) => {
                if (window.isMenuOpen && window.isMenuOpen()) return;
                if (e.button === 2) {
                    this.rc = true;
                    return;
                }
                if (!this.rc) {
                    this.smd(e);
                }
            });

            window.addEventListener("mousemove", (e) => {
                if (window.isMenuOpen && window.isMenuOpen()) return;
                this.omd(e);
            });

            window.addEventListener("mouseup", () => {
                this.emd();
                setTimeout(() => {
                    this.rc = false;
                }, 100);
            });

            window.addEventListener("resize", () => {
                requestAnimationFrame(() => this.ud());
            });
          
            document.querySelectorAll(".slider").forEach((e) => {
                e.addEventListener("mousedown", () => d = true);
                e.addEventListener("mouseup", () => { d = false; });
                e.addEventListener("mouseleave", () => { d = false; });
            });
        }

        os(t) {
            if (!this.se || d || (window.isMenuOpen && window.isMenuOpen())) return;
            this.ct = 0;
            this.v = t;
            this.dir = Math.sign(t);
            const l = document.documentElement.scrollHeight - window.innerHeight;
            this.ts = c(this.ts + t, 0, l);
        }

        std(e) {
            if (!this.se || d || (window.isMenuOpen && window.isMenuOpen())) return;
            this.dr = true;
            this.sy = e.touches[0].clientY;
        }

        otd(e) {
            if (!this.dr || !this.se || (window.isMenuOpen && window.isMenuOpen())) return;
            const t = e.touches[0].clientY;
            const d = (this.sy - t) * this.tm;
            const a = Math.round(this.cs) <= 0;
            const p = d < 0;
            if (a && p) return;
            this.os(d);
            this.sy = t;
            e.preventDefault();
        }

        etd() {
            this.dr = false;
        }

        smd(e) {
            if (!this.se || this.rc || (window.isMenuOpen && window.isMenuOpen())) return;
            this.dr = true;
            this.sy = e.clientY;
        }

        omd(e) {
            if (!this.dr || !this.se || this.rc || (window.isMenuOpen && window.isMenuOpen())) return;
            const t = (this.sy - e.clientY) * this.dm;
            this.os(t);
            this.sy = e.clientY;
        }

        emd() {
            this.dr = false;
        }

        fsu() {
            this.ud();
        }

        sl() {
            const n = performance.now();
            const dt = Math.min((n - this.lft) / 1000, 0.1);
            this.lft = n;
            const mo = document.querySelector(".menu-toggle").classList.contains("clicked");
            if (this.se && !mo) {
                const p = c(this.ct / this.d, 0, 1);
                const co = p >= 1;
                const e = co ? 1 : this.e(p);
                this.cs = l(this.cs, this.ts, this.l);
                if (!co) {
                    this.ct += dt;
                }
                window.scrollTo(0, this.cs);
                if (co) {
                    this.ct = 0;
                }
            }
            requestAnimationFrame(() => this.sl());
        }

        ses(v) {
            this.se = v;
        }

        r() {
            this.ts = 0;
            this.cs = 0;
            this.v = 0;
            window.scrollTo(0, 0);
        }

        ts(e) {
            if (e) {
                document.body.style.overflow = "hidden";
                document.body.style.position = "";
                document.body.style.top = "";
                document.body.style.width = "";
                this.se = true;
            } else {
                const scrollY = window.scrollY;
                document.body.style.overflow = "hidden";
                document.body.style.position = "fixed";
                document.body.style.width = "100%";
                document.body.style.top = `-${scrollY}px`;
                this.se = false;
            }
        }

        d() {
            this.se = false;
            document.body.style.overflow = "";
            document.body.style.position = "";
            document.body.style.width = "";
            document.body.style.top = "";
            document.body.style.height = "";
            document.documentElement.style.scrollBehavior = "";
            document.documentElement.style.touchAction = "pan-x pan-y";
            window.removeEventListener("wheel", this.os);
            window.removeEventListener("touchstart", this.std);
            window.removeEventListener("touchmove", this.otd);
            window.removeEventListener("touchend", this.etd);
            window.removeEventListener("mousedown", this.smd);
            window.removeEventListener("mousemove", this.omd);
            window.removeEventListener("mouseup", this.emd);
            window.removeEventListener("resize", this.ud);
        }
    }

    i = new S();

    window.toggleSmoothScroll = (e) => {
        if (i) {
            i.ts(e);
        }
    };
}






function initPageTransitions() {
  

  
    const loader = gsap.timeline();
    let isAnimating = false;
    let nextPageHTML = '';
    let pendingNavigation = null;
    let lastNavigationTime = 0;
    const NAVIGATION_COOLDOWN = 1000;

    if (!document.querySelector('.transition')) {
        const div = document.createElement('div');
        div.className = 'transition';
        div.innerHTML = `
            <svg id="loadersvg" viewBox="0 0 1 1" preserveAspectRatio="none">
                <path class="swipeup" fill="#1E1F24" d="M 0 1 V 1 Q 0.5 1 1 1 V 1 z" />
            </svg>
        `;
        document.body.appendChild(div);
    }

    const swipeup = document.querySelector('.swipeup');
    const transition = document.querySelector('.transition');
    const cursor = document.querySelector('.cursor');

    function canNavigate() {
        const now = Date.now();
        if (now - lastNavigationTime < NAVIGATION_COOLDOWN) return false;
        lastNavigationTime = now;
        return true;
    }

    async function handleNavigation(url, isPopState = false) {
        if (window.transitioning) {
            pendingNavigation = { url, isPopState };
            return;
        }

        if (!canNavigate()) return;

        window.transitioning = true;
        isAnimating = true;

        // 1. Start the transition animation immediately
        let transitionDone;
        const transitionPromise = new Promise((resolve) => {
            const tl = gsap.timeline({ onComplete: resolve });
            tl.set(transition, { display: 'block', visibility: 'visible', opacity: 1 });
            tl.set(swipeup, { autoAlpha: 1, attr: { d: 'M 0 1 V 1 Q 0.5 1 1 1 V 1 z' } });
            tl.to(swipeup, { duration: 0.5, ease: 'power4.in', attr: { d: 'M 0 1 V 0.5 Q 0.5 0 1 0.5 V 1 z' } });
            tl.to(swipeup, { duration: 0.4, ease: 'power2', attr: { d: 'M 0 1 V 0 Q 0.5 0 1 0 V 1 z' } });
            tl.to(".header .logo img, .header .menu a", { yPercent: -130, duration: 0.5, stagger: 0.06, ease: "power1.out" }, 0);
            tl.to(".menu-toggle", { opacity: 0, duration: 0.5, ease: "power1.out" }, 0);
            tl.to(cursor, { scale: 0, duration: 0.2, ease: "power2.out" }, 0);
        });

        // 2. Start fetching the next page in parallel
        const fetchPromise = fetch(url)
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                return response.text();
            })
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const nextWrapper = doc.querySelector('.page-wrapper');
                if (!nextWrapper) throw new Error('No .page-wrapper found');
                return { html, doc, nextWrapper };
            });

        // 3. Wait for both the animation and the fetch to finish
        let nextPage;
        try {
            nextPage = await fetchPromise;
            await transitionPromise;
        } catch (err) {
            console.error('Navigation error:', err);
            window.location.href = url;
            return;
        }

        // 4. Now swap the content and finish the transition
        nextPageHTML = nextPage.nextWrapper.innerHTML;
        const doc = nextPage.doc;

        // Keep transition visible while updating content
        const container = document.querySelector('.page-wrapper');
        if (!container) return;

        ScrollTrigger.getAll().forEach(t => t.kill());

        if (window.customSmoothScroll?.destroy) window.customSmoothScroll.destroy();
        if (window.interactiveCursor?.destroy) window.interactiveCursor.destroy();
        if (window.navbarShowHide?.destroy) window.navbarShowHide.destroy();

        document.title = doc.querySelector('title')?.textContent || document.title;
        container.innerHTML = nextPageHTML;

        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;

        // Initialize new page content
        initInfinityGallery();
        initHomeVideo();
        setTimeout(() => {
            initInteractiveCursor();
            initGsapAnimations();
            initNavbarShowHide();
            ScrollTrigger.refresh(true);
            initCustomSmoothScrolling();
            initSplitTextAnimations();
            
        }, 100);

        // Complete the transition animation (outro)
        const tl = gsap.timeline();
        tl.to(swipeup, {
            duration: 0.6,
            ease: 'power4.in',
            attr: { d: 'M 0 1 V 0.5 Q 0.5 1 1 0.5 V 1 z' }
        });

        tl.to(swipeup, {
            duration: 0.4,
            ease: 'power2',
            attr: { d: 'M 0 1 V 1 Q 0.5 1 1 1 V 1 z' },
            onComplete: () => {
                gsap.set(cursor, { scale: 0 });
                gsap.set(".header .logo img, .header .menu a", { yPercent: 130 });
                gsap.set(".menu-toggle", { opacity: 0 });

                const inTl = gsap.timeline();
                inTl.to([".header .logo img", ".header .menu a"], { yPercent: 0, duration: 0.6, ease: "power1.out" }, 0);
                inTl.to(cursor, { scale: 1, duration: 0.3, ease: "power2.out" }, 0);
                inTl.to(".menu-toggle", { opacity: 1, duration: 1.5, ease: "power2.out" }, 0);

                // Only hide transition after all animations are complete
                transition.style.opacity = '0';
                transition.style.visibility = 'hidden';
                isAnimating = false;
                window.transitioning = false;

                if (typeof initNavbarShowHide === 'function' && !window.navbarShowHide) {
                    window.navbarShowHide = initNavbarShowHide();
                }

                if (pendingNavigation) {
                    const { url, isPopState } = pendingNavigation;
                    pendingNavigation = null;
                    setTimeout(() => handleNavigation(url, isPopState), 100);
                }
            }
        });
    }

    document.body.addEventListener('click', (e) => {
        const link = e.target.closest('a[href]');
        if (!link) return;

        const href = link.getAttribute('href');
        if (
            link.target === '_blank' ||
            href.startsWith('mailto:') ||
            href.startsWith('tel:') ||
            href.startsWith('#') ||
            (href.startsWith('http') && !href.includes(location.hostname))
        ) return;

        e.preventDefault();
        history.pushState({ title: document.title }, '', href);
        handleNavigation(href);
    });

    window.addEventListener('popstate', () => {
        if (window.transitioning) {
            pendingNavigation = { url: location.href, isPopState: true };
            return;
        }
        handleNavigation(location.href, true);
    });

    window.addEventListener('DOMContentLoaded', () => {
        history.replaceState({ title: document.title }, '', location.href);
    });
}








/* ==============================================
Show/Hide Grid on Keypress
============================================== */
document.addEventListener("keydown", function (event) {
    if (event.shiftKey && event.key === "G") {
    const gridOverlay = document.querySelector(".grid-overlay");
    if (gridOverlay) {
      gridOverlay.remove();
    } else {
      const overlay = document.createElement("div");
      overlay.className = "grid-overlay";
      for (let i = 0; i < 12; i++) {
        const column = document.createElement("div");
        overlay.appendChild(column);
      }
      document.body.appendChild(overlay);
    }
    }
});


/* ==============================================
Split Text Animations
============================================== */



function truncateByWords(el, wordLimit = 43) {
  const text = el.textContent.trim();
  const words = text.split(/\s+/);
  if (words.length > wordLimit) {
    el.textContent = words.slice(0, wordLimit).join(' ') + '...';
  }
}

function initSplitTextAnimations() {
  if (gsap.ScrollTrigger) {
    gsap.ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  }

  const elements = document.querySelectorAll(
    "h1, h2, h3, h4, h5, h6, p, .menu a, .logo img, .btn, .nav, label, .text-link, .link-box, form div"
  );

  elements.forEach((element) => {
    // Truncate before SplitText to keep ellipsis visible
    if (element.tagName.toLowerCase() === 'p') {
      truncateByWords(element, 30); // Adjust word limit
    }

    const split = new SplitText(element, { type: "lines", linesClass: "line" });

    split.lines.forEach((line) => {
      line.style.display = "inline-block";
      line.style.width = "100%";
      line.style.lineHeight = "unset";
      line.style.visibility = "hidden";
    });

    split.lines.forEach((line) => line.offsetWidth); // force reflow

    gsap.set(split.lines, {
      visibility: "visible",
      yPercent: 100,
      clipPath: "inset(0% 0% 100% 0%)",
      opacity: 1,
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: element,
        start: "top bottom",
        once: true,
        onEnter: () => tl.play()
      },
      paused: true,
      onComplete: () => {
        if (!element.matches(".hero-headline h1")) {
          split.revert();
        }
      }
    });

    tl.to(split.lines, {
      yPercent: 0,
      clipPath: "inset(-20% -10% -20% 0%)",
      opacity: 1,
      stagger: 0.12,
      duration: 2,
      delay: element.closest(".hero, .delay") ? 0.5 : 0,
      ease: "power3.out"
    });
  });
}


/*
function initSplitTextAnimations() {
  if (gsap.ScrollTrigger) {
    gsap.ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  }

  const elements = document.querySelectorAll(
    "h1, h2, h3, h4, h5, h6, p, .menu a, .logo img, .btn, .nav, label, .text-link, .link-box, form div"
  );

  elements.forEach((element) => {
    const split = new SplitText(element, { type: "lines", linesClass: "line" });

    split.lines.forEach((line) => {
      line.style.display = "inline-block";
      line.style.width = "100%";
      line.style.lineHeight = "unset";
      line.style.visibility = "hidden";
    });

    split.lines.forEach((line) => line.offsetWidth); // force reflow

    gsap.set(split.lines, {
      visibility: "visible",
      yPercent: 100,
      clipPath: "inset(0% 0% 100% 0%)",
      opacity: 1,
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: element,
        start: "top bottom",
        once: true,
        onEnter: () => tl.play()
      },
      paused: true,
      onComplete: () => {
        if (!element.matches(".hero-headline h1")) {
          split.revert();
        }
      }
    });

    tl.to(split.lines, {
      yPercent: 0,
      clipPath: "inset(-20% -10% -20% 0%)",
      opacity: 1,
      stagger: 0.12,
      duration: 2,
      delay: element.closest(".hero, .delay") ? 0.5 : 0,
      ease: "power3.out"
    });
  });
}

*/



/* ==============================================
Page GSAP Animations
============================================== */


function initGsapAnimations() {
  // Common animations for all pages
  gsap.fromTo(".clipping-video", 
    { clipPath: "inset(100% 0% 0% 0%)" }, 
    { 
      clipPath: "inset(0% 0% 0% 0%)", 
      delay: 0.6,
      duration: 1.5, 
      ease: "power4.inOut" 
    }
  );

  gsap.set("img, .burger", { opacity: 0 });
  gsap.to("img, .burger", { opacity: 1, duration: 1.5, ease: "power4.inOut" });

  // Homepage specific animations
  const visual = document.querySelector(".video-visual");
  if (visual) {
    const isMobile = window.innerWidth < 650;
    const scrollEnd = isMobile ? 900 : 1500;

    gsap.to(visual, {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      width: "100vw",
      height: "100svh",
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: `+=${scrollEnd}`,
        scrub: 0.5,
        invalidateOnRefresh: true
      }
    });

    const isMobile2 = window.innerWidth < 650;
    const pinScrollEnd = isMobile2 ? 1200 : 2000;

    ScrollTrigger.create({
      trigger: ".hero",
      start: "top top",
      ease: "none",
      end: `+=${pinScrollEnd}`,
      pin: true,
      pinSpacing: true,
      scrub: 0.5,
      anticipatePin: 0,
      onEnter: () => ScrollTrigger.getAll().forEach(st => {
        if (st.trigger !== document.querySelector(".hero")) st.disable();
      }),
      onLeave: () => ScrollTrigger.getAll().forEach(st => st.enable())
    });
  }

  // Work thumbnail animations
  document.querySelectorAll('.work-thumbnail .image-wrapper img').forEach(img => {
    gsap.fromTo(img, 
      { y: '-10%', scale: 1.1 }, 
      {
        y: '10%',
        scale: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: img,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2
        }
      }
    );
  });

  // Logo animations
  gsap.set(".home-about .logo", { opacity: 0, visibility: "hidden" });
  gsap.utils.toArray(".home-about .logo").forEach((logo) => {
    gsap.to(logo, {
      opacity: 1,
      visibility: "visible",
      duration: 2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: logo,
        start: "top 80%",
        toggleActions: "play none none none"
      }
    });
  });

  // Hero headline animations
  const heroHeadline = document.querySelector(".hero-headline h1");
  if (heroHeadline) {
    gsap.fromTo(heroHeadline, 
      { 
        clipPath: "inset(-10% -10% -20% -10%)",
        y: 0
      }, 
      { 
        clipPath: "inset(-10% -10% 100% -10%)",
        y: -100,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top 1%",
          end: "bottom 0%",
          scrub: 0.5,
        }
      }
    );
  }

  // Image parallax animations
  document.querySelectorAll('.home-container .image img, .property .image img, .place .image img, .footer-image img').forEach((img) => {
    gsap.from(img, {
      yPercent: -15,
      transformOrigin: "center center",
      ease: "none",
      scrollTrigger: {
        trigger: img,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      }
    });
  });

  // Left to right animations
  gsap.utils.toArray(".left-to-right").forEach((img) => {
    gsap.fromTo(img, 
      { clipPath: "inset(0 100% 0 0)" }, 
      {
        clipPath: "inset(0 0% 0 0)",
        duration: 2.5,
        delay: -0.7,
        ease: "expo.inOut",
        scrollTrigger: {
          trigger: img,
          start: "top 95%",
          toggleActions: "play none none none"
        }
      }
    );
  });

  // Right to left animations
  gsap.utils.toArray(".right-to-left").forEach((img) => {
    gsap.fromTo(img, 
      { clipPath: "inset(0 0 0 100%)" }, 
      {
        clipPath: "inset(0 0 0 0%)",
        duration: 2.5,
        delay: -0.7,
        ease: "expo.inOut",
        scrollTrigger: {
          trigger: img,
          start: "top 95%",
          toggleActions: "play none none none"
        }
      }
    );
  });

  // Icon animations
  gsap.utils.toArray(".content .icon").forEach(icon => {
    gsap.fromTo(icon, 
      { clipPath: "circle(0% at 50% 50%)" }, 
      {
        clipPath: "circle(100% at 50% 50%)",
        duration: 2.5,
        ease: "power3.out",
        scrollTrigger: {
          trigger: icon,
          start: "top 85%",
          toggleActions: "play none none none"
        }
      }
    );
  });

  // Line fill animation
  gsap.to(".line-fill", {
    y: "0%",
    duration: 2,
    repeat: -1,
    ease: "power2.inOut",
    yoyo: true
  });

  // Property image hover effects
  document.querySelectorAll('.property .image img').forEach(img => {
    if (img.closest('.home') || img.closest('.more-work')) {
      img.addEventListener('mouseenter', () => {
        gsap.to(img, {
          scale: 1.1,
          transformOrigin: 'center center',
          duration: 1.3,
          ease: 'power3.out',
          overwrite: 'auto'
        });
      });

      img.addEventListener('mouseleave', () => {
        gsap.to(img, {
          scale: 1,
          transformOrigin: 'center center',
          duration: 1.3,
          ease: 'power3.out',
          overwrite: 'auto'
        });
      });
    }
  });

  // Bullet animations
  document.querySelectorAll(".bullet").forEach((el) => {
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: "top 80%",
        toggleActions: "play none none none"
      },
      opacity: 0,
      y: 100,
      clipPath: "inset(8% 8% 8% 8%)",
      duration: 1.3,
      ease: "power3.out"
    });
  });
  
  
  document.querySelectorAll(".w-input, .w-select").forEach((el) => {
    gsap.fromTo(el, {
      clipPath: "inset(0 0 0 100%)"
    }, {
      clipPath: "inset(0 0 0 0%)",
      duration: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: el,
        start: "top 90%",
        toggleActions: "play none none none"
      }
    });
  });


  
}




function resetInteractiveCursor() {
  if (window.cursorAnimationFrame) {
    cancelAnimationFrame(window.cursorAnimationFrame);
    window.cursorAnimationFrame = null;
  }

  if (window.cleanupCursor) {
    window.cleanupCursor();
    window.cleanupCursor = null;
  }

  const cursor = document.querySelector("#cursor");
  if (cursor) {
    cursor.className = "cursor";
    gsap.killTweensOf(cursor);
    gsap.set(cursor, {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      xPercent: -50,
      yPercent: -50,
      scale: 0,
      opacity: 0,
      visibility: "hidden"
    });
  }
}

function initInteractiveCursor() {
  if (window.innerWidth <= 650) return;

  const cursor = document.querySelector("#cursor");
  if (!cursor) return;

  resetInteractiveCursor();

  const mouse = { x: -100, y: -100 };
  let isMoving = false;
  let isDragging = false;
  let cursorLocked = false;
  let cursorAnimationFrame;
  let dragTimeout;

  gsap.to(cursor, {
    scale: 1,
    opacity: 1,
    visibility: "visible",
    duration: 0.4,
    ease: "power2.out"
  });

  function trackMouse(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    isMoving = true;
  }

  function animateCursor() {
    if (isMoving) {
      gsap.to(cursor, {
        duration: 0.7,
        x: mouse.x,
        y: mouse.y,
        ease: "power3.out"
      });
      isMoving = false;
    }
    cursorAnimationFrame = requestAnimationFrame(animateCursor);
  }

  function resetCursor() {
    if (!cursorLocked) {
      cursor.classList.remove("change", "explore", "drag", "scroll", "enter", "play", "slide");
    }
  }

  function handleMouseDown() {
    dragTimeout = setTimeout(() => {
      isDragging = true;
      cursor.classList.add("drag");
    }, 150);
  }

  function handleMouseMove() {
    if (isDragging) cursor.classList.add("drag");
  }

  function handleMouseUp() {
    if (isDragging) {
      isDragging = false;
      cursor.classList.remove("drag");
    }
    clearTimeout(dragTimeout);
  }

  document.querySelectorAll(".hero:not(.contact .hero)").forEach(el => {
    el.addEventListener("mouseenter", () => cursor.classList.add("scroll"));
    el.addEventListener("mouseleave", () => cursor.classList.remove("scroll"));
  });

  document.querySelectorAll(".home-properties-grid .property").forEach(el => {
    el.addEventListener("mouseenter", () => cursor.classList.add("enter"));
    el.addEventListener("mouseleave", () => cursor.classList.remove("enter"));
  });

  document.querySelectorAll(".video-visual").forEach(el => {
    el.addEventListener("mouseenter", () => cursor.classList.add("play"));
    el.addEventListener("mouseleave", () => cursor.classList.remove("play"));
  });

  document.querySelectorAll(".slider").forEach(el => {
    el.addEventListener("mouseenter", () => cursor.classList.add("slide"));
    el.addEventListener("mouseleave", () => cursor.classList.remove("slide"));
  });

  // Hide cursor when hovering over expand icons
  document.addEventListener("mouseover", (e) => {
    if (e.target.closest('.expand-icon')) {
      cursor.classList.remove("slide");
    }
  });

  document.addEventListener("mouseout", (e) => {
    if (e.target.closest('.expand-icon')) {
      // Let the normal cursor behavior handle the transition
    }
  });

  document.addEventListener("mousemove", trackMouse);
  document.addEventListener("mousedown", handleMouseDown);
  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", handleMouseUp);

  animateCursor();

  window.cursorAnimationFrame = cursorAnimationFrame;
  window.cleanupCursor = function () {
    cancelAnimationFrame(cursorAnimationFrame);
    document.removeEventListener("mousemove", trackMouse);
    document.removeEventListener("mousedown", handleMouseDown);
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };
}



/* ==============================================
Navbar Show/Hide 
============================================== */

function initNavbarShowHide() {
    // Kill any existing instance
    if (window.navbarShowHide && typeof window.navbarShowHide.destroy === 'function') {
        window.navbarShowHide.destroy();
    }

    const navElements = document.querySelectorAll(".header");
    let lastScrollTop = 0;
    const isMobile = window.innerWidth < 650;
    const hideY = isMobile ? "-20vw" : "-8vw";
    let hasScrolledDown = false;
    let scrollHandler = null;

    if (navElements.length) {
        // Force scroll to top immediately
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;

        // Reset any existing animations
        navElements.forEach((nav) => {
            gsap.killTweensOf(nav);
        });

        // Set initial position without animation
        navElements.forEach((nav) => {
            gsap.set(nav, { 
                y: 0, 
                position: "fixed", 
                top: 0, 
                left: 0, 
                right: 0, 
                zIndex: 999,
                clearProps: "transform" // Clear any existing transforms
            });
        });

        lastScrollTop = 0;
        hasScrolledDown = false;

        // Remove any existing scroll handler
        if (window.navbarScrollHandler) {
            window.removeEventListener("scroll", window.navbarScrollHandler);
        }

        // Create new scroll handler
        scrollHandler = function() {
            const st = window.pageYOffset || document.documentElement.scrollTop;
            const scrollDelta = st - lastScrollTop;

            // Reset hasScrolledDown if we're at the top
            if (st === 0) {
                hasScrolledDown = false;
                navElements.forEach((nav) => {
                    gsap.set(nav, { y: 0 });
                });
                return;
            }

            if (!hasScrolledDown && st > 0) {
                hasScrolledDown = true;
            }

            if (!hasScrolledDown || st < 100) return;

            if (st > lastScrollTop) {
                // Scrolling down - hide navbar
                navElements.forEach((nav) => {
                    gsap.to(nav, { 
                        y: hideY, 
                        duration: 1, 
                        ease: "power4.out",
                        overwrite: true // Ensure smooth transitions
                    });
                });
            } else if (st < lastScrollTop && Math.abs(scrollDelta) > 1) {
                // Scrolling up - only show navbar if scroll delta is significant
                navElements.forEach((nav) => {
                    gsap.to(nav, { 
                        y: "0vw", 
                        duration: 1, 
                        ease: "power4.out",
                        overwrite: true // Ensure smooth transitions
                    });
                });
            }

            lastScrollTop = Math.max(0, st);
        };

        // Store the handler reference globally
        window.navbarScrollHandler = scrollHandler;
        window.addEventListener("scroll", scrollHandler);

        // Force initial position
        requestAnimationFrame(() => {
            navElements.forEach((nav) => {
                gsap.set(nav, { y: 0 });
            });
        });
    }

    // Create and store the instance
    window.navbarShowHide = {
        destroy: function() {
            if (window.navbarScrollHandler) {
                window.removeEventListener("scroll", window.navbarScrollHandler);
                window.navbarScrollHandler = null;
            }
            // Reset GSAP animations
            navElements.forEach((nav) => {
                gsap.killTweensOf(nav);
                gsap.set(nav, { clearProps: "all" });
            });
        }
    };

    return window.navbarShowHide;
}
  




function refreshbreakingpoints() {
  let wasMobile = window.innerWidth < 650;

  window.addEventListener("resize", () => {
    const isMobile = window.innerWidth < 650;
    if (isMobile !== wasMobile) {
      wasMobile = isMobile;
      window.location.reload();
    }
  });
}
  





function initInfinityGallery() {
  console.log('initInfinityGallery called');

  // Destroy the previous instance if it exists
  if (window.infinitySliderInstance) {
    window.infinitySliderInstance.destroy();
    window.infinitySliderInstance = null;
    console.log('Previous infinity slider instance destroyed.');
  }

  const sliderWrapper = document.querySelector(".slider-wrapper");
  console.log('Slider wrapper found:', sliderWrapper);
  
  if (!sliderWrapper) {
    console.error('Slider wrapper not found!');
    return;
  }
  
  class InfiniteHorizontalScroll {
    constructor(container) {
      if (!container) return;
      this.container = container;
      this.items = Array.from(this.container.children);
      if (this.items.length === 0) return;
      this.originalItemCount = this.items.length;

      this.scrollX = 0;
      this.smoothScrollX = 0;
      this.touchStartX = 0;
      this.touchStartY = 0;
      this.isDragging = false;
      this.dragStartX = 0;
      this.dragDelta = 0;
      this.isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      this.scrollEnabled = true; // Add this to control when scrolling is allowed
      this.isFullscreenOpen = false; // Add this to track fullscreen state
      this.animationFrameId = null; // To hold the animation frame ID
      this.originalItemCount = this.items.length;
      this.snapOnSettle = false;
      this.snapAnimation = null;

      const isMobile = window.innerWidth < 650;
      const isIPad = /iPad|Macintosh/.test(navigator.userAgent) && 'ontouchend' in document;
      
      // Core settings
      this.wrapper = window;
      this.content = document.documentElement;
      this.lerp = isMobile ? 0.1 : 0.05; // Slower lerp for mobile
      this.duration = isMobile ? 0.05 : 1.5;
      this.easing = (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t));
      this.wheelMultiplier = isMobile ? 0.4 : 0.8; // Slower wheel for mobile
      this.touchMultiplier = isMobile ? 3 : 4; // Slower touch for mobile
      this.dragMultiplier = isMobile ? 3 : 3;

      // Adjust for iPad specifically
      if (isIPad) {
        this.lerp = 0.06; // Slower lerp for iPad (was 0.05, now 0.06)
      this.touchMultiplier = 2.5; // Slower touch for iPad (was 4, now 2.5)
      this.dragMultiplier = 2.5; // Slower drag for iPad (was 3, now 2.5)
      }

      this.cloneItems();
      this.calculateDimensions();
      this.init();
      
      // Update items to include clones and set up modals
      this.items = Array.from(this.container.children);
      this.setupFullscreenModal();
    }

    setupFullscreenModal() {
      console.log('Setting up fullscreen modal...');
      
      // Create modal container if it doesn't exist
      if (!document.querySelector('.fullscreen-modal')) {
        console.log('Creating fullscreen modal...');
        const modal = document.createElement('div');
        modal.className = 'fullscreen-modal';
        document.body.appendChild(modal);

        // Store modal reference
        this.modal = modal;
        this.currentAnimation = null;
        this.originalImage = null;

        // Handle modal click to close
        const closeModal = (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.closeFullscreen();
        };
        modal.addEventListener('click', closeModal);
        modal.addEventListener('touchend', closeModal);
        
        // Prevent any touch events on the modal from propagating
        modal.addEventListener('touchstart', (e) => {
          e.preventDefault();
          e.stopPropagation();
        }, { passive: false });
        
        modal.addEventListener('touchmove', (e) => {
          e.preventDefault();
          e.stopPropagation();
        }, { passive: false });
      } else {
        this.modal = document.querySelector('.fullscreen-modal');
      }

      // Add expand icons to all slider items
      console.log('Items found:', this.items.length);
      this.items.forEach((item, index) => {
        console.log(`Processing item ${index}:`, item);
        if (!item.querySelector('.expand-icon')) {
          console.log(`Creating expand icon for item ${index}`);
          const expandIcon = document.createElement('div');
          expandIcon.className = 'expand-icon';
          item.appendChild(expandIcon);
          
          // Use both click and touchend for better Safari support
          const handleExpand = (e) => {
            console.log('Expand icon clicked!');
            e.preventDefault();
            e.stopPropagation();
            const img = item.querySelector('img');
            console.log('Image found:', img);
            this.openFullscreen(img);
          };
          
          expandIcon.addEventListener('click', handleExpand);
          expandIcon.addEventListener('touchend', handleExpand);
        } else {
          console.log(`Expand icon already exists for item ${index}`);
        }
      });
      
      console.log('Fullscreen modal setup complete');
    }

    openFullscreen(img) {
      if (!this.modal || !img) return;

      if (this.currentAnimation) {
        this.currentAnimation.kill();
      }

      console.log('Opening fullscreen for:', img);
      
      // Set fullscreen state and disable scrolling
      this.isFullscreenOpen = true;
      this.disableScroll();
      document.body.classList.add('fullscreen-active');
      
      // Create a clone of the image
      const clone = img.cloneNode(true);
      this.originalImage = img;
      this.modal.innerHTML = '';
      this.modal.appendChild(clone);
      this.modal.style.display = 'block';

      // Get the original image position and size
      const rect = img.getBoundingClientRect();
      
      // Set initial position with Safari-specific properties
      clone.style.position = 'fixed';
      clone.style.top = rect.top + 'px';
      clone.style.left = rect.left + 'px';
      clone.style.width = rect.width + 'px';
      clone.style.height = rect.height + 'px';
      clone.style.zIndex = '10000';
      clone.style.objectFit = 'cover';
      clone.style.borderRadius = '0';
      clone.style.transition = 'none';
      clone.style.transformOrigin = 'center center';
      clone.style.webkitTransformOrigin = 'center center';
      clone.style.webkitBackfaceVisibility = 'hidden';
      clone.style.backfaceVisibility = 'hidden';
      clone.style.webkitPerspective = '1000';
      clone.style.perspective = '1000';

      // Set initial clip-path
      gsap.set(clone, { clipPath: 'polygon(10% 3%, 92% 13%, 100% 100%, 0% 100%)' });

      // Simple GSAP animation with scale and rotation
      const tl = gsap.timeline({
        onComplete: () => {
          // Don't re-enable scroll here - keep it disabled while fullscreen is open
          this.currentAnimation = null;
        }
      });

      // Animate the icon on the selected item to fade out
      const parentItem = img.closest('.slider-item');
      if (parentItem) {
        const icon = parentItem.querySelector('.expand-icon');
        if (icon) {
          tl.to(icon, { opacity: 0, duration: 1, ease: 'power2.out', overwrite: 'auto' }, 0);
        }
      }

      // Animate non-selected items to fade out slightly faster
      const clickedSrc = img.getAttribute('src');
      this.container.querySelectorAll('.slider-item').forEach(item => {
        const itemImg = item.querySelector('img');
        if (!itemImg || itemImg.getAttribute('src') !== clickedSrc) {
          tl.to(item, { opacity: 0, duration: 1, ease: "power4.inOut" }, 0);
        }
      });

      // Clean perspective animation
      tl.to(clone, {
        top: 0,
        left: 0,
        width: '100vw',
        height: '100svh',
        scale: 1.005,
        rotation: 0,
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', // Animate to full
        duration: 1.5,
        ease: "expo.inOut"
      }, 0);

      this.currentAnimation = tl;
    }

    closeFullscreen() {
      if (!this.modal || !this.originalImage) return;

      if (this.currentAnimation) {
        this.currentAnimation.kill();
      }

      const img = this.modal.querySelector('img');
      if (!img) return;

      console.log('Closing fullscreen');

      // Get the original image position and size
      const rect = this.originalImage.getBoundingClientRect();

      // Simple GSAP animation for closing
      const closeTl = gsap.timeline({
        onComplete: () => {
          this.modal.style.display = 'none';
          
          // Reset fullscreen state and re-enable scrolling
          this.isFullscreenOpen = false;
          this.enableScroll();
          document.body.classList.remove('fullscreen-active');
          this.currentAnimation = null;
        }
      });
      
      // Animate the icon on the selected item to fade back in
      const closeParentItem = this.originalImage.closest('.slider-item');
      if (closeParentItem) {
        const icon = closeParentItem.querySelector('.expand-icon');
        if (icon) {
          closeTl.to(icon, { opacity: 1, duration: 0.4, ease: 'power2.in', delay: 0.2, overwrite: 'auto' });
        }
      }
      
      // Animate all items to fade back in
      this.container.querySelectorAll('.slider-item').forEach(item => {
        closeTl.to(item, { opacity: 1, duration: 1, ease: "power4.inOut" }, 0.5);
      });
      
      // Main collapse animation
      closeTl.to(img, {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        scale: 1,
        rotation: 0,
        clipPath: 'polygon(10% 3%, 92% 13%, 100% 100%, 0% 100%)', // Animate back to distorted
        duration: 1.5,
        ease: "expo.inOut"
      }, 0);

      this.currentAnimation = closeTl;
    }

    updateOriginalPosition() {
      if (this.originalImage) {
        const rect = this.originalImage.getBoundingClientRect();
        const modalImg = this.modal.querySelector('img');
        if (modalImg) {
          modalImg.dataset.originalTop = rect.top + 'px';
          modalImg.dataset.originalLeft = rect.left + 'px';
          modalImg.dataset.originalWidth = rect.width + 'px';
          modalImg.dataset.originalHeight = rect.height + 'px';
        }
      }
    }

    disableScroll() {
      // Disable the infinity gallery scrolling
      this.scrollEnabled = false;
      console.log('Slider scrolling disabled');
    }

    enableScroll() {
      // Re-enable the infinity gallery scrolling
      this.scrollEnabled = true;
      console.log('Slider scrolling enabled');
    }

    cloneItems() {
      const fragmentBefore = document.createDocumentFragment();
      const fragmentAfter = document.createDocumentFragment();
      this.items.forEach((item) => {
        const cloneBefore = item.cloneNode(true);
        const cloneAfter = item.cloneNode(true);
        fragmentBefore.appendChild(cloneBefore);
        fragmentAfter.appendChild(cloneAfter);
      });
      this.container.insertBefore(fragmentBefore, this.container.firstChild);
      this.container.appendChild(fragmentAfter);
    }

    calculateDimensions() {
      this.totalWidth = 0;
      Array.from(this.container.children).forEach((item) => {
        const itemWidth = item.getBoundingClientRect().width;
        const itemMarginRight = parseFloat(getComputedStyle(item).marginRight);
        this.totalWidth += itemWidth + itemMarginRight;
      });
      const originalWidth = this.totalWidth / 3;
      this.scrollX = originalWidth;
      this.smoothScrollX = originalWidth;
      this.container.style.transform = `translateX(${-this.scrollX}px)`;
    }

    init() {
      this.bindEvents();
      this.animate();
      window.addEventListener("resize", () => {
        this.calculateDimensions();
      });
    }

    bindEvents() {
      // Store bound versions of handlers to ensure they can be removed later
      this.handleWheel = this.handleWheel.bind(this);
      this.handleTouchStart = this.handleTouchStart.bind(this);
      this.handleTouchMove = this.handleTouchMove.bind(this);
      this.handleTouchEnd = this.handleTouchEnd.bind(this);
      this.handleDragStart = this.handleDragStart.bind(this);
      this.handleDragMove = this.handleDragMove.bind(this);
      this.handleDragEnd = this.handleDragEnd.bind(this);
      this.calculateDimensions = this.calculateDimensions.bind(this);
      this.handleKeydown = this.handleKeydown.bind(this);

      document.addEventListener("wheel", this.handleWheel, { passive: false });
      
      // Touch events for all touch devices (including iPad)
      if (this.isTouchDevice) {
        this.wrapper.addEventListener("touchstart", this.handleTouchStart, { passive: true });
        this.wrapper.addEventListener("touchmove", this.handleTouchMove, { passive: false });
        this.wrapper.addEventListener("touchend", this.handleTouchEnd);
        this.wrapper.addEventListener("touchcancel", this.handleTouchEnd);
      }

      // Mouse events for non-touch devices
      if (!this.isTouchDevice) {
        this.wrapper.addEventListener("mousedown", this.handleDragStart);
        window.addEventListener("mousemove", this.handleDragMove);
        window.addEventListener("mouseup", this.handleDragEnd);
      }
      
      // Keyboard events for closing fullscreen
      document.addEventListener("keydown", this.handleKeydown);
    }

    handleKeydown(e) {
      if (e.key === "Escape" && this.isFullscreenOpen) {
        this.closeFullscreen();
      }
    }

    handleWheel(event) {
      if (event.target.closest("button, input, textarea, select")) return;
      if (!this.scrollEnabled || this.isFullscreenOpen) return; // Prevent scrolling when fullscreen is open
      
      const isTrackpad = Math.abs(event.deltaX) > 0 || Math.abs(event.deltaY) < 10;
      
      if (isTrackpad) {
        this.scrollX += event.deltaX * this.wheelMultiplier;
        this.scrollX += event.deltaY * this.wheelMultiplier;
      } else {
        event.preventDefault();
        this.scrollX += event.deltaY * this.wheelMultiplier;
      }

      this.handleInfiniteScroll();
    }

    handleTouchStart(event) {
      if (event.touches.length > 1) return; // Ignore multi-touch
      if (!this.scrollEnabled || this.isFullscreenOpen) return; // Prevent scrolling when fullscreen is open
      
      this.snapOnSettle = false;
      if (this.snapAnimation) {
        this.snapAnimation.kill();
        this.snapAnimation = null;
      }

      this.touchStartX = event.touches[0].clientX;
      this.touchStartY = event.touches[0].clientY;
      this.dragDelta = 0;
    }

    handleTouchMove(event) {
      if (event.touches.length > 1) return; // Ignore multi-touch
      if (!this.scrollEnabled || this.isFullscreenOpen) return; // Prevent scrolling when fullscreen is open
      
      const touchX = event.touches[0].clientX;
      const touchY = event.touches[0].clientY;
      const deltaX = touchX - this.touchStartX; // Remove Math.abs() to preserve direction
      const deltaY = Math.abs(touchY - this.touchStartY);
      
      // Only handle horizontal scrolling if the horizontal movement is greater than vertical
      if (Math.abs(deltaX) > 10 && Math.abs(deltaX) > deltaY) {
        event.preventDefault();
        this.scrollX -= deltaX * this.touchMultiplier; // Use actual deltaX (with direction)
        this.touchStartX = touchX;
        this.touchStartY = touchY;
        this.handleInfiniteScroll();
      }
    }

    handleTouchEnd() {
      this.dragDelta = 0;
      this.snapOnSettle = true;
    }

    handleDragStart(e) {
      if (!this.scrollEnabled || this.isFullscreenOpen) return; // Prevent scrolling when fullscreen is open
      
      this.snapOnSettle = false;
      if (this.snapAnimation) {
        this.snapAnimation.kill();
        this.snapAnimation = null;
      }

      this.isDragging = true;
      this.dragStartX = e.clientX;
    }

    handleDragMove(e) {
      if (!this.isDragging || !this.scrollEnabled || this.isFullscreenOpen) return; // Prevent scrolling when fullscreen is open
      const deltaX = e.clientX - this.dragStartX;
      this.dragStartX = e.clientX;
      this.scrollX -= deltaX * this.dragMultiplier;
      this.handleInfiniteScroll();
    }

    handleDragEnd() {
      this.isDragging = false;
      this.snapOnSettle = true;
    }

    handleInfiniteScroll() {
      const originalWidth = this.totalWidth / 3;
      if (this.scrollX < 0) {
        this.scrollX += originalWidth;
        this.smoothScrollX += originalWidth;
      } else if (this.scrollX > this.totalWidth - originalWidth) {
        this.scrollX -= originalWidth;
        this.smoothScrollX -= originalWidth;
      }
    }

    snapToCenter() {
      if (window.innerWidth >= 650 || this.isDragging || (this.isTouchDevice && this.dragDelta !== 0)) return;

      const viewportCenter = window.innerWidth / 2;
      let currentScrollCenter = this.smoothScrollX + viewportCenter;
      
      let closestItem = null;
      let minDistance = Infinity;

      // Adjust for infinite scroll wrapping
      const originalWidth = this.totalWidth / 3;
      currentScrollCenter = (currentScrollCenter % originalWidth) + originalWidth;
      
      const originalItems = this.items.slice(this.originalItemCount, this.originalItemCount * 2);

      originalItems.forEach(item => {
        const itemCenter = item.offsetLeft + item.offsetWidth / 2;
        const distance = Math.abs(currentScrollCenter - itemCenter);
        if (distance < minDistance) {
          minDistance = distance;
          closestItem = item;
        }
      });

      if (closestItem) {
        const targetX = closestItem.offsetLeft + closestItem.offsetWidth / 2 - viewportCenter;
        
        let finalTargetX = targetX;
        if(Math.abs(this.smoothScrollX - targetX) > originalWidth / 2) {
            if(targetX < this.smoothScrollX) {
                finalTargetX += originalWidth;
            } else {
                finalTargetX -= originalWidth;
            }
        }

        if (this.snapAnimation) this.snapAnimation.kill();
        this.snapAnimation = gsap.to(this, { 
          scrollX: finalTargetX, 
          duration: 0.2, 
          ease: 'none',
          onComplete: () => { this.snapAnimation = null; }
        });
      }
    }

    animate() {
      if (this.scrollEnabled && !this.isFullscreenOpen) {
        this.smoothScrollX += (this.scrollX - this.smoothScrollX) * this.lerp;
        this.container.style.transform = `translateX(${-this.smoothScrollX}px)`;
        this.container.style.webkitTransform = `translateX(${-this.smoothScrollX}px)`;

        if (this.snapOnSettle && !this.isDragging && Math.abs(this.scrollX - this.smoothScrollX) < 0.5) {
            this.snapToCenter();
            this.snapOnSettle = false;
        }
      }
      this.animationFrameId = requestAnimationFrame(() => this.animate());
    }

    destroy() {
      // Cancel the animation frame
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
      }

      // Remove all event listeners
      document.removeEventListener("wheel", this.handleWheel, { passive: false });
      this.wrapper.removeEventListener("touchstart", this.handleTouchStart, { passive: true });
      this.wrapper.removeEventListener("touchmove", this.handleTouchMove, { passive: false });
      this.wrapper.removeEventListener("touchend", this.handleTouchEnd);
      this.wrapper.removeEventListener("touchcancel", this.handleTouchEnd);
      this.wrapper.removeEventListener("mousedown", this.handleDragStart);
      window.removeEventListener("mousemove", this.handleDragMove);
      window.removeEventListener("mouseup", this.handleDragEnd);
      window.removeEventListener("resize", this.calculateDimensions);
      document.removeEventListener("keydown", this.handleKeydown);

      // Remove the modal from the DOM to ensure it's fresh on next init
      if (this.modal) {
        this.modal.remove();
      }

      // Nullify references to help with garbage collection
      this.container = null;
      this.items = null;
      this.modal = null;
      this.originalImage = null; // Prevent stale references

      console.log("InfiniteHorizontalScroll instance destroyed.");
    }
  }

  window.infinitySliderInstance = new InfiniteHorizontalScroll(sliderWrapper);
}















/* ==============================================
Script Loading Utility
============================================== */

// Version control for scripts
const SCRIPT_VERSIONS = {
    'gsap': '3.12.5',
    'scrolltrigger': '3.12.5',
    'splittext': '3.12.5'
};

// Cache control
const CACHE_BUSTER = `?v=${Date.now()}`;

// Retry logic
async function loadScriptWithRetry(src, options = {}, maxRetries = 3) {
    let retries = 0;
    
    while (retries < maxRetries) {
        try {
            return await loadScript(src, options);
        } catch (error) {
            retries++;
            if (retries === maxRetries) throw error;
            await new Promise(resolve => setTimeout(resolve, 1000 * retries));
        }
    }
}

function loadScriptsSequentially(scripts) {
    return scripts.reduce((promiseChain, script) => {
        return promiseChain.then(() => loadScriptWithRetry(script.src, script.options));
    }, Promise.resolve());
}

// Lazy loading utility
function lazyLoadScript(src, options = {}) {
    return new Promise((resolve) => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    observer.disconnect();
                    loadScriptWithRetry(src, options)
                        .then(resolve)
                        .catch(console.error);
                }
            });
        });

        const placeholder = document.createElement('div');
        placeholder.dataset.lazyScript = src;
        document.body.appendChild(placeholder);
        observer.observe(placeholder);
    });
}

/* ==============================================
Initialization Sequence
============================================== */

async function initializeApplication() {
    try {
        // First load core dependencies
        await loadScriptsSequentially([
            {
                src: `https://cdnjs.cloudflare.com/ajax/libs/gsap/${SCRIPT_VERSIONS.gsap}/gsap.min.js`,
                options: { async: false }
            },
            {
                src: `https://cdnjs.cloudflare.com/ajax/libs/gsap/${SCRIPT_VERSIONS.scrolltrigger}/ScrollTrigger.min.js`,
                options: { async: false }
            },
            {
                src: `https://cdnjs.cloudflare.com/ajax/libs/gsap/${SCRIPT_VERSIONS.splittext}/SplitText.min.js`,
                options: { async: false }
            },
            // Add ScrollToPlugin
            {
                src: 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.9.0/ScrollToPlugin.min.js',
                options: { async: false }
            },
            // Add imagesLoaded
            {
                src: 'https://unpkg.com/imagesloaded@5/imagesloaded.pkgd.min.js',
                options: { async: false }
            },
            // Add Lottie (bodymovin)
            {
                src: 'https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.7.8/lottie.min.js',
                options: { async: false }
            }
        ]);

        // Register GSAP plugins
        if (typeof gsap !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger, SplitText);
            if (typeof ScrollToPlugin !== 'undefined') {
                gsap.registerPlugin(ScrollToPlugin);
            }
        }

        // Load smooth scroll script
        await loadScriptWithRetry('https://cdn.prod.website-files.com/645e0e1ff7fdb6dc8c85f3a2/64a5544a813c7253b90f2f50_lenis-offbrand.txt', {
            attributes: {
                'data-id-scroll': '',
                'data-autoinit': 'true',
                'data-duration': '1',
                'data-orientation': 'vertical',
                'data-smoothWheel': 'true',
                'data-smoothTouch': 'false',
                'data-touchMultiplier': '1.5',
                'data-easing': '(t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t))',
                'data-useOverscroll': 'true',
                'data-useControls': 'true',
                'data-useAnchor': 'true',
                'data-useRaf': 'true',
                'data-infinite': 'false'
            }
        });

        // Initialize core functionality
        initPageTransitions();
        refreshbreakingpoints();
        initInfinityGallery(); // Add this line

        // Initialize animations with proper timing
        requestAnimationFrame(() => {
            initGsapAnimations();
            initSplitTextAnimations();
            initInteractiveCursor();
            ScrollTrigger.refresh(true);
            initCustomSmoothScrolling();
        });

        // Lazy load non-critical scripts
        lazyLoadScript('https://cdn.userway.org/widget.js', {
            attributes: {
                'data-account': 'a37OvQJfVJ'
            }
        });

    } catch (error) {
        console.error('Error initializing application:', error);
        // Fallback initialization without animations
        initPageTransitions();
        refreshbreakingpoints();
    }
}

// Replace the old initialization
document.addEventListener("DOMContentLoaded", initializeApplication);

// --- PAGE LOADER OVERLAY WITH COUNTER ---
(function addPageLoader() {
  // Add loader on all pages
  const loader = document.createElement('div');
  loader.id = 'page-loader';
  loader.className = 'page-loader';
  loader.innerHTML = `
    <div id="loader-counter" class="loader-counter">0</div>
  `;
  document.body.appendChild(loader);
})();

function animateLoaderCounter(onComplete, duration = 100) {
  document.documentElement.style.visibility = "visible";
  document.body.style.visibility = "visible";

  const counter = document.getElementById('loader-counter');
  const loader = document.getElementById('page-loader');
    
  // If no loader elements found, just run the callback
  if (!counter || !loader) {
    if (typeof onComplete === 'function') onComplete();
    return;
  }

  // Create loading line
  const loadingLine = document.createElement('div');
  loadingLine.className = 'loading-line';
  document.body.appendChild(loadingLine);
      
  const target = 100;
      
  // Set initial state
  gsap.set(counter, {
    opacity: 0,
    y: 100,
    visibility: "hidden",
    textContent: 0
  });

  gsap.set(loadingLine, { width: "0%" });
  
  // Create main timeline
  const tl = gsap.timeline({
    onComplete: () => {
      // Start the functions immediately
      if (typeof onComplete === 'function') onComplete();
         
      // Create timeline for exit animation
      const exitTl = gsap.timeline();
         
      // Animate counter up and fade out
      exitTl.to(counter, {
        y: -100,
        opacity: 0,
        duration: 0.8,
        ease: "power2.in"
      }, 0);

      // Animate loading line from left to right with clip-path
      exitTl.to(loadingLine, {
        clipPath: "inset(0 0 0 100%)",
        duration: 0.8,
        ease: "power2.in"
      }, 0);
         
      // Then animate the clip-path
      exitTl.to(loader, {
        clipPath: "inset(0 0 100% 0)", // From bottom to top
        duration: 1.4,
        ease: "expo.inOut",
        onComplete: () => {
          loader.remove();
          loadingLine.remove();
        }
      }, 0);
    }
  });

  // Fade in and slide up
  tl.to(counter, {
    y: 0,
    opacity: 1,
    duration: 1.2,
    visibility: "visible",
    ease: "power2.inOut"
  });

  // Animate the counter
  tl.to(counter, {
    duration: duration / 1000,
    textContent: target,
    snap: { textContent: 1 },
    ease: "none"
  });

  // Animate the loading line with power4.inOut
  tl.to(loadingLine, {
    width: "100%",
    duration: duration / 1000,
    ease: "power4.inOut"
  }, "<");
}


/* ==============================================
Fullscreen Mega Menu Core (No Infinity Logic)
============================================== */

function initMegaMenu() {
  
  
  const style = document.createElement("style");
style.textContent = `.mega-menu.hide { display: block; }`;
document.head.appendChild(style);

    // Global animation settings
    const ANIMATION = {
        duration: 1.2,
        ease: 'power4.inOut',
        stagger: 0.1
    };


    const menuToggle = document.querySelector('.menu-toggle');
    const megaMenu = document.querySelector('.mega-menu');
    const bars = menuToggle ? menuToggle.querySelectorAll('.menu-bar') : [];
    if (!menuToggle || !megaMenu || bars.length < 2) return;

    let overlay = document.getElementById('mega-menu-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'mega-menu-overlay';
        overlay.classList.add('mega-menu-overlay');
        document.body.appendChild(overlay);
    }

    gsap.set(megaMenu, { opacity: 1, clipPath: 'inset(100% 0 0 0)', pointerEvents: 'none' });
    gsap.set(overlay, { opacity: 0, pointerEvents: 'none' });
    gsap.set(bars[0], { top: 'calc(50% - 0.3vw)', opacity: 1, backgroundColor: 'var(--darkgrey)' });
    gsap.set(bars[1], { top: 'calc(50% + 0.3vw)', opacity: 1, backgroundColor: 'var(--darkgrey)' });
    gsap.set('.mega-menu .menu-content', { y: 0 });

function openMenu() {
  // Set initial state first
  gsap.set(megaMenu, { 
      pointerEvents: 'auto',
      display: 'block',  // Override the !important rule
      y: 0,
      clipPath: 'inset(100% 0% 0% 0%)' 
  });

  gsap.set('.mega-menu .menu-content', { y: 0 });
  
  gsap.set('.mega-menu .mega-menu-image', { 
      clipPath: 'inset(100% 0% 0% 0%)' 
  });
  gsap.set('.mega-menu .mega-menu-image img', {
      scale: 2,
      objectPosition: 'bottom'
  });
  gsap.set('.mega-menu-links a', { 
      y: '120%',
      clipPath: 'inset(0% 0% 120% 0%)'
  });
  gsap.set(overlay, { pointerEvents: 'auto' });

  // Create the main timeline
  const tl = gsap.timeline({
      onComplete: () => {
          gsap.set(megaMenu, { pointerEvents: 'auto' });
          isAnimating = false;
      }
  });
  tl.to(overlay, { opacity: 0.8, duration: ANIMATION.duration, ease: ANIMATION.ease }, 0)
    .to(megaMenu, { clipPath: 'inset(0% 0% 0% 0%)', duration: ANIMATION.duration, ease: ANIMATION.ease }, 0)
    .to('.mega-menu .mega-menu-image', { clipPath: 'inset(0% 0% 0% 0%)', duration: ANIMATION.duration, ease: ANIMATION.ease, delay: 0.050, }, 0)
    .to('.mega-menu .mega-menu-image img', { 
        scale: 1,
        duration: ANIMATION.duration * 1.5,
        ease: "power4.out"
    }, 0)
    .to(bars[0], { 
        top: '50%', 
        opacity: 1, 
        duration: ANIMATION.duration * 0.5, 
        ease: "power2.inOut"
    }, 0)
    .to(bars[1], { 
        top: '50%', 
        opacity: 1, 
        duration: ANIMATION.duration * 0.5, 
        ease: "power2.inOut"
    }, 0)
    .to(bars[0], {
        backgroundColor: '#fff',
        duration: ANIMATION.duration * 0.6,
        ease: "power2.inOut"
    }, ">0.1")
    .to(bars[1], {
        backgroundColor: '#fff',
        duration: ANIMATION.duration * 0.6,
        ease: "power2.inOut"
    }, "<")
    .to(document.querySelectorAll('.header .logo, .header .menu'), { opacity: 0, duration: ANIMATION.duration, ease: ANIMATION.ease }, 0)
    .to('.mega-menu-links a', { 
        y: '0%',
        clipPath: 'inset(-20% -10% -20% 0%)',
        duration: 1.4, 
        stagger: 0.1,
        delay: 0,
        ease: "power2.inOut",
    }, -0.1);
  menuToggle.classList.add('clicked');
}

    function closeMenu() {
        // Set initial state first
        gsap.set(megaMenu, { 
            pointerEvents: 'auto',
            clipPath: 'inset(0% 0% 0% 0%)' 
        });
        gsap.set('.mega-menu .mega-menu-image', { 
            clipPath: 'inset(0% 0% 0% 0%)' 
        });
        gsap.set('.mega-menu-links a', { 
            clipPath: 'inset(-20% -10% -20% 0%)'
        });

        // Set initial states before timeline
        gsap.set('.mega-menu .menu-content', { y: 0 });

        const tl = gsap.timeline({
            onComplete: () => {
                gsap.set(overlay, { pointerEvents: 'none' });
                gsap.set(megaMenu, { pointerEvents: 'none' });
                // Reset clip-paths to bottom position for next opening
                gsap.set(megaMenu, { clipPath: 'inset(0% 0% 100% 0%)' });
                gsap.set('.mega-menu-links a', { clipPath: 'inset(0% 0% 100% 0%)' });
                isAnimating = false;
            }
        });

        tl.to(overlay, { opacity: 0, duration: ANIMATION.duration, ease: ANIMATION.ease }, 0)
          .to(megaMenu, { clipPath: 'inset(0% 0% 100% 0%)', duration: ANIMATION.duration, ease: ANIMATION.ease }, 0)
          .to('.mega-menu .menu-content', { y: -200, duration: ANIMATION.duration, ease: ANIMATION.ease }, 0)
          .to(bars[0], { 
              top: 'calc(50% - 0.3vw)', 
              opacity: 1, 
              duration: ANIMATION.duration * 0.5, 
              ease: "power2.inOut"
          }, 0)
          .to(bars[1], { 
              top: 'calc(50% + 0.3vw)', 
              opacity: 1, 
              duration: ANIMATION.duration * 0.5, 
              ease: "power2.inOut"
          }, 0)
          .to(bars[0], { 
              backgroundColor: 'var(--darkgrey)',
              duration: ANIMATION.duration * 0.6,
              ease: "power2.inOut"
          }, ">0.1")
          .to(bars[1], { 
              backgroundColor: 'var(--darkgrey)',
              duration: ANIMATION.duration * 0.6,
              ease: "power2.inOut"
          }, "<")
          .to(document.querySelectorAll('.header .logo, .header .menu'), { opacity: 1, duration: ANIMATION.duration, ease: ANIMATION.ease }, 0);
        menuToggle.classList.remove('clicked');
    }

    let isAnimating = false;
    menuToggle.addEventListener('click', () => {
        if (isAnimating) return;
        isAnimating = true;
        
        if (!menuToggle.classList.contains('clicked')) {
            openMenu();
        } else {
            closeMenu();
        }
    });

    megaMenu.addEventListener('click', (e) => {
        if (
            e.target.classList.contains('mega-menu') ||
            e.target.closest('.mega-menu-links a')
        ) {
            closeMenu();
        }
    });

    // --- BEGIN: Mega Menu Link Hover Image Animation (GSAP only, default always visible, hovered image always on top) ---
    const menuLinks = document.querySelectorAll('.mega-menu-links a');
    const menuImages = document.querySelectorAll('.mega-menu-image img');
    const menuLinksContainer = document.querySelector('.mega-menu-links');
    let imageTween = null;
    let zTop = 10; // Arbitrary high z-index for hovered image

    // Always show the default image as background with lowest z-index
    if (menuImages[0]) {
        gsap.set(menuImages[0], { opacity: 1, scale: 1, zIndex: 0, display: 'block' });
    }
    // Hide all other images initially, set their z-index above the background
    menuImages.forEach((img, i) => {
        if (i !== 0) {
            gsap.set(img, { opacity: 0, scale: 1.1, zIndex: 1, display: 'none' });
        }
    });

    menuLinks.forEach((link, i) => {
        link.addEventListener('mouseenter', () => {
            const targetIndex = i + 1;
            menuImages.forEach((img, j) => {
                gsap.killTweensOf(img);
                if (j === targetIndex) {
                    gsap.set(img, { opacity: 0, scale: 1.1, zIndex: zTop, display: 'block' });
                    imageTween = gsap.to(img, {
                        opacity: 1,
                        scale: 1,
                        duration: 1.3,
                        ease: 'power3.out',
                        overwrite: 'auto',
                    });
                } else if (j !== 0) {
                    gsap.to(img, { opacity: 0, scale: 1.1, zIndex: 1, duration: 1.3, ease: 'power3.out', onComplete: () => {
                        gsap.set(img, { display: 'none' });
                    }});
                }
            });
        });
    });

    // On mouseleave of the whole container, fade out all except the default image
    if (menuLinksContainer) {
        menuLinksContainer.addEventListener('mouseleave', () => {
            menuImages.forEach((img, j) => {
                gsap.killTweensOf(img);
                if (j === 0) {
                    gsap.set(img, { scale: 1, zIndex: 0, display: 'block' });
                    gsap.fromTo(img, { opacity: 0 }, { opacity: 1, duration: 1.3, ease: 'power3.out' });
                } else {
                    gsap.to(img, { opacity: 0, scale: 1.1, zIndex: 1, duration: 1.3, ease: 'power3.out', onComplete: () => {
                        gsap.set(img, { display: 'none' });
                    }});
                }
            });
        });
    }
    // --- END: Mega Menu Link Hover Image Animation ---
}

document.addEventListener('DOMContentLoaded', () => {
    initMegaMenu();
});

window.addEventListener('resize', () => {
    if (megaMenuState && typeof megaMenuState.refresh === 'function') {
        megaMenuState.refresh('Home');
    }
});



