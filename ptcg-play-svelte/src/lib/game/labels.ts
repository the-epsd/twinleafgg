const knownLabels: Record<string, string> = {
  AlertPrompt: 'Alert',
  AttachEnergyPrompt: 'Attach energy',
  ChooseAttackPrompt: 'Choose attack',
  ChooseCardsPrompt: 'Choose cards',
  ChooseEnergyPrompt: 'Choose energy',
  ChoosePokemonPrompt: 'Choose Pokemon',
  ChoosePrizePrompt: 'Choose prize',
  CoinFlipPrompt: 'Coin flip',
  ConfirmCardsPrompt: 'Confirm cards',
  ConfirmPrompt: 'Confirm',
  DiscardEnergyPrompt: 'Discard energy',
  MoveDamagePrompt: 'Move damage',
  MoveEnergyPrompt: 'Move energy',
  OrderCardsPrompt: 'Order cards',
  PutDamagePrompt: 'Place damage',
  RemoveDamagePrompt: 'Remove damage',
  SelectOptionPrompt: 'Choose option',
  SelectPrompt: 'Choose',
  ShowCardsPrompt: 'Cards',
  ShowMulliganPrompt: 'Mulligan',
  ShuffleDeckPrompt: 'Shuffle deck',
  WaitPrompt: 'Waiting',
  CANNOT_ATTACK_ON_FIRST_TURN: 'Cannot attack on the first turn',
  CANNOT_RETREAT: 'Cannot retreat',
  CHOOSE_ATTACK_TO_DISABLE: 'Choose an attack to disable',
  CHOOSE_CARD_TO_DISCARD: 'Choose cards to discard',
  CHOOSE_CARD_TO_HAND: 'Choose a card for your hand',
  CHOOSE_CARD_TO_PUT_ONTO_BENCH: 'Choose a Pokemon for your Bench',
  CHOOSE_ENERGIES_TO_DISCARD: 'Choose energy to discard',
  CHOOSE_ENERGIES_TO_HAND: 'Choose energy for your hand',
  CHOOSE_ENERGY_FROM_DECK: 'Choose energy from deck',
  CHOOSE_ENERGY_FROM_DISCARD: 'Choose energy from discard',
  CHOOSE_ENERGY_TO_DISCARD: 'Choose energy to discard',
  CHOOSE_ENERGY_TO_PAY_RETREAT_COST: 'Choose energy to pay retreat cost',
  CHOOSE_ENERGY_TYPE: 'Choose energy type',
  CHOOSE_STARTING_POKEMONS: 'Choose starting Pokemon',
  GO_FIRST: 'Go first?',
  LOG_PLAYER_ATTACHES_CARD: 'Attached a card',
  LOG_PLAYER_DEALS_DAMAGE: 'Dealt damage',
  LOG_PLAYER_DISABLES_ATTACK: 'Disabled an attack',
  LOG_PLAYER_DRAWS_CARD: 'Drew a card',
  LOG_PLAYER_ENDS_TURN: 'Ended turn',
  LOG_PLAYER_CONCEDED: 'Conceded',
  LOG_GAME_FINISHED: 'Game finished',
  LOG_GAME_FINISHED_DRAW: 'Game finished as a draw',
  LOG_GAME_FINISHED_WINNER: 'Game finished',
  LOG_PLAYER_PLAYS_BASIC_POKEMON: 'Played a Basic Pokemon',
  LOG_PLAYER_RETREATS: 'Retreated',
  LOG_PLAYER_USES_ATTACK: 'Used an attack',
  LOG_PLAYER_USES_ABILITY: 'Used an ability',
  LOG_TURN: 'New turn',
  RETREAT_ALREADY_USED: 'Retreat already used this turn',
  SETUP_WHO_BEGINS_FLIP: 'Flip to decide who goes first',
  WANT_TO_DISCARD_ENERGY: 'Discard energy?',
};

export function labelFor(value: unknown): string {
  if (typeof value !== 'string') {
    return '';
  }
  if (knownLabels[value]) {
    return knownLabels[value];
  }
  if (/^[A-Z0-9_]+$/.test(value)) {
    return value
      .replace(/^LOG_/, '')
      .split('_')
      .filter(Boolean)
      .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
      .join(' ');
  }
  return value;
}
