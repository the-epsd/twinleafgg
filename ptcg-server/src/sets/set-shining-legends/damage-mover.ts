import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { GameMessage } from '../../game/game-message';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { DamageMap, GameError, MoveDamagePrompt, StateUtils } from '../../game';
import { CheckHpEffect } from '../../game/store/effects/check-effects';

export class DamageMover extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'SLG';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '58';
  public name: string = 'Damage Mover';
  public fullName: string = 'Damage Mover SLG';

  public text: string =
    'Move 3 damage counters from 1 of your Pokémon to another of your Pokémon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;

      const damagedPokemon = [
        ...player.bench.filter(b => b.cards.length > 0 && b.damage > 0),
        ...(player.active.damage > 0 ? [player.active] : [])
      ];

      if (damagedPokemon.length === 0) {
        throw new GameError(GameMessage.CANNOT_MOVE_DAMAGE);
      }

      player.hand.moveCardTo(effect.trainerCard, player.supporter);
      // We will discard this card after prompt confirmation
      effect.preventDefault = true;

      const maxAllowedDamage: DamageMap[] = [];
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        const checkHpEffect = new CheckHpEffect(player, cardList);
        store.reduceEffect(state, checkHpEffect);
        maxAllowedDamage.push({ target, damage: checkHpEffect.hp });
      });

      return store.prompt(state, new MoveDamagePrompt(
        effect.player.id,
        GameMessage.MOVE_DAMAGE,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        maxAllowedDamage,
        { min: 1, max: 3, allowCancel: false, singleSourceTarget: true, singleDestinationTarget: true }
      ), transfers => {
        if (transfers === null) {
          player.supporter.moveCardTo(this, player.discard);
          return state;
        }

        for (const transfer of transfers) {
          const source = StateUtils.getTarget(state, player, transfer.from);
          const target = StateUtils.getTarget(state, player, transfer.to);
          source.damage -= 10;
          target.damage += 10;
        }

        player.supporter.moveCardTo(this, player.discard);
        return state;
      });
    }

    return state;
  }

}
