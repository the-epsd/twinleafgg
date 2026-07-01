import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../../game/store/card/card-types';
import { PlayerType, StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Zoroarkex extends PokemonCard {

  public tags = [CardTag.POKEMON_ex];
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Zorua';
  public cardType: CardType = D;
  public hp: number = 270;
  public weakness = [{ type: G }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Riotous Beating',
      cost: [D],
      damage: 20,
      damageCalculation: 'x',
      text: 'This attack does 20 damage times the number of Pokémon you have in play.'
    },
    {
      name: 'Slash Down',
      cost: [D, C, C],
      damage: 210,
      text: 'During your next turn, this Pokémon can\'t use Slash Down.'
    }
  ];

  public regulationMark = 'J';
  public set: string = 'MEZ';
  public setNumber: string = '7';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Zoroark ex';
  public fullName: string = 'Zoroark ex MEZ';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-shining-legends/zoroark-gx.ts (Riotous Beating)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      let pokemonInPlay = 0;
      effect.player.forEachPokemon(PlayerType.BOTTOM_PLAYER, () => { pokemonInPlay += 1; });
      effect.damage = 20 * pokemonInPlay;
    }

    // Ref: set-battle-styles/corviknight-v.ts (Sky Hurricane)
    if (WAS_ATTACK_USED(effect, 1, this)) {
      effect.player.active.cannotUseAttacksNextTurnPending.push('Slash Down');
    }

    return state;
  }
}
