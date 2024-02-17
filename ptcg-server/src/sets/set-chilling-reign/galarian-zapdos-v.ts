/* eslint-disable indent */
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, EnergyType, SuperType } from '../../game/store/card/card-types';
import { Card, ChooseCardsPrompt, EnergyCard, GameMessage, PowerType, State, StateUtils, StoreLike } from '../../game';
import { CardTag } from '../../game/store/card/card-types';
import { CheckAttackCostEffect, CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';

export class GalarianZapdosV extends PokemonCard {

  public tags = [ CardTag.POKEMON_V ];

  public regulationMark = 'E';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.FIGHTING;

  public hp: number = 210;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [ CardType.COLORLESS ];

  public powers = [{
    name: 'Fighting Instinct',
    powerType: PowerType.ABILITY,
    text: 'This Pokémon\'s attacks cost [C] less for each of your opponent\'s Pokémon V in play.'
  }];

  public attacks = [
    {
      name: 'Thunderous Kick',
      cost: [ CardType.FIGHTING, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS ],
      damage: 170,
      text: 'Before doing damage, discard a Special Energy from your opponent\'s Active Pokémon.'
    }
  ];

  public set: string = 'CRE';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '080';

  public name: string = 'Galarian Zapdos V';

  public fullName: string = 'Galarian Zapdos V CRE';

  // Implement ability
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckAttackCostEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let fightingInstinctCount = 0;

      // Check opponent's active Pokemon
      const opponentActive = opponent.active.getPokemonCard();
      if (opponentActive && (opponentActive.tags.includes(CardTag.POKEMON_V) ||
        opponentActive.tags.includes(CardTag.POKEMON_VMAX) ||
        opponentActive.tags.includes(CardTag.POKEMON_VSTAR))) {
        fightingInstinctCount += 1;
      }

      try {
        const powerEffect = new PowerEffect(opponent, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        return state;
      }

            // Check opponent's benched Pokemon
            opponent.bench.forEach(cardList => {
              cardList.cards.forEach(card => {
                if (card instanceof PokemonCard &&
                  (card.tags.includes(CardTag.POKEMON_V) ||
                    card.tags.includes(CardTag.POKEMON_VMAX) ||
                    card.tags.includes(CardTag.POKEMON_VSTAR))) {
                  fightingInstinctCount += 1;
                }
              });
            });
      
            // Reduce attack cost by removing 1 Colorless energy for each counted Pokemon
            const attackCost = this.attacks[0].cost;
            const colorlessToRemove = fightingInstinctCount;
            this.attacks[0].cost = attackCost.filter(c => c !== CardType.COLORLESS).slice(0, -colorlessToRemove);
          }

          if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

            const player = effect.player;
            const opponent = StateUtils.getOpponent(state, player);
      
            const oppActive = opponent.active;
      
            const checkEnergy = new CheckProvidedEnergyEffect(player, oppActive);
            store.reduceEffect(state, checkEnergy);
      
            checkEnergy.energyMap.forEach(em => {
              const energyCard = em.card;
              if (energyCard instanceof EnergyCard && energyCard.energyType === EnergyType.SPECIAL) {
      
                let cards: Card[] = [];
                store.prompt(state, new ChooseCardsPrompt(
                  player.id,
                  GameMessage.CHOOSE_CARD_TO_DISCARD,
                  oppActive,
                  { superType: SuperType.ENERGY, energyType: EnergyType.SPECIAL },
                  { min: 1, max: 1, allowCancel: false }
                ), selected => {
                  cards = selected;
                });
                oppActive.moveCardsTo(cards, opponent.discard);

                const damageEffect = new PutDamageEffect(effect, 20);
                damageEffect.target = opponent.active;
                store.reduceEffect(state, damageEffect);

              }
            });
          }
          return state; 
        }
      }