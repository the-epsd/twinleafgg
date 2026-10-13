import { GameError, GameMessage, PlayerType, StateUtils, StoreLike } from '../../../game';
import { CardTag, CardType, Stage } from '../../../game/store/card/card-types';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { PowerType } from '../../../game/store/card/pokemon-types';
import { Effect } from '../../../game/store/effects/effect';
import { PlaceDamageCountersEffect } from '../../../game/store/effects/game-effects';
import { DamageMap } from '../../../game/store/prompts/move-damage-prompt';
import { PutDamagePrompt } from '../../../game/store/prompts/put-damage-prompt';
import { SlotType } from '../../../game/store/actions/play-card-action';
import { IS_ABILITY_BLOCKED, WAS_POWER_USED } from '../../../game/store/prefabs/prefabs';
import { State } from '../../../game/store/state/state';

export class Cofagrigus extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Yamask';
  protected _tags = [CardTag.TEAM_PLASMA];
  public cardType: CardType[] = [P];
  public hp: number = 100;
  public weakness = [{ type: D }];
  public retreat = [C, C];

  public powers = [{
    name: 'Six Feet Under',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: "Once during your turn (before your attack) you may Knock Out this Pokémon. If you do, put 3 damage counters on your opponent's Pokémon in any way you like.",
  }];

  public attacks = [{
    name: 'Slap of Misfortune',
    cost: [P, P, C],
    damage: 70,
    text: 'NOT CURRENTLY WORKING: Whenever your opponent flips a coin during his or her next turn, treat it as tails.',
  }];

  public set: string = 'PLF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '56';
  public name: string = 'Cofagrigus';
  public fullName: string = 'Cofagrigus PLF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Six Feet Under
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }

      const maxAllowedDamage: DamageMap[] = [];
      const damage = 30;

      return store.prompt(
        state,
        new PutDamagePrompt(
          effect.player.id,
          GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
          PlayerType.TOP_PLAYER,
          [SlotType.ACTIVE, SlotType.BENCH],
          damage,
          maxAllowedDamage,
          { allowCancel: false },
        ),
        (targets) => {
          const results = targets || [];

          for (const result of results) {
            const target = StateUtils.getTarget(state, player, result.target);
            store.reduceEffect(
              state,
              new PlaceDamageCountersEffect(player, target, result.damage, this, this.powers[0]),
            );
          }

          player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
            if (cardList.getPokemonCard() === this) {
              cardList.damage += 999;
            }
          });
        },
      );
    }
    return state;
  }
}
