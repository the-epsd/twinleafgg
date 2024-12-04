import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, BoardEffect } from '../../game/store/card/card-types';
import { StoreLike, State, ConfirmPrompt, GameMessage, PlayerType } from '../../game';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { PowerType } from '../../game/store/card/pokemon-types';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { SpecialCondition } from '../../game/store/card/card-types';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';

export class CrobatV extends PokemonCard {

  public regulationMark = 'D';

  public tags = [CardTag.POKEMON_V];

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.DARK;

  public hp: number = 180;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Dark Asset',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'When you play this Pokémon from your hand onto your Bench during your turn, you may draw cards until you have 6 cards in your hand. You can\'t use more than 1 Dark Asset Ability each turn.'
  }];

  public attacks = [
    {
      name: 'Venomous Fang',
      cost: [CardType.DARK, CardType.COLORLESS],
      damage: 70,
      text: 'Your opponent\'s Active Pokémon is now Poisoned.'
    }
  ];

  public set: string = 'DAA';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '104';

  public name: string = 'Crobat V';

  public fullName: string = 'Crobat V DAA';

  public readonly DARK_ASSET_MARKER = 'DARK_ASSET_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof EndTurnEffect) {
      const player = effect.player;
      player.marker.removeMarker(this.DARK_ASSET_MARKER, this);
    }

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      if (player.marker.hasMarker(this.DARK_ASSET_MARKER, this)) {
        return state;
      }

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const stub = new PowerEffect(player, {
          name: 'test',
          powerType: PowerType.ABILITY,
          text: ''
        }, this);
        store.reduceEffect(state, stub);
      } catch {
        return state;
      }
      state = store.prompt(state, new ConfirmPrompt(
        effect.player.id,
        GameMessage.WANT_TO_USE_ABILITY,
      ), wantToUse => {
        if (wantToUse) {

          player.marker.addMarker(this.DARK_ASSET_MARKER, this);

          player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
            if (cardList.getPokemonCard() === this) {
              cardList.addBoardEffect(BoardEffect.ABILITY_USED);
            }
          });

          while (player.hand.cards.length < 6) {
            if (player.deck.cards.length === 0) {
              break;
            }
            player.deck.moveTo(player.hand, 1);
          }
        }

        if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
          const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.POISONED]);
          state = store.reduceEffect(state, specialConditionEffect);
        }
      });
    }

    return state;
  }
}
