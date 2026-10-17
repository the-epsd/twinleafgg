import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardTag, CardType, Stage } from '../../../game/store/card/card-types';
import { GameError, GameMessage, PowerType, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP } from '../../../game/store/prefabs/attack-effects';
import { ABILITY_USED, COIN_FLIP_PROMPT, DRAW_CARDS_UNTIL_CARDS_IN_HAND, IS_POKEPOWER_BLOCKED, REMOVE_MARKER_AT_END_OF_TURN, USE_ABILITY_ONCE_PER_TURN, WAS_ATTACK_USED, WAS_POWER_USED } from '../../../game/store/prefabs/prefabs';

export class UnownO extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  protected _tags = [CardTag.UNOWN];
  public hp: number = 50;
  public cardType: CardType[] = [P];
  public weakness = [{ type: P, value: +10 }];
  public retreat = [C];

  public powers = [{
    name: 'ONE',
    powerType: PowerType.POKEPOWER,
    useWhenInPlay: true,
    text: 'Once during your turn (before your attack), if you have Unown O, Unown N, and Unown E on your Bench and you have 1 card left in your hand, you may draw cards until you have 7 cards in your hand.',
  }];

  public attacks = [{
    name: 'Hidden Power',
    cost: [C],
    damage: 10,
    text: 'Flip a coin. If heads, the Defending Pokémon is now Asleep.'
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '70';
  public name: string = 'Unown [O]';
  public fullName: string = 'Unown [O] SW';

  public readonly ABILITY_USED_MARKER = 'ABILITY_USED_MARKER';
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    REMOVE_MARKER_AT_END_OF_TURN(effect, this.ABILITY_USED_MARKER, this);

    // ONE
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      if (IS_POKEPOWER_BLOCKED(store, state, player, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }

      const isOnBench = player.bench.some(slot => slot.getPokemonCard() === this);
      if (!isOnBench) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      const benchNames = new Set<string>();
      player.bench.forEach(slot => {
        const card = slot.getPokemonCard();
        if (card) {
          benchNames.add(card.name);
        }
      });
      const required = ['Unown [O]', 'Unown [N]', 'Unown [E]'];
      if (!required.every(name => benchNames.has(name))) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      if (player.hand.cards.length !== 1) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      USE_ABILITY_ONCE_PER_TURN(player, this.ABILITY_USED_MARKER, this);
      ABILITY_USED(player, this);
      DRAW_CARDS_UNTIL_CARDS_IN_HAND(player, 7);
      return state;
    }

    // Hidden Power
    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP(store, state, effect);
        }
      });
    }

    return state;
  }
}
