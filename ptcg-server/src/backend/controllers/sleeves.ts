import { Request, Response } from 'express';
import { AuthToken } from '../services';
import { Controller, Get } from './controller';
import { Sleeve } from '../../storage';

export class Sleeves extends Controller {

  @Get('/list')
  @AuthToken()
  public async onList(req: Request, res: Response) {
    const sleeves = await Sleeve.find({ order: { sortOrder: 'ASC', name: 'ASC' } });
    res.send({
      ok: true,
      sleeves: sleeves.map(sleeve => ({
        identifier: sleeve.identifier,
        name: sleeve.name,
        imagePath: sleeve.imagePath,
        isDefault: sleeve.isDefault,
        sortOrder: sleeve.sortOrder
      }))
    });
  }
}
