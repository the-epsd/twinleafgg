import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, Card, ChooseCardsPrompt} from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { GameMessage } from '../../game/game-message';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';

export class Ursaluna extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.GRASS;

  public hp: number = 70;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [ CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Peat Hunt',
      cost: [card_types_1.CardType.COLORLESS],
      damage: 0,
      text: 'Put up to 2 cards from your discard pile into your hand.'
    },
    {
      name: 'Bulky Bump',
      cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
      damage: 200,
      text: 'Discard 2 Energy from this Pokemon.'
    }
  ];

  public set: string = 'SSH';

  public name: string = 'Ursaluna';

  public fullName: string = 'Ursaluna ASR 124';

if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
  const player = effect.player;

  const discardCount = player.discard.cards.filter(c => {
    return c instanceof SuperType.ANY;
  }).length;

  if (discardCount === 0) {
    return state;
  }

  const max = Math.min(2, discardCount);
  const min = max;

  return store.prompt(state, [
    new ChooseCardsPrompt(
      player.id,
      GameMessage.CHOOSE_CARD_TO_HAND,
      player.discard,
      { superType: SuperType.ANY },
      { min, max, allowCancel: false }
    )], selected => {
    const cards = selected || [];
    player.discard.moveCardsTo(cards, player.hand);
  });
}

if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
  const player = effect.player;

  const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
  state = store.reduceEffect(state, checkProvidedEnergy);

  state = store.prompt(state, new ChooseEnergyPrompt(
    player.id,
    GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
    checkProvidedEnergy.energyMap,
    [ CardType.ANY, CardType.ANY ],
    { allowCancel: false }
  ), energy => {
    const cards: Card[] = (energy || []).map(e => e.card);
    const discardEnergy = new DiscardCardsEffect(effect, cards);
    discardEnergy.target = player.active;
    store.reduceEffect(state, discardEnergy);
  });
}

return state;
}
