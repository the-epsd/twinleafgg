import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage, SuperType } from '../../../game/store/card/card-types';
import { ChooseCardsPrompt, DamageMap, GameMessage, PlayerType, PutDamagePrompt, SlotType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { PutCountersEffect } from '../../../game/store/effects/attack-effects';
import { CheckHpEffect } from '../../../game/store/effects/check-effects';
import { AttackEffect } from '../../../game/store/effects/game-effects';
import { MOVE_CARDS, SHUFFLE_DECK, SHOW_CARDS_TO_PLAYER, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Banette extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Shuppet';
  public hp: number = 80;
  public cardType: CardType[] = [P];
  public weakness = [{ type: D, value: +20 }];
  public resistance = [{ type: C, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Ghost Head',
    cost: [],
    damage: 0,
    text: 'Put as many damage counters as you like on Banette. (You can\'t put more than Banette\'s remaining HP.) Put that many damage counters on the Defending Pokémon.'
  },
  {
    name: 'Spiteful Pain',
    cost: [P, P],
    damage: 40,
    damageCalculation: '+',
    text: 'If Banette is in your discard pile, this attack does 40 damage plus 40 more damage, then search your discard pile for Banette, show it to your opponent, and shuffle it into your deck.'
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '23';
  public name: string = 'Banette';
  public fullName: string = 'Banette SW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ghost Head
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const generator = ghostHead(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    // Spiteful Pain
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const banettes = player.discard.cards.filter(c => c instanceof PokemonCard && c.name === 'Banette');
      if (banettes.length === 0) {
        return state;
      }

      effect.damage += 40;
      const blocked: number[] = [];
      player.discard.cards.forEach((card, index) => {
        if (!(card instanceof PokemonCard) || card.name !== 'Banette') {
          blocked.push(index);
        }
      });

      store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DECK,
        player.discard,
        { superType: SuperType.POKEMON },
        { min: 1, max: 1, allowCancel: false, blocked }
      ), selected => {
        const cards = selected || [];
        if (cards.length > 0) {
          SHOW_CARDS_TO_PLAYER(store, state, opponent, cards);
          MOVE_CARDS(store, state, player.discard, player.deck, { cards, sourceCard: this });
          SHUFFLE_DECK(store, state, player);
        }
      });
    }

    return state;
  }
}

function* ghostHead(
  next: Function,
  store: StoreLike,
  state: State,
  effect: AttackEffect,
): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  const checkHp = new CheckHpEffect(player, player.active);
  store.reduceEffect(state, checkHp);
  const remainingHp = Math.max(0, checkHp.hp - player.active.damage);
  if (remainingHp === 0) {
    return state;
  }

  const maxAllowedDamage: DamageMap[] = [];
  player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
    if (cardList === player.active) {
      maxAllowedDamage.push({ target, damage: remainingHp });
    }
  });

  return store.prompt(
    state,
    new PutDamagePrompt(
      player.id,
      GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
      PlayerType.BOTTOM_PLAYER,
      [SlotType.ACTIVE],
      remainingHp,
      maxAllowedDamage,
      { allowCancel: false, allowPlacePartialDamage: true },
    ),
    results => {
      const placed = results || [];
      for (const result of placed) {
        const selfDamage = new PutCountersEffect(effect, result.damage);
        selfDamage.target = player.active;
        store.reduceEffect(state, selfDamage);

        const oppDamage = new PutCountersEffect(effect, result.damage);
        oppDamage.target = opponent.active;
        store.reduceEffect(state, oppDamage);
      }
    },
  );
}
