import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, EnergyType, SuperType, CardTag } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State, StateUtils, GameError, GameMessage, EnergyCard, PlayerType, SlotType } from '../../game';
import { CardTarget } from '../../game/store/actions/play-card-action';
import { Effect } from '../../game/store/effects/effect';

import { AttachEnergyPrompt } from '../../game/store/prompts/attach-energy-prompt';
import { AttachEnergyEffect } from '../../game/store/effects/play-card-effects';
import { WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class Oricorioex extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = R;
  public hp: number = 190;
  public weakness = [{ type: W }];
  public retreat = [C];

  public powers = [{
    name: 'Excited Turbo',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'As often as you like during your turn, if you have any [R] Mega Evolution Pokémon ex in play, you may use this Ability. Attach a Basic [R] Energy card from your hand to 1 of your Benched [R] Pokémon.'
  }];

  public attacks = [{
    name: 'Fire Wing',
    cost: [R, R, C],
    damage: 110,
    text: ''
  }];

  public regulationMark: string = 'I';
  public set: string = 'PFL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '18';
  public name: string = 'Oricorio ex';
  public fullName: string = 'Oricorio ex M2';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      const hasMegaEvolutionPokemonInPlay = player.active.cards.some(c => {
        return c instanceof PokemonCard
          && c.tags.includes(CardTag.POKEMON_ex)
          && c.tags.includes(CardTag.POKEMON_SV_MEGA)
          && c.cardType === CardType.FIRE;
      });
      if (!hasMegaEvolutionPokemonInPlay) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      // Check that we have Fire Pokemon on our bench
      const hasFirePokemonOnBench = player.bench.some(benchSlot =>
        benchSlot.cards.some(c =>
          c instanceof PokemonCard && c.cardType === CardType.FIRE
        )
      );
      if (!hasFirePokemonOnBench) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      // Block any Pokemon that are not Fire Pokemon on our bench
      const blocked: CardTarget[] = [];
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (list, card, target) => {
        if (card.cardType !== CardType.FIRE) {
          blocked.push(target);
        }
      });

      const hasEnergyInHand = player.hand.cards.some(c => {
        return c.superType === SuperType.ENERGY
          && c.energyType === EnergyType.BASIC
          && (c as EnergyCard).provides.includes(CardType.FIRE);
      });
      if (!hasEnergyInHand) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      return store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_CARDS,
        player.hand,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Fire Energy' },
        { allowCancel: false, blockedTo: blocked }
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
