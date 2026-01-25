import { Injectable } from '@angular/core';
import { TextureLoader, Texture, sRGBEncoding, RepeatWrapping } from 'three';
import { ImageCacheService } from '../../../shared/image-cache/image-cache.service';

@Injectable()
export class Board3dAssetLoaderService {
  private textureLoader: TextureLoader;
  private textureCache: Map<string, Texture>;
  private cardBackTexture: Texture | null = null;
  private boardGridTexture: Texture | null = null;
  private slotGridTexture: Texture | null = null;

  constructor(private imageCacheService: ImageCacheService) {
    this.textureLoader = new TextureLoader();
    this.textureCache = new Map();
  }

  /**
   * Load a card texture using the existing image cache service
   */
  async loadCardTexture(scanUrl: string): Promise<Texture> {
    // Check Three.js texture cache first
    if (this.textureCache.has(scanUrl)) {
      return this.textureCache.get(scanUrl)!;
    }

    try {
      // Use imgcache.js to get cached image URL
      const cachedUrl = await this.imageCacheService.fetchFromCache(scanUrl).toPromise();

      // Load texture with Three.js
      const texture = await this.textureLoader.loadAsync(cachedUrl);

      // Configure texture
      texture.encoding = sRGBEncoding;
      texture.anisotropy = 16; // High quality filtering
      texture.flipY = true; // Fix texture orientation

      // Cache and return
      this.textureCache.set(scanUrl, texture);
      return texture;
    } catch (error) {
      console.error('Failed to load card texture:', scanUrl, error);
      // Return card back as fallback
      return this.loadCardBack();
    }
  }

  /**
   * Load a custom tool icon texture
   */
  async loadToolIconTexture(iconPath: string): Promise<Texture> {
    // Check Three.js texture cache first
    if (this.textureCache.has(iconPath)) {
      return this.textureCache.get(iconPath)!;
    }

    try {
      // Use imgcache.js to get cached image URL
      const cachedUrl = await this.imageCacheService.fetchFromCache(iconPath).toPromise();

      // Load texture with Three.js
      const texture = await this.textureLoader.loadAsync(cachedUrl);

      // Configure texture
      texture.encoding = sRGBEncoding;
      texture.anisotropy = 16; // High quality filtering
      texture.flipY = true; // Fix texture orientation

      // Cache and return
      this.textureCache.set(iconPath, texture);
      return texture;
    } catch (error) {
      console.error('Failed to load tool icon texture:', iconPath, error);
      throw error; // Let caller handle fallback
    }
  }

  /**
   * Load a sleeve texture using the existing image cache service
   */
  async loadSleeveTexture(sleeveUrl: string): Promise<Texture> {
    // Check Three.js texture cache first
    if (this.textureCache.has(sleeveUrl)) {
      return this.textureCache.get(sleeveUrl)!;
    }

    try {
      // Use imgcache.js to get cached image URL
      const cachedUrl = await this.imageCacheService.fetchFromCache(sleeveUrl).toPromise();

      // Load texture with Three.js
      const texture = await this.textureLoader.loadAsync(cachedUrl);

      // Configure texture
      texture.encoding = sRGBEncoding;
      texture.anisotropy = 16; // High quality filtering
      texture.flipY = true; // Fix texture orientation

      // Cache and return
      this.textureCache.set(sleeveUrl, texture);
      return texture;
    } catch (error) {
      console.error('Failed to load sleeve texture:', sleeveUrl, error);
      // Return card back as fallback
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

      // Try to use cached version
      const cachedUrl = await this.imageCacheService.fetchFromCache(cardBackUrl).toPromise();

      const texture = await this.textureLoader.loadAsync(cachedUrl);
      texture.encoding = sRGBEncoding;
      texture.anisotropy = 16;
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
    const markerUrl = `assets/markers/${condition}.webp`;

    if (this.textureCache.has(markerUrl)) {
      return this.textureCache.get(markerUrl)!;
    }

    try {
      const cachedUrl = await this.imageCacheService.fetchFromCache(markerUrl).toPromise();

      const texture = await this.textureLoader.loadAsync(cachedUrl);
      texture.encoding = sRGBEncoding;
      texture.anisotropy = 8;

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
      const cachedUrl = await this.imageCacheService.fetchFromCache(gridUrl).toPromise();

      const texture = await this.textureLoader.loadAsync(cachedUrl);
      texture.encoding = sRGBEncoding;
      texture.anisotropy = 16;
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
      const cachedUrl = await this.imageCacheService.fetchFromCache(centerUrl).toPromise();

      const texture = await this.textureLoader.loadAsync(cachedUrl);
      texture.encoding = sRGBEncoding;
      texture.anisotropy = 16;
      texture.flipY = false; // Don't flip for board texture

      this.textureCache.set(centerUrl, texture);
      return texture;
    } catch (error) {
      console.error('Failed to load board center texture:', error);
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
      const cachedUrl = await this.imageCacheService.fetchFromCache(gridUrl).toPromise();

      const texture = await this.textureLoader.loadAsync(cachedUrl);
      texture.encoding = sRGBEncoding;
      texture.anisotropy = 16;
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
    texture.encoding = sRGBEncoding;

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
  }

  /**
   * Get cache size for debugging
   */
  getCacheSize(): number {
    return this.textureCache.size;
  }
}
