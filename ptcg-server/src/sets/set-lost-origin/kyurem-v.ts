import { PokemonCard } from '../../game/store/card/pokemon-card'; 
import { CardTag, CardType, EnergyType, Stage, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, EnergyCard, GameError, GameMessage, AttachEnergyPrompt, PlayerType, SlotType, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { AttachEnergyEffect } from '../../game/store/effects/play-card-effects';

export class KyuremV extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public regulationMark = 'F';

  public tags = [CardTag.POKEMON_V];

  public cardType: CardType = CardType.WATER;
  
  public hp: number = 220;

  public weakness = [{ type: CardType.METAL }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Rapid Freeze',
      cost: [CardType.WATER],
      damage: 0,
      text: 'Attach any number of [W] Energy cards from your hand to your Pokémon in any way you like.'
    },
    {
      name: 'Frost Smash',
      cost: [CardType.WATER, CardType.WATER, CardType.WATER],
      damage: 140,
      text: ''
    }
  ];

  public set: string = 'LOR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '48';

  public name: string = 'Kyurem V';

  public fullName: string = 'Kyurem V LOR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      const player = effect.player;

      const hasEnergyInHand = player.hand.cards.some(c => {
        return c instanceof EnergyCard
      && c.energyType === EnergyType.BASIC
      && c.provides.includes(CardType.WATER);
      });
      if (!hasEnergyInHand) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      return store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_CARDS,
        player.hand,
        PlayerType.BOTTOM_PLAYER,
        [ SlotType.BENCH, SlotType.ACTIVE ],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Water Energy' },
        { allowCancel: true }
      ), transfers => {
        transfers = transfers || [];
        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          const energyCard = transfer.card as EnergyCard;
          const attachEnergyEffect = new AttachEnergyEffect(player, energyCard, target);
          store.reduceEffect(state, attachEnergyEffect);
        }
      });
    }
    return state;
  }
}