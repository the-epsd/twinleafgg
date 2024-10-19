import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { CardTarget, ChoosePokemonPrompt, CoinFlipPrompt, GameError, GameMessage, PlayerType, PokemonCardList, PowerType, SlotType, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Venomoth extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Venonat';

  public cardType: CardType = CardType.GRASS;

  public hp: number = 70;

  public weakness = [{ type: CardType.FIRE }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public powers = [{
    name: 'Shift',
    useWhenInPlay: true,
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn (before your attack), you may change the type of Venomoth to the type of any other Pokémon in play other than Colorless. This power can\'t be used if Venomoth is Asleep, Confused, or Paralyzed.'
  }];

  public attacks = [{
    name: 'Venom Powder',
    cost: [G, G],
    damage: 10,
    text: 'Flip a coin. If heads, the Defending Pokémon is now Confused and Poisoned.'
  }];

  public set: string = 'JU';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '13';

  public name: string = 'Venomoth';

  public fullName: string = 'Venomoth JU';

  public readonly SHIFT_MARKER = 'SHIFT_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const cardList = StateUtils.findCardList(state, this) as PokemonCardList;

      const blocked: CardTarget[] = [];

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, index) => {
        if (card.cardType === CardType.COLORLESS) {
          blocked.push(index);
        }
      });

      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, index) => {
        if (card.cardType === CardType.COLORLESS) {
          blocked.push(index);
        }
      });


      if (cardList.specialConditions.length > 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      if (player.marker.hasMarker(this.SHIFT_MARKER)) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_SWITCH,
        PlayerType.TOP_PLAYER,
        [SlotType.BENCH],
        { allowCancel: false, blocked: blocked }
      ), result => {
        const cardList = result[0];
        const cardListPokemon = cardList.getPokemonCard() as PokemonCard;
        this.cardType = cardListPokemon.cardType;

        player.marker.addMarker(this.SHIFT_MARKER, this);

      });
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.SHIFT_MARKER, this);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      state = store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], results => {
        if (results) {
          opponent.active.addSpecialCondition(SpecialCondition.CONFUSED);
          opponent.active.addSpecialCondition(SpecialCondition.POISONED);
        }
      });
      return state;
    }

    return state;
  }
}