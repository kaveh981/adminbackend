
import { Stories as Story} from '../../../model-layer';

interface IStories {
    addStory(story: AddStory): Promise<ReturnStatus>;
}
export { IStories };






