import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToolbarService {

  private closeMenuSubject = new Subject<void>();
  public closeMenu$ = this.closeMenuSubject.asObservable();

  constructor() { }

  public closeMenu(): void {
    this.closeMenuSubject.next();
  }
}
