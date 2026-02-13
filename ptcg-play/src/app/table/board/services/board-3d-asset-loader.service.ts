import { Injectable } from '@angular/core';
import { TextureLoader, Texture, RepeatWrapping } from 'three';

@Injectable()
export class Board3dAssetLoaderService {
  private textureLoader: TextureLoader;
  private textureCache: Map<string, Texture>;
  private cardBackTexture: Texture | null = null;
  private boardGridTexture: Texture | null = null;
  private slotGridTexture: Texture | null = null;
  private cardMaskTexture: Texture | null = null;

  private readonly MAX_CONCURRENT_LOADS = 6;
  private activeLoads = 0;
  private loadQueue: Array<() => void> = [];

  constructor() {
    this.textureLoader = new TextureLoader();
    this.textureCache = new Map();
  }

  private async withConcurrencyLimit<T>(loadFn: () => Promise<T>): Promise<T> {
    while (this.activeLoads >= this.MAX_CONCURRENT_LOADS) {
      await new Promise<void>(resolve => this.loadQueue.push(resolve));
    }
    this.activeLoads++;
    try {
      return await loadFn();
    } finally {
      this.activeLoads--;
      const next = this.loadQueue.shift();
      if (next) next();
    }
  }

  /**
   * Load a card texture using the existing image cache service
   */
  async loadCardTexture(scanUrl: string): Promise<Texture> {
    // Check Three.js texture cache first (no concurrency needed for cache hit)
    if (this.textureCache.has(scanUrl)) {
      return this.textureCache.get(scanUrl)!;
    }

    return this.withConcurrencyLimit(async () => {
      // Re-check cache after acquiring slot (another request may have loaded it)
      if (this.textureCache.has(scanUrl)) {
        return this.textureCache.get(scanUrl)!;
      }

      try {
        const isExternal = scanUrl.startsWith('http://') || scanUrl.startsWith('https://');
        const loader = isExternal ? new TextureLoader().setCrossOrigin('anonymous') : this.textureLoader;
        const texture = await loader.loadAsync(scanUrl);

        texture.colorSpace = 'srgb';
        texture.anisotropy = 4;
        texture.flipY = true;

        this.textureCache.set(scanUrl, texture);
        return texture;
    } catch (error) {
      console.warn('Failed to load card texture:', scanUrl, (error as Error)?.message);
      return this.loadCardBack();
    }
    });
  }

  /**
   * Load a custom tool icon texture - direct from URL, same as 2D.
   */
  async loadToolIconTexture(iconPath: string): Promise<Texture> {
    if (this.textureCache.has(iconPath)) {
      return this.textureCache.get(iconPath)!;
    }
    try {
      const isExternal = iconPath.startsWith('http://') || iconPath.startsWith('https://');
      const loader = isExternal ? new TextureLoader().setCrossOrigin('anonymous') : this.textureLoader;
      const texture = await loader.loadAsync(iconPath);
      texture.colorSpace = 'srgb';
      texture.anisotropy = 4;
      texture.flipY = true;
      this.textureCache.set(iconPath, texture);
      return texture;
    } catch (error) {
      console.warn('Failed to load tool icon texture:', iconPath);
      throw error;
    }
  }

  /**
   * Load a sleeve texture - direct from URL, same as 2D.
   */
  async loadSleeveTexture(sleeveUrl: string): Promise<Texture> {
    if (this.textureCache.has(sleeveUrl)) {
      return this.textureCache.get(sleeveUrl)!;
    }
    try {
      const isExternal = sleeveUrl.startsWith('http://') || sleeveUrl.startsWith('https://');
      const loader = isExternal ? new TextureLoader().setCrossOrigin('anonymous') : this.textureLoader;
      const texture = await loader.loadAsync(sleeveUrl);
      texture.colorSpace = 'srgb';
      texture.anisotropy = 4;
      texture.flipY = true;
      this.textureCache.set(sleeveUrl, texture);
      return texture;
    } catch (error) {
      console.warn('Failed to load sleeve texture:', sleeveUrl);
      return this.loadCardBack();
    }
  }

  /**
   * Load the generic card back texture
   */
  async loadCardBack(): Promise<Texture> {
    if (this.cardBackTexture) {
      return this.cardBackTexture;
    }

    try {
      const cardBackUrl = 'assets/cardback.png';
      const texture = await this.textureLoader.loadAsync(cardBackUrl);
      texture.colorSpace = 'srgb';
      texture.anisotropy = 4;
      texture.flipY = true;

      this.cardBackTexture = texture;
      return texture;
    } catch (error) {
      console.error('Failed to load card back texture:', error);
      // Create a simple colored texture as ultimate fallback
      return this.createFallbackTexture();
    }
  }

  /**
   * Load a marker texture (for status conditions)
   */
  async loadMarkerTexture(condition: string): Promise<Texture> {
    const markerUrl = `assets/${condition}.webp`;

    if (this.textureCache.has(markerUrl)) {
      return this.textureCache.get(markerUrl)!;
    }

    try {
      const texture = await this.textureLoader.loadAsync(markerUrl);
      texture.colorSpace = 'srgb';
      texture.anisotropy = 4;

      this.textureCache.set(markerUrl, texture);
      return texture;
    } catch (error) {
      console.error('Failed to load marker texture:', condition, error);
      return this.createFallbackTexture();
    }
  }

  /**
   * Load the black grid texture for the board surface
   */
  async loadBoardGridTexture(): Promise<Texture> {
    if (this.boardGridTexture) {
      return this.boardGridTexture;
    }

    try {
      const gridUrl = 'assets/textures/black_grid.png';
      const texture = await this.textureLoader.loadAsync(gridUrl);
      texture.colorSpace = 'srgb';
      texture.anisotropy = 4;
      texture.flipY = false; // Don't flip for board texture

      // Configure for tiling
      texture.wrapS = RepeatWrapping;
      texture.wrapT = RepeatWrapping;
      texture.repeat.set(10, 10); // Tile 10x10 across the 50x50 board

      this.boardGridTexture = texture;
      return texture;
    } catch (error) {
      console.error('Failed to load board grid texture:', error);
      return this.createFallbackTexture();
    }
  }

  /**
   * Load the twinleaf board center texture
   */
  async loadBoardCenterTexture(): Promise<Texture> {
    const centerUrl = 'assets/twinleaf-board-center.png';

    if (this.textureCache.has(centerUrl)) {
      return this.textureCache.get(centerUrl)!;
    }

    try {
      const texture = await this.textureLoader.loadAsync(centerUrl);
      texture.colorSpace = 'srgb';
      texture.anisotropy = 4;
      texture.flipY = false; // Don't flip for board texture

      this.textureCache.set(centerUrl, texture);
      return texture;
    } catch (error) {
      console.error('Failed to load board center texture:', error);
      return this.createFallbackTexture();
    }
  }

  /**
   * Load the card mask texture for rounded corners
   */
  async loadCardMaskTexture(): Promise<Texture> {
    if (this.cardMaskTexture) {
      return this.cardMaskTexture;
    }

    try {
      const maskUrl = 'assets/3d-card-mask.png';
      const texture = await this.textureLoader.loadAsync(maskUrl);
      texture.colorSpace = 'srgb';
      texture.anisotropy = 4;
      texture.flipY = true; // Match card texture orientation

      this.cardMaskTexture = texture;
      return texture;
    } catch (error) {
      console.error('Failed to load card mask texture:', error);
      // Return a fallback texture (fully opaque white) so cards still render
      return this.createFallbackTexture();
    }
  }

  /**
   * Load the aqua grid texture for board slots
   */
  async loadSlotGridTexture(): Promise<Texture> {
    if (this.slotGridTexture) {
      return this.slotGridTexture;
    }

    try {
      const gridUrl = 'assets/textures/aqua_grid.png';
      const texture = await this.textureLoader.loadAsync(gridUrl);
      texture.colorSpace = 'srgb';
      texture.anisotropy = 4;
      texture.flipY = false; // Don't flip for slot texture

      this.slotGridTexture = texture;
      return texture;
    } catch (error) {
      console.error('Failed to load slot grid texture:', error);
      return this.createFallbackTexture();
    }
  }

  /**
   * Create a simple fallback texture
   */
  private createFallbackTexture(): Texture {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    // Draw a simple gradient
    const gradient = ctx.createLinearGradient(0, 0, 256, 256);
    gradient.addColorStop(0, '#4a4a4a');
    gradient.addColorStop(1, '#2a2a2a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);

    const texture = new Texture(canvas);
    texture.needsUpdate = true;
    texture.colorSpace = 'srgb';

    return texture;
  }

  /**
   * Clear texture cache
   */
  clearCache(): void {
    this.textureCache.forEach(texture => {
      texture.dispose();
    });
    this.textureCache.clear();

    if (this.cardBackTexture) {
      this.cardBackTexture.dispose();
      this.cardBackTexture = null;
    }

    if (this.boardGridTexture) {
      this.boardGridTexture.dispose();
      this.boardGridTexture = null;
    }

    if (this.slotGridTexture) {
      this.slotGridTexture.dispose();
      this.slotGridTexture = null;
    }

    if (this.cardMaskTexture) {
      this.cardMaskTexture.dispose();
      this.cardMaskTexture = null;
    }
  }

  /**
   * Get cache size for debugging
   */
  getCacheSize(): number {
    return this.textureCache.size;
  }

  /**
   * Preload card textures in background. Textures land in textureCache for faster
   * display when updateCard/createHandCard runs. Fire-and-forget - does not block.
   */
  preloadCardTextures(urls: string[]): void {
    const uniqueUrls = [...new Set(urls)].filter(url => url && url.trim() && !this.textureCache.has(url));
    uniqueUrls.forEach(url => {
      this.loadCardTexture(url).catch(() => {});
    });
  }
}
