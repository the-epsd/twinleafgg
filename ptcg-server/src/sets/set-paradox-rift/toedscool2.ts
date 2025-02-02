import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, EnergyType, Stage, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, EnergyCard, GameMessage, PlayerType, StateUtils, AttachEnergyPrompt, SlotType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { AttachEnergyEffect } from '../../game/store/effects/play-card-effects';

export class Toedscool2 extends PokemonCard {

  public regulationMark = 'G';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = G;

  public hp: number = 50;

  public weakness = [{ type: R }];

  public retreat = [C];

  public attacks = [
    {
      name: 'Clinging Spore',
      cost: [G],
      damage: 0,
      text: 'Attach a Basic [G] Energy card from your hand to 1 of your Benched Pokémon.',
    },
    {
      name: 'Vine Slap',
      cost: [G, C],
      damage: 30,
      text: '',
    }
  ];
  public set: string = 'PAR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '15';

  public name: string = 'Toedscool';

  public fullName: string = 'Toedscool PAR2';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {

      const player = effect.player;

      const hasEnergyInHand = player.hand.cards.some(c => {
        return c instanceof EnergyCard
          && c.energyType === EnergyType.BASIC
          && c.provides.includes(CardType.GRASS);
      });
      if (!hasEnergyInHand) {
        return state;
      }

      const cardList = StateUtils.findCardList(state, this);
      if (cardList === undefined) {
        return state;
      }

      state = store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_CARDS,
        player.hand,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Grass Energy' },
        { min: 0, max: 1, allowCancel: false }
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