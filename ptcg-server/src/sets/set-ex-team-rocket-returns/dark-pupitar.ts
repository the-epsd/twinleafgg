import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { COIN_FLIP_PROMPT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED } from '../../game/store/prefabs/attack-effects';

export class DarkPupitar extends PokemonCard {
  public tags = [CardTag.DARK];
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Larvitar';
  public cardType: CardType = F;
  public additionalCardTypes = [D];
  public hp: number = 80;
  public weakness = [{ type: G }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Dark Streak',
      cost: [C, C],
      damage: 20,
      text: 'Flip a coin. If heads, each Defending Pokémon is now Paralyzed.'
    },
    {
      name: 'Rock Tumble',
      cost: [F, C, C],
      damage: 40,
      text: 'This attack\'s damage is not affected by Resistance.'
    }
  ];

  public set: string = 'TRR';
  public setNumber: string = '41';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Dark Pupitar';
  public fullName: string = 'Dark Pupitar TRR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Dark Streak
    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED(store, state, effect);
        }
      });
    }

    // Rock Tumble
    if (WAS_ATTACK_USED(effect, 1, this)) {
      effect.ignoreResistance = true;
    }

    return state;
  }
} 