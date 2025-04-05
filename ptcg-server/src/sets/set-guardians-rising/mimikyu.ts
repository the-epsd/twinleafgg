import { Attack, CardType, Player, PlayerType, PokemonCard, Stage, State, StateUtils, StoreLike } from '../../game';
import { AfterDamageEffect, DealDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Mimikyu extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 70;

  public weakness = [];

  public retreat = [CardType.COLORLESS];

  public attacks = [{
    name: 'Filch',
    cost: [CardType.COLORLESS],
    damage: 0,
    text: 'Draw 2 cards.'
  }, {
    name: 'Copycat',
    cost: [CardType.PSYCHIC, CardType.COLORLESS],
    damage: 0,
    copycatAttack: true,
    text: 'If your opponent\'s Pokémon used an attack that isn\'t a GX attack during their last turn, use it as this attack.'
  }];

  public set: string = 'GRI';

  public name: string = 'Mimikyu';

  public fullName: string = 'Mimikyu GRI';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '58';

  private copiedReduceEffect: ((store: StoreLike, state: State, effect: Effect) => State) | null = null;
  private copiedProperties: any = null;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // If we have a copied reduceEffect and this is an AttackEffect, use it
    if (this.copiedReduceEffect && effect instanceof AttackEffect) {
      console.log('Using copied reduceEffect for attack:', effect.attack.name);
      return this.copiedReduceEffect(store, state, effect);
    }

    if (effect instanceof EndTurnEffect) {
      // Only clear the copied reduceEffect when it's our turn ending
      const cardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, cardList);
      if (owner === effect.player) {
        console.log('Clearing copied reduceEffect and properties for Mimikyu');
        this.copiedReduceEffect = null;
        this.copiedProperties = null;
      }
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      player.deck.moveTo(player.hand, 2);
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const lastAttack = state.lastAttack;

      if (!lastAttack || lastAttack.copycatAttack === true || lastAttack.gxAttack === true) {
        return state;
      }

      // Find the original card that used the last attack
      const originalCard = this.findOriginalCard(state, lastAttack);
      if (!originalCard) {
        return state;
      }

      console.log('Copying properties from card:', originalCard.name);

      // Copy all properties from the original card
      this.copiedProperties = {};
      Object.getOwnPropertyNames(originalCard).forEach(prop => {
        if (prop !== 'reduceEffect' && typeof (originalCard as any)[prop] !== 'function') {
          this.copiedProperties[prop] = (originalCard as any)[prop];
          console.log('Copied property:', prop, '=', (originalCard as any)[prop]);
        }
      });

      // Copy the original card's reduceEffect
      this.copiedReduceEffect = originalCard.reduceEffect.bind(originalCard);
      console.log('Copied reduceEffect from:', originalCard.name);

      // Directly execute the copied attack without UI prompt
      return this.executeCopiedAttack(store, state, player, opponent, lastAttack);
    }

    return state;
  }

  private executeCopiedAttack(
    store: StoreLike,
    state: State,
    player: Player,
    opponent: Player,
    attack: Attack
  ): State {
    // Create a new attack effect using the attack
    const copiedAttackEffect = new AttackEffect(player, opponent, attack);
    copiedAttackEffect.source = player.active;
    copiedAttackEffect.target = opponent.active;

    // If we have copied properties, apply them to the effect
    if (this.copiedProperties) {
      Object.assign(copiedAttackEffect, this.copiedProperties);
      console.log('Applied copied properties to attack effect:', this.copiedProperties);
    }

    // Execute the attack
    state = store.reduceEffect(state, copiedAttackEffect);

    if (copiedAttackEffect.attack.shredAttack === true && copiedAttackEffect.damage > 0) {
      // Apply damage and trigger AfterDamageEffect
      opponent.active.damage += copiedAttackEffect.damage;
      const afterDamage = new AfterDamageEffect(copiedAttackEffect, copiedAttackEffect.damage);
      state = store.reduceEffect(state, afterDamage);
    }

    if (copiedAttackEffect.attack.shredAttack !== true && copiedAttackEffect.damage > 0) {
      const dealDamage = new DealDamageEffect(copiedAttackEffect, copiedAttackEffect.damage);
      state = store.reduceEffect(state, dealDamage);
    }

    return state;
  }

  private findOriginalCard(state: State, lastAttack: Attack): PokemonCard | null {
    let originalCard: PokemonCard | null = null;

    state.players.forEach(player => {
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER && PlayerType.TOP_PLAYER, (cardList, card) => {
        if (card.attacks.some(attack => attack === lastAttack)) {
          originalCard = card;
        }
      });

      // Check deck, discard, hand, and lost zone
      [player.deck, player.discard, player.hand, player.lostzone].forEach(cardList => {
        cardList.cards.forEach(card => {
          if (card instanceof PokemonCard && card.attacks.some(attack => attack === lastAttack)) {
            originalCard = card;
          }
        });
      });
    });

    return originalCard;
  }
}