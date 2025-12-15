# Courier Nav (Ionic) – Projekt zaliczeniowy

Aplikacja mobilna (Ionic + Angular) wspierająca pracę kuriera: wybór trasy z serwisu REST, podgląd waypointów na liście i na mapie, routing po drogach, nawigacja do punktu oraz odblokowywanie materiałów po dotarciu na miejsce. Postęp i zapis offline są przechowywane lokalnie na urządzeniu.

---

## Funkcjonalności

### Wymagania podstawowe

* Wybór trasy dla kuriera z serwisu REST (min. 3 trasy)
* Pobranie waypointów dla wybranej trasy z REST (tytuł, opis, współrzędne, kolejność)
* Nawigacja do punktu – przycisk uruchamia trasę w Google Maps

### Mapa + wyznaczanie trasy

* Mapa OSM (Leaflet) z markerami waypointów
* Routing po drogach (OSRM / Leaflet Routing Machine) – wyświetlanie trasy po drogach między punktami
* Numerowane markery (1, 2, 3…) + kolor visited (zielony dla odwiedzonych)
* Podgląd lokalizacji użytkownika na mapie (śledzenie `watchPosition`)

### Dodatkowe funkcjonalności

* Materiały po dotarciu na miejsce (blokada do czasu spełnienia warunku GPS):

  * tekst / instrukcje
  * kody odbioru (chip)
  * audio (mp3) odtwarzane w aplikacji
  * wideo:

    * YouTube – osadzone w aplikacji (iframe)
    * MP4 – odtwarzane w aplikacji (video tag)
* Sprawdzanie dotarcia na miejsce:

  * wyświetlanie promienia zaliczenia (`radiusMeters`)
  * wyświetlanie aktualnej odległości użytkownika od punktu
  * automatyczne odświeżanie lokalizacji (watchPosition) + ręczne sprawdzenie
* Zapamiętywanie postępu (visited + timestamp) lokalnie w urządzeniu (localStorage)

### Offline mode (zapis trasy na urządzeniu)

* Zapis trasy offline: waypointy + materiały są zapisywane do localStorage (cache z wersjonowaniem)
* Status online/offline w UI
* Przycisk „Pobierz trasę offline”:

  * aktywny tylko, gdy aplikacja jest online i trasa nie jest jeszcze zapisana
  * zablokowany, gdy offline lub trasa już jest zapisana
* Przycisk „Usuń zapis offline”: usuwa flagę offline + dane trasy (waypointy + materiały)
* Ograniczenie: mapa i routing wymagają internetu (kafelki mapy + OSRM). Offline działa dla danych i materiałów.

---

## Technologie

* Ionic + Angular (standalone components)
* Leaflet + Leaflet Routing Machine (routing po drogach)
* OSRM (publiczny routing: `router.project-osrm.org`)
* json-server jako proste REST API (db.json)
* Geolocation API (przeglądarka / urządzenie)
* localStorage (cache offline + progress visited)

---

## Struktura projektu

```
am-project/
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
* `GET /waypoints?routeId=1` – waypointy dla trasy (sortowanie po stronie aplikacji)
* `GET /waypoints/:id` – szczegóły waypointa
* `GET /materials?waypointId=101` – materiały dla waypointa

---

## Dane testowe

Dane tras, waypointów i materiałów są w `api/db.json`.

Pliki audio/wideo można trzymać w:

* `api/public/audio`
* `api/public/video`

(json-server serwuje pliki statycznie pod `http://127.0.0.1:3001/...`)

---

## Test offline (jak sprawdzić)

1. Wejdź w trasę (RoutePage) będąc online
2. Kliknij „Pobierz trasę offline” (cache waypointów + materiałów)
3. Przełącz przeglądarkę/urządzenie w tryb offline
4. Wejdź ponownie w trasę i waypointy:

   * lista waypointów działa z cache
   * materiały (text/code/audio/video link) działają z cache danych
   * mapa i routing są ukryte / niedostępne offline

---

## Notatki / ograniczenia

* Geolokalizacja w przeglądarce może mieć gorszą dokładność niż na telefonie.
* YouTube iframe może zachowywać się różnie w zależności od środowiska (browser vs WebView).
* Routing OSRM używa publicznego endpointu – w środowisku produkcyjnym warto rozważyć własny routing lub limitowanie.

---

## Autor
Anna Rusnak
