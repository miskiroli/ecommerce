# [ShopZone] - Webshop és Admin Panel

Üdvözlünk a [ShopZone] repository-ban! Ez egy React alapú webalkalmazás, amely egy e-kereskedelmi platformot és egy adminisztrációs panelt kínál a termékek, felhasználók és rendelések kezelésére. A projekt célja, hogy intuitív és reszponzív felületet biztosítson mind az ügyfelek, mind az adminisztrátorok számára.

## Főbb jellemzők
- **E-kereskedelmi funkciók**:
  - Termékek böngészése és részletes megtekintése (`/shop`, `/product/:id`).
  - Bevásárlókocsi kezelése (`/cart`).
  - Fizetési folyamat (`/checkout`).
  - Legújabb termékek kiemelése (`/latest`).
  - Kapcsolatfelvételi oldal (`/contact`).
- **Felhasználói fiókok**:
  - Bejelentkezés és regisztráció (`/login`, `/register`).
  - Profil kezelése (`/profile`).
  - Jelszóváltoztatás.
- **Adminisztrációs felület**:
  - Admin dashboard a felhasználók és rendelések kezelésére (`/admin/dashboard`).
- **Reszponzív dizájn**: Az alkalmazás minden képernyőméreten (mobil, táblagép, desktop) jól működik.
- **Hitelesítés**: Biztonságos token alapú hitelesítés a `localStorage`-ban tárolt tokennel.
- **API integráció**: Kommunikáció egy backend API-val (pl. `/api/check-login`, `/api/logout`, `/api/user/change-password`).

## Technológiák
- **Frontend**: React, React Router
- **API kliens**: Axios
- **Értesítések**: SweetAlert2
- **Állapotkezelés**: Context API (CartProvider, LoadingProvider)
- **Stílus**: CSS (egyedi stílusok)
- **Fejlesztési eszközök**: Node.js, npm

## Telepítés

### Előfeltételek
- Node.js (v14.x vagy újabb)
- npm (v6.x vagy újabb)
- Git (a repository klónozásához)

### Lépések
1. Klónozd a repository-t:
   ```bash
   git clone https://github.com/[felhasználóneved]/[projekt-neve].git
   ```
2. Navigálj a projekthez:
   ```bash
   cd [projekt-neve]
   ```
3. Telepítsd a függőségeket:
   ```bash
   npm install
   ```
4. Indítsd el a fejlesztői szervert:
   ```bash
   npm start
   ```
   - Ez elindítja az alkalmazást a `http://localhost:3000` címen.

### Build készítése
A production build készítéséhez futtasd:
```bash
npm run build
```
Ez létrehoz egy `build` mappát a statikus fájlokkal, amelyeket egy szerverre feltölthetsz.

## Használat
- **Ügyfélként**:
  - Látogass el a `/shop` oldalra a termékek böngészéséhez.
  - Add a termékeket a kosárba (`/cart`), majd fizess a `/checkout` oldalon.
  - Regisztrálj vagy jelentkezz be (`/login`, `/register`), majd kezeld a profilodat (`/profile`).
- **Adminisztrátorként**:
  - Jelentkezz be admin fiókkal, és lépj az `/admin/dashboard` oldalra a felhasználók és rendelések kezelésére.
- **További oldalak**:
  - Nézd meg a feltételeket (`/terms`) és az adatvédelmi irányelveket (`/privacy`).

## Telepítés szerverre
A projektet egy statikus szerverre (pl. Hostinger) is feltöltheted:
1. Hozz létre egy build-et (`npm run build`).
2. Töltsd fel a `build` mappa tartalmát a szerver dokumentumgyökér mappájába (pl. `public_html/subdomain`).
3. Állíts be egy `.htaccess` fájlt a React Router támogatásához:
   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /subdomain/
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteCond %{REQUEST_FILENAME} !-l
     RewriteRule . /subdomain/index.html [L]
   </IfModule>
   ```
   Cseréld a `/subdomain/` részt az aldomained nevére.

## Szerzői jog
© 2025 [A neved]. Minden jog fenntartva.

Ez a projekt a [A neved] szellemi tulajdonát képezi. A kód, dizájn és dokumentáció másolása, módosítása vagy terjesztése kizárólag a szerző írásos engedélyével lehetséges.

## Kapcsolat
- **Készítő**: [Miski Roland]
- **Email**: [miski.roland91@gmail.com]
- **GitHub**: [https://github.com/miskiroli]

## Kösz
