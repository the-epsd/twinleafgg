import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, EnergyType, SuperType, CardTag } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State, StateUtils,
  GameMessage, PlayerType, SlotType, GameError } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { AttachEnergyPrompt } from '../../game/store/prompts/attach-energy-prompt';
import { RemoveSpecialConditionsEffect } from '../../game/store/effects/attack-effects';

export class Gardevoirex extends PokemonCard {

  public regulationMark = 'G';

  public tags = [ CardTag.POKEMON_ex ];

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Kirlia';

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 310;

  public weakness = [{ type: CardType.DARK }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public powers = [{
    name: 'Psychic Embrace',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'As often as you like during your turn (before your attack), ' +
      'you may attach a P Energy card from your discard pile to 1 of your Pokemon.'
  }];

  public attacks = [
    {
      name: 'Miracle Force',
      cost: [ CardType.PSYCHIC, CardType.PSYCHIC, CardType.COLORLESS ],
      damage: 190,
      text: 'This Pokémon recovers from all Special Conditions.'
    }
  ];

  public set: string = 'SVI';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '86';

  public name: string = 'Gardevoir ex';

  public fullName: string = 'Gardevoir ex SVI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;

      const blocked: number[] = [];
      player.bench.forEach((card, index) => {
        if (card instanceof PokemonCard && card.cardType === CardType.PSYCHIC) {
          blocked.push(index);
        }
      });

      player.active.cards.forEach((card, index) => {
        if (card instanceof PokemonCard && card.cardType === CardType.PSYCHIC) {
          blocked.push(index);
        }
      });


      state = store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_TO_BENCH,
        player.discard,
        PlayerType.BOTTOM_PLAYER,
        [ SlotType.BENCH, SlotType.ACTIVE ],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Basic Psychic Energy' },
        { allowCancel: true, min: 0 },
      ), transfers => {
        transfers = transfers || [];
        // cancelled by user
        if (transfers.length === 0) {
          return state;
        }
        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          const pokemonCard = target.cards[0] as PokemonCard;
          if (pokemonCard.cardType !== CardType.PSYCHIC) {
            throw new GameError(GameMessage.INVALID_TARGET);
          }
          player.discard.moveCardTo(transfer.card, target);
          target.damage += 20;
        }

        return state;
      });
      if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
        const player = effect.player;
  
        const removeSpecialCondition = new RemoveSpecialConditionsEffect(effect, undefined);
        removeSpecialCondition.target = player.active;
        state = store.reduceEffect(state, removeSpecialCondition);
        return state;
      }
    }
    return state;
  }
}