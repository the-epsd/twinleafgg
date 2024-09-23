import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { State } from '../../game/store/state/state';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { StoreLike } from '../../game/store/store-like';
import { Effect } from '../../game/store/effects/effect';
import { ChoosePokemonPrompt, GameMessage, PlayerType, SlotType } from '../../game';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';

export class ScreamTail extends PokemonCard {

  public regulationMark = 'G';

  public tags = [CardTag.ANCIENT];

  public stage = Stage.BASIC;

  public cardType = CardType.PSYCHIC;

  public hp = 90;

  public weakness = [{ type: CardType.DARK }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Slap',
      cost: [CardType.PSYCHIC],
      damage: 30,
      text: ''
    },
    {
      name: 'Roaring Scream',
      cost: [CardType.PSYCHIC, CardType.COLORLESS],
      damage: 0,
      text: 'This attack does 20 damage to 1 of your opponent\'s Pokémon for each damage counter on this Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    }
  ];

  public set: string = 'PAR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '86';
  public name: string = 'Scream Tail';
  public fullName: string = 'Scream Tail PAR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      const max = Math.min(1);
      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { min: max, max, allowCancel: false }
      ), selected => {
        const targets = selected || [];
        targets.forEach(target => {
          const damageCounters = effect.player.active.damage;
          const damageOutput = damageCounters * 2;
          const damageEffect = new PutDamageEffect(effect, damageOutput);
          damageEffect.target = target;
          store.reduceEffect(state, damageEffect);
        });
        return state;
      });
    }
    return state;
  }
}
