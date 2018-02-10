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

    public async  addStory(story: AddStory): Promise<Story> {

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
                        return null;
                    }
                    newStoryProp.storyPropName = storyPropName;
                } else {
                    let newPropName = new StoryPropNames();
                    newPropName.creator = creator;
                    newPropName.propertyName = property.property;
                    newPropName.status = Status.active;
                    newStoryProp.storyPropName = newPropName;
                }
                newStoryProp.value = property.value;
                newStoryProp.story = newStory;
                newStoryProperties.push(newStoryProp);
            });
            newStory.storyProperties = newStoryProperties
            let result: Story = await this.repo.save(newStory);
            return result;
        }
        return null;
    }
}
export { Stories };


