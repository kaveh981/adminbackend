
import { Stories as Story} from '../../../model-layer';

interface IStories {
    addStory(story: AddStory): Promise<Story>;
}
export { IStories };






