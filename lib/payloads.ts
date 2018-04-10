import { Employees, Users, StoryPropNames, Stories, StoryProperties } from '../model-layer';

export module Payload {

    export function getEmployee(e: Employees) {
        return {
            name: e.user.name, family: e.user.family, email: e.email, employeeId: e.employeeId
        }
    };

    export function getProductCategories(e: any) {
        return {
            name: e.name, id: e.id, hasChildren: e.hasChildren
        }
    };

    export function getPropertyNames(e: StoryPropNames) {
        return {
            property: e.propertyName, propertyId: e.propertyNameId
        }
    };

    export function getStoryNames(e: Stories) {
        return {
            name: e.name, storyId: e.storyId
        }
    };

    export function addEmployee(user: Users) {
        return {
            name: user.name, family: user.family, email: user.employee.email, employeeId: user.employee.employeeId
        }
    };

    export function getEmployeeById(story: Stories) {
        return {
            storyId: story.storyId, name: story.name, description: story.description, location: story.location,
            time: story.time, capacity: story.capacity, price: story.price, storyProperties: story.storyProperties.map(storyProperty => {
                return { property: storyProperty.storyPropName.propertyName, value: storyProperty.value }
            })
        }
    }
}

