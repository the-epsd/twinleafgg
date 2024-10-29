import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { StateUtils, ChoosePokemonPrompt, GameMessage, PlayerType, SlotType } from '../../game';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';

export class Hitmonlee extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.FIGHTING;
  public hp: number = 60;
  public weakness = [{ type: CardType.PSYCHIC, value: 2 }];
  public resistance = [];
  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Stretch Kick',
      cost: [CardType.FIGHTING, CardType.FIGHTING],
      damage: 0,
      text: 'If your opponent has any Benched Pokémon, choose 1 of them and this attack does 20 damage to it. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    },
    {
      name: 'High Jump Kick',
      cost: [CardType.FIGHTING, CardType.FIGHTING, CardType.FIGHTING],
      damage: 50,
      text: ''
    }
  ];

  public set: string = 'FO';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '7';

  public name: string = 'Hitmonlee';

  public fullName: string = 'Hitmonlee FO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
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
        const damageEffect = new PutDamageEffect(effect, 20);
        damageEffect.target = targets[0];
        store.reduceEffect(state, damageEffect);
      });
    }
    return state;
  }
}
