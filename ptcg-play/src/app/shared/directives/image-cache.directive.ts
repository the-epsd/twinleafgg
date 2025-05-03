import { Directive, ElementRef, HostBinding, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Directive({
  selector: '[ptcgImageCache]'
})
export class ImageCacheDirective implements OnChanges {
  @Input() ptcgImageCache: string;
  @HostBinding('attr.src') url: SafeUrl;

  constructor(
    private elementRef: ElementRef,
    private sanitizer: DomSanitizer
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.ptcgImageCache) {
      this.url = this.sanitizer.bypassSecurityTrustUrl(this.ptcgImageCache);
    }
  }
} 