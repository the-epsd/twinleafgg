import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class AurasLucario2 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.AURAS];
  public cardType: CardType = M;
  public hp: number = 70;
  public weakness = [{ type: R }];
  public resistance = [{ type: G, value: -30 }];
  public retreat = [C];

  public attacks = [{
    name: 'Intimidation Wave',
    cost: [M],
    damage: 10,
    text: 'If the Defending Pokémon is a Basic Pokémon, choose 1 of the Defending Pokémon\'s attacks.That Pokémon can\'t use that attack during your opponent\'s next turn.'
  },
  {
    name: 'Bite',
    cost: [C, C, C],
    damage: 30,
    text: ''
  }];

  public set: string = 'PCGP';
  public name: string = 'Aura\'s Lucario';
  public fullName: string = 'Aura\'s Lucario PCGP 90';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '90';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const pokemonCard = effect.opponent.active.getPokemonCard();

      if (pokemonCard === undefined || pokemonCard.attacks.length === 0 || pokemonCard.stage !== Stage.BASIC) {
        return state;
      }

      return OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK(store, state, effect, this);
    }

    return state;
  }
}
