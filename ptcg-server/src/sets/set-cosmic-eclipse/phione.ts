import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PowerType } from '../../game/store/card/pokemon-types';
import { StoreLike, State, StateUtils, GameError, GameMessage, PokemonCardList, ChoosePokemonPrompt, PlayerType, SlotType, CardList } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';

export class Phione extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.WATER;
  public hp: number = 70;
  public retreat = [CardType.COLORLESS];
  public weakness = [{ type: CardType.GRASS }];

  public powers = [{
    name: 'Whirlpool Suction',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn (before your attack), if this Pokémon is on your Bench, you may have your opponent switch their Active Pokémon with 1 of their Benched Pokémon. If you do, discard all cards attached to this Pokémon and put it on the bottom of your deck. '
  }];

  public attacks = [{
    name: 'Rain Splash',
    cost: [CardType.WATER],
    damage: 10,
    text: ''
  }];

  public set: string = 'CEC';
  public setNumber: string = '57';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Phione';
  public fullName: string = 'Phione CEC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const hasBench = opponent.bench.some(b => b.cards.length > 0);
      const cardList = StateUtils.findCardList(state, this);

      if (player.active.cards[0] == this) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      if (hasBench === false) {
        return state;
      }

      const benchIndex = player.bench.indexOf(cardList as PokemonCardList);
      if (benchIndex === -1) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      return store.prompt(state, new ChoosePokemonPrompt(
        opponent.id,
        GameMessage.CHOOSE_POKEMON_TO_SWITCH,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH],
        { allowCancel: false }
      ), targets => {
        if (targets && targets.length > 0) {

          const deckBottom = new CardList();

          opponent.active.clearEffects();
          opponent.switchPokemon(targets[0]);
          player.bench[benchIndex].moveTo(deckBottom);
          player.bench[benchIndex].cards.forEach((c, index) => {
            c.cards.moveTo(player.discard);
          });
          deckBottom.moveTo(player.deck);
          player.bench[benchIndex].clearEffects();
          return state;
        }
      });
    }

    return state;
  }
}