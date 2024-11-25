import { CardTarget, CardType, ChooseCardsPrompt, ChoosePokemonPrompt, CoinFlipPrompt, EnergyCard, GameMessage, PlayerType, PokemonCardList, SlotType, Stage, State, StateUtils, StoreLike, SuperType } from '../../game';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Sneasel extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.DARK;

  public hp: number = 70;

  public weakness = [{ type: CardType.FIGHTING }];

  public resistance = [{ type: CardType.PSYCHIC, value: -20 }];

  public retreat = [ CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Sneaky Smash',
      cost: [CardType.COLORLESS],
      damage: 0,
      text: 'You can use this attack only if you go second, and only on your first turn. Discard an Energy from 1 of your opponent\'s Pokémon.'
    },
    {
      name: 'Ambush',
      cost: [CardType.DARK],
      damage: 10,
      damageCalculation: '+',
      text: 'Flip a coin. If heads, this attack does 20 more damage.'
    }
  ];

  public set: string = 'UPR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '73';

  public name: string = 'Sneasel';

  public fullName: string = 'Sneasel UPR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      
      return store.prompt(state, [
        new CoinFlipPrompt(effect.player.id, GameMessage.COIN_FLIP),
      ], heads => {
        if (heads) {
          effect.damage += 20;
        }
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Opponent has no energy cards attached
      if (!opponent.active.cards.some(c => c instanceof EnergyCard) && !opponent.bench.some(c => c.cards.some(c => c instanceof EnergyCard))) {
        return state;
      }

      const blocked: CardTarget[] = [];
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
        if (!cardList.cards.some(c => c instanceof EnergyCard)) {
          blocked.push(target);
        }
      });
      
      let targets: PokemonCardList[] = [];
        return store.prompt(state, new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_DISCARD_CARDS,
          PlayerType.ANY,
          [SlotType.ACTIVE, SlotType.BENCH],
          { min: 1, max: 1, allowCancel: false, blocked }
        ), results => {
          targets = results || [];

          if (targets.length === 0) {
            return state;
          }

          return store.prompt(state, new ChooseCardsPrompt(
            opponent,
            GameMessage.CHOOSE_CARD_TO_DISCARD,
            targets[0],
            { superType: SuperType.ENERGY },
            { min: 1, max: 1, allowCancel: false }
          ), selected => {
            targets[0].moveCardTo(selected[0], opponent.discard);
            return state;
          });
        });
      }
    
    return state;
  }
}