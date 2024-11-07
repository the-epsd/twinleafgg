import { Attack, CardType, ChooseAttackPrompt, GameError, GameMessage, Player, PlayerType, PokemonCard, Stage, State, StateUtils, StoreLike } from '../../game';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Mimikyu extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = Y;

  public hp: number = 70;

  public weakness = [];

  public retreat = [C];

  public attacks = [{
    name: 'Filch',
    cost: [C],
    damage: 0,
    text: 'Draw 2 cards.'
  }, {
    name: 'Copycat',
    cost: [Y, C],
    damage: 0,
    copycatAttack: true,
    text: 'If your opponent\'s Pokémon used an attack that isn\'t a GX attack during their last turn, use it as this attack.'
  }];

  public set: string = 'TEU';

  public name: string = 'Mimikyu';

  public fullName: string = 'Mimikyu TEU';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '112';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      if (player.deck.cards.length === 0) {
        return state;
      }

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