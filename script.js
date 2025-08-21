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
  await loadScript("https://gsapfiles.netlify.app/gsap.min.js");
  await loadScript("https://gsapfiles.netlify.app/scrolltrigger.min.js");
  await loadScript("https://gsapfiles.netlify.app/splittext.min.js");
  await loadScript("https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.7.8/lottie.min.js");
}



async function startApp() {
  try {
    await loadAllLibraries();
    
    // Register GSAP plugins
    if (typeof gsap !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger, SplitText);
    }

    // UserWay widget
    (function(d) {
      var s = d.createElement("script");
      s.setAttribute("data-account", "a37OvQJfVJ");
      s.setAttribute("src", "https://cdn.userway.org/widget.js");
      (d.body || d.head).appendChild(s);
    })(document);



    // Start the loader animation
    animateLoaderCounter(() => {
      // Initialize all functions using centralized system
      initializeAllFunctions();
    }, 400); // Reduced loader duration from 800ms to 400ms

  } catch (error) {
    console.error('Error in startApp:', error);
    // Fallback initialization without loader - only call initializeAllFunctions
    initializeAllFunctions();
  }
}
document.addEventListener("DOMContentLoaded", startApp);
// --- END DYNAMIC LOADER ---

// ===== FUNCTION INITIALIZATION =====

  // רשימת כל הפונקציות שמאותחלות בטעינה רגילה
  const INIT_FUNCTIONS = [
    'refreshbreakingpoints',
    'initMegaMenu',
    'initPageTransitions',
    'initInteractiveCursor',
    'initNavbarShowHide',
    'initInfinityGallery',
    'initDisplayToggle',
    'initGsapAnimations',
    'initSplitTextAnimations',
    'initCustomSmoothScrolling',
    'initTypeListRadioHandler',
    'setupGlobalGsapProtection',
    'initHomeVideo',
    'moveShowAllIntoCollectionList',
    'reloadFinsweetCMS',
    'handleProjectsPageFilterChanges'
  ];

// פונקציה לאתחול כל הפונקציות
function initializeAllFunctions() {
  // Prevent multiple simultaneous initializations
  if (window.isInitializing) {
    return;
  }
  
  window.isInitializing = true;
  
  INIT_FUNCTIONS.forEach(funcName => {
    try {
      if (funcName === 'initHomeVideo') {
        // אתחול וידאו רק בדף הבית
        const isHomepage = window.location.pathname === '/' || window.location.pathname === '/index.html';
        if (isHomepage && typeof initHomeVideo === 'function') {
          initHomeVideo();
        }
      } else if (funcName === 'webflowReinitialize') {
        // Skip webflowReinitialize in initializeAllFunctions as it should be called with HTML content
        // webflowReinitialize skipped - handled naturally
      } else {
        const func = window[funcName];
        if (typeof func === 'function') {
          func();
        }
      }
    } catch (error) {
      console.error(`Error initializing ${funcName}:`, error);
    }
  });
  
  // Apply line truncation
  document.querySelectorAll('.home-properties-grid .info').forEach(info => {
    truncateText(info, TEXT_LIMITS.propertyInfoLines, 'lines');
  });
  
  // Refresh ScrollTrigger
  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.refresh(true);
  }
  
  // Mark initialization as complete
  window.isInitializing = false;

}

// Make function globally available for debugging
window.initializeAllFunctions = initializeAllFunctions;

window.history.scrollRestoration = "manual";

window.addEventListener("beforeunload", () => {
window.scrollTo(0, 0);
document.documentElement.scrollTop = 0;
document.body.scrollTop = 0;
});


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
    if (typeof onComplete === 'function') {
      onComplete();
    }
       
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

// Function to handle radio button selection in .type-list
function initTypeListRadioHandler() {
document.addEventListener('click', (e) => {
  if (e.target.closest('.type-list .w-radio input[type="radio"]') && typeof ScrollTrigger !== 'undefined') {
    setTimeout(() => ScrollTrigger.refresh(true), 50);
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
  }

  i = new S();

  window.toggleSmoothScroll = (e) => {
      if (i) {
          i.ts(e);
      }
  };
}






// Navigation queue to handle rapid clicks (global)
window.navigationQueue = window.navigationQueue || [];
window.processingQueue = false;

function initPageTransitions() {
  // Create transition overlay if it doesn't exist
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

}

// Main page transition function (global)
window.pageTransition = async function(url, isPopState = false) {
    // If we're already transitioning to this URL, ignore
    if (window.currentTransitionUrl === url) {
      return;
    }

    // If already transitioning, interrupt current transition and start new one
    if (window.transitioning || window.processingQueue) {
      // Clear the queue and add the new navigation
      window.navigationQueue = [{ url, isPopState }];
      
      // Force interrupt current transition
      if (window.currentTransition) {
        window.currentTransition.kill();
      }
      
      // Reset flags and process immediately
      window.transitioning = false;
      window.processingQueue = false;
      
      // Small delay to allow cleanup
      setTimeout(() => {
        window.pageTransition(url, isPopState);
      }, 50);
      return;
    }

    if (url === window.location.href && !isPopState) {
      return;
    }

    window.transitioning = true;
    window.processingQueue = true;
    window.currentTransitionUrl = url;
    
    const transition = document.querySelector('.transition');
    const swipeup = document.querySelector('.swipeup');
    const cursor = document.querySelector('.cursor');

    // Transition in animation
    const tl = gsap.timeline();
    window.currentTransition = tl; // Store reference for interruption
    
    tl.set(transition, { display: 'block', visibility: 'visible', opacity: 1 });
    tl.set(swipeup, { autoAlpha: 1, attr: { d: 'M 0 1 V 1 Q 0.5 1 1 1 V 1 z' } });
    tl.to(swipeup, { duration: 0.5, ease: 'power4.in', attr: { d: 'M 0 1 V 0.5 Q 0.5 0 1 0.5 V 1 z' } });
    tl.to(swipeup, { duration: 0.4, ease: 'power2', attr: { d: 'M 0 1 V 0 Q 0.5 0 1 0 V 1 z' } });
    tl.to(".header .logo img, .header .menu a, .country-selector", { yPercent: -130, duration: 0.5, stagger: 0.06, ease: "power1.out" }, 0);
    tl.to(".menu-toggle", { opacity: 0, duration: 0.5, ease: "power1.out" }, 0);
    tl.to(cursor, { scale: 0, duration: 0.2, ease: "power2.out" }, 0);
    tl.set(cursor, { visibility: "hidden" }, 0.2);

    await tl;

    try {
      // Fetch new page content
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to load page: ${response.status}`);
      
      const text = await response.text();
      const doc = new DOMParser().parseFromString(text, 'text/html');
      const newContent = doc.querySelector('.page-wrapper').innerHTML;
      const newTitle = doc.querySelector('title').innerText;

      // Clean up current page
      if (typeof window.cleanupPage === 'function') {
        window.cleanupPage();
      }

      // Update content
      const container = document.querySelector('.page-wrapper');
      container.innerHTML = newContent;
      document.title = newTitle;

      // Re-execute scripts in the new content
      const scripts = container.querySelectorAll('script');
      scripts.forEach(old => {
        const s = document.createElement('script');
        for (const a of old.attributes) s.setAttribute(a.name, a.value);
        s.textContent = old.textContent;
        old.replaceWith(s);
      });

      // Update Webflow data attributes
      const wfPage = doc.documentElement.getAttribute('data-wf-page');
      if (wfPage) {
        document.documentElement.setAttribute('data-wf-page', wfPage);
      }

      // Update all data attributes from the new page
      const newHtmlElement = doc.documentElement;
      const currentHtmlElement = document.documentElement;
      Array.from(newHtmlElement.attributes).forEach(attr => {
        if (attr.name.startsWith('data-')) {
          currentHtmlElement.setAttribute(attr.name, attr.value);
        }
      });

      // Update body attributes as well
      const newBody = doc.body;
      const currentBody = document.body;
      Array.from(newBody.attributes).forEach(attr => {
        if (attr.name.startsWith('data-') || attr.name === 'class') {
          currentBody.setAttribute(attr.name, attr.value);
        }
      });

      // Update URL if not popstate
      if (!isPopState) {
        window.history.pushState({ path: url }, newTitle, url);
      }

      // Scroll to top
      window.scrollTo(0, 0);

      // Initialize all functions
      if (typeof initializeAllFunctions === 'function') {
        initializeAllFunctions();
      }

      // Force Webflow to recognize the new page
      if (window.Webflow) {
        try {
          window.Webflow.ready();
        } catch (e) {
          // Webflow re-initialized
        }
      }

      // Final Webflow re-initialization to ensure forms work
      setTimeout(() => {
        if (window.Webflow) {
          try {
            window.Webflow.ready();
          } catch (e) {
            // Final Webflow re-initialization
          }
        }
        
        // Replace any remaining Webflow forms with delay
        setTimeout(() => {
          if (typeof replaceWebflowForms === 'function') {
            replaceWebflowForms();
          }
          
          // Final test of forms
          setTimeout(() => {
            const allForms = document.querySelectorAll('form');
            
            allForms.forEach((form, index) => {
              const submitButton = form.querySelector('input[type="submit"], button[type="submit"]');
              if (submitButton) {
                submitButton.style.pointerEvents = 'auto';
                submitButton.style.cursor = 'pointer';
                submitButton.disabled = false;
                submitButton.removeAttribute('disabled');
              }
            });
          }, 200);
        }, 200);
      }, 200);

      // Refresh ScrollTriggers
      if (typeof ScrollTrigger !== 'undefined') {
        setTimeout(() => {
          ScrollTrigger.refresh(true);
          
          // Second refresh after a bit more time to ensure everything is loaded
          setTimeout(() => {
            ScrollTrigger.refresh(true);
          }, 100);
        }, 50);
      }

      // Replace Webflow forms with custom ones
      setTimeout(() => {
        if (typeof replaceWebflowForms === 'function') {
          replaceWebflowForms();
        }
        
        // Test if forms are working
        const forms = document.querySelectorAll('form[data-wf-form]');
        const customForms = document.querySelectorAll('form[id*="wf-form"], form[id*="footer-form"]');
        
        customForms.forEach(form => {
          const submitButton = form.querySelector('input[type="submit"], button[type="submit"]');
          if (submitButton) {
            submitButton.style.pointerEvents = 'auto';
            submitButton.style.cursor = 'pointer';
            submitButton.disabled = false;
            submitButton.removeAttribute('disabled');
          }
        });
      }, 100);

    } catch (error) {
      window.transitioning = false;
      window.processingQueue = false;
      window.currentTransition = null;
      window.currentTransitionUrl = null;
      
      // Hide transition overlay on error
      const transition = document.querySelector('.transition');
      if (transition) {
        transition.style.opacity = '0';
        transition.style.visibility = 'hidden';
      }
      
      window.location.href = url;
    }

    // Transition out animation
    const outTl = gsap.timeline();
    window.currentTransition = outTl; // Update reference for interruption
    
    outTl.to(swipeup, { duration: 0.6, ease: 'power4.in', attr: { d: 'M 0 1 V 0.5 Q 0.5 1 1 0.5 V 1 z' } });
    outTl.to(swipeup, { duration: 0.4, ease: 'power2', attr: { d: 'M 0 1 V 1 Q 0.5 1 1 1 V 1 z' } });
    outTl.to(".header .logo img, .header .menu a, .country-selector", { yPercent: 0, duration: 0.6, ease: "power1.out" }, 0);
    outTl.to(".menu-toggle", { opacity: 1, duration: 1.5, ease: "power2.out" }, 0);
    outTl.to(cursor, { scale: 1, duration: 0.4, ease: "power2.out" }, 0);
    outTl.set(cursor, { visibility: "visible" }, 0);
    outTl.set(transition, { opacity: 0, visibility: 'hidden' });

    outTl.call(() => {
      window.transitioning = false;
      window.processingQueue = false;
      window.currentTransition = null;
      window.currentTransitionUrl = null;
      
      // Process next item in queue if any
      if (window.navigationQueue.length > 0) {
        const nextNavigation = window.navigationQueue.shift();
        setTimeout(() => {
          window.pageTransition(nextNavigation.url, nextNavigation.isPopState);
        }, 100);
      }
    });
}

// Cleanup function (global)
window.cleanupPage = function() {
    if (gsap && gsap.ScrollTrigger) {
      gsap.killTweensOf("*");
      gsap.ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      gsap.clear();
    }

    // Reset flags
    window.gsapAnimationsInitialized = false;
    window.isInitializing = false;
    window.functionsInitialized = false;
    window.screenFullyCovered = false;
    window.cursorInitialized = false;
    window.videoInitialized = false;

    // Clean up navigation state
    if (window.currentTransition) {
      window.currentTransition.kill();
      window.currentTransition = null;
    }
    
    // Clean up interactive elements
    document.querySelectorAll(".active, .open, .clicked").forEach((el) => {
      el.classList.remove("active", "open", "clicked");
    });

    // Scroll to top
    window.scrollTo(0, 0);
}

// Global event listeners (outside the function to ensure they're always active)
document.addEventListener('DOMContentLoaded', () => {
  // Handle internal link clicks globally
  function handleGlobalInternalLinkClicks(event) {
    const target = event.target.closest('a[href]');
    if (
      target && 
      target.id !== "toggle-button" && 
      !target.target && 
      !target.href.includes("#") && 
      !target.href.includes("mailto:") && 
      !target.href.includes("tel:")
    ) {
      const currentUrl = window.location.href;
      const targetUrl = target.href;
      
      // Don't navigate if it's the same page
      if (currentUrl === targetUrl) {
        event.preventDefault();
        return;
      }
      
      event.preventDefault();
      if (typeof window.pageTransition === 'function') {
        window.pageTransition(target.href);
      } else {
        window.location.href = target.href;
      }
    }
  }

  // Handle popstate globally
  function handleGlobalPopState() {
    if (typeof window.pageTransition === 'function') {
      window.pageTransition(window.location.href, true);
    } else {
      window.location.reload();
    }
  }

  // Add global event listeners
  document.body.addEventListener('click', handleGlobalInternalLinkClicks);
  window.addEventListener('popstate', handleGlobalPopState);
  
  // Initialize history state
  history.replaceState({ title: document.title }, '', location.href);
});







/* ==============================================
Show/Hide Grid on Keypress
============================================== */
document.addEventListener("keydown", function (event) {
  if ((event.ctrlKey || event.metaKey) && event.key === "g") {
    event.preventDefault();
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

// --- TEXT TRUNCATION CONFIGURATION ---
const TEXT_LIMITS = {
  propertyInfoLines: 3,  // Number of lines for property info elements
  defaultWordLimit: 33   // Default word limit for other elements
};

function truncateText(el, limit = 3, type = 'lines') {
  const originalText = el.textContent.trim();
  const words = originalText.split(/\s+/);
  
  if (type === 'words') {
    // Word-based truncation
    if (words.length > limit) {
      el.textContent = words.slice(0, limit).join(' ') + '...';
    }
  } else {
    // Line-based truncation
    const lineHeight = parseInt(window.getComputedStyle(el).lineHeight) || 20;
    const maxHeight = lineHeight * limit;
    
    // Set the element to show all text first to measure
    el.textContent = originalText;
    
    // If the element is already within the line limit, no need to truncate
    if (el.scrollHeight <= maxHeight) {
      return;
    }
    
    // Binary search to find the right number of words
    let left = 0;
    let right = words.length;
    let result = 0;
    
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const testText = words.slice(0, mid).join(' ') + '...';
      el.textContent = testText;
      
      if (el.scrollHeight <= maxHeight) {
        result = mid;
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
    
    // Set the final truncated text
    el.textContent = words.slice(0, result).join(' ') + '...';
  }
}





function initSplitTextAnimations(scope = document) {
if (typeof SplitText === 'undefined') return;

// Check if screen width is under 650px
const isMobile = window.innerWidth < 650;

// If mobile, only select h1 elements, otherwise select all text elements
const selector = isMobile ? "h1" : "h1, h2, h3, h4, h5, h6, p";
const elements = scope.querySelectorAll(selector);

elements.forEach((element) => {
  if (element.querySelector('.line') || !element.textContent.trim() || element._splitTextInstance) return;

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
      duration: 1.5,
      delay: element.closest(".hero, .delay") ? 0.5 : 0,
      ease: "power3.out"
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
  // Prevent multiple initializations
  if (window.gsapAnimationsInitialized) {
    return;
  }
  
  window.gsapAnimationsInitialized = true;

// Common animations for all pages
gsap.fromTo(".clipping-video", 
  { clipPath: "inset(100% 0% 0% 0%)" }, 
  { 
    clipPath: "inset(0% 0% 0% 0%)", 
    delay: 0.6,
    duration: 1.2, 
    ease: "power4.inOut" 
  }
);


gsap.fromTo(".about-hero-image", 
  { clipPath: "inset(0% 0% 0% 100%)" }, 
  { 
    clipPath: "inset(0% 0% 0% 0%)", 
    delay: 0.4,
    duration: 1.8, 
    stagger: 0.1,
    ease: "power4.inOut" 
  }
);

gsap.fromTo(".about-hero-image img",
  { scale: 1.3 },
  {
    scale: 1,
    duration: 1.8,
    delay: 0.3,
    ease: "power3.inOut"
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
document.querySelectorAll('.about-hero-image img, .about-values .image img, .property .image img, .place .image img, .footer-image img').forEach((img) => {
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
    }
  });
});


/*
// Left to right animations
if (window.innerWidth > 650) {
  gsap.utils.toArray(".left-to-right").forEach((img) => {
    gsap.fromTo(img, 
      { clipPath: "inset(0 100% 0 0)" }, 
      {
        clipPath: "inset(0 0% 0 0)",
        duration: 1.3,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: img,
          start: "top 95%",
          toggleActions: "play none none none"
        }
      }
    );
  });
}

// Right to left animations
if (window.innerWidth > 650) {
  gsap.utils.toArray(".right-to-left").forEach((img) => {
    gsap.fromTo(img, 
      { clipPath: "inset(0 0 0 100%)" }, 
      {
        clipPath: "inset(0 0 0 0%)",
        duration: 1.3,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: img,
          start: "top 95%",
          toggleActions: "play none none none"
        }
      }
    );
  });
}


*/


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


gsap.from("#filters-form .w-dyn-items", {
  yPercent: 100,
  duration: 2,
  opacity: 0,
  ease: "power4.out",
  stagger: 0.5,
  scrollTrigger: {
    trigger: "#filters-form",
    start: "top 90%",
    toggleActions: "play none none none"
  }
});




gsap.to(".projects .display-toggle", {
  scrollTrigger: {
    trigger: ".display-toggle", 
    start: "top top",
    end: "+=200px",
    scrub: true,
  },
  opacity: 0,
});


// Sticky stacking cards effect
const homeContainers = document.querySelectorAll('.home-container');
if (homeContainers.length > 1) {
homeContainers.forEach((container, index) => {
  gsap.set(container, { zIndex: index + 1 });
  
  ScrollTrigger.create({
    trigger: container,
    start: "top top", 
    end: index <= 3 ? `+=${window.innerHeight * 2}` : "bottom bottom",
    pin: true,
    pinSpacing: index <= 3 ? false : true,
    onUpdate: index <= 3 ? (self) => {
      gsap.set(container, {
        '--after-opacity': self.progress * 0.2
      });
      
      // Animate content and image during exit
      const content = container.querySelector('.content');
      const image = container.querySelector('.image');
      if (content && image) {
        gsap.to([content, image], {
          y: self.progress * 200,
          scale: 1 - (self.progress * 0.2),
          ease: "power2.out",
          duration: 0.5
        });
      }
    } : null
  });
});
  const homeImages = document.querySelectorAll('.home-container .image');
  
  homeImages.forEach(image => {
    gsap.from(image, {
      clipPath: "inset(10% 10% 10% 10%)",
      duration: 1.2,
      ease: "power2.out",
      scrollTrigger: {
        trigger: image,
        start: "top 100%",
        end: "bottom 0%",
        scrub: 1.2,
        toggleActions: "play none none none"
      }
    });
  });


}

// Verify ScrollTriggers were created
if (typeof ScrollTrigger !== 'undefined') {
  setTimeout(() => {
    const createdTriggers = ScrollTrigger.getAll();
    if (createdTriggers.length === 0) {
      // No ScrollTriggers created in initGsapAnimations
    }
  }, 100);
}

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
if (window.innerWidth <= 650) return;

const cursor = document.querySelector("#cursor");
if (!cursor) return;

// Prevent multiple initializations - if already initialized, just return
if (window.cursorInitialized) {
  return;
}

// Mark as initialized immediately to prevent double initialization
window.cursorInitialized = true;

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

document.querySelectorAll(".slider-wrapper").forEach(el => {
  el.addEventListener("mouseenter", () => cursor.classList.add("slide"));
  el.addEventListener("mouseleave", () => cursor.classList.remove("slide"));
});


document.querySelectorAll(".fullscreen-modal").forEach(el => {
  el.addEventListener("mouseenter", () => cursor.classList.add("slide-gallery"));
  el.addEventListener("mouseleave", () => cursor.classList.remove("slide-gallery"));
});


// Hide cursor when hovering over expand iconsll
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
  // Kill any existing instance and reset the variable
  if (window.navbarShowHide && typeof window.navbarShowHide.destroy === 'function') {
      window.navbarShowHide.destroy();
      window.navbarShowHide = null;
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
    this.originallyClickedImage = null; // Track the originally clicked image
    this.hasNavigatedAway = false; // Track if user has navigated away from original image
    this.currentCycle = 0; // Track current cycle for infinite scroll positioning
    this.animationFrameId = null; // To hold the animation frame ID
    this.originalItemCount = this.items.length;
    // Remove all snapping logic for true infinite scroll
    // this.snapOnSettle = false;
    // this.snapAnimation = null;

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
    
    // Navigation arrows will be added after the class is instantiated
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
      
          // Add sync method to modal for external access
    modal.syncThumbnailsWithMainGallery = this.syncThumbnailsWithMainGallery.bind(this);

    // Handle modal click to close
    const closeModal = (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.closeFullscreen();
    };
    modal.addEventListener('click', closeModal);
    modal.addEventListener('touchend', closeModal);
    
    // Add cursor events for fullscreen modal
    modal.addEventListener('mouseenter', () => {
      if (window.cursor) {
        window.cursor.classList.add("slide-gallery");
      }
    });
    modal.addEventListener('mouseleave', () => {
      if (window.cursor) {
        window.cursor.classList.remove("slide-gallery");
      }
    });
    
    // Also add cursor events to document when fullscreen is active
    document.addEventListener('mouseenter', () => {
      if (this.isFullscreenOpen && window.cursor) {
        window.cursor.classList.add("slide-gallery");
      }
    });
      
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

    // Add expand icons to all slider items (only on desktop above 650px)
    this.handleExpandIcons();
  }

  handleExpandIcons() {
    const isDesktop = window.innerWidth > 650;
    
    this.items.forEach((item, index) => {
      let expandIcon = item.querySelector('.expand-icon');
      
      if (isDesktop) {
        // Show expand icons on desktop
        if (!expandIcon) {
          expandIcon = document.createElement('div');
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
        
        // Ensure icon is visible
        expandIcon.style.display = 'block';
        expandIcon.style.visibility = 'visible';
        expandIcon.style.opacity = '1';
      } else {
        // Hide expand icons on mobile
        if (expandIcon) {
          expandIcon.style.display = 'none';
          expandIcon.style.visibility = 'hidden';
          expandIcon.style.opacity = '0';
        }
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
    
    // Activate cursor for fullscreen gallery
    if (window.cursor) {
      window.cursor.classList.add("slide-gallery");
    }
    
    // Add document-level cursor activation for fullscreen
    this.fullscreenMouseMoveHandler = () => {
      if (this.isFullscreenOpen && window.cursor) {
        window.cursor.classList.add("slide-gallery");
      }
    };
    document.addEventListener('mousemove', this.fullscreenMouseMoveHandler);
    
    // Store current image index for navigation
    const allImages = Array.from(this.container.querySelectorAll('.slider-item img'));
    this.currentFullscreenIndex = allImages.indexOf(img);
    this.allFullscreenImages = allImages;
    
    // Calculate the real index in the original gallery (without clones)
    const originalItems = this.items.slice(0, this.originalItemCount);
    const originalImages = originalItems.map(item => item.querySelector('img'));
    this.currentOriginalIndex = originalImages.indexOf(img);
    this.originalImages = originalImages;
    
    // Store the originally clicked image and reset navigation flag
    this.originallyClickedImage = img;
    this.hasNavigatedAway = false;
    this.currentCycle = 0; // Reset cycle when opening fullscreen
    
    // Create a clone of the image
    const clone = img.cloneNode(true);
    this.originalImage = img;
    this.modal.innerHTML = '';
    this.modal.appendChild(clone);
    
    this.modal.style.display = 'block';

    // Get the original image position and size
    const rect = img.getBoundingClientRect();
    
    // STEP 1: Initial state - exactly as thumbnail in gallery with FULL clip-path
    gsap.set(clone, {
      position: 'fixed',
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
      zIndex: 999999999,
      objectFit: 'cover',
      borderRadius: 0,
      transformOrigin: 'center center',
      opacity: 1,
      clipPath: 'polygon(0% 0%, 100% 0, 100% 100%, 0% 100%)', // FULL clip-path (no distortion)
    });

    // Set modal background
    gsap.set(this.modal, {
      backgroundColor: 'rgba(0, 0, 0, 0)'
    });

    // Super simple and clean animation
    const tl = gsap.timeline({
      onComplete: () => {
        this.currentAnimation = null;
      }
    });

    // Fade out gallery items only (keep toggle icon visible)
    const parentItem = img.closest('.slider-item');
    if (parentItem) {
      const icon = parentItem.querySelector('.expand-icon');
      if (icon) {
        // Don't fade out the toggle icon - keep it as is
        // tl.to(icon, { opacity: 0, duration: 0.6, ease: "power2.out" }, 0);
      }
    }

    tl.to(this.container.querySelectorAll('.slider-item'), { 
      opacity: 0, 
      duration: 0.5,
      ease: "power2.out"
    }, 0.3);

    // Fade in dark background
    tl.to(this.modal, {
      backgroundColor: 'rgba(0, 0, 0, 1)',
      
      duration: 0.5,
      ease: "power2.out"
    }, 0);

    // STEP 2: Move to center and change size with elegant perspective clip-path
    tl.to(clone, {
      top: '50%',
      left: '50%',
      xPercent: -50,
      yPercent: -50,
      width: '90vw',
      height: '90vh',
      objectFit: 'cover',
      clipPath: 'polygon(0 0, 87% 9%, 86% 88%, 15% 87%)', // Elegant perspective effect
      duration: 0.8,
      ease: "power4.in"
    }, 0);




    // STEP 3: Move to fullscreen with final clip-path (seamless continuation)
    tl.to(clone, {
      top: '50%',
      left: '50%',
      xPercent: -50,
      yPercent: -50,
      width: '100vw',
      height: '100vh',
      objectFit: 'cover',
      clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', // Final normal state
      duration: 0.8,
      ease: "power4.out",
      onComplete: () => {
        // Add mousewheel navigation after animation completes
        this.addFullscreenNavigation();
      }
    }, 0.7); // Overlap with previous step
    
    // Add thumbnails immediately when animation starts
    tl.call(() => {
      this.addFullscreenNavigation();
    }, [], 0.1); // Start very early in the animation
    
    // Ensure indicator is centered after animation completes
    tl.call(() => {
      setTimeout(() => {
        this.ensureIndicatorCentered();
      }, 500);
    }, [], 1.5);



    this.currentAnimation = tl;
  }



  closeFullscreen() {
    if (!this.modal || !this.originalImage) return;

    // Remove cursor immediately when closing
    if (window.cursor) {
      window.cursor.classList.remove("slide-gallery");
    }
    
    // Remove document-level mousemove handler immediately
    if (this.fullscreenMouseMoveHandler) {
      document.removeEventListener('mousemove', this.fullscreenMouseMoveHandler);
      this.fullscreenMouseMoveHandler = null;
    }

    if (this.currentAnimation) {
      this.currentAnimation.kill();
    }

    const img = this.modal.querySelector('img');
    if (!img) return;

    // Check if user has navigated away from originally clicked image
    const currentImage = this.originalImages[this.currentOriginalIndex];
    const useFadeOut = this.hasNavigatedAway || currentImage !== this.originallyClickedImage;

    // Ensure expand icon is visible when navigating away
    if (useFadeOut && this.originalImage) {
      const closeParentItem = this.originalImage.closest('.slider-item');
      if (closeParentItem) {
        const icon = closeParentItem.querySelector('.expand-icon');
        if (icon) {
          icon.style.opacity = '1';
          icon.style.visibility = 'visible';
          icon.style.display = 'block';
        }
      }
    }

    if (useFadeOut) {
      // Simple fade out animation for navigated images
      this.performFadeOutClose();
    } else {
      // Original complex animation for same image
      this.performOriginalClose();
    }
  }

  performFadeOutClose() {
    const img = this.modal.querySelector('img');
    if (!img) return;

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
    
    // Animate thumbnails exit simultaneously with fullscreen
    const thumbnailsContainer = this.modal.querySelector('.fullscreen-thumbnails');
    if (thumbnailsContainer) {
      closeTl.to(thumbnailsContainer, {
        yPercent: 100,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        onComplete: () => {
          thumbnailsContainer.remove();
        }
      }, 0);
    }
    
    // Remove event listeners
    closeTl.call(() => {
      this.removeFullscreenNavigation();
    }, [], 0.1);

    // Fade out modal background
    closeTl.to(this.modal, {
      backgroundColor: 'rgba(0, 0, 0, 0)',
      duration: 0.6,
      ease: "power2.out",
    }, 0);
    
    // Fade out and scale down the fullscreen image
    closeTl.fromTo(img, 
      {
        clipPath: 'inset(0% 0% 0% 0%)',
        opacity: 1,
        scale: 1
      },
      {
        clipPath: 'inset(10% 10% 10% 10%)',
        opacity: 0,
        scale: 0.8,
        duration: 0.8,
        ease: "power2.inOut"
      }, 0);
    
    // Fade in gallery items
    closeTl.to(this.container.querySelectorAll('.slider-item'), { 
      opacity: 1, 
      duration: 0.8,
      ease: "power2.out"
    }, 0.3);
    
    // Fade in expand icon
    const closeParentItem = this.originalImage.closest('.slider-item');
    if (closeParentItem) {
      const icon = closeParentItem.querySelector('.expand-icon');
      if (icon) {
        closeTl.to(icon, { 
          opacity: 1, 
          duration: 0.6,
          ease: "power2.out"
        }, 0.3);
        
        // Force ensure icon is visible after animation
        closeTl.call(() => {
          if (icon) {
            icon.style.opacity = '1';
            icon.style.visibility = 'visible';
            icon.style.display = 'block';
          }
        }, [], 0.9);
        
        // Additional fallback for navigated images
        if (this.hasNavigatedAway) {
          closeTl.call(() => {
            if (icon) {
              icon.style.opacity = '1';
              icon.style.visibility = 'visible';
              icon.style.display = 'block';
            }
          }, [], 1.0);
        }
      }
    }

    this.currentAnimation = closeTl;
  }

  performOriginalClose() {
    const img = this.modal.querySelector('img');
    if (!img) return;

    // Get the original image position and size
    const rect = this.originalImage.getBoundingClientRect();

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
    
    // Animate thumbnails exit simultaneously with fullscreen
    const thumbnailsContainer = this.modal.querySelector('.fullscreen-thumbnails');
    if (thumbnailsContainer) {
      closeTl.to(thumbnailsContainer, {
        yPercent: 100,
        opacity: 0,
        duration: 1.2,
        ease: "power4.inOut",
        onComplete: () => {
          thumbnailsContainer.remove();
        }
      }, 0);
    }
    
    // Remove event listeners
    closeTl.call(() => {
      this.removeFullscreenNavigation();
    }, [], 0.3);

    // Fade out modal background
    closeTl.to(this.modal, {
      backgroundColor: 'rgba(0, 0, 0, 0)',
      duration: 0.6,
      ease: "power2.out"
    }, 0);
    
    // Fade in gallery items
    closeTl.to(this.container.querySelectorAll('.slider-item'), { 
      opacity: 1, 
      duration: 0.8,
      ease: "power2.out"
    }, 0.7);
    
    // Fade in expand icon
    const closeParentItem = this.originalImage.closest('.slider-item');
    if (closeParentItem) {
      const icon = closeParentItem.querySelector('.expand-icon');
      if (icon) {
        closeTl.to(icon, { 
          opacity: 1, 
          duration: 0.6,
          ease: "power2.out"
        }, 0);
        
        // Force ensure icon is visible after animation
        closeTl.call(() => {
          if (icon) {
            icon.style.opacity = '1';
            icon.style.visibility = 'visible';
            icon.style.display = 'block';
          }
        }, [], 1.5);
      }
    }

    // STEP 3 → STEP 2.5: Scale down to center with elegant perspective transition
    closeTl.to(img, {
      top: '50%',
      left: '50%',
      xPercent: -50,
      yPercent: -50,
      width: '90vw',
      height: '90vh',
      clipPath: 'polygon(16% 11%, 87% 9%, 100% 100%, 15% 87%)', // Match the refined elegant perspective from open
      duration: 0.8,
      ease: "power4.in"
    }, 0);

    // STEP 2 → STEP 1: Scale back to thumbnail
    closeTl.to(img, {
      top: rect.top,
      left: rect.left,
      xPercent: 0,
      yPercent: 0,
      width: rect.width,
      height: rect.height,
      clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', // Final normal state
      objectFit: 'cover',
      duration: 0.7,
      ease: "power4.out"
    }, 0.8); // Overlap with previous step

    this.currentAnimation = closeTl;
  }

  createMobileNavigationArrows() {
    // Remove existing arrows if they exist
    const existingArrows = this.modal.querySelectorAll('.mobile-nav-arrow');
    existingArrows.forEach(arrow => arrow.remove());

    // Create left arrow
    const leftArrow = document.createElement('div');
    leftArrow.className = 'mobile-nav-arrow mobile-nav-arrow-left';
    leftArrow.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 18L9 12L15 6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
    
    // Create right arrow
    const rightArrow = document.createElement('div');
    rightArrow.className = 'mobile-nav-arrow mobile-nav-arrow-right';
    rightArrow.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 18L15 12L9 6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;

    // Add click handlers
    leftArrow.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.prevFullscreenImage();
    });

    rightArrow.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.nextFullscreenImage();
    });

    // Add touch handlers for better mobile experience
    leftArrow.addEventListener('touchend', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.prevFullscreenImage();
    });

    rightArrow.addEventListener('touchend', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.nextFullscreenImage();
    });

    // Add to modal
    this.modal.appendChild(leftArrow);
    this.modal.appendChild(rightArrow);

    // Animate arrows in
    gsap.fromTo([leftArrow, rightArrow], 
      { opacity: 0, scale: 0.8 },
      { 
        opacity: 1, 
        scale: 1, 
        duration: 0.4, 
        ease: "power2.out",
        stagger: 0.1
      }
    );
  }

  addFullscreenNavigation() {
    // Create thumbnails container only if not already created
    if (!this.modal.querySelector('.fullscreen-thumbnails')) {
      this.createThumbnails();
    }
    
    // Add navigation arrows for mobile screens (under 650px)
    if (window.innerWidth < 650) {
      this.createMobileNavigationArrows();
    }
    
    // Add mousewheel event listener for fullscreen navigation
    this.fullscreenWheelHandler = (e) => {
      e.preventDefault();
      e.stopPropagation(); // Prevent main gallery wheel handler from interfering
      
      // Add debounce to prevent rapid scrolling
      if (this.wheelTimeout) return;
      
      this.wheelTimeout = setTimeout(() => {
        this.wheelTimeout = null;
      }, 100); // 100ms debounce
      
      if (e.deltaY > 0) {
        // Scroll down - next image
        this.nextFullscreenImage();
      } else {
        // Scroll up - previous image
        this.prevFullscreenImage();
      }
    };

    // Add touch events for mobile
    this.fullscreenTouchStartY = 0;
    this.fullscreenTouchHandler = (e) => {
      if (e.type === 'touchstart') {
        this.fullscreenTouchStartY = e.touches[0].clientY;
      } else if (e.type === 'touchend') {
        const touchEndY = e.changedTouches[0].clientY;
        const deltaY = touchEndY - this.fullscreenTouchStartY;
        
        if (Math.abs(deltaY) > 50) {
          if (deltaY > 0) {
            this.prevFullscreenImage();
          } else {
            this.nextFullscreenImage();
          }
        }
      }
    };

    // Add keyboard events
    this.fullscreenKeyHandler = (e) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'ArrowLeft':
          e.preventDefault();
          this.prevFullscreenImage();
          break;
        case 'ArrowDown':
        case 'ArrowRight':
          e.preventDefault();
          this.nextFullscreenImage();
          break;
      }
    };

    // Add event listeners
    this.modal.addEventListener('wheel', this.fullscreenWheelHandler, { passive: false });
    this.modal.addEventListener('touchstart', this.fullscreenTouchHandler, { passive: true });
    this.modal.addEventListener('touchend', this.fullscreenTouchHandler, { passive: true });
    document.addEventListener('keydown', this.fullscreenKeyHandler);
  }

  removeFullscreenNavigation() {
    // Clear wheel timeout
    if (this.wheelTimeout) {
      clearTimeout(this.wheelTimeout);
      this.wheelTimeout = null;
    }
    
    // Remove event listeners
    if (this.fullscreenWheelHandler) {
      this.modal.removeEventListener('wheel', this.fullscreenWheelHandler);
    }
    if (this.fullscreenTouchHandler) {
      this.modal.removeEventListener('touchstart', this.fullscreenTouchHandler);
      this.modal.removeEventListener('touchend', this.fullscreenTouchHandler);
    }
    if (this.fullscreenKeyHandler) {
      document.removeEventListener('keydown', this.fullscreenKeyHandler);
    }
    
    // Remove mobile navigation arrows
    const mobileArrows = this.modal.querySelectorAll('.mobile-nav-arrow');
    mobileArrows.forEach(arrow => arrow.remove());
    
    // Remove cursor for fullscreen gallery
    if (window.cursor) {
      window.cursor.classList.remove("slide-gallery");
    }
    
    // Remove document-level mousemove handler
    if (this.fullscreenMouseMoveHandler) {
      document.removeEventListener('mousemove', this.fullscreenMouseMoveHandler);
      this.fullscreenMouseMoveHandler = null;
    }
    
    // Force remove cursor class to ensure it's gone
    setTimeout(() => {
      if (window.cursor) {
        window.cursor.classList.remove("slide-gallery");
      }
    }, 100);
    
    // Ensure expand icon is visible
    if (this.originalImage) {
      const closeParentItem = this.originalImage.closest('.slider-item');
      if (closeParentItem) {
        const icon = closeParentItem.querySelector('.expand-icon');
        if (icon) {
          icon.style.opacity = '1';
          icon.style.visibility = 'visible';
          icon.style.display = 'block';
        }
      }
    }
  }

  nextFullscreenImage() {
    if (!this.originalImages || this.originalImages.length === 0) return;
    
    // Track cycle for infinite scroll positioning
    if (this.currentOriginalIndex === this.originalImages.length - 1) {
      this.currentCycle++;
    }
    
    this.currentOriginalIndex = (this.currentOriginalIndex + 1) % this.originalImages.length;
    this.currentFullscreenIndex = this.allFullscreenImages.indexOf(this.originalImages[this.currentOriginalIndex]);
    
    // Mark that user has navigated away from originally clicked image
    const currentImage = this.originalImages[this.currentOriginalIndex];
    if (currentImage !== this.originallyClickedImage) {
      this.hasNavigatedAway = true;
    }
    
    this.updateFullscreenImage();
    this.updateThumbnails(); // Ensure thumbnails are updated
    
    // Ensure indicator is centered after a short delay
    setTimeout(() => {
      this.ensureIndicatorCentered();
    }, 100);
  }

  prevFullscreenImage() {
    if (!this.originalImages || this.originalImages.length === 0) return;
    
    // Track cycle for infinite scroll positioning
    if (this.currentOriginalIndex === 0) {
      this.currentCycle--;
    }
    
    this.currentOriginalIndex = this.currentOriginalIndex === 0 
      ? this.originalImages.length - 1 
      : this.currentOriginalIndex - 1;
    this.currentFullscreenIndex = this.allFullscreenImages.indexOf(this.originalImages[this.currentOriginalIndex]);
    
    // Mark that user has navigated away from originally clicked image
    const currentImage = this.originalImages[this.currentOriginalIndex];
    if (currentImage !== this.originallyClickedImage) {
      this.hasNavigatedAway = true;
    }
    
    this.updateFullscreenImage();
    this.updateThumbnails(); // Ensure thumbnails are updated
    
    // Ensure indicator is centered after a short delay
    setTimeout(() => {
      this.ensureIndicatorCentered();
    }, 100);
  }

  createThumbnails() {
    if (!this.originalImages || this.originalImages.length === 0) return;
    
    // Create thumbnails container
    const thumbnailsContainer = document.createElement('div');
    thumbnailsContainer.className = 'fullscreen-thumbnails entering';
    
    // Set initial position for animation
    gsap.set(thumbnailsContainer, {
      yPercent: 100,
      opacity: 0
    });
    
    // Prevent clicks on container from closing modal
    thumbnailsContainer.addEventListener('click', (e) => {
      e.stopPropagation();
    });
    
    // Create thumbnails for each original image (3x for infinite scroll)
    for (let clone = 0; clone < 3; clone++) {
      this.originalImages.forEach((img, index) => {
        const thumbnail = document.createElement('div');
        thumbnail.className = `fullscreen-thumbnail ${index === this.currentOriginalIndex ? 'active' : ''}`;
        thumbnail.dataset.originalIndex = index; // Store original index for click handling
        
        const thumbnailImg = document.createElement('img');
        thumbnailImg.src = img.src;
        thumbnailImg.alt = img.alt;
        
        thumbnail.appendChild(thumbnailImg);
        
        // Add click event
        thumbnail.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.goToOriginalImage(index);
        });
        
        thumbnailsContainer.appendChild(thumbnail);
      });
    }
    
    this.modal.appendChild(thumbnailsContainer);
    
    // Add drag functionality to thumbnails container
    this.addDragToScroll(thumbnailsContainer);
    
    // Animate container entrance - simultaneous with fullscreen
    gsap.to(thumbnailsContainer, {
      yPercent: 0,
      opacity: 1,
      duration: 1.2,
      ease: "power4.inOut"
    });
  }

    updateThumbnails() {
    const thumbnails = this.modal.querySelectorAll('.fullscreen-thumbnail');
    const thumbnailsContainer = this.modal.querySelector('.fullscreen-thumbnails');
    
    // Update all thumbnails with the same original index
    thumbnails.forEach((thumbnail) => {
      const originalIndex = parseInt(thumbnail.dataset.originalIndex);
      if (originalIndex === this.currentOriginalIndex) {
        thumbnail.classList.add('active');
      } else {
        thumbnail.classList.remove('active');
      }
    });
    
    // Center the active thumbnail to show it as an indicator
    if (thumbnailsContainer && thumbnails.length > 0) {
      // Find all active thumbnails
      const activeThumbnails = Array.from(thumbnails).filter(thumb => 
        parseInt(thumb.dataset.originalIndex) === this.currentOriginalIndex
      );
      
      if (activeThumbnails.length > 0) {
        // Always use the middle section thumbnail for centering
        const middleSectionIndex = Math.floor(thumbnails.length / 3);
        const activeThumbnail = activeThumbnails.find(thumb => 
          Array.from(thumbnails).indexOf(thumb) >= middleSectionIndex && 
          Array.from(thumbnails).indexOf(thumb) < middleSectionIndex * 2
        ) || activeThumbnails[0];
        
        // Calculate the center position for the active thumbnail
        let scrollLeft = activeThumbnail.offsetLeft - (thumbnailsContainer.clientWidth / 2) + (activeThumbnail.offsetWidth / 2);
        
        // Handle infinite scroll wrapping for auto-scroll
        const thumbnailWidth = thumbnails[0].offsetWidth + 24;
        const totalWidth = thumbnails.length * thumbnailWidth;
        const sectionWidth = totalWidth / 3; // Width of one complete set of thumbnails
        
        // Simple cycle-based positioning
        scrollLeft += (this.currentCycle * sectionWidth);
        
        // Keep within bounds
        if (scrollLeft > sectionWidth * 2) {
          scrollLeft -= sectionWidth;
        } else if (scrollLeft < sectionWidth) {
          scrollLeft += sectionWidth;
        }
        
        // Update scroll position
        this.thumbnailsScrollX = scrollLeft;
      }
    }
  }

  goToOriginalImage(index) {
    if (index === this.currentOriginalIndex || !this.originalImages[index]) return;
    
    // Calculate cycle change for infinite scroll positioning
    const cycleChange = Math.floor(index / this.originalImages.length) - Math.floor(this.currentOriginalIndex / this.originalImages.length);
    this.currentCycle += cycleChange;
    
    this.currentOriginalIndex = index;
    this.currentFullscreenIndex = this.allFullscreenImages.indexOf(this.originalImages[index]);
    
    // Mark that user has navigated away from originally clicked image
    const currentImage = this.originalImages[index];
    if (currentImage !== this.originallyClickedImage) {
      this.hasNavigatedAway = true;
    }
    
    this.updateFullscreenImage();
    this.updateThumbnails();
    
    // Ensure indicator is centered after a short delay
    setTimeout(() => {
      this.ensureIndicatorCentered();
    }, 100);
  }

  addDragToScroll(container) {
    // Use the exact same pattern as the infinity gallery
    let isDragging = false;
    let dragStartX = 0;
    let scrollX = 0;
    let smoothScrollX = 0;
    let dragStartTime = 0;
    let animationFrameId = null;
    
    // Calculate container dimensions for infinite scroll
    const thumbnails = container.querySelectorAll('.fullscreen-thumbnail');
    const thumbnailWidth = thumbnails.length > 0 ? thumbnails[0].offsetWidth + 24 : 0; // 24px for gap
    const containerWidth = container.clientWidth;
    const totalWidth = thumbnails.length * thumbnailWidth;
    
    // Use the same settings as the infinity gallery
    const isMobile = window.innerWidth < 650;
    const isIPad = /iPad|Macintosh/.test(navigator.userAgent) && 'ontouchend' in document;
    
    // Core settings matching the infinity gallery
    const lerp = isMobile ? 0.1 : 0.05; // Same as infinity gallery
    const dragMultiplier = isMobile ? 3 : 3; // Same as infinity gallery
    
    // Adjust for iPad specifically (same as infinity gallery)
    const finalLerp = isIPad ? 0.06 : lerp;
    const finalDragMultiplier = isIPad ? 2.5 : dragMultiplier;

    const handleInfiniteScroll = () => {
      const sectionWidth = totalWidth / 3; // Width of one complete set of thumbnails
      
      // If scrolled too far right, wrap to the left
      if (scrollX > sectionWidth * 2) {
        scrollX -= sectionWidth;
        smoothScrollX -= sectionWidth;
      }
      // If scrolled too far left, wrap to the right
      else if (scrollX < sectionWidth) {
        scrollX += sectionWidth;
        smoothScrollX += sectionWidth;
      }
    };

    const animate = () => {
      if (!isDragging) {
        // Use external scrollX if available (for sync), otherwise use local
        const targetScrollX = this.thumbnailsScrollX !== undefined ? this.thumbnailsScrollX : scrollX;
        smoothScrollX += (targetScrollX - smoothScrollX) * finalLerp;
        container.scrollLeft = smoothScrollX;
      }
      animationFrameId = requestAnimationFrame(animate);
    };
    
    // Store animation function for external control
    this.thumbnailsAnimate = animate;
    this.thumbnailsIsDragging = () => isDragging;
    this.thumbnailsScrollX = scrollX;
    this.thumbnailsSmoothScrollX = smoothScrollX;

    const handleMouseDown = (e) => {
      isDragging = true;
      dragStartX = e.clientX;
      scrollX = container.scrollLeft;
      smoothScrollX = container.scrollLeft;
      // Update external variables
      this.thumbnailsScrollX = scrollX;
      this.thumbnailsSmoothScrollX = smoothScrollX;
      dragStartTime = Date.now();
      container.style.cursor = 'grabbing';
      container.style.userSelect = 'none';
    };

    const handleMouseMove = (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const deltaX = e.clientX - dragStartX;
      dragStartX = e.clientX;
      scrollX -= deltaX * finalDragMultiplier;
      handleInfiniteScroll(); // Handle infinite scroll wrapping
      // Update external variables
      this.thumbnailsScrollX = scrollX;
      this.thumbnailsSmoothScrollX = smoothScrollX;
      container.scrollLeft = scrollX; // Direct response during drag
    };

    const handleMouseUp = (e) => {
      if (!isDragging) return;
      isDragging = false;
      container.style.cursor = 'grab';
      container.style.userSelect = 'auto';
      
      // Check if it was a quick drag (potential click)
      const dragDuration = Date.now() - dragStartTime;
      const dragDistance = Math.abs(e.clientX - dragStartX);
      
      // If it was a very short drag with minimal movement, treat as click
      if (dragDuration < 200 && dragDistance < 10) {
        // Find the clicked thumbnail
        const clickedThumbnail = e.target.closest('.fullscreen-thumbnail');
        if (clickedThumbnail) {
          const thumbnails = container.querySelectorAll('.fullscreen-thumbnail');
          const index = Array.from(thumbnails).indexOf(clickedThumbnail);
          if (index !== -1) {
            this.goToOriginalImage(index);
          }
        }
      }
      
      // Ensure indicator is centered after drag ends
      setTimeout(() => {
        this.ensureIndicatorCentered();
      }, 200);
    };

    const handleMouseLeave = () => {
      if (isDragging) {
        isDragging = false;
        container.style.cursor = 'grab';
        container.style.userSelect = 'auto';
      }
    };

    // Start the animation loop
    animate();

    // Add event listeners
    container.addEventListener('mousedown', handleMouseDown);
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('mouseleave', handleMouseLeave);
    
    // Add touch events for mobile
    container.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      handleMouseDown({ clientX: touch.clientX });
    }, { passive: false });
    
    container.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      handleMouseMove({ clientX: touch.clientX, preventDefault: () => {} });
    }, { passive: false });
    
    container.addEventListener('touchend', (e) => {
      const touch = e.changedTouches[0];
      handleMouseUp({ clientX: touch.clientX });
    });
    
    // Set initial cursor style
    container.style.cursor = 'grab';
    
    // Store reference to this container for external updates
    this.thumbnailsContainer = container;
    this.thumbnailsScrollX = scrollX;
    this.thumbnailsSmoothScrollX = smoothScrollX;
    
    // Set initial position to middle section for infinite scroll
    const sectionWidth = totalWidth / 3;
    scrollX = sectionWidth;
    smoothScrollX = sectionWidth;
    container.scrollLeft = sectionWidth;
    
    // Store section width for infinite scroll calculations
    this.thumbnailsSectionWidth = sectionWidth;
    
    // Store initial position for external access
    this.thumbnailsScrollX = scrollX;
    this.thumbnailsSmoothScrollX = smoothScrollX;
  }

  // Method to sync main gallery position to current fullscreen image
  syncMainGalleryToFullscreen() {
    if (!this.originalImages || this.originalImages.length === 0) return;
    
    // Find the current fullscreen image in the main gallery
    const currentFullscreenImage = this.originalImages[this.currentOriginalIndex];
    if (!currentFullscreenImage) return;
    
    // Find the slider item containing this image
    const sliderItems = this.container.querySelectorAll('.slider-item');
    let targetItem = null;
    let targetIndex = -1;
    
    sliderItems.forEach((item, index) => {
      const img = item.querySelector('img');
      if (img && img.src === currentFullscreenImage.src) {
        targetItem = item;
        targetIndex = index;
      }
    });
    
    if (targetItem) {
      // Calculate the position to center this item in the main gallery
      const containerRect = this.container.parentElement.getBoundingClientRect();
      const itemRect = targetItem.getBoundingClientRect();
      const viewportCenter = containerRect.width / 2;
      const itemCenter = itemRect.left - containerRect.left + itemRect.width / 2;
      
      // Calculate how much we need to scroll to center this item
      const scrollAdjustment = itemCenter - viewportCenter;
      const targetScrollX = this.scrollX + scrollAdjustment;
      
      // INSTANTLY set the main gallery position without animation
      this.scrollX = targetScrollX;
      this.smoothScrollX = targetScrollX;
      this.container.style.transform = `translateX(${-this.smoothScrollX}px)`;
      this.container.style.webkitTransform = `translateX(${-this.smoothScrollX}px)`;
      
      // Handle infinite scroll to ensure we're in the correct range
      this.handleInfiniteScroll();
    }
  }

  // Method to finalize main gallery position after close animation
  finalizeMainGalleryPosition() {
    if (!this.originalImages || this.originalImages.length === 0) return;
    
    // Find the current fullscreen image in the main gallery
    const currentFullscreenImage = this.originalImages[this.currentOriginalIndex];
    if (!currentFullscreenImage) return;
    
    // Find the slider item containing this image
    const sliderItems = this.container.querySelectorAll('.slider-item');
    let targetItem = null;
    
    sliderItems.forEach((item) => {
      const img = item.querySelector('img');
      if (img && img.src === currentFullscreenImage.src) {
        targetItem = item;
      }
    });
    
    if (targetItem) {
      // Calculate the position to center this item in the main gallery
      const containerRect = this.container.parentElement.getBoundingClientRect();
      const itemRect = targetItem.getBoundingClientRect();
      const viewportCenter = containerRect.width / 2;
      const itemCenter = itemRect.left - containerRect.left + itemRect.width / 2;
      
      // Check if the image is already centered (within 50px tolerance)
      const isCentered = Math.abs(itemCenter - viewportCenter) < 50;
      
      if (!isCentered) {
        // Calculate how much we need to scroll to center this item
        const scrollAdjustment = itemCenter - viewportCenter;
        const targetScrollX = this.scrollX + scrollAdjustment;
        
        // INSTANTLY set the main gallery position without animation
        this.scrollX = targetScrollX;
        this.smoothScrollX = targetScrollX;
        this.container.style.transform = `translateX(${-this.smoothScrollX}px)`;
        this.container.style.webkitTransform = `translateX(${-this.smoothScrollX}px)`;
        
        // Handle infinite scroll to ensure we're in the correct range
        this.handleInfiniteScroll();
      }
    }
  }

  // Method to sync thumbnail gallery with main gallery movement - Centered Infinite Indicator
  syncThumbnailsWithMainGallery(mainGalleryScrollX, mainGallerySmoothScrollX) {
    if (!this.thumbnailsContainer) return;
    
    // Don't sync if user is dragging the thumbnail gallery
    if (this.thumbnailsIsDragging && this.thumbnailsIsDragging()) return;
    
    const thumbnails = this.thumbnailsContainer.querySelectorAll('.fullscreen-thumbnail');
    if (thumbnails.length === 0) return;
    
    // Get the main gallery container to calculate proper ratios
    const mainGalleryContainer = document.querySelector('.slider-wrapper');
    const mainGalleryItems = mainGalleryContainer.children;
    const mainGalleryItemWidth = mainGalleryItems.length > 0 ? mainGalleryItems[0].offsetWidth : 300;
    const mainGalleryTotalWidth = mainGalleryItems.length * mainGalleryItemWidth;
    
    const thumbnailWidth = thumbnails[0].offsetWidth + 24; // Thumbnail width + gap
    const thumbnailGalleryWidth = thumbnails.length * thumbnailWidth;
    
    // Map main gallery position to thumbnail gallery position
    // Use the smooth scroll position for smooth following
    const ratio = thumbnailGalleryWidth / mainGalleryTotalWidth;
    let targetScrollX = mainGallerySmoothScrollX * ratio;
    
    // Handle infinite scroll wrapping for sync
    const sectionWidth = thumbnailGalleryWidth / 3; // Width of one complete set of thumbnails
    
    // If scrolling would go beyond bounds, wrap to the other side
    if (targetScrollX > sectionWidth * 2) {
      targetScrollX -= sectionWidth;
    } else if (targetScrollX < sectionWidth) {
      targetScrollX += sectionWidth;
    }
    
    // Update the scrollX target for the thumbnail animation system
    if (this.thumbnailsScrollX !== undefined) {
      this.thumbnailsScrollX = targetScrollX;
    }
  }

  updateFullscreenImage() {
    if (!this.allFullscreenImages || !this.allFullscreenImages[this.currentFullscreenIndex]) return;
    
    const newImage = this.allFullscreenImages[this.currentFullscreenIndex];
    const modalImg = this.modal.querySelector('img');
    
    if (modalImg && newImage) {
      // Direct image replacement without fade animation
      modalImg.src = newImage.src;
      modalImg.alt = newImage.alt;
      
      // Update originalImage reference to current image
      this.originalImage = newImage;
      
      // Update thumbnails immediately
      this.updateThumbnails();
    }
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
    // Calculate width of original items first
    this.originalWidth = 0;
    this.items.forEach((item) => {
      const itemWidth = item.getBoundingClientRect().width;
      const itemMarginRight = parseFloat(getComputedStyle(item).marginRight);
      this.originalWidth += itemWidth + itemMarginRight;
    });
    
    // Total width includes cloned sections (3x original width)
    this.totalWidth = this.originalWidth * 3;
    
    // Calculate precise initial positioning to center first slide
    const firstSlideIndex = Math.floor(this.items.length / 3); // Get from middle section
    const firstSlide = this.items[firstSlideIndex];
    
    if (firstSlide) {
      const containerRect = this.container.parentElement.getBoundingClientRect();
      const viewportCenter = containerRect.width / 2;
      
      // Calculate the left position of the first slide within the container
      let accumulatedWidth = 0;
      for (let i = 0; i < firstSlideIndex; i++) {
        const item = this.items[i];
        const itemWidth = item.getBoundingClientRect().width;
        const itemMarginRight = parseFloat(getComputedStyle(item).marginRight) || 0;
        accumulatedWidth += itemWidth + itemMarginRight;
      }
      
      // Calculate where the first slide's center should be positioned
      const firstSlideWidth = firstSlide.getBoundingClientRect().width;
      const firstSlideCenter = accumulatedWidth + (firstSlideWidth / 2);
      
      // Position scrollX so the first slide center aligns with viewport center
      this.scrollX = firstSlideCenter - viewportCenter;
      this.smoothScrollX = this.scrollX;
      
      // Store the center position for infinite scroll logic
      this.centerPosition = this.scrollX;
    } else {
      // Fallback to original behavior if no slides found
      this.scrollX = this.originalWidth;
      this.smoothScrollX = this.originalWidth;
      this.centerPosition = this.originalWidth;
    }
    
    // Use smoothScrollX for the initial transform to ensure smooth animation
    this.container.style.transform = `translateX(${-this.smoothScrollX}px)`;
  }

  // handleResize method removed - resize handling disabled to prevent gallery interference

  init() {
    this.bindEvents();
    
    // Ensure we start at the correct position
    this.handleInfiniteScroll();
    
    this.animate();
    // Resize handling disabled to prevent gallery interference
    // window.addEventListener("resize", () => {
    //   this.handleResize();
    // });
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
    // this.handleResize = this.handleResize.bind(this); // Disabled
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
    
    // Resize event for handling expand icons visibility
    this.handleResize = this.handleResize.bind(this);
    window.addEventListener("resize", this.handleResize);
  }

  handleKeydown(e) {
    if (e.key === "Escape" && this.isFullscreenOpen) {
      // Remove cursor immediately when closing with Escape
      if (window.cursor) {
        window.cursor.classList.remove("slide-gallery");
      }
      
      // Remove document-level mousemove handler immediately
      if (this.fullscreenMouseMoveHandler) {
        document.removeEventListener('mousemove', this.fullscreenMouseMoveHandler);
        this.fullscreenMouseMoveHandler = null;
      }
      
      this.closeFullscreen();
    }
  }

  handleResize() {
    // Handle expand icons visibility on resize
    this.handleExpandIcons();
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
    
    // Remove snapping logic for true infinite scroll
    // this.snapOnSettle = false;
    // if (this.snapAnimation) {
    //   this.snapAnimation.kill();
    //   this.snapAnimation = null;
    // }

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
    // Remove snapping logic for true infinite scroll
    // this.snapOnSettle = true;
  }

  handleDragStart(e) {
    if (!this.scrollEnabled || this.isFullscreenOpen) return; // Prevent scrolling when fullscreen is open
    
    // Remove snapping logic for true infinite scroll
    // this.snapOnSettle = false;
    // if (this.snapAnimation) {
    //   this.snapAnimation.kill();
    //   this.snapAnimation = null;
    // }

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
    // Remove snapping logic for true infinite scroll
    // this.snapOnSettle = true;
  }

  handleInfiniteScroll() {
    // Use the stored center position for consistent infinite scroll behavior
    const buffer = this.originalWidth * 0.3; // 30% buffer to ensure smoother transition
    
    // Ensure we're always within the valid range before checking for wrapping
    const minPosition = this.centerPosition - this.originalWidth * 0.5;
    const maxPosition = this.centerPosition + this.originalWidth * 1.5;
    
    // If scrolled too far right (well into the "after" clones)
    if (this.scrollX > this.centerPosition + this.originalWidth + buffer) {
      this.scrollX -= this.originalWidth;
      this.smoothScrollX -= this.originalWidth;
    }
    // If scrolled too far left (well into the "before" clones)  
    else if (this.scrollX < this.centerPosition - buffer) {
      this.scrollX += this.originalWidth;
      this.smoothScrollX += this.originalWidth;
    }
    
    // Additional safety check to ensure we stay within bounds
    if (this.scrollX < minPosition) {
      this.scrollX = minPosition;
      this.smoothScrollX = minPosition;
    } else if (this.scrollX > maxPosition) {
      this.scrollX = maxPosition;
      this.smoothScrollX = maxPosition;
    }
  }

  // Method to scroll to a specific slide by index, centered in viewport
  scrollToSlide(direction) {
    if (!this.scrollEnabled || this.isFullscreenOpen) return;
    
    // Ensure we're in the correct range before navigation
    this.handleInfiniteScroll();
    
    // Get all items (including clones)
    const allItems = Array.from(this.container.children);
    
    if (allItems.length === 0) return;
    
    // Get viewport center
    const containerRect = this.container.parentElement.getBoundingClientRect();
    const viewportCenter = containerRect.width / 2;
    
    // Find currently centered slide by checking which slide is closest to viewport center
    let currentCenteredIndex = 0;
    let closestDistance = Infinity;
    
    allItems.forEach((slide, index) => {
      const slideRect = slide.getBoundingClientRect();
      const containerRect = this.container.parentElement.getBoundingClientRect();
      
      // Calculate slide center relative to viewport
      const slideCenter = slideRect.left - containerRect.left + slideRect.width / 2;
      const distanceFromCenter = Math.abs(slideCenter - viewportCenter);
      
      if (distanceFromCenter < closestDistance) {
        closestDistance = distanceFromCenter;
        currentCenteredIndex = index;
      }
    });
    
    // Calculate target slide index - always go to next/previous slide
    let targetIndex;
    if (direction === 'left') {
      targetIndex = currentCenteredIndex - 1;
    } else {
      targetIndex = currentCenteredIndex + 1;
    }
    
    // Handle infinite loop by wrapping around
    if (targetIndex < 0) {
      targetIndex = allItems.length - 1;
    } else if (targetIndex >= allItems.length) {
      targetIndex = 0;
    }
    
    // Get target slide
    const targetSlide = allItems[targetIndex];
    if (!targetSlide) return;
    
    // Calculate exact position to center the target slide
    const targetSlideRect = targetSlide.getBoundingClientRect();
    const containerRect2 = this.container.parentElement.getBoundingClientRect();
    
    // Current slide center position relative to container
    const currentSlideCenter = targetSlideRect.left - containerRect2.left + targetSlideRect.width / 2;
    
    // Calculate how much we need to scroll to center this slide
    const scrollAdjustment = currentSlideCenter - viewportCenter;
    const targetPosition = this.scrollX + scrollAdjustment;
    
    // Fast, snap-accurate scroll to target position using GSAP
    gsap.to(this, {
      scrollX: targetPosition,
      duration: 0.35,
      ease: "expo.out",
      onUpdate: () => {
        this.handleInfiniteScroll();
      },
      onComplete: () => {
        // Ensure we're exactly at the target position for pixel-perfect accuracy
        this.scrollX = targetPosition;
        // Final check to ensure infinite scroll is properly applied
        this.handleInfiniteScroll();
        
        // Additional safety check to ensure we're in the correct range
        setTimeout(() => {
          this.handleInfiniteScroll();
        }, 50);
      }
    });
  }

  // snapToCenter() function removed for true infinite scroll
  // This function was causing unwanted snapping behavior

  animate() {
    if (this.scrollEnabled && !this.isFullscreenOpen) {
      this.smoothScrollX += (this.scrollX - this.smoothScrollX) * this.lerp;
      this.container.style.transform = `translateX(${-this.smoothScrollX}px)`;
      this.container.style.webkitTransform = `translateX(${-this.smoothScrollX}px)`;

      // Sync thumbnail gallery with main gallery movement
      if (window.infinitySliderInstance && window.infinitySliderInstance.syncThumbnailsWithMainGallery) {
        window.infinitySliderInstance.syncThumbnailsWithMainGallery(this.scrollX, this.smoothScrollX);
      }
      
      // Also try to sync with any open fullscreen modal
      const fullscreenModal = document.querySelector('.fullscreen-modal');
      if (fullscreenModal && fullscreenModal.syncThumbnailsWithMainGallery) {
        fullscreenModal.syncThumbnailsWithMainGallery(this.scrollX, this.smoothScrollX);
      }

      // Remove snapping behavior for true infinite scroll
      // if (this.snapOnSettle && !this.isDragging && Math.abs(this.scrollX - this.smoothScrollX) < 0.5) {
      //     this.snapToCenter();
      //     this.snapOnSettle = false;
      // }
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
    // window.removeEventListener("resize", this.handleResize); // Disabled
    window.removeEventListener("resize", this.handleResize);
    document.removeEventListener("keydown", this.handleKeydown);

    // Remove the modal from the DOM to ensure it's fresh on next init
    if (this.modal) {
      this.modal.remove();
    }

    // Remove navigation arrows from the slider container
    const navContainer = document.querySelector('.gallery-navigation');
    if (navContainer) {
      navContainer.remove();
    }

    // Nullify references to help with garbage collection
    this.container = null;
    this.items = null;
    this.modal = null;
    this.originalImage = null; // Prevent stale references
  }
}

    window.infinitySliderInstance = new InfiniteHorizontalScroll(sliderWrapper);
    
    // Add navigation arrows inside the .slider container, after .slider-wrapper
    const sliderContainer = sliderWrapper.parentElement; // This is the .slider element
    if (sliderContainer) {
      // Create arrow container
      const navWrapper = document.createElement('div');
      navWrapper.className = 'gallery-navigation';

      // Create left arrow
      const leftArrow = document.createElement('button');
      leftArrow.className = 'gallery-arrow gallery-arrow-left';
      leftArrow.innerHTML = '&#8249;'; // ‹
      leftArrow.setAttribute('aria-label', 'Previous images');

      // Create right arrow
      const rightArrow = document.createElement('button');
      rightArrow.className = 'gallery-arrow gallery-arrow-right';
      rightArrow.innerHTML = '&#8250;'; // ›
      rightArrow.setAttribute('aria-label', 'Next images');

      navWrapper.appendChild(leftArrow);
      navWrapper.appendChild(rightArrow);
      
      // Insert after the slider wrapper, inside the slider container
      sliderContainer.appendChild(navWrapper);

      // Add click handlers for slide-by-slide navigation
      leftArrow.addEventListener('click', () => {
        if (window.infinitySliderInstance && window.infinitySliderInstance.scrollEnabled) {
          window.infinitySliderInstance.scrollToSlide('left');
        }
      });
      
      rightArrow.addEventListener('click', () => {
        if (window.infinitySliderInstance && window.infinitySliderInstance.scrollEnabled) {
          window.infinitySliderInstance.scrollToSlide('right');
        }
      });
    }
} catch (error) {
  // Infinity gallery initialization skipped
}
}




/* ==============================================
Script Loading Utility
============================================== */








/* ==============================================
Fullscreen Mega Menu Core (No Infinity Logic)
============================================== */

function initMegaMenu() {
  // Prevent multiple initializations
  if (window.megaMenuInitialized) {
    return;
  }
  window.megaMenuInitialized = true;

const style = document.createElement("style");
style.textContent = `.mega-menu.hide { display: block; }`;
document.head.appendChild(style);

  // Global animation settings
  const ANIMATION = {
      duration: 1,
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
  overwrite: true,
  onComplete: () => {
      gsap.set(megaMenu, { pointerEvents: 'auto' });
      isAnimating = false;
      currentTimeline = null;
  }
});

currentTimeline = tl;

    // Allow menu to be closeable after exactly 0.8 seconds from click
  tl.call(() => {
      canClose = true;
      // Don't set isAnimating = false here - keep it true until close animation completes
  }, [], 0.8);

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
          overwrite: true,
          onComplete: () => {
              gsap.set(overlay, { pointerEvents: 'none' });
              gsap.set(megaMenu, { pointerEvents: 'none' });
              // Reset clip-paths to bottom position for next opening
              gsap.set(megaMenu, { clipPath: 'inset(0% 0% 100% 0%)' });
              gsap.set('.mega-menu-links a', { clipPath: 'inset(0% 0% 100% 0%)' });
              isAnimating = false;
              canClose = false; // Reset close permission
              isClosing = false; // Reset closing flag
              currentTimeline = null;
          }
      });
      
      currentTimeline = tl;

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
  let canClose = false;
  let currentTimeline = null;
  let isClosing = false;
  
  menuToggle.addEventListener('click', () => {
      if (!menuToggle.classList.contains('clicked')) {
          if (isClosing) return; // Prevent opening during close animation
          isAnimating = true;
          canClose = false;
          openMenu();
      } else {
          if (!canClose) return; // Prevent closing before 0.8s
          // Always allow closing - overlap with current animation
          isAnimating = true;
          isClosing = true; // Mark that we're closing
          closeMenu();
      }
  });

  megaMenu.addEventListener('click', (e) => {
      if (
          e.target.classList.contains('mega-menu') ||
          e.target.closest('.mega-menu-links a')
      ) {
          // Add small delay before closing menu when clicking links
          setTimeout(() => {
              closeMenu();
          }, 200);
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
          // Only animate if menu is open
          if (menuToggle.classList.contains('clicked')) {
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
          }
      });
  });

  // On mouseleave of the whole container, fade out all except the default image
  if (menuLinksContainer) {
      menuLinksContainer.addEventListener('mouseleave', () => {
          // Only reset if menu is open
          if (menuToggle.classList.contains('clicked')) {
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
          }
      });
  }
  // --- END: Mega Menu Link Hover Image Animation ---
}



// Track width for split text mobile threshold detection
let lastWidth = window.innerWidth;

window.addEventListener('resize', () => {
  // Handle split text mobile threshold changes
  const currentWidth = window.innerWidth;
  const wasMobile = lastWidth < 650;
  const isMobile = currentWidth < 650;
  
  if (wasMobile !== isMobile) {
    // Reinitialize split text animations when crossing mobile threshold
    // Force refresh handled by existing initSplitTextAnimations
  }
  
  lastWidth = currentWidth;
});


function initHomeVideo(forceReinit = false) {
  // Prevent double initialization unless forced
  if (window.videoInitialized && !forceReinit) {
      return;
  }
  
  try {
      const videoContainer = document.getElementById("video-container");
      if (!videoContainer) {
          return;
      }

      // Clear existing video if reinitializing
      if (forceReinit) {
          const existingVideo = videoContainer.querySelector('video');
          if (existingVideo) {
              existingVideo.remove();
          }
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
      video.preload = "none"; // Don't preload to avoid slowing down page load
      video.style.opacity = "0"; // Start with 0 opacity for fade-in

      const source = document.createElement("source");
      source.src = videoSrc;
      source.type = "video/mp4";

      video.appendChild(source);
      
      // Add video to container immediately
      videoContainer.appendChild(video);
      
      // Load video immediately
      video.load();
      
      // Start playing and fade in when video is ready
      video.addEventListener('canplay', () => {
          video.play().catch(e => {}); // Silent fail for autoplay
          
          // Fade in the video over 0.2 seconds
          if (typeof gsap !== 'undefined') {
              gsap.to(video, {
                  opacity: 1,
                  duration: 0.2,
                  ease: "power2.out"
              });
          } else {
              // Fallback for when GSAP is not available
              video.style.transition = "opacity 0.2s ease-out";
              video.style.opacity = "1";
          }
      });
      
      // Mark as initialized
      window.videoInitialized = true;
      
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
    
    // Apply line truncation to info elements
    if (info) {
      truncateText(info, TEXT_LIMITS.propertyInfoLines, 'lines');
    }
    
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
    
    // Let the global event listener handle the navigation
    // No need to call globalPageTransition here - the global listener will handle it
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





// Function to handle filter changes on projects page
function handleProjectsPageFilterChanges() {
  // Get the list container
  const listContainer = document.querySelector('[fs-cmsfilter-element="list"]');
  if (!listContainer) return;

  // Kill any existing GSAP tweens on the container
  gsap.killTweensOf(listContainer);
  
  // Immediately reset the container to trigger a proper recalculation
  listContainer.style.height = 'auto';
  listContainer.style.opacity = '0.8';
  listContainer.style.transition = 'opacity 0.3s ease';
  
  // Force a reflow to ensure the height calculation is accurate
  listContainer.offsetHeight;
  
  // Wait for FinSweet filter to complete its filtering
  setTimeout(() => {
    // Reset container properties
    listContainer.style.height = 'auto';
    listContainer.style.opacity = '1';
    listContainer.style.transition = 'opacity 0.3s ease';
    
    // Force another reflow
    listContainer.offsetHeight;
    
    // Trigger a window resize event to recalculate everything like manual resize
    window.dispatchEvent(new Event('resize'));
    
    // Refresh ScrollTrigger to recalculate positions based on new page height
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh(true);
    }
    
    // Reinitialize SplitText animations for any new visible content
    if (typeof SplitText !== 'undefined') {
      initSplitTextAnimations();
    }
    
    // Additional refresh after a short delay to ensure everything is properly updated
    setTimeout(() => {
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh(true);
      }
    }, 100);
  }, 100); // Wait 100ms for FinSweet filter to complete
}

window.handleProjectsPageFilterChanges = handleProjectsPageFilterChanges;

// Enhanced global handler for radio button changes
document.addEventListener('click', (e) => {
const radioButton = e.target.closest('.w-radio input[type="radio"]');
if (radioButton) {
  // Check if we're on the projects page
  const isProjectsPage = window.location.pathname.includes('projects') || 
                        window.location.pathname.includes('all-projects') ||
                        document.querySelector('[fs-cmsfilter-element="filters"]');
  
  if (isProjectsPage) {
    // Call the specific handler for projects page filter changes
    handleProjectsPageFilterChanges();
  } else {
    // General ScrollTrigger refresh for other pages
    if (typeof ScrollTrigger !== 'undefined') {
      setTimeout(() => ScrollTrigger.refresh(true), 100);
    }
  }
}
});









// --- GLOBAL CONSOLE WARNING SUPPRESSION ---
function setupGlobalGsapProtection() {
// Store original console.warn
const originalWarn = console.warn;

// Override console.warn to filter out GSAP warnings
console.warn = function(...args) {
  const message = args.join(' ');
  
  // Suppress GSAP target not found warnings
  if (message.includes('GSAP target') && message.includes('not found')) {
    return; // Don't log these warnings
  }
  
  // Suppress ScrollTrigger element not found warnings
  if (message.includes('Element not found:')) {
    return; // Don't log these warnings
  }
  
  // Log all other warnings normally
  originalWarn.apply(console, args);
};
}
// --- END GLOBAL CONSOLE WARNING SUPPRESSION ---

// Initialize forms when page loads
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, checking for forms...');
  setTimeout(() => {
    replaceWebflowForms();
  }, 1000);
});

// Custom Webflow form handler
function createCustomWebflowForm(formData) {
  // Create form element
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = 'https://webflow.com/api/v1/form/submit';
  form.style.display = 'none';
  
  // Add form fields
  Object.keys(formData).forEach(key => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = key;
    input.value = formData[key];
    form.appendChild(input);
  });
  
  // Add to page and submit
  document.body.appendChild(form);
  form.submit();
}

// Custom form submission function
function submitToWebflow(formElement, successCallback, errorCallback) {
  const formData = new FormData(formElement);
  
  // Get form ID based on form element
  let formId = '';
  let redirectUrl = '/thank-you';
  
  if (formElement.id === 'wf-form-Contact-Page-Form') {
    formId = '3c466ca9-7f4b-a479-b755-35f10e6d39af'; // Contact Page Form ID
  } else if (formElement.id === 'footer-form') {
    formId = '89682d13-77a4-c01b-8366-53f6f043533f'; // Footer Form ID
  }
  
  // Add form metadata
  formData.append('formId', formId);
  formData.append('pageId', '683625562ee8a0f6224dc842');
  formData.append('redirect', redirectUrl);
  
  // Create a temporary form and submit it
  const tempForm = document.createElement('form');
  tempForm.method = 'POST';
  tempForm.action = 'https://webflow.com/api/v1/form/submit';
  tempForm.style.display = 'none';
  
  // Add all form data
  for (let [key, value] of formData.entries()) {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = key;
    input.value = value;
    tempForm.appendChild(input);
  }
  
  // Add to page and submit
  document.body.appendChild(tempForm);
  tempForm.submit();
  
  // Call success callback immediately (since we're redirecting)
  successCallback({ success: true });
}

// Function to replace Webflow forms with custom ones
function replaceWebflowForms() {
  console.log('replaceWebflowForms called');
  
  const webflowForms = document.querySelectorAll('form[data-wf-form]');
  console.log('Found', webflowForms.length, 'Webflow forms to replace');
  
  if (webflowForms.length === 0) {
    console.log('No Webflow forms found, checking for any forms...');
    const anyForms = document.querySelectorAll('form');
    console.log('Found', anyForms.length, 'total forms');
  }
  
  webflowForms.forEach(webflowForm => {
    // Create custom form wrapper
    const customForm = document.createElement('form');
    customForm.id = webflowForm.id; // Keep the same ID
    customForm.className = webflowForm.className; // Keep the same classes
    customForm.style.cssText = webflowForm.style.cssText;
    
    // Copy all form fields and labels
    const formElements = webflowForm.querySelectorAll('label, input, textarea, select');
    formElements.forEach(element => {
      const newElement = element.cloneNode(true);
      customForm.appendChild(newElement);
    });
    
    // Find the original submit button and copy its styling
    const originalSubmitButton = webflowForm.querySelector('input[type="submit"], button[type="submit"]');
    const submitButton = document.createElement('input');
    submitButton.type = 'submit';
    submitButton.value = originalSubmitButton ? originalSubmitButton.value : 'שלח';
    submitButton.className = originalSubmitButton ? originalSubmitButton.className : 'w-button';
    
    // Add submit handler
    customForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Show loading state
      const originalValue = submitButton.value;
      submitButton.value = 'שולח...';
      submitButton.disabled = true;
      
      // Submit to Webflow
      submitToWebflow(customForm, 
        (result) => {
          // Success
          submitButton.value = 'נשלח בהצלחה!';
          submitButton.style.backgroundColor = '#4CAF50';
          submitButton.style.color = 'white';
          
          // Show success message
          const successMessage = document.createElement('div');
          successMessage.className = 'success-message w-form-done';
          successMessage.innerHTML = '<div>תודה! ההודעה שלך התקבלה בהצלחה!</div>';
          customForm.appendChild(successMessage);
          
          setTimeout(() => {
            submitButton.value = originalValue;
            submitButton.disabled = false;
            submitButton.style.backgroundColor = '';
            submitButton.style.color = '';
            if (successMessage.parentNode) {
              successMessage.parentNode.removeChild(successMessage);
            }
          }, 3000);
        },
        (error) => {
          // Error
          submitButton.value = 'שגיאה - נסה שוב';
          submitButton.style.backgroundColor = '#f44336';
          submitButton.style.color = 'white';
          
          // Show error message
          const errorMessage = document.createElement('div');
          errorMessage.className = 'error-message w-form-fail';
          errorMessage.innerHTML = '<div class="error-msg">שגיאה - בדקו את השדות ונסו שנית</div>';
          customForm.appendChild(errorMessage);
          
          setTimeout(() => {
            submitButton.value = originalValue;
            submitButton.disabled = false;
            submitButton.style.backgroundColor = '';
            submitButton.style.color = '';
            if (errorMessage.parentNode) {
              errorMessage.parentNode.removeChild(errorMessage);
            }
          }, 3000);
        }
      );
    });
    
    customForm.appendChild(submitButton);
    
    // Replace the Webflow form
    webflowForm.parentNode.replaceChild(customForm, webflowForm);
  });
}


