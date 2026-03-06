import { CardType, Stage } from '../../game/store/card/card-types';
import { Effect } from '../../game/store/effects/effect';
import { PokemonCard, StoreLike, State, StateUtils, PlayerType, SlotType, ChoosePokemonPrompt, GameMessage, ConfirmPrompt } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { AFTER_ATTACK, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { DISCARD_UP_TO_X_TYPE_ENERGY_FROM_YOUR_POKEMON } from '../../game/store/prefabs/costs';

export class Metagross extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Metang';
  public hp: number = 170;
  public cardType: CardType = M;
  public weakness = [{ type: R }];
  public resistance = [{ type: G, value: -30 }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Bounce Back',
    cost: [M, M, C],
    damage: 60,
    text: 'Your opponent switches their Active Pokemon with 1 of their Benched Pokemon.'
  },
  {
    name: 'Metallic Hammer',
    cost: [M, M, M, C],
    damage: 150,
    damageCalculation: '+' as '+',
    text: 'You may discard 3 [M] Energy from this Pokemon. If you do, this attack does 150 more damage.'
  }];

  public regulationMark = 'J';
  public set: string = 'M4';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '59';
  public name: string = 'Metagross';
  public fullName: string = 'Metagross M4';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (AFTER_ATTACK(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const hasBench = opponent.bench.some(b => b.cards.length > 0);
      if (!hasBench) return state;
      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_SWITCH,
        PlayerType.TOP_PLAYER,
        [SlotType.BENCH],
        { allowCancel: false }
      ), result => {
        if (result && result.length > 0) {
          opponent.switchPokemon(result[0]);
        }
      });
    }
    if (WAS_ATTACK_USED(effect, 1, this) && effect instanceof AttackEffect) {
      const player = effect.player;
      const checkEnergy = new CheckProvidedEnergyEffect(player);
      checkEnergy.source = effect.source;
      state = store.reduceEffect(state, checkEnergy);
      const metalCount = checkEnergy.energyMap.filter(e =>
        e.provides.some((p: CardType) => p === CardType.METAL)
      ).length;
      if (metalCount >= 3) {
        return store.prompt(state, new ConfirmPrompt(
          player.id,
          GameMessage.WANT_TO_DISCARD_ENERGY
        ), confirm => {
          if (confirm) {
            effect.damage += 150;
            return DISCARD_UP_TO_X_TYPE_ENERGY_FROM_YOUR_POKEMON(
              store, state, effect, 3, CardType.METAL, 3, [SlotType.ACTIVE]
            );
          }
        });
      }
    }
    return state;
  }
}
