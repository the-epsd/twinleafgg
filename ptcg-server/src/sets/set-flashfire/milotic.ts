import { AttachEnergyPrompt, EnergyCard, GameError, GameMessage, PlayerType, PowerType, SlotType, State, StateUtils, StoreLike } from '../../game';
import { CardType, EnergyType, Stage, SuperType } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';

export class Milotic extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Feebas';

  public cardType: CardType = CardType.WATER;

  public hp: number = 100;

  public weakness = [{ type: CardType.GRASS }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Energy Grace',
    powerType: PowerType.ABILITY,
    text: 'Once during your turn (before your attack), you may Knock Out this Pokémon. If you do, attach 3 basic Energy cards from your discard pile to 1 of your Pokémon (excluding Pokémon-EX).'
  }];

  public attacks = [
    {
      name: 'Waterfall',
      cost: [CardType.WATER, CardType.COLORLESS, CardType.COLORLESS],
      damage: 60,
      text: ''
    }
  ];

  public set: string = 'FLF';

  public name: string = 'Milotic';

  public fullName: string = 'Milotic FLF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '23';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;

      const energyInDiscard = player.discard.cards.filter(c => {
        return c instanceof EnergyCard && c.energyType === EnergyType.BASIC;
      }).length;
      
      if (energyInDiscard === 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      const blocked: number[] = [];
      player.discard.cards.forEach((card, index) => {
        if (card instanceof EnergyCard && card.energyType === EnergyType.BASIC) {
          
        } else {
          blocked.push(index);
        }
      });

      const attachAmount = Math.min(energyInDiscard, 3);
      
      state = store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_CARDS,
        player.discard,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH, SlotType.ACTIVE],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
        { allowCancel: false, min: attachAmount, max: attachAmount, blocked }
      ), transfers => {
        transfers = transfers || [];
        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          player.discard.moveCardTo(transfer.card, target);
        }
        
        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
          if (cardList.getPokemonCard() === this) {
            cardList.damage += 999;
          }
        });
      });

      return state;
    }
    
    return state;
  }
}
