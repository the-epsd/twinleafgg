import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, PlayerType, SlotType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { DamageMap } from '../../game';
import { PutDamagePrompt } from '../../game';
import { PutCountersEffect } from '../../game/store/effects/attack-effects';
import { CheckHpEffect } from '../../game/store/effects/check-effects';
import { StateUtils } from '../../game/store/state-utils';
import { AttackEffect } from '../../game/store/effects/game-effects';

// GRI Oricorio 56 (https://limitlesstcg.com/cards/GRI/56)
export class Oricorio2 extends PokemonCard {

  public tags = [];

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 90;

  public weakness = [{ type: CardType.DARK }];

  public resistance = [{ type: CardType.FIGHTING, value: -20 }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Supernatural Dance',
      cost: [CardType.COLORLESS],
      damage: 0,
      text: 'For each Pokémon in your opponent\'s discard pile, put 1 damage counter on your opponent\'s Pokémon in any way you like. '
    },
    {
      name: 'Revelation Dance',
      cost: [CardType.COLORLESS],
      damage: 30,
      text: 'If there is no Stadium card in play, this attack does nothing.'
    }
  ];

  public set: string = 'GRI';

  public setNumber = '56';

  public cardImage = 'assets/cardback.png';

  public name: string = 'Oricorio';

  public fullName: string = 'Oricorio GRI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Supernatural Dance
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let pokemonCount = 0;
      opponent.discard.cards.forEach(c => {
        if (c instanceof PokemonCard) {
          pokemonCount += 10;
        }
      });

      if (pokemonCount === 0) {
        return state;
      }

      const maxAllowedDamage: DamageMap[] = [];
      let damageLeft = 0;
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
        const checkHpEffect = new CheckHpEffect(opponent, cardList);
        store.reduceEffect(state, checkHpEffect);
        damageLeft += checkHpEffect.hp - cardList.damage;
        maxAllowedDamage.push({ target, damage: checkHpEffect.hp });
      });

      const damage = Math.min(pokemonCount, damageLeft);

      return store.prompt(state, new PutDamagePrompt(
        effect.player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        damage,
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

    // Revelation Dance
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      if (!StateUtils.getStadiumCard(state)) {
        effect.damage = 0;
      }
    }

    return state;
  }
}