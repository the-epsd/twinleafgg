import { PokemonCard, Stage, CardType, State, StoreLike, PowerType, GameError, GameMessage, SuperType, TrainerType, TrainerCard } from '../../game';

import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { HAS_MARKER, ABILITY_USED, ADD_MARKER, REMOVE_MARKER_AT_END_OF_TURN, SEARCH_DECK_FOR_CARDS_TO_HAND, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class Sawsbuck extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Deerling';
  public cardType: CardType = G;
  public hp: number = 130;
  public weakness = [{ type: R }];
  public retreat = [C, C];

  public powers = [{
    name: 'Changing Seasons',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, you may search your deck for a Stadium card, reveal it, and put it into your hand. Then, shuffle your deck.'
  }];

  public attacks = [{
    name: 'Superpowered Horns',
    cost: [G, C, C],
    damage: 110,
    text: ''
  }];

  public regulationMark = 'H';
  public set: string = 'TEF';
  public setNumber: string = '17';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Sawsbuck';
  public fullName: string = 'Sawsbuck TEF';

  public readonly CHANGING_SEASONS_MARKER = 'CHANGING_SEASONS_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: any): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      effect.player.marker.removeMarker(this.CHANGING_SEASONS_MARKER, this);
    }

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      if (HAS_MARKER(this.CHANGING_SEASONS_MARKER, player, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      ABILITY_USED(player, this);
      ADD_MARKER(this.CHANGING_SEASONS_MARKER, player, this);

      const blocked: number[] = [];
      player.deck.cards.forEach((card, index) => {
        if (!(card instanceof TrainerCard && card.trainerType === TrainerType.STADIUM)) {
          blocked.push(index);
        }
      });

      SEARCH_DECK_FOR_CARDS_TO_HAND(store, state, player, this, { superType: SuperType.TRAINER }, { min: 0, max: 1, allowCancel: false }, this.powers[0]);
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.CHANGING_SEASONS_MARKER, this);

    return state;
  }
}
