import { GameMessage, PokemonCardList, PowerType, StateUtils } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { AbstractAttackEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { CONFIRMATION_PROMPT, IS_ABILITY_BLOCKED } from '../../game/store/prefabs/prefabs';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class Lucario extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Riolu';
  public cardType: CardType = F;
  public hp: number = 120;
  public weakness = [{ type: P }];
  public retreat = [C];

  public powers = [{
    name: 'Stance',
    powerType: PowerType.ABILITY,
    text: 'When you play this Pokémon from your hand to evolve 1 of your Pokémon during your turn, you may prevent all effects of your opponent\'s attacks, including damage, done to this Pokémon until the end of your opponent\'s next turn.'
  }];

  public attacks = [
    {
      name: 'Submarine Blow',
      cost: [F, F, F],
      damage: 120,
      text: ''
    }
  ];

  public set: string = 'BUS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '71';
  public name: string = 'Lucario';
  public fullName: string = 'Lucario BUS';

  public readonly STANCE_MARKER: string = 'STANCE_MARKER';
  public readonly CLEAR_STANCE_MARKER: string = 'CLEAR_STANCE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      CONFIRMATION_PROMPT(store, state, player, wantToUse => {
        if (wantToUse) {
          const cardList = StateUtils.findCardList(state, this) as PokemonCardList;
          cardList.marker.addMarker(this.STANCE_MARKER, this);
        }
      }, GameMessage.WANT_TO_USE_ABILITY);

      return state;
    }

    if (effect instanceof AbstractAttackEffect && effect.target.cards.includes(this) && effect.target.marker.hasMarker(this.STANCE_MARKER, this)) {
      effect.preventDefault = true;
      return state;
    }

    if (effect instanceof EndTurnEffect) {
      const player = effect.player;

      const cardList = StateUtils.findCardList(state, this) as PokemonCardList;
      const owner = StateUtils.findOwner(state, cardList);

      if (owner !== player) {
        cardList.marker?.removeMarker(this.STANCE_MARKER, this);
      }
    }

    return state;
  }

}
