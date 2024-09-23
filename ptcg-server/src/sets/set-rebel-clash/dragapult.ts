import { CoinFlipPrompt, DamageMap, GameLog, GameMessage, PlayerType, Power, PowerType, PutDamagePrompt, SlotType, State, StateUtils, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { PutCountersEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';

export class Dragapult extends PokemonCard {

  public stage: Stage = Stage.STAGE_2;

  public regulationMark = 'D';

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 150;

  public weakness = [{ type: CardType.DARK }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [];

  public powers: Power[] = [{
    name: 'Infiltrator',
    useWhenInPlay: false,
    powerType: PowerType.ABILITY,
    text: 'If any damage is done to this Pokémon by attacks, flip a coin. If heads, prevent that damage.'
  }];

  public attacks =
    [
      {
        name: 'Phantom Force',
        cost: [CardType.PSYCHIC, CardType.PSYCHIC],
        damage: 120,
        text: 'Put 3 damage counters on your opponent\'s Benched Pokémon in any way you like.'
      }
    ];

  public set: string = 'RCL';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '91';

  public evolvesFrom: string = 'Drakloak';

  public name: string = 'Dragapult';

  public fullName: string = 'Dragapult RCL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PutDamageEffect && effect.target.cards.includes(this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      try {
        const stub = new PowerEffect(player, {
          name: 'test',
          powerType: PowerType.ABILITY,
          text: ''
        }, this);
        store.reduceEffect(state, stub);
      } catch {
        return state;
      }

      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], result => {
        if (result === true) {
          effect.preventDefault = true;
          store.log(state, GameLog.LOG_ABILITY_BLOCKS_DAMGE, { name: opponent.name, pokemon: this.name });
          return state;
        }
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const maxAllowedDamage: DamageMap[] = [];

      const oppHasBenched = opponent.bench.some(b => b.cards.length > 0);

      if (!oppHasBenched) {
        return state;
      }

      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
        maxAllowedDamage.push({ target, damage: card.hp + 30 });
      });

      return store.prompt(state, new PutDamagePrompt(
        effect.player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.BENCH],
        30,
        maxAllowedDamage,
        { allowCancel: false }
      ), targets => {
        const results = targets || [];
        for (const result of results) {
          const target = StateUtils.getTarget(state, player, result.target);
          const putCountersEffect = new PutCountersEffect(effect, result.damage);
          putCountersEffect.target = target;
          store.reduceEffect(state, putCountersEffect);
        }
      });
    }

    return state;
  }
}