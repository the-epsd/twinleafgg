import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, ChoosePokemonPrompt, PlayerType, SlotType, GameError, PowerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PlaceDamageCountersEffect } from '../../game/store/effects/game-effects';
import { GameMessage } from '../../game/game-message';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { ABILITY_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class Inteleon extends PokemonCard {

  public tags = [CardTag.RAPID_STRIKE];

  public regulationMark = 'E';

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Drizzile';

  public cardType: CardType = CardType.WATER;

  public hp: number = 150;

  public weakness = [{ type: CardType.LIGHTNING }];

  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Quick Shooting',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, you may put 2 damage counters on 1 of your opponent\'s Pokémon.'
  }];

  public attacks = [
    {
      name: 'Waterfall',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: 70,
      text: ''
    }
  ];

  public set: string = 'CRE';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '43';

  public name: string = 'Inteleon';

  public fullName: string = 'Inteleon CRE';

  public readonly QUICK_SHOOTING_MARKER = 'QUICK_SHOOTING_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.QUICK_SHOOTING_MARKER, this);
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.QUICK_SHOOTING_MARKER, this)) {
      const player = effect.player;
      player.marker.removeMarker(this.QUICK_SHOOTING_MARKER, this);
    }

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      if (player.marker.hasMarker(this.QUICK_SHOOTING_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { min: 1, max: 1, allowCancel: false },

      ), selected => {
        const targets = selected || [];

        if (targets.length > 0) {
          const placeCountersEffect = new PlaceDamageCountersEffect(player, targets[0], 20, this);
          state = store.reduceEffect(state, placeCountersEffect);
        }

        player.marker.addMarker(this.QUICK_SHOOTING_MARKER, this);
        ABILITY_USED(player, this);
      });
    }

    return state;
  }
}