import { PlayerType, SlotType, targetFor, type CardView, type GameView, type PlayerView, type PokemonSlotView, type PromptView } from '../game/types';

export type PromptDockMode = 'default' | 'search' | 'attachEnergy';

export type PromptGalleryDemo = {
  key: string;
  title: string;
  description: string;
  prompt: PromptView;
  mode?: PromptDockMode;
};

export type BoardPromptGalleryDemo = PromptGalleryDemo & {
  promptClassName: 'ChoosePokemonPrompt' | 'PutDamagePrompt' | 'MoveDamagePrompt' | 'RemoveDamagePrompt' | 'AttachEnergyPrompt';
};

export const PROMPT_GALLERY_CLASS_NAMES = [
  'AlertPrompt',
  'AttachEnergyPrompt',
  'ChooseAttackPrompt',
  'ChooseCardsPrompt',
  'ChooseEnergyPrompt',
  'ChoosePokemonPrompt',
  'ChoosePrizePrompt',
  'CoinFlipPrompt',
  'ConfirmCardsPrompt',
  'ConfirmPrompt',
  'DiscardEnergyPrompt',
  'InvitePlayerPrompt',
  'MoveDamagePrompt',
  'MoveEnergyPrompt',
  'OrderCardsPrompt',
  'PutDamagePrompt',
  'RemoveDamagePrompt',
  'SelectOptionPrompt',
  'SelectPrompt',
  'ShowCardsPrompt',
  'ShowMulliganPrompt',
  'ShuffleDeckPrompt',
  'ShuffleHandPrompt',
  'ShufflePrizesPrompt',
  'WaitPrompt',
] as const;

const cards = {
  dreepy: pokemon(1, 'Dreepy', 'Dragapult deck Dreepy', 'sv6', '128', 70, [
    { name: 'Petty Grudge', damage: '10' },
    { name: 'Bite', damage: '40' },
  ]),
  drakloak: pokemon(2, 'Drakloak', 'Dragapult deck Drakloak', 'sv6', '129', 90, [
    { name: 'Corkscrew Punch', damage: '30' },
  ]),
  dragapult: pokemon(3, 'Dragapult ex', 'Dragapult ex', 'sv6', '130', 320, [
    { name: 'Jet Headbutt', damage: '70' },
    { name: 'Phantom Dive', damage: '200' },
  ]),
  munkidori: pokemon(4, 'Munkidori', 'Munkidori', 'sv6', '95', 110, [
    { name: 'Adrena-Brain', damage: '' },
    { name: 'Psychic', damage: '30+' },
  ]),
  cleffa: pokemon(5, 'Cleffa', 'Cleffa', 'sv3', '80', 30, [
    { name: 'Grasping Draw', damage: '' },
  ]),
  pidgeot: pokemon(6, 'Pidgeot ex', 'Pidgeot ex', 'sv3', '164', 280, [
    { name: 'Blustery Wind', damage: '120' },
  ]),
  charmander: pokemon(7, 'Charmander', 'Charmander', 'sv3pt5', '4', 70, [
    { name: 'Heat Tackle', damage: '30' },
  ]),
  rareCandy: trainer(20, 'Rare Candy', 'Rare Candy', 'sv1', '191'),
  nestBall: trainer(21, 'Nest Ball', 'Nest Ball', 'sv1', '181'),
  boss: trainer(22, "Boss's Orders", "Boss's Orders", 'swsh2', '154'),
  buddyBuddy: trainer(23, 'Buddy-Buddy Poffin', 'Buddy-Buddy Poffin', 'sv5', '144'),
  braveryCharm: trainer(25, 'Bravery Charm', 'Bravery Charm', 'sv2', '173', 'Tool'),
  fireEnergy: energy(30, 'Basic Fire Energy', 'Basic Fire Energy', 'sve', '2'),
  psychicEnergy: energy(31, 'Basic Psychic Energy', 'Basic Psychic Energy', 'sve', '5'),
  grassEnergy: energy(32, 'Basic Grass Energy', 'Basic Grass Energy', 'sve', '1'),
  darknessEnergy: energy(33, 'Basic Darkness Energy', 'Basic Darkness Energy', 'sve', '7'),
};

export const promptGalleryCards = cards;

export const promptGalleryGame = createGame();

export const dockPromptDemos: PromptGalleryDemo[] = [
  demo('alert', 'Alert', 'Simple continue-only prompt.', 'AlertPrompt', {
    message: 'CANNOT_ATTACK_ON_FIRST_TURN',
  }),
  demo('show-cards', 'Show cards', 'Reveals cards with a continue action.', 'ShowCardsPrompt', {
    message: 'Cards revealed by search',
    fields: { cardList: withIndexes([cards.rareCandy, cards.nestBall, cards.dreepy]) },
  }),
  demo('confirm-cards', 'Confirm cards', 'Same visual shell as show cards, with confirmation language.', 'ConfirmCardsPrompt', {
    message: 'Confirm these cards',
    fields: { cardList: withIndexes([cards.fireEnergy, cards.psychicEnergy]) },
  }),
  demo('show-mulligan', 'Show mulligan', 'Opponent hand reveal before mulligan draw choice.', 'ShowMulliganPrompt', {
    message: 'Mulligan hand',
    fields: { cardList: withIndexes([cards.rareCandy, cards.boss, cards.fireEnergy, cards.psychicEnergy]) },
  }),
  demo('wait', 'Wait', 'Waiting state for the non-acting player.', 'WaitPrompt', {
    message: 'Waiting for opponent',
  }),
  demo('confirm', 'Confirm', 'Binary yes/no decision.', 'ConfirmPrompt', {
    message: 'WANT_TO_DISCARD_ENERGY',
  }),
  demo('coin-flip', 'Coin flip', 'Heads/tails choice.', 'CoinFlipPrompt', {
    message: 'SETUP_WHO_BEGINS_FLIP',
  }),
  demo('select', 'Select values', 'Generic option list.', 'SelectPrompt', {
    message: 'Choose a type',
    fields: { values: ['Fire', 'Psychic', 'Grass', 'Darkness'], options: { allowCancel: true } },
  }),
  demo('mulligan-draw', 'Mulligan draw slider', 'Special select-option shape for mulligan draw count.', 'SelectOptionPrompt', {
    message: 'WANT_TO_DRAW_CARDS',
    fields: {
      values: ['Draw 0 card(s)', 'Draw 1 card(s)', 'Draw 2 card(s)', 'Draw 3 card(s)'],
      options: { defaultValue: 3 },
    },
  }),
  demo('choose-attack', 'Choose attack', 'Attack buttons sourced from card attacks.', 'ChooseAttackPrompt', {
    message: 'CHOOSE_ATTACK_TO_DISABLE',
    fields: {
      cardList: withIndexes([cards.dragapult]),
      options: { allowCancel: true, blocked: [{ index: 0, attack: 'Jet Headbutt' }] },
    },
  }),
  demo('choose-cards', 'Choose cards', 'Large search/grid prompt.', 'ChooseCardsPrompt', {
    message: 'CHOOSE_CARD_TO_HAND',
    mode: 'search',
    fields: {
      cardList: withIndexes([
        cards.dreepy,
        cards.drakloak,
        cards.dragapult,
        cards.munkidori,
        cards.cleffa,
        cards.pidgeot,
        cards.rareCandy,
        cards.nestBall,
        cards.buddyBuddy,
        cards.fireEnergy,
        cards.psychicEnergy,
        cards.darknessEnergy,
      ]),
      options: { min: 1, max: 3, allowCancel: true, blocked: [7] },
    },
  }),
  demo('choose-prize', 'Choose prize', 'Prize card chooser with known and face-down prizes.', 'ChoosePrizePrompt', {
    message: 'Choose a prize card',
    fields: {
      prizes: [
        { index: 0, cards: [cards.fireEnergy] },
        { index: 1, cards: [] },
        { index: 2, cards: [cards.rareCandy] },
        { index: 3, cards: [] },
        { index: 4, cards: [cards.dreepy] },
        { index: 5, cards: [] },
      ],
      options: { min: 1, max: 2, allowCancel: true, blocked: [3] },
    },
  }),
  demo('choose-energy', 'Choose energy', 'Energy cost picker.', 'ChooseEnergyPrompt', {
    message: 'CHOOSE_ENERGY_TO_PAY_RETREAT_COST',
    fields: {
      cardList: withIndexes([cards.fireEnergy, cards.psychicEnergy, cards.darknessEnergy]),
      cost: ['Colorless', 'Colorless'],
      options: { min: 2, max: 2, allowCancel: true, blocked: [2] },
    },
  }),
  demo('discard-energy', 'Discard energy', 'Source-only board target picker for attached energy.', 'DiscardEnergyPrompt', {
    message: 'CHOOSE_ENERGY_TO_DISCARD',
    fields: targetFields({ playerType: PlayerType.ANY, options: { allowCancel: true } }),
  }),
  demo('move-energy', 'Move energy', 'Source and destination target picker.', 'MoveEnergyPrompt', {
    message: 'Move an attached energy',
    fields: targetFields({ playerType: PlayerType.ANY, options: { min: 1, max: 1, allowCancel: true } }),
  }),
  demo('shuffle-deck', 'Shuffle deck', 'Shuffle/order shell with listed cards.', 'ShuffleDeckPrompt', {
    message: 'Shuffle these cards into deck',
    fields: { cardList: withIndexes([cards.dreepy, cards.drakloak, cards.dragapult]), options: { allowCancel: true } },
  }),
  demo('shuffle-prizes', 'Shuffle prizes', 'Same shell for prize randomization.', 'ShufflePrizesPrompt', {
    message: 'Shuffle prizes',
    fields: { cardList: withIndexes([cards.fireEnergy, cards.psychicEnergy, cards.rareCandy]) },
  }),
  demo('order-cards', 'Order cards', 'Ordering prompt shape.', 'OrderCardsPrompt', {
    message: 'Order cards on top of the deck',
    fields: { cardList: withIndexes([cards.nestBall, cards.buddyBuddy, cards.boss]), options: { allowCancel: true } },
  }),
];

export const attachPromptDemo: PromptGalleryDemo = demo('attach-energy', 'Attach energy', 'Compact dock plus board assignment highlights.', 'AttachEnergyPrompt', {
  mode: 'attachEnergy',
  fields: {
    energy: [
      { index: 0, card: cards.fireEnergy, provides: ['Fire'] },
      { index: 1, card: cards.psychicEnergy, provides: ['Psychic'] },
      { index: 2, card: cards.darknessEnergy, provides: ['Darkness'] },
    ],
    playerType: PlayerType.BOTTOM_PLAYER,
    slots: [SlotType.ACTIVE, SlotType.BENCH],
    options: { min: 1, max: 2, allowCancel: true, differentTargets: true },
  },
});

export const boardPromptDemos: BoardPromptGalleryDemo[] = [
  {
    ...demo('choose-pokemon-board', 'Choose Pokemon', 'Board-only Pokemon target picker.', 'ChoosePokemonPrompt', {
      message: 'CHOOSE_CARD_TO_PUT_ONTO_BENCH',
      fields: targetFields({ playerType: PlayerType.ANY, options: { min: 1, max: 2, allowCancel: true } }),
    }),
    promptClassName: 'ChoosePokemonPrompt',
  },
  {
    ...demo('put-damage-board', 'Place damage', 'Click targets to stack damage counters.', 'PutDamagePrompt', {
      fields: {
        ...targetFields({
          playerType: PlayerType.ANY,
          damage: 60,
          options: {
            damageMultiple: 10,
            allowCancel: true,
          },
        }),
        maxAllowedDamage: [
          { target: targetFor(0, 0, SlotType.ACTIVE), damage: 40 },
          { target: targetFor(0, 1, SlotType.ACTIVE), damage: 60 },
        ],
      },
    }),
    promptClassName: 'PutDamagePrompt',
  },
  {
    ...demo('move-damage-board', 'Move damage', 'Pick damaged source, then destination.', 'MoveDamagePrompt', {
      fields: targetFields({
        playerType: PlayerType.ANY,
        options: { min: 1, max: 3, damageMultiple: 10, sameTarget: true, allowCancel: true },
      }),
    }),
    promptClassName: 'MoveDamagePrompt',
  },
  {
    ...demo('remove-damage-board', 'Remove damage', 'Same transfer flow, shown as healing/removal.', 'RemoveDamagePrompt', {
      fields: targetFields({
        playerType: PlayerType.BOTTOM_PLAYER,
        options: { min: 1, max: 2, damageMultiple: 10, sameTarget: true, allowCancel: true },
      }),
    }),
    promptClassName: 'RemoveDamagePrompt',
  },
];

export const unsupportedPromptDemos: PromptGalleryDemo[] = [
  demo('invite-player', 'Invite player', 'Unsupported resolver state.', 'InvitePlayerPrompt', {
    supported: false,
    unsupportedReason: 'Invitation prompts are handled by the app shell, not PromptHost.',
    message: 'Game invitation',
  }),
  demo('shuffle-hand', 'Shuffle hand', 'Unsupported prompt warning state.', 'ShuffleHandPrompt', {
    supported: false,
    unsupportedReason: 'No client resolver exists for this prompt yet.',
    message: 'Shuffle hand',
  }),
];

function demo(
  key: string,
  title: string,
  description: string,
  className: string,
  overrides: Partial<PromptView> & { mode?: PromptDockMode } = {},
): PromptGalleryDemo {
  const id = promptIdFor(key);
  return {
    key,
    title,
    description,
    mode: overrides.mode,
    prompt: {
      id,
      className,
      type: className,
      playerId: 100,
      playerIndex: 0,
      supported: true,
      resultSchema: 'demo',
      fields: {},
      ...overrides,
    },
  };
}

function promptIdFor(key: string) {
  let hash = 0;
  for (const char of key) {
    hash = ((hash << 5) - hash + char.charCodeAt(0)) | 0;
  }
  return Math.abs(hash);
}

function targetFields(args: {
  playerType: number;
  slots?: number[];
  damage?: number;
  options?: Record<string, unknown>;
}) {
  return {
    playerType: args.playerType,
    slots: args.slots ?? [SlotType.ACTIVE, SlotType.BENCH],
    ...(args.damage === undefined ? {} : { damage: args.damage }),
    options: args.options ?? {},
  };
}

function createGame(): GameView {
  const bottom = player(0, 'Twinleaf', [
    cards.fireEnergy,
    cards.psychicEnergy,
    cards.darknessEnergy,
    cards.rareCandy,
    cards.nestBall,
    cards.buddyBuddy,
  ]);
  const top = player(1, 'Opponent', [
    cards.dreepy,
    cards.drakloak,
    cards.boss,
  ]);

  bottom.active = slot(0, 'active', 0, cards.dragapult, {
    damage: 50,
    energy: [cards.fireEnergy, cards.psychicEnergy],
    tools: [cards.braveryCharm],
  });
  bottom.bench = [
    slot(0, 'bench', 0, cards.munkidori, { damage: 20, energy: [cards.darknessEnergy] }),
    slot(0, 'bench', 1, cards.dreepy, { damage: 0, energy: [cards.psychicEnergy] }),
    slot(0, 'bench', 2, cards.cleffa),
    emptySlot(0, 3),
    emptySlot(0, 4),
  ];

  top.active = slot(1, 'active', 0, cards.pidgeot, { damage: 30, energy: [cards.grassEnergy] });
  top.bench = [
    slot(1, 'bench', 0, cards.charmander, { damage: 10, energy: [cards.fireEnergy] }),
    slot(1, 'bench', 1, cards.drakloak),
    emptySlot(1, 2),
    emptySlot(1, 3),
    emptySlot(1, 4),
  ];

  return {
    ready: true,
    phase: 3,
    phaseLabel: 'Player turn',
    turn: 4,
    activePlayerIndex: 0,
    activePlayerId: 100,
    players: [bottom, top],
    prompts: [],
    logs: [
      { id: 1, message: 'Prompt gallery fixture loaded.' },
    ],
    events: [],
  };
}

function player(index: number, name: string, hand: CardView[]): PlayerView {
  return {
    index,
    id: 100 + index,
    name,
    hand,
    deckCount: 32 - index * 3,
    discard: [cards.rareCandy, cards.fireEnergy],
    lostZone: index === 0 ? [cards.boss] : [],
    stadium: index === 0 ? [trainer(24, 'Artazon', 'Artazon', 'sv2', '171')] : [],
    playZone: [],
    prizesLeft: 6,
    active: emptyActive(index),
    bench: Array.from({ length: 5 }, (_, benchIndex) => emptySlot(index, benchIndex)),
    playableCardIds: [],
  };
}

function slot(
  ownerIndex: number,
  kind: 'active' | 'bench',
  index: number,
  pokemon: CardView,
  options: Partial<Pick<PokemonSlotView, 'damage' | 'energy' | 'tools'>> = {},
): PokemonSlotView {
  return {
    ownerIndex,
    slot: kind,
    index,
    target: targetFor(0, ownerIndex, kind === 'active' ? SlotType.ACTIVE : SlotType.BENCH, index),
    empty: false,
    pokemon,
    cards: [pokemon, ...(options.energy ?? []), ...(options.tools ?? [])],
    damage: options.damage ?? 0,
    hp: pokemon.hp ?? 0,
    retreat: pokemon.retreat ?? [],
    energy: options.energy ?? [],
    tools: options.tools ?? [],
    specialConditions: [],
  };
}

function emptyActive(ownerIndex: number): PokemonSlotView {
  return {
    ownerIndex,
    slot: 'active',
    index: 0,
    target: targetFor(0, ownerIndex, SlotType.ACTIVE),
    empty: true,
    cards: [],
    damage: 0,
    hp: 0,
    retreat: [],
    energy: [],
    tools: [],
    specialConditions: [],
  };
}

function emptySlot(ownerIndex: number, index: number): PokemonSlotView {
  return {
    ownerIndex,
    slot: 'bench',
    index,
    target: targetFor(0, ownerIndex, SlotType.BENCH, index),
    empty: true,
    cards: [],
    damage: 0,
    hp: 0,
    retreat: [],
    energy: [],
    tools: [],
    specialConditions: [],
  };
}

function pokemon(id: number, name: string, fullName: string, set: string, setNumber: string, hp: number, attacks: CardView['attacks']): CardView {
  return {
    id,
    name,
    fullName,
    set,
    setNumber,
    imageUrl: image(set, setNumber),
    superType: 'Pokemon',
    cardType: 'Pokemon',
    hp,
    retreat: [],
    attacks,
  };
}

function trainer(id: number, name: string, fullName: string, set: string, setNumber: string, trainerType = 'Item'): CardView {
  return {
    id,
    name,
    fullName,
    set,
    setNumber,
    imageUrl: image(set, setNumber),
    superType: 'Trainer',
    trainerType,
  };
}

function energy(id: number, name: string, fullName: string, set: string, setNumber: string): CardView {
  return {
    id,
    name,
    fullName,
    set,
    setNumber,
    imageUrl: image(set, setNumber),
    superType: 'Energy',
    energyType: 'Basic',
  };
}

function image(set: string, setNumber: string) {
  return `https://images.pokemontcg.io/${set}/${setNumber}_hires.png`;
}

function withIndexes(input: CardView[]) {
  return input.map((card, index) => ({ ...card, index }));
}
