# Parkolóhely-foglalási Rendszer - Felhasználói Kézikönyv

## 1. Gyors Indítás (Quick Start)

### Opció A: Indítás Docker Compose segítségével (Javasolt)
A teljes rendszer (alkalmazás + inicializált adatbázis) indítása egyetlen paranccsal:

```bash
docker-compose up --build
```
vagy újabb Docker CLI-vel:
```bash
docker compose up --build
```

Indítás után az alábbi címen érhető el a rendszer:
- **Web Dashboard:** `http://localhost:3000`
- **API Swagger Dokumentáció:** `http://localhost:3000/api-docs`

---

### Opció B: Indítás Helyi Fejlesztői Környezetben (Node.js)

1. **Függőségek telepítése:**
   ```bash
   npm install
   ```
2. **Adatbázis sémájának szinkronizálása és feltöltése kezdő adatokkal:**
   ```bash
   npm run db:push
   ```
3. **Alkalmazás indítása:**
   ```bash
   npm start
   ```
4. **Automata Tesztek Futtatása:**
   ```bash
   npm test
   ```

---

## 2. A Webes Felület Használata

A rendszer felülete modernebb sötét témájú (glassmorphism) és reszponzív kialakítású:

1. **Parkolóhelyek megtekintése:**
   - A főoldalon kártyák formájában láthatók a parkolóhelyek.
   - Szűrőgombok segítségével típus szerint szűrhetők (Normál, ⚡ EV Töltő, ♿ Mozgáskorlátozott, ⭐ VIP).
   - Zöld/sárga visszajelző mutatja, ha egy hely jelenleg éppen szabad vagy foglalt.
2. **Új foglalás rögzítése:**
   - Kattints a jobb felső **"Új Foglalás"** gombra vagy bármelyik parkolóhely kártyáján lévő foglalás gombra.
   - Töltsd ki a kérelmező nevét, válassz kezdő- és záró időpontot.
   - Kattints a **"Foglalás Rögzítése"** gombra.
   - Ha az időpont ütközik egy meglévő megerősített foglalással, a rendszer piros figyelmeztető üzenetben tájékoztat az ütközés részleteiről.
3. **Foglalások lemondása:**
   - A lap alján található táblázatban megtekinthetők a rögzített foglalások.
   - A **"Lemondás"** gombra kattintva a foglalás státusza `CANCELLED`-re változik, így a hely újra foglalhatóvá válik arra az időszakra.
