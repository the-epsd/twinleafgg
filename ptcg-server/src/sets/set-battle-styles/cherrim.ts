import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, EnergyType, SuperType, CardTag } from '../../game/store/card/card-types';
import {
  PowerType, StoreLike, State, StateUtils,
  GameError, GameMessage, EnergyCard, PlayerType, SlotType,
  CardTarget
} from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { AttachEnergyPrompt } from '../../game/store/prompts/attach-energy-prompt';
import { AttachEnergyEffect } from '../../game/store/effects/play-card-effects';

export class Cherrim extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public regulationMark = 'E';

  public evolvesFrom = 'Cherubi';

  public cardType: CardType = CardType.GRASS;

  public hp: number = 80;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Spring Bloom',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'As often as you like during your turn, you may attach a ' +
      'G Energy card from your hand to 1 of your Pokémon ' +
      'that doesn’t have a Rule Box (Pokémon V, Pokémon-GX, ' +
      'etc. have Rule Boxes).'

  }];

  public attacks = [
    {
      name: 'Seed Bomb',
      cost: [CardType.GRASS, CardType.COLORLESS, CardType.COLORLESS],
      damage: 70,
      text: ''
    }
  ];

  public set: string = 'BST';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '8';

  public name: string = 'Cherrim';

  public fullName: string = 'Cherrim BST';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;

      const hasEnergyInHand = player.hand.cards.some(c => {
        return c instanceof EnergyCard
          && c.energyType === EnergyType.BASIC
          && c.provides.includes(CardType.GRASS);
      });
      if (!hasEnergyInHand) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      const blocked2: CardTarget[] = [];
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (list, card, target) => {
        if (card.tags.includes(CardTag.POKEMON_V)) {
          blocked2.push(target);
        }
        if (card.tags.includes(CardTag.POKEMON_VSTAR)) {
          blocked2.push(target);
        }
        if (card.tags.includes(CardTag.POKEMON_ex)) {
          blocked2.push(target);
        }
        if (card.tags.includes(CardTag.POKEMON_VMAX)) {
          blocked2.push(target);
        }
        if (card.tags.includes(CardTag.RADIANT)) {
          blocked2.push(target);
        }
        if (card.tags.includes(CardTag.POKEMON_GX)) {
          blocked2.push(target);
        }
        if (card.tags.includes(CardTag.POKEMON_EX)) {
          blocked2.push(target);
        }
      });

      return store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_CARDS,
        player.hand,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH, SlotType.ACTIVE],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Grass Energy' },
        { allowCancel: false, blockedTo: blocked2 }
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