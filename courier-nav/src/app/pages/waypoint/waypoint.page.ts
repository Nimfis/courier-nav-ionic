import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { ApiService } from '../../services/api.service';
import { ProgressService } from '../../services/progress.service';
import { MaterialDto, WaypointDto } from '../../models/api.models';

@Component({
  selector: 'app-waypoint',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './waypoint.page.html',
})
export class WaypointPage implements OnInit {
  waypointId!: number;

  waypoint?: WaypointDto;
  materials: MaterialDto[] = [];

  loading = true;

  // ✅ blokada materiałów do czasu dotarcia
  arrived = false;
  distanceMeters?: number;

  checkingLocation = false;
  locationError?: string;

  visited = false;
  visitedAt?: string;

  // jeśli w db.json masz ścieżki typu "/audio/plik.mp3"
  // to tu składasz pełny URL
  private readonly API_BASE = 'http://127.0.0.1:3001';

  constructor(
    private ar: ActivatedRoute,
    private api: ApiService,
    private progress: ProgressService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.waypointId = Number(this.ar.snapshot.paramMap.get('id'));

    // status visited (może już wcześniej zaliczone)
    this.visited = this.progress.isVisited(this.waypointId);
    this.visitedAt = this.progress.getVisitedAt(this.waypointId);

    // pobierz waypoint
    this.api.getWaypoint(this.waypointId).subscribe({
      next: (w: WaypointDto) => {
        this.waypoint = w;

        // jeśli był już odwiedzony, to od razu odblokuj materiały
        if (this.visited) this.arrived = true;
      },
      error: (e: unknown) => console.error(e),
    });

    // pobierz materiały (pokażemy je dopiero po arrived=true)
    this.api.getMaterials(this.waypointId).subscribe({
      next: (m: MaterialDto[]) => (this.materials = m),
      error: (e: unknown) => console.error(e),
      complete: () => (this.loading = false),
    });
  }

  // ----------------------------
  // GEO: sprawdzenie dotarcia
  // ----------------------------
  async checkArrival() {
    if (!this.waypoint) return;

    this.locationError = undefined;
    this.checkingLocation = true;

    try {
      const pos = await this.getCurrentPosition();
      const userLat = pos.coords.latitude;
      const userLng = pos.coords.longitude;

      const d = this.distanceInMeters(
        userLat,
        userLng,
        this.waypoint.lat,
        this.waypoint.lng
      );

      this.distanceMeters = Math.round(d);

      const radius = this.waypoint.radiusMeters ?? 50;
      this.arrived = d <= radius;

      if (this.arrived) {
        // ✅ dopiero po dotarciu: oznacz jako odwiedzone + odblokuj materiały
        this.progress.markVisited(this.waypointId);
        this.visited = true;
        this.visitedAt = this.progress.getVisitedAt(this.waypointId);
      }
    } catch (err: any) {
      this.locationError =
        err?.message ??
        'Nie udało się pobrać lokalizacji. Sprawdź uprawnienia GPS.';
    } finally {
      this.checkingLocation = false;
    }
  }

  private getCurrentPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (!('geolocation' in navigator)) {
        reject(new Error('Ta przeglądarka nie obsługuje geolokalizacji.'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        resolve,
        (e) => reject(new Error(this.mapGeoError(e))),
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0,
        }
      );
    });
  }

  private mapGeoError(e: GeolocationPositionError): string {
    switch (e.code) {
      case e.PERMISSION_DENIED:
        return 'Brak zgody na lokalizację (Permission denied).';
      case e.POSITION_UNAVAILABLE:
        return 'Pozycja niedostępna (Position unavailable).';
      case e.TIMEOUT:
        return 'Timeout pobierania lokalizacji.';
      default:
        return 'Błąd geolokalizacji.';
    }
  }

  // Haversine (metry)
  private distanceInMeters(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371000;
    const toRad = (x: number) => (x * Math.PI) / 180;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // ----------------------------
  // Nawigacja
  // ----------------------------
  navigateToPoint() {
    if (!this.waypoint) return;
    const { lat, lng } = this.waypoint;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, '_blank');
  }

  // ----------------------------
  // Media URLe
  // ----------------------------
  resolveUrl(url?: string) {
    if (!url) return '';
    return url.startsWith('http') ? url : `${this.API_BASE}${url}`;
  }

  openUrl(url?: string) {
    const full = this.resolveUrl(url);
    if (!full) return;
    window.open(full, '_blank');
  }

  // ----------------------------
  // YouTube w okienku (iframe)
  // ----------------------------
  isYouTube(url?: string) {
    if (!url) return false;
    return url.includes('youtube.com') || url.includes('youtu.be');
  }

  toYouTubeEmbed(url: string): SafeResourceUrl {
    let id = '';

    try {
      if (url.includes('youtu.be/')) {
        id = url.split('youtu.be/')[1]?.split('?')[0] ?? '';
      } else {
        const u = new URL(url);
        id = u.searchParams.get('v') ?? '';
      }
    } catch {
      const m = url.match(/v=([^&]+)/);
      id = m?.[1] ?? '';
    }

    const embed = `https://www.youtube.com/embed/${id}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(embed);
  }

  asPolishDate(iso?: string) {
    if (!iso) return '';
    return new Date(iso).toLocaleString('pl-PL');
  }
}
