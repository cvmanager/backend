import express from 'express'
import SkillController from '../http/controllers/skill.controller.js';
import SkillValidation from '../validators/skill.validation.js';
import { toLowerCase } from '../middlewares/lowerCase.middleware.js';
import { Upload } from '../helper/upload.js';

const skillRouter = express.Router();

skillRouter
    .get('/', SkillValidation.index(), toLowerCase, SkillController.index)
    .post('/', Upload('skills', 'icon', 'image'), SkillValidation.create(), toLowerCase, SkillController.create)
export default skillRouter