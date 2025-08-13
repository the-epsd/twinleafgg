import { PokemonCard, CardTag, Stage, CardType, StoreLike, State, StateUtils, ChoosePokemonPrompt, GameMessage, PlayerType, SlotType } from '../../game';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { MOVE_CARDS } from '../../game/store/prefabs/prefabs';

export class Hydreigonex extends PokemonCard {

  public tags = [CardTag.POKEMON_ex, CardTag.POKEMON_TERA];

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Zweilous';

  public cardType: CardType = D;

  public hp: number = 330;

  public weakness = [{ type: G }];

  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Crash Heads',
      cost: [D, C],
      damage: 200,
      text: 'Discard the top 3 cards from your opponent\'s deck.'
    },

    {
      name: 'Obsidian',
      cost: [P, D, M, C],
      damage: 130,
      text: 'This attack also does 130 damage to 2 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    }
  ];

  public regulationMark = 'H';

  public set: string = 'SSP';

  public setNumber: string = '119';

  public cardImage: string = 'assets/cardback.png';

  public name: string = 'Hydreigon ex';

  public fullName: string = 'Hydreigon ex SSP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Crash Heads
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      MOVE_CARDS(store, state, opponent.deck, opponent.discard, { count: 3, sourceCard: this, sourceEffect: this.attacks[0] });

      return state;
    }

    // Obsidian
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const hasBenched = opponent.bench.some(b => b.cards.length > 0);
      if (!hasBenched) {
        return state;
      }

      const benched = opponent.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);
      const count = Math.min(2, benched);

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.BENCH],
        { min: count, max: count, allowCancel: false }
      ), targets => {
        if (!targets || targets.length === 0) {
          return;
        }
        targets.forEach(target => {
          const damageEffect = new PutDamageEffect(effect, 130);
          damageEffect.target = target;
          store.reduceEffect(state, damageEffect);
        });
      });
    }

    if (effect instanceof PutDamageEffect && effect.target.cards.includes(this) && effect.target.getPokemonCard() === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Target is not Active
      if (effect.target === player.active || effect.target === opponent.active) {
        return state;
      }

      effect.preventDefault = true;
    }
    return state;
  }
}