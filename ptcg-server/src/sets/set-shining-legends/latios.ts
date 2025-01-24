import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, PlayerType, SlotType, ChoosePokemonPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { StateUtils } from '../../game/store/state-utils';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { AttackEffect } from '../../game/store/effects/game-effects';

// SLG Latios 41 (https://limitlesstcg.com/cards/SLG/41)
export class Latios extends PokemonCard {

  public tags = [];

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 110;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Break Through',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: 30,
      text: 'This attack does 30 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    },
    {
      name: 'Lagoon Flight',
      cost: [CardType.PSYCHIC, CardType.COLORLESS, CardType.COLORLESS,],
      damage: 70,
      text: ''
    }
  ];

  public set: string = 'SLG';

  public setNumber = '41';

  public cardImage = 'assets/cardback.png';

  public name: string = 'Latios';

  public fullName: string = 'Latios SLG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Break Through
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
        [SlotType.BENCH],
        { allowCancel: false }
      ), targets => {
        if (!targets || targets.length === 0) {
          return;
        }
        const damageEffect = new PutDamageEffect(effect, 30);
        damageEffect.target = targets[0];
        store.reduceEffect(state, damageEffect);
      });
    }

    return state;
  }
}