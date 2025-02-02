import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, GameError, StateUtils, Card, ChooseCardsPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Unfezant extends PokemonCard {

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Tranquill';

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 150;

  public weakness = [{ type: CardType.LIGHTNING }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [];

  public attacks = [
    {
      name: 'Opposing Winds',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: 70,
      text: 'You may put 2 Energy attached to your opponent\'s Active Pokémon into their hand.'
    },
    {
      name: 'Boundless Power',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: 180,
      text: 'During your next turn, this Pokémon can\'t attack.'
    }
  ];

  public set: string = 'TEF';

  public setNumber = '135';

  public cardImage = 'assets/cardback.png';

  public regulationMark: string = 'H';

  public name: string = 'Unfezant';

  public fullName: string = 'Unfezant TEF';

  // for preventing the pokemon from attacking on the next turn
  public readonly ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
  public readonly ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Opposing Winds
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Check marker
      if (effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
        console.log('attack blocked');
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }

      let cards: Card[] = [];
      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        opponent.active,
        { superType: SuperType.ENERGY },
        { min: 0, max: 2, allowCancel: false },
      ), selected => {
        cards = selected || [];
        opponent.active.moveCardsTo(cards, opponent.hand);
      });
    }

    // Boundless Power
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {

      // Check marker
      if (effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
        console.log('attack blocked');
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
      effect.player.marker.addMarker(this.ATTACK_USED_MARKER, this);
      console.log('marker added');
    }

    // removing the markers for preventing the pokemon from attacking
    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.ATTACK_USED_2_MARKER, this)) {
      effect.player.marker.removeMarker(this.ATTACK_USED_MARKER, this);
      effect.player.marker.removeMarker(this.ATTACK_USED_2_MARKER, this);
      console.log('marker cleared');
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
      effect.player.marker.addMarker(this.ATTACK_USED_2_MARKER, this);
      console.log('second marker added');
    }

    return state;
  }
}