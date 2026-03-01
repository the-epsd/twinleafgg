import { Effect } from '../../game/store/effects/effect';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { PowerType, StoreLike, State, ConfirmPrompt, GameMessage } from '../../game';
import { PUT_THIS_POKEMON_AND_ALL_ATTACHED_CARDS_INTO_YOUR_HAND } from '../../game/store/prefabs/attack-effects';
import { ABILITY_USED, IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';


export class ShayminEx extends PokemonCard {

  public tags = [CardTag.POKEMON_EX];

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 110;

  public weakness = [{ type: CardType.LIGHTNING }];

  public resistance = [{ type: CardType.FIGHTING, value: -20 }];

  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Set Up',
    powerType: PowerType.ABILITY,
    text: 'When you put this Pokemon from your hand onto your Bench, ' +
      'you may draw cards until you have 6 cards in your hand.'
  }];

  public attacks = [
    {
      name: 'Sky Return',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: 30,
      text: 'Return this Pokemon and all cards attached to it to your hand.'
    }
  ];

  public set: string = 'ROS';

  public name: string = 'Shaymin-EX';

  public fullName: string = 'Shaymin EX ROS';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '77';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      const cards = player.hand.cards.filter(c => c !== this);
      const cardsToDraw = Math.max(0, 6 - cards.length);
      if (cardsToDraw === 0) {
        return state;
      }

      // Try to reduce PowerEffect, to check if something is blocking our ability
      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      return store.prompt(state, new ConfirmPrompt(
        effect.player.id,
        GameMessage.WANT_TO_USE_ABILITY,
      ), wantToUse => {
        if (wantToUse) {
          ABILITY_USED(player, this);
          player.deck.moveTo(player.hand, cardsToDraw);
        }
      });
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      PUT_THIS_POKEMON_AND_ALL_ATTACHED_CARDS_INTO_YOUR_HAND(store, state, effect);
      return state;
    }

    return state;
  }

}
