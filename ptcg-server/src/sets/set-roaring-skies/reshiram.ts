import { AttachEnergyPrompt, EnergyCard, GameError, GameMessage, PlayerType, Power, PowerType, SlotType, State, StateUtils, StoreLike, Weakness } from '../../game';
import { CardType, EnergyType, Stage, SuperType } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { AttachEnergyEffect } from '../../game/store/effects/play-card-effects';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../game/store/prefabs/costs';
import { ABILITY_USED, ADD_MARKER, HAS_MARKER, REMOVE_MARKER_AT_END_OF_TURN, WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class Reshiram extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = N;
  public weakness: Weakness[] = [{ type: Y }];
  public hp: number = 130;
  public retreat = [C, C];

  public powers: Power[] = [
    {
      name: 'Turboblaze',
      powerType: PowerType.ABILITY,
      useWhenInPlay: true,
      text: 'Once during your turn (before your attack), if this Pokémon is your Active Pokémon, you may attach a [R] Energy card from your hand to 1 of your [N] Pokémon.'
    }
  ];

  public attacks = [
    {
      name: 'Bright Wing',
      cost: [R, R, L, C],
      damage: 110,
      text: 'Discard a [R] Energy attached to this Pokémon.'
    }
  ];

  public set: string = 'ROS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '63';
  public name: string = 'Reshiram';
  public fullName: string = 'Reshiram ROS';
  private readonly TURBOBLAZE_MARKER = 'TURBOBLAZE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      const hasEnergyInHand = player.hand.cards.some(c => {
        return c instanceof EnergyCard
          && c.energyType === EnergyType.BASIC
          && c.provides.includes(CardType.FIRE);
      });

      if (HAS_MARKER(this.TURBOBLAZE_MARKER, effect.player, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      if (!hasEnergyInHand) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      return store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_CARDS,
        player.hand,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH, SlotType.ACTIVE],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Fire Energy' },
        { allowCancel: false, max: 1, min: 1 }
      ), transfers => {
        transfers = transfers || [];
        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          const energyCard = transfer.card as EnergyCard;
          const attachEnergyEffect = new AttachEnergyEffect(player, energyCard, target);
          store.reduceEffect(state, attachEnergyEffect);
        }

        ABILITY_USED(effect.player, this);
        ADD_MARKER(this.TURBOBLAZE_MARKER, effect.player, this);
        return state;
      });
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 1, F);
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.TURBOBLAZE_MARKER, this);

    return state;
  }

}
