if(!self.define){const e=e=>{"require"!==e&&(e+=".js");let s=Promise.resolve();return r[e]||(s=new Promise((async s=>{if("document"in self){const r=document.createElement("script");r.src=e,document.head.appendChild(r),r.onload=s}else importScripts(e),s()}))),s.then((()=>{if(!r[e])throw new Error(`Module ${e} didn’t register its module`);return r[e]}))},s=(s,r)=>{Promise.all(s.map(e)).then((e=>r(1===e.length?e[0]:e)))},r={require:Promise.resolve(s)};self.define=(s,i,n)=>{r[s]||(r[s]=Promise.resolve().then((()=>{let r={};const c={uri:location.origin+s.slice(1)};return Promise.all(i.map((s=>{switch(s){case"exports":return r;case"module":return c;default:return e(s)}}))).then((e=>{const s=n(...e);return r.default||(r.default=s),r}))})))}}define("./sw.js",["./workbox-3b5792f5"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/all_pages.76a7f9c9.js",revision:"f263c1e306c84606190b0388448f2a52"},{url:"assets/index.171ca0d5.js",revision:"1022073e663c29a710001d53c657001d"},{url:"assets/index.3acb2f3c.css",revision:"9128873b08a08507ca8ff3b9063337fe"},{url:"assets/workbox-window.prod.es5.73a2a4cf.js",revision:"786692479fa3c4f791eb2ba6ec2b3f74"},{url:"icon-152.png",revision:"50e945560c4081853352f0c5aac18167"},{url:"icon-192.png",revision:"b573747086f77d0d50a00129ccb002da"},{url:"icon-512.png",revision:"a816ab0a11cb6e077d43da25d0e0690e"},{url:"index.html",revision:"edd2c17e94ea0054237af2c2282064f2"},{url:"manifest.webmanifest",revision:"fc46576989423b8016e5fe74b6c36b38"},{url:"VERSION.txt",revision:"ea9495d53d78b5a6cd250a78ead42aa0"}],{})}));
//# sourceMappingURL=sw.js.map
