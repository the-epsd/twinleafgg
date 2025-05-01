import { CardTarget, MoveEnergyPrompt, PlayerType, SlotType } from '../../game';
import { GameMessage } from '../../game/game-message';
import { CardType, SuperType, TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { CheckPokemonTypeEffect, CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { UseStadiumEffect } from '../../game/store/effects/game-effects';
import { StateUtils } from '../../game/store/state-utils';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class StarkMountain extends TrainerCard {

  public trainerType = TrainerType.STADIUM;
  public set = 'LA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '135';
  public name = 'Stark Mountain';
  public fullName = 'Stark Mountain LA';

  public text = 'Once during each player\'s turn, that player may choose a [R] or [F] Energy attached to 1 of his or her Pokémon and move that Energy to 1 of his or her [R] or [F] Pokémon.';

  reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof UseStadiumEffect && StateUtils.getStadiumCard(state) === this) {

      const player = effect.player;
      const blockedMap: { source: CardTarget, blocked: number[] }[] = [];

      // Determine blocked energy cards for each Pokémon
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        const checkProvidedEnergy = new CheckProvidedEnergyEffect(player, cardList);
        store.reduceEffect(state, checkProvidedEnergy);

        const blockedIndices = new Set<number>();
        checkProvidedEnergy.energyMap.forEach(em => {
          if (!em.provides.includes(CardType.FIRE) && !em.provides.includes(CardType.FIGHTING) && !em.provides.includes(CardType.ANY)) {
            const index = cardList.cards.indexOf(em.card);
            if (index !== -1) {
              blockedIndices.add(index);
            }
          }
        });

        if (blockedIndices.size > 0) {
          blockedMap.push({ source: target, blocked: Array.from(blockedIndices) });
        }
      });

      // Determine valid targets (Fire or Fighting Pokémon)
      const invalidTargets: CardTarget[] = [];
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (list, card, target) => {
        const checkPokemonTypeEffect = new CheckPokemonTypeEffect(list);
        store.reduceEffect(state, checkPokemonTypeEffect);

        if (!checkPokemonTypeEffect.cardTypes.includes(CardType.FIRE) && !checkPokemonTypeEffect.cardTypes.includes(CardType.FIGHTING)) {
          invalidTargets.push(target);
        }
      });

      store.prompt(state, new MoveEnergyPrompt(
        effect.player.id,
        GameMessage.MOVE_ENERGY_CARDS,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH, SlotType.ACTIVE],
        { superType: SuperType.ENERGY },
        { allowCancel: true, min: 1, max: 1, blockedMap, blockedTo: invalidTargets }
      ), transfers => {
        if (transfers && transfers.length > 0) {
          for (const transfer of transfers) {
            const source = StateUtils.getTarget(state, player, transfer.from);
            const target = StateUtils.getTarget(state, player, transfer.to);

            if (source && target) {
              source.moveCardTo(transfer.card, target);
            }
          }
        }
      });
    }
    return state;
  }
}