import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardTag, CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { FLIP_UNTIL_TAILS_AND_COUNT_HEADS, MOVE_CARDS, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class TeamRocketsDiglett extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  protected _tags = [CardTag.TEAM_ROCKET];
  public hp: number = 60;
  public cardType: CardType[] = [F];
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [{
    name: 'Relentless Burrowing',
    cost: [F],
    damage: 0,
    text: 'Flip a coin until you get tails. For each heads, discard the top card of your opponent\'s deck.'
  }];

  public regulationMark = 'I';
  public set: string = 'ASC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '100';
  public name: string = 'Team Rocket\'s Diglett';
  public fullName: string = 'Team Rocket\'s Diglett ASC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Relentless Burrowing
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = effect.opponent;
      return FLIP_UNTIL_TAILS_AND_COUNT_HEADS(store, state, player, heads => {
        if (heads > 0) {
          MOVE_CARDS(store, state, opponent.deck, opponent.discard, {
            count: heads,
            sourceCard: this,
            sourceEffect: this.attacks[0],
          });
        }
      });
    }

    return state;
  }
}
