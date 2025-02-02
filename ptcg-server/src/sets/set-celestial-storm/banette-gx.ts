import { PokemonCard } from '../../game/store/card/pokemon-card';
import { MoveDamagePrompt,/* Player,*/ PlayerType, GameError } from '../../game';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { ChooseCardsPrompt } from '../../game';
import { StateUtils } from '../../game';
import { DamageMap } from '../../game';
import { SlotType } from '../../game';
import { CheckHpEffect } from '../../game/store/effects/check-effects';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { TrainerCard, TrainerType } from '../../game';

// CES Banette-GX 66 (https://limitlesstcg.com/cards/CES/66)
export class BanetteGX extends PokemonCard {

  public tags = [CardTag.POKEMON_GX];

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Shuppet';

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 190;

  public weakness = [{ type: CardType.DARK }];

  public resistance = [{ type: CardType.FIGHTING, value: -20 }];

  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Shady Move',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn (before your attack), if this Pokémon is your Active Pokémon, you may move 1 damage counter from 1 Pokémon to another Pokémon.'
  }];

  public attacks = [
    {
      name: 'Shadow Chant',
      cost: [CardType.PSYCHIC],
      damage: 30,
      text: 'This attack does 10 more damage for each Supporter card in your discard pile. You can\'t add more than 100 damage in this way.'
    },

    {
      name: 'Tomb Hunt-GX',
      cost: [CardType.PSYCHIC],
      damage: 0,
      text: 'Put 3 cards from your discard pile into your hand. (You can\'t use more than 1 GX attack in a game.)'
    }
  ];

  public set: string = 'CES';

  public setNumber: string = '66';
  
  public cardImage = 'assets/cardback.png';

  public name: string = 'Banette-GX';

  public fullName: string = 'Banette-GX CES';

  public readonly SHADY_MARKER = 'SHADY_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.SHADY_MARKER, this);
    }

    // Shady Move
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (player.active.getPokemonCard() !== this) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      if (player.marker.hasMarker(this.SHADY_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }
      // damage map gaming
      const maxAllowedDamage: DamageMap[] = [];
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
        const checkHpEffect = new CheckHpEffect(opponent, cardList);
        store.reduceEffect(state, checkHpEffect);
        maxAllowedDamage.push({ target, damage: checkHpEffect.hp });
      });
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        const checkHpEffect = new CheckHpEffect(player, cardList);
        store.reduceEffect(state, checkHpEffect);
        maxAllowedDamage.push({ target, damage: checkHpEffect.hp });
      });

      // doing the actual moving of cards
      return store.prompt(state, new MoveDamagePrompt(
        effect.player.id,
        GameMessage.MOVE_DAMAGE,
        PlayerType.ANY,
        [SlotType.ACTIVE, SlotType.BENCH],
        maxAllowedDamage,
        { min: 1, max: 1, allowCancel: false }
      ), transfers => {
        if (transfers === null) {
          return;
        }
        player.marker.addMarker(this.SHADY_MARKER, this);

        for (const transfer of transfers) {
          const source = StateUtils.getTarget(state, player, transfer.from);
          const target = StateUtils.getTarget(state, player, transfer.to);
          if (source.damage >= 10) {
            source.damage -= 10;
            target.damage += 10;
          }
        }
      });
    }

    // Shadow Chant
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      let supportersInDiscard = 0;
      player.discard.cards.forEach(c => {
        if (c instanceof TrainerCard && c.trainerType === TrainerType.SUPPORTER) {
          supportersInDiscard += 1;
        }
      });

      // no doing too much damage bozo
      if (supportersInDiscard > 10) {
        supportersInDiscard = 10;
      }

      effect.damage += supportersInDiscard * 10;
    }

    // Shadowy Hunter-GX
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      if (player.discard.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      // Check if player has used GX attack
      if (player.usedGX == true) {
        throw new GameError(GameMessage.LABEL_GX_USED);
      }
      // set GX attack as used for game
      player.usedGX = true;

      return store.prompt(state, [
        new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARD_TO_HAND,
          player.discard,
          {},
          { min: 1, max: 3, allowCancel: false }
        )], selected => {
        const cards = selected || [];
        player.discard.moveCardsTo(cards, player.hand);
      });
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.SHADY_MARKER, this);
    }

    return state;
  }
}