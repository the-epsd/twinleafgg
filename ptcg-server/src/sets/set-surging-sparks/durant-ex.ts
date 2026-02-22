import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State, GameMessage, StateUtils, ConfirmPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { DEAL_MORE_DAMAGE_FOR_EACH_PRIZE_CARD_TAKEN, IS_ABILITY_BLOCKED, MOVE_CARDS, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Durantex extends PokemonCard {

  public tags = [CardTag.POKEMON_ex];

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = G;

  public hp: number = 190;

  public weakness = [{ type: R }];

  public retreat = [C, C];

  public powers = [{
    name: 'Sudden Shearing',
    useWhenInPlay: false,
    powerType: PowerType.ABILITY,
    text: 'When you play this Pokémon from your hand onto your Bench during your turn, you may discard the top card of your opponent\'s deck.'
  }];

  public attacks = [{
    name: 'Vengeful Crush',
    cost: [G, C, C],
    damage: 120,
    damageCalculation: '+',
    text: 'This attack does 30 more damage for each Prize card your opponent has taken.'
  }];

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
      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      state = store.prompt(state, new ConfirmPrompt(
        effect.player.id,
        GameMessage.WANT_TO_USE_ABILITY,
      ), wantToUse => {
        if (wantToUse) {
          MOVE_CARDS(store, state, opponent.deck, opponent.discard, { count: 1, sourceCard: this, sourceEffect: this.powers[0] });
        }
      });
      return state;
    }

    // Revenge Crush
    if (WAS_ATTACK_USED(effect, 0, this)) {
      DEAL_MORE_DAMAGE_FOR_EACH_PRIZE_CARD_TAKEN(effect, state, 30);
    }
    return state;
  }
}