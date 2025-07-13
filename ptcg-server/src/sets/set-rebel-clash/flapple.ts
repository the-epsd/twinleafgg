import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, ChoosePokemonPrompt, PlayerType, SlotType, PowerType, StateUtils, PokemonCardList, ChooseCardsPrompt, Card, EnergyCard, CoinFlipPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { EffectOfAbilityEffect } from '../../game/store/effects/game-effects';
import { GameMessage } from '../../game/game-message';
import { MOVE_CARDS, SHUFFLE_DECK, WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';

export class Flapple extends PokemonCard {
  public regulationMark = 'D';
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Applin';
  public cardType: CardType = G;
  public hp: number = 80;
  public weakness = [{ type: R }];
  public retreat = [C];

  public powers = [{
    name: 'Apple Drop',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, you may put 2 damage counters on 1 of your opponent\'s Pokémon. If you placed any damage counters in this way, shuffle this Pokémon and all attached cards into your deck.'
  }];

  public attacks = [{
    name: 'Acid Spray',
    cost: [C, C],
    damage: 60,
    text: 'Flip a coin. If heads, discard an Energy from your opponent\'s Active Pokémon.'
  }];

  public set: string = 'RCL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '22';
  public name: string = 'Flapple';
  public fullName: string = 'Flapple RCL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { min: 1, max: 1, allowCancel: false },

      ), selected => {
        const targets = selected || [];

        if (targets.length > 0) {
          const damageEffect = new EffectOfAbilityEffect(player, this.powers[0], this, targets[0]);
          store.reduceEffect(state, damageEffect);
          if (damageEffect.target) {
            damageEffect.target.damage += 20;

            const thisCardList = StateUtils.findCardList(state, this) as PokemonCardList;

            // Shuffle this Pokémon and all attached cards into your deck
            // Separate Pokemon card from attached cards
            const pokemons = thisCardList.getPokemons();
            const otherCards = thisCardList.cards.filter(card => !(card instanceof PokemonCard));

            // Move other cards to deck first
            if (otherCards.length > 0) {
              MOVE_CARDS(store, state, thisCardList, player.deck, { cards: otherCards });
            }

            // Move Pokemon to deck
            if (pokemons.length > 0) {
              MOVE_CARDS(store, state, thisCardList, player.deck, { cards: pokemons });
            }

            SHUFFLE_DECK(store, state, player);
          }
        }
      });
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      return store.prompt(state, new CoinFlipPrompt(
        player.id, GameMessage.COIN_FLIP
      ), flipResult => {
        if (flipResult) {
          // Defending Pokemon has no energy cards attached
          if (!opponent.active.cards.some(c => c instanceof EnergyCard)) {
            return state;
          }
          let cards: Card[] = [];
          return store.prompt(state, new ChooseCardsPrompt(
            player,
            GameMessage.CHOOSE_CARD_TO_DISCARD,
            opponent.active,
            { superType: SuperType.ENERGY },
            { min: 1, max: 1, allowCancel: false }
          ), selected => {
            cards = selected || [];
            const discardEnergy = new DiscardCardsEffect(effect, cards);
            return store.reduceEffect(state, discardEnergy);
          });
        }
        return state;
      });
    }
    return state;
  }
}
