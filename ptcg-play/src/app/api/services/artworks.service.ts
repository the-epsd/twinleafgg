import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { Observable } from 'rxjs';
import { CardArtwork } from '../interfaces/cards.interface';
import { Response } from '../interfaces/response.interface';

export interface UnlockedArtworksResponse extends Response {
  artworks: CardArtwork[];
}

@Injectable({ providedIn: 'root' })
export class ArtworksService {
  constructor(private api: ApiService) { }

  getUnlockedArtworks(): Observable<UnlockedArtworksResponse> {
    return this.api.get<UnlockedArtworksResponse>('/v1/artworks/unlocked');
  }
} 