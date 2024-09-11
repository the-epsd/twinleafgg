import { ChoosePokemonPrompt, GameError, GameMessage, PlayerType, SlotType, State, StateUtils, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Hitmonlee extends PokemonCard {

  public name = 'Hitmonlee';

  public set = 'TEU';

  public fullName = 'Hitmonlee TEU';

  public stage = Stage.BASIC;

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '73';

  public hp = 100;

  public cardType = CardType.FIGHTING;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Special Combo',
      cost: [CardType.FIGHTING],
      damage: 0,
      text: 'You can use this attack only if your Hitmonchan used Hit and Run during your last turn. This attack does 90 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    },
    {
      name: 'Mega Kick',
      cost: [CardType.FIGHTING, CardType.FIGHTING, CardType.COLORLESS],
      damage: 90,
      text: ''
    }
  ];

  public hitAndRunTurn = -10;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const hasBench = opponent.bench.some(b => b.cards.length > 0);

      if (!hasBench) {
        return state;
      }

      if (state.turn !== this.hitAndRunTurn + 2) {
        throw new GameError(GameMessage.CANNOT_USE_ATTACK);
      }

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.BENCH],
        { min: 1, max: 1, allowCancel: false }
      ), selected => {
        const targets = selected || [];
        targets.forEach(target => {
          const damageEffect = new PutDamageEffect(effect, 90);
          damageEffect.target = target;
          store.reduceEffect(state, damageEffect);
        });

        return state;
      });
    }

    if (effect instanceof AttackEffect && effect.attack.name === 'Hit and Run' && effect.player.active.getPokemonCard()!.name === 'Hitmonchan') {
      this.hitAndRunTurn = state.turn;
    }
    return state;
  }
}
