import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, ChoosePokemonPrompt, GameMessage, PlayerType, SlotType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';

export class Camerupt extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public cardType: CardType = CardType.FIRE;
  public hp: number = 140;
  public weakness = [{ type: CardType.WATER }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];
  public evolvesFrom = 'Numel';

  public attacks = [{
    name: 'Split Bomb',
    cost: [CardType.FIRE, CardType.COLORLESS],
    damage: 0,
    text: 'This attack does 50 damage to 2 of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  },
  {
    name: 'Heat Blast',
    cost: [CardType.FIRE, CardType.FIRE, CardType.COLORLESS],
    damage: 120,
    text: ''
  }];

  public set: string = 'PGO';
  public regulationMark = 'F';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '23';
  public name: string = 'Camerupt';
  public fullName: string = 'Camerupt PGO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      const max = Math.min(2);
      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { min: 1, max: max, allowCancel: false }
      ), selected => {
        const targets = selected || [];
        targets.forEach(target => {
          const damageEffect = new PutDamageEffect(effect, 50);
          damageEffect.target = target;
          store.reduceEffect(state, damageEffect);
        });
        return state;
      });
    }

    return state;
  }
}