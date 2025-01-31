import { PokemonCard, Stage, CardType, CardTag, State, StoreLike, PokemonCardList, ChoosePokemonPrompt, GameMessage, PlayerType, SlotType, EnergyCard, ChooseEnergyPrompt, Card } from '../../game';
import {AfterDamageEffect} from '../../game/store/effects/attack-effects';
import {CheckProvidedEnergyEffect} from '../../game/store/effects/check-effects';
import {Effect} from '../../game/store/effects/effect';
import {AttackEffect} from '../../game/store/effects/game-effects';

export class Quaquavalex extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Quaxwell';
  public tags = [ CardTag.POKEMON_ex ];
  public cardType: CardType = W;
  public hp: number = 320;
  public weakness = [{ type: L }];
  public retreat = [ C, C ];

  public attacks = [
    {
      name: 'Exciting Dance',
      cost: [ W ],
      damage: 60,
      text: 'Switch this Pokémon with 1 of your Benched Pokémon. If you do, switch out your opponent\'s Active Pokémon to the Bench. (Your opponent chooses the new Active Pokémon.)'
    },
    {
      name: 'Spiral Shot',
      cost: [ W, C ],
      damage: 230,
      text: 'Put 2 Energy attached to this Pokémon into your hand.'
    },
    
  ];

  public regulationMark = 'G';
  public set: string = 'PAL';
  public setNumber: string = '52';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Quaquaval ex';
  public fullName: string = 'Quaquaval ex PAL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AfterDamageEffect && effect.attack === this.attacks[0]){
      const player = effect.player;
      const opponent = effect.opponent;

      const hasBench = player.bench.some(b => b.cards.length > 0);
      
      if (hasBench === false) {
        return state;
      }
    
      let targets: PokemonCardList[] = [];
      store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_SWITCH,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH],
        { allowCancel: false }
      ), results => {
        targets = results || [];
          
        if (targets.length > 0) {
          player.active.clearEffects();
          player.switchPokemon(targets[0]);
        }

        const hasBench = opponent.bench.some(b => b.cards.length > 0);
      
        if (hasBench === false) {
          return state;
        }
      
        let targets2: PokemonCardList[] = [];
        store.prompt(state, new ChoosePokemonPrompt(
          opponent.id,
          GameMessage.CHOOSE_POKEMON_TO_SWITCH,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.BENCH],
          { allowCancel: false }
        ), results => {
          targets2 = results || [];
            
          if (targets2.length > 0) {
            opponent.active.clearEffects();
            opponent.switchPokemon(targets2[0]);
          }
        });
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      if (!player.active.cards.some(c => c instanceof EnergyCard)) {
        return state;
      }

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      state = store.prompt(state, new ChooseEnergyPrompt(
        player.id,
        GameMessage.CHOOSE_CARD_TO_HAND,
        checkProvidedEnergy.energyMap,
        [CardType.COLORLESS, CardType.COLORLESS],
        { allowCancel: false }
      ), energy => {
        const cards: Card[] = (energy || []).map(e => e.card);
        
        player.active.moveCardsTo(cards, player.hand);
      });
    }

    return state;
  
  }
}