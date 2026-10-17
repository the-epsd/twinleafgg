import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, EnergyType, Stage, SuperType } from '../../../game/store/card/card-types';
import { ChooseCardsPrompt, EnergyCard, GameMessage, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { DiscardCardsEffect } from '../../../game/store/effects/attack-effects';
import { CheckProvidedEnergyEffect } from '../../../game/store/effects/check-effects';
import { BLOCK_RETREAT } from '../../../game/store/prefabs/effect-of-attack-prefabs';
import { COIN_FLIP_PROMPT, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Huntail extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Clamperl';
  public hp: number = 90;
  public cardType: CardType[] = [W];
  public weakness = [{ type: L, value: +20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Scary Face',
    cost: [],
    damage: 0,
    text: 'Flip a coin. If heads, the Defending Pokémon can\'t attack or retreat during your opponent\'s next turn.'
  },
  {
    name: 'Threaten and Drop',
    cost: [W, C],
    damage: 30,
    damageCalculation: '+',
    text: 'If Huntail has any Darkness Energy attached to it, this attack does 30 damage plus 20 more damage and discard a Special Energy card, if any, attached to the Defending Pokémon.'
  }];

  public set: string = 'GE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '42';
  public name: string = 'Huntail';
  public fullName: string = 'Huntail GE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Scary Face
    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          effect.opponent.active.cannotAttackNextTurnPending = true;
          BLOCK_RETREAT(store, state, effect, this);
        }
      });
    }

    // Threaten and Drop
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = effect.opponent;
      const checkEnergy = new CheckProvidedEnergyEffect(player, player.active);
      store.reduceEffect(state, checkEnergy);
      const hasDarkness = checkEnergy.energyMap.some(em =>
        em.provides.includes(CardType.DARK) || em.provides.includes(CardType.ANY)
      );
      if (!hasDarkness) {
        return state;
      }

      effect.damage += 20;

      const specialEnergy = opponent.active.cards.filter(
        c => c instanceof EnergyCard && c.energyType === EnergyType.SPECIAL
      );
      if (specialEnergy.length === 0) {
        return state;
      }

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        opponent.active,
        { superType: SuperType.ENERGY, energyType: EnergyType.SPECIAL },
        { min: 1, max: 1, allowCancel: false }
      ), selected => {
        const cards = selected || [];
        if (cards.length > 0) {
          const discardEnergy = new DiscardCardsEffect(effect, cards);
          discardEnergy.target = opponent.active;
          store.reduceEffect(state, discardEnergy);
        }
      });
    }

    return state;
  }
}
