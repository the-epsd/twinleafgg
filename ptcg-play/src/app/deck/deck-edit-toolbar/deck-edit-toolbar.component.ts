import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';

import { Deck } from '../../api/interfaces/deck.interface';
import { DeckEditToolbarFilter } from './deck-edit-toolbar-filter.interface';
import { ControlContainer, FormBuilder, FormGroupDirective } from '@angular/forms';

@UntilDestroy()
@Component({
  selector: 'ptcg-deck-edit-toolbar',
  templateUrl: './deck-edit-toolbar.component.html',
  styleUrls: ['./deck-edit-toolbar.component.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ]
})
export class DeckEditToolbarComponent {

  @Input() deck: Deck;

  @Input() disabled: boolean;

  @Output() filterChange = new EventEmitter<DeckEditToolbarFilter>();

  @Output() save = new EventEmitter<void>();

  @Output() import = new EventEmitter<string[]>();

  @Output() export = new EventEmitter<void>();

  
  form = this.formBuilder.group({
    supertype: null,
    searchText: null
  })
  
  supertype$ = this.form.get('supertype').valueChanges;
  
  constructor(private formBuilder: FormBuilder) {
    
  }

  public onSave() {
    this.save.next();
  }
  
  public onSearch(value: string) {
    
  }

  public importFromClipboard() {

    // Read clipboard text
    navigator.clipboard.readText()
      .then(text => {
  
        // Parse text into card names  
        const cardNames = text.split('\n')
          .map(line => line.trim())
          .filter(line => !!line);
        
        // Import card names
        this.import.next(cardNames);
  
      });
  
  }

  public exportToFile() {
    this.export.next();
  }

}
                                