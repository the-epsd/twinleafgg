import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, EnergyType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, ChooseCardsPrompt, AttachEnergyPrompt, EnergyCard, GameError, PlayerType, SlotType, StateUtils } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { AttachEnergyEffect } from '../../game/store/effects/play-card-effects';

export class Groudon extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public regulationMark = 'G';

  public cardType: CardType = CardType.FIGHTING;

  public hp: number = 130;

  public weakness = [{ type: CardType.GRASS }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Swelling Power',
      cost: [ CardType.COLORLESS ],
      damage: 0,
      text: 'Attach a Basic [F] Energy card from your hand to 1 of your Pokémon.'
    },
    {
      name: 'Magma Purge',
      cost: [ CardType.FIGHTING, CardType.FIGHTING, CardType.COLORLESS ],
      damage: 60,
      text: 'Discard up to 4 Energy from your Pokémon. This attack does 60 damage for each card you discarded in this way.'
    },
  ];

  public set: string = 'PAR';

  public set2: string = 'paradoxrift';

  public setNumber: string = '93';

  public name: string = 'Groudon';

  public fullName: string = 'Groudon PAR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      const player = effect.player;

      const hasEnergyInHand = player.hand.cards.some(c => {
        return c instanceof EnergyCard
            && c.energyType === EnergyType.BASIC
            && c.provides.includes(CardType.FIGHTING);
      });
      if (!hasEnergyInHand) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
  
      state = store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_CARDS,
        player.hand,
        PlayerType.BOTTOM_PLAYER,
        [ SlotType.BENCH, SlotType.ACTIVE ],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Basic Fighting Energy' },
        { max: 1, allowCancel: true }
      ), transfers => {
        transfers = transfers || [];
        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          const energyCard = transfer.card as EnergyCard;
          const attachEnergyEffect = new AttachEnergyEffect(player, energyCard, target);
          store.reduceEffect(state, attachEnergyEffect);
        }
      });
        

      if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
        const player = effect.player;
  
        const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
        state = store.reduceEffect(state, checkProvidedEnergy);
  
        state = store.prompt(state, new ChooseCardsPrompt(
          player.id,
          GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
          player.active,
          { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Basic Fighting Energy' },
          { min: 1, max: 4, allowCancel: false }
        ), selected => {
          const cards = selected || [];
          if (cards.length > 0) {

            let totalDiscarded = 0;

            cards.forEach(card => {

              const discardEnergy = new DiscardCardsEffect(effect, [card]);
              discardEnergy.target = player.active;

              totalDiscarded += discardEnergy.cards.length;

              effect.damage = totalDiscarded * 60;

              store.reduceEffect(state, discardEnergy);
              return state;
            });
            return state;
          }
        });
        return state;
      }
      return state;
    }
    return state;
  }
}
