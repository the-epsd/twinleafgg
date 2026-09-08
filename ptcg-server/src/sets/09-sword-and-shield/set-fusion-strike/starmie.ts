import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType, CardTag } from '../../../game/store/card/card-types';
import {
  StoreLike,
  State,
  ChooseCardsPrompt,
  GameMessage,
  PlayerType,
  SlotType,
  DamageMap,
  PutDamagePrompt,
  StateUtils,
  CardList,
} from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { CheckProvidedEnergyEffect } from '../../../game/store/effects/check-effects';

import { DiscardCardsEffect, PutCountersEffect } from '../../../game/store/effects/attack-effects';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Starmie extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Staryu';
  public cardType: CardType[] = [CardType.WATER];
  public hp: number = 90;
  public weakness = [{ type: CardType.LIGHTNING }];
  public retreat = [CardType.COLORLESS];
  protected _tags = [CardTag.RAPID_STRIKE];

  public attacks = [
    {
      name: 'Multishot Star',
      cost: [CardType.WATER],
      damage: 0,
      text: "Discard any amount of [W] Energy from this Pokémon. Then, for each Energy you discarded in this way, choose 1 of your opponent's Pokémon and do 30 damage to it. (You can choose the same Pokémon more than once.) This damage isn't affected by Weakness or Resistance. ",
    },
  ];

  public set: string = 'FST';
  public regulationMark = 'E';
  public setNumber: string = '53';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Starmie';
  public fullName: string = 'Starmie FST';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const checkEnergy = new CheckProvidedEnergyEffect(player, player.active);
      store.reduceEffect(state, checkEnergy);

      const waterCards = new Set(
        checkEnergy.energyMap
          .filter(em => em.provides.includes(CardType.WATER) || em.provides.includes(CardType.ANY))
          .map(em => em.card),
      );

      const blocked: number[] = [];
      player.active.cards.forEach((c, i) => {
        if (c.superType === SuperType.ENERGY && !waterCards.has(c)) {
          blocked.push(i);
        }
      });

      return store.prompt(
        state,
        new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
          player.active, // Card source is target Pokemon
          { superType: SuperType.ENERGY },
          { allowCancel: false, blocked: blocked },
        ),
        (selected) => {
          const cards = selected || [];
          if (cards.length > 0) {
            const energyToDiscard = new CardList();
            energyToDiscard.cards.push(...cards);

            const discardEnergy = new DiscardCardsEffect(effect, energyToDiscard.cards);
            discardEnergy.target = player.active;
            store.reduceEffect(state, discardEnergy);

            const damage = cards.length * 30;

            const maxAllowedDamage: DamageMap[] = [];
            opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
              maxAllowedDamage.push({ target, damage: card.hp + damage });
            });

            return store.prompt(
              state,
              new PutDamagePrompt(
                effect.player.id,
                GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
                PlayerType.TOP_PLAYER,
                [SlotType.ACTIVE, SlotType.BENCH],
                damage,
                maxAllowedDamage,
                { allowCancel: false, damageMultiple: 30 },
              ),
              (targets) => {
                const results = targets || [];
                for (const result of results) {
                  const target = StateUtils.getTarget(state, player, result.target);
                  const putCountersEffect = new PutCountersEffect(effect, result.damage);
                  putCountersEffect.target = target;
                  store.reduceEffect(state, putCountersEffect);
                }
              },
            );
          }

          return state;
        },
      );
    }

    return state;
  }
}
