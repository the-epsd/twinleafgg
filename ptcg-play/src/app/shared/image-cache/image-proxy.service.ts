import { Injectable } from '@angular/core';
import { ApiService } from '../../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class ImageProxyService {

  constructor(private apiService: ApiService) {}

  /**
   * Check if a URL is external (not localhost or same-origin)
   */
  private isExternalUrl(url: string): boolean {
    // Relative paths are never external
    if (url.startsWith('/') || url.startsWith('./') || url.startsWith('../')) {
      return false;
    }
    
    // Must start with http:// or https://
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return false;
    }
    
    try {
      const urlObj = new URL(url);
      const apiUrl = this.apiService.getApiUrl();
      
      // If API URL is not set or invalid, don't proxy
      if (!apiUrl) {
        return false;
      }
      
      const apiUrlObj = new URL(apiUrl);
      
      // Don't proxy localhost or same-origin URLs
      const hostname = urlObj.hostname.toLowerCase();
      const apiHostname = apiUrlObj.hostname.toLowerCase();
      
      // Check if it's localhost, 127.0.0.1, IPv6 localhost, or same origin
      const isLocalhost = hostname === 'localhost' || 
                          hostname === '127.0.0.1' || 
                          hostname === '[::1]' ||
                          hostname === apiHostname;
      
      return !isLocalhost;
    } catch {
      // If URL parsing fails, don't proxy
      return false;
    }
  }

  /**
   * Get proxy URL for external images, or return original URL for local images
   * @param originalUrl The original image URL
   * @returns Proxy URL if external, original URL if local
   */
  public getProxyUrlIfNeeded(originalUrl: string): string {
    // If not external, return as-is
    if (!this.isExternalUrl(originalUrl)) {
      return originalUrl;
    }

    // Construct proxy URL
    const apiUrl = this.apiService.getApiUrl();
    const proxyPath = '/v1/image-proxy/proxy';
    const encodedUrl = encodeURIComponent(originalUrl);
    
    // Ensure API URL doesn't have trailing slash
    const baseUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
    
    return `${baseUrl}${proxyPath}?url=${encodedUrl}`;
  }
}
