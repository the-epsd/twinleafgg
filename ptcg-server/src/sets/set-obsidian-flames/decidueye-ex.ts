import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, PlayerType, SlotType, ChoosePokemonPrompt, PowerType, PokemonCardList, GameError } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { StateUtils } from '../../game/store/state-utils';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';

export class Decidueyeex extends PokemonCard {

  public tags = [CardTag.POKEMON_ex];

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Dartrix';

  public cardType: CardType = CardType.GRASS;

  public hp: number = 320;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Total Freedom',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, you may use this Ability. If this Pokémon is on the Bench, switch it with your Active Pokémon. Or, if this Pokémon is in the Active Spot, switch it with 1 of your Benched Pokémon.'
  }];

  public attacks = [
    {
      name: 'Hunting Arrow',
      cost: [CardType.GRASS, CardType.COLORLESS],
      damage: 130,
      text: 'This attack does 30 damage to 1 of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    }
  ];
  public regulationMark = 'H';

  public set: string = 'OBF';

  public setNumber: string = '15';

  public cardImage: string = 'assets/cardback.png';

  public name: string = 'Decidueye ex';

  public fullName: string = 'Decidueye ex OBF';

  public readonly TOTAL_FREEDOM_MARKER = 'TOTAL_FREEDOM_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.TOTAL_FREEDOM_MARKER, this);
    }

    // Total Freedom
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;

      if (player.marker.hasMarker(this.TOTAL_FREEDOM_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      if (player.active.getPokemonCard() === this) {
        player.marker.addMarker(this.TOTAL_FREEDOM_MARKER, this);

        return store.prompt(state, new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_SWITCH,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.BENCH],
          { allowCancel: false }
        ), result => {
          const cardList = result[0];
          player.switchPokemon(cardList);
        });
      }

      let bench: PokemonCardList | undefined;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        if (card === this && target.slot === SlotType.BENCH) {
          bench = cardList;
        }
      });

      if (bench === undefined) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      player.marker.addMarker(this.TOTAL_FREEDOM_MARKER, this);
      player.switchPokemon(bench);
      return state;
    }

    // Hunting Arrow
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const hasBenched = opponent.bench.some(b => b.cards.length > 0);
      if (!hasBenched) {
        return state;
      }

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.BENCH],
        { allowCancel: false }
      ), targets => {
        if (!targets || targets.length === 0) {
          return;
        }
        const damageEffect = new PutDamageEffect(effect, 30);
        damageEffect.target = targets[0];
        store.reduceEffect(state, damageEffect);
      });
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.TOTAL_FREEDOM_MARKER, this);
    }

    return state;
  }
}