import { GameMessage, PlayerType, PokemonCardList, StateUtils } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Attack } from '../../game/store/card/pokemon-types';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { CoinFlipPrompt } from '../../game/store/prompts/coin-flip-prompt';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class Sandshrew extends PokemonCard {

  public name = 'Sandshrew';

  public cardImage: string = 'assets/cardback.png';

  public set = 'BS';

  public fullName = 'Sandshrew BS';

  public cardType = CardType.FIGHTING;

  public setNumber = '62';

  public stage = Stage.BASIC;

  public evolvesInto = ['Sandslash', 'Dark Sandslash'];

  public hp = 40;

  public weakness = [{ type: CardType.GRASS }];

  public resistance = [{ type: CardType.LIGHTNING, value: -30 }];

  public retreat = [CardType.COLORLESS];

  public attacks: Attack[] = [
    {
      name: 'Sand-attack',
      cost: [CardType.FIGHTING],
      damage: 10,
      text: 'If the Defending Pokémon tries to attack during your opponent\'s next turn, your opponent flips a coin. If tails, that attack does nothing.'
    }
  ];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      opponent.marker.addMarker(PokemonCardList.PREVENT_OPPONENTS_ACTIVE_FROM_ATTACKING_DURING_OPPONENTS_NEXT_TURN, this);
      opponent.marker.addMarker(PokemonCardList.CLEAR_PREVENT_OPPONENTS_ACTIVE_FROM_ATTACKING_DURING_OPPONENTS_NEXT_TURN, this);
    }

    if (effect instanceof AttackEffect && effect.target.marker.hasMarker(PokemonCardList.PREVENT_OPPONENTS_ACTIVE_FROM_ATTACKING_DURING_OPPONENTS_NEXT_TURN, this)) {
      return store.prompt(state, new CoinFlipPrompt(effect.player.id, GameMessage.COIN_FLIP), (heads) => {
        if (!heads) {
          effect.damage = 0;
        }
      });
    }

    if (effect instanceof AttackEffect && effect.player.active.marker.hasMarker(PokemonCardList.PREVENT_OPPONENTS_ACTIVE_FROM_ATTACKING_DURING_OPPONENTS_NEXT_TURN, this)) {
      return store.prompt(state, new CoinFlipPrompt(effect.player.id, GameMessage.COIN_FLIP), (heads) => {
        if (!heads) {
          effect.preventDefault = true;
        }
      });
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(PokemonCardList.CLEAR_PREVENT_OPPONENTS_ACTIVE_FROM_ATTACKING_DURING_OPPONENTS_NEXT_TURN, this)) {
      effect.player.marker.removeMarker(PokemonCardList.CLEAR_PREVENT_OPPONENTS_ACTIVE_FROM_ATTACKING_DURING_OPPONENTS_NEXT_TURN, this);

      const opponent = StateUtils.getOpponent(state, effect.player);
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
        opponent.marker.addMarker(PokemonCardList.PREVENT_OPPONENTS_ACTIVE_FROM_ATTACKING_DURING_OPPONENTS_NEXT_TURN, this);
        cardList.marker.removeMarker(PokemonCardList.CLEAR_PREVENT_OPPONENTS_ACTIVE_FROM_ATTACKING_DURING_OPPONENTS_NEXT_TURN, this);
      });
    }

    return state;
  }

}
