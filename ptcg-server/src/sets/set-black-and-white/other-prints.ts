import { EnergyRetrieval } from '../set-scarlet-and-violet/energy-retrieval';
import { Switch } from '../set-scarlet-and-violet/switch';

export class EnergyRetrievalBLW extends EnergyRetrieval {
  public set: string = 'BLW';
  public setNumber: string = '92';
  public regulationMark = '';
  public name: string = 'Energy Retrieval';
  public fullName: string = 'Energy Retrieval BLW';
}

export class SwitchBLW extends Switch {
  public set: string = 'BLW';
  public setNumber: string = '104';
  public regulationMark = '';
  public name: string = 'Switch';
  public fullName: string = 'Switch BLW';
}