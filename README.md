# Courier Nav (Ionic) – Projekt zaliczeniowy

Aplikacja mobilna (Ionic + Angular) dla kuriera: wybór trasy z serwisu REST, lista waypointów z opisami, nawigacja do punktów oraz odblokowywanie materiałów po dotarciu na miejsce. Postęp jest zapamiętywany lokalnie na urządzeniu (visited).

## Funkcjonalności (co jest zrobione)

### Wymagania podstawowe

*  **Wybór trasy dla kuriera z serwisu REST** (min. 3 trasy)
*  **Pobranie waypointów** dla wybranej trasy z REST (tytuł, opis, współrzędne)
*  **Nawigacja do punktu** – przycisk uruchamia trasę w Google Maps

### Dodatkowe funkcjonalności

*  **Materiały po dotarciu na miejsce** (blokada do czasu spełnienia warunku GPS):

  * tekst / instrukcje
  * kody odbioru
  * audio (mp3) odtwarzane w aplikacji
  * wideo:

    * YouTube – osadzone w aplikacji (iframe)
    * MP4 – odtwarzane w aplikacji
*  **Zapamiętywanie postępu** (visited + timestamp) lokalnie w urządzeniu (localStorage)
*  **Sprawdzanie dotarcia na miejsce**:

  * wyświetlanie promienia zaliczenia (radiusMeters)
  * wyświetlanie aktualnej odległości użytkownika od punktu

## Technologie

* Ionic + Angular (standalone components)
* json-server jako proste REST API (db.json)
* Geolocation API (przeglądarka / urządzenie)
* localStorage (persist postępu)

---

## Struktura projektu

```
courier-nav/        # aplikacja Ionic
api/                # REST mock (json-server)
  db.json
  public/
    audio/
    video/
```

---

## Uruchomienie (krok po kroku)

### 1) Wymagania

* Node.js + npm
* Ionic CLI

### 2) API (json-server)

W folderze `api/`:

```powershell
npm install
npm run start
```

API działa domyślnie na:

* `http://127.0.0.1:3001`

### 3) Aplikacja Ionic

W folderze `courier-nav/`:

```powershell
npm install
ionic serve
```

Aplikacja działa domyślnie na:

* `http://localhost:8100`

---

## Endpointy REST (przykład)

* `GET /routes` – lista tras
* `GET /waypoints?routeId=1&_sort=order` – waypointy dla trasy
* `GET /waypoints/:id` – szczegóły waypointa
* `GET /materials?waypointId=101` – materiały dla waypointa

---

## Dane testowe

Dane tras, waypointów i materiałów są w `api/db.json`.
Pliki audio/wideo mogą być w `api/public/audio` i `api/public/video` (json-server serwuje je statycznie).

---

## Notatki / ograniczenia

* Geolokalizacja w przeglądarce może mieć gorszą dokładność niż na telefonie.
* YouTube iframe może zachowywać się różnie w zależności od środowiska (browser vs WebView).

---

## Autor

Projekt zaliczeniowy – aplikacja kuriera (Ionic).
