import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, GameMessage, EnergyCard, PlayerType, SlotType, Card } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';

export class Gothorita2 extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Gothita';
  public cardType: CardType = P;
  public hp: number = 80;
  public weakness = [{ type: P }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Deleting Glare',
      cost: [P],
      damage: 0,
      text: 'Flip a coin. If heads, discard an Energy attached to 1 of your opponent\'s Pokémon.'
    },
    {
      name: 'Super Psy Bolt',
      cost: [P, C, C],
      damage: 50,
      text: ''
    }
  ];

  public set: string = 'EPO';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '46';
  public name: string = 'Gothorita';
  public fullName: string = 'Gothorita EPO 46';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Check if any opponent Pokemon has energy
      let hasEnergyOnField = false;
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
        if (cardList.cards.some(c => c instanceof EnergyCard)) {
          hasEnergyOnField = true;
        }
      });

      if (!hasEnergyOnField) {
        return state;
      }

      COIN_FLIP_PROMPT(store, state, player, result => {
        if (result) {
          return store.prompt(state, new ChoosePokemonPrompt(
            player.id,
            GameMessage.CHOOSE_POKEMON,
            PlayerType.TOP_PLAYER,
            [SlotType.ACTIVE, SlotType.BENCH],
            { allowCancel: false }
          ), targets => {
            if (targets && targets.length > 0) {
              const target = targets[0];
              const energyCards = target.cards.filter(c => c instanceof EnergyCard);
              if (energyCards.length > 0) {
                let cards: Card[] = [];
                return store.prompt(state, new ChooseCardsPrompt(
                  player,
                  GameMessage.CHOOSE_CARD_TO_DISCARD,
                  target,
                  { superType: SuperType.ENERGY },
                  { min: 1, max: 1, allowCancel: false }
                ), selected => {
                  cards = selected || [];
                  if (cards.length > 0) {
                    const discardEnergy = new DiscardCardsEffect(effect, cards);
                    return store.reduceEffect(state, discardEnergy);
                  }
                });
              }
            }
          });
        }
      });
    }
    return state;
  }
}
