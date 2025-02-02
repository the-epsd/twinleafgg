import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, ConfirmPrompt, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Golbat extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public regulationMark: string = 'E';
  public cardType: CardType = CardType.DARK;
  public hp: number = 80;
  public weakness = [{ type: CardType.FIGHTING }];
  public retreat = [CardType.COLORLESS];
  public evolvesFrom = 'Zubat';

  public powers = [{
    name: 'Discreet Draw',
    powerType: PowerType.ABILITY,
    text: 'When you play this Pokemon from your hand to evolve 1 of your Pokemon during your turn, you may draw 2 cards.'
  }];

  public attacks = [{
    name: 'Air Slash',
    cost: [CardType.COLORLESS, CardType.COLORLESS],
    damage: 50,
    text: 'Discard an Energy from this Pokemon.'
  }];

  public set: string = 'BST';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '90';
  public name: string = 'Golbat';
  public fullName: string = 'Golbat BST';

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
          player.deck.moveTo(player.hand, 2);
        }
      });
      return state;
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(state, effect, store, CardType.COLORLESS, 1);
    }
    return state;
  }

}