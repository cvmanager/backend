import Skill from '../../models/skill.model';
import { skills } from './data';

class SkillData {
    getSkill() {
        return Object.values(skills)[0];
    }

    getSkills() {
        return skills;
    }

    addSkill(skills) {
        Skill.insertMany(skills);
    }
}

export default SkillData 
