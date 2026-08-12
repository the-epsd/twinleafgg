import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardTag, CardType, Stage } from '../../../game/store/card/card-types';
import { StoreLike, State, GameMessage, StateUtils, DamageMap, PlayerType, PutDamagePrompt, SlotType } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { OPPONENT_CANNOT_PLAY_CARDS } from '../../../game/store/prefabs/effect-of-attack-prefabs';
import { CheckHpEffect } from '../../../game/store/effects/check-effects';
import { PutCountersEffect } from '../../../game/store/effects/attack-effects';
import { PUT_X_DAMAGE_COUNTERS_ON_YOUR_OPPONENTS_ACTIVE_POKEMON } from '../../../game/store/prefabs/attack-effects';

export class Dragoniteex extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Dragonair';
  protected _tags = [CardTag.POKEMON_ex, CardTag.DELTA_SPECIES];
  public cardType: CardType = G;
  public hp: number = 150;
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Deafen',
      cost: [C, C],
      damage: 40,
      text: "Your opponent can't play any Trainer cards (except for Supporter cards) from his or her hand during your opponent's next turn.",
    },
    {
      name: 'Dragon Roar',
      cost: [G, G, C, C],
      damage: 0,
      text: "Put 8 damage counters on the Defending Pokémon. If that Pokémon would be Knocked Out by this attack, put any damage counters not necessary to Knock Out the Defending Pokémon on your opponent's Benched Pokémon in any way you like.",
    },
  ];

  public set: string = 'DF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '91';
  public name: string = 'Dragonite ex';
  public fullName: string = 'Dragonite ex DF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Deafen
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return OPPONENT_CANNOT_PLAY_CARDS(store, state, effect, this, { item: true, tool: true, stadium: true });
    }

    // Dragon Roar
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const opponent = effect.opponent;
      const defending = opponent.active;
      const checkHpEffect = new CheckHpEffect(opponent, defending);
      store.reduceEffect(state, checkHpEffect);
      const currentDamage = defending.damage;
      const damageToKO = Math.max(0, checkHpEffect.hp - currentDamage);
      const damageToPlace = Math.min(80, damageToKO);
      if (damageToPlace > 0) {
        PUT_X_DAMAGE_COUNTERS_ON_YOUR_OPPONENTS_ACTIVE_POKEMON(
          damageToPlace / 10,
          store,
          state,
          effect,
        );
      }
      const remainingDamage = 80 - damageToPlace;
      if (remainingDamage > 0) {
        const opponentBench = opponent.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);
        if (opponentBench === 0) {
          return state;
        }
        const maxAllowedDamage: DamageMap[] = [];
        opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
          maxAllowedDamage.push({ target, damage: card.hp + (cardList.damage || 0) });
        });
        return store.prompt(state, new PutDamagePrompt(
          effect.player.id,
          GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
          PlayerType.TOP_PLAYER,
          [SlotType.BENCH],
          remainingDamage,
          maxAllowedDamage,
          { allowCancel: false }
        ), targets => {
          const results = targets || [];
          const player = effect.player;
          for (const result of results) {
            const target = StateUtils.getTarget(state, player, result.target);
            const putCountersEffect = new PutCountersEffect(effect, result.damage);
            putCountersEffect.target = target;
            store.reduceEffect(state, putCountersEffect);
          }
        });
      }
    }
    return state;
  }
}
