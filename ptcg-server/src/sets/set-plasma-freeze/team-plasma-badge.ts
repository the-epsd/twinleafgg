import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType, CardTag } from '../../game/store/card/card-types';
import { PlayerType, StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CheckTableStateEffect } from '../../game/store/effects/check-effects';
import { IS_TOOL_BLOCKED } from '../../game/store/prefabs/prefabs';
import { PokemonCard } from '../../game/store/card/pokemon-card';

export class TeamPlasmaBadge extends TrainerCard {
  public trainerType: TrainerType = TrainerType.TOOL;
  public tags = [CardTag.TEAM_PLASMA];
  public set: string = 'PLF';
  public setNumber: string = '104';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Team Plasma Badge';
  public fullName: string = 'Team Plasma Badge PLF';
  public text: string = 'The Pokémon this card is attached to is a Team Plasma Pokémon.';

  private readonly injectedTeamPlasmaTags = new Map<number, PokemonCard>();

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof CheckTableStateEffect) {
      const activeBadgeTargets = new Set<number>();

      state.players.forEach(player => {
        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, pokemonCard) => {
          const hasBadge = cardList.tools.includes(this) && !IS_TOOL_BLOCKED(store, state, player, this);
          if (!hasBadge) {
            return;
          }

          activeBadgeTargets.add(pokemonCard.id);

          if (!pokemonCard.tags.includes(CardTag.TEAM_PLASMA)) {
            pokemonCard.tags.push(CardTag.TEAM_PLASMA);
            this.injectedTeamPlasmaTags.set(pokemonCard.id, pokemonCard);
          }
        });
      });

      for (const [id, pokemonCard] of this.injectedTeamPlasmaTags) {
        if (activeBadgeTargets.has(id)) {
          continue;
        }

        const idx = pokemonCard.tags.indexOf(CardTag.TEAM_PLASMA);
        if (idx !== -1) {
          pokemonCard.tags.splice(idx, 1);
        }
        this.injectedTeamPlasmaTags.delete(id);
      }
    }

    return state;
  }
}
