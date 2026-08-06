# Döntési Napló és Reflexió

## 1. Döntési Napló

| # | Döntési pont | Amit választottál | Miért | Milyen alternatívát vetettél el |
|---|---|---|---|---|
| 1 | Backend Stack | Node.js + Express + TypeScript | Gyors fejlesztés, típusbiztonság, egyszerű Docker konténerizáció és beépített statikus fájl kiszolgálás. | Python FastAPI (több boilerplate a frontend integrációhoz), Java Spring (nehezebb Docker footprint). |
| 2 | Adatbázis & ORM | SQLite + Prisma ORM | Nulla külső adatbázis-függőség szükséges a futtatáshoz, az adatok azonnal inicializálhatók, Prisma tranzakciókezelése biztonságos. | PostgreSQL (külön DB konténert igényelne a Docker-compose-ban), In-Memory JS tömb (nem felelne meg a feladat elvárásainak). |
| 3 | Foglalási Ütközésvizsgálat | Adatbázis-szintű atomi tranzakció (`prisma.$transaction`) | Garantálja a versenyhelyzetek (race-condition) elkerülését párhuzamos foglalások esetén is. | Memóriában történő szűrés (párhuzamos kéréseknél duplafoglaláshoz vezetne). |
| 4 | Lemondás Logikája | Soft Delete (Státusz állítás `CANCELLED`-re) | Megőrizhető az audit napló és a statisztikai adatok a korábbi foglalásokról. | Hard Delete (rekord fizikai törlése az adatbázisból). |
| 5 | Interfész / Megjelenítés | REST API + Swagger UI + Glassmorphic Web Dashboard | Az API programozottan és Swagger-ből is tesztelhető, míg a Web UI vizuálisan is látványos, azonnali demót nyújt. | Pusztán CLI vagy pusztán Swagger felület. |

---

## 2. Rövid Összefoglaló és Reflexió

A megoldás során a legnagyobb kihívást az átfedő foglalási időintervallumok pontos, robusztus és versenyhelyzet-mentes kezelése jelentette. Ezt a matematikailag bizonyított `(start < existing.end) AND (end > existing.start)` logika adatbázis-szintű indexelt szűrésével és Prisma tranzakcióval sikerült tisztán felépíteni. Az alkalmazás szerkezete a Separation of Concerns elvet követi (Routes -> Controllers -> Services -> Prisma Database), így a kód könnyen tesztelhető Jest integrációs tesztekkel. A beépített Web Dashboard segítségével az alkalmazás azonnal, intuitív módon kipróbálható.

---

## 3. AI-eszköz Használat és Prompt Export

### Alkalmazott AI eszköz:
- **Google Antigravity AI Agent (Gemini 3.6 Flash / Pro)**

### Az AI asszisztens szerepe és integrációja a fejlesztésbe:
Az AI eszközt párprogramozóként (Pair Programmer) használtuk a fejlesztési folyamat során. Az AI felelt a projekt vázának felépítéséért, a típusbiztos architektúra tervezéséért, a Docker konténerizációért, az automatizált Jest tesztek megírásáért, valamint a felmerülő kompatibilitási és rendszer-hibák diagnosztizálásáért és javításáért.

---

### Részletes Prompt History és Iterációs Napló:

1. **Prompt 1 (Feladatbeolvasás & Rendszerelemzés):**
   - **Kérés:** `olvasd be a könyvtár tartalmát`
   - **AI Tevékenység & Válasz:** Az AI felderítette a munkakönyvtárat, beolvasta a `parkolohely-foglalas-hazi-feladat.md` specifikációs fájlt, és strukturált magyar nyelvű összefoglalót készített a követelményekről (foglalási ütközésvizsgálat, Docker egyparanccsal indítás, mellékletek).

2. **Prompt 2 (Projekt Kezdeményezése):**
   - **Kérés:** `igen. Let's do it!`
   - **AI Tevékenység & Válasz:** Az AI felmérte a rendszerre telepített eszközöket (Node.js, Python, Docker, Git), majd egy interaktív választási opciót kínált a technológiai stack meghatározására.

3. **Prompt 3 (Stack Kiválasztása):**
   - **Kérés:** *(Kiválasztva)* `Node.js + TypeScript (Express, Prisma/SQLite, Jest, Docker, Web UI & Swagger)`
   - **AI Tevékenység & Válasz:** Az AI felépítette az alkalmazás teljes architektúráját:
     - Prisma SQLite adatbázis séma felépítése.
     - `SpotService` és `ReservationService` atomikus tranzakciós ütközésvizsgálattal (`prisma.$transaction`).
     - REST API kontrollerek és Express útvonalak.
     - Glassmorphic sötét témájú Web Dashboard UI (`public/index.html`, `public/styles.css`, `public/app.js`).
     - Swagger UI OpenAPI dokumentáció (`/api-docs`).
     - 7 darab lefutó Jest integrációs és unit teszt.

4. **Prompt 4 (Git Beállítások Konfigurálása):**
   - **Kérés:** `a git config-hoz használd az 'ilonkasallaiszoreny' felhasználó nevet és user.email 'ilonka.szoreny@student.ms.sapientia.ro'`
   - **AI Tevékenység & Válasz:** Beállította a Git név és e-mail identitást, majd 6 elkülönülő MVP commit-ba rendezte a projekt történetét.

5. **Prompt 5 (GitHub Repository Összekötés):**
   - **Kérés:** `itt az URL: https://github.com/ilonkasallaiszoreny/parkolohelyFoglalas.git`
   - **AI Tevékenység & Válasz:** Összekötötte a helyi tárhelyet a GitHub távoli repóval (`git remote add origin`), átnevezte a fő ágat `main`-re és feltolta az összes commitot (`git push -u origin main`).

6. **Prompt 6 (Docker Hibadiagnosztika & Kompatibilitási Javítás):**
   - **Kérés:** *(Felhasználó elakadási naplója Docker elindításakor: Prisma OpenSSL/musl könyvtár hiány hiba Alpine Linux alatt)*
   - **AI Tevékenység & Válasz:** Az AI azonosította, hogy az Alpine Linux alatt a Prisma motor nem tudja inicializálni az OpenSSL-t. Kicserélte a Docker alapképfájlt `node:24-slim`-re (Debian alap), frissítette a `prisma/schema.prisma` `binaryTargets` mezőjét, megszüntette a duplikált `npm ci` hívásokat, és sikeresen lefuttatta a Docker képet.

7. **Prompt 7 (Verziókezelési Útmutató és Dokumentáció Bővítés):**
   - **Kérés:** `a dontesi_naplo.md 'AI-eszköz Használat és Prompt Export' részét bővítsed`
   - **AI Tevékenység & Válasz:** Bővítette a `DONTESI_NAPLO.md` fájlt a teljes fejlesztési folyamat, a promptok, a döntések és a hibaelhárítások részletes dokumentációjával.

---
*Készült: 2026.08.06.*

