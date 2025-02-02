import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, ChooseCardsPrompt, GameMessage, PlayerType, SlotType, DamageMap, StateUtils, PutDamagePrompt, Card } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { DiscardCardsEffect, PutCountersEffect } from '../../game/store/effects/attack-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';

export class AlolanRaichu extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Pikachu';
  public cardType: CardType = CardType.LIGHTNING;
  public hp: number = 110;
  public weakness = [{ type: CardType.FIGHTING }];
  public resistance = [{ type: CardType.METAL, value: -20 }];
  public retreat = [CardType.COLORLESS];

  public attacks = [{
    name: 'Electro Rain',
    cost: [CardType.LIGHTNING],
    damage: 0,
    text: 'Discard any amount of [L] Energy from this Pokémon. Then, for each Energy you discarded in this way, choose 1 of your opponent\'s Pokémon and do 30 damage to it. (You can choose the same Pokémon more than once.) This damage isn\'t affected by Weakness or Resistance. '
  },
  {
    name: 'Electric Ball',
    cost: [CardType.LIGHTNING, CardType.COLORLESS, CardType.COLORLESS],
    damage: 90,
    text: ''
  }];

  public set: string = 'UNM';
  public setNumber: string = '57';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Alolan Raichu';
  public fullName: string = 'Alolan Raichu UNM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const blocked: number[] = [];
      player.active.cards.forEach((cardList, card, target) => {
        const checkProvidedEnergy = new CheckProvidedEnergyEffect(player, player.active);
        store.reduceEffect(state, checkProvidedEnergy);
        const blockedCards: Card[] = [];

        checkProvidedEnergy.energyMap.forEach(em => {
          if (!em.provides.includes(CardType.LIGHTNING) && !em.provides.includes(CardType.ANY)) {
            blockedCards.push(em.card);
          }
        });
        blockedCards.forEach(bc => {
          const index = target.indexOf(bc);
          if (index !== -1 && !blocked.includes(index)) {
            blocked.push(index);
          }
        });
      });

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
        player.active, // Card source is target Pokemon
        { superType: SuperType.ENERGY },
        { allowCancel: false, blocked }
      ), selected => {
        const cards = selected || [];
        if (cards.length > 0) {

          const discardEnergy = new DiscardCardsEffect(effect, cards);
          discardEnergy.target = player.active;

          store.reduceEffect(state, discardEnergy);

          const damage = cards.length * 30;

          const maxAllowedDamage: DamageMap[] = [];
          opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
            maxAllowedDamage.push({ target, damage: card.hp + damage });
          });

          return store.prompt(state, new PutDamagePrompt(
            effect.player.id,
            GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
            PlayerType.TOP_PLAYER,
            [SlotType.ACTIVE, SlotType.BENCH],
            damage,
            maxAllowedDamage,
            { allowCancel: false, damageMultiple: 30 }
          ), targets => {
            const results = targets || [];
            for (const result of results) {
              const target = StateUtils.getTarget(state, player, result.target);
              const putCountersEffect = new PutCountersEffect(effect, result.damage);
              putCountersEffect.target = target;
              store.reduceEffect(state, putCountersEffect);
            }
          });
        }

        return state;
      });
    }
    return state;
  }
}