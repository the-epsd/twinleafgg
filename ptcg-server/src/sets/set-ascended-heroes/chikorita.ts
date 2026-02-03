import { PokemonCard, Stage, CardType, StoreLike, State, StateUtils } from "../../game";
import { Effect } from "../../game/store/effects/effect";
import { WAS_ATTACK_USED } from "../../game/store/prefabs/prefabs";

export class Chikorita extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 70;
  public weakness = [{ type: R }];
  public resistance = [];
  public retreat = [C];

  public attacks = [{
    name: 'Growl',
    cost: [C],
    damage: 0,
    text: 'During your opponent\'s next turn, attacks used by the Defending Pokémon do 20 less damage (before applying Weakness and Resistance).'
  },
  {
    name: 'Seed Bomb',
    cost: [G, G],
    damage: 30,
    text: ''
  }];

  public regulationMark = 'I';
  public set: string = 'ASC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '8';
  public name: string = 'Chikorita';
  public fullName: string = 'Chikorita MC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      opponent.active.damageReductionNextTurn = 20;
    }
    return state;
  }
}