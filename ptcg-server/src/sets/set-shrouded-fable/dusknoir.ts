import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, ChoosePokemonPrompt, GameMessage, PlayerType, SlotType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PlaceDamageCountersEffect } from '../../game/store/effects/game-effects';
import { MarkerConstants } from '../../game/store/markers/marker-constants';
import { WAS_ATTACK_USED, BLOCK_RETREAT, BLOCK_RETREAT_IF_MARKER, REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class Dusknoir extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Dusclops';
  public cardType: CardType = P;
  public hp: number = 160;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Cursed Blast',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    knocksOutSelf: true,
    text: 'Once during your turn, you may put 13 damage counters on 1 of your opponent\'s Pokémon. If you placed any damage counters in this way, this Pokémon is Knocked Out.'
  }];

  public attacks = [{
    name: 'Shadow Bind',
    cost: [P, P, C],
    damage: 150,
    text: 'During your opponent\'s next turn, the Defending Pokémon can\'t retreat.'
  }];

  public regulationMark = 'H';
  public set: string = 'SFA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '20';
  public name: string = 'Dusknoir';
  public fullName: string = 'Dusknoir SFA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Cursed Blast
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.BENCH, SlotType.ACTIVE],
        { min: 1, max: 1, allowCancel: false },
      ), selected => {
        const targets = selected || [];

        if (targets.length > 0) {
          const placeCountersEffect = new PlaceDamageCountersEffect(player, targets[0], 130, this);
          state = store.reduceEffect(state, placeCountersEffect);
        }

        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
          if (cardList.getPokemonCard() === this) {
            cardList.damage += 999;
          }
        });
      });
    }
    // Shadow Bind
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return BLOCK_RETREAT(store, state, effect, this);
    }

    BLOCK_RETREAT_IF_MARKER(effect, MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
    REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN(effect, MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
    return state;
  }
}