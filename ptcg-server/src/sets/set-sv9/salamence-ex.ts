import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, PlayerType, Card, EnergyCard, ChooseEnergyPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { DiscardCardsEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { StateUtils } from '../../game/store/state-utils';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Salamenceex extends PokemonCard {
  public tags = [ CardTag.POKEMON_ex ];
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Shelgon';
  public cardType: CardType = CardType.DRAGON;
  public hp: number = 320;
  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public attacks = [
    { 
      name: 'Wide Blast', 
      cost: [ CardType.FIRE, CardType.COLORLESS, CardType.COLORLESS ], 
      damage: 0, 
      text: 'This attack does 50 damage to each of your opponent’s Benched Pokémon. (Don’t apply Weakness and Resistance for Benched Pokémon.)' 
    },
    { 
      name: 'Dragon Impact', 
      cost: [ CardType.FIRE, CardType.WATER, CardType.COLORLESS, CardType.COLORLESS ], 
      damage: 300, 
      text: 'Discard 2 Energy from this Pokémon.' 
    },
        
  ];

  public set: string = 'SV9';
  public regulationMark = 'I';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '72';

  public name: string = 'Salamence ex';
  public fullName: string = 'Salamence ex SV9';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Wide Blast
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) =>{
        if (cardList !== opponent.active){
          const damageEffect = new PutDamageEffect(effect, 50);
          damageEffect.target = cardList;
          store.reduceEffect(state, damageEffect);
        }
      });
    }

    // Dragon Impact
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
        [ CardType.COLORLESS, CardType.COLORLESS ],
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
