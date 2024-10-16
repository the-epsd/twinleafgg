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
      let hasDamagedBench = false;

      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
        if (cardList.damage === 0 && target.slot !== SlotType.ACTIVE) {
          blocked.push(target);
        }
        if (target.slot === SlotType.ACTIVE) {
          blocked.push(target);
        }
        if (cardList.damage > 0 && target.slot === SlotType.BENCH) {
          hasDamagedBench = true;
        }
      });

      if (!hasDamagedBench) {
        return state;
      }
      const blockedTo: CardTarget[] = [];

      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
        if (cardList !== opponent.active) {
          blockedTo.push(target);
        }
      });


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
        {
          min: 0,
          allowCancel: false,
          blockedTo: blockedTo,
          singleDestinationTarget: true
        }
      ), transfers => {
        if (transfers === null) {
          return;
        }

        for (const transfer of transfers) {
          const source = StateUtils.getTarget(state, player, transfer.from);
          const target = StateUtils.getTarget(state, player, transfer.to);

          if (target !== opponent.active) {
            throw new GameError(GameMessage.CANNOT_USE_POWER);
          }

          if (source == opponent.active) {
            throw new GameError(GameMessage.CANNOT_USE_POWER);
          }

          if (source.damage > 0) {
            const damageToMove = Math.min(source.damage);
            source.damage -= damageToMove;
            target.damage += damageToMove;
          }
        }
        return state;
      });
    }
    return state;
  }
}