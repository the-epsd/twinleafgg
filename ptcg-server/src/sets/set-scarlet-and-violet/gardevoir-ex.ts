import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, EnergyType, SuperType } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State, StateUtils,
  GameMessage, PlayerType, SlotType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect, AttackEffect } from '../../game/store/effects/game-effects';
import { AttachEnergyPrompt } from '../../game/store/prompts/attach-energy-prompt';

export class Gardevoirex extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  //public evolvesFrom = 'Wartortle';

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 310;

  public weakness = [{ type: CardType.DARK }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public powers = [{
    name: 'Psychic Embrace',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'As often as you like during your turn (before your attack), ' +
      'you may attach a P Energy card from your hand to 1 of your Pokemon.'
  }];

  public attacks = [
    {
      name: 'Miracle Force',
      cost: [ CardType.PSYCHIC, CardType.PSYCHIC, CardType.COLORLESS ],
      damage: 190,
      text: 'This Pokémon recovers from all Special Conditions.'
    }
  ];

  public set: string = 'SVI';

  public name: string = 'Gardevoir ex';

  public fullName: string = 'Gardevoir ex SVI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;

      state = store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_TO_BENCH,
        player.discard,
        PlayerType.BOTTOM_PLAYER,
        [ SlotType.BENCH, SlotType.ACTIVE ],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Psychic Energy' },
        { allowCancel: true, min: 0 },
      ), transfers => {
        transfers = transfers || [];
        // cancelled by user
        if (transfers.length === 0) {
          return state;
        }
        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          player.discard.moveCardTo(transfer.card, target);
        }
        if (effect instanceof AttackEffect) {
          (effect as AttackEffect).damage += transfers.length * 20;
        }
      });
    }

    return state;
  }

}
