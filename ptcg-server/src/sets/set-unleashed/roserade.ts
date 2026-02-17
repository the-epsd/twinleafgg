import { CardType, GameMessage, PokemonCard, PowerType, Stage, State, StateUtils, StoreLike } from '../../game';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttachEnergyEffect } from '../../game/store/effects/play-card-effects';
import { ADD_CONFUSION_TO_PLAYER_ACTIVE, ADD_POISON_TO_PLAYER_ACTIVE, CONFIRMATION_PROMPT, IS_POKEPOWER_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Roserade extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Roselia';
  public cardType: CardType = G;
  public hp: number = 90;
  public weakness = [{ type: R }];
  public retreat = [C];

  public powers = [{
    name: 'Energy Signal',
    useWhenInPlay: false,
    powerType: PowerType.POKEPOWER,
    text: 'When you attach a [G] Energy card or [P] Energy card from your hand to Roserade during your turn, you may use this power. If you attach a [G] Energy card, the Defending Pokémon is now Confused. If you attach a [P] Energy card, the Defending Pokémon is now Poisoned. This power can\'t be used if Roserade is affected by a Special Condition.'
  }];

  public attacks = [{
    name: 'Power Blow',
    cost: [G, C],
    damage: 20,
    damageCalculation: 'x',
    text: 'Does 20 damage times the amount of Energy attached to Roserade.'
  }];

  public set: string = 'UL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '23';
  public name: string = 'Roserade';
  public fullName: string = 'Roserade UL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const cardList = player.active;

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player, cardList);
      store.reduceEffect(state, checkProvidedEnergy);

      const energyCount = checkProvidedEnergy.energyMap.length;
      effect.damage = 20 * energyCount;
    }

    if (effect instanceof AttachEnergyEffect && effect.target.getPokemonCard() === this) {
      const player = effect.player;

      if (effect.target.specialConditions.length > 0) {
        return state;
      }

      if (IS_POKEPOWER_BLOCKED(store, state, player, this)) {
        return state;
      }

      if (effect.energyCard.name !== 'Grass Energy' && effect.energyCard.name !== 'Psychic Energy') {
        return state;
      }

      CONFIRMATION_PROMPT(store, state, player, result => {
        if (result) {
          if (effect.energyCard.name === 'Grass Energy') {
            ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, StateUtils.getOpponent(state, player), this);
          }
          if (effect.energyCard.name === 'Psychic Energy') {
            ADD_POISON_TO_PLAYER_ACTIVE(store, state, StateUtils.getOpponent(state, player), this);
          }
        }
      }, GameMessage.WANT_TO_USE_ABILITY);
    }

    return state;
  }
}