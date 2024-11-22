import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, ChooseCardsPrompt, GameMessage, PlayerType, SlotType, DamageMap, PutDamagePrompt, StateUtils, EnergyCard, CardList } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { DiscardCardsEffect, PutCountersEffect } from '../../game/store/effects/attack-effects';

export class Starmie extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Staryu';
  public cardType: CardType = CardType.WATER;
  public hp: number = 90;
  public weakness = [{ type: CardType.LIGHTNING }];
  public retreat = [CardType.COLORLESS];

  public attacks = [{
    name: 'Multishot Star',
    cost: [CardType.WATER],
    damage: 0,
    text: 'Discard any amount of [W] Energy from this Pokémon. Then, for each Energy you discarded in this way, choose 1 of your opponent\'s Pokémon and do 30 damage to it. (You can choose the same Pokémon more than once.) This damage isn\'t affected by Weakness or Resistance. '
  }];

  public set: string = 'FST';
  public regulationMark = 'E';
  public setNumber: string = '53';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Starmie';
  public fullName: string = 'Starmie FST';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const blocked: number[] = [];
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        if (cardList.cards.some(c => c instanceof EnergyCard && c.provides.includes(CardType.WATER))) {
          blocked.push();
        }
        if (cardList.cards.some(c => c instanceof EnergyCard && c.provides.includes(CardType.ANY))) {
          blocked.push();
        }
        if (cardList.cards.some(c => c instanceof EnergyCard && c.blendedEnergies.includes(CardType.WATER))) {
          blocked.push();
        }
      });

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
        player.active, // Card source is target Pokemon
        { superType: SuperType.ENERGY },
        { allowCancel: false, blocked: blocked }
      ), selected => {
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