import { EnergyCard, PlayerType, PowerType, State, StoreLike } from '../../game';
import { CardTag, CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { BREAK_RULE, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class XerneasBREAK extends PokemonCard {
  public stage: Stage = Stage.BREAK;
  public tags = [CardTag.BREAK];
  public evolvesFrom = 'Xerneas';
  public cardType: CardType = Y;
  public hp: number = 150;

  public powers = [
    {
      name: 'BREAK Evolution Rule',
      powerType: PowerType.BREAK_RULE,
      text: 'Xerneas BREAK retains the attacks, Abilities, Weakness, Resistance, and Retreat Cost of its previous Evolution.',
    },
  ];

  public attacks = [
    {
      name: 'Life Stream',
      cost: [Y, Y],
      damage: 20,
      damageCalculation: 'x',
      text: 'This attack does 20 damage times the amount of Energy attached to all of your Pokémon.',
    },
  ];

  public set: string = 'STS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '82';
  public name: string = 'Xerneas BREAK';
  public fullName: string = 'Xerneas BREAK STS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Life Stream
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      let energies = 0;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (card) => {
        const energyOnPokemon = card.cards.filter((c) => c instanceof EnergyCard);
        energies += energyOnPokemon.length;
      });

      effect.damage = energies * 20;
    }

    BREAK_RULE(effect, state, this);

    return state;
  }
}
