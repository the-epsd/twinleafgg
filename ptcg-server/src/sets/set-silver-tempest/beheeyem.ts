import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, ChoosePokemonPrompt, GameMessage, PlayerType, SlotType, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Beheeyem extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Elgyem';

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 90;

  public weakness = [{ type: CardType.DARK }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Psychic Sphere',
      cost: [CardType.PSYCHIC],
      damage: 30,
      text: ''
    },
    {
      name: 'Psychic Arrow',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: 0,
      text: 'This attack does 60 damage to 1 of your opponent\'s Pokémon. Also apply Weakness and Resistance for Benched Pokémon.'
    }
  ];

  public set: string = 'SIT';

  public regulationMark = 'F';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '80';

  public name: string = 'Beheeyem';

  public fullName: string = 'Beheeyem PAR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { min: 1, max: 1, allowCancel: false }
      ), selected => {
        const targets = selected || [];
        targets.forEach(target => {
          let damage = 60;
          if (target !== opponent.active) {
            const pokemonCard = target.getPokemonCard();
            if (pokemonCard && pokemonCard.weakness) {
              const weakness = pokemonCard.weakness.find(w => w.type === CardType.PSYCHIC);
              if (weakness) {
                damage *= 2; // Apply weakness
              }
            }
          }
          const damageEffect = new PutDamageEffect(effect, damage);
          damageEffect.target = target;
          store.reduceEffect(state, damageEffect);
        });
      });
    }
    return state;
  }
}
