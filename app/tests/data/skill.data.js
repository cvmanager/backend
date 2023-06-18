import { skills } from './data';

class SkillData {
    getSkill() {
        return Object.values(skills)[0];
    }

    getSkills() {
        return skills;
    }
}

export default SkillData 
