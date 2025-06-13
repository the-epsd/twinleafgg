import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, GameError } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { DRAW_CARDS, SWITCH_ACTIVE_WITH_BENCHED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class BrocksZubat extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.BROCKS];
  public cardType: CardType = G;
  public hp: number = 30;
  public weakness = [{ type: P }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [];

  public attacks = [{
    name: 'Alert',
    cost: [C],
    damage: 0,
    text: 'Draw a card. Then, switch Brock\'s Zubat with 1 of your Benched Pokémon.You can\'t use this attack if your Bench is empty.'
  },
  {
    name: 'Wing Attack',
    cost: [C, C],
    damage: 20,
    text: ''
  }];

  public set: string = 'G1';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '24';
  public name: string = 'Brock\'s Zubat';
  public fullName: string = 'Brock\'s Zubat G1';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const playerBench = player.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);
      if (playerBench === 0) {
        throw new GameError(GameMessage.CANNOT_USE_ATTACK);
      }

      DRAW_CARDS(player, 1);
      SWITCH_ACTIVE_WITH_BENCHED(store, state, player);
    }

    return state;
  }
}