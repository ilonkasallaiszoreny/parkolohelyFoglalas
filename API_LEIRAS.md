# Parkolóhely-foglalási Rendszer - API Leírás

Az API REST konvenciókat követ, JSON formátumú kérést és választ használ.

Alapértelmezett URL: `http://localhost:3000/api`
Interaktív Swagger UI: `http://localhost:3000/api-docs`

---

## 1. Parkolóhelyek (`/api/spots`)

### `GET /api/spots`
Parkolóhelyek listázása.

**Query paraméterek (Opcionális):**
- `type` (string): Szűrés típus alapján (`STANDARD`, `EV_CHARGING`, `HANDICAPPED`, `VIP`).

**Minta Válasz (200 OK):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": "c8d0e74f-...",
      "code": "P-101",
      "name": "A-01 Normál",
      "type": "STANDARD",
      "location": "1. Emelet - A Zóna",
      "isActive": true
    },
    {
      "id": "f2a1b98c-...",
      "code": "P-201",
      "name": "E-01 Elektromos Töltő",
      "type": "EV_CHARGING",
      "location": "1. Emelet - EV Zóna",
      "isActive": true
    }
  ]
}
```

---

### `GET /api/spots/:id`
Egy konkrét parkolóhely adatai a hozzá tartozó aktív foglalásokkal együtt.

**Minta Válasz (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "c8d0e74f-...",
    "code": "P-101",
    "name": "A-01 Normál",
    "type": "STANDARD",
    "location": "1. Emelet - A Zóna",
    "reservations": [...]
  }
}
```

---

### `POST /api/spots`
Új parkolóhely rögzítése.

**Kérés törzs (JSON):**
```json
{
  "code": "P-501",
  "name": "B-01 Normál",
  "type": "STANDARD",
  "location": "2. Emelet"
}
```

---

## 2. Foglalások (`/api/reservations`)

### `GET /api/reservations`
Foglalások lekérdezése szűrési lehetőségekkel.

**Query paraméterek (Opcionális):**
- `spotId` (string): Konkrét parkolóhely ID.
- `from` (string, ISO-8601): Kezdő dátum szűrő.
- `to` (string, ISO-8601): Záró dátum szűrő.
- `status` (string): `CONFIRMED` vagy `CANCELLED`.

**Minta Válasz (200 OK):**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "id": "a91b2c3d-...",
      "spotId": "c8d0e74f-...",
      "requesterName": "Kovács Péter",
      "licensePlate": "ABC-123",
      "startTime": "2026-08-06T09:00:00.000Z",
      "endTime": "2026-08-06T17:00:00.000Z",
      "status": "CONFIRMED",
      "spot": {
        "code": "P-101",
        "name": "A-01 Normál"
      }
    }
  ]
}
```

---

### `POST /api/reservations`
Új foglalási kérés beküldése.

**Kérés törzs (JSON):**
```json
{
  "spotId": "c8d0e74f-...",
  "requesterName": "Nagy Anna",
  "licensePlate": "XYZ-789",
  "startTime": "2026-08-07T10:00:00.000Z",
  "endTime": "2026-08-07T14:00:00.000Z"
}
```

**Sikeres Válasz (201 Created):**
```json
{
  "success": true,
  "message": "Foglalás sikeresen rögzítve.",
  "data": {
    "id": "e4f5g6h7-...",
    "spotId": "c8d0e74f-...",
    "requesterName": "Nagy Anna",
    "licensePlate": "XYZ-789",
    "startTime": "2026-08-07T10:00:00.000Z",
    "endTime": "2026-08-07T14:00:00.000Z",
    "status": "CONFIRMED"
  }
}
```

**Ütközési Hiba (409 Conflict):**
```json
{
  "success": false,
  "error": "A parkolóhely már foglalt a megadott időintervallumban (Ütközés: 2026. 08. 07. 09:00 - 2026. 08. 07. 12:00)."
}
```

---

### `DELETE /api/reservations/:id`
Foglalás lemondása.

**Sikeres Válasz (200 OK):**
```json
{
  "success": true,
  "message": "A foglalás sikeresen lemondva.",
  "data": {
    "id": "e4f5g6h7-...",
    "status": "CANCELLED"
  }
}
```
