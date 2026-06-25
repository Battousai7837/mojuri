import { useEffect, type RefObject } from 'react';
import { useNavigate } from 'react-router-dom';

// Vendor scripts (loaded once, in order)
const VENDOR_SCRIPTS = [
  '/libs/jquery/js/jquery.min.js',
  '/libs/popper/js/popper.min.js',
  '/libs/bootstrap/js/bootstrap.min.js',
  '/libs/slick/js/slick.min.js',
  '/libs/mmenu/js/jquery.mmenu.all.min.js',
  '/libs/select2/js/select2.min.js',
  '/libs/elevatezoom/js/jquery.elevatezoom.js',
  '/libs/slider/js/jquery.dependClass-0.1.js',
  '/libs/slider/js/draggable-0.1.js',
  '/libs/slider/js/tmpl.js',
  '/libs/slider/js/jquery.slider.js',
];
const APP_SCRIPT = '/assets/js/app.js';

// CSS files to load once
const CSS_FILES = [
  '/libs/bootstrap/css/bootstrap.min.css',
  '/libs/feather-font/css/iconfont.css',
  '/libs/icomoon-font/css/icomoon.css',
  '/libs/font-awesome/css/font-awesome.css',
  '/libs/wpbingofont/css/wpbingofont.css',
  '/libs/elegant-icons/css/elegant.css',
  '/libs/slick/css/slick.css',
  '/libs/slick/css/slick-theme.css',
  '/libs/mmenu/css/mmenu.min.css',
  '/libs/select2/css/select2.min.css',
  '/libs/slider/css/jslider.css',
  '/assets/css/app.css',
  '/assets/css/responsive.css',
  '/assets/css/overrides.css',
];

let cssInjected = false;
let vendorPromise: Promise<void> | null = null;

export function removeLegacyPageCss() {
  document.querySelectorAll('link[data-mojuri-legacy-css="true"]').forEach(link => link.remove());
  cssInjected = false;
}

function ensureCss() {
  if (cssInjected) return;
  cssInjected = true;
  for (const href of CSS_FILES) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.dataset.mojuriLegacyCss = 'true';
    document.head.appendChild(link);
  }
  // Google fonts
  const f1 = document.createElement('link');
  f1.rel = 'stylesheet';
  f1.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700&family=Lato:wght@300;400;700;900&display=swap';
  f1.dataset.mojuriLegacyCss = 'true';
  document.head.appendChild(f1);
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[data-src="${src}"]`);
    if (existing) { resolve(); return; }
    const s = document.createElement('script');
    s.src = src;
    s.dataset.src = src;
    s.async = false;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('Failed: ' + src));
    document.body.appendChild(s);
  });
}

async function loadVendors() {
  if (!vendorPromise) {
    vendorPromise = (async () => {
      for (const s of VENDOR_SCRIPTS) {
        try { await loadScript(s); } catch (e) { console.warn(e); }
      }
    })();
  }
  return vendorPromise;
}

async function runAppScript() {
  // Re-fetch and eval app.js each navigation so DOMReady handlers re-bind to fresh DOM
  try {
    const res = await fetch(APP_SCRIPT);
    const code = await res.text();
    new Function(code)();
  } catch (e) {
    console.warn('app.js error', e);
  }
}

export function usePageScripts(ref: RefObject<HTMLDivElement | null>, title: string) {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = title;
    ensureCss();
    let cancelled = false;
    let pageRoot: HTMLDivElement | null = null;
    const handler = (e: Event) => {
      const target = e.target as HTMLElement;
      const a = target.closest('a') as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.getAttribute('href') || '';
      if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
      if (href.endsWith('.html') || href === 'index.html') {
        e.preventDefault();
        const path = href === 'index.html' ? '/' : '/' + href.replace(/\.html$/, '');
        navigate(path);
        window.scrollTo(0, 0);
      }
    };

    (async () => {
      await loadVendors();
      if (cancelled) return;
      await runAppScript();
      // After scripts run, intercept internal links
      if (cancelled || !ref.current) return;
      pageRoot = ref.current;
      pageRoot.addEventListener('click', handler);
    })();

    return () => {
      cancelled = true;
      pageRoot?.removeEventListener('click', handler);
      removeLegacyPageCss();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
