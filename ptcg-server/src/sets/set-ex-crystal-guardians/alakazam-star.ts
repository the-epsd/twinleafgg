import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import {
  StoreLike, State, StateUtils, GameMessage,
  ChooseAttackPrompt,
  EnergyMap,
  Player,
  Card,
  GameError,
  ChooseCardsPrompt
} from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { CheckProvidedEnergyEffect, CheckAttackCostEffect } from '../../game/store/effects/check-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';

export class AlakazamStar extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.STAR];
  public cardType: CardType = P;
  public hp: number = 80;
  public weakness = [{ type: P }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Psychic Select',
      cost: [P],
      damage: 0,
      text: 'Put any 1 card from your discard pile into your hand.'
    },
    {
      name: 'Skill Copy',
      cost: [C, C, C],
      damage: 0,
      text: 'Discard a Basic Pokémon or Evolution card from your hand. Choose 1 of that card\'s attacks. Skill Copy copies this attack. This attack does nothing if Alakazam Star doesn\'t have the Energy necessary to use that attack. (You must still do anything else required for that attack.) Alakazam Star performs that attack.'
    },
  ];

  public set: string = 'CG';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '99';
  public name: string = 'Alakazam Star';
  public fullName: string = 'Alakazam Star CG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      const hasCardInDiscard = player.discard.cards.some(c => {
        return c instanceof Card;
      });
      if (!hasCardInDiscard) {
        throw new GameError(GameMessage.CANNOT_USE_ATTACK);
      }

      return store.prompt(state, [
        new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARD_TO_HAND,
          player.discard,
          {},
          { min: 1, max: 1, allowCancel: false }
        )], selected => {
          const cards = selected || [];
          player.discard.moveCardsTo(cards, player.hand);
        });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Build cards and blocked for Choose Attack prompt
      const { pokemonCards, blocked } = this.buildAttackList(state, store, player);

      // No attacks to copy
      if (pokemonCards.length === 0) {
        return state;
      }

      return store.prompt(state, new ChooseAttackPrompt(
        player.id,
        GameMessage.CHOOSE_ATTACK_TO_COPY,
        pokemonCards,
        { allowCancel: true, blocked }
      ), attack => {
        if (attack !== null) {
          const attackEffect = new AttackEffect(player, opponent, attack);
          store.reduceEffect(state, attackEffect);

          if (attackEffect.damage > 0) {
            const dealDamage = new DealDamageEffect(attackEffect, attackEffect.damage);
            state = store.reduceEffect(state, dealDamage);
          }

          // Discard the card from hand that the attack came from
          const cardToDiscard = pokemonCards.find(card =>
            card.attacks.some(a => a === attack)
          );
          if (cardToDiscard) {
            player.hand.moveCardTo(cardToDiscard, player.discard);
          }
        }
      });
    }
    return state;
  }

  private buildAttackList(
    state: State, store: StoreLike, player: Player
  ): { pokemonCards: PokemonCard[], blocked: { index: number, attack: string }[] } {

    const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player);
    store.reduceEffect(state, checkProvidedEnergyEffect);
    const energyMap = checkProvidedEnergyEffect.energyMap;

    const pokemonCards: PokemonCard[] = [];
    const blocked: { index: number, attack: string }[] = [];
    player.hand.cards.forEach(card => {
      if (card instanceof PokemonCard) {
        this.checkAttack(state, store, player, card, energyMap, pokemonCards, blocked);
      }
    });

    return { pokemonCards, blocked };
  }

  private checkAttack(state: State, store: StoreLike, player: Player,
    card: PokemonCard, energyMap: EnergyMap[], pokemonCards: PokemonCard[],
    blocked: { index: number, attack: string }[]
  ) {
    {

      const attacks = card.attacks.filter(attack => {
        const checkAttackCost = new CheckAttackCostEffect(player, attack);
        state = store.reduceEffect(state, checkAttackCost);
        return StateUtils.checkEnoughEnergy(energyMap, checkAttackCost.cost as CardType[]);
      });
      const index = pokemonCards.length;
      pokemonCards.push(card);
      card.attacks.forEach(attack => {
        if (!attacks.includes(attack)) {
          blocked.push({ index, attack: attack.name });
        }
      });
    }
  }
}