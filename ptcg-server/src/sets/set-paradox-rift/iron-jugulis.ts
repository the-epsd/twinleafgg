import { PokemonCard, Stage, CardTag, CardType, StoreLike, State, CardTarget, ChoosePokemonPrompt, GameMessage, PlayerType, SlotType, StateUtils, GameError } from '../../game';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { CheckAttackCostEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { FutureBoosterEnergyCapsule } from './future-booster-energy-capsule';

export class IronJugulis extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public regulationMark = 'G';

  public tags = [ CardTag.FUTURE ];

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 130;

  public weakness = [{ type: CardType.LIGHTNING }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Homing Headbutt',
      cost: [ CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS ],
      damage: 0,
      text: 'This attack does 50 damage to 3 of your opponent\'s Pokémon that have any damage counters on them. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    },
    {
      name: 'Baryon Beam',
      cost: [ CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS ],
      damage: 150,
      text: 'If this Pokémon has a Future Booster Energy Capsule attached, this attack can be used for [C][C][C].'
    }
  ];

  public set: string = 'PAR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '158';

  public name: string = 'Iron Jugulis';

  public fullName: string = 'Iron Jugulis PAR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
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


        state = store.prompt(state, new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
          PlayerType.TOP_PLAYER,
          [SlotType.BENCH],
          { min: 1, max: 3, allowCancel: false, blocked: blocked }
        ), target => {
          if (!target || target.length === 0) {
            return;
          }
          const damageEffect = new PutDamageEffect(effect, 50);
          damageEffect.target = target[0];
          store.reduceEffect(state, damageEffect);
        });
      }

      if (effect instanceof CheckAttackCostEffect && effect.attack === this.attacks[1]) {

        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
          if (cardList === effect.target) {
            return;
          }
          if (card === this && cardList.tool instanceof FutureBoosterEnergyCapsule) {
            this.attacks[1].cost = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];
          }
        });
      }
      return state;
    }
    return state;
  }

}
