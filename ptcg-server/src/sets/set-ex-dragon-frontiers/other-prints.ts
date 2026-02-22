import { BoostEnergy } from "../set-aquapolis/boost-energy";
import { ProfessorElmsTrainingMethod } from "../set-ex-unseen-forces/professors-elm-training-method";
import { TvReporter } from "../set-ex-dragon/tv-reporter";

export class BoostEnergyDF extends BoostEnergy {
  public fullName = 'Boost Energy DF';
  public set = 'DF';
  public setNumber = '87';
  public text = 'Boost Energy can be attached only to an Evolved Pokémon. Discard Boost Energy at the end of the turn it was attached. Boost Energy provides [C][C][C] Energy. The Pokémon Boost Energy is attached to can\'t retreat. When the Pokémon Boost Energy is attached to is no longer an Evolved Pokémon, discard Boost Energy.';
}

export class ProfessorElmsTrainingMethodDF extends ProfessorElmsTrainingMethod {
  public fullName = 'Professor Elm\'s Training Method DF';
  public set = 'DF';
  public setNumber = '79';
}

export class TvReporterDF extends TvReporter {
  public fullName = 'TV Reporter DF';
  public set = 'DF';
  public setNumber = '82';
}