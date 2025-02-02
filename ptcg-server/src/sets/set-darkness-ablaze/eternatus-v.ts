import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SuperType, EnergyType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import {AttackEffect} from '../../game/store/effects/game-effects';
import {AttachEnergyPrompt, GameMessage, PlayerType, SlotType, StateUtils} from '../../game';

export class EternatusV extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_V];
  public cardType: CardType = D;
  public hp: number = 220;
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Power Accelerator',
    cost: [C],
    damage: 30,
    text: 'You may attach a [D] Energy card from your hand to 1 of your Benched Pokémon.'
  },
  {
    name: 'Dynamax Cannon',
    cost: [D, C, C, C],
    damage: 120,
    damageCalculation: '+',
    text: 'If your opponent\'s Active Pokémon is a Pokémon VMAX, this attack does 120 more damage.'
  }];

  public set: string = 'DAA';
  public name: string = 'Eternatus V';
  public fullName: string = 'Eternatus V DAA';
  public setNumber: string = '116';
  public regulationMark: string = 'D';
  public cardImage: string = 'assets/cardback.png';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Power Accelerator
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]){
      const player = effect.player;

      return store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_CARDS,
        player.hand,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Dark Energy' },
        { allowCancel: false, min: 0, max: 1 },
      ), transfers => {
        transfers = transfers || [];
        // cancelled by user
        if (transfers.length === 0) {
          return state;
        }
        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          player.hand.moveCardTo(transfer.card, target);
        }
      });
    }

    // Dynamax Cannon
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]){
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (opponent.active.getPokemonCard()?.tags.includes(CardTag.POKEMON_VMAX)){
        effect.damage += 120;
      }
    }
    
    return state;
  }
}