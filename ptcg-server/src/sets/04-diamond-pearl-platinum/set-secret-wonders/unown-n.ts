import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardTag, CardType, Stage } from '../../../game/store/card/card-types';
import { GameError, GameMessage, PowerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_BURNED } from '../../../game/store/prefabs/attack-effects';
import { ABILITY_USED, COIN_FLIP_PROMPT, CONFIRMATION_PROMPT, DRAW_CARDS, IS_POKEPOWER_BLOCKED, REMOVE_MARKER_AT_END_OF_TURN, TAKE_X_PRIZES, USE_ABILITY_ONCE_PER_TURN, WAS_ATTACK_USED, WAS_POWER_USED } from '../../../game/store/prefabs/prefabs';

export class UnownN extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  protected _tags = [CardTag.UNOWN];
  public hp: number = 50;
  public cardType: CardType[] = [P];
  public weakness = [{ type: P, value: +10 }];
  public retreat = [C];

  public powers = [{
    name: 'Nod',
    powerType: PowerType.POKEPOWER,
    useWhenInPlay: true,
    text: 'Once during your turn (before your attack), if you have Unown N, Unown O, and Unown D on your Bench, you may ask your opponent to take a Prize card. If he or she does, you take a Prize card. If he or she doesn\'t, draw a card.',
  }];

  public attacks = [{
    name: 'Hidden Power',
    cost: [C],
    damage: 10,
    text: 'Flip a coin. If heads, the Defending Pokémon is now Burned.'
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '69';
  public name: string = 'Unown [N]';
  public fullName: string = 'Unown [N] SW';

  public readonly ABILITY_USED_MARKER = 'ABILITY_USED_MARKER';
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    REMOVE_MARKER_AT_END_OF_TURN(effect, this.ABILITY_USED_MARKER, this);

    // Nod
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

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
      const required = ['Unown [N]', 'Unown [O]', 'Unown [D]'];
      if (!required.every(name => benchNames.has(name))) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      USE_ABILITY_ONCE_PER_TURN(player, this.ABILITY_USED_MARKER, this);
      ABILITY_USED(player, this);

      return CONFIRMATION_PROMPT(store, state, opponent, takesPrize => {
        if (takesPrize && opponent.getPrizeLeft() > 0) {
          TAKE_X_PRIZES(store, state, opponent, 1, {}, () => {
            if (player.getPrizeLeft() > 0) {
              TAKE_X_PRIZES(store, state, player, 1);
            }
          });
          return;
        }
        DRAW_CARDS(store, state, player, 1);
      }, GameMessage.WANT_TO_USE_ABILITY);
    }

    // Hidden Power
    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_BURNED(store, state, effect);
        }
      });
    }

    return state;
  }
}
