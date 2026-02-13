import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { ADD_BURN_TO_PLAYER_ACTIVE, AFTER_ATTACK, COIN_FLIP_PROMPT, DISCARD_ALL_ENERGY_FROM_POKEMON, MOVE_CARDS, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Magmortar extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Magmar';
  public cardType: CardType = R;
  public hp: number = 100;
  public weakness = [{ type: W }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Top Burner',
    cost: [R],
    damage: 0,
    text: 'For each [R] Energy attached to Magmortar, discard the top card from your opponent\'s deck. Then, flip a coin. If tails, discard all [R] Energy attached to Magmortar.'
  },
  {
    name: 'Burst Punch',
    cost: [R, R, C],
    damage: 60,
    text: 'The Defending Pokémon is now Burned.'
  }];

  public set: string = 'TM';
  public setNumber: string = '27';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Magmortar';
  public fullName: string = 'Magmortar TM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      const totalPsychicEnergy = checkProvidedEnergy.energyMap.reduce((sum, energy) => {
        return sum + energy.provides.filter(type => type === CardType.FIRE || type === CardType.ANY).length;
      }, 0);

      MOVE_CARDS(store, state, opponent.deck, opponent.discard, { count: totalPsychicEnergy, sourceCard: this, sourceEffect: this.attacks[0] });

      COIN_FLIP_PROMPT(store, state, player, result => {
        if (!result) {
          DISCARD_ALL_ENERGY_FROM_POKEMON(store, state, effect, this);
        }
      });
    }

    if (AFTER_ATTACK(effect, 1, this)) {
      ADD_BURN_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
    }

    return state;
  }
}