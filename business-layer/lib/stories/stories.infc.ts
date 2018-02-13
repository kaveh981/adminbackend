
import { Stories } from '../../../model-layer';

interface IStories {
    addStory(story: AddStory): Promise<ReturnStatus>;
    getStories(story: string, take: number): Promise<Stories[]>
}
export { IStories };






