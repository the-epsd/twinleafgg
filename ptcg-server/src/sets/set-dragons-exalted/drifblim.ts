import { Attack, CardType, ChoosePokemonPrompt, EnergyCard, EnergyType, GameMessage, PlayerType, PokemonCard, SlotType, Stage, State, StateUtils, StoreLike, Weakness } from "../../game";
import { PutCountersEffect } from "../../game/store/effects/attack-effects";
import { Effect } from "../../game/store/effects/effect";
import { WAS_ATTACK_USED } from "../../game/store/prefabs/prefabs";

export class Drifblim extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Drifloon';
  public cardType: CardType = P;
  public hp: number = 100;
  public weakness: Weakness[] = [{ type: D }];
  public retreat: CardType[] = [C];

  public attacks: Attack[] = [
    {
      name: 'Shadow Steal',
      cost: [C],
      damage: 50,
      damageCalculation: 'x',
      text: 'Does 50 damage times the number of Special Energy cards in your opponent\'s discard pile.'
    },
    {
      name: 'Plentiful Placement',
      cost: [P, C],
      damage: 0,
      text: 'Put 4 damage counters on 1 of your opponent\'s Pokémon.',
    },
  ];

  public set: string = 'DRX';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '51';
  public name: string = 'Drifblim';
  public fullName: string = 'Drifblim DRX';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const opponent = StateUtils.getOpponent(state, effect.player);

      effect.damage = 50 * opponent.discard.cards.filter(c => c instanceof EnergyCard && c.energyType === EnergyType.SPECIAL).length;
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { min: 1, max: 1, allowCancel: false }
      ), selected => {
        const targets = selected || [];
        targets.forEach(target => {
          const damageEffect = new PutCountersEffect(effect, 20);
          damageEffect.target = target;
          store.reduceEffect(state, damageEffect);
        });
        return state;
      });
    }


    return state;
  }

}