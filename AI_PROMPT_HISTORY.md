# AI Prompt History (Nyers Export és Interakciós Jegyzőkönyv)

Ez a fájl tartalmazza a fejlesztés során lefolytatott teljes AI beszélgetés nyers exportját és strukturált jegyzőkönyvét.
A teljes gépi JSONL transzkript megtalálható a [`ai-prompt-history-raw.jsonl`](ai-prompt-history-raw.jsonl) fájlban.

---

## Interakciós Napló (Chronological Conversation Export)

### 1. Feladatbeolvasás és elemzés
- **User:** `olvasd be a könyvtár tartalmát`
- **AI:** Beolvasta a `parkolohely-foglalas-hazi-feladat.md` specifikációt és részletes összefoglalót adott a követelményekről (ütközésmentes foglalás, Docker egy paranccsal, elvárt mellékletek, feladatleírás).

### 2. Projekt indítás & Stack egyeztetés
- **User:** `igen. Let's do it!`
- **AI:** Ellenőrizte a helyi környezetet (Node.js, Docker, Python, Git), majd választási opciókat ajánlott fel a technológiai stackhez.
- **User:** `(Recommended) Node.js + TypeScript (Express, Prisma/SQLite, Jest, Docker, Web UI & Swagger)`
- **AI:** Inicializálta a `package.json`-t, felépítette a Prisma SQLite sémát, elkészítette a `SpotService` és `ReservationService` modulokat lefedve az atomikus tranzakciós ütközésvizsgálatot (`(start < existing.end) AND (end > existing.start)`), megírta az Express kontrollereket, felépítette a dark mode Web UI Dashboard-ot és a Swagger API leírást (`/api-docs`), valamint elkészítette az 7 tesztből álló Jest integrációs tesztcsomagot.

### 3. Git identitás beállítása
- **User:** `a git config-hoz használd az 'ilonkasallaiszoreny' felhasználó nevet és user.email 'ilonka.szoreny@student.ms.sapientia.ro'`
- **AI:** Beállította a Git `user.name` és `user.email` értékeket, majd 6 elkülönülő MVP commit-ra bontva elmentette a projekt történetét.

### 4. GitHub összekötés és feltolás
- **User:** `itt az URL: https://github.com/ilonkasallaiszoreny/parkolohelyFoglalas.git`
- **AI:** Összekötötte a tárhelyet a távoli repóval (`git remote add origin`), átnevezte a fő ágat `main`-re és feltolta a commitokat.

### 5. Docker hibaelhárítás és manuális felülvizsgálat
- **User:** *(Hibaelakadási napló beszúrása a docker-compose futtatásakor)*
- **AI & User:** Azonosításra került a Prisma OpenSSL / Alpine Linux kompatibilitási hiba. A `Dockerfile` frissítésre került `node:24-slim` alapképfájlra, valamint bekerültek az alábbi kézi csomag-telepítő sorok:
  - Builder stage: `RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*`
  - Production runner stage: `RUN apt-get update -y && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*`
  Ezt követően a Docker konténer hiba nélkül elindult.

### 6. Verziókezelési útmutató kérése
- **User:** `ha végeztem módosításokat, hogyan commitolom githubra?`
- **AI:** Adott egy lépésről lépésre követhető parancssori útmutatót (`git status`, `git add .`, `git commit -m "..."`, `git push`).

### 7. Döntési Napló bővítés
- **User:** `a dontesi_naplo.md 'AI-eszköz Használat és Prompt Export' részét bővítsed`
- **AI:** Bővítette a `DONTESI_NAPLO.md` dokumentumot a részletes AI használati naplóval és az AI asszisztens szerepének leírásával.

### 8. Rendszerterv felülvizsgálata (Bug-mentesség & Teljesítmény)
- **User:** `a feladatnak ezt az elvárását ("Elvárás a megoldással szemben: legyen bug-mentes és törekedj jó teljesítményre...") vizsgáld felül mégagyszer`
- **AI:** Alaposan kibővítette a `RENDSZERTERV.md` dokumentumot, részletezve a bug-mentességet (atomi tranzakciókezelés, zárt matatematikai átfedés-szűrés, szigorú bementi validáció, hiba-middleware) és a teljesítmény optimalizációkat (B-Tree composite index `@@index([spotId, startTime, endTime, status])`, SQL pushdown, non-blocking I/O).

### 9. Manuális Dockerfile hiba reflexiójának beszúrása
- **User:** `írd le ahova kell, hogy az egyik probléma amibe ütköztem az az volt, hogy a kód generáló hibát követett el a dockerfile generálásánál, ami miatt manuálisan felül kellett vizsgáljam...`
- **AI:** Beépítette a reflexiót a `DONTESI_NAPLO.md` 2. és 3. szekciójába.

### 10. Nyers export elhelyezése GitHub-on
- **User:** `ennek a beszélgetésnek a nyers exportját is tedd fel githubra`
- **AI:** Kimásolta a rendszer által generált `transcript_full.jsonl` nyers transzkript fájlt `ai-prompt-history-raw.jsonl` néven, elkészítette az `AI_PROMPT_HISTORY.md` jegyzőkönyvet, és feltolta őket a GitHub repóba.
