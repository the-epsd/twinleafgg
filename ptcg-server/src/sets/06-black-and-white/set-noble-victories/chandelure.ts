import { GameError, GameMessage, PlayerType, StateUtils, StoreLike } from '../../../game';
import { CardType, SpecialCondition, Stage } from '../../../game/store/card/card-types';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { PowerType } from '../../../game/store/card/pokemon-types';
import { AddSpecialConditionsEffect } from '../../../game/store/effects/attack-effects';
import { CheckHpEffect } from '../../../game/store/effects/check-effects';
import { Effect } from '../../../game/store/effects/effect';
import { PlaceDamageCountersEffect } from '../../../game/store/effects/game-effects';
import { PlayPokemonEffect } from '../../../game/store/effects/play-card-effects';
import { DamageMap } from '../../../game/store/prompts/move-damage-prompt';
import { PutDamagePrompt } from '../../../game/store/prompts/put-damage-prompt';
import { SlotType } from '../../../game/store/actions/play-card-action';
import { IS_ABILITY_BLOCKED, REMOVE_MARKER_AT_END_OF_TURN, USE_ABILITY_ONCE_PER_TURN, WAS_ATTACK_USED, WAS_POWER_USED } from '../../../game/store/prefabs/prefabs';
import { State } from '../../../game/store/state/state';

export class Chandelure extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Lampent';
  public cardType: CardType[] = [P];
  public hp: number = 130;
  public weakness = [{ type: D }];
  public retreat = [C, C];

  public powers = [{
    name: 'Cursed Shadow',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn (before attack), if this Pokemon is your Active Pokemon, you may put 3 damage counters on your opponent\'s Pokemon in any way you like.'
  }];

  public attacks = [{
    name: 'Eerie Glow',
    cost: [P, P, C],
    damage: 50,
    text: 'The Defending Pokemon is now Burned and Confused.'
  }];

  public set: string = 'NVI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '60';
  public name: string = 'Chandelure';
  public fullName: string = 'Chandelure NVI';

  public readonly CURSED_SHADOW_MARKER = 'CURSED_SHADOW_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      effect.player.marker.removeMarker(this.CURSED_SHADOW_MARKER, this);
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.CURSED_SHADOW_MARKER, this);

    // Cursed Shadow
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }

      if (player.active.getPokemonCard() !== this) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      USE_ABILITY_ONCE_PER_TURN(player, this.CURSED_SHADOW_MARKER, this);

      const maxAllowedDamage: DamageMap[] = [];
      let damageLeft = 0;
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
        const checkHpEffect = new CheckHpEffect(opponent, cardList);
        store.reduceEffect(state, checkHpEffect);
        damageLeft += checkHpEffect.hp - cardList.damage;
        maxAllowedDamage.push({ target, damage: checkHpEffect.hp });
      });

      const damage = Math.min(30, damageLeft);

      return store.prompt(state, new PutDamagePrompt(
        effect.player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        damage,
        maxAllowedDamage,
        { allowCancel: true }
      ), targets => {
        const results = targets || [];
        if (results.length === 0) {
          player.marker.removeMarker(this.CURSED_SHADOW_MARKER, this);
          return;
        }
        for (const result of results) {
          const target = StateUtils.getTarget(state, player, result.target);
          store.reduceEffect(
            state,
            new PlaceDamageCountersEffect(player, target, result.damage, this, this.powers[0]),
          );
        }
      });
    }

    // Eerie Glow
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [
        SpecialCondition.BURNED,
        SpecialCondition.CONFUSED
      ]);
      store.reduceEffect(state, specialConditionEffect);
    }

    return state;
  }
}
