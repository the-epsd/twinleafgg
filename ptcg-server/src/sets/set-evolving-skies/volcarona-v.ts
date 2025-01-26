import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SuperType, EnergyType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Card, ChooseEnergyPrompt, EnergyCard, GameMessage, ShuffleDeckPrompt } from '../../game';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';

export class VolcaronaV extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [ CardTag.POKEMON_V ];
  public cardType: CardType = R;
  public hp: number = 210;
  public weakness = [{ type: W }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Surging Flames',
    cost: [R],
    damage: 20,
    damageCalculation: '+',
    text: 'This attack does 20 more damage for each basic Energy card in your discard pile. Then, shuffle those Energy cards into your deck.'
  },
  {
    name: 'Fire Blast',
    cost: [R, R, C],
    damage: 160,
    text: 'Discard an Energy from this Pokémon.'
  }];

  public set: string = 'EVS';
  public name: string = 'Volcarona V';
  public fullName: string = 'Volcarona V EVS';
  public setNumber: string = '21';
  public regulationMark: string = 'E';
  public cardImage: string = 'assets/cardback.png';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Surging Flames
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]){
      const player = effect.player;
      // counting the energies
      const energiesInDiscard = player.discard.cards.filter(c => c instanceof EnergyCard && c.superType === SuperType.ENERGY && c.energyType === EnergyType.BASIC).length;
      if (energiesInDiscard === 0){
        return state;
      }

      effect.damage += 20 * energiesInDiscard;
      // slapping those energies back into the deck
      player.discard.cards.forEach(c => {
        if (c instanceof EnergyCard && c.superType === SuperType.ENERGY && c.energyType === EnergyType.BASIC) {
          player.discard.moveCardTo(c, player.deck);
        }
      });

      return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
      });
    }

    // Fire Blast
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]){
      const player = effect.player;

      if (!player.active.cards.some(c => c instanceof EnergyCard)) {
        return state;
      }

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      state = store.prompt(state, new ChooseEnergyPrompt(
        player.id,
        GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
        checkProvidedEnergy.energyMap,
        [CardType.COLORLESS],
        { allowCancel: false }
      ), energy => {
        const cards: Card[] = (energy || []).map(e => e.card);
        const discardEnergy = new DiscardCardsEffect(effect, cards);
        discardEnergy.target = player.active;
        store.reduceEffect(state, discardEnergy);
      });
    }
    
    return state;
  }
}