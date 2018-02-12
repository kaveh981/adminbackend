import { injectable, inject } from 'inversify';
import { Stories as Story, StoryPropNames, StoryProperties } from '../../../model-layer';
import { GenericRepository } from '../../../data-layer';
import { IStories } from './stories.infc';
import { IStoryProperties } from '../story-properties/story-properties.infc';
import { IUsers } from '../users/users.infc';


@injectable()
class Stories implements IStories {

    constructor( @inject('GenericRepository') private repo: GenericRepository<any>,
        @inject('StoryProperties') private storyProperties: IStoryProperties, @inject('Users') private users: IUsers) { }

    public async  addStory(story: AddStory): Promise<ReturnStatus> {

        let creator = await this.users.getUserById(story.creatorId);
        if (creator) {
            let newStory = new Story();
            newStory.capacity = story.capacity;
            newStory.location = story.location;
            newStory.name = story.name;
            newStory.price = story.price;
            newStory.time = story.time;
            newStory.status = Status.active;
            newStory.creator = creator;
            let newStoryProperties: StoryProperties[] = [];
            story.properties.forEach(async property => {
                let newStoryProp = new StoryProperties();
                if (property.propertyId) {
                    let storyPropName = await this.storyProperties.getPropNameById(property.propertyId)
                    console.log(storyPropName);
                    if (!storyPropName) {
                        return { success: false, message: 'propertyId is invalid.' };
                    }
                    newStoryProp.storyPropName = storyPropName;
                } else {
                    let newPropName = new StoryPropNames();
                    newPropName.creator = creator;
                    newPropName.propertyName = property.property;
                    newPropName.status = Status.active;
                    newStoryProp.storyPropName = newPropName;
                    newStoryProp.story = newStory;
                }
                newStoryProp.value = property.value;
                newStoryProperties.push(newStoryProp);
            });
            newStory.storyProperties = newStoryProperties
            let result: Story = await this.repo.save(newStory);
            return { success: true, message: 'Story added successfuly!' };
        }
        return { success: false, message: 'creator is not avaiable' };
    }
}
export { Stories };


