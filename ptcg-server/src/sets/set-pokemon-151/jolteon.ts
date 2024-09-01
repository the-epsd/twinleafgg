import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, ChoosePokemonPrompt, GameMessage, PlayerType, SlotType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';

export class Jolteon extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Eevee';

  public cardType: CardType = CardType.LIGHTNING;

  public hp: number = 110;

  public weakness = [{ type: CardType.FIGHTING }];

  public resistance = [];

  public retreat = [];

  public attacks = [
    {
      name: 'Linear Attack',
      cost: [CardType.LIGHTNING],
      damage: 0,
      text: 'This attack does 30 damage to 1 of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    },
    {
      name: 'Fighting Lightning',
      cost: [CardType.LIGHTNING, CardType.COLORLESS, CardType.COLORLESS],
      damage: 90,
      damageCalculation: '+',
      text: 'If your opponent\'s Active Pokémon is a Pokémon ex or Pokémon V, this attack does 90 more damage.'
    }
  ];

  public set: string = 'MEW';

  public regulationMark = 'G';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '135';

  public name: string = 'Jolteon';

  public fullName: string = 'Jolteon MEW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {


    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
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
          const damageEffect = new PutDamageEffect(effect, 30);
          damageEffect.target = target;
          store.reduceEffect(state, damageEffect);
        });
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const opponentActive = opponent.active.getPokemonCard();
      if (opponentActive && (opponentActive.tags.includes(CardTag.POKEMON_V || CardTag.POKEMON_VSTAR || CardTag.POKEMON_VMAX || CardTag.POKEMON_ex))) {
        effect.damage += 90;
      }
    }
    return state;
  }
}