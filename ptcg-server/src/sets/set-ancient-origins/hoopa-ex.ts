import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SuperType } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State, GameMessage, ConfirmPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { IS_ABILITY_BLOCKED, SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../game/store/prefabs/costs';
import { THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON } from '../../game/store/prefabs/attack-effects';

export class HoopaEX extends PokemonCard {

  public tags = [CardTag.POKEMON_EX];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 170;
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public powers = [{
    name: 'Scoundrel Ring',
    useWhenInPlay: false,
    powerType: PowerType.ABILITY,
    text: 'When you play this Pokémon from your hand onto your Bench, you may search your deck for up to 3 Pokémon-EX (except for Hoopa-EX), reveal them, and put them into your hand. Shuffle your deck afterward.'
  }];

  public attacks = [{
    name: 'Hyperspace Fury',
    cost: [P, P, P],
    damage: 0,
    text: 'Discard 2 Energy attached to this Pokémon. This attack does 100 damage to 1 of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  }];

  public set: string = 'AOR';
  public setNumber: string = '36';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Hoopa-EX';
  public fullName: string = 'Hoopa EX AOR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Scoundrel Ring
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this && !IS_ABILITY_BLOCKED(store, state, effect.player, this)) {
      state = store.prompt(state, new ConfirmPrompt(
        effect.player.id,
        GameMessage.WANT_TO_USE_ABILITY,
      ), wantToUse => {
        if (wantToUse) {
          const player = effect.player;
          const blocked: number[] = [];
          player.deck.cards.forEach((c, index) => {
            if (!(c instanceof PokemonCard && c.tags.includes(CardTag.POKEMON_EX) && c.name !== this.name)) {
              blocked.push(index);
            }
          });
          SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND(store, state, effect.player, { superType: SuperType.POKEMON }, { min: 0, max: 3, blocked });
        }
      });
      return state;
    }

    // Hyperspace Fury
    if (WAS_ATTACK_USED(effect, 0, this)) {
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 2);
      THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON(100, effect, store, state);
    }
    return state;
  }
}