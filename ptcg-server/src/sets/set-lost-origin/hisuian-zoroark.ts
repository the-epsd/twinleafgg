import { Card, ChooseCardsPrompt, GameError, GameMessage, State, StateUtils, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';


export class HisuianZoroark extends PokemonCard {

  public regulationMark = 'F';

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Hisuian Zorua';

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 120;

  public weakness = [{ type: CardType.DARK }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Doom Curse',
      cost: [],
      damage: 0,
      text: 'At the end of your opponent\'s next turn, the Defending Pokémon will be Knocked Out.'
    },
    {
      name: 'Call Back',
      cost: [CardType.PSYCHIC],
      damage: 0,
      text: 'Put a card from your discard pile into your hand.'
    }
  ];
  public set: string = 'LOR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '76';

  public name: string = 'Hisuian Zoroark';

  public fullName: string = 'Hisuian Zoroark LOR';

  public readonly KNOCKOUT_MARKER = 'KNOCKOUT_MARKER';
  public readonly CLEAR_KNOCKOUT_MARKER = 'CLEAR_KNOCKOUT_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      effect.player.marker.addMarker(this.KNOCKOUT_MARKER, this);
      opponent.active.marker.addMarker(this.CLEAR_KNOCKOUT_MARKER, this);
      console.log('first marker added');
    }

    if (effect instanceof EndTurnEffect && effect.player.active.marker.hasMarker(this.CLEAR_KNOCKOUT_MARKER, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      effect.player.active.damage = 999;
      effect.player.active.marker.removeMarker(this.CLEAR_KNOCKOUT_MARKER, this);
      opponent.marker.removeMarker(this.KNOCKOUT_MARKER, this);
      console.log('clear marker added');
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      const hasCardInDiscard = player.discard.cards.some(c => {
        return c instanceof Card;
      });
      if (!hasCardInDiscard) {
        throw new GameError(GameMessage.CANNOT_USE_ATTACK);
      }

      return store.prompt(state, [
        new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARD_TO_HAND,
          player.discard,
          {},
          { min: 1, max: 1, allowCancel: false }
        )], selected => {
          const cards = selected || [];
          player.discard.moveCardsTo(cards, player.hand);
        });
    }
    return state;
  }
}