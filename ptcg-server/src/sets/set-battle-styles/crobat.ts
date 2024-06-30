import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, ConfirmPrompt, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { PowerEffect } from '../../game/store/effects/game-effects';

export class Crobat extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public regulationMark: string = 'E';
  public cardType: CardType = CardType.DARK;
  public hp: number = 130;
  public weakness = [{ type: CardType.FIGHTING }];
  public retreat = [];
  public evolvesFrom = 'Golbat';

  public powers = [{
    name: 'Drastic Draw',
    powerType: PowerType.ABILITY,
    text: 'When you play this Pokemon from your hand to evolve 1 of your Pokemon during your turn, you may draw 3 cards.'
  }];

  public attacks = [{
    name: 'Wing Attack',
    cost: [CardType.COLORLESS, CardType.COLORLESS],
    damage: 100,
    text: ''
  }];

  public set: string = 'BST';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '91';
  public name: string = 'Crobat';
  public fullName: string = 'Crobat BST';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
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
          player.deck.moveTo(player.hand, 3);
        }
      });
      return state;
    }
    return state;
  }

}