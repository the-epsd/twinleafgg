import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike, State, GameError, GameMessage, StateUtils, Card, ChooseCardsPrompt, CardList } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { AttackEffect, RetreatEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';


export class Scovillainex extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Capsakid';

  public cardType: CardType = CardType.GRASS;

  public hp: number = 260;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Spicy Bind',
      cost: [ CardType.COLORLESS ],
      damage: 0,
      text: 'Your opponent\'s Active Pokémon is now Burned. The Defending Pokémon can\'t retreat during your opponent\'s next turn.'
    },
    {
      name: 'Raging Flames',
      cost: [ CardType.GRASS, CardType.GRASS ],
      damage: 140,
      text: 'Discard a random card from your opponent\'s hand. Discard the top card of your opponent\'s deck.'
    }
  ];

  public regulationMark = 'G';
  
  public set2: string = 'svpromo';
  
  public setNumber: string = '89';
  
  public set = 'SV4';

  public name: string = 'Scovillain ex';

  public fullName: string = 'Scovillain ex SV4';

  public readonly SPICY_BIND_MARKER = 'SPICY_BIND_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.BURNED]);
      store.reduceEffect(state, specialConditionEffect);

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      opponent.active.marker.addMarker(this.SPICY_BIND_MARKER, this);
    }
  
    if (effect instanceof RetreatEffect && effect.player.active.marker.hasMarker(this.SPICY_BIND_MARKER, this)) {
      throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
    }
  
    if (effect instanceof EndTurnEffect) {
      effect.player.active.marker.removeMarker(this.SPICY_BIND_MARKER, this);
    }


    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let cards: Card[] = [];
      store.prompt(state, new ChooseCardsPrompt(
        player.id,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        opponent.hand,
        {},
        { min: 1, max: 1, allowCancel: false }
      ), selected => {
        cards = selected || [];
        effect.opponent.hand.moveCardsTo(cards, effect.opponent.discard);

        const deckTop = new CardList();
        opponent.deck.moveTo(deckTop, 1);

        deckTop.moveTo(opponent.discard);
      });
    }
    return state;
  }
}