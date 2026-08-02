import { GamePhase, Power, PowerType, SlotType, State, StoreLike } from '../../../game';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { PutDamageEffect } from '../../../game/store/effects/attack-effects';
import { Effect } from '../../../game/store/effects/effect';
import { CoinFlipEffect } from '../../../game/store/effects/play-card-effects';
import { PUT_X_DAMAGE_COUNTERS_IN_ANY_WAY_YOU_LIKE } from '../../../game/store/prefabs/attack-effects';
import { IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Dragapult extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Drakloak';
  public cardType: CardType = CardType.PSYCHIC;
  public hp: number = 150;
  public weakness = [{ type: CardType.DARK }];
  public resistance = [{ type: CardType.FIGHTING, value: -30 }];
  public retreat = [];

  public powers: Power[] = [{
    name: 'Infiltrator',
    useWhenInPlay: false,
    powerType: PowerType.ABILITY,
    text: 'If any damage is done to this Pokémon by attacks, flip a coin. If heads, prevent that damage.'
  }];

  public attacks = [{
    name: 'Phantom Force',
    cost: [CardType.PSYCHIC, CardType.PSYCHIC],
    damage: 120,
    text: 'Put 3 damage counters on your opponent\'s Benched Pokémon in any way you like.'
  }];

  public regulationMark = 'D';
  public set: string = 'RCL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '91';
  public name: string = 'Dragapult';
  public fullName: string = 'Dragapult RCL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PutDamageEffect && effect.target.cards.includes(this)) {
      const player = effect.player;
      const pokemonCard = effect.target.getPokemonCard();

      if (pokemonCard !== this || state.phase !== GamePhase.ATTACK) {
        return state;
      }

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      if (effect.damage <= 0) {
        return state;
      }

      const coinFlip = new CoinFlipEffect(player);
      store.reduceEffect(state, coinFlip);

      if (coinFlip.result === false) {
        return state;
      }

      effect.preventDefault = true;
      return state;
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      PUT_X_DAMAGE_COUNTERS_IN_ANY_WAY_YOU_LIKE(3, store, state, effect, [SlotType.BENCH]);
    }

    return state;
  }
}