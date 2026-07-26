export type AbilityLockMode = 'lock' | 'block' | 'both';

export type AbilityLockCardEntry = {
  set: string;
  setNumber: string;
  name: string;
  fullName: string;
  mode: AbilityLockMode;
};

/** Cards migrated onto HANDLE_ABILITY_LOCK / HANDLE_ABILITY_BLOCK. */
export const ABILITY_LOCK_CARDS: AbilityLockCardEntry[] = [
  { set: 'AOR', setNumber: '75', name: 'Hex Maniac', fullName: 'Hex Maniac AOR', mode: 'lock' },
  { set: 'ASR', setNumber: '136', name: 'Canceling Cologne', fullName: 'Canceling Cologne ASR', mode: 'lock' },
  { set: 'BKP', setNumber: '40', name: 'Greninja', fullName: 'Greninja BKP', mode: 'lock' },
  { set: 'BKP', setNumber: '57', name: 'Garbodor', fullName: 'Garbodor BKP', mode: 'lock' },
  { set: 'BST', setNumber: '40', name: 'Empoleon V', fullName: 'Empoleon V BST', mode: 'lock' },
  { set: 'CEC', setNumber: '97', name: 'Mimikyu', fullName: 'Mimikyu CEC 97', mode: 'lock' },
  { set: 'CES', setNumber: '61', name: 'Lunatone', fullName: 'Lunatone CES', mode: 'lock' },
  { set: 'CES', setNumber: '115', name: 'Slaking', fullName: 'Slaking CES', mode: 'lock' },
  { set: 'CG', setNumber: '74', name: 'Cessation Crystal', fullName: 'Cessation Crystal CG', mode: 'block' },
  { set: 'CG', setNumber: '94', name: 'Jirachi ex', fullName: 'Jirachi ex CG', mode: 'block' },
  { set: 'CG', setNumber: '96', name: 'Sceptile ex', fullName: 'Sceptile ex CG', mode: 'block' },
  { set: 'CRE', setNumber: '148', name: 'Path to the Peak', fullName: 'Path to the Peak CRE', mode: 'lock' },
  { set: 'DF', setNumber: '93', name: 'Gardevoir ex', fullName: 'Gardevoir ex DF', mode: 'block' },
  { set: 'DR', setNumber: '96', name: 'Muk ex', fullName: 'Muk ex DR', mode: 'block' },
  { set: 'DRI', setNumber: '180', name: 'Team Rocket\'s Watchtower', fullName: 'Team Rocket\'s Watchtower DRI', mode: 'lock' },
  { set: 'DRX', setNumber: '54', name: 'Garbodor', fullName: 'Garbodor DRX', mode: 'lock' },
  { set: 'DX', setNumber: '91', name: 'Space Center', fullName: 'Space Center DX', mode: 'block' },
  { set: 'EM', setNumber: '95', name: 'Medicham ex', fullName: 'Medicham ex EM', mode: 'block' },
  { set: 'FO', setNumber: '13', name: 'Muk', fullName: 'Muk FO', mode: 'block' },
  { set: 'FST', setNumber: '67', name: 'Gorebyss', fullName: 'Gorebyss FST 67', mode: 'lock' },
  { set: 'HP', setNumber: '11', name: 'Latias', fullName: 'Latias HP', mode: 'block' },
  { set: 'HP', setNumber: '14', name: 'Pidgeot', fullName: 'Pidgeot HP', mode: 'block' },
  { set: 'LA', setNumber: '34', name: 'Mesprit', fullName: 'Mesprit LA', mode: 'block' },
  { set: 'LM', setNumber: '11', name: 'Muk', fullName: 'Muk LM', mode: 'block' },
  { set: 'LM', setNumber: '16', name: 'Girafarig', fullName: 'Girafarig LM', mode: 'block' },
  { set: 'LM', setNumber: '20', name: 'Lunatone', fullName: 'Lunatone LM', mode: 'block' },
  { set: 'LM', setNumber: '25', name: 'Solrock', fullName: 'Solrock LM', mode: 'block' },
  { set: 'LOR', setNumber: '93', name: 'Aerodactyl VSTAR', fullName: 'Aerodactyl VSTAR LOR 93', mode: 'lock' },
  { set: 'LOT', setNumber: '93', name: 'Wobbuffet', fullName: 'Wobbuffet LOT', mode: 'lock' },
  { set: 'M6', setNumber: '75', name: 'Legendary Lava Lake', fullName: 'Legendary Lava Lake (Left) M6', mode: 'lock' },
  { set: 'MEP', setNumber: '7', name: 'Psyduck', fullName: 'Psyduck SVP', mode: 'lock' },
  { set: 'MEP', setNumber: '8', name: 'Golduck', fullName: 'Golduck MEP', mode: 'lock' },
  { set: 'N4', setNumber: '5', name: 'Dark Feraligatr', fullName: 'Dark Feraligatr N4', mode: 'block' },
  { set: 'PAL', setNumber: '89', name: 'Spiritomb', fullName: 'Spiritomb PAL', mode: 'lock' },
  { set: 'PAL', setNumber: '127', name: 'Ting-Lu ex', fullName: 'Ting-Lu ex PAL', mode: 'lock' },
  { set: 'PHF', setNumber: '36', name: 'Wobbuffet', fullName: 'Wobbuffet PHF', mode: 'lock' },
  { set: 'PK', setNumber: '71', name: 'Battle Frontier', fullName: 'Battle Frontier PK', mode: 'block' },
  { set: 'PL', setNumber: '122', name: 'Dialga G', fullName: 'Dialga G LV.X PL', mode: 'block' },
  { set: 'PRC', setNumber: '140', name: 'Silent Lab', fullName: 'Silent Lab PRC', mode: 'lock' },
  { set: 'SHF', setNumber: '42', name: 'Galarian Weezing', fullName: 'Galarian Weezing SHF', mode: 'lock' },
  { set: 'SSP', setNumber: '107', name: 'Gastrodon', fullName: 'Gastrodon SSP', mode: 'lock' },
  { set: 'SUM', setNumber: '58', name: 'Alolan Muk', fullName: 'Alolan Muk SUM', mode: 'lock' },
  { set: 'SVI', setNumber: '96', name: 'Klefki', fullName: 'Klefki SVI', mode: 'lock' },
  { set: 'SW', setNumber: '7', name: 'Gardevoir', fullName: 'Gardevoir SW', mode: 'block' },
  { set: 'TEF', setNumber: '78', name: 'Flutter Mane', fullName: 'Flutter Mane TEF', mode: 'lock' },
  { set: 'TR', setNumber: '78', name: 'Goop Gas Attack', fullName: 'Goop Gas Attack TR', mode: 'block' },
  { set: 'TWM', setNumber: '77', name: 'Iron Thorns ex', fullName: 'Iron Thorns ex TWM', mode: 'lock' },
  { set: 'UF', setNumber: '18', name: 'Ursaring', fullName: 'Ursaring UF', mode: 'block' },
  { set: 'UF', setNumber: '83', name: 'Energy Root', fullName: 'Energy Root UF', mode: 'block' },
  { set: 'UF', setNumber: '112', name: 'Umbreon ex', fullName: 'Umbreon ex UF', mode: 'block' },
  { set: 'UNB', setNumber: '15', name: 'Victreebel', fullName: 'Victreebel UNB', mode: 'lock' },
  { set: 'UNB', setNumber: '183', name: 'Power Plant', fullName: 'Power Plant UNB', mode: 'lock' },
  { set: 'UPR', setNumber: '39', name: 'Glaceon-GX', fullName: 'Glaceon-GX UPR', mode: 'lock' },
  { set: 'VIV', setNumber: '26', name: 'Flareon', fullName: 'Flareon VIV', mode: 'lock' },
  { set: 'VIV', setNumber: '30', name: 'Vaporeon', fullName: 'Vaporeon VIV', mode: 'lock' },
  { set: 'VIV', setNumber: '47', name: 'Jolteon', fullName: 'Jolteon VIV', mode: 'lock' },
  { set: 'XY', setNumber: '48', name: 'Arbok', fullName: 'Arbok XY', mode: 'lock' },
];

