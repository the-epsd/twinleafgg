import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { DamageMap, GameMessage, MoveDamagePrompt, PlayerType, SlotType, StateUtils } from '../../game';
import { CheckHpEffect } from '../../game/store/effects/check-effects';

export class DamagePump extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'LOR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '156';

  public regulationMark = 'F';

  public name: string = 'Damage Pump';

  public fullName: string = 'Damage Pump LOR';

  public text: string =
    'Move up to 2 damage counters from 1 of your Pokémon to your other Pokémon in any way you like.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
        
      const maxAllowedDamage: DamageMap[] = [];
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        const checkHpEffect = new CheckHpEffect(player, cardList);
        store.reduceEffect(state, checkHpEffect);
        maxAllowedDamage.push({ target, damage: checkHpEffect.hp });
      });

      // We will discard this card after prompt confirmation
      effect.preventDefault = true;
        
      return store.prompt(state, new MoveDamagePrompt(
        effect.player.id,
        GameMessage.MOVE_DAMAGE,
        PlayerType.BOTTOM_PLAYER,
        [ SlotType.ACTIVE, SlotType.BENCH ],
        maxAllowedDamage,
        { min: 1, max: 2, allowCancel: false }
      ), transfers => {
        if (transfers === null) {
          return;
        }
        
        for (const transfer of transfers) {
          const source = StateUtils.getTarget(state, player, transfer.from);
          const target = StateUtils.getTarget(state, player, transfer.to);
          if (source.damage >= 20) {
            source.damage -= 20;
            target.damage += 20;
          }
          player.supporter.moveCardTo(this, player.discard);
          return state;
        }
        return state;
      });
    }
    return state;
  }
}