import { CardType, PlayerType, PokemonCard, PowerType, Stage, State, StateUtils, StoreLike } from '../../game';
import { CheckPokemonPowersEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { PlaceDamageCountersEffect } from '../../game/store/effects/game-effects';
import { BetweenTurnsEffect } from '../../game/store/effects/game-phase-effects';
import { IS_POKEBODY_BLOCKED, THIS_ATTACK_DOES_X_DAMAGE_TO_EACH_OF_YOUR_OPPONENTS_POKEMON, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Weezing extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Koffing';
  public cardType: CardType = G;
  public hp: number = 70;
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public powers = [{
    name: 'Body Odor',
    powerType: PowerType.POKEBODY,
    text: 'As long as Weezing is the Active Pokémon, put 1 damage counter on each of your opponent\'s Pokémon that has any Poké-Bodies between turns.'
  }];

  public attacks = [{
    name: 'Mist Attack',
    cost: [G],
    damage: 0,
    text: 'Does 10 damage to each of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  },
  {
    name: 'Sludge Whirlpool',
    cost: [G, C, C],
    damage: 50,
    text: ''
  }];

  public set = 'DS';
  public setNumber = '33';
  public cardImage = 'assets/cardback.png';
  public name = 'Weezing';
  public fullName = 'Weezing DS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof BetweenTurnsEffect && effect.player.active.getPokemonCard() === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (IS_POKEBODY_BLOCKED(store, state, player, this)) {
        return state;
      }

      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card) => {
        const powersEffect = new CheckPokemonPowersEffect(opponent, card);
        state = store.reduceEffect(state, powersEffect);
        if (powersEffect.powers.some(power => power.powerType === PowerType.POKEBODY)) {
          const placeCountersEffect = new PlaceDamageCountersEffect(opponent, cardList, 10, this);
          state = store.reduceEffect(state, placeCountersEffect);
        }
      });
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      THIS_ATTACK_DOES_X_DAMAGE_TO_EACH_OF_YOUR_OPPONENTS_POKEMON(10, effect, store, state);
    }

    return state;
  }
}