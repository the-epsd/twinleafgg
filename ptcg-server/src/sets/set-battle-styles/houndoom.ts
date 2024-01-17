import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType, CardTag, EnergyType } from '../../game/store/card/card-types';
import { PowerType, 
  GameMessage, PlayerType, SlotType, AttachEnergyPrompt, StateUtils, State, StoreLike } from '../../game';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { Effect } from '../../game/store/effects/effect';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';



export class Houndoom extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public regulationMark = 'E';

  public evolvesFrom = 'Houndour';

  public tags = [ CardTag.SINGLE_STRIKE ];

  public cardType: CardType = CardType.DARK;

  public hp: number = 130;

  public weakness = [{ type: CardType.GRASS }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Single Strike Roar',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, you may search your deck for a ' +
      'Single Strike Energy card and attach it to 1 of your Single ' +
      'Strike Pokémon. Then, shuffle your deck. If you attached ' +
      'Energy to a Pokémon in this way, put 2 damage counters ' +
      'on that Pokémon.'
  }];

  public attacks = [
    {
      name: 'Darkness Fang',
      cost: [CardType.DARK, CardType.COLORLESS],
      damage: 50,
      text: ''
    }];

  public set: string = 'BST';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '96';

  public name: string = 'Houndoom';

  public fullName: string = 'Houndoom BST';

  public readonly SINGLE_STRIKE_ROAR_MARKER = 'SINGLE_STRIKE_ROAR_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.SINGLE_STRIKE_ROAR_MARKER, this);
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;

      state = store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_TO_BENCH,
        player.deck,
        PlayerType.BOTTOM_PLAYER,
        [ SlotType.BENCH, SlotType.ACTIVE ],
        { superType: SuperType.ENERGY, energyType: EnergyType.SPECIAL, name: 'Single Strike Energy' },
        { allowCancel: true, min: 0, max: 1 }
      ), transfers => {
        transfers = transfers || [];
        // cancelled by user
        if (transfers.length === 0) {
          return;
        }
        player.marker.addMarker(this.SINGLE_STRIKE_ROAR_MARKER, this);
        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          player.deck.moveCardTo(transfer.card, target);
          target.damage += 20;
        }
      });

      return state;
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.SINGLE_STRIKE_ROAR_MARKER, this);
    }

    return state;
  }
}
