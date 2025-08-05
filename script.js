window.history.scrollRestoration = "manual";

window.addEventListener("beforeunload", () => {
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
});


// --- DYNAMIC LIBRARY LOADER  ---
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
    try {
      console.log('Loading GSAP...');
      await loadScript("https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js");
      
      console.log('Loading ScrollTrigger...');
      await loadScript("https://gsapfiles.netlify.app/scrolltrigger.min.js");
      
      console.log('Loading SplitText...');
      await loadScript("https://gsapfiles.netlify.app/splittext.min.js");
      
      console.log('Loading ScrollToPlugin...');
      await loadScript("https://cdnjs.cloudflare.com/ajax/libs/gsap/3.9.0/ScrollToPlugin.min.js");
      
      console.log('Loading ImagesLoaded...');
      await loadScript("https://unpkg.com/imagesloaded@5/imagesloaded.pkgd.min.js");
      
      console.log('Loading Lottie...');
      await loadScript("https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.7.8/lottie.min.js");
      
      console.log('Loading CMS Filter...');
      await loadScript("https://cdn.jsdelivr.net/npm/@finsweet/attributes-cmsfilter@1/cmsfilter.js");
      
      console.log('All libraries loaded successfully');
    } catch (error) {
      console.error('Error loading libraries:', error);
      // Continue with basic functionality even if some libraries fail to load
    }
  }
  
  
  
  async function startApp() {
    try {
      console.log('Starting app initialization...');
      
      // Prevent scrolling immediately
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = '0';
      
      // Load all libraries first
      await loadAllLibraries();
      
      // Wait a bit to ensure all scripts are properly loaded
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Verify GSAP and plugins are loaded
      if (typeof gsap === 'undefined') {
        throw new Error('GSAP not loaded');
      }
      
      if (typeof ScrollTrigger === 'undefined') {
        throw new Error('ScrollTrigger not loaded');
      }
      
      if (typeof SplitText === 'undefined') {
        throw new Error('SplitText not loaded');
      }
      
      console.log('GSAP and plugins verified');
      
      // Register GSAP plugins
      gsap.registerPlugin(ScrollTrigger, SplitText);
      if (typeof ScrollToPlugin !== 'undefined') {
        gsap.registerPlugin(ScrollToPlugin);
      }
      
      console.log('GSAP plugins registered');
  
      // UserWay widget
      (function(d) {
        var s = d.createElement("script");
        s.setAttribute("data-account", "a37OvQJfVJ");
        s.setAttribute("src", "https://cdn.userway.org/widget.js");
        (d.body || d.head).appendChild(s);
      })(document);
  
      // Start the loader animation with proper initialization sequence
      animateLoaderCounter(() => {
        console.log('Loader completed, initializing functions...');
        
        // Initialize functions after loader completes
        refreshbreakingpoints();
        initInteractiveCursor();
        initMegaMenu();
        initPageTransitions();
        initInfinityGallery();
        moveShowAllIntoCollectionList();
        initDisplayToggle();
        initNavbarShowHide();
        initGsapAnimations();
        initSplitTextAnimations();
        
        // Initialize type-list radio button handler
        if (typeof initTypeListRadioHandler === 'function') {
          initTypeListRadioHandler();
        }
        
        // Only initialize cursor if not already initialized
        if (!window.cursorInitialized) {
            initInteractiveCursor();
        }
        
        if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(true);
        if (typeof initCustomSmoothScrolling === 'function') initCustomSmoothScrolling();
        
        // Initialize video immediately without delay
        initHomeVideo();
        
        console.log('All functions initialized successfully');
        
        // Mark page as fully loaded after a short delay
        setTimeout(() => {
          window.pageFullyLoaded = true;
          console.log('Page marked as fully loaded');
          
          // Re-enable scrolling after everything is loaded
          setTimeout(() => {
            // Double-check that ScrollTrigger and SplitText are loaded
            if (typeof ScrollTrigger !== 'undefined' && typeof SplitText !== 'undefined') {
              document.body.style.overflow = '';
              document.documentElement.style.overflow = '';
              document.body.style.position = '';
              document.body.style.width = '';
              document.body.style.top = '';
              window.enableScrolling(); // Enable global scroll prevention
              console.log('Scrolling re-enabled - ScrollTrigger and SplitText loaded');
            } else {
              console.log('ScrollTrigger or SplitText not loaded, keeping scroll disabled');
            }
          }, 300);
        }, 200);
      }, 400); // Standard loader duration
  
    } catch (error) {
      console.error('Error starting app:', error);
      
      // Fallback initialization if script loading fails
      setTimeout(() => {
        try {
          console.log('Running fallback initialization...');
          refreshbreakingpoints();
          initMegaMenu();
          initPageTransitions();
          moveShowAllIntoCollectionList();
          initNavbarShowHide();
          initDisplayToggle();
          initHomeVideo();
        } catch (fallbackError) {
          console.error('Fallback initialization failed:', fallbackError);
        }
      }, 1000);
    }
  }
  // Global scroll prevention until scripts are loaded
  let scrollPreventionEnabled = true;
  
  // Prevent all scroll events until scripts are loaded
  function preventScroll(e) {
    if (scrollPreventionEnabled) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }
  
  // Add scroll prevention listeners
  window.addEventListener('scroll', preventScroll, { passive: false });
  window.addEventListener('wheel', preventScroll, { passive: false });
  window.addEventListener('touchmove', preventScroll, { passive: false });
  window.addEventListener('keydown', (e) => {
    if (scrollPreventionEnabled && (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'PageDown' || e.key === 'PageUp' || e.key === ' ')) {
      e.preventDefault();
      return false;
    }
  });
  
  // Function to enable scrolling
  window.enableScrolling = function() {
    scrollPreventionEnabled = false;
    console.log('Global scroll prevention disabled');
  };
  
  document.addEventListener("DOMContentLoaded", startApp);
  // --- END DYNAMIC LOADER ---




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

function animateLoaderCounter(onComplete, duration = 50) {
  document.documentElement.style.visibility = "visible";
  document.body.style.visibility = "visible";

  const counter = document.getElementById('loader-counter');
  const loader = document.getElementById('page-loader');
    
  // If no loader elements found, just run the callback
  if (!counter || !loader) {
    if (typeof onComplete === 'function') onComplete();
    return;
  }

  const target = 100;
      
  // Set initial state
  gsap.set(counter, {
    opacity: 0,
    y: 100,
    visibility: "hidden",
    textContent: 0
  });
  
  // Create main timeline
  const tl = gsap.timeline({
    onComplete: () => {
      // Start the functions immediately
      if (typeof onComplete === 'function') onComplete();
         
      // Create timeline for exit animation
      const exitTl = gsap.timeline();
         
      // Animate counter up and fade out
      exitTl.to(counter, {
        y: -300,
        opacity: 0,
        clipPath: "inset(0 0 100% 0)",
        duration: 1.2,
        ease: "power2.in"
      }, 0);

      // Then animate the clip-path
      exitTl.to(loader, {
        clipPath: "inset(0 0 100% 0)", // From bottom to top
        duration: 1.2,
        ease: "expo.inOut",
        onComplete: () => {
          loader.remove();
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
    duration: duration / 500,
    textContent: target,
    snap: { textContent: 1 },
    ease: "none"
  });

}






function moveShowAllIntoCollectionList() {
  const showAll = document.querySelector(".show-all");
  const typeItem = document.querySelector(".collection-list-1");
  const collectionList = document.querySelector(".type-item .w-dyn-items");

  if (collectionList) {
    if (showAll) collectionList.prepend(showAll);
    if (typeItem) {
      typeItem.querySelectorAll("[role='listitem']").forEach(child => collectionList.appendChild(child));
      typeItem.remove();
    }
  }
}





/* ==============================================
Reload FinSweet CMS Filter
============================================== */
function reloadFinsweetCMS() {
  const oldScript = document.querySelector('script[src*="cmsfilter.js"]');
  if (oldScript) oldScript.remove();
  
  const newScript = document.createElement("script");
  newScript.src = "https://cdn.jsdelivr.net/npm/@finsweet/attributes-cmsfilter@1/cmsfilter.js";
  newScript.async = true;
  document.body.appendChild(newScript);
}

// Enhanced function to handle radio button selection in .type-list
function initTypeListRadioHandler() {
  document.addEventListener('click', (e) => {
    if (e.target.closest('.type-list .w-radio input[type="radio"]')) {
      // Use the enhanced initialization function for proper handling
      ensureProperInitializationAfterContentChange();
    }
  });
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
    
    // Clean up any existing smooth scrolling instance
    if (window.customSmoothScroll && typeof window.customSmoothScroll.destroy === 'function') {
        window.customSmoothScroll.destroy();
    }
    
    // Ensure scroll position is reset before initializing
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    


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
            
            // Wait for page to be fully loaded before enabling smooth scrolling
            const waitForPageLoad = () => {
                // Check if all scripts are loaded
                const scriptsLoaded = typeof gsap !== 'undefined' && 
                                    typeof ScrollTrigger !== 'undefined' && 
                                    typeof SplitText !== 'undefined';
                
                // Check if page is fully loaded
                const pageLoaded = document.readyState === 'complete';
                
                // Check if all animations are initialized and page is marked as fully loaded
                const animationsReady = !window.isInitializing && window.pageFullyLoaded;
                
                // Check if global scroll prevention is disabled
                const scrollEnabled = !scrollPreventionEnabled;
                
                if (scriptsLoaded && pageLoaded && animationsReady && scrollEnabled) {
                    console.log('Page fully loaded, enabling smooth scrolling...');
                    this.se = true;
                    this.fsu();
                    this.sl();
                } else {
                    // Wait a bit more and check again
                    setTimeout(waitForPageLoad, 100);
                }
            };
            
            // Start checking for page load
            waitForPageLoad();
            
            // Fallback: Enable smooth scrolling after 5 seconds maximum
            setTimeout(() => {
                if (!this.se) {
                    console.log('Fallback: Enabling smooth scrolling after timeout');
                    window.enableScrolling(); // Enable global scrolling
                    this.se = true;
                    this.fsu();
                    this.sl();
                }
            }, 5000);
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
                if (!this.se || d || (window.isMenuOpen && window.isMenuOpen()) || window.isGalleryOpen) return;
                const t = e.deltaY * this.wm;
                this.os(t);
                e.preventDefault();
            }, { passive: false });

            window.addEventListener("touchstart", (e) => {
                if (e.touches.length > 1) {
                    e.preventDefault(); // Prevent multi-touch gestures
                    return;
                }
                if (window.isMenuOpen && window.isMenuOpen() || window.isGalleryOpen) return;
                
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
                if (window.isMenuOpen && window.isMenuOpen() || window.isGalleryOpen) return;
                
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
                if (window.isMenuOpen && window.isMenuOpen() || window.isGalleryOpen) return;
                if (e.button === 2) {
                    this.rc = true;
                    return;
                }
                if (!this.rc) {
                    this.smd(e);
                }
            });

            window.addEventListener("mousemove", (e) => {
                if (window.isMenuOpen && window.isMenuOpen() || window.isGalleryOpen) return;
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
            if (!this.se || d || (window.isMenuOpen && window.isMenuOpen()) || document.querySelector('.menu-toggle').classList.contains('clicked') || document.body.classList.contains('fullscreen-active') || window.isGalleryOpen) return;
            this.ct = 0;
            this.v = t;
            this.dir = Math.sign(t);
            const l = document.documentElement.scrollHeight - window.innerHeight;
            this.ts = c(this.ts + t, 0, l);
        }

        std(e) {
            if (!this.se || d || (window.isMenuOpen && window.isMenuOpen()) || document.querySelector('.menu-toggle').classList.contains('clicked') || document.body.classList.contains('fullscreen-active')) return;
            this.dr = true;
            this.sy = e.touches[0].clientY;
        }

        otd(e) {
            if (!this.dr || !this.se || (window.isMenuOpen && window.isMenuOpen()) || document.querySelector('.menu-toggle').classList.contains('clicked') || document.body.classList.contains('fullscreen-active')) return;
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
            if (!this.se || this.rc || (window.isMenuOpen && window.isMenuOpen()) || document.querySelector('.menu-toggle').classList.contains('clicked') || document.body.classList.contains('fullscreen-active')) return;
            this.dr = true;
            this.sy = e.clientY;
        }

        omd(e) {
            if (!this.dr || !this.se || this.rc || (window.isMenuOpen && window.isMenuOpen()) || document.querySelector('.menu-toggle').classList.contains('clicked') || document.body.classList.contains('fullscreen-active')) return;
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
            const fullscreenActive = document.body.classList.contains('fullscreen-active');
            if (this.se && !mo && !fullscreenActive) {
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
        
        destroy() {
            // Stop the animation loop
            if (this.animationFrameId) {
                cancelAnimationFrame(this.animationFrameId);
                this.animationFrameId = null;
            }
            
            // Reset all state
            this.se = false;
            this.dr = false;
            this.isDragging = false;
            this.sliderTouchActive = false;
            
            // Reset scroll position
            this.ts = 0;
            this.cs = 0;
            this.smoothScrollX = 0;
            
            // Clean up DOM styles
            document.body.style.overflow = "";
            document.body.style.position = "";
            document.body.style.width = "";
            document.body.style.top = "";
            document.body.style.height = "";
            document.documentElement.style.scrollBehavior = "";
            document.documentElement.style.touchAction = "pan-x pan-y";
            
            // Remove all event listeners
            window.removeEventListener("wheel", this.handleWheel);
            window.removeEventListener("touchstart", this.handleTouchStart);
            window.removeEventListener("touchmove", this.handleTouchMove);
            window.removeEventListener("touchend", this.handleTouchEnd);
            window.removeEventListener("touchcancel", this.handleTouchEnd);
            window.removeEventListener("mousedown", this.handleDragStart);
            window.removeEventListener("mousemove", this.handleDragMove);
            window.removeEventListener("mouseup", this.handleDragEnd);
            window.removeEventListener("resize", this.calculateDimensions);
            
            // Reset scroll position to top
            window.scrollTo(0, 0);
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
        }
    }

    i = new S();
    
    // Store the instance globally for cleanup
    window.customSmoothScroll = i;

    window.toggleSmoothScroll = (e) => {
        if (i) {
            i.ts(e);
        }
    };
}






function initPageTransitions() {
  // Create transition element if it doesn't exist
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

  // Global page transition function
  function globalPageTransition(url, isPopState = false) {
    if (window.transitioning) {
      window.pendingNavigation = { url, isPopState };
      return;
    }

    window.transitioning = true;
    
    // Temporarily disable smooth scrolling during transition to prevent conflicts
    if (window.customSmoothScroll) {
      window.customSmoothScroll.se = false;
    }
    
    // Check if this is internal project navigation (staying within projects)
    const isInternalProjectNav = url.includes('/projects/') && window.location.pathname.includes('/projects/');
    
    // 2. Start transition animation
    const transition = document.querySelector('.transition');
    const swipeup = document.querySelector('.swipeup');
    const cursor = document.querySelector('.cursor');
    
    const transitionPromise = new Promise((resolve) => {
      const tl = gsap.timeline({ onComplete: resolve });
      tl.set(transition, { display: 'block', visibility: 'visible', opacity: 1 });
      tl.set(swipeup, { autoAlpha: 1, attr: { d: 'M 0 1 V 1 Q 0.5 1 1 1 V 1 z' } });
      tl.to(swipeup, { duration: 0.5, ease: 'power4.in', attr: { d: 'M 0 1 V 0.5 Q 0.5 0 1 0.5 V 1 z' } });
      tl.to(swipeup, { duration: 0.4, ease: 'power2', attr: { d: 'M 0 1 V 0 Q 0.5 0 1 0 V 1 z' } });
      tl.to(".header .logo img, .header .menu a", { yPercent: -130, duration: 0.5, stagger: 0.06, ease: "power1.out" }, 0);
      tl.to(".menu-toggle", { opacity: 0, duration: 0.5, ease: "power1.out" }, 0);
      tl.to(cursor, { scale: 0, duration: 0.2, ease: "power2.out" }, 0);
      tl.set(cursor, { visibility: "hidden" }, 0.2);
    });

    // 3. Fetch new page content
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

    // 4. Wait for both animation and fetch
    Promise.all([transitionPromise, fetchPromise])
      .then(async ([_, nextPage]) => {
        // 5. Swap content
        const container = document.querySelector('.page-wrapper');
        if (!container) return;

        document.title = nextPage.doc.querySelector('title')?.textContent || document.title;
        container.innerHTML = nextPage.nextWrapper.innerHTML;

        // 6. Ensure proper scroll position and reset smooth scrolling state
        ensureProperScrollPosition();
        
        // Reset smooth scrolling state to prevent conflicts
        if (window.customSmoothScroll) {
          window.customSmoothScroll.se = false;
          window.customSmoothScroll.dr = false;
          window.customSmoothScroll.isDragging = false;
          window.customSmoothScroll.sliderTouchActive = false;
        }

        // 7. Clean up ALL animations and instances (AFTER animation, BEFORE new functions)
        if (!isInternalProjectNav) {
          cleanupAllPageAnimations();
        } else {
          // For internal project navigation, only kill ScrollTriggers but preserve SplitText
          if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
          }
          gsap.killTweensOf("*");
        }
        
        // Ensure proper scroll position and reset any scroll-related state
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;

        // 8. Wait for scripts to be properly loaded
        await ensureScriptsLoadedAfterTransition();

        // 9. Initialize everything with proper sequencing and delays
        const isMobile = window.innerWidth < 650;
        const initializationDelay = isMobile ? 50 : 20; // Much shorter delay
        
        setTimeout(() => {
          initializePageAfterTransition();
        }, initializationDelay);

        // 10. Complete transition
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
            // Reset cursor
            gsap.set(cursor, { scale: 0, visibility: "visible" });
            gsap.set(".header .logo img, .header .menu a", { yPercent: 130 });
            gsap.set(".menu-toggle", { opacity: 0 });

            const inTl = gsap.timeline();
            inTl.to([".header .logo img", ".header .menu a"], { yPercent: 0, duration: 0.6, ease: "power1.out" }, 0);
            inTl.to(cursor, { scale: 1, duration: 0.4, ease: "power2.out" }, 0);
            inTl.to(".menu-toggle", { opacity: 1, duration: 1.5, ease: "power2.out" }, 0);

            // Hide transition
            transition.style.opacity = '0';
            transition.style.visibility = 'hidden';
            window.transitioning = false;

            // Initialize cursor
            if (!window.cursorInitialized) {
              initInteractiveCursor();
            }

            if (typeof initNavbarShowHide === 'function' && !window.navbarShowHide) {
              window.navbarShowHide = initNavbarShowHide();
            }

            // Re-enable smooth scrolling after transition is complete
            if (window.customSmoothScroll) {
              window.customSmoothScroll.se = true;
            }
            
            // Handle pending navigation
            if (window.pendingNavigation) {
              const { url, isPopState } = window.pendingNavigation;
              window.pendingNavigation = null;
              setTimeout(() => globalPageTransition(url, isPopState), 100);
            }
          }
        });
      })
      .catch(err => {
        window.location.href = url;
      });
  }

  // Set up global event listeners
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
    globalPageTransition(href);
  });

  window.addEventListener('popstate', () => {
    if (window.transitioning) {
      window.pendingNavigation = { url: location.href, isPopState: true };
      return;
    }
    globalPageTransition(location.href, true);
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
  const words = el.textContent.trim().split(/\s+/);
  if (words.length > wordLimit) {
    el.textContent = words.slice(0, wordLimit).join(' ') + '...';
  }
}

function cleanupAllPageAnimations() {
  // Don't cleanup if we're in the middle of initialization or fast scrolling
  if (window.isInitializing || window.isScrollingFast) {
    console.log('Skipping cleanup during initialization or fast scrolling');
    return;
  }
  
  // Kill ALL ScrollTriggers first
  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  }
  
  // Kill all GSAP animations
  gsap.killTweensOf("*");
  
  // Clean up SplitText instances more thoroughly
  if (typeof SplitText !== 'undefined') {
    // First, revert all SplitText instances
    document.querySelectorAll('*').forEach(element => {
      if (element._splitTextInstance?.revert) {
        try { 
          element._splitTextInstance.revert(); 
        } catch (e) {
          // If revert fails, manually clean up
          if (element._splitTextInstance.lines) {
            element._splitTextInstance.lines.forEach(line => {
              if (line && line.parentNode) {
                line.parentNode.removeChild(line);
              }
            });
          }
        }
        delete element._splitTextInstance;
      }
    });
    
    // Remove all .line elements that might be orphaned
    document.querySelectorAll('.line').forEach(line => {
      if (line && line.parentNode) {
        line.parentNode.removeChild(line);
      }
    });
    
    // Also remove any .word elements that might be left over
    document.querySelectorAll('.word').forEach(word => {
      if (word && word.parentNode) {
        word.parentNode.removeChild(word);
      }
    });
  }
  
  // Clean up custom instances
  if (window.customSmoothScroll?.destroy) {
    window.customSmoothScroll.destroy();
    window.customSmoothScroll = null;
  }
  if (window.cleanupCursor) window.cleanupCursor();
  if (window.navbarShowHide?.destroy) window.navbarShowHide.destroy();
  if (window.infinitySliderInstance?.destroy) window.infinitySliderInstance.destroy();
  
  // Reset initialization flags
  window.cursorInitialized = false;
  
  // Force a reflow to ensure cleanup is complete
  document.documentElement.offsetHeight;
}

function ensureProperScrollPosition() {
  // Reset smooth scrolling state if it exists
  if (window.customSmoothScroll) {
    window.customSmoothScroll.ts = 0;
    window.customSmoothScroll.cs = 0;
    window.customSmoothScroll.smoothScrollX = 0;
  }
  
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  document.documentElement.offsetHeight; // force reflow
}

function initializePageAfterTransition() {
  console.log('Initializing page after transition...');
  
  const isMobile = window.innerWidth < 650;
  console.log('Page transition - mobile:', isMobile);
  
  // Initialize everything in proper sequence
  initInfinityGallery();
  initDisplayToggle();
  moveShowAllIntoCollectionList();
  initNavbarShowHide();
  initTypeListRadioHandler();
  reloadFinsweetCMS();
  
  // Initialize smooth scrolling (disabled on mobile to prevent conflicts)
  initCustomSmoothScrolling();
  
      // Initialize animations with minimal delays
    setTimeout(() => {
      console.log('Initializing GSAP animations after transition...');
      initGsapAnimations();
      
      // Minimal delay for mobile to ensure everything is loaded
      const mobileDelay = isMobile ? 30 : 20;
      
      setTimeout(() => {
        console.log('Initializing SplitText animations after transition...');
        initSplitTextAnimations();
        
        // Refresh ScrollTrigger after all animations are set up
        if (typeof ScrollTrigger !== 'undefined') {
          console.log('Refreshing ScrollTrigger after transition...');
          ScrollTrigger.refresh(true);
        }
        
        // Single additional refresh for mobile
        if (isMobile) {
          setTimeout(() => {
            if (typeof ScrollTrigger !== 'undefined') {
              console.log('Additional ScrollTrigger refresh for mobile...');
              ScrollTrigger.refresh(true);
            }
          }, 100);
        }
        
        // Initialize video after all animations
        setTimeout(() => initHomeVideo(), 20);
      }, mobileDelay);
    }, 20);
  
  console.log('Page transition initialization complete');
}

function initSplitTextAnimations(scope = document) {
  console.log('Initializing SplitText animations...');
  
  if (typeof SplitText === 'undefined') {
    console.error('SplitText not available for animations');
    return;
  }
  
  if (typeof ScrollTrigger === 'undefined') {
    console.error('ScrollTrigger not available for SplitText animations');
    return;
  }
  
  const isMobile = window.innerWidth < 650;
  console.log('SplitText animations - mobile:', isMobile);

  const elements = scope.querySelectorAll("h1, h2, h3, h4, h5, h6, p");
  
  elements.forEach((element) => {
    // Skip if element already has SplitText or no content
    if (!element.textContent.trim()) return;
    
    // Clean up any existing SplitText instance first
    if (element._splitTextInstance?.revert) {
      try {
        element._splitTextInstance.revert();
      } catch (e) {
        // If revert fails, manually clean up
        if (element._splitTextInstance.lines) {
          element._splitTextInstance.lines.forEach(line => {
            if (line && line.parentNode) {
              line.parentNode.removeChild(line);
            }
          });
        }
      }
      delete element._splitTextInstance;
    }
    
    // Remove any existing .line elements
    element.querySelectorAll('.line').forEach(line => {
      if (line && line.parentNode) {
        line.parentNode.removeChild(line);
      }
    });

    try {
      const split = new SplitText(element, { type: "lines", linesClass: "line" });
      element._splitTextInstance = split;

      if (!split.lines || split.lines.length === 0) return;

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
          id: `splittext-${Math.random()}`,
          onEnter: () => tl.play()
        },
        paused: true
      });

      tl.to(split.lines, {
        yPercent: 0,
        clipPath: "inset(-20% -10% -20% 0%)",
        opacity: 1,
        stagger: 0.12,
        duration: 1.2,
        delay: element.closest(".hero, .delay") ? 0.5 : 0,
        ease: "power4.out"
      });
    } catch (error) {
      if (element._splitTextInstance) delete element._splitTextInstance;
    }
  });
}




/* ==============================================
Page GSAP Animations
============================================== */


function initGsapAnimations() {
    console.log('Initializing GSAP animations...');
    
    // Verify GSAP and ScrollTrigger are available
    if (typeof gsap === 'undefined') {
      console.error('GSAP not available for animations');
      return;
    }
    
    if (typeof ScrollTrigger === 'undefined') {
      console.error('ScrollTrigger not available for animations');
      return;
    }
    
    // Ensure we're at the top of the page before creating animations
    ensureProperScrollPosition();
    
    const isMobile = window.innerWidth < 650;
    console.log('GSAP animations - mobile:', isMobile);
    
    // Kill any existing ScrollTriggers to prevent conflicts
    ScrollTrigger.getAll().forEach(trigger => {
      if (trigger.vars.id && trigger.vars.id.includes('gsap-animation')) {
        trigger.kill();
      }
    });
    
    // For mobile, ensure native scrolling is enabled
    if (isMobile) {
      // Reset any custom scroll behavior that might interfere
      document.body.style.overflow = '';
      document.documentElement.style.scrollBehavior = '';
      document.documentElement.style.touchAction = 'pan-x pan-y';
    }

  // Common animations for all pages
  gsap.fromTo(".clipping-video, .about-hero-image", 
    { clipPath: "inset(100% 0% 0% 0%)" }, 
    { 
      clipPath: "inset(0% 0% 0% 0%)", 
      delay: 0.6,
      duration: 1.2, 
      ease: "power4.inOut" 
    }
  );


  gsap.fromTo(".about-hero-image, .about-values .image", 
    { clipPath: "inset(0% 0% 0% 100%)" }, 
    { 
      clipPath: "inset(0% 0% 0% 0%)", 
      delay: 0.4,
      duration: 1.2, 
      stagger: 0.1,
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
        invalidateOnRefresh: true,
        id: "gsap-animation-video-visual"
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
      id: "hero-pin",
      onEnter: () => {
        // Only disable other ScrollTriggers that are not essential
        ScrollTrigger.getAll().forEach(st => {
          if (st.vars.id && !st.vars.id.includes('hero') && !st.vars.id.includes('splittext')) {
            st.disable();
          }
        });
      },
      onLeave: () => {
        // Re-enable all ScrollTriggers
        ScrollTrigger.getAll().forEach(st => st.enable());
      }
    });
  }

  // Work thumbnail animations
  document.querySelectorAll('.work-thumbnail .image-wrapper img').forEach((img, index) => {
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
          scrub: 1.2,
          id: `gsap-animation-thumbnail-${index}`
        }
      }
    );
  });

  // Logo animations
  gsap.set(".home-about .logo", { opacity: 0, visibility: "hidden" });
  gsap.utils.toArray(".home-about .logo").forEach((logo, index) => {
    gsap.to(logo, {
      opacity: 1,
      visibility: "visible",
      duration: 2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: logo,
        start: "top 80%",
        toggleActions: "play none none none",
        id: `gsap-animation-logo-${index}`
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
          id: "gsap-animation-hero-headline"
        }
      }
    );
  }

  // Image parallax animations
  document.querySelectorAll('.home-container .image img, .about-hero-image img, .about-values .image img, .property .image img, .place .image img, .footer-image img').forEach((img, index) => {
    gsap.fromTo(img, {
      yPercent: -10,
      transformOrigin: "center center",
    }, {
      yPercent: 10,
      transformOrigin: "center center", 
      ease: "none",
      scrollTrigger: {
        trigger: img,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
        id: `gsap-animation-parallax-${index}`
      }
    });
  });



  
  // Left to right animations
  gsap.utils.toArray(".left-to-right").forEach((img, index) => {
    gsap.fromTo(img, 
      { clipPath: "inset(0 100% 0 0)" }, 
      {
        clipPath: "inset(0 0% 0 0)",
        duration: 2.5,
        delay: -1,
        ease: "expo.inOut",
        scrollTrigger: {
          trigger: img,
          start: "top 95%",
          toggleActions: "play none none none",
          id: `gsap-animation-left-right-${index}`
        }
      }
    );
  });

  // Right to left animations
  gsap.utils.toArray(".right-to-left").forEach((img, index) => {
    gsap.fromTo(img, 
      { clipPath: "inset(0 0 0 100%)" }, 
      {
        clipPath: "inset(0 0 0 0%)",
        duration: 2.5,
        delay: -1,
        ease: "expo.inOut",
        scrollTrigger: {
          trigger: img,
          start: "top 95%",
          toggleActions: "play none none none",
          id: `gsap-animation-right-left-${index}`
        }
      }
    );
  });


 

  // Icon animations
  gsap.utils.toArray(".content .icon").forEach((icon, index) => {
    gsap.fromTo(icon, 
      { clipPath: "circle(0% at 50% 50%)" }, 
      {
        clipPath: "circle(100% at 50% 50%)",
        duration: 2.5,
        ease: "power3.out",
        scrollTrigger: {
          trigger: icon,
          start: "top 85%",
          toggleActions: "play none none none",
          id: `gsap-animation-icon-${index}`
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
  document.querySelectorAll(".bullet").forEach((el, index) => {
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: "top 80%",
        toggleActions: "play none none none",
        id: `gsap-animation-bullet-${index}`
      },
      opacity: 0,
      y: 100,
      clipPath: "inset(8% 8% 8% 8%)",
      duration: 1.3,
      ease: "power3.out"
    });
  });
  
  
  document.querySelectorAll(".w-input, .w-select").forEach((el, index) => {
    gsap.fromTo(el, {
      clipPath: "inset(0 0 0 100%)"
    }, {
      clipPath: "inset(0 0 0 0%)",
      duration: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: el,
        start: "top 90%",
        toggleActions: "play none none none",
        id: `gsap-animation-input-${index}`
      }
    });
  });


  gsap.from(".collection-list-1 div, .collection-list-1 .w-dyn-items", {
    yPercent: 200,
    duration: 1,
    ease: "power2.out",
    stagger: 0.030,
    scrollTrigger: {
      trigger: ".collection-list-1",
      start: "top 90%",
      toggleActions: "play none none none",
      id: "gsap-animation-collection-list"
    }
  });

  // Sticky stacking cards effect for .home-container sections
  const homeContainers = document.querySelectorAll('.home-container');
  if (homeContainers.length > 1) {
    // Set initial z-index for all containers
    homeContainers.forEach((container, index) => {
      gsap.set(container, { zIndex: (index * 2) + 1 });
    });
    
    homeContainers.forEach((container, index) => {
      const nextContainer = homeContainers[index + 1];
      
      // Apply stacking effect to all sections including the 4th (index 3)
      if (index <= 3) {
        // Create a ScrollTrigger for each container
        ScrollTrigger.create({
          trigger: container,
          start: "top top",
          end: `+=${window.innerHeight * 2}`,
          pin: true,
          pinSpacing: false,
          id: `gsap-animation-stack-${index}`,
          onUpdate: (self) => {
            // Calculate progress and apply stacking effect
            const progress = self.progress;
            
            // Animate the ::after pseudo-element from opacity 0 to 0.5
            gsap.set(container, {
              '--after-opacity': progress * 0.4
            });
          },
          onEnter: () => {
            // When entering this section, set it to z-index based on index
            gsap.set(container, { zIndex: (index * 2) + 1 });
            // Set next section to higher z-index
            if (nextContainer) {
              gsap.set(nextContainer, { zIndex: ((index + 1) * 2) + 1 });
            }
          },
          onLeave: () => {
            // Keep current section at its z-index
            gsap.set(container, { zIndex: (index * 2) + 1 });
            // Reset next section to its proper z-index
            if (nextContainer) {
              gsap.set(nextContainer, { zIndex: ((index + 1) * 2) + 1 });
            }
          }
        });
      } else {
        // Sections after the 4th - pin them normally
        ScrollTrigger.create({
          trigger: container,
          start: "top top",
          end: "bottom top",
          pin: true,
          pinSpacing: true,
          id: `gsap-animation-stack-pin-${index}`
        });
      }
    });
  }


  gsap.to(".display-toggle", {
    scrollTrigger: {
      trigger: ".display-toggle", 
      start: "top top",
      end: "+=200px",
      scrub: true,
      id: "gsap-animation-display-toggle",
      onUpdate: self => {
        const el = document.querySelector(".display-toggle");
        if (self.progress >= 1) {
          el.style.visibility = "hidden";
          el.style.pointerEvents = "none";
        } else {
          el.style.visibility = "visible"; 
          el.style.pointerEvents = "auto";
        }
      }
    },
    opacity: 0,
  });

  gsap.from(".display-toggle", {
    scale: 0,
    y:50,
    duration: 1.2,
    ease: "power4.out",
    delay: 0.5,
  });

}




function resetInteractiveCursor() {
  // Cancel animation frame
  if (window.cursorAnimationFrame) {
    cancelAnimationFrame(window.cursorAnimationFrame);
    window.cursorAnimationFrame = null;
  }

  // Run cleanup function if it exists
  if (window.cleanupCursor && typeof window.cleanupCursor === 'function') {
    window.cleanupCursor();
    window.cleanupCursor = null;
  }

  // Remove all cursor event listeners
  document.removeEventListener("mousemove", window.cursorMouseMove);
  document.removeEventListener("mousedown", window.cursorMouseDown);
  document.removeEventListener("mousemove", window.cursorMouseMoveDrag);
  document.removeEventListener("mouseup", window.cursorMouseUp);

  // Reset cursor element
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

  // Clear any stored references
  window.cursorMouseMove = null;
  window.cursorMouseDown = null;
  window.cursorMouseMoveDrag = null;
  window.cursorMouseUp = null;
}

function initInteractiveCursor() {

  const cursor = document.querySelector("#cursor");
  if (!cursor) return;

  // Prevent multiple initializations - if already initialized, just return
  if (window.cursorInitialized) {
    return;
  }

  // Reset cursor first
  resetInteractiveCursor();

  const mouse = { x: -100, y: -100 };
  let isMoving = false;
  let isDragging = false;
  let cursorLocked = false;
  let cursorAnimationFrame;
  let dragTimeout;

  // Store event listener references for proper cleanup
  window.cursorMouseMove = function(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    isMoving = true;
  };

  window.cursorMouseDown = function() {
    dragTimeout = setTimeout(() => {
      isDragging = true;
      cursor.classList.add("drag");
    }, 150);
  };

  window.cursorMouseMoveDrag = function() {
    if (isDragging) cursor.classList.add("drag");
  };

  window.cursorMouseUp = function() {
    if (isDragging) {
      isDragging = false;
      cursor.classList.remove("drag");
    }
    clearTimeout(dragTimeout);
  };

  function resetCursor() {
    if (!cursorLocked) {
      cursor.classList.remove("change", "explore", "drag", "scroll", "enter", "play", "slide");
    }
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

  // Initialize cursor appearance - start at scale 0 and animate to scale 1
  gsap.set(cursor, {
    scale: 0,
    opacity: 1,
    visibility: "visible"
  });
  
  gsap.to(cursor, {
    scale: 1,
    duration: 0.4,
    ease: "power2.out"
  });

  // Add event listeners
  document.addEventListener("mousemove", window.cursorMouseMove);
  document.addEventListener("mousedown", window.cursorMouseDown);
  document.addEventListener("mousemove", window.cursorMouseMoveDrag);
  document.addEventListener("mouseup", window.cursorMouseUp);

  // Add hover effects
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

  // Start animation loop
  animateCursor();

  // Store animation frame reference
  window.cursorAnimationFrame = cursorAnimationFrame;
  
  // Create cleanup function
  window.cleanupCursor = function () {
    cancelAnimationFrame(cursorAnimationFrame);
    document.removeEventListener("mousemove", window.cursorMouseMove);
    document.removeEventListener("mousedown", window.cursorMouseDown);
    document.removeEventListener("mousemove", window.cursorMouseMoveDrag);
    document.removeEventListener("mouseup", window.cursorMouseUp);
    window.cursorInitialized = false;
  };
  
  // Mark as initialized
  window.cursorInitialized = true;
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
  try {
    // Destroy the previous instance if it exists
    if (window.infinitySliderInstance) {
      window.infinitySliderInstance.destroy();
      window.infinitySliderInstance = null;
    }

    const sliderWrapper = document.querySelector(".slider-wrapper");
    
    if (!sliderWrapper) {
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
      // Create modal container if it doesn't exist
      if (!document.querySelector('.fullscreen-modal')) {
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
      this.items.forEach((item, index) => {
        if (!item.querySelector('.expand-icon')) {
          const expandIcon = document.createElement('div');
          expandIcon.className = 'expand-icon';
          item.appendChild(expandIcon);
          
          // Use both click and touchend for better Safari support
          const handleExpand = (e) => {
            e.preventDefault();
            e.stopPropagation();
            const img = item.querySelector('img');
            this.openFullscreen(img);
          };
          
          expandIcon.addEventListener('click', handleExpand);
          expandIcon.addEventListener('touchend', handleExpand);
        }
      });
    }

    openFullscreen(img) {
      if (!this.modal || !img) return;

      if (this.currentAnimation) {
        this.currentAnimation.kill();
      }
      
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
    }

    enableScroll() {
      // Re-enable the infinity gallery scrolling
      this.scrollEnabled = true;
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

  cleanupSlides() {
    // Kill any ongoing animations first
    gsap.killTweensOf(this.slides);
    
    // Clean up all slides to ensure no partial clipPath states
    this.slides.forEach((slide, index) => {
      if (index === this.currentSlide) {
        // Current slide should be fully visible
        gsap.set(slide, {
          opacity: 1,
          clipPath: 'inset(0% 0% 0% 0%)',
          zIndex: 1
        });
      } else {
        // All other slides should be completely hidden
        gsap.set(slide, {
          opacity: 0,
          clipPath: 'inset(0% 0% 0% 0%)',
          zIndex: 0
        });
      }
    });
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
    }
  }

      window.infinitySliderInstance = new InfiniteHorizontalScroll(sliderWrapper);
  } catch (error) {
    // Infinity gallery initialization skipped
  }
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
                        .catch(() => {});
                }
            });
        });

        const placeholder = document.createElement('div');
        placeholder.dataset.lazyScript = src;
        document.body.appendChild(placeholder);
        observer.observe(placeholder);
    });
}



// Replace the old initialization
document.addEventListener("DOMContentLoaded", initializeApplication);






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
  
  // Get responsive values for menu bar animation
  const isMobile = window.innerWidth < 650;
  const bar1TargetTop = isMobile ? 'calc(50% - 0vw)' : 'calc(50% - 0vw)'; // Both animate to center
  const bar2TargetTop = isMobile ? 'calc(50% + -1.5vw)' : 'calc(50% + 0vw)'; // Both animate to center
  
  tl.to(overlay, { opacity: 0.2, duration: ANIMATION.duration, ease: ANIMATION.ease }, 0)
    .to(megaMenu, { clipPath: 'inset(0% 0% 0% 0%)', duration: ANIMATION.duration, ease: ANIMATION.ease }, 0)
    .to('.mega-menu .mega-menu-image', { clipPath: 'inset(0% 0% 0% 0%)', duration: ANIMATION.duration, ease: ANIMATION.ease, delay: 0.050, }, 0)
    .to('.mega-menu .mega-menu-image img', { 
        scale: 1,
        duration: ANIMATION.duration * 1.5,
        ease: "power4.out"
    }, 0)
    .to(bars[0], { 
        top: bar1TargetTop, 
        opacity: 1, 
        duration: ANIMATION.duration * 0.5, 
        ease: "power2.inOut"
    }, 0)
    .to(bars[1], { 
        top: bar2TargetTop, 
        opacity: 1, 
        duration: ANIMATION.duration * 0.5, 
        ease: "power2.inOut"
    }, 0)
    .to(bars[0], {
        backgroundColor: '#fff',
        duration: ANIMATION.duration * 0.6,
        ease: "power2.inOut"
    }, ">0")
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


function initHomeVideo() {
    try {
        const videoContainer = document.getElementById("video-container");
        if (!videoContainer) {
            return;
        }

        const isMobile = window.innerWidth < 650;

        const videoSrc = isMobile
          ? "https://dl.dropboxusercontent.com/scl/fi/gm583t9zyvgvod17q6hdo/new-compress-realevate-video.mp4?rlkey=5f7yah6abdw86sbwtcggur9ss&st=1sak29je"
          : "https://dl.dropboxusercontent.com/scl/fi/eho27k48508vch2mbv8zq/realevate-video-home.mp4?rlkey=4myqzpdvlo4n51iqs5fwebxg6&st=eimahbyc&raw=1";

        const video = document.createElement("video");
        video.autoplay = true;
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.preload = "auto"; // Load video immediately

        const source = document.createElement("source");
        source.src = videoSrc;
        source.type = "video/mp4";

        video.appendChild(source);
        
        // Add video to container immediately
        videoContainer.appendChild(video);
        
    } catch (error) {
        // Home video initialization skipped
    }
}

/* ==============================================
Display Toggle and Fullscreen Gallery Functionality
============================================== */

function initDisplayToggle() {
  const displayToggle = document.querySelector('.display-toggle');
  const gridBtn = document.querySelector('.grid-btn');
  const galleryBtn = document.querySelector('.gallery-btn');
  const fullscreenGallery = document.querySelector('.fullscreen-gallery');
  const homeProperties = document.querySelector('.home-properties');
  
  // Global variable to track gallery state for smooth scrolling
  window.isGalleryOpen = false;
  
  if (!displayToggle || !gridBtn || !galleryBtn || !fullscreenGallery) {
    return;
  }

  let currentView = 'grid';
  let galleryInstance = null;
  let isToggleAnimating = false; // Prevent rapid toggle clicks

  function populateGallery() {
    const gallerySlider = document.querySelector('.gallery-slider');
    const galleryCounter = document.querySelector('.gallery-counter');
    const properties = document.querySelectorAll('.home-properties-grid .property');
    
    if (!gallerySlider || properties.length === 0) return;

    // Clear existing slides and event listeners
    gallerySlider.innerHTML = '';
    
    properties.forEach((property, index) => {
      const img = property.querySelector('img');
      const name = property.querySelector('.name');
      const price = property.querySelector('.price');
      const info = property.querySelector('.info');
      const link = property.getAttribute('href');
      
      if (img && name) {
        createGallerySlide(gallerySlider, null, img, name, price, info, link, index);
      }
    });
    
    // Update the counter with total slides
    if (galleryCounter) {
      const totalSlides = gallerySlider.children.length;
      const totalSlidesSpan = galleryCounter.querySelector('.total-slides');
      if (totalSlidesSpan) {
        totalSlidesSpan.textContent = totalSlides;
      }
    }
  }

  function createGallerySlide(slider, indicators, img, name, price, info, link, index) {
    // Create slide
    const slide = document.createElement('div');
    slide.className = 'gallery-slide';
    slide.dataset.index = index;
    
    // Create the link wrapper
    const linkWrapper = document.createElement('a');
    linkWrapper.href = link || '#';
    linkWrapper.className = 'gallery-slide-link';
    
    // Set the slide content inside the link
    linkWrapper.innerHTML = `
      <img src="${img.src}" alt="${img.alt}" loading="lazy">
      <div class="gallery-slide-content">
        <h3>${name.textContent}</h3>
        ${price ? `<h4>${price.textContent}</h4>` : ''}
        ${info ? `<p>${info.textContent}</p>` : ''}
      </div>
    `;
    
    // Add the link wrapper to the slide
    slide.appendChild(linkWrapper);
    
    // Let the global event listener handle the navigation
    // This ensures the same SVG wave animation as other site links
    linkWrapper.addEventListener('click', (e) => {
      // Don't handle clicks on gallery navigation elements
      if (e.target.closest('.gallery-nav')) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      
      // Animate mega-menu-overlay to opacity 0 when gallery slide is clicked
      const overlay = document.querySelector('.mega-menu-overlay');
      if (overlay) {
        gsap.to(overlay, {
          opacity: 0,
          duration: 1.2,
          ease: 'power4.inOut'
        });
      }
      
      // Ensure proper navigation for gallery slide links
      // The global event listener should handle this, but let's make sure
      if (link && link !== '#') {
        e.preventDefault();
        history.pushState({ title: document.title }, '', link);
        globalPageTransition(link);
      }
    });
    
    slider.appendChild(slide);
  }



  function switchToGrid() {
    // Kill any ongoing gallery animations
    gsap.killTweensOf(fullscreenGallery);
    
    // Destroy existing gallery instance if it exists
    if (galleryInstance && typeof galleryInstance.destroy === 'function') {
      galleryInstance.destroy();
      galleryInstance = null;
    }
    
    isToggleAnimating = true;
    currentView = 'grid';
    window.isGalleryOpen = false; // Reset global flag for smooth scrolling
    gridBtn.classList.add('active');
    galleryBtn.classList.remove('active');
    
    // Animate mega-menu-overlay opacity back to 0
    const overlay = document.querySelector('.mega-menu-overlay');
    if (overlay) {
      gsap.to(overlay, {
        opacity: 0,
        duration: 1.2,
        ease: 'power4.inOut'
      });
    }
    
    // Animate header opacity back to 1
    const header = document.querySelector('.header');
    if (header) {
      gsap.to(header, {
        opacity: 1,
        pointerEvents: 'auto',
        duration: 0.8,
        ease: 'power4.inOut'
      });
    }
    
    // Show grid immediately
    if (homeProperties) homeProperties.style.display = 'block';
    
    // Clean clipPath exit animation from left to right
    gsap.to(fullscreenGallery, {
      clipPath: 'inset(0% 100% 0% 0%)',
      duration: 1.2,
      ease: 'power4.inOut',
      onComplete: () => {
        fullscreenGallery.classList.remove('active');
        gsap.set(fullscreenGallery, { visibility: 'hidden' });
        isToggleAnimating = false; // Re-enable toggle after animation
      }
    });
    
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
  }

  function switchToGallery() {
    // Kill any ongoing gallery animations
    gsap.killTweensOf(fullscreenGallery);
    
    // Destroy existing gallery instance if it exists
    if (galleryInstance && typeof galleryInstance.destroy === 'function') {
      galleryInstance.destroy();
      galleryInstance = null;
    }
    
    isToggleAnimating = true;
    currentView = 'gallery';
    window.isGalleryOpen = true; // Set global flag for smooth scrolling
    galleryBtn.classList.add('active');
    gridBtn.classList.remove('active');
    
    populateGallery();
    
    // Create gallery instance immediately and set first slide properly
    galleryInstance = new FullscreenGallery();
    
    // Ensure first slide is set correctly before animation
    if (galleryInstance.slides && galleryInstance.slides.length > 0) {
      gsap.set(galleryInstance.slides[0], { 
        opacity: 1,
        clipPath: 'inset(0% 0% 0% 0%)',
        zIndex: 1
      });
    }
    
    // Animate mega-menu-overlay opacity to 0.4
    const overlay = document.querySelector('.mega-menu-overlay');
    if (overlay) {
      gsap.to(overlay, {
        opacity: 0.4,
        duration: 1.2,
        ease: 'power4.inOut'
      });
    }
    
    // Animate header opacity to 0
    const header = document.querySelector('.header');
    if (header) {
      gsap.to(header, {
        opacity: 0,
        duration: 0.8,
        pointerEvents: 'none',
        ease: 'power4.inOut'
      });
    }
    
    // Keep grid visible, set gallery initial clipPath state
    gsap.set(fullscreenGallery, { 
      visibility: 'visible',
      opacity: 1,
      clipPath: 'inset(0% 0% 0% 100%)'
    });
    
    // Animate gallery entrance from right to left
    gsap.to(fullscreenGallery, {
      clipPath: 'inset(0% 0% 0% 0%)',
      duration: 1.2,
      ease: 'power4.inOut',
      onComplete: () => {
        fullscreenGallery.classList.add('active');
        // Hide grid after gallery entrance completes
        if (homeProperties) homeProperties.style.display = 'none';
        isToggleAnimating = false; // Re-enable toggle after animation
      }
    });
    
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
  }

  function setupEventListeners() {
    gridBtn.addEventListener('click', switchToGrid);
    galleryBtn.addEventListener('click', switchToGallery);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && currentView === 'gallery') {
        switchToGrid();
      }
    });
  }

  setupEventListeners();
  switchToGrid();
}

// Fullscreen Gallery Class
class FullscreenGallery {
  constructor() {
    this.slides = document.querySelectorAll('.gallery-slide');
    this.prevBtn = document.querySelector('.gallery-prev');
    this.nextBtn = document.querySelector('.gallery-next');
    this.currentSlide = 0;
    this.totalSlides = this.slides.length;
    this.isAnimating = false;
    this.pendingSlide = null; // Track pending slide requests
    
    if (this.totalSlides === 0) return;
    
    this.init();
  }

  init() {
    // Set initial state for all slides without animation
    this.slides.forEach((slide, index) => {
      if (index === 0) {
        gsap.set(slide, { 
          opacity: 1,
          clipPath: 'inset(0% 0% 0% 0%)',
          zIndex: 1
        });
      } else {
        gsap.set(slide, { 
          opacity: 0,
          clipPath: 'inset(0% 0% 0% 0%)',
          zIndex: 0
        });
      }
    });
    
    // Update counter
    this.updateCounter();
    
    this.bindEvents();
  }

  bindEvents() {
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.prevSlide());
    }
    
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.nextSlide());
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        this.prevSlide();
      } else if (e.key === 'ArrowRight') {
        this.nextSlide();
      }
    });

    // Touch/swipe support
    let startX = 0;
    let startY = 0;
    let endX = 0;
    let endY = 0;

    document.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
      endX = e.changedTouches[0].clientX;
      endY = e.changedTouches[0].clientY;
      
      const diffX = startX - endX;
      const diffY = startY - endY;
      
      // Check if horizontal swipe is more significant than vertical
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        if (diffX > 0) {
          this.nextSlide();
        } else {
          this.prevSlide();
        }
      }
    }, { passive: true });
  }

  showSlide(index) {
    // If already animating, queue this request
    if (this.isAnimating) {
      this.pendingSlide = index;
      return;
    }
    
    // Kill any ongoing animations first
    gsap.killTweensOf(this.slides);
    
    // Update current slide immediately
    const previousSlide = this.currentSlide;
    this.currentSlide = index;
    this.isAnimating = true;
    
    const currentSlide = this.slides[previousSlide];
    const nextSlide = this.slides[index];
    const direction = index > previousSlide ? 1 : -1; // 1 for next, -1 for previous
    
    // Update counter
    this.updateCounter();
    
    // Clean slide transition animation using only clipPath
    const timeline = gsap.timeline({
      onComplete: () => {
        this.isAnimating = false;
        // Only clean up after the full animation is complete
        this.cleanupSlides();
        
        // Check if there's a pending slide request
        if (this.pendingSlide !== null) {
          const pendingIndex = this.pendingSlide;
          this.pendingSlide = null;
          this.showSlide(pendingIndex);
        }
      },
      onInterrupt: () => {
        this.isAnimating = false;
        // Ensure cleanup happens even if interrupted
        this.cleanupSlides();
        
        // Check if there's a pending slide request
        if (this.pendingSlide !== null) {
          const pendingIndex = this.pendingSlide;
          this.pendingSlide = null;
          this.showSlide(pendingIndex);
        }
      }
    });

    // Set initial states
    const nextClipPath = direction === 1 ? 'inset(0% 0% 0% 100%)' : 'inset(0% 100% 0% 0%)';
    const currentClipPath = direction === 1 ? 'inset(0% 100% 0% 0%)' : 'inset(0% 0% 0% 100%)';

    timeline
      .set(nextSlide, { 
        opacity: 1, 
        clipPath: nextClipPath,
        zIndex: 2
      })
      .set(currentSlide, { zIndex: 1 })
      .to(currentSlide, { 
        clipPath: currentClipPath,
        duration: 1.2, 
        ease: 'power4.inOut' 
      }, 0)
      .to(nextSlide, { 
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 1.2, 
        ease: 'power4.inOut' 
      }, 0)
      // Only hide the previous slide after the full clipPath animation is complete
      .to(currentSlide, { opacity: 0, duration: 0.1 }, 1.2);
  }

  nextSlide() {
    const nextIndex = (this.currentSlide + 1) % this.totalSlides;
    this.showSlide(nextIndex);
  }

  prevSlide() {
    const prevIndex = this.currentSlide === 0 ? this.totalSlides - 1 : this.currentSlide - 1;
    this.showSlide(prevIndex);
  }

  goToSlide(index) {
    if (index >= 0 && index < this.totalSlides) {
      this.showSlide(index);
    }
  }

  updateCounter() {
    const counter = document.querySelector('.gallery-counter .current-slide');
    if (counter) {
      counter.textContent = this.currentSlide + 1;
    }
  }

  cleanupSlides() {
    // Kill any ongoing animations first
    gsap.killTweensOf(this.slides);
    
    // Clean up all slides to ensure no partial clipPath states
    this.slides.forEach((slide, index) => {
      if (index === this.currentSlide) {
        // Current slide should be fully visible
        gsap.set(slide, {
          opacity: 1,
          clipPath: 'inset(0% 0% 0% 0%)',
          zIndex: 1
        });
      } else {
        // All other slides should be completely hidden
        gsap.set(slide, {
          opacity: 0,
          clipPath: 'inset(0% 0% 0% 0%)',
          zIndex: 0
        });
      }
    });
  }

  destroy() {
    // Kill any ongoing animations
    gsap.killTweensOf(this.slides);
    
    // Remove event listeners if needed
    if (this.prevBtn) {
      this.prevBtn.removeEventListener('click', () => this.prevSlide());
    }
    if (this.nextBtn) {
      this.nextBtn.removeEventListener('click', () => this.nextSlide());
    }
  }
}

// Initialize display toggle when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initDisplayToggle();
});

// Add to the existing initialization functions
function initializeApplication() {
  // ... existing initialization code ...
  
  // Initialize display toggle
  initDisplayToggle();
}

function forceRefreshSplitTextAnimations() {
  // Kill any existing SplitText animations
  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.getAll().forEach(trigger => {
      if (trigger.vars && trigger.vars.id && trigger.vars.id.includes('splittext')) {
        trigger.kill();
      }
    });
  }
  
  // Clean up any existing SplitText instances
  const allElements = document.querySelectorAll('*');
  allElements.forEach(element => {
    if (element._splitTextInstance && element._splitTextInstance.revert) {
      try {
        element._splitTextInstance.revert();
      } catch (error) {
        // Error reverting SplitText instance during force refresh
      }
      delete element._splitTextInstance;
    }
  });
  
  // Remove any orphaned .line elements
  document.querySelectorAll('.line').forEach(line => {
    if (line && line.parentNode) {
      line.parentNode.removeChild(line);
    }
  });
  
  // Also remove any .word elements that might be left over
  document.querySelectorAll('.word').forEach(word => {
    if (word && word.parentNode) {
      word.parentNode.removeChild(word);
    }
  });
  
  // Re-initialize SplitText animations
  setTimeout(() => {
    if (typeof initSplitTextAnimations === 'function') {
      initSplitTextAnimations();
      
      // Refresh ScrollTrigger after re-initialization
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh(true);
      }
    }
  }, 100);
}

// Make force refresh function globally available for debugging
window.forceRefreshSplitTextAnimations = forceRefreshSplitTextAnimations;

// Add debugging function to check SplitText status
function debugSplitTextStatus() {
  const elementsWithSplitText = document.querySelectorAll('*').length;
  const lineElements = document.querySelectorAll('.line').length;
  const scrollTriggers = typeof ScrollTrigger !== 'undefined' ? ScrollTrigger.getAll().filter(t => t.vars && t.vars.id && t.vars.id.includes('splittext')).length : 0;
  
  return {
    totalElements: elementsWithSplitText,
    lineElements: lineElements,
    splitTextScrollTriggers: scrollTriggers,
    splitTextAvailable: typeof SplitText !== 'undefined'
  };
}

// Function to properly clean up and reinitialize everything
function cleanupAndReinitializeAll() {
  // First, clean up everything
  cleanupAllPageAnimations();
  
  // Then reinitialize everything in the proper sequence
  setTimeout(() => {
    initializePageAfterTransition();
  }, 50);
}

// Make cleanup and reinitialize function globally available
window.cleanupAndReinitializeAll = cleanupAndReinitializeAll;

window.handleProjectsPageFilterChanges = handleProjectsPageFilterChanges;

window.debugSplitTextStatus = debugSplitTextStatus;

// Enhanced global handler for all radio button changes (including CMS filters)
document.addEventListener('click', (e) => {
  const radioButton = e.target.closest('.w-radio input[type="radio"]');
  if (radioButton) {
    // Use the enhanced initialization function for proper handling
    ensureProperInitializationAfterContentChange();
  }
});

// Global resize handler for all GSAP functions
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh(true);
    }
    if (typeof gsap !== 'undefined') {
      gsap.set("*", { clearProps: "transform" });
    }
  }, 100);
});

// Enhanced mobile scroll handler to refresh ScrollTrigger after scrolling
let scrollTimeout;
let isScrollingFast = false;
let scrollCount = 0;
let lastScrollTime = 0;

window.addEventListener('scroll', () => {
  const isMobile = window.innerWidth < 650;
  const currentTime = Date.now();
  
  // Detect fast scrolling
  if (currentTime - lastScrollTime < 50) {
    scrollCount++;
    if (scrollCount > 3) {
      isScrollingFast = true;
      window.isScrollingFast = true; // Set global flag
    }
  } else {
    scrollCount = 0;
    isScrollingFast = false;
    window.isScrollingFast = false; // Clear global flag
  }
  
  lastScrollTime = currentTime;
  
  if (isMobile && typeof ScrollTrigger !== 'undefined' && !isScrollingFast) {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      // Only refresh if not scrolling fast
      if (!isScrollingFast) {
        forceRefreshScrollTriggerMobile();
      }
    }, 200); // Increased delay to prevent rapid refreshes
  }
});

// Reset fast scrolling flag when scrolling stops
let scrollEndTimeout;
window.addEventListener('scroll', () => {
  clearTimeout(scrollEndTimeout);
  scrollEndTimeout = setTimeout(() => {
    isScrollingFast = false;
    window.isScrollingFast = false;
  }, 300);
});

// Function to ensure proper ScrollTrigger refresh after page transitions
function ensureScrollTriggerRefresh() {
  if (typeof ScrollTrigger !== 'undefined') {
    // Force a refresh of all ScrollTriggers
    ScrollTrigger.refresh(true);
    
    // Also refresh any SplitText animations that might need it
    setTimeout(() => {
      if (typeof initSplitTextAnimations === 'function') {
        initSplitTextAnimations();
      }
      
      // Additional refresh after a delay to ensure everything is properly set up
      setTimeout(() => {
        ScrollTrigger.refresh(true);
      }, 100);
    }, 50);
  }
}

// Make the function globally available
window.ensureScrollTriggerRefresh = ensureScrollTriggerRefresh;

// Function to verify all scripts are properly loaded
function verifyScriptsLoaded() {
  const scripts = {
    gsap: typeof gsap !== 'undefined',
    scrollTrigger: typeof ScrollTrigger !== 'undefined',
    splitText: typeof SplitText !== 'undefined',
    scrollToPlugin: typeof ScrollToPlugin !== 'undefined'
  };
  
  console.log('Script loading status:', scripts);
  
  return Object.values(scripts).every(loaded => loaded);
}

// Make verification function globally available
window.verifyScriptsLoaded = verifyScriptsLoaded;

// Function to force reinitialize everything
function forceReinitializeAll() {
  console.log('Force reinitializing all functions...');
  
  // Verify scripts are loaded
  if (!verifyScriptsLoaded()) {
    console.error('Scripts not loaded, cannot reinitialize');
    return;
  }
  
  // Clean up everything first
  cleanupAllPageAnimations();
  
  // Reinitialize everything
  setTimeout(() => {
    initMegaMenu();
    initPageTransitions();
    moveShowAllIntoCollectionList();
    initNavbarShowHide();
    initDisplayToggle();
    initTypeListRadioHandler();
    reloadFinsweetCMS();
    
    setTimeout(() => {
      initGsapAnimations();
      
      setTimeout(() => {
        initSplitTextAnimations();
        
        if (typeof ScrollTrigger !== 'undefined') {
          ScrollTrigger.refresh(true);
        }
        
        initHomeVideo();
        
        console.log('Force reinitialization complete');
      }, 200);
    }, 100);
  }, 50);
}

// Make force reinitialize function globally available
window.forceReinitializeAll = forceReinitializeAll;

// Function to force refresh ScrollTrigger for mobile after scrolling
function forceRefreshScrollTriggerMobile() {
  const isMobile = window.innerWidth < 650;
  if (isMobile && typeof ScrollTrigger !== 'undefined') {
    console.log('Force refreshing ScrollTrigger for mobile...');
    ScrollTrigger.refresh(true);
    
    // Additional refresh after a delay
    setTimeout(() => {
      ScrollTrigger.refresh(true);
    }, 100);
  }
}

// Make mobile refresh function globally available
window.forceRefreshScrollTriggerMobile = forceRefreshScrollTriggerMobile;

// Enhanced function to ensure proper script loading and initialization after page transitions
function ensureScriptsLoadedAfterTransition() {
  return new Promise((resolve) => {
    const isMobile = window.innerWidth < 650;
    const baseDelay = isMobile ? 50 : 20; // Much shorter delay
    
    console.log(`Ensuring scripts loaded after transition (mobile: ${isMobile})...`);
    
    // Check if all required scripts are loaded
    const checkScripts = () => {
      const scriptsLoaded = {
        gsap: typeof gsap !== 'undefined',
        scrollTrigger: typeof ScrollTrigger !== 'undefined',
        splitText: typeof SplitText !== 'undefined'
      };
      
      console.log('Script loading status:', scriptsLoaded);
      
      return Object.values(scriptsLoaded).every(loaded => loaded);
    };
    
    // Wait for scripts to be loaded
    const waitForScripts = () => {
      if (checkScripts()) {
        console.log('All scripts loaded, proceeding with initialization...');
        
        // Register plugins
        if (typeof gsap !== 'undefined') {
          if (typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
          if (typeof SplitText !== 'undefined') gsap.registerPlugin(SplitText);
        }
        
        resolve();
      } else {
        console.log('Scripts not yet loaded, retrying...');
        setTimeout(waitForScripts, 50); // Faster retry
      }
    };
    
    // Start checking after base delay
    setTimeout(waitForScripts, baseDelay);
  });
}

// Enhanced page transition function with proper script loading
function globalPageTransition(url, isPopState = false) {
  if (window.transitioning) {
    window.pendingNavigation = { url, isPopState };
    return;
  }

  window.transitioning = true;
  
  // Temporarily disable smooth scrolling during transition to prevent conflicts
  if (window.customSmoothScroll) {
    window.customSmoothScroll.se = false;
  }
  
  // Check if this is internal project navigation (staying within projects)
  const isInternalProjectNav = url.includes('/projects/') && window.location.pathname.includes('/projects/');
  
  // 2. Start transition animation
  const transition = document.querySelector('.transition');
  const swipeup = document.querySelector('.swipeup');
  const cursor = document.querySelector('.cursor');
  
  const transitionPromise = new Promise((resolve) => {
    const tl = gsap.timeline({ onComplete: resolve });
    tl.set(transition, { display: 'block', visibility: 'visible', opacity: 1 });
    tl.set(swipeup, { autoAlpha: 1, attr: { d: 'M 0 1 V 1 Q 0.5 1 1 1 V 1 z' } });
    tl.to(swipeup, { duration: 0.5, ease: 'power4.in', attr: { d: 'M 0 1 V 0.5 Q 0.5 0 1 0.5 V 1 z' } });
    tl.to(swipeup, { duration: 0.4, ease: 'power2', attr: { d: 'M 0 1 V 0 Q 0.5 0 1 0 V 1 z' } });
    tl.to(".header .logo img, .header .menu a", { yPercent: -130, duration: 0.5, stagger: 0.06, ease: "power1.out" }, 0);
    tl.to(".menu-toggle", { opacity: 0, duration: 0.5, ease: "power1.out" }, 0);
    tl.to(cursor, { scale: 0, duration: 0.2, ease: "power2.out" }, 0);
    tl.set(cursor, { visibility: "hidden" }, 0.2);
  });

  // 3. Fetch new page content
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

  // 4. Wait for both animation and fetch
  Promise.all([transitionPromise, fetchPromise])
    .then(async ([_, nextPage]) => {
      // 5. Swap content
      const container = document.querySelector('.page-wrapper');
      if (!container) return;

      document.title = nextPage.doc.querySelector('title')?.textContent || document.title;
      container.innerHTML = nextPage.nextWrapper.innerHTML;

      // 6. Ensure proper scroll position and reset smooth scrolling state
      ensureProperScrollPosition();
      
      // Reset smooth scrolling state to prevent conflicts
      if (window.customSmoothScroll) {
        window.customSmoothScroll.se = false;
        window.customSmoothScroll.dr = false;
        window.customSmoothScroll.isDragging = false;
        window.customSmoothScroll.sliderTouchActive = false;
      }

      // 7. Clean up ALL animations and instances (AFTER animation, BEFORE new functions)
      if (!isInternalProjectNav) {
        cleanupAllPageAnimations();
      } else {
        // For internal project navigation, only kill ScrollTriggers but preserve SplitText
        if (typeof ScrollTrigger !== 'undefined') {
          ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        }
        gsap.killTweensOf("*");
      }
      
      // Ensure proper scroll position and reset any scroll-related state
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;

      // 8. Wait for scripts to be properly loaded
      await ensureScriptsLoadedAfterTransition();

      // 9. Initialize everything with proper sequencing and delays
      const isMobile = window.innerWidth < 650;
      const initializationDelay = isMobile ? 300 : 100;
      
      setTimeout(() => {
        initializePageAfterTransition();
      }, initializationDelay);

      // 10. Complete transition
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
          // Reset cursor
          gsap.set(cursor, { scale: 0, visibility: "visible" });
          gsap.set(".header .logo img, .header .menu a", { yPercent: 130 });
          gsap.set(".menu-toggle", { opacity: 0 });

          const inTl = gsap.timeline();
          inTl.to([".header .logo img", ".header .menu a"], { yPercent: 0, duration: 0.6, ease: "power1.out" }, 0);
          inTl.to(cursor, { scale: 1, duration: 0.4, ease: "power2.out" }, 0);
          inTl.to(".menu-toggle", { opacity: 1, duration: 1.5, ease: "power2.out" }, 0);

          // Hide transition
          transition.style.opacity = '0';
          transition.style.visibility = 'hidden';
          window.transitioning = false;

          // Initialize cursor
          if (!window.cursorInitialized) {
            initInteractiveCursor();
          }

          if (typeof initNavbarShowHide === 'function' && !window.navbarShowHide) {
            window.navbarShowHide = initNavbarShowHide();
          }

          // Re-enable smooth scrolling after transition is complete
          if (window.customSmoothScroll) {
            window.customSmoothScroll.se = true;
          }
          
          // Handle pending navigation
          if (window.pendingNavigation) {
            const { url, isPopState } = window.pendingNavigation;
            window.pendingNavigation = null;
            setTimeout(() => globalPageTransition(url, isPopState), 100);
          }
        }
      });
    })
    .catch(err => {
      window.location.href = url;
    });
}

// Enhanced function to force refresh ScrollTrigger and SplitText for mobile
function forceRefreshScrollTriggerMobile() {
  const isMobile = window.innerWidth < 650;
  if (isMobile && typeof ScrollTrigger !== 'undefined') {
    console.log('Force refreshing ScrollTrigger for mobile...');
    
    // Only refresh if there are active ScrollTriggers
    const activeTriggers = ScrollTrigger.getAll().filter(trigger => trigger.isActive);
    if (activeTriggers.length > 0) {
      // Gentle refresh without killing existing instances
      ScrollTrigger.refresh();
      
      setTimeout(() => {
        // Only refresh again if still active
        const stillActiveTriggers = ScrollTrigger.getAll().filter(trigger => trigger.isActive);
        if (stillActiveTriggers.length > 0) {
          ScrollTrigger.refresh();
        }
      }, 100);
    }
  }
}

// Enhanced function to ensure proper initialization after any dynamic content changes
function ensureProperInitializationAfterContentChange() {
  const isMobile = window.innerWidth < 650;
  const delay = isMobile ? 100 : 50;
  
  console.log('Ensuring proper initialization after content change...');
  
  setTimeout(() => {
    // Re-initialize SplitText animations
    if (typeof initSplitTextAnimations === 'function') {
      initSplitTextAnimations();
    }
    
    // Refresh ScrollTrigger
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh(true);
    }
    
    // Additional refresh for mobile
    if (isMobile) {
      setTimeout(() => {
        if (typeof ScrollTrigger !== 'undefined') {
          ScrollTrigger.refresh(true);
        }
      }, 100);
    }
  }, delay);
}

// Make enhanced functions globally available
window.forceRefreshScrollTriggerMobile = forceRefreshScrollTriggerMobile;
window.ensureProperInitializationAfterContentChange = ensureProperInitializationAfterContentChange;
window.ensureScriptsLoadedAfterTransition = ensureScriptsLoadedAfterTransition;

// Enhanced window load handler to ensure everything is properly initialized
window.addEventListener('load', () => {
  const isMobile = window.innerWidth < 650;
  const loadDelay = isMobile ? 100 : 50;
  
  console.log('Window loaded, ensuring proper initialization...');
  
  // Set a flag to prevent script killing during initialization
  window.isInitializing = true;
  
  setTimeout(() => {
    // Re-initialize SplitText animations
    if (typeof initSplitTextAnimations === 'function') {
      initSplitTextAnimations();
    }
    
    // Refresh ScrollTrigger
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh(true);
    }
    
    // Additional refresh for mobile
    if (isMobile) {
      setTimeout(() => {
        if (typeof ScrollTrigger !== 'undefined') {
          ScrollTrigger.refresh(true);
        }
      }, 100);
    }
    
    // Clear the initialization flag
    setTimeout(() => {
      window.isInitializing = false;
    }, 500);
  }, loadDelay);
});
