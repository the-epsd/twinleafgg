import { CardTag, CardType, Stage, SuperType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { GameMessage } from '../../game/game-message';
import { ChooseCardsPrompt, ChoosePokemonPrompt, GameError, PlayerType, PokemonCard, SlotType, StateUtils } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { KnockOutOpponentEffect } from '../../game/store/effects/attack-effects';

export class GiratinaVSTAR extends PokemonCard {

  public stage: Stage = Stage.VSTAR;

  public tags = [CardTag.POKEMON_VSTAR];

  public evolvesFrom = 'Giratina V';

  public regulationMark = 'F';

  public cardType: CardType = CardType.DRAGON;

  public cardTypez: CardType = CardType.GIRATINA_VSTAR;

  public hp: number = 280;

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Lost Impact',
      cost: [CardType.GRASS, CardType.PSYCHIC, CardType.COLORLESS],
      damage: 280,
      text: 'Put 2 Energy attached to your Pokémon in the Lost Zone.'
    },
    {
      name: 'Star Requium',
      cost: [CardType.GRASS, CardType.PSYCHIC],
      damage: 0,
      text: 'You can use this attack only if you have 10 or more cards in the Lost Zone. Your opponent\'s Active Pokémon is Knocked Out. (You can\'t use more than 1 VSTAR Power in a game.)'
    }
  ];

  public set: string = 'LOR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '131';

  public name: string = 'Giratina VSTAR';

  public fullName: string = 'Giratina VSTAR LOR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (player.lostzone.cards.length <= 9) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      if (player.usedVSTAR === true) {
        throw new GameError(GameMessage.LABEL_VSTAR_USED);
      }

      if (player.lostzone.cards.length >= 10) {

        const activePokemon = opponent.active.getPokemonCard();

        if (activePokemon) {
          const dealDamage = new KnockOutOpponentEffect(effect, opponent.active);
          dealDamage.target = opponent.active;
          store.reduceEffect(state, dealDamage);
        }
        player.usedVSTAR = true;
      }
    }


    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      const player = effect.player;

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { min: 1, max: 6, allowCancel: false }
      ), targets => {
        if (targets && targets.length > 0) {

          const target = targets[0];

          return store.prompt(state, new ChooseCardsPrompt(
            player.id,
            GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
            target, // Card source is target Pokemon
            { superType: SuperType.ENERGY },
            { min: 2, max: 2, allowCancel: false }
          ), selected => {
            const cards = selected || [];
            if (cards.length > 0) {

              target.moveCardsTo(cards, player.lostzone);

            }
          });
        }
      });
    }
    return state;
  }
}
