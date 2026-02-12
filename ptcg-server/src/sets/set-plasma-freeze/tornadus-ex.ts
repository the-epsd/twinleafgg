import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, EnergyCard } from '../../game';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, SHUFFLE_DECK, DRAW_CARDS } from '../../game/store/prefabs/prefabs';

export class TornadusEx extends PokemonCard {
  public tags = [CardTag.POKEMON_EX, CardTag.TEAM_PLASMA];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 180;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Windfall',
      cost: [C],
      damage: 0,
      text: 'Shuffle your hand into your deck. Then, draw 6 cards.'
    },
    {
      name: 'Jet Blast',
      cost: [C, C, C, C],
      damage: 60,
      damageCalculation: '+' as '+',
      text: 'This attack does 30 more damage for each Plasma Energy attached to this Pokémon.'
    }
  ];

  public set: string = 'PLF';
  public setNumber: string = '98';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Tornadus-EX';
  public fullName: string = 'Tornadus-EX PLF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Attack 1: Windfall - shuffle hand into deck, draw 6
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      // Shuffle entire hand into deck
      const cards = player.hand.cards.slice();
      cards.forEach(c => {
        player.hand.moveCardTo(c, player.deck);
      });
      SHUFFLE_DECK(store, state, player);
      DRAW_CARDS(player, 6);
    }

    // Attack 2: Jet Blast - +30 per Plasma Energy attached
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      const checkEnergy = new CheckProvidedEnergyEffect(player);
      store.reduceEffect(state, checkEnergy);

      let plasmaEnergyCount = 0;
      checkEnergy.energyMap.forEach(em => {
        if (em.card instanceof EnergyCard && em.card.name === 'Plasma Energy') {
          plasmaEnergyCount++;
        }
      });

      effect.damage += 30 * plasmaEnergyCount;
    }

    return state;
  }
}
