import autoBind from "auto-bind";

import Resume from "../../models/resume.model.js";
import ServiceBase from "./base.service.js";
import ResumeComments from '../../models/resumeComment.model.js';
import Interview from "../../models/interview.model.js";

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

    async updateRating(resume) {
        let rating = resume.rating;
        let ratingSum = 0;
        let ratingCount = 0;

        let interviews = await Interview.find({ 'resume_id': resume._id });
        if (interviews) {
            interviews.map(value => {
                if (value.rating != undefined) {
                    ratingSum += value.rating * 2;
                    ratingCount += 2;
                }
            })

        }

        if (resume.call_history) {
            resume.call_history.map(value => {
                if (value.rating != undefined) {
                    ratingSum += value.rating
                    ratingCount += 1;
                }
            })
        }

        if (ratingCount > 0) {
            rating = ratingSum / ratingCount;
        }

        resume.rating = parseFloat(rating).toFixed(2);
        await resume.save();
    }

    async fillIndexOfResume(resume) {
        let lastIndex = await Resume.findOne({ 'position_id': resume.position_id }, {}, { sort: { 'index': -1 } })
        resume.index = lastIndex.index + 1;
        await resume.save();
    }
}

export default new ResumeService(Resume);