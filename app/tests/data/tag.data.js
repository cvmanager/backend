import { tags } from './data';

class TagData {
    getTag() {
        return Object.values(tags)[0];
    }

    getTags() {
        return tags;
    }

    getTagById(tagId) {
        return tags.find(tag => tag._id == tagId);
    }
}

export default TagData