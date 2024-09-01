import { PokemonCard, Stage, CardType, StoreLike, State, CardTarget, GameMessage, PlayerType, SlotType, StateUtils, GameError, DamageMap, MoveDamagePrompt } from '../../game';
import { CheckHpEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Sableye extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public regulationMark = 'H';

  public cardType: CardType = CardType.DARK;

  public hp: number = 70;

  public weakness = [{ type: CardType.GRASS }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Claw Slash',
      cost: [CardType.DARK],
      damage: 20,
      text: ''
    },
    {
      name: 'Damage Collection',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: 0,
      text: 'Move any number of damage counters from your opponent\'s Benched Pokémon to their Active Pokémon.'
    }
  ];

  public set: string = 'TEF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '107';

  public name: string = 'Sableye';

  public fullName: string = 'Sableye TEF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const blocked: CardTarget[] = [];

      const hasBenched = opponent.bench.some(b => b.cards.length > 0);
      if (!hasBenched) {
        throw new GameError(GameMessage.CANNOT_USE_ATTACK);
      }

      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
        if (cardList.damage > 0) {
          return state;
        } else {
          blocked.push(target);
        }
      });

      if (!blocked.length) {
        throw new GameError(GameMessage.CANNOT_USE_ATTACK);
      }

      if (blocked.length) {
        // Opponent has damaged benched Pokemon

        const maxAllowedDamage: DamageMap[] = [];
        opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
          const checkHpEffect = new CheckHpEffect(opponent, cardList);
          store.reduceEffect(state, checkHpEffect);
          maxAllowedDamage.push({ target, damage: checkHpEffect.hp });
        });

        return store.prompt(state, new MoveDamagePrompt(
          effect.player.id,
          GameMessage.MOVE_DAMAGE,
          PlayerType.TOP_PLAYER,
          [SlotType.ACTIVE, SlotType.BENCH],
          maxAllowedDamage,
          { min: 0, allowCancel: false }
        ), transfers => {
          if (transfers === null) {
            return;
          }

          for (const transfer of transfers) {
            const source = StateUtils.getTarget(state, player, transfer.from);
            const target = StateUtils.getTarget(state, player, transfer.to);
            if (source.damage >= 10) {
              source.damage -= source.damage;
              target.damage += target.damage;
            }
          }
          return state;
        });
        return state;
      }
      return state;
    }
    return state;
  }
}