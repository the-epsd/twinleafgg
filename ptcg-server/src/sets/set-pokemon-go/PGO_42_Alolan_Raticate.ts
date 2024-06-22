import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, ChooseCardsPrompt, GameMessage, ShuffleDeckPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';

export class AlolanRaticate extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Alolan Rattata';
  public cardType: CardType = CardType.DARK;
  public hp: number = 120;
  public weakness = [{ type: CardType.GRASS }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [{
    name: 'Chase Up',
    cost: [CardType.DARK],
    damage: 0,
    text: 'Search your deck for a card and put it into your hand. Then, shuffle your deck.'
  },
  {
    name: 'Super Fang',
    cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
    damage: 0,
    text: 'Put damage counters on your opponent\'s Active Pokémon until its remaining HP is 10. '
  }];

  public set: string = 'PGO';
  public regulationMark: string = 'F';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '42';
  public name: string = 'Alolan Raticate';
  public fullName: string = 'Alolan Raticate PGO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      state = store.prompt(state, new ChooseCardsPrompt(
        player.id,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.deck,
        {},
        { min: 0, max: 1, allowCancel: false }
      ), cards => {
        player.deck.moveCardsTo(cards, player.hand);

        state = store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
          player.deck.applyOrder(order);
        });

        return state;
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const selectedTarget = opponent.active;
      const selectedPokemonCard = selectedTarget.getPokemonCard();
      const hp = selectedPokemonCard?.hp;
      const remainingHp = hp ? hp - 10 : 0;
      console.log('Pokemon\'s remaining hp: ' + remainingHp);
      const damageEffect = new PutDamageEffect(effect, remainingHp);
      damageEffect.target = selectedTarget;
      store.reduceEffect(state, damageEffect);
    }

    return state;
  }
}