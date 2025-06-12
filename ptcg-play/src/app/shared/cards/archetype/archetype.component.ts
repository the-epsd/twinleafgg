import { Component, Input } from "@angular/core";
import { Archetype } from "ptcg-server";

@Component({
  selector: 'ptcg-archetype',
  templateUrl: './archetype.component.html',
  styleUrls: ['./archetype.component.scss']
})
export class ArchetypeComponent {
  public archetypes: string[] = [];
  public isSingleArchetype: boolean = true;

  @Input() set class(value: Archetype | Archetype[]) {

    if (!value) {
      this.archetypes = ['unown'];
      this.isSingleArchetype = true;
      return;
    }

    if (Array.isArray(value)) {
      // Remove duplicates and convert to strings, then take only the first 2
      const uniqueArchetypes = [...new Set(value)]
        .filter(v => v !== undefined && v !== null)
        .map(v => {
          const result = this.getArchetypeString(v);
          return result;
        })
        .slice(0, 2); // Limit to maximum of 2 archetypes
      this.archetypes = uniqueArchetypes.length > 0 ? uniqueArchetypes : ['unown'];
      this.isSingleArchetype = uniqueArchetypes.length === 1;
    } else {
      const result = this.getArchetypeString(value);
      this.archetypes = [result];
      this.isSingleArchetype = true;
    }
  }

  private getArchetypeString(archetype: Archetype): string {
    if (!archetype) {
      return 'unown';
    }

    // First try to find the enum key that matches the archetype value
    const enumKey = Object.keys(Archetype).find(key => Archetype[key] === archetype);
    if (enumKey) {
      const result = enumKey.toLowerCase().replace(/_/g, '-');
      return result;
    }

    // If no match found, try to use the archetype value directly
    const result = typeof archetype === 'string'
      ? archetype.toLowerCase().replace(/_/g, '-')
      : 'unown';
    return result;
  }

  constructor() { }
}
