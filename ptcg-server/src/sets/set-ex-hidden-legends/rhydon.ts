import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { PowerType } from '../../game/store/card/pokemon-types';
import { StateUtils } from '../../game/store/state-utils';
import { PlayerType } from '../../game/store/actions/play-card-action';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { CheckPokemonPowersEffect } from '../../game/store/effects/check-effects';
import { IS_POKEBODY_BLOCKED, THIS_ATTACK_DOES_X_MORE_DAMAGE, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Rhydon extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Rhyhorn';
  public cardType: CardType = F;
  public hp: number = 90;
  public weakness = [{ type: W }];
  public retreat = [C, C];

  public powers = [{
    name: 'Power Diffusion',
    powerType: PowerType.POKEBODY,
    text: 'As long as Rhydon is your Active Pokémon, prevent all damage done by attacks to all of your Benched Pokémon.'
  }];

  public attacks = [{
    name: 'Horn Drill',
    cost: [C],
    damage: 20,
    text: ''
  },
  {
    name: 'Hyper Tail',
    cost: [F, C, C],
    damage: 50,
    damageCalculation: '+',
    text: 'If the Defending Pokémon has any Poké-Powers or Poké-Bodies, this attack does 50 damage plus 20 more damage.'
  }];

  public set: string = 'HL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '46';
  public name: string = 'Rhydon';
  public fullName: string = 'Rhydon HL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PutDamageEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (effect.target === player.active || effect.target === opponent.active) {
        return state;
      }

      const targetPlayer = StateUtils.findOwner(state, effect.target);

      let isRhydonActive = false;
      targetPlayer.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this && cardList === targetPlayer.active) {
          isRhydonActive = true;
        }
      });

      if (!isRhydonActive) {
        return state;
      }

      if (IS_POKEBODY_BLOCKED(store, state, targetPlayer, this)) {
        return state;
      }

      effect.preventDefault = true;
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const opponentActivePokemon = opponent.active.getPokemonCard();

      if (opponentActivePokemon) {
        const powersEffect = new CheckPokemonPowersEffect(opponent, opponentActivePokemon);
        state = store.reduceEffect(state, powersEffect);
        if (powersEffect.powers.some(power => power.powerType === PowerType.POKEBODY || power.powerType === PowerType.POKEPOWER)) {
          THIS_ATTACK_DOES_X_MORE_DAMAGE(effect, store, state, 20);
        }
      }
    }

    return state;
  }

}
