import { PokemonCard, Stage, CardType, StoreLike, State, GameMessage, PlayerType, SlotType, StateUtils, DamageMap, PowerType, ChoosePokemonPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { HealEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { RemoveDamagePrompt } from '../../game/store/prompts/remove-damage-prompt';

export class Munkidori extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public regulationMark = 'H';

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 110;

  public weakness = [{ type: CardType.DARK }];

  public resistance = [{type: CardType.FIGHTING, value: -30}];

  public retreat = [ CardType.COLORLESS ];

  public powers = [{
    name: 'Adrena-Brain',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, if this Pokémon has any [D] Energy attached, you may move up to 3 damage counters from 1 of your Pokémon to 1 of your opponent\'s Pokémon.'
  }];

  public attacks = [
    {
      name: 'Mind Bend',
      cost: [ CardType.PSYCHIC, CardType.COLORLESS ],
      damage: 60,
      text: 'Your opponent\'s Active Pokémon is now Confused.'
    }
  ];

  public set: string = 'TWM';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '95';

  public name: string = 'Munkidori';

  public fullName: string = 'Munkidori TWM';

  public readonly ADRENABRAIN_MARKER = 'ADRENABRAIN_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.ADRENABRAIN_MARKER, this);
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.ADRENABRAIN_MARKER, this);
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;

      // const blocked: CardTarget[] = [];
      // let hasPokemonWithDamage: boolean = false;
      // player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
      //   if (cardList.damage === 0) {
      //     blocked.push(target);
      //   } else {
      //     hasPokemonWithDamage = true;
      //   }
      // });
    
      // if (hasPokemonWithDamage === false) {
      //   throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      // }

      // player.active.cards.forEach((card, index) => {
      //   if (card instanceof PokemonCardList && card.damage == 0) {
      //     blocked.push();
      //   }
      // });
    
      const maxAllowedDamage: DamageMap[] = [];
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        maxAllowedDamage.push({ target, damage: card.hp + 30 });
      });
    
      const damage = 30;
    
      return store.prompt(
        state,
        new RemoveDamagePrompt(
          effect.player.id,
          GameMessage.CHOOSE_POKEMON_TO_HEAL,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.ACTIVE, SlotType.BENCH],
          damage,
          maxAllowedDamage,
          { allowCancel: false }
        ), targets => {
          const results = targets || [];
          for (const result of results) {
            const target = StateUtils.getTarget(state, player, result.target);
            
            const healEffect = new HealEffect(player, target, result.damage);
            state = store.reduceEffect(state, healEffect);
          

            return store.prompt(state, new ChoosePokemonPrompt(
              player.id,
              GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
              PlayerType.TOP_PLAYER,
              [ SlotType.BENCH, SlotType.ACTIVE ],
              { min: 1, max: 1, allowCancel: false },
            ), selected => {
              const targets = selected || [];
              targets.forEach(target => {
                target.damage += result.damage;
              });

              return state;
            }
            );
          }
        });
    }
    return state;
  }
}
