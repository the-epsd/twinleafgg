import { Attack, CardType, PlayerType, PokemonCard, Stage, State, StateUtils, StoreLike } from '../../game';
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

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof EndTurnEffect) {
      // Only clear the copied reduceEffect when it's our turn ending
      const cardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, cardList);
      if (owner === effect.player) {
        console.log('Clearing copied reduceEffect and properties for Mimikyu');
        // Remove copiedReduceEffect and copiedProperties fields and logic
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
      const lastAttackRaw = state.lastAttack;
      // Extract the Attack object if lastAttack is a UseAttackEffect
      const lastAttack = lastAttackRaw && (typeof (lastAttackRaw as any).attack === 'object')
        ? (lastAttackRaw as any).attack as Attack
        : lastAttackRaw as Attack;

      if (!lastAttack || lastAttack.copycatAttack === true || lastAttack.gxAttack === true) {
        return state;
      }

      // Find the original card that used the last attack
      const originalCard = this.findOriginalCard(state, lastAttack);
      if (!originalCard) {
        return state;
      }

      // Create a new AttackEffect for the copied attack
      const copiedAttackEffect = new AttackEffect(player, opponent, lastAttack);
      copiedAttackEffect.source = player.active;
      copiedAttackEffect.target = opponent.active;

      // Call the original card's reduceEffect, with the original card as `this`
      return originalCard.reduceEffect.call(originalCard, store, state, copiedAttackEffect);
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