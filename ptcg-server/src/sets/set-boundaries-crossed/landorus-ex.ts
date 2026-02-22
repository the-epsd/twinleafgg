import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, PlayerType, SlotType, StateUtils, ChoosePokemonPrompt, ConfirmPrompt, Card } from '../../game';

import { PutDamageEffect, DiscardCardsEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { GameMessage } from '../../game/game-message';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class LandorusEx extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_EX];
  public cardType: CardType = F;
  public hp: number = 180;
  public weakness = [{ type: W }];
  public resistance = [{ type: L, value: -20 }];
  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Hammerhead',
      cost: [F],
      damage: 30,
      text: 'Does 30 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    }, {
      name: 'Land\'s Judgment',
      cost: [F, F, C],
      damage: 80,
      text: 'You may discard all [F] Energy attached to this Pokémon. If you do, this attack does 70 more damage.'
    },
  ];

  public set: string = 'BCR';
  public setNumber: string = '89';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Landorus-EX';
  public fullName: string = 'Landorus EX BCR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const hasBenched = opponent.bench.some(b => b.cards.length > 0);
      if (!hasBenched) {
        return state;
      }

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.BENCH],
        { allowCancel: false }
      ), targets => {
        if (!targets || targets.length === 0) {
          return;
        }
        const damageEffect = new PutDamageEffect(effect, 30);
        damageEffect.target = targets[0];
        store.reduceEffect(state, damageEffect);
      });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      return store.prompt(state, new ConfirmPrompt(
        effect.player.id,
        GameMessage.WANT_TO_DISCARD_ENERGY
      ), result => {
        if (result) {
          const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
          store.reduceEffect(state, checkProvidedEnergy);

          const cards: Card[] = [];
          checkProvidedEnergy.energyMap.forEach(em => {
            if (em.provides.includes(CardType.FIGHTING) || em.provides.includes(CardType.ANY)) {
              cards.push(em.card);
            }
          });

          effect.damage += 70;
          const discardEnergy = new DiscardCardsEffect(effect, cards);
          discardEnergy.target = player.active;
          return store.reduceEffect(state, discardEnergy);
        }
      });
    }
    return state;
  }
}
