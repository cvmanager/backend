import autoBind from "auto-bind";

import Resume from "../../models/resume.model.js";
import ServiceBase from "./base.service.js";
import ResumeComments from '../../models/resumeComment.model.js';
import Interview from "../../models/interview.model.js";
import Viewlog from "../../models/viewlog.model.js";
import notificationService from './notification.service.js'
import i18n from '../../middlewares/lang.middleware.js'
import userService from './user.service.js'
import managerService from "./manager.service.js";
import { removeDuplicates } from "../helper.js";

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

    async getResumeViewCount(resume) {
        let viewCount = await Viewlog.aggregate([
            {
                $match: {
                    entity: 'resumes',
                    entity_id: resume._id
                },
            },
            {
                $group: {
                    _id: "$created_by",
                    count: { $sum: 1 }
                },
            }
        ]);
        return viewCount.length;
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

    async addUpdateStatusLog(resume, req, pervStatus) {
        let statusHistoryLog = {
            old_status: pervStatus,
            new_status: resume.status,
            createdAt: new Date(),
            created_by: req.user.id
        };

        resume.status_history.push(statusHistoryLog)
        await resume.save();
    }

    async getContributorsId(resume) {
        let contributorsId = [];
        if (resume.contributors.length === 0) return contributorsId

        for (let contributor of resume.contributors) {
            contributorsId.push(contributor);
        }
        return contributorsId;
    }

    async setNotificationWhenUpdateStatus(resume, req, step) {
        //position manager
        let userIdList = await managerService.getManagersIdByEntity('positions', resume.position_id);

        //resume owner
        userIdList.push(resume.created_by._id)

        //resume assigners
        userIdList = userIdList.concat(resume.assigners)

        if (['hired', 'end_cooperation'].includes(resume.status)) {
            //project manager
            userIdList = userIdList.concat(await managerService.getManagersIdByEntity('projects', resume.project_id))
            
            //company manager
            userIdList = userIdList.concat(await managerService.getManagersIdByEntity('companies', resume.company_id))
        }

        // remove douplicate and login user 
        userIdList = removeDuplicates(userIdList)
        userIdList = userIdList.filter(item => !item.equals(req.user._id))

        let title = i18n.__(`notification.messages.title.${step}`)
        let body = i18n.__(`notification.messages.body.${step}`, {
            user: req.user.fullname,
            status: resume.status
        })

        for (let userId of userIdList) {
            await notificationService.setNotificationForResume(resume, req, userId, step, title, body);
        }
    }

    async setNotificationWhenResumeCreate(resume, req, step) {
        //position manager
        let userIdList = await managerService.getManagersIdByEntity('positions', resume.position_id);

        // remove douplicate and login user 
        userIdList = removeDuplicates(userIdList)
        userIdList = userIdList.filter(item => !item.equals(req.user._id))

        let title = i18n.__(`notification.messages.title.${step}`)
        let body = i18n.__(`notification.messages.body.${step}`, {
            user: req.user.fullname
        })

        for (let userId of userIdList) {
            await notificationService.setNotificationForResume(resume, req, userId, step, title, body);
        }
    }

}

export default new ResumeService(Resume);