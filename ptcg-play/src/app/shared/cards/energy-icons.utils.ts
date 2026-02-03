import { Card, SuperType } from 'ptcg-server';

/**
 * Mapping of energy card names to their custom icon asset paths
 */
export const CUSTOM_ENERGY_ICONS: { [key: string]: string } = {
  'Grass Energy': 'assets/energy/grass.png',
  'Fire Energy': 'assets/energy/fire.png',
  'Water Energy': 'assets/energy/water.png',
  'Lightning Energy': 'assets/energy/lightning.png',
  'Psychic Energy': 'assets/energy/psychic.png',
  'Fighting Energy': 'assets/energy/fighting.png',
  'Darkness Energy': 'assets/energy/dark.png',
  'Metal Energy': 'assets/energy/metal.png',
  'Fairy Energy': 'assets/energy/fairy.png',
  'Double Turbo Energy': 'assets/energy/double-turbo.png',
  'Jet Energy': 'assets/energy/jet.png',
  'Gift Energy': 'assets/energy/gift.png',
  'Mist Energy': 'assets/energy/mist.png',
  'Luminous Energy': 'assets/energy/luminous.webp',
  'Reversal Energy': 'assets/energy/reversal.webp',
  'Therapeutic Energy': 'assets/energy/therapeutic.webp',
  'Medical Energy': 'assets/energy/medical.webp',
  'Boomerang Energy': 'assets/energy/boomerang.webp',
  'Spiky Energy': 'assets/energy/spiky.webp',
  'Team Rocket\'s Energy': 'assets/energy/team-rockets.webp',
  'Prism Energy': 'assets/energy/prism.webp',
  'Ignition Energy': 'assets/energy/ignition.webp',
  'Enriching Energy': 'assets/energy/enriching.webp',
  'Legacy Energy': 'assets/energy/legacy.png',
  'Neo Upper Energy': 'assets/energy/neo-upper.png',
  'Electrode': 'assets/energy/electrode.png',
  'Holon\'s Castform': 'assets/energy/holons-castform.png',
  'Holon\'s Magnemite': 'assets/energy/holons-magnemite.png',
  'Holon\'s Magneton': 'assets/energy/holons-magneton.png',
  'Holon\'s Voltorb': 'assets/energy/holons-voltorb.png',
  'Holon\'s Electrode': 'assets/energy/holons-electrode.png',
  'Rock Fighting Energy': 'assets/energy/rock-fighting.webp',
  'Growth Grass Energy': 'assets/energy/growth-grass.webp',
  'Telepath Psychic Energy': 'assets/energy/telepathic-psychic.webp',
};

/**
 * Get the custom energy icon path for a card, if available
 * @param card The card to check
 * @param isAttachedAsEnergy Optional flag to check non-energy cards attached as energy (e.g., Holon's Pokemon)
 * @returns The icon path if available, null otherwise
 */
export function getCustomEnergyIconPath(card: Card, isAttachedAsEnergy: boolean = false): string | null {
  if (!card) {
    return null;
  }

  // Check if it's an energy card or attached as energy, and has a custom icon
  if ((card.superType === SuperType.ENERGY || isAttachedAsEnergy) && CUSTOM_ENERGY_ICONS[card.name]) {
    return CUSTOM_ENERGY_ICONS[card.name];
  }

  return null;
}
