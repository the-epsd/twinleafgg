import { CardTag, CardType, GameError, GameMessage, PlayerType, PokemonCard, PokemonCardList, Power, PowerType, SlotType, Stage, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class Meowscarada extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Floragato';
  public cardType: CardType = G;
  public hp: number = 160;
  public weakness = [{ type: R }];
  public retreat = [C];

  public powers: Power[] = [{
    name: 'Showtime',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, you may use this Ability. If this Pokémon is on the Bench, switch it with your Active Pokémon.',
  }];

  public attacks = [{
    name: 'Rising Bloom',
    cost: [C, C],
    damage: 90,
    damageCalculation: '+',
    text: 'If your opponent\'s Active Pokémon is a Pokémon ex, this attack does 90 more damage.'
  }];

  public regulationMark: string = 'I';
  public set: string = 'JTG';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '18';
  public name: string = 'Meowscarada';
  public fullName: string = 'Meowscarada JTG';

  public SHOWTIME_MARKER = 'SHOWTIME_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      if (player.marker.hasMarker(this.SHOWTIME_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }
      let bench: PokemonCardList | undefined;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        if (card === this && target.slot === SlotType.BENCH) {
          bench = cardList;
        }
      });

      if (bench === undefined) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      player.marker.addMarker(this.SHOWTIME_MARKER, this);
      player.switchPokemon(bench);
      return state;
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const opponentActive = opponent.active.getPokemonCard() as PokemonCard;
      if (opponentActive.tags.includes(CardTag.POKEMON_ex)) {
        effect.damage += 90;
      }
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.SHOWTIME_MARKER, this);
    }

    return state;
  }
}