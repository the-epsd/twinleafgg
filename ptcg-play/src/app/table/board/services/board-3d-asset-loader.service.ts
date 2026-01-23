import { Injectable } from '@angular/core';
import { TextureLoader, Texture, sRGBEncoding } from 'three';
import { ImageCacheService } from '../../../shared/image-cache/image-cache.service';

@Injectable()
export class Board3dAssetLoaderService {
  private textureLoader: TextureLoader;
  private textureCache: Map<string, Texture>;
  private cardBackTexture: Texture | null = null;

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
  }

  /**
   * Get cache size for debugging
   */
  getCacheSize(): number {
    return this.textureCache.size;
  }
}
