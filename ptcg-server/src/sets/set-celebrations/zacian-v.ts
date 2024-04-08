import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, EnergyType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, AttachEnergyPrompt, GameMessage, PlayerType, ShuffleDeckPrompt, SlotType, StateUtils } from '../../game';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';


export class ZacianV extends PokemonCard {

  public tags = [ CardTag.POKEMON_V ];

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 220;

  public weakness = [{ type: CardType.METAL }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public powers = [{
    name: 'Roar of the Sword',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, you may search your deck for a ' +
      'P Energy card and attach it to 1 of your Pokémon. Then,' +
      'shuffle your deck. If you use this Ability, your turn ends.'
  }];

  public attacks = [
    {
      name: 'Storm Slash',
      cost: [ CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS ],
      damage: 60,
      text: 'This attack does 30 more damage for each [P] Energy ' +
      'attached to this Pokémon.'
    }
  ];

  public set: string = 'CEL';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '16';

  public regulationMark = 'E';

  public name: string = 'Zacian V';

  public fullName: string = 'Zacian V CEL';

  public readonly RUSH_IN_MARKER = 'RUSH_IN_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {


    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;

      state = store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_TO_BENCH,
        player.deck,
        PlayerType.BOTTOM_PLAYER,
        [ SlotType.BENCH, SlotType.ACTIVE ],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Psychic Energy' },
        { allowCancel: true, min: 0, max: 1 },
      ), transfers => {
        transfers = transfers || [];
        // cancelled by user
        if (transfers.length === 0) {
          return state;
        }
        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          player.deck.moveCardTo(transfer.card, target);
        }
        state = store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
          player.deck.applyOrder(order);
        });
      });
      
      const endTurnEffect = new EndTurnEffect(player);
      store.reduceEffect(state, endTurnEffect);
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player);
      store.reduceEffect(state, checkProvidedEnergyEffect);

      let energyCount = 0;
      checkProvidedEnergyEffect.energyMap.forEach(em => {
        energyCount += em.provides.filter(cardType => {
          return cardType === CardType.PSYCHIC;
        }).length;
      });
      effect.damage += energyCount * 30;
    }
    return state;
  }

}
