import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, PlayerType, SlotType, ChoosePokemonPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CoinFlipPrompt } from '../../game';
import { StateUtils } from '../../game/store/state-utils';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { AttackEffect } from '../../game/store/effects/game-effects';

// CIN Dartrix 57 (https://limitlesstcg.com/cards/CIN/57)
export class Dartrix extends PokemonCard {

  public tags = [];

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Rowlet';

  public cardType: CardType = CardType.GRASS;

  public hp: number = 80;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    { name: 'Sharp Blade Quill', cost: [CardType.COLORLESS], damage: 0, text: 'This attack does 20 damage to 1 of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)' },
    { name: 'Leaf Blade', cost: [CardType.GRASS, CardType.COLORLESS, CardType.COLORLESS], damage: 50, text: 'Flip a coin. If heads, this attack does 20 more damage.' },
  ];

  public set: string = 'SUM';

  public setNumber = '10';

  public cardImage = 'assets/cardback.png';

  public name: string = 'Dartrix';

  public fullName: string = 'Dartrix SUM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Sharp Blade Quill
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const hasBenched = opponent.bench.some(b => b.cards.length > 0);
      if (!hasBenched) {
        return state;
      }

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { allowCancel: false }
      ), targets => {
        if (!targets || targets.length === 0) {
          return;
        }
        const damageEffect = new PutDamageEffect(effect, 20);
        damageEffect.target = targets[0];
        store.reduceEffect(state, damageEffect);
      });
    }

    // Leaf Blade
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], results => {
        if (results === true) {
          effect.damage += 20;
        }
      });

    }


    return state;
  }
}