import { PlayerType, PokemonCardList, StateUtils } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Attack } from '../../game/store/card/pokemon-types';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class Onix extends PokemonCard {

  public name = 'Onix';

  public cardImage: string = 'assets/cardback.png';

  public set = 'BS';

  public cardType = CardType.FIGHTING;

  public setNumber = '56';

  public fullName = 'Onix BS';

  public stage = Stage.BASIC;

  public hp = 90;

  public weakness = [{ type: CardType.GRASS, value: 2 }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks: Attack[] = [
    {
      name: 'Rock Throw',
      cost: [CardType.FIGHTING],
      damage: 10,
      text: ''
    },
    {
      name: 'Harden',
      cost: [CardType.FIGHTING, CardType.FIGHTING],
      text: 'During your opponent\'s next turn, whenever 30 or less damage is done to Onix (after applying Weakness and Resistance), prevent that damage. (Any other effects of attacks still happen.)',
      damage: 0
    }
  ];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      player.marker.addMarker(PokemonCardList.DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER, this);
      opponent.marker.addMarker(PokemonCardList.CLEAR_DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER, this);
    }

    if (effect instanceof DealDamageEffect && effect.target.cards.includes(this) && effect.damage <= 30) {
      const player = effect.player;
      if (player.marker.hasMarker(PokemonCardList.DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER, this)) {
        effect.preventDefault = true;
        return state;
      }
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(PokemonCardList.CLEAR_DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER, this)) {
      effect.player.marker.removeMarker(PokemonCardList.CLEAR_DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER, this);

      const opponent = StateUtils.getOpponent(state, effect.player);
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
        cardList.marker.removeMarker(PokemonCardList.CLEAR_DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER, this);
      });
    }

    return state;
  }

}
