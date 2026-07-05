import {
  Card,
  ChooseCardsPrompt,
  DamageMap,
  GameMessage,
  PlayerType,
  PutDamagePrompt,
  SlotType,
  State,
  StateUtils,
  StoreLike,
} from '../../../game';
import { CardTag, CardType, Stage, SuperType } from '../../../game/store/card/card-types';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CheckProvidedEnergyEffect } from '../../../game/store/effects/check-effects';
import { Effect } from '../../../game/store/effects/effect';
import { BREAK_RULE, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { DiscardCardsEffect, PutDamageEffect } from '../../../game/store/effects/attack-effects';

export class BronzongBREAK extends PokemonCard {
  public stage: Stage = Stage.BREAK;
  public tags = [CardTag.BREAK];
  public evolvesFrom = 'Bronzong';
  public cardType: CardType = M;
  public hp: number = 130;

  public attacks = [
    {
      name: 'Metal Rain',
      cost: [M, C],
      damage: 0,
      text: "Discard as many [M] Energy attached to this Pokémon as you like. For each Energy card discarded in this way, choose 1 of your opponent's Pokémon and do 30 damage to it. Don't apply Weakness and Resistance. (You may choose the same Pokémon more than once.)",
    },
  ];

  public set: string = 'FCO';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '62';
  public name: string = 'Bronzong BREAK';
  public fullName: string = 'Bronzong BREAK FCO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Life Stream
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const blocked: number[] = [];
      const cardEnergyCounts = new Map<Card, number>(); // Map card objects to their energy counts

      // Check energy provided by each card
      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player, player.active);
      store.reduceEffect(state, checkProvidedEnergy);

      player.active.cards.forEach((card, index) => {
        const providedEnergy = checkProvidedEnergy.energyMap.filter((em) => em.card === card);

        // Count how many Metal/Any energy are provided by this card
        let metalCount = 0;
        providedEnergy.forEach((em) => {
          em.provides.forEach((type) => {
            if (type === CardType.METAL || type === CardType.ANY) {
              metalCount++;
            }
          });
        });

        // If the card doesn't provide any Lightning energy, block it
        if (metalCount === 0) {
          blocked.push(index);
        } else {
          cardEnergyCounts.set(card, metalCount);
        }
      });

      return store.prompt(
        state,
        new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
          player.active, // Card source is target Pokemon
          { superType: SuperType.ENERGY },
          { allowCancel: false, blocked },
        ),
        (selected) => {
          const cards = selected || [];
          if (cards.length > 0) {
            // Save energy counts before discarding
            let totalEnergy = 0;
            cards.forEach((card) => {
              if (cardEnergyCounts.has(card)) {
                totalEnergy += cardEnergyCounts.get(card) || 0;
              }
            });

            const discardEnergy = new DiscardCardsEffect(effect, cards);
            discardEnergy.target = player.active;
            store.reduceEffect(state, discardEnergy);

            const damage = totalEnergy * 30;

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
                  const putDamageEffect = new PutDamageEffect(effect, result.damage);
                  putDamageEffect.target = target;
                  store.reduceEffect(state, putDamageEffect);
                }
              },
            );
          }

          return state;
        },
      );
    }

    BREAK_RULE(effect, state, this);

    return state;
  }
}
