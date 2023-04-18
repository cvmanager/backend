import { tags } from './data';

class TagData {
    getTag() {
        return Object.values(tags)[0];
    }

    getTags() {
        return tags;
    }

    getTagById(tagId) {
        return tags.some(tag => tag.id == tagId);
    }
}

export default TagData