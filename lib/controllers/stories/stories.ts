import { controller, httpGet, httpPost, httpPut, httpDelete } from 'inversify-express-utils';
import { injectable, inject } from 'inversify';
import { Request } from 'express';
import { Stories as Story } from '../../../model-layer';
import { IStories } from '../../../business-layer';
import { Payload } from '../../exporter';

@injectable()
@controller('/stories')
export class StoryController {

  constructor( @inject('Stories') private stories: IStories) { }

  @httpPost('/')
  public async addStory(request: Request): Promise<any> {
    let story: AddStory = {
      creatorId: request.body['creatorId'],
      name: request.body['name'],
      time: request.body['time'],
      price: request.body['price'],
      location: request.body['location'],
      capacity: request.body['capacity'],
      properties: request.body['properties']
    }
    return await this.stories.addStory(story);
  }
}
