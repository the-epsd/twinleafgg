import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../../game/store/card/card-types';
import { GameMessage, PowerType, StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { CONFIRMATION_PROMPT, DEFENDING_POKEMON_DOES_LESS_DAMAGE, IS_POKEPOWER_BLOCKED, JUST_EVOLVED, SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Meganium extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Bayleef';
  public tags = [CardTag.DELTA_SPECIES];
  public cardType: CardType = F;
  public hp: number = 110;
  public weakness = [{ type: R }];
  public resistance = [{ type: W, value: -30 }];
  public retreat = [C, C];

  public powers = [{
    name: 'Evolutionary Call',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn, when you play Meganium from your hand to evolve 1 of your Pokémon, you may search your deck for up to 3 in any combination of Basic Pokémon or Evolution cards. Show them to your opponent and put them into your hand. Shuffle your deck afterward.'
  }];

  public attacks = [{
    name: 'Delta Reduction',
    cost: [F, C],
    damage: 40,
    text: 'During your opponent\'s next turn, any damage done by attacks from the Defending Pokémon is reduced by 30 (before applying Weakness and Resistance).'
  },
  {
    name: 'Mega Impact',
    cost: [F, C, C],
    damage: 60,
    text: ''
  }];

  public set: string = 'DF';
  public name: string = 'Meganium';
  public fullName: string = 'Meganium DF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '4';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (JUST_EVOLVED(effect, this) && !IS_POKEPOWER_BLOCKED(store, state, effect.player, this)) {
      CONFIRMATION_PROMPT(store, state, effect.player, result => {
        if (result) {
          SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND(store, state, effect.player, {}, { min: 0, max: 3, allowCancel: false });
        }
      }, GameMessage.WANT_TO_USE_ABILITY);
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      return DEFENDING_POKEMON_DOES_LESS_DAMAGE(store, state, effect, this, 30);
    }

    return state;
  }

}
