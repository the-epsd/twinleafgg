import { CardType, ChoosePokemonPrompt, GameMessage, PlayerType, PokemonCard, SlotType, Stage, State, StateUtils, StoreLike } from '../../game';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Marshtomp extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public cardType = CardType.WATER;

  public hp = 90;

  public weakness = [{ type: CardType.GRASS }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Muddy Water',
      cost: [CardType.WATER, CardType.COLORLESS],
      damage: 20,
      text: 'This attack does 20 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    },
    {
      name: 'Surf',
      cost: [CardType.WATER, CardType.WATER, CardType.COLORLESS],
      damage: 70,
      text: ''
    },
  ];

  public set: string = 'CES';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '34';

  public name: string = 'Marshtomp';

  public fullName: string = 'Marshtomp CES';
  
  public evolvesFrom: string = 'Mudkip';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      
      const hasBenched = opponent.bench.some(b => b.cards.length > 0);
      if (!hasBenched) {
        return state;
      }
      
      state = store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [ SlotType.BENCH ],
        { allowCancel: false }
      ), targets => {
        if (!targets || targets.length === 0) {
          return;
        }
        const damageEffect = new PutDamageEffect(effect, 20);
        damageEffect.target = targets[0];
        store.reduceEffect(state, damageEffect);
      });
        
      return state;
    }
    return state;
  }
}