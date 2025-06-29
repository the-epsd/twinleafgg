import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { COIN_FLIP_PROMPT, DRAW_CARDS, MOVE_CARDS, SHUFFLE_DECK, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';

export class Exeggutor extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Exeggcute';
  public cardType: CardType = P;
  public hp: number = 80;
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Psychic Exchange',
    cost: [C],
    damage: 0,
    text: 'Shuffle your hand into your deck. Draw up to 8 cards.'
  },
  {
    name: 'Big Eggsplosion',
    cost: [P, C],
    damage: 40,
    damageCalculation: 'x',
    text: 'Flip a coin for each Energy attached to Exeggutor. This attack does 40 damage times the number of heads.'
  }];

  public set: string = 'RG';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '5';
  public name: string = 'Exeggutor';
  public fullName: string = 'Exeggutor RG';

  public reduceEffect(store: StoreLike, state: State, effect: AttackEffect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      MOVE_CARDS(store, state, player.hand, player.deck, { cards: player.hand.cards.filter(c => c !== this) });
      SHUFFLE_DECK(store, state, player);
      DRAW_CARDS(player, 8);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player, player.active);
      store.reduceEffect(state, checkProvidedEnergyEffect);

      // Count only energies that provide [W]
      let energyCount = 0;
      checkProvidedEnergyEffect.energyMap.forEach(em => {
        energyCount++;
      });

      effect.damage = 0;
      for (let i = 0; i < energyCount; i++) {
        COIN_FLIP_PROMPT(store, state, player, result => {
          if (result) {
            effect.damage += 40;
          }
        });
      }
    }

    return state;
  }
}