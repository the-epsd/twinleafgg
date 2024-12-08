import { PokemonCard, CardTag, Stage, CardType, PowerType, StoreLike, State, ConfirmPrompt, GameMessage, ChooseCardsPrompt, SuperType, TrainerType, StateUtils, ChoosePokemonPrompt, PlayerType, SlotType, GameError, ShuffleDeckPrompt, BoardEffect } from '../../game';
import { PutDamageEffect, KnockOutOpponentEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect, AttackEffect } from '../../game/store/effects/game-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';


// LOT Alolan Ninetales-GX 132 (https://limitlesstcg.com/cards/LOT/132)
export class AlolanNinetalesGX extends PokemonCard {

  public tags = [CardTag.POKEMON_GX];

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Alolan Vulpix';

  public cardType: CardType = CardType.FAIRY;

  public hp: number = 200;

  public weakness = [{ type: CardType.METAL }];

  public resistance = [{ type: CardType.DARK, value: -20 }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Mysterious Guidance',
    useWhenInPlay: false,
    powerType: PowerType.ABILITY,
    text: 'When you play this Pokémon from your hand to evolve 1 of your Pokémon during your turn, you may search your deck for up to 2 Item cards, reveal them, and put them into your hand. Then, shuffle your deck.'
  }];

  public attacks = [
    {
      name: 'Snowy Wind',
      cost: [CardType.FAIRY, CardType.COLORLESS],
      damage: 70,
      text: 'This attack does 30 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    },

    {
      name: 'Sublimation-GX',
      cost: [CardType.FAIRY, CardType.COLORLESS],
      damage: 0,
      gxAttack: true,
      text: 'If your opponent\'s Active Pokémon is an Ultra Beast, it is Knocked Out. (You can\'t use more than 1 GX attack in a game.)'
    }
  ];

  public set: string = 'LOT';

  public name: string = 'Alolan Ninetales-GX';

  public fullName: string = 'Alolan Ninetales-GX LOT';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '132';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Mysterious Guidance
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const stub = new PowerEffect(player, {
          name: 'test',
          powerType: PowerType.ABILITY,
          text: ''
        }, this);
        store.reduceEffect(state, stub);
      } catch {
        return state;
      }

      state = store.prompt(state, new ConfirmPrompt(
        effect.player.id,
        GameMessage.WANT_TO_USE_ABILITY,
      ), wantToUse => {
        if (wantToUse) {
          return store.prompt(state, [
            new ChooseCardsPrompt(
              player,
              GameMessage.CHOOSE_CARD_TO_HAND,
              player.deck,
              { superType: SuperType.TRAINER, trainerType: TrainerType.ITEM },
              { min: 0, max: 2, allowCancel: false }
            )], selected => {
              const cards = selected || [];

              player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
                if (cardList.getPokemonCard() === this) {
                  cardList.addBoardEffect(BoardEffect.ABILITY_USED);
                }
              });

              player.deck.moveCardsTo(cards, player.hand);

              return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
                player.deck.applyOrder(order);
              });
            });
        }
      });
    }

    // Snowy Wind
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

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      // Check if player has used GX attack
      if (player.usedGX == true) {
        throw new GameError(GameMessage.LABEL_GX_USED);
      }
      // set GX attack as used for game
      player.usedGX = true;

      const pokemon = opponent.active.getPokemonCard();

      if (pokemon && pokemon.tags.includes(CardTag.ULTRA_BEAST)) {
        const dealDamage = new KnockOutOpponentEffect(effect, 999);
        dealDamage.target = opponent.active;
        store.reduceEffect(state, dealDamage);
      }
    }
    return state;
  }
}