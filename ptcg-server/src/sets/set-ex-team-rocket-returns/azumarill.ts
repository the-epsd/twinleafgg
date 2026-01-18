import { Attack, CardType, CoinFlipPrompt, GameMessage, PokemonCard, Power, PowerType, Stage, State, StateUtils, StoreLike } from '../../game';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { EffectOfAbilityEffect } from '../../game/store/effects/game-effects';
import { ADD_PARALYZED_TO_PLAYER_ACTIVE, CONFIRMATION_PROMPT, IS_POKEPOWER_BLOCKED, JUST_EVOLVED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Azumarill extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Marill';
  public cardType: CardType = W;
  public hp: number = 80;
  public weakness = [{ type: L }];
  public retreat = [C];

  public powers: Power[] = [{
    name: 'Froth',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn, when you play Azumarill from your hand to evolve 1 of your Active Pokémon, you may use this power. Each Defending Pokémon is now Paralyzed.'
  }];

  public attacks: Attack[] = [{
    name: 'Water Punch',
    cost: [W, C],
    damage: 20,
    damageCalculation: '+',
    text: 'Flip a coin for each [W] Energy attached to Azumarill. This attack does 20 damage plus 20 more damage for each heads.'
  }];

  public set: string = 'TRR';
  public setNumber: string = '1';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Azumarill';
  public fullName: string = 'Azumarill TRR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (JUST_EVOLVED(effect, this) && !IS_POKEPOWER_BLOCKED(store, state, effect.player, this) && effect.target === effect.player.active) {
      CONFIRMATION_PROMPT(store, state, effect.player, result => {
        if (result) {
          const opponent = StateUtils.getOpponent(state, effect.player);
          const canApplyAbility = new EffectOfAbilityEffect(effect.player, this.powers[0], this, opponent.active);
          store.reduceEffect(state, canApplyAbility);
          if (canApplyAbility.target) {
            ADD_PARALYZED_TO_PLAYER_ACTIVE(store, state, opponent, this);
          }
        }
      });
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      // Count Water energy
      let waterEnergyCount = 0;
      checkProvidedEnergy.energyMap.forEach(energy => {
        if (energy.provides.includes(CardType.WATER) || energy.provides.includes(CardType.ANY)) {
          waterEnergyCount++;
        }
      });

      // Flip coins equal to Water energy count
      let heads = 0;
      for (let i = 0; i < waterEnergyCount; i++) {
        state = store.prompt(state, new CoinFlipPrompt(
          player.id,
          GameMessage.FLIP_COIN
        ), result => {
          if (result) {
            heads++;
          }
          if (i === waterEnergyCount - 1) {
            effect.damage = 20 + (20 * heads);
          }
          return state;
        });
      }
    }
    return state;
  }
}