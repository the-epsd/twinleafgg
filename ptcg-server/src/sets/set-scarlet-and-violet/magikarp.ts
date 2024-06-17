import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, ChoosePokemonPrompt, GameMessage, PlayerType, SlotType, CoinFlipPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Magikarp extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.WATER;

  public hp: number = 30;

  public weakness = [{ type: CardType.LIGHTNING }];

  public retreat = [ CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Jump',
      cost: [ CardType.WATER ],
      damage: 0,
      text: 'Flip a coin. If heads, this attack does 10 damage to 1 of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    }
  ];

  public set: string = 'SVI';

  public regulationMark = 'G';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '44';

  public name: string = 'Magikarp';

  public fullName: string = 'Magikarp SVI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], result => {
        if (result === true) {

          return store.prompt(state, new ChoosePokemonPrompt(
            player.id,
            GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
            PlayerType.TOP_PLAYER,
            [ SlotType.ACTIVE, SlotType.BENCH ],
            { min: 1, max: 1, allowCancel: false }
          ), selected => {
            const targets = selected || [];
            targets.forEach(target => {
              const damageEffect = new PutDamageEffect(effect, 10);
              damageEffect.target = target;
              store.reduceEffect(state, damageEffect);
            });
            return state; 
          });
        }
      });
    }
    return state;
  }
}