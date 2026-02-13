import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { PlayerType, StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { WAS_ATTACK_USED, ADD_MARKER, HAS_MARKER, REMOVE_MARKER } from '../../game/store/prefabs/prefabs';

export class Ursaring extends PokemonCard {
  public tags = [CardTag.TEAM_PLASMA];
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Teddiursa';
  public cardType: CardType = C;
  public hp: number = 130;
  public weakness = [{ type: F }];
  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Adrenalash',
      cost: [C, C, C],
      damage: 50,
      text: 'During your next turn, each of this Pokémon\'s attacks does 50 more damage (before applying Weakness and Resistance).'
    },
    {
      name: 'Strength',
      cost: [C, C, C, C],
      damage: 80,
      text: ''
    }
  ];

  public set: string = 'PLB';
  public setNumber: string = '76';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Ursaring';
  public fullName: string = 'Ursaring PLB';

  public readonly ADRENALASH_MARKER = 'ADRENALASH_MARKER';
  public readonly CLEAR_ADRENALASH_MARKER = 'CLEAR_ADRENALASH_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Check for bonus damage on ANY attack from this Pokemon
    if (effect instanceof AttackEffect && effect.player.active.getPokemonCard() === this) {
      const player = effect.player;
      const cardList = player.active;
      if (HAS_MARKER(this.ADRENALASH_MARKER, cardList, this)) {
        effect.damage += 50;
      }
    }

    // Attack 1: Adrenalash - set marker for next turn bonus
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      ADD_MARKER(this.ADRENALASH_MARKER, player.active, this);
    }

    // Two-marker pattern: marker persists through our next turn, then is cleared
    if (effect instanceof EndTurnEffect) {
      const player = effect.player;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        if (cardList.getPokemonCard() === this) {
          if (HAS_MARKER(this.CLEAR_ADRENALASH_MARKER, cardList, this)) {
            REMOVE_MARKER(this.ADRENALASH_MARKER, cardList, this);
            REMOVE_MARKER(this.CLEAR_ADRENALASH_MARKER, cardList, this);
          } else if (HAS_MARKER(this.ADRENALASH_MARKER, cardList, this)) {
            ADD_MARKER(this.CLEAR_ADRENALASH_MARKER, cardList, this);
          }
        }
      });
    }

    return state;
  }
}
