# 🚗 Parkolóhely-foglalási Rendszer (Backend Házi Feladat)

Teljes körű backend és frontend megoldás parkolóhelyek nyilvántartására, foglalására és lemondására Node.js, Express, TypeScript, Prisma (SQLite) és Docker alapon.

![License](https://img.shields.io/badge/License-ISC-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue)
![Docker](https://img.shields.io/badge/Docker-Ready-green)

---

## 🌟 Főbb Jellemzők

- **Parkolóhelyek kezelése:** Különböző parkolóhely-típusok támogatása (Normál, ⚡ EV Töltő, ♿ Mozgáskorlátozott, ⭐ VIP).
- **Intelligens Útközésmentes Foglalás:** Időbeli átfedések kiszűrése adatbázis-szintű tranzakcióval (`(start < existingEnd) AND (end > existingStart)`).
- **Foglalás Lemondása:** Soft-delete státuszkezelés auditálhatósággal.
- **Interaktív Web Dashboard:** Modern, sötét témájú glassmorphic felület a valós idejű teszteléshez.
- **Swagger API Dokumentáció:** Megtekinthető a `/api-docs` útvonalon.
- **Egyparanccsal indítható:** Docker Compose támogatás beépített kezdőadat-feltöltéssel.
- **Automatizált Tesztek:** Jest integrációs és unit tesztcsomag.

---

## ⚡ Gyors Indítás (Docker)

```bash
docker-compose up --build
```
Az elindulást követően a rendszer azonnal elérhető:
- 🌐 **Web Dashboard:** [http://localhost:3000](http://localhost:3000)
- 📖 **Swagger API Doksi:** [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

---

## 🧪 Tesztek Futtatása Helyileg

```bash
npm install
npm test
```

---

## 📁 Elvárt Mellékletek & Dokumentációk

- 📘 [RENDSZERTERV.md](RENDSZERTERV.md) - Rendszerarchitektúra, ER-diagram, teljesítmény megfontolások.
- 📙 [API_LEIRAS.md](API_LEIRAS.md) - REST API specifikáció és végpont minta kérések/válaszok.
- 📗 [KEZIKONYV.md](KEZIKONYV.md) - Felhasználói és futtatási útmutató.
- 📕 [DONTESI_NAPLO.md](DONTESI_NAPLO.md) - Döntési napló, reflexió és AI használati jegyzőkönyv.
