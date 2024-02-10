import { PokemonCard, Stage, CardTag, CardType, StoreLike, State, CardTarget, ChoosePokemonPrompt, GameMessage, PlayerType, SlotType, StateUtils, GameError } from '../../game';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class EspeonV extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public regulationMark = 'E';

  public tags = [ CardTag.POKEMON_V ];

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 200;

  public weakness = [{ type: CardType.DARK }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [ CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Zen Shot',
      cost: [ CardType.PSYCHIC ],
      damage: 0,
      text: 'This attack does 60 damage to 1 of your opponent\'s Pokémon V. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    },
    {
      name: 'Super Psy Bolt',
      cost: [ CardType.PSYCHIC, CardType.COLORLESS, CardType.COLORLESS ],
      damage: 120,
      text: ''
    }
  ];

  public set: string = 'EVS';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '158';

  public name: string = 'Espeon V';

  public fullName: string = 'Espeon V EVS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const blocked: CardTarget[] = [];

      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
        if (cardList.vPokemon()) {
          return state;
        } else {
          blocked.push(target);
        }
      });

      if (!blocked.length) {
        throw new GameError(GameMessage.CANNOT_USE_ATTACK);
      }

      if (blocked.length) {
        // Opponent has damaged benched Pokemon


        state = store.prompt(state, new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
          PlayerType.TOP_PLAYER,
          [SlotType.BENCH, SlotType.ACTIVE],
          { min: 1, max: 1, allowCancel: false, blocked: blocked }
        ), target => {
          if (!target || target.length === 0) {
            return;
          }
          const damageEffect = new PutDamageEffect(effect, 60);
          damageEffect.target = target[0];
          store.reduceEffect(state, damageEffect);
        });
      }

      return state;
    }
    return state;
  }

}
