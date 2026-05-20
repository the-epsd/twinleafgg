import { describe, expect, it } from 'vitest';
import { energyIconSrc, normalizedTypeName, pokemonTypeIconSrc, pokemonTypeLabelFor } from './energyIcons';

describe('energy and Pokemon type icon helpers', () => {
  it('resolves custom energy artwork before basic regex fallbacks', () => {
    expect(energyIconSrc({ name: 'Double Turbo Energy' })).toBe('/assets/energy/double-turbo.png');
  });

  it('resolves basic energy artwork from card names', () => {
    expect(energyIconSrc({ name: 'Basic Psychic Energy' })).toBe('/assets/energy-icons/psychic.webp');
    expect(energyIconSrc({ name: 'Unknown Special Energy' })).toBe('/assets/energy-icons/colorless.webp');
  });

  it('normalizes card type values for Pokemon badges', () => {
    expect(normalizedTypeName(4)).toBe('lightning');
    expect(normalizedTypeName('Dark')).toBe('darkness');
    expect(pokemonTypeIconSrc('Fire')).toBe('/assets/energy-icons/fire.webp');
    expect(pokemonTypeLabelFor('Psychic')).toBe('Psychic');
    expect(pokemonTypeLabelFor(undefined)).toBe('Pokemon');
  });
});
