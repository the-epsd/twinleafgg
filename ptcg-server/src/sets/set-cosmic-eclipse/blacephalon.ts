import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, DamageMap, PlayerType, PutDamagePrompt, GameMessage, SlotType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { PutCountersEffect } from '../../game/store/effects/attack-effects';

export class Blacephalon extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.PSYCHIC;
  public hp: number = 110;
  public weakness = [{ type: CardType.DARK }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [{
    name: 'Fireworks Bomb',
    cost: [CardType.PSYCHIC, CardType.COLORLESS],
    damage: 0,
    text: 'Put 4 damage counters on your opponent\'s Pokemon in any way you like. If your opponent has exactly 3 Prize cards remaining, put 12 damage counters on them instead.'
  }];

  public set: string = 'CEC';
  public name: string = 'Blacephalon';
  public fullName: string = 'Blacephalon CEC';
  public setNumber: string = '104';
  public cardImage: string = 'assets/cardback.png';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const maxAllowedDamage: DamageMap[] = [];
      if (opponent.getPrizeLeft() != 3) {
        opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
          maxAllowedDamage.push({ target, damage: card.hp + 40 });
        });

        const damage = 40;

        return store.prompt(state, new PutDamagePrompt(
          effect.player.id,
          GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
          PlayerType.TOP_PLAYER,
          [SlotType.ACTIVE, SlotType.BENCH],
          damage,
          maxAllowedDamage,
          { allowCancel: false }
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

      if (opponent.getPrizeLeft() === 3) {
        opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
          maxAllowedDamage.push({ target, damage: card.hp + 120 });
        });

        const damage = 120;

        return store.prompt(state, new PutDamagePrompt(
          effect.player.id,
          GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
          PlayerType.TOP_PLAYER,
          [SlotType.ACTIVE, SlotType.BENCH],
          damage,
          maxAllowedDamage,
          { allowCancel: false }
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

    }

    return state;
  }

}