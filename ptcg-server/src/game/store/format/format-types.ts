/**
 * Flags for altering gameplay rules of formats.
 * A no-flag setup should conform to SV-on era play, except for the first-turn rules.
 */
export enum GameplayRule {
  // MARK: Setup rules
  COIN_FLIP_WINNER_GOES_FIRST = 'Coin flip winner always goes first',
  FLIP_COIN_AFTER_SETUP = 'Flip coin after setup',

  DRAW_MULLIGANS_IMMEDIATELY = 'Draw mulligans immediately',
  TWO_DRAWS_PER_MULLIGAN = 'Draw 2 cards for each opponent mulligan',

  // MARK: First turn rules
  T1_FIRST_NO_ATTACK = 'No attack going first',

  T1_FIRST_NO_ITEM = 'No Items going first',
  T1_FIRST_NO_SUPPORTER = 'No Supporters going first',
  T1_FIRST_NO_STADIUM = 'No Stadiums going first',
  T1_FIRST_NO_TOOL = 'No Tools going first',

  T1_FIRST_NO_DRAW = 'No drawing going first',

  // MARK: Gameplay rules
  WOTC_CONFUSION = 'Confusion: 20 typed damage, flip coin to retreat',
  PRE_SUMO_BURN = 'Burn: 20 damage on tails, not cured',

  SAME_STADIUM_PLAY = 'Can play Stadiums with the same name',

  UNLIMITED_RETREAT = 'Unlimited retreats per turn',

  SUPPORTER_STAYS_IN_PLAY = 'Supporter cards stay in play during your turn',
}

/**
 * Flags for altering individual card behavior. Base behavior is of the card's original printing.
 * Logic for determining different behavior will live on each card.
 * Cards will check the current game format to see if its specific erratum is present.
 * When adding new errata to this list, please use the card name as the beginning of the entry.
 */
export enum Erratum {
  // MARK: wide-reaching errata
  TOOLS_ARE_NOT_ITEMS = 'Pokémon Tools do not count as Items',

  // MARK: specific errata
  LEFTOVERS_HEALS_20 = 'Leftovers heals 20 damage',
  SUPER_ROD_UP_TO_3 = 'Super Rod may shuffle in less than 3 cards',
  SUPERIOR_ENERGY_RETRIEVAL_UP_TO_4 = 'Superior Energy Retrieval may return less than 4 cards',
  RARE_CANDY_NERF = "Rare Candy can't be used on the turn a Pokémon enters, nor to evolve into a Stage 1",
  POTION_HEALS_30 = 'Potion heals 30 damage',
  GREAT_BALL_TOP_7 = 'Great Ball finds a Pokémon from the top 7 cards of your deck',
  POKEMON_CATCHER_COIN_FLIP = 'Pokémon Catcher requires a coin flip',
  ENERGY_RETRIEVAL_UP_TO_2 = 'Energy Retrieval may return less than 2 cards',
  PAL_PAD_UP_TO_2 = 'Pal Pad may shuffle in less 2 cards',
  ENERGY_RECYCLER_UP_TO_5 = 'Energy Recycler may shuffle in less than 5 cards',
  SACRED_ASH_UP_TO_5 = 'Sacred Ash may shuffle in less 5 cards',
  LUM_BERRY_END_OF_TURN = 'Lum Berry triggers at the end of turn before Pokémon Checkup',
  SITRUS_BERRY_END_OF_TURN = 'Sitrus Berry triggers at the end of turn before Pokémon Checkup',
  HYPER_POTION_HEALS_120 = 'Hyper Potion heals 120 damage from a Pokémon and always discards 2 Energy',
  QUICK_BALL_SEARCHES_BASIC = 'Quick Ball searches for a Basic Pokémon',
  PLUSPOWER_DOESNT_ATTACH = 'PlusPower creates a static effect instead of attaching to a Pokémon', // I guess it fills the discard pile immediately and doesn't have issues with retreat...?
}
