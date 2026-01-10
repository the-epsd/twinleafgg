import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { AFTER_ATTACK, SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH } from '../../game/store/prefabs/prefabs';


export class Falinks extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.FIGHTING;  

  public hp: number = 90;

  public weakness = [{ type: CardType.PSYCHIC }];
  
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  
  public attacks = [{
    name: 'Call for Family',
    cost: [CardType.COLORLESS],
    damage: 0,
    text: 'Search your deck for up to 2 Basic Pokémon and put them onto your Bench. Then, shuffle your deck.'
  },
  {
    name: 'Team Attack',
    cost: [CardType.COLORLESS, CardType.COLORLESS],
    damage: 30,
    damageCalculation: 'x',
    text: 'This attack does 30 damage for each of your Benched pokemon that have "Falinks" in its name.'
  }];

  public set = 'RCL';

  public regulationMark = 'D';

  public cardImage: string = 'assets/cardback.png';

  public setNumber = '109';

  public name = 'Falinks';

  public fullName = 'Falinks RCL';

    public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (AFTER_ATTACK(effect, 0, this)) {
      SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH(store, state, effect.player, { superType: SuperType.POKEMON, stage: Stage.BASIC }, { min: 0, max: 2, allowCancel: false });
    }
    
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {

      const player = effect.player;

      // Count benched Pokémon that have "Falinks" in their name
      const Falinks = player.bench.filter(slot => {
        const c = slot.getPokemonCard();
        return c !== undefined && c.name.indexOf(this.name) !== -1;
      });
      const FalinksCount = Falinks.length;
      const damage = 30 * FalinksCount;
      effect.damage = damage;
    }
    return state;
  }
}