import { PokemonCard, CardTag, Stage, CardType, StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, DISCARD_TOP_X_OF_OPPONENTS_DECK, TERA_RULE, THIS_ATTACK_DOES_X_DAMAGE_TO_X_OF_YOUR_OPPONENTS_POKEMON } from '../../game/store/prefabs/prefabs';

export class Hydreigonex extends PokemonCard {

  public tags = [CardTag.POKEMON_ex, CardTag.POKEMON_TERA];
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Zweilous';
  public cardType: CardType = D;
  public hp: number = 330;
  public weakness = [{ type: G }];
  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Crashing Headbutt',
      cost: [D, C],
      damage: 200,
      text: 'Discard the top 3 cards of your opponent\'s deck.'
    },

    {
      name: 'Obsidian',
      cost: [P, D, M, C],
      damage: 130,
      text: 'This attack also does 130 damage to 2 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    }
  ];

  public regulationMark = 'H';
  public set: string = 'SSP';
  public setNumber: string = '119';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Hydreigon ex';
  public fullName: string = 'Hydreigon ex SSP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Tera
    TERA_RULE(effect, state, this);

    // Crashing Headbutt
    if (WAS_ATTACK_USED(effect, 0, this)) {
      DISCARD_TOP_X_OF_OPPONENTS_DECK(store, state, effect.player, 3, this, this.attacks[0]);
    }

    // Obsidian
    if (WAS_ATTACK_USED(effect, 1, this)) {
      THIS_ATTACK_DOES_X_DAMAGE_TO_X_OF_YOUR_OPPONENTS_POKEMON(130, effect, store, state, 2, 2);
    }

    return state;
  }
}