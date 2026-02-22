import { PokemonCard, Stage, CardType, StoreLike, State, GameMessage, PowerType, CoinFlipPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CheckRetreatCostEffect, CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { IS_POKEBODY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Lombre extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Lotad';
  public cardType: CardType = W;
  public hp: number = 70;
  public weakness = [{ type: L }];
  public retreat = [C];

  public powers = [{
    name: 'Aqua Lift',
    powerType: PowerType.POKEBODY,
    text: 'If Lombre has any [W] Energy attached to it, the Retreat Cost for Lombre is 0.'
  }];

  public attacks = [
    {
      name: 'Ambush',
      cost: [C, C],
      damage: 20,
      damageCalculation: '+',
      text: 'Flip a coin. If heads, this attack does 20 damage plus 20 more damage.'
    }
  ];

  public set: string = 'DX';
  public setNumber: string = '33';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Lombre';
  public fullName: string = 'Lombre DX';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Handle Aqua Lift Poké-Body
    if (effect instanceof CheckRetreatCostEffect && effect.player.active.cards.includes(this)) {
      const player = effect.player;
      const pokemonCard = player.active.getPokemonCard();

      if (pokemonCard !== this) {
        return state;
      }

      // Try to reduce PowerEffect, to check if something is blocking our ability
      if (IS_POKEBODY_BLOCKED(store, state, player, this)) {
        return state;
      }

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      // Check if there is any Water energy attached
      const hasWaterEnergy = checkProvidedEnergy.energyMap.some(energy =>
        energy.provides.includes(CardType.WATER) || energy.provides.includes(CardType.ANY)
      );

      if (hasWaterEnergy) {
        effect.cost = [];
      }
    }

    // Handle Ambush attack
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      // Flip a coin
      state = store.prompt(state, new CoinFlipPrompt(
        player.id,
        GameMessage.FLIP_COIN
      ), result => {
        if (result) {
          effect.damage += 20; // 20 base + 20 for heads
        }
        return state;
      });
    }

    return state;
  }
} 