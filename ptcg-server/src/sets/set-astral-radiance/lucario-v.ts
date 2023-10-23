import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, EnergyType, SuperType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { StateUtils } from '../../game/store/state-utils';
import { Card, CardTarget, ChooseCardsPrompt, ChoosePokemonPrompt, EnergyCard, GameMessage, PlayerType, PokemonCardList, SlotType } from '../../game';


export class LucarioV extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public tags = [ CardTag.POKEMON_V ];

  public cardType: CardType = CardType.FIGHTING;

  public regulationMark = 'F';

  public hp: number = 210;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Crushing Punch',
      cost: [ CardType.COLORLESS, CardType.COLORLESS ],
      damage: 50,
      text: 'Discard a Special Energy from your opponent\'s Active Pokémon.'
    },
    {
      name: 'Cyclone Kick',
      cost: [ CardType.FIGHTING, CardType.COLORLESS, CardType.COLORLESS ],
      damage: 120,
      text: ''
    }
  ];

  public set: string = 'ASR';

  public set2: string = 'astralradiance';

  public setNumber: string = '78';

  public name: string = 'Lucario V';

  public fullName: string = 'Lucario V ASR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      
      let hasPokemonWithEnergy = false;
      const blocked: CardTarget[] = [];
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
        if (cardList.cards.some(c => c instanceof EnergyCard && c.energyType === EnergyType.SPECIAL)) {
          hasPokemonWithEnergy = true;
        } else {
          blocked.push(target);
        }
      });
      
      if (hasPokemonWithEnergy) {
      
        let targets: PokemonCardList[] = [];
        store.prompt(state, new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_DISCARD_CARDS,
          PlayerType.TOP_PLAYER,
          [ SlotType.ACTIVE, SlotType.BENCH ],
          { allowCancel: true, blocked }
        ), results => {
          targets = results || [];
          
        });
      
        if (targets.length === 0) {
          return state;
        }
      
        const target = targets[0];
        let cards: Card[] = [];
        store.prompt(state, new ChooseCardsPrompt(
          player.id,
          GameMessage.CHOOSE_CARD_TO_DISCARD,
          target,
          { superType: SuperType.ENERGY, energyType: EnergyType.SPECIAL },
          { min: 1, max: 1, allowCancel: true }
        ), selected => {
          cards = selected || [];
          
        });
      
        if (cards.length > 0) {
        // Discard selected special energy card
          target.moveCardsTo(cards, opponent.discard);
        }}
      
      return state;
    }
    return state;
  }
}