import { Attack, CardTag, CardType, PlayerType, PokemonCard, Stage, State, StoreLike, Weakness } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP, YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED } from '../../game/store/prefabs/attack-effects';
import { COIN_FLIP_PROMPT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class MeloettaEX extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public tags: string[] = [CardTag.POKEMON_EX];
  public cardType: CardType = P;
  public hp: number = 110;
  public weakness: Weakness[] = [{ type: P }];
  public retreat: CardType[] = [C];

  public attacks: Attack[] = [
    {
      name: 'Brilliant Voice',
      cost: [C, C],
      damage: 20,
      text: 'Flip a coin. If heads, the Defending Pokémon is now Asleep. If tails, the Defending Pokémon is now Confused.'
    },
    {
      name: 'Round',
      cost: [P, P, P],
      damage: 30,
      damageCalculation: 'x',
      text: 'Does 30 damage times the number of your Pokémon that have the Round attack.'
    },
  ];

  public set: string = 'LTR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = 'RC11';
  public name: string = 'Meloetta-EX';
  public fullName: string = 'Meloetta EX LTR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      state = COIN_FLIP_PROMPT(store, state, player, (result) => {
        if (result) {
          YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP(store, state, effect);
        } else {
          YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED(store, state, effect);
        }
      });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      let roundPokemon = 0;
      effect.player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card.attacks.some(attack => attack.name === 'Round')) {
          roundPokemon += 1;
        }
      });
      effect.damage = effect.attack.damage * roundPokemon;
    }

    return state;
  }
}