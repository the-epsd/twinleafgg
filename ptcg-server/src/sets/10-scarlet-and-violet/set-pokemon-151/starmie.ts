import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import {
  ChoosePokemonPrompt,
  GameMessage,
  PlayerType,
  PowerType,
  SlotType,
  State,
  StateUtils,
  StoreLike,
  PokemonCardList,
} from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { PlaceDamageCountersEffect } from '../../../game/store/effects/game-effects';
import { MOVE_POKEMON_OFF_BOARD, WAS_POWER_USED } from '../../../game/store/prefabs/prefabs';

export class Starmie extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Staryu';
  public cardType: CardType[] = [CardType.WATER];
  public hp: number = 90;
  public weakness = [{ type: CardType.LIGHTNING }];
  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Mysterious Comet',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: ' Once during your turn, you may put 2 damage counters on 1 of your opponent\'s Pokémon. If you placed any damage counters in this way, discard this Pokémon and all attached cards.'
  }];

  public attacks = [{
    name: 'Speed Attack',
    cost: [CardType.WATER, CardType.COLORLESS],
    damage: 50,
    text: ''
  }];

  public set: string = 'MEW';
  public regulationMark = 'G';
  public setNumber: string = '121';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Starmie';
  public fullName: string = 'Starmie MEW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Mysterious Comet — Ref: set-rebel-clash/flapple.ts (Apple Drop)
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { min: 1, max: 1, allowCancel: false },
      ), selected => {
        const targets = selected || [];
        if (targets.length === 0) {
          return;
        }

        const placeCounters = new PlaceDamageCountersEffect(
          player,
          targets[0],
          20,
          this,
          this.powers[0],
        );
        store.reduceEffect(state, placeCounters);

        if (!placeCounters.preventDefault) {
          const thisCardList = StateUtils.findCardList(state, this) as PokemonCardList;
          MOVE_POKEMON_OFF_BOARD(store, state, thisCardList, {
            pokemonDestination: player.discard,
            sourceCard: this,
          });
        }
      });
    }

    return state;
  }
}
