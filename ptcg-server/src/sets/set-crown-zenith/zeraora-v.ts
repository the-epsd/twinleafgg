import { PokemonCard, Stage, CardType, CardTag, StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class ZeraoraV extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_V];
  public cardType: CardType = L;
  public hp: number = 210;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Claw Slash',
    cost: [L, C],
    damage: 50,
    text: ''
  },
  {
    name: 'Thunderous Bolt',
    cost: [L, L, C],
    damage: 190,
    text: 'During your next turn, this Pokémon can\'t attack.'
  }];

  public regulationMark = 'F';
  public set: string = 'CRZ';
  public name: string = 'Zeraora V';
  public fullName: string = 'Zeraora V CRZ';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '53';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Thunderous Bolt
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      player.active.cannotAttackNextTurnPending = true;
    }
    
    return state;
  }
}