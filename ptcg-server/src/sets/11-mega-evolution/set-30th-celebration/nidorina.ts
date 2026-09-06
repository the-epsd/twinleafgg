import { PokemonCard, Stage, CardType, PowerType, StoreLike, State, CardTarget, PlayerType, GameError, GameMessage, ChoosePokemonPrompt, SlotType } from "../../../game";
import { Effect } from "../../../game/store/effects/effect";
import { HealEffect } from "../../../game/store/effects/game-effects";
import { WAS_POWER_USED, USE_ABILITY_ONCE_PER_TURN, ABILITY_USED, REMOVE_MARKER_AT_END_OF_TURN } from "../../../game/store/prefabs/prefabs";

export class Nidorina extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Nidoran ♀';
  public hp: number = 90;
  public cardType: CardType[] = [D];
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public powers = [{
    name: 'Happy Share',
    powerType: PowerType.ABILITY,
    useWhenInPlay: true,
    text: 'Once during your turn, you may use this Ability. Heal 30 damage from 1 of your Pokémon.'
  }];

  public attacks = [{
    name: 'Bite',
    cost: [C, C],
    damage: 30,
    text: ''
  }];

  public regulationMark: string = 'J';
  public set: string = '30C';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '88';
  public name: string = 'Nidorina';
  public fullName: string = 'Nidorina 30C';

  public readonly HAPPY_SHARE_MARKER = 'HAPPY_SHARE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Happy Share
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      const blocked: CardTarget[] = [];
      let hasTarget = false;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (targetList, _card, target) => {
        if (targetList.damage === 0) {
          blocked.push(target);
        } else {
          hasTarget = true;
        }
      });

      if (!hasTarget) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      USE_ABILITY_ONCE_PER_TURN(player, this.HAPPY_SHARE_MARKER, this);
      ABILITY_USED(player, this);

      store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_HEAL,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { allowCancel: false, blocked }
      ), targets => {
        if (targets && targets.length > 0) {
          const healEffect = new HealEffect(player, targets[0], 30);
          store.reduceEffect(state, healEffect);
        }
      });
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.HAPPY_SHARE_MARKER, this);

    return state;
  }
}
