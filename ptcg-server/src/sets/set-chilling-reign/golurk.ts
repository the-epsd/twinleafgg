import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, TrainerType } from '../../game/store/card/card-types';
import { StoreLike, State, TrainerCard } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';

export class Golurk extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public cardType: CardType = CardType.PSYCHIC;
  public hp: number = 150;
  public weakness = [{ type: CardType.DARK }];
  public resistance = [{ type: CardType.FIGHTING, value: -30 }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];
  public evolvesFrom: string = 'Golett';

  public attacks = [{
    name: 'Reinforced Punch',
    cost: [CardType.PSYCHIC, CardType.COLORLESS, CardType.COLORLESS],
    damage: 60,
    text: 'If this Pokemon has a Pokemon Tool attached, this attack does 90 more damage.'
  }, {
    name: 'Megaton Fall',
    cost: [CardType.PSYCHIC, CardType.PSYCHIC, CardType.COLORLESS, CardType.COLORLESS],
    damage: 190,
    text: 'This Pokemon also does 30 damage to itself.'
  }];

  public regulationMark: string = 'E';
  public set: string = 'CRE';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Golurk';
  public fullName: string = 'Golurk CRE';
  public setNumber: string = '66';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      let pokemonToolCount = 0;
      
      player.active.cards.forEach(card => {
        if (card instanceof TrainerCard && card.trainerType === TrainerType.TOOL) {
          pokemonToolCount++;
        }
      });

      if (pokemonToolCount > 0) {
        effect.damage += 90;
      }

    }

    if(effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      const dealDamage = new DealDamageEffect(effect, 30);
      dealDamage.target = player.active;
      return store.reduceEffect(state, dealDamage);
    }

    return state;
  }
}