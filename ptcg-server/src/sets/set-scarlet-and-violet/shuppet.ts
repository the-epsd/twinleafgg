import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, GameMessage, CoinFlipPrompt, GameError } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PlayItemEffect } from '../../game/store/effects/play-card-effects';

export class Shuppet extends PokemonCard {

  public regulationMark = 'G';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 60;

  public weakness = [{ type: CardType.DARK }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Enveloping Shadow',
      cost: [CardType.PSYCHIC],
      damage: 10,
      text: 'Flip a coin. If heads, during your opponent\'s next turn, they can\'t play any Item cards from their hand.',
    }
  ];
  public set: string = 'SVI';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '87';

  public name: string = 'Shuppet';

  public fullName: string = 'Shuppet SVI';

  public readonly OPPONENT_CANNOT_PLAY_ITEM_CARDS_MARKER = 'OPPONENT_CANNOT_PLAY_ITEM_CARDS_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayItemEffect) {
      const player = effect.player;
      if (player.marker.hasMarker(this.OPPONENT_CANNOT_PLAY_ITEM_CARDS_MARKER, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.OPPONENT_CANNOT_PLAY_ITEM_CARDS_MARKER, this);
    }


    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], result => {
        if (result === true) {
          opponent.marker.addMarker(this.OPPONENT_CANNOT_PLAY_ITEM_CARDS_MARKER, this);
          effect.damage = 10;
        } else {
          effect.damage = 10;
        }
      });
    }
    return state;
  }
}