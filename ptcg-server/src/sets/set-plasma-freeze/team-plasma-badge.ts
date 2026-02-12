import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType, CardTag } from '../../game/store/card/card-types';
import { PlayerType, StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CheckTableStateEffect } from '../../game/store/effects/check-effects';
import { IS_TOOL_BLOCKED } from '../../game/store/prefabs/prefabs';

export class TeamPlasmaBadge extends TrainerCard {
  public trainerType: TrainerType = TrainerType.TOOL;
  public tags = [CardTag.TEAM_PLASMA];
  public set: string = 'PLF';
  public setNumber: string = '104';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Team Plasma Badge';
  public fullName: string = 'Team Plasma Badge PLF';
  public text: string = 'The Pokémon this card is attached to is a Team Plasma Pokémon.';

  public readonly TEAM_PLASMA_BADGE_MARKER = 'TEAM_PLASMA_BADGE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof CheckTableStateEffect) {
      const player = effect.player;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        const pokemonCard = cardList.getPokemonCard();
        if (!pokemonCard) { return; }

        const hasBadge = cardList.tools.includes(this) && !IS_TOOL_BLOCKED(store, state, player, this);
        const hasMarker = cardList.marker.hasMarker(this.TEAM_PLASMA_BADGE_MARKER, this);

        if (hasBadge && !pokemonCard.tags.includes(CardTag.TEAM_PLASMA)) {
          pokemonCard.tags.push(CardTag.TEAM_PLASMA);
          cardList.marker.addMarker(this.TEAM_PLASMA_BADGE_MARKER, this);
        } else if (!hasBadge && hasMarker) {
          const idx = pokemonCard.tags.indexOf(CardTag.TEAM_PLASMA);
          if (idx !== -1) {
            pokemonCard.tags.splice(idx, 1);
          }
          cardList.marker.removeMarker(this.TEAM_PLASMA_BADGE_MARKER, this);
        }
      });
    }

    return state;
  }
}
