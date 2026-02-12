import { Effect } from '../../game/store/effects/effect';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State, GameMessage, StateUtils, ChoosePokemonPrompt, PlayerType, SlotType, Card, ChooseCardsPrompt } from '../../game';
import { CONFIRMATION_PROMPT, IS_POKEPOWER_BLOCKED, JUST_EVOLVED, MOVE_CARDS, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { AfterDamageEffect } from '../../game/store/effects/attack-effects';

export class Weavile extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Sneasel';
  public cardType: CardType = D;
  public hp: number = 80;
  public weakness = [{ type: F }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [];

  public powers = [{
    name: 'Claw Snag',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn, when you play Weavile from your hand to evolve 1 of your Pokémon, you may look at your opponent\'s hand. Choose a card from your opponent\'s hand and discard it.'
  }];

  public attacks = [{
    name: 'Feint Attack',
    cost: [D, C],
    damage: 0,
    shredAttack: true,
    text: 'Choose 1 of your opponent\'s Pokémon. This attack does 30 damage to that Pokémon. This attack\'s damage isn\'t affected by Weakness, Resistance, Poké-Powers, Poké-Bodies, or any other effects on that Pokémon.'
  }];

  public set: string = 'UD';
  public setNumber: string = '25';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Weavile';
  public fullName: string = 'Weavile UD';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (JUST_EVOLVED(effect, this) && !IS_POKEPOWER_BLOCKED(store, state, effect.player, this)) {

      CONFIRMATION_PROMPT(store, state, effect.player, wantToUse => {
        if (wantToUse) {
          const player = effect.player;
          const opponent = StateUtils.getOpponent(state, player);

          if (opponent.hand.cards.length === 0) {
            return state;
          }

          let cards: Card[] = [];
          store.prompt(state, new ChooseCardsPrompt(
            player,
            GameMessage.CHOOSE_CARD_TO_DISCARD,
            opponent.hand,
            {},
            { min: 1, max: 1, allowCancel: false }
          ), selected => {
            cards = selected || [];
            MOVE_CARDS(store, state, opponent.hand, opponent.discard, { cards, sourceEffect: this.powers[0] });
            return state;
          });
        }
      }, GameMessage.WANT_TO_USE_ABILITY);
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.BENCH, SlotType.ACTIVE],
      ), selected => {
        const target = selected[0];
        target.damage += 30;
        const afterDamage = new AfterDamageEffect(effect, 30);
        state = store.reduceEffect(state, afterDamage);
      });
    }

    return state;
  }
}