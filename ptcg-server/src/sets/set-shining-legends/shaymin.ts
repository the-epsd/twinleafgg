import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { DRAW_CARDS, SHUFFLE_DECK, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { MarkerConstants } from '../../game/store/markers/marker-constants';

export class Shaymin extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 70;
  public weakness = [{ type: R }];
  public retreat = [C];

  public attacks = [{
    name: 'Flippity Flap',
    cost: [G],
    damage: 0,
    text: 'Shuffle your hand into your deck. Then, draw 6 cards.'
  },
  {
    name: 'Rally Back',
    cost: [G, C],
    damage: 30,
    damageCalculation: '+',
    text: 'If any of your Pokémon were Knocked Out by damage from an opponent\'s ' +
      'attack during their last turn, this attack does 90 more damage.'
  }];

  public set: string = 'SLG';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '7';
  public name: string = 'Shaymin';
  public fullName: string = 'Shaymin SLG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      //MOVE_CARDS(store, state, player.hand, player.deck, { cards: player.hand.cards });
      player.hand.moveTo(player.deck);
      SHUFFLE_DECK(store, state, player);
      DRAW_CARDS(player, 6);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      if (player.marker.hasMarker(MarkerConstants.REVENGE_MARKER)) {
        effect.damage += 90;
      }

      return state;
    }

    return state;
  }
}