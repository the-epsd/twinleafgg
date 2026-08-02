import { CardType, PokemonCard, Stage, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { DEFENDING_POKEMON_CANNOT_ATTACK, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Conkeldurr extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Gurdurr';
  public cardType: CardType = F;
  public hp: number = 160;
  public weakness = [{ type: P }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Hammer Pressure',
    cost: [F, C, C],
    damage: 90,
    text: 'If the Defending Pokémon is an Evolution Pokémon, it can\'t attack during your opponent\'s next turn.'
  },
  {
    name: 'Mega Punch',
    cost: [F, F, C, C],
    damage: 150,
    text: ''
  }];

  public regulationMark: string = 'E';
  public set: string = 'BST';
  public setNumber: string = '75';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Conkeldurr';
  public fullName: string = 'Conkeldurr BST';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Hammer Pressure
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const defending = effect.opponent.active.getPokemonCard();
      if (defending && defending.stage !== Stage.BASIC) {
        return DEFENDING_POKEMON_CANNOT_ATTACK(store, state, effect, this);
      }
    }

    return state;
  }
}
