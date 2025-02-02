import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State, GameMessage, StateUtils, ConfirmPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';

export class Durantex extends PokemonCard {

  public tags = [CardTag.POKEMON_ex];

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = G;

  public hp: number = 190;

  public weakness = [{ type: R }];

  public retreat = [C, C];

  public powers = [{
    name: 'Sudden Scrape',
    useWhenInPlay: false,
    powerType: PowerType.ABILITY,
    text: 'When you play this Pokemon from your hand onto your Bench during your turn, you may use this ability. Discard the top card of your opponent\'s deck.'
  }];

  public attacks = [
    {
      name: 'Revenge Crush',
      cost: [G, C, C],
      damage: 120,
      text: 'This attack does 30 more damage for each Prize Card your opponent has taken.'
    }
  ];

  public regulationMark = 'H';

  public set: string = 'SSP';

  public setNumber: string = '4';

  public cardImage: string = 'assets/cardback.png';

  public name: string = 'Durant ex';

  public fullName: string = 'Durant ex SSP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Sudden Scrape
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

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
          opponent.deck.moveTo(opponent.discard, 1);
        }
      });
      return state;
    }

    // Revenge Crush
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      effect.damage += (6 - opponent.getPrizeLeft()) * 30;
    }
    return state;
  }
}