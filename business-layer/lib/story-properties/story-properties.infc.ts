
import { StoryProperties, StoryPropNames } from '../../../model-layer';

interface IStoryProperties {

    addPropertyName(propertyName: AddPropertyName): Promise<StoryPropNames>;
    getPropNameById(propNameId: number): Promise<StoryPropNames>;
    getPropNames(propName: string): Promise<StoryPropNames[]>;
}
export { IStoryProperties };






