import { Component, ViewChild, EventEmitter, Output, Input } from '@angular/core';
import { MatInput } from '@angular/material/input';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ptcg-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss']
})
export class SearchBoxComponent {

  @ViewChild(MatInput, {static: true}) searchInput: MatInput;
  @Output() search = new EventEmitter<string>();
  @Input() showSearchButton = true;
  @Input() label = this.translateService.instant('BUTTON_SEARCH');
  @Input() isActivated = false;

  public searchValue = '';

  constructor(private translateService: TranslateService) { }

  public activateSearch() {
    this.isActivated = true;
    setTimeout(() => this.searchInput.focus());
  }

  public clearSearch() {
    this.isActivated = false;
    if (this.searchValue !== '') {
      this.searchValue = '';
      this.search.next('');
    }
  }

  public onBlur() {
    if (this.searchValue === '') {
      this.isActivated = false;
    }
  }

  public onChange() {
    this.search.emit(this.searchValue);
  }

}
