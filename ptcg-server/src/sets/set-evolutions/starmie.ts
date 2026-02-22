import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, EnergyType, SuperType, BoardEffect } from '../../game/store/card/card-types';
import { Attack, PowerType } from '../../game/store/card/pokemon-types';
import { StoreLike, State, GameMessage, Card, ChooseCardsPrompt, GameError, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { DiscardToHandEffect } from '../../game/store/effects/play-card-effects';
import { ADD_PARALYZED_TO_PLAYER_ACTIVE, AFTER_ATTACK, COIN_FLIP_PROMPT, MOVE_CARDS, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

function* useSpaceBeacon(next: Function, store: StoreLike, state: State,
  effect: PowerEffect, self: Card): IterableIterator<State> {
  const player = effect.player;
  let cards: Card[] = [];

  if (player.hand.cards.length === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  let basicEnergies = 0;
  player.discard.cards.forEach(c => {
    if (c.superType === SuperType.ENERGY && c.energyType === EnergyType.BASIC) {
      basicEnergies += 1;
    }
  });

  if (basicEnergies === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  yield store.prompt(state, new ChooseCardsPrompt(
    player,
    GameMessage.CHOOSE_CARD_TO_DISCARD,
    player.hand,
    {},
    { min: 1, max: 1, allowCancel: false }
  ), selected => {
    cards = selected || [];
    next();
  });

  // Operation canceled by the user
  if (cards.length === 0) {
    return state;
  }


  let recovered: Card[] = [];
  yield store.prompt(state, new ChooseCardsPrompt(
    player,
    GameMessage.CHOOSE_CARD_TO_HAND,
    player.discard,
    { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
    { min: 1, max: 2, allowCancel: false }
  ), selected => {
    recovered = selected || [];
    next();
  });

  // Operation canceled by the user
  if (recovered.length === 0) {
    return state;
  }

  player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
    if (cardList.getPokemonCard() === effect.card) {
      cardList.addBoardEffect(BoardEffect.ABILITY_USED);
    }
  });


  MOVE_CARDS(store, state, player.hand, player.discard, { cards: cards, sourceCard: self, sourceEffect: self.powers[0] });
  MOVE_CARDS(store, state, player.discard, player.hand, { cards: recovered, sourceCard: self, sourceEffect: self.powers[0] });

  return state;
}

export class Starmie extends PokemonCard {

  public name = 'Starmie';

  public cardImage: string = 'assets/cardback.png';

  public set = 'EVO';

  public evolvesFrom: string = 'Staryu';

  public fullName = 'Starmie EVO';

  public setNumber = '31';

  public cardType = CardType.WATER;

  public stage = Stage.STAGE_1;

  public hp = 90;

  public weakness = [{ type: CardType.GRASS }];

  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Space Beacon',
    powerType: PowerType.ABILITY,
    useWhenInPlay: true,
    text: 'Once during your turn (before your attack), you may discard a card from your hand. If you do, put 2 basic Energy cards from your discard pile into your hand. (You can\'t choose a card you discarded with the effect of this Ability.)'

  }];

  public attacks: Attack[] = [
    {
      name: 'Star Freeze',
      cost: [CardType.WATER, CardType.COLORLESS],
      damage: 30,
      text: 'Flip a coin. If heads, your opponent\'s Active Pokémon is now Paralyzed.'
    }
  ];

  public readonly SPACE_BEACON_MARKER = 'SPACE_BEACON_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.SPACE_BEACON_MARKER, this)) {
      const player = effect.player;
      player.marker.removeMarker(this.SPACE_BEACON_MARKER, this);
    }

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      if (player.marker.hasMarker(this.SPACE_BEACON_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      // Check if DiscardToHandEffect is prevented
      const discardEffect = new DiscardToHandEffect(player, this);
      store.reduceEffect(state, discardEffect);

      if (discardEffect.preventDefault) {
        return state;
      }

      const generator = useSpaceBeacon(() => generator.next(), store, state, effect, this);
      player.marker.addMarker(this.SPACE_BEACON_MARKER, this);
      return generator.next().value;
    }


    if (AFTER_ATTACK(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result === true) {
          ADD_PARALYZED_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
        }
      });
    }
    return state;
  }
}