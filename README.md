# Faház Bérlés – Reszponzív egyoldalas weboldal

Természetközeli, modern, SEO-optimalizált faház-bérlési weboldal. TailwindCSS (CDN), reszponzív carousel, strukturált adatok (JSON-LD), gyors és letisztult UI.

## Fő funkciók
- Reszponzív dizájn (mobil/tablet/desktop)
- Természetes (fenyves, köd) hátterek sötét overlay-jel
- Faházak carousel: automatikus, pöttyök, NYILAKKAL vezérelt (húzás letiltva), reduced-motion támogatás
- CTA-k: "Foglalj most" több helyen
- SEO: meta tagek, alt-ok, canonical, Open Graph, Twitter, JSON-LD (ItemList + LodgingBusiness)
- Helyi képek a kártyákhoz: `erdei menedék.jpg`, `tavi.jpg`, `hegyi.jpg`, `romantikus.jpg`

## Mappastruktúra
```
/ (gyökér)
├─ index.html       # Oldal HTML szerkezete + JSON-LD
├─ styles.css       # Stílusok (oldalszintű háttér + komponensek)
├─ script.js        # Navigáció, carousel (nyilakkal, drag tiltva), modal/űrlap logika
├─ erdei menedék.jpg
├─ tavi.jpg
├─ hegyi.jpg
├─ romantikus.jpg
└─ README.md
```

## Helyi futtatás
Nincs build-lépés. Elég megnyitni az `index.html`-t böngészőben.

## Slideshow (carousel) használat és viselkedés
- Asztali és mobil nézetben is a bal/jobb nyilakkal lehet léptetni a kártyákat.
- Húzás/"swipe" teljesen letiltva.
- Mobilon sem tördel a rács (flex-wrap: nowrap), így a karusszel ugyanúgy működik, a kártyák teljes szélességűek.
- Pöttyök kattinthatók; autoplay aktív (PC-n hoverre megáll), respectálja a `prefers-reduced-motion` beállítást.

## GitHub előkészítés
1. Git inicializálás és első commit:
```bash
git init
git add .
git commit -m "Init: Faház bérlés weboldal"
```
2. Távoli repo beállítása (cseréld a saját felhasználó/repo névre):
```bash
git branch -M main
git remote add origin https://github.com/<felhasznalo>/<repo>.git
git push -u origin main
```

## GitHub Pages publikálás
- Lépj a GitHub repo Settings → Pages menübe.
- Source: Deploy from a branch → Branch: `main` / root (`/`).
- Mentés. Néhány perc múlva elérhető lesz: `https://<felhasznalo>.github.io/<repo>/`.

## Képek és háttér
- Kártyaképek helyi fájlok (gyors és stabil betöltés).
- Oldalháttér: Unsplash ködfátyolos fenyves + sötét overlay a `styles.css` `body` szekcióban.

## Testreszabás
- Színek: Tailwind config CDN szakaszban (`index.html`) és `styles.css` változók.
- Új faház: másold a `cabin-card` blokkot az `#cabinsGrid` alá és frissítsd a JSON-LD-t.
- Carousel finomhangolás: `script.js` – autoplay időzítés, pöttyök kezelése; `styles.css` – mobilon nowrap és nyilak pozíciója.

## SEO tippek
- Cseréld a canonical URL-t valós domainre az `index.html`-ben.
- Ellenőrizd a strukturált adatokat a Rich Results Testtel.

## Licenc
Adj hozzá `LICENSE` fájlt (pl. MIT), ha nyilvános projektként osztod meg.
