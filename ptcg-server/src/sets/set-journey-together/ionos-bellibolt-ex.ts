import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, EnergyType, SuperType } from '../../game/store/card/card-types';
import { AttachEnergyPrompt, CardTarget, EnergyCard, GameError, GameMessage, PlayerType, PowerType, SlotType, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { AttachEnergyEffect } from '../../game/store/effects/play-card-effects';
import { WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class IonosBelliboltex extends PokemonCard {

  public tags = [CardTag.IONOS, CardTag.POKEMON_ex];

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom: string = 'Iono\'s Tadbulb';

  public cardType: CardType = L;

  public hp: number = 280;

  public weakness = [{ type: F }];

  public retreat = [C, C];

  public powers = [{
    name: 'Electric Streamer',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'As often as you like during your turn, you may attach a Basic [L] Energy card from your hand to 1 of your Iono\'s Pokémon.'
  }];

  public attacks = [{
    name: 'Thunderous Bolt',
    cost: [L, L, L, C],
    damage: 230,
    text: 'During your next turn, this Pokemon can\'t attack.'
  }];

  public regulationMark = 'I';

  public cardImage: string = 'assets/cardback.png';

  public set: string = 'JTG';

  public setNumber = '53';

  public name: string = 'Iono\'s Bellibolt ex';

  public fullName: string = 'Iono\'s Bellibolt ex JTG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Electro Streamer
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      const hasEnergyInHand = player.hand.cards.some(c => {
        return c.superType === SuperType.ENERGY
          && c.energyType === EnergyType.BASIC
          && (c as EnergyCard).provides.includes(L);
      });
      if (!hasEnergyInHand) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      const blockedTo: CardTarget[] = [];
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        if (!card.tags.includes(CardTag.IONOS)) {
          blockedTo.push(target);
        }
      });

      state = store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_CARDS,
        player.hand,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH, SlotType.ACTIVE],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Lightning Energy' },
        { allowCancel: false, blockedTo }
      ), transfers => {
        transfers = transfers || [];
        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          const energyCard = transfer.card as EnergyCard;
          const attachEnergyEffect = new AttachEnergyEffect(player, energyCard, target);
          store.reduceEffect(state, attachEnergyEffect);
        }
      });

      return state;
    }

    // Thunderous Bolt
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      player.active.cannotAttackNextTurnPending = true;
    }

    return state;
  }

}