import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage, SuperType } from '../../../game/store/card/card-types';
import { ChooseCardsPrompt, GameError, GameMessage, PokemonCardList, PowerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { HealEffect } from '../../../game/store/effects/game-effects';
import { DRAW_CARDS, MOVE_CARDS, WAS_ATTACK_USED, WAS_POWER_USED } from '../../../game/store/prefabs/prefabs';

export class Igglybuff extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 50;
  public cardType: CardType[] = [C];
  public weakness = [{ type: F, value: +10 }];
  public retreat = [C];

  public powers = [{
    name: 'Baby Evolution',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn (before your attack), you may put Jigglypuff from your hand onto Igglybuff (this counts as evolving Igglybuff) and remove all damage counters from Igglybuff.',
    useWhenInPlay: true
  }];

  public attacks = [{
    name: 'Inquire',
    cost: [],
    damage: 0,
    text: 'Draw a card. If you didn\'t play any Supporter card from your hand during this turn, draw 2 more cards.'
  }];

  public set: string = 'GE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '70';
  public name: string = 'Igglybuff';
  public fullName: string = 'Igglybuff GE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Baby Evolution
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const hasEvolution = player.hand.cards.some(card => card instanceof PokemonCard && card.name === 'Jigglypuff');
      if (!hasEvolution) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      const blocked: number[] = [];
      player.hand.cards.forEach((card, index) => {
        if (!(card instanceof PokemonCard && card.name === 'Jigglypuff')) {
          blocked.push(index);
        }
      });
      store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_EVOLVE,
        player.hand,
        { superType: SuperType.POKEMON },
        { min: 1, max: 1, allowCancel: true, blocked }
      ), selected => {
        const selectedCards = selected || [];
        if (selectedCards.length === 0) {
          return;
        }
        const target = StateUtils.findCardList(state, this) as PokemonCardList;
        MOVE_CARDS(store, state, player.hand, target, { cards: selectedCards, sourceCard: this });
        target.clearEffects();
        target.pokemonPlayedTurn = state.turn;
        const healEffect = new HealEffect(player, target, target.damage);
        store.reduceEffect(state, healEffect);
      });
    }

    // Inquire
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      DRAW_CARDS(store, state, player, 1);
      if (player.supporterTurn === 0) {
        DRAW_CARDS(store, state, player, 2);
      }
    }

    return state;
  }
}
