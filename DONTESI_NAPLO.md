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

### Prompt History / Interakciós Napló:
1. **Prompt 1:** `olvasd be a könyvtár tartalmát`
   - *AI válasz:* Beolvasta a `parkolohely-foglalas-hazi-feladat.md` fájlt és összefoglalta a feladat elvárásait.
2. **Prompt 2:** `igen. Let's do it!`
   - *AI válasz:* Megkérdezte a választandó technológiai stacket, majd kiépítette a teljes rendszert (Node.js, Express, TypeScript, Prisma SQLite, Jest tesztek, Docker, Web Dashboard, Rendszerterv, API leírás, Kezikönyv és Döntési napló).

---
*Készült: 2026.08.05.*
