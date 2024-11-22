import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike, State, ChooseCardsPrompt, GameError, GameMessage, Card, PowerType } from '../../game';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';

export class GalarianArticunoV extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public regulationMark = 'E';

  public cardType: CardType = CardType.PSYCHIC;

  public tags = [ CardTag.POKEMON_V ];

  public hp: number = 210;

  public weakness = [{ type: CardType.DARK }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public powers = [
    {
      name: 'Reconstitute',
      useWhenInPlay: true,
      powerType: PowerType.ABILITY,
      text: 'You must discard 2 cards from your hand in order to use this Ability. Once during your turn, you may draw a card.'
    }
  ];

  public attacks = [
    {
      name: 'Psyray',
      cost: [ CardType.PSYCHIC, CardType.COLORLESS, CardType.COLORLESS ],
      damage: 110,
      text: 'Your opponent\'s Active Pokémon is now Confused.'
    }
  ];

  public set: string = 'CRE';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '58';

  public name: string = 'Galarian Articuno V';

  public fullName: string = 'Galarian Articuno V CRE';

  public readonly CONCEALED_CARDS_MARKER = 'CONCEALED_CARDS_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.CONCEALED_CARDS_MARKER, this);
    }
    
    if (effect instanceof EndTurnEffect) {
      const player = effect.player;
      player.marker.removeMarker(this.CONCEALED_CARDS_MARKER, this);
    }


    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
        
      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.CONFUSED]);
      store.reduceEffect(state, specialConditionEffect);
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      const hasCardInHand = player.hand.cards.some(c => {
        return c instanceof Card;
      });
      if (!hasCardInHand) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      if (player.marker.hasMarker(this.CONCEALED_CARDS_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }
      state = store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        player.hand,
        { },
        { allowCancel: true, min: 2, max: 2 }
      ), cards => {
        cards = cards || [];
        if (cards.length === 0) {
          return;
        }
        player.marker.addMarker(this.CONCEALED_CARDS_MARKER, this);
        player.hand.moveCardsTo(cards, player.discard);
        player.deck.moveTo(player.hand, 1);
          
  
      });
  
      return state;
    }
    return state;
  }
}