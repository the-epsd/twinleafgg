import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, Attack, ChooseAttackPrompt, GameError, GameMessage, Player, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';

export class Sudowoodo extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.FIGHTING;
  public hp: number = 90;
  public weakness = [{ type: CardType.WATER }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [{
    name: 'Watch and Learn',
    cost: [CardType.FIGHTING, CardType.COLORLESS],
    damage: 0,
    text: 'If your opponent\'s Pokémon used an attack during his or her last turn, use it as this attack.'
  }];

  public set: string = 'BKP';
  public setNumber: string = '67';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Sudowoodo';
  public fullName: string = 'Sudowoodo BKP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const lastAttack = state.lastAttack;

      if (!lastAttack || lastAttack.name === 'Copycat' || lastAttack.name === 'Watch and Learn') {
        return state;
      }

      // Find the original card that used the last attack
      const originalCard = this.findOriginalCard(state, lastAttack);
      if (!originalCard) {
        return state;
      }

      return store.prompt(state, new ChooseAttackPrompt(
        player.id,
        GameMessage.CHOOSE_ATTACK_TO_COPY,
        [originalCard],
        { allowCancel: true, blocked: [] }
      ), attack => {
        if (attack.name !== lastAttack.name) {
          throw new GameError(GameMessage.CANNOT_USE_ATTACK);
        }
        if (attack !== null) {
          state = this.executeCopiedAttack(store, state, player, opponent, attack);
        }
        return state;
      });
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
    const copiedAttackEffect = new AttackEffect(player, opponent, attack);
    state = store.reduceEffect(state, copiedAttackEffect);

    if (copiedAttackEffect.damage > 0) {
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