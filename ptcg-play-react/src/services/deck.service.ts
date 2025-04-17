import { Card } from './card.service';
import { authService } from './auth.service';
import { ApiError } from './api.error';
import { ApiErrorEnum } from './api.error.enum';

export interface Format {
  id: string;
  name: string;
  sets: string[];
  rules: string[];
}

export interface Deck {
  id: number;
  name: string;
  cards: string[];
  isValid: boolean;
  cardTypes: string[];
  format?: Format[];
}

export interface DeckListResponse {
  ok: boolean;
  decks: Deck[];
}

export interface DeckResponse {
  ok: boolean;
  deck: Deck;
}

export class DeckService {
  private static instance: DeckService;
  private baseUrl: string;

  private constructor() {
    this.baseUrl = `${process.env.REACT_APP_API_URL}/v1/decks`;
  }

  public static getInstance(): DeckService {
    if (!DeckService.instance) {
      DeckService.instance = new DeckService();
    }
    return DeckService.instance;
  }

  private async getHeaders(): Promise<Headers> {
    const token = await authService.getToken();
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    if (token) {
      headers.append('Auth-Token', token);
    }
    return headers;
  }

  public async getList(): Promise<DeckListResponse> {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${this.baseUrl}/list`, {
        method: 'GET',
        headers,
        credentials: 'include'
      });

      if (!response.ok) {
        const error = await response.json();
        throw new ApiError(ApiErrorEnum.API_ERROR, error.error || 'Failed to fetch decks');
      }

      return response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(ApiErrorEnum.API_ERROR, 'Failed to fetch decks');
    }
  }

  public async getDeck(deckId: number): Promise<DeckResponse> {
    const headers = await this.getHeaders();
    const response = await fetch(`${this.baseUrl}/get/${deckId}`, {
      headers
    });

    if (!response.ok) {
      throw new Error('Failed to fetch deck');
    }

    return response.json();
  }

  public async createDeck(deckName: string): Promise<DeckResponse> {
    const headers = await this.getHeaders();
    const response = await fetch(`${this.baseUrl}/save`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        name: deckName,
        cards: []
      })
    });

    if (!response.ok) {
      throw new Error('Failed to create deck');
    }

    return response.json();
  }

  public async saveDeck(deckId: number, name: string, cards: string[]): Promise<DeckResponse> {
    const headers = await this.getHeaders();
    const response = await fetch(`${this.baseUrl}/save`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        id: deckId,
        name,
        cards
      })
    });

    if (!response.ok) {
      throw new Error('Failed to save deck');
    }

    return response.json();
  }

  public async deleteDeck(deckId: number): Promise<Response> {
    const headers = await this.getHeaders();
    const response = await fetch(`${this.baseUrl}/delete`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ id: deckId })
    });

    if (!response.ok) {
      throw new Error('Failed to delete deck');
    }

    return response.json();
  }

  public async rename(deckId: number, name: string): Promise<Response> {
    const headers = await this.getHeaders();
    const response = await fetch(`${this.baseUrl}/rename`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ id: deckId, name })
    });

    if (!response.ok) {
      throw new Error('Failed to rename deck');
    }

    return response.json();
  }

  public async duplicate(deckId: number, name: string): Promise<Response> {
    const headers = await this.getHeaders();
    const response = await fetch(`${this.baseUrl}/duplicate`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ id: deckId, name })
    });

    if (!response.ok) {
      throw new Error('Failed to duplicate deck');
    }

    return response.json();
  }
}

export const deckService = DeckService.getInstance(); 