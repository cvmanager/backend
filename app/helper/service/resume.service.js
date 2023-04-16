import autoBind from "auto-bind";

import Resume from "../../models/resume.model.js";
import ServiceBase from "./base.service.js";

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

    async plusSummeryCount(resume, field) {
        let fieldCount = 0;
        let summaryCount = resume.summary_count;
        if (summaryCount != undefined && summaryCount[field] != undefined) fieldCount = summaryCount[field];
        summaryCount[field] = fieldCount + 1;
        resume.field = summaryCount;
        await resume.save();
    }

    async minusSummeryCount(resume, field) {
        let fieldCount = 0;
        let summaryCount = resume.summary_count;
        if (summaryCount != undefined && summaryCount[field] != undefined) fieldCount = summaryCount[field];
        if (fieldCount > 0) summaryCount[field] = fieldCount - 1;
        resume.field = summaryCount;
        await resume.save();
    }
}

export default new ResumeService(Resume);