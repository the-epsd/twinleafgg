import { AttachEnergyPrompt, Attack, GameMessage, PlayerType, SlotType, StateUtils } from '../../game';
import { CardType, EnergyType, SuperType, TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { CheckPokemonAttacksEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class TechnicalMachineTurboEnergize extends TrainerCard {

  public trainerType: TrainerType = TrainerType.TOOL;

  public regulationMark = 'G';

  public tags = [ ];

  public set: string = 'PAR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '179';

  public name: string = 'Technical Machine: Turbo Energize';

  public fullName: string = 'Technical Machine: Turbo Energize PAR';

  public attacks: Attack[] = [{
    name: 'Turbo Energize',
    cost: [ CardType.COLORLESS ],
    damage: 0,
    text: 'Search your deck for up to 2 Basic Energy cards and attach them to your Benched Pokémon in any way you like. Then, shuffle your deck.' 
  }];
  
  public text: string =
    'The Pokémon this card is attached to can use the attack on this card. (You still need the necessary Energy to use this attack.) If this card is attached to 1 of your Pokémon, discard it at the end of your turn.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof EndTurnEffect && effect.player.active.tool) {
      const player = effect.player;
      const tool = effect.player.active.tool;
      if (tool.name === this.name) {
        player.active.moveCardTo(tool, player.discard);
        player.active.tool = undefined;
      }

      return state;
    }

    if (effect instanceof CheckPokemonAttacksEffect && effect.player.active.getPokemonCard()?.tools.includes(this) &&
!effect.attacks.includes(this.attacks[0])) {
      effect.attacks.push(this.attacks[0]);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      const player = effect.player;

      state = store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_CARDS,
        player.deck,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
        { max: 2, allowCancel: true }
      ), transfers => {
        transfers = transfers || [];
        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          player.deck.moveCardTo(transfer.card, target);
        }

        return state;
      });

      return state;
    }

    return state;
  }
}
