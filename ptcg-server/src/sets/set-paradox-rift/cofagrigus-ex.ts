import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, PlayerType, SlotType, GamePhase, Card, ChooseCardsPrompt, ShuffleDeckPrompt, PowerType, GameLog } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { DamageMap } from '../../game';
import { PutDamagePrompt } from '../../game';
import { PutCountersEffect } from '../../game/store/effects/attack-effects';
import { CheckHpEffect } from '../../game/store/effects/check-effects';
import { StateUtils } from '../../game/store/state-utils';
import { AttackEffect, KnockOutEffect, PowerEffect } from '../../game/store/effects/game-effects';

export class Cofagrigusex extends PokemonCard {
  public tags = [ CardTag.POKEMON_ex ];
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Yamask';
  public cardType: CardType = CardType.PSYCHIC;
  public hp: number = 260;
  public weakness = [{ type: CardType.DARK }];
  public resistance = [{ type: CardType.FIGHTING, value: -30 }];
  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public powers = [{
    name: 'Gold Coffin',
    powerType: PowerType.ABILITY,
    text: 'If this Pokémon is Knocked Out by damage from an attack from your opponent\'s Pokémon, search your deck for a card and put it into your hand. Then, shuffle your deck.'
  }];

  public attacks = [
    { 
      name: 'Hollow Hands', 
      cost: [ CardType.PSYCHIC, CardType.PSYCHIC ], 
      damage: 110, 
      text: 'Put 5 damage counters on your opponent\'s Benched Pokémon in any way you like.' 
    }
  ];

  public set: string = 'PAR';
  public regulationMark = 'G';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '76';

  public name: string = 'Cofagrigus ex';
  public fullName: string = 'Cofagrigus ex PAR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Gold Coffin
    if (effect instanceof KnockOutEffect && effect.target.cards.includes(this)) {
      const player = effect.player;

      // i love checking for ability lock woooo
      try {
        const powerEffect = new PowerEffect(player, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        return state;
      }

      if (state.phase !== GamePhase.ATTACK) {
        return state;
      }

      if (player.deck.cards.length === 0) {
        return state;
      }

      store.log(state, GameLog.LOG_PLAYER_USES_ABILITY, { name: player.name, card: 'Cofagrigus ex' });

      let cards: Card[] = [];
      store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.deck,
        { },
        { min: 0, max: 1, allowCancel: false }
      ), selected => {
        cards = selected || [];
        player.deck.moveCardsTo(cards, player.hand);
      });
        
      store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
      });
    }


    // Hollow Hands
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const hasBenched = opponent.bench.some(b => b.cards.length > 0);
      if (!hasBenched) {
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

      const damage = Math.min(50, damageLeft);

      return store.prompt(state, new PutDamagePrompt(
        effect.player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [ SlotType.BENCH ],
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

    return state;
  }
}