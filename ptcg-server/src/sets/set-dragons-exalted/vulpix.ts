import { Attack, CardType, PokemonCard, Stage, State, StoreLike, Weakness } from "../../game";
import { Effect } from "../../game/store/effects/effect";
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_BURNED } from "../../game/store/prefabs/attack-effects";
import { WAS_ATTACK_USED } from "../../game/store/prefabs/prefabs";

export class Vulpix extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public cardType: CardType = R;
  public hp: number = 60;
  public weakness: Weakness[] = [{ type: W }];
  public retreat: CardType[] = [C];

  public attacks: Attack[] = [
    { name: 'Singe', cost: [R], damage: 0, text: 'The Defending Pokémon is now Burned.' },
  ];

  public set: string = 'DRX';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '18';
  public name: string = 'Vulpix';
  public fullName: string = 'Vulpix DRX';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    
    if (WAS_ATTACK_USED(effect, 0, this)) {
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_BURNED(store, state, effect);
    }

    return state;
  }
}