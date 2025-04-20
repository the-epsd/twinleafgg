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
    console.log('ArchetypeComponent received value:', value);
    console.log('Value type:', typeof value);
    console.log('Is array:', Array.isArray(value));

    if (!value) {
      console.log('No value provided, defaulting to unown');
      this.archetypes = ['unown'];
      this.isSingleArchetype = true;
      return;
    }

    if (Array.isArray(value)) {
      console.log('Processing array of archetypes:', value);
      // Remove duplicates and convert to strings, then take only the first 2
      const uniqueArchetypes = [...new Set(value)]
        .filter(v => v !== undefined && v !== null)
        .map(v => {
          console.log('Processing archetype:', v);
          const result = this.getArchetypeString(v);
          console.log('Converted to:', result);
          return result;
        })
        .slice(0, 2); // Limit to maximum of 2 archetypes
      console.log('Final unique archetypes:', uniqueArchetypes);
      this.archetypes = uniqueArchetypes.length > 0 ? uniqueArchetypes : ['unown'];
      this.isSingleArchetype = uniqueArchetypes.length === 1;
    } else {
      console.log('Processing single archetype:', value);
      const result = this.getArchetypeString(value);
      console.log('Converted to:', result);
      this.archetypes = [result];
      this.isSingleArchetype = true;
    }
  }

  private getArchetypeString(archetype: Archetype): string {
    if (!archetype) {
      console.log('Null archetype, returning unown');
      return 'unown';
    }

    console.log('Getting string for archetype:', archetype);
    console.log('Archetype enum:', Archetype);

    // First try to find the enum key that matches the archetype value
    const enumKey = Object.keys(Archetype).find(key => Archetype[key] === archetype);
    if (enumKey) {
      const result = enumKey.toLowerCase();
      console.log('Found matching enum key:', result);
      return result;
    }

    // If no match found, try to use the archetype value directly
    const result = typeof archetype === 'string' ? archetype.toLowerCase() : 'unown';
    console.log('Result:', result);
    return result;
  }

  constructor() { }
}
