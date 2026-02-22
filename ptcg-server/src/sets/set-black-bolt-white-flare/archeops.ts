import { PokemonCard, Stage, CardType, State, StoreLike, PowerType, PlayerType, StateUtils, ChoosePokemonPrompt, SlotType, GameMessage, GameError } from '../../game';

import { CardTarget } from '../../game/store/actions/play-card-action';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { ABILITY_USED, DEVOLVE_POKEMON, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class Archeops extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Archen';
  public cardType: CardType = F;
  public hp: number = 140;
  public weakness = [{ type: G }];
  public retreat = [C];

  public powers = [{
    name: 'Primal Wings',
    powerType: PowerType.ABILITY,
    useWhenInPlay: true,
    text: 'Once during your turn, if this Pokémon is in the Active Spot, you may choose 1 of your opponent\'s Evolved Pokemon and devolve it by putting the highest Stage Evolution card on it into your opponent\'s hand.'
  }];

  public attacks = [
    {
      name: 'Rock Throw',
      cost: [F, C],
      damage: 100,
      text: ''
    }
  ];

  public regulationMark = 'I';
  public set: string = 'WHT';
  public setNumber: string = '51';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Archeops';
  public fullName: string = 'Archeops SV11W';

  public readonly PRIMAL_WINGS_MARKER = 'PRIMAL_WINGS_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: any): State {
    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.PRIMAL_WINGS_MARKER, this)) {
      effect.player.marker.removeMarker(this.PRIMAL_WINGS_MARKER, this);
    }

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const blocked: CardTarget[] = [];

      if (effect.player.marker.hasMarker(this.PRIMAL_WINGS_MARKER, this)) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      // Block all Pokémon that are not evolved (only Basic)
      let hasAnyEvolved = false;
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (list, card, target) => {
        const hasEvolution = list.cards.some(
          c => c instanceof PokemonCard && c.stage !== Stage.BASIC
        );
        if (hasEvolution) {
          hasAnyEvolved = true;
        } else {
          blocked.push(target);
        }
      });

      if (!hasAnyEvolved) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_EVOLVE,
        PlayerType.TOP_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { allowCancel: false, blocked }
      ), targets => {
        player.marker.addMarker(this.PRIMAL_WINGS_MARKER, this);
        ABILITY_USED(player, this);
        if (!targets || targets.length === 0) {
          return state;
        }
        DEVOLVE_POKEMON(store, state, targets[0], opponent.hand);
        return state;
      });
    }
    return state;
  }
}