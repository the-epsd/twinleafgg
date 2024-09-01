import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';


export class Dragonair extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Dratini';

  public cardType: CardType = CardType.DRAGON;

  public hp: number = 90;

  public weakness = [{ type: CardType.FAIRY }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [{
    name: 'Dragon\'s Wish',
    cost: [CardType.COLORLESS],
    damage: 0,
    text: 'During your next turn, you may attach any number of Energy cards from your hand to your Pokémon.'
  }, {
    name: 'Tail Smack',
    cost: [CardType.GRASS, CardType.LIGHTNING, CardType.COLORLESS],
    damage: 60,
    text: ''
  }];

  public set: string = 'SUM';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '95';

  public name: string = 'Dragonair';

  public fullName: string = 'Dragonair SUM';

  public readonly DRAGONS_WISH_MARKER = 'DRAGONS_WISH_MARKER';
  public readonly DRAGONS_WISH_2_MARKER = 'DRAGONS_WISH_2_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof EndTurnEffect && effect.player.attackMarker.hasMarker(this.DRAGONS_WISH_2_MARKER, this)) {
      const player = effect.player;
      effect.player.attackMarker.removeMarker(this.DRAGONS_WISH_MARKER, this);
      effect.player.attackMarker.removeMarker(this.DRAGONS_WISH_2_MARKER, this);
      player.usedDragonsWish = false;
      console.log('marker cleared');
    }

    if (effect instanceof EndTurnEffect && effect.player.attackMarker.hasMarker(this.DRAGONS_WISH_MARKER, this)) {
      const player = effect.player;
      effect.player.attackMarker.addMarker(this.DRAGONS_WISH_2_MARKER, this);
      player.usedDragonsWish = true;
      console.log('second marker added');
    }
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      effect.player.attackMarker.addMarker(this.DRAGONS_WISH_MARKER, this);
      console.log('marker added');
    }
    return state;
  }
}