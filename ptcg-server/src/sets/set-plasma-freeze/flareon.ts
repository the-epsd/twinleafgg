import { Attack, CardTag, CardType, PokemonCard, Stage, State, StoreLike, Weakness } from "../../game";
import { Effect } from "../../game/store/effects/effect";
import { THIS_POKEMON_DOES_DAMAGE_TO_ITSELF, WAS_ATTACK_USED } from "../../game/store/prefabs/prefabs";

export class Flareon extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Eevee';
  public tags: string[] = [CardTag.TEAM_PLASMA];
  public cardType: CardType = R;
  public hp: number = 100;
  public weakness: Weakness[] = [{ type: W }];
  public retreat: CardType[] = [C, C];

  public attacks: Attack[] = [
    {
      name: 'Vengeance',
      cost: [C, C],
      damage: 20,
      damageCalculation: '+',
      text: 'Does 10 more damage for each Pokémon in your discard pile.'
    },
    { name: 'Heat Tackle', cost: [R, C, C], damage: 90, text: 'This Pokémon does 10 damage to itself.' }
  ];

  public set: string = 'PLF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '12';
  public name: string = 'Flareon';
  public fullName: string = 'Flareon PLF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      let pokemonCount = 0;
      player.discard.cards.forEach(c => {
        if (c instanceof PokemonCard)
          pokemonCount += 1;
      });

      effect.damage += pokemonCount * 10;
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 10);
    }

    return state;
  }
}