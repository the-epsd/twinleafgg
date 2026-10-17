import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, SpecialCondition, Stage } from '../../../game/store/card/card-types';
import { GameMessage, PowerType, State, StoreLike, SuperType } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { PlayPokemonEffect } from '../../../game/store/effects/play-card-effects';
import { COIN_FLIP_PROMPT, CONFIRMATION_PROMPT, IS_POKEPOWER_BLOCKED, SEARCH_DISCARD_PILE_FOR_CARDS_TO_HAND, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class UnownJ extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 50;
  public cardType: CardType[] = [P];
  public weakness = [{ type: P, value: +10 }];
  public retreat = [C];

  public powers = [{
    name: 'JUNK',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn, when you put Unown J from your hand onto your Bench, you may flip a coin. If heads, search your discard pile for a Trainer card, show it to your opponent, and put it into your hand.',
    useWhenInPlay: true
  }];

  public attacks = [{
    name: 'Hidden Power',
    cost: [P],
    damage: 10,
    text: 'Remove the Special Condition Asleep from the Defending Pokémon.'
  }];

  public set: string = 'LA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '76';
  public name: string = 'Unown [J]';
  public fullName: string = 'Unown [J] LA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // JUNK
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;

      if (IS_POKEPOWER_BLOCKED(store, state, player, this)) {
        return state;
      }

      CONFIRMATION_PROMPT(store, state, player, wantToUse => {
        if (!wantToUse) {
          return;
        }

        COIN_FLIP_PROMPT(store, state, player, result => {
          if (!result) {
            return;
          }
          SEARCH_DISCARD_PILE_FOR_CARDS_TO_HAND(
            store,
            state,
            player,
            this,
            { superType: SuperType.TRAINER },
            { min: 0, max: 1, allowCancel: false },
            this.powers[0],
          );
        });
      }, GameMessage.WANT_TO_USE_ABILITY);
    }

    // Hidden Power
    if (WAS_ATTACK_USED(effect, 0, this)) {
      effect.opponent.active.removeSpecialCondition(SpecialCondition.ASLEEP);
    }

    return state;
  }
}
