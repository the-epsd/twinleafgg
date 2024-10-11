import { Effect } from './effect';
import { EnergyCard } from '../card/energy-card';
import { Player } from '../state/player';
import { PokemonCard } from '../card/pokemon-card';
import { PokemonCardList } from '../state/pokemon-card-list';
import { TrainerCard } from '../card/trainer-card';
import { CardList } from '../state/card-list';
import { Card } from '../card/card';

export enum PlayCardEffects {
  ATTACH_ENERGY_EFFECT = 'ATTACH_ENERGY_EFFECT',
  PLAY_POKEMON_EFFECT = 'PLAY_POKEMON_EFFECT',
  PLAY_SUPPORTER_EFFECT = 'PLAY_SUPPORTER_EFFECT',
  PLAY_STADIUM_EFFECT = 'PLAY_STADIUM_EFFECT',
  PLAY_POKEMON_TOOL_EFFECT = 'PLAY_POKEMON_TOOL_EFFECT',
  PLAY_ITEM_EFFECT = 'PLAY_ITEM_EFFECT',
  TRAINER_EFFECT = 'TRAINER_EFFECT',
  ENERGY_EFFECT = 'ENERGY_EFFECT',
  TOOL_EFFECT = 'TOOL_EFFECT',
  SUPPORTER_EFFECT = 'SUPPORTER_EFFECT',
  COIN_FLIP_EFFECT = 'COIN_FLIP_EFFECT',
  TRAINER_CARD_TO_DECK_EFFECT = 'TRAINER_CARD_TO_DECK_EFFECT',
  DISCARD_TO_HAND_EFFECT = 'DISCARD_TO_HAND_EFFECT',
}

export class AttachEnergyEffect implements Effect {
  readonly type: string = PlayCardEffects.ATTACH_ENERGY_EFFECT;
  public preventDefault = false;
  public player: Player;
  public energyCard: EnergyCard;
  public target: PokemonCardList;

  constructor(player: Player, energyCard: EnergyCard, target: PokemonCardList) {
    this.player = player;
    this.energyCard = energyCard;
    this.target = target;
  }
}

export class PlayPokemonEffect implements Effect {
  readonly type: string = PlayCardEffects.PLAY_POKEMON_EFFECT;
  public preventDefault = false;
  public player: Player;
  public pokemonCard: PokemonCard;
  public target: PokemonCardList;

  constructor(player: Player, pokemonCard: PokemonCard, target: PokemonCardList) {
    this.player = player;
    this.pokemonCard = pokemonCard;
    this.target = target;
  }
}

export class PlaySupporterEffect implements Effect {
  readonly type: string = PlayCardEffects.PLAY_SUPPORTER_EFFECT;
  public preventDefault = false;
  public player: Player;
  public trainerCard: TrainerCard;
  public target: CardList | undefined;

  constructor(player: Player, trainerCard: TrainerCard, target?: CardList) {
    this.player = player;
    this.trainerCard = trainerCard;
    this.target = target;
  }
}

export class PlayStadiumEffect implements Effect {
  readonly type: string = PlayCardEffects.PLAY_STADIUM_EFFECT;
  public preventDefault = false;
  public player: Player;
  public trainerCard: TrainerCard;

  constructor(player: Player, trainerCard: TrainerCard) {
    this.player = player;
    this.trainerCard = trainerCard;
  }
}

export class AttachPokemonToolEffect implements Effect {
  readonly type: string = PlayCardEffects.PLAY_POKEMON_TOOL_EFFECT;
  public preventDefault = false;
  public player: Player;
  public trainerCard: TrainerCard;
  public target: PokemonCardList;

  constructor(player: Player, trainerCard: TrainerCard, target: PokemonCardList) {
    this.player = player;
    this.trainerCard = trainerCard;
    this.target = target;
  }
}

export class PlayItemEffect implements Effect {
  readonly type: string = PlayCardEffects.PLAY_ITEM_EFFECT;
  public preventDefault = false;
  public player: Player;
  public trainerCard: TrainerCard;
  public target: CardList | undefined;

  constructor(player: Player, trainerCard: TrainerCard, target?: CardList) {
    this.player = player;
    this.trainerCard = trainerCard;
    this.target = target;
  }
}

export class TrainerEffect implements Effect {
  readonly type: string = PlayCardEffects.TRAINER_EFFECT;
  public preventDefault = false;
  public player: Player;
  public trainerCard: TrainerCard;
  public target: CardList | undefined;

  constructor(player: Player, trainerCard: TrainerCard, target?: CardList) {
    this.player = player;
    this.trainerCard = trainerCard;
    this.target = target;
  }
}

export class EnergyEffect implements Effect {
  readonly type: string = PlayCardEffects.ENERGY_EFFECT;
  public preventDefault = false;
  public player: Player;
  public card: EnergyCard;

  constructor(player: Player, card: EnergyCard) {
    this.player = player;
    this.card = card;
  }
}

export class ToolEffect implements Effect {
  readonly type: string = PlayCardEffects.TOOL_EFFECT;
  public preventDefault = false;
  public player: Player;
  public card: TrainerCard;

  constructor(player: Player, card: TrainerCard) {
    this.player = player;
    this.card = card;
  }
}

export class SupporterEffect implements Effect {
  readonly type: string = PlayCardEffects.SUPPORTER_EFFECT;
  public preventDefault = false;
  public player: Player;
  public card: TrainerCard;
  public target: CardList | undefined;

  constructor(player: Player, card: TrainerCard) {
    this.player = player;
    this.card = card;
  }
}

export class CoinFlipEffect implements Effect {
  readonly type: string = PlayCardEffects.COIN_FLIP_EFFECT;
  public preventDefault = false;
  public player: Player;

  constructor(player: Player) {
    this.player = player;
  }
}

export class TrainerToDeckEffect implements Effect {
  readonly type: string = PlayCardEffects.TRAINER_CARD_TO_DECK_EFFECT;
  public preventDefault = false;
  public player: Player;
  public card: TrainerCard;

  constructor(player: Player, card: TrainerCard) {
    this.player = player;
    this.card = card;
  }
}

export class DiscardToHandEffect implements Effect {
  readonly type: string = PlayCardEffects.DISCARD_TO_HAND_EFFECT;
  public preventDefault = false;
  public player: Player;
  public card: Card;

  constructor(player: Player, card: Card) {
    this.player = player;
    this.card = card;
  }
}