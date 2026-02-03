import { Injectable } from '@angular/core';
import { TextureLoader, Texture, RepeatWrapping } from 'three';
import { ImageCacheService } from '../../../shared/image-cache/image-cache.service';
import { ImageProxyService } from '../../../shared/image-cache/image-proxy.service';

@Injectable()
export class Board3dAssetLoaderService {
  private textureLoader: TextureLoader;
  private textureCache: Map<string, Texture>;
  private cardBackTexture: Texture | null = null;
  private boardGridTexture: Texture | null = null;
  private slotGridTexture: Texture | null = null;

  constructor(
    private imageCacheService: ImageCacheService,
    private imageProxyService: ImageProxyService
  ) {
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

    // Store original URL for error handling
    const originalUrl = scanUrl;

    try {
      // Convert external URLs to proxy URLs before caching
      const urlToCache = this.imageProxyService.getProxyUrlIfNeeded(scanUrl);
      const wasProxied = urlToCache !== scanUrl;
      
      // Use imgcache.js to get cached image URL
      const cachedUrl = await this.imageCacheService.fetchFromCache(urlToCache).toPromise();

      // Load texture with Three.js (no crossOrigin needed - proxy handles CORS)
      const texture = await this.textureLoader.loadAsync(cachedUrl);

      // Configure texture (use colorSpace instead of encoding)
      texture.colorSpace = 'srgb';
      texture.anisotropy = 16; // High quality filtering
      texture.flipY = true; // Fix texture orientation

      // Cache and return (use original URL as cache key)
      this.textureCache.set(scanUrl, texture);
      return texture;
    } catch (error) {
      // Check if proxy was used and failed
      const urlToCache = this.imageProxyService.getProxyUrlIfNeeded(scanUrl);
      const wasProxied = urlToCache !== scanUrl;
      const errorMessage = (error as any)?.message || error?.toString() || '';
      const errorStatus = (error as any)?.status || (error as any)?.response?.status;
      const errorTarget = (error as any)?.target;
      
      // Check if the failed URL matches proxy pattern
      const failedUrl = errorTarget?.src || errorTarget?.currentSrc || '';
      const isProxyUrl = failedUrl.includes('/v1/image-proxy/proxy');
      
      // Detect proxy failures (403, 404, network errors)
      const isProxyError = wasProxied && (
        errorStatus === 404 ||
        errorStatus === 403 ||
        errorMessage.includes('404') ||
        errorMessage.includes('403') ||
        errorMessage.includes('Forbidden') ||
        errorMessage.includes('Domain not allowed') ||
        errorMessage.includes('Failed to fetch') ||
        errorMessage.includes('NetworkError') ||
        errorMessage.includes('net::ERR_') ||
        isProxyUrl
      );

      // If proxy failed, try original URL as fallback
      if (isProxyError) {
        try {
          const originalIsExternal = originalUrl.startsWith('http://') || originalUrl.startsWith('https://');
          const fallbackLoader = originalIsExternal ? new TextureLoader().setCrossOrigin('anonymous') : this.textureLoader;
          
          const originalCachedUrl = await this.imageCacheService.fetchFromCache(originalUrl).toPromise();
          const texture = await fallbackLoader.loadAsync(originalCachedUrl);
          
          texture.colorSpace = 'srgb';
          texture.anisotropy = 16;
          texture.flipY = true;
          
          this.textureCache.set(scanUrl, texture);
          
          // Fallback succeeded - log rejected domain for proxy errors
          // Note: Browser network errors (like "Failed to load resource: 403") are logged automatically
          // by the browser itself and cannot be suppressed from JavaScript. These errors appear in the
          // console even though the fallback mechanism successfully loads images via the original URL.
          // The errors are informational only - images are loading correctly via fallback.
          // Extract domain from original URL for logging (works for all proxy errors, not just 403)
          try {
            const urlObj = new URL(originalUrl);
            const rejectedDomain = urlObj.hostname.toLowerCase();
            console.warn(`[ImageProxy] Domain rejected: ${rejectedDomain} - add to ALLOWED_DOMAINS in image-proxy.controller.ts`);
          } catch (e) {
            // URL parsing failed, skip domain extraction
          }
          
          // Silently handled - fallback worked
          return texture;
        } catch (fallbackError) {
          // Both proxy and original failed, use cardback
          console.warn('Both proxy and original URL failed for card texture:', originalUrl);
          return this.loadCardBack();
        }
      }

      // For non-proxy errors, check if it's a CORS error to suppress logging
      const isEventError = error instanceof Event;
      const isCorsError = isEventError && (
        errorMessage.includes('CORS') ||
        errorMessage.includes('Access-Control') ||
        errorMessage.includes('cross-origin') ||
        (errorTarget && errorTarget.tagName === 'IMG')
      );
      
      // Only log non-CORS errors
      if (!isCorsError) {
        console.error('Failed to load card texture:', originalUrl, error);
      }
      
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

    // Store original URL for error handling
    const originalUrl = iconPath;

    try {
      // Convert external URLs to proxy URLs before caching
      const urlToCache = this.imageProxyService.getProxyUrlIfNeeded(iconPath);
      const wasProxied = urlToCache !== iconPath;
      
      // Use imgcache.js to get cached image URL
      const cachedUrl = await this.imageCacheService.fetchFromCache(urlToCache).toPromise();

      // Load texture with Three.js (no crossOrigin needed - proxy handles CORS)
      const texture = await this.textureLoader.loadAsync(cachedUrl);

      // Configure texture (use colorSpace instead of encoding)
      texture.colorSpace = 'srgb';
      texture.anisotropy = 16; // High quality filtering
      texture.flipY = true; // Fix texture orientation

      // Cache and return (use original URL as cache key)
      this.textureCache.set(iconPath, texture);
      return texture;
    } catch (error) {
      // Check if proxy was used and failed
      const urlToCache = this.imageProxyService.getProxyUrlIfNeeded(iconPath);
      const wasProxied = urlToCache !== iconPath;
      const errorMessage = (error as any)?.message || error?.toString() || '';
      const errorStatus = (error as any)?.status || (error as any)?.response?.status;
      const errorTarget = (error as any)?.target;
      
      // Check if the failed URL matches proxy pattern
      const failedUrl = errorTarget?.src || errorTarget?.currentSrc || '';
      const isProxyUrl = failedUrl.includes('/v1/image-proxy/proxy');
      
      // Detect proxy failures (403, 404, network errors)
      const isProxyError = wasProxied && (
        errorStatus === 404 ||
        errorStatus === 403 ||
        errorMessage.includes('404') ||
        errorMessage.includes('403') ||
        errorMessage.includes('Forbidden') ||
        errorMessage.includes('Domain not allowed') ||
        errorMessage.includes('Failed to fetch') ||
        errorMessage.includes('NetworkError') ||
        errorMessage.includes('net::ERR_') ||
        isProxyUrl
      );

      // If proxy failed, try original URL as fallback
      if (isProxyError) {
        try {
          const originalIsExternal = originalUrl.startsWith('http://') || originalUrl.startsWith('https://');
          const fallbackLoader = originalIsExternal ? new TextureLoader().setCrossOrigin('anonymous') : this.textureLoader;
          
          const originalCachedUrl = await this.imageCacheService.fetchFromCache(originalUrl).toPromise();
          const texture = await fallbackLoader.loadAsync(originalCachedUrl);
          
          texture.colorSpace = 'srgb';
          texture.anisotropy = 16;
          texture.flipY = true;
          
          this.textureCache.set(iconPath, texture);
          
          // Fallback succeeded - log rejected domain for proxy errors
          // Note: Browser network errors (like "Failed to load resource: 403") are logged automatically
          // by the browser itself and cannot be suppressed from JavaScript. These errors appear in the
          // console even though the fallback mechanism successfully loads images via the original URL.
          // The errors are informational only - images are loading correctly via fallback.
          // Extract domain from original URL for logging (works for all proxy errors, not just 403)
          try {
            const urlObj = new URL(originalUrl);
            const rejectedDomain = urlObj.hostname.toLowerCase();
            console.warn(`[ImageProxy] Domain rejected: ${rejectedDomain} - add to ALLOWED_DOMAINS in image-proxy.controller.ts`);
          } catch (e) {
            // URL parsing failed, skip domain extraction
          }
          
          // Silently handled - fallback worked
          return texture;
        } catch (fallbackError) {
          // Both proxy and original failed, throw error for caller to handle
          console.warn('Both proxy and original URL failed for tool icon:', originalUrl);
          throw error;
        }
      }

      // For non-proxy errors, check if it's a CORS error to suppress logging
      const isEventError = error instanceof Event;
      const isCorsError = isEventError && (
        errorMessage.includes('CORS') ||
        errorMessage.includes('Access-Control') ||
        errorMessage.includes('cross-origin') ||
        (errorTarget && errorTarget.tagName === 'IMG')
      );
      
      // Only log non-CORS errors
      if (!isCorsError) {
        console.error('Failed to load tool icon texture:', originalUrl, error);
      }
      
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

    // Store original URL for error handling
    const originalUrl = sleeveUrl;

    try {
      // Convert external URLs to proxy URLs before caching
      const urlToCache = this.imageProxyService.getProxyUrlIfNeeded(sleeveUrl);
      const wasProxied = urlToCache !== sleeveUrl;
      
      // Use imgcache.js to get cached image URL
      const cachedUrl = await this.imageCacheService.fetchFromCache(urlToCache).toPromise();

      // Load texture with Three.js (no crossOrigin needed - proxy handles CORS)
      const texture = await this.textureLoader.loadAsync(cachedUrl);

      // Configure texture (use colorSpace instead of encoding)
      texture.colorSpace = 'srgb';
      texture.anisotropy = 16; // High quality filtering
      texture.flipY = true; // Fix texture orientation

      // Cache and return (use original URL as cache key)
      this.textureCache.set(sleeveUrl, texture);
      return texture;
    } catch (error) {
      // Check if proxy was used and failed
      const urlToCache = this.imageProxyService.getProxyUrlIfNeeded(sleeveUrl);
      const wasProxied = urlToCache !== sleeveUrl;
      const errorMessage = (error as any)?.message || error?.toString() || '';
      const errorStatus = (error as any)?.status || (error as any)?.response?.status;
      const errorTarget = (error as any)?.target;
      
      // Check if the failed URL matches proxy pattern
      const failedUrl = errorTarget?.src || errorTarget?.currentSrc || '';
      const isProxyUrl = failedUrl.includes('/v1/image-proxy/proxy');
      
      // Detect proxy failures (403, 404, network errors)
      const isProxyError = wasProxied && (
        errorStatus === 404 ||
        errorStatus === 403 ||
        errorMessage.includes('404') ||
        errorMessage.includes('403') ||
        errorMessage.includes('Forbidden') ||
        errorMessage.includes('Domain not allowed') ||
        errorMessage.includes('Failed to fetch') ||
        errorMessage.includes('NetworkError') ||
        errorMessage.includes('net::ERR_') ||
        isProxyUrl
      );

      // If proxy failed, try original URL as fallback
      if (isProxyError) {
        try {
          const originalIsExternal = originalUrl.startsWith('http://') || originalUrl.startsWith('https://');
          const fallbackLoader = originalIsExternal ? new TextureLoader().setCrossOrigin('anonymous') : this.textureLoader;
          
          const originalCachedUrl = await this.imageCacheService.fetchFromCache(originalUrl).toPromise();
          const texture = await fallbackLoader.loadAsync(originalCachedUrl);
          
          texture.colorSpace = 'srgb';
          texture.anisotropy = 16;
          texture.flipY = true;
          
          this.textureCache.set(sleeveUrl, texture);
          
          // Fallback succeeded - log rejected domain for proxy errors
          // Note: Browser network errors (like "Failed to load resource: 403") are logged automatically
          // by the browser itself and cannot be suppressed from JavaScript. These errors appear in the
          // console even though the fallback mechanism successfully loads images via the original URL.
          // The errors are informational only - images are loading correctly via fallback.
          // Extract domain from original URL for logging (works for all proxy errors, not just 403)
          try {
            const urlObj = new URL(originalUrl);
            const rejectedDomain = urlObj.hostname.toLowerCase();
            console.warn(`[ImageProxy] Domain rejected: ${rejectedDomain} - add to ALLOWED_DOMAINS in image-proxy.controller.ts`);
          } catch (e) {
            // URL parsing failed, skip domain extraction
          }
          
          // Silently handled - fallback worked
          return texture;
        } catch (fallbackError) {
          // Both proxy and original failed, use cardback
          console.warn('Both proxy and original URL failed for sleeve texture:', originalUrl);
          return this.loadCardBack();
        }
      }

      // For non-proxy errors, check if it's a CORS error to suppress logging
      const isEventError = error instanceof Event;
      const isCorsError = isEventError && (
        errorMessage.includes('CORS') ||
        errorMessage.includes('Access-Control') ||
        errorMessage.includes('cross-origin') ||
        (errorTarget && errorTarget.tagName === 'IMG')
      );
      
      // Only log non-CORS errors
      if (!isCorsError) {
        console.error('Failed to load sleeve texture:', originalUrl, error);
      }
      
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
      texture.colorSpace = 'srgb';
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
    const markerUrl = `assets/${condition}.webp`;

    if (this.textureCache.has(markerUrl)) {
      return this.textureCache.get(markerUrl)!;
    }

    try {
      const cachedUrl = await this.imageCacheService.fetchFromCache(markerUrl).toPromise();

      const texture = await this.textureLoader.loadAsync(cachedUrl);
      texture.colorSpace = 'srgb';
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
      texture.colorSpace = 'srgb';
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
      texture.colorSpace = 'srgb';
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
      texture.colorSpace = 'srgb';
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
  }

  /**
   * Get cache size for debugging
   */
  getCacheSize(): number {
    return this.textureCache.size;
  }
}
