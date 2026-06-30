import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { MEGA_EVOLUTION_END_TURN, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class MGardevoirEx2 extends PokemonCard {
  public tags = [CardTag.POKEMON_EX, CardTag.MEGA];
  public stage: Stage = Stage.MEGA;
  public evolvesFrom = 'Gardevoir-EX';
  public cardType: CardType = Y;
  public hp: number = 210;
  public weakness = [{ type: M }];
  public resistance = [{ type: D, value: -20 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Brilliant Arrow',
    cost: [Y, C, C],
    damage: 30,
    damageCalculation: 'x',
    text: 'This attack does 30 damage times the amount of [Y] Energy attached to all of your Pokémon.',
  }];

  public set: string = 'PRC';
  public name: string = 'M Gardevoir-EX';
  public fullName: string = 'M Gardevoir-EX2 PRC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '106';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    MEGA_EVOLUTION_END_TURN(store, state, effect, this);

    // Brilliant Arrow
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      let fairyEnergies = 0;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (card) => {
        const goodEnergy = card.cards.filter(
          (card) => card.superType === SuperType.ENERGY && card.name === 'Fairy Energy',
        );

        fairyEnergies += goodEnergy.length;
      });

      effect.damage = fairyEnergies * 30;
    }

    return state;
  }
}
