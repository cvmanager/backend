import autoBind from "auto-bind";

import Resume from "../../models/resume.model.js";
import ServiceBase from "./base.service.js";
import ResumeComments from '../../models/resumeComment.model.js';

const endOfResumeStatus = ['rejected', 'hired'];

class ResumeService extends ServiceBase {
    constructor(model) {
        super(model)
        this.model = model
        autoBind(this)
    }

    async setProccessDuration(resume) {
        if (endOfResumeStatus.includes(resume.status)) {
            let createdAtTimeStamp = Math.floor(new Date(resume.createdAt).getTime() / 1000,)
            let rejectedOrHiredTimeStamp = Math.floor(new Date().getTime() / 1000)
            let processDuration = rejectedOrHiredTimeStamp - createdAtTimeStamp
            resume.process_duration = processDuration
            await resume.save()
        }
    }

    async getResumeCommentCount(resume) {
        let commentCount = await ResumeComments.find({ 'resume_id': resume._id }).count();
        return commentCount;
    }

    async updateSummeryCount(resume, field, count) {
        let summaryCount = resume.summary_count;
        summaryCount[field] = count;
        resume.summary_count = summaryCount;
        await resume.save();
    }
}

export default new ResumeService(Resume);