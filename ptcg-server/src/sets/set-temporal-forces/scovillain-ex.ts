import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { BLOCK_RETREAT, BLOCK_RETREAT_IF_MARKER, MOVE_CARDS, REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_BURNED } from '../../game/store/prefabs/attack-effects';
import { MarkerConstants } from '../../game/store/markers/marker-constants';

export class Scovillainex extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Capsakid';
  public tags = [CardTag.POKEMON_ex];
  public cardType: CardType = G;
  public hp: number = 260;
  public weakness = [{ type: R }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Chili Snapper Bind',
      cost: [C],
      damage: 0,
      text: 'Your opponent\'s Active Pokémon is now Burned. The Defending Pokémon can\'t retreat during your opponent\'s next turn.'
    },
    {
      name: 'Two-Headed Crushing',
      cost: [G, G],
      damage: 140,
      text: 'Discard a random card from your opponent\'s hand. Discard the top card of your opponent\'s deck.'
    }
  ];

  public regulationMark = 'G';
  public set = 'TEF';
  public setNumber: string = '22';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Scovillain ex';
  public fullName: string = 'Scovillain ex TEF';

  public readonly DEFENDING_POKEMON_CANNOT_RETREAT_MARKER = 'DEFENDING_POKEMON_CANNOT_RETREAT_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_BURNED(store, state, effect);
      return BLOCK_RETREAT(store, state, effect, this);
    }

    BLOCK_RETREAT_IF_MARKER(effect, MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
    REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN(effect, MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (opponent.hand.cards.length > 0) {
        const randomIndex = Math.floor(Math.random() * opponent.hand.cards.length);
        const randomCard = opponent.hand.cards[randomIndex];
        opponent.hand.moveCardTo(randomCard, opponent.discard);
      }

      MOVE_CARDS(store, state, opponent.deck, opponent.discard, { count: 1, sourceCard: this, sourceEffect: this.attacks[1] });
    }
    return state;
  }
}