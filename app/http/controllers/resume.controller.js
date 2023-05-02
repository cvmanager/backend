import { ResumeEvents } from '../../events/subscribers/resumes.subscriber.js';
import { TagEvents } from '../../events/subscribers/tags.subscriber.js';
import NotFoundError from '../../exceptions/NotFoundError.js';
import Position from '../../models/position.model.js';
import ResumeComments from '../../models/resumeComment.model.js';
import EventEmitter from '../../events/emitter.js';
import AppResponse from '../../helper/response.js';
import Resume from '../../models/resume.model.js';
import Company from '../../models/company.model.js';
import Controller from './controller.js';
import BadRequestError from '../../exceptions/BadRequestError.js';
import { mergeQuery } from '../../helper/mergeQuery.js';
import resumeService from '../../helper/service/resume.service.js';
import userService from '../../helper/service/user.service.js';
import TagService from '../../helper/service/tag.service.js';

class ResumeController extends Controller {

    /**
    * GET /resumes
    * 
    * @summary get a list of all resumes
    * @tags Resume
    * @security BearerAuth
    * 
    * @param  { string } query.path - search for special fields - application/json
    * 
    * @return { resume.success } 200 - success response
    * @return { message.badrequest_error } 400 - bad request respone
    * @return { message.badrequest_error } 404 - not found respone
    * @return { message.unauthorized_error }     401 - UnauthorizedError
    * @return { message.server_error  }    500 - Server Error
    */
    async index(req, res, next) {
        try {
            const { page = 1, size = 10, query = '' } = req.query

            let searchQuery = {}

            searchQuery = mergeQuery(searchQuery, req.rbacQuery)
            if (query.length > 0) {
                searchQuery = {
                    $or: [
                        { firstname: { '$regex': new RegExp(query, "i") } },
                        { lastname: { '$regex': new RegExp(query, "i") } },
                        { email: { '$regex': query } },
                        { mobile: { '$regex': query } },
                        { education: { '$regex': query } },
                        { phone: { '$regex': query } },
                    ]
                }
            }

            const resumeList = await Resume.paginate(searchQuery, {
                page: (page) || 1,
                limit: size,
                sort: { createdAt: -1 },
                populate: [
                    { path: 'company_id', select: 'name' },
                    { path: 'project_id', select: 'name' },
                    { path: 'created_by', select: ['firstname', 'lastname'] },
                    { path: 'contributors', select: ['firstname', 'lastname', 'avatar'] }
                ]
            });
            AppResponse.builder(res).message("project.messages.resume_list_found").data(resumeList).send();
        } catch (err) {
            next(err);
        }
    }

    /**
    * GET /resumes/{id}
    * 
    * @summary gets a resume by id
    * @tags Resume
    * @security BearerAuth
    *
    * @param  { string } id.path.required - resume id
    * 
    * @return { resume.success } 200 - success response
    * @return { message.badrequest_error }  400 - bad request respone
    * @return { message.badrequest_error }  404 - not found respone
    * @return { message.badrequest_error }       401 - UnauthorizedError
    * @return { message.server_error  }     500 - Server Error
    */
    async find(req, res, next) {
        try {
            let resume = await Resume.findById(req.params.id)
                .populate([
                    { path: 'created_by' },
                    { path: 'contributors', select: ['firstname', 'lastname', 'avatar'] }
                ]);
            if (!resume) throw new NotFoundError('resume.error.resume_notfound');

            EventEmitter.emit(ResumeEvents.FIND, resume)

            AppResponse.builder(res).message("resume.messages.project_found").data(resume).send();
        } catch (err) {
            next(err);
        }
    }

    /**
    * POST /resumes
    * 
    * @summary creates a resume
    * @tags Resume
    * @security BearerAuth
    * 
    * @param { resume.create } request.body - resume info - application/json
    * 
    * @return { resume.success } 200 - success response
    * @return { message.badrequest_error }  400 - bad request respone
    * @return { message.NotFoundError }  404 - not found respone
    * @return { message.badrequest_error }  401 - UnauthorizedError
    * @return { message.server_error  }     500 - Server Error
    */
    async create(req, res, next) {
        try {

            let position = await Position.findById(req.body.position_id)
            if (!position) throw new NotFoundError('position.errors.position_not_found');

            let company = await Company.findById(position.company_id)
            if (!company.is_active) throw new BadRequestError('company.errors.company_is_not_active');

            req.body.created_by = req.user._id;
            req.body.project_id = position.project_id;
            req.body.company_id = position.company_id;

            let resume = await Resume.create(req.body)

            EventEmitter.emit(ResumeEvents.CREATE, resume)

            AppResponse.builder(res).status(201).message("resume.messages.resume_successfully_created").data(resume).send();
        } catch (err) {
            next(err);
        }
    }

    /**
    * PATCH /resumes/{id}
    * 
    * @summary updates a resume
    * @tags Resume
    * @security BearerAuth
    * 
    * @param  { string } id.path.required - resume id
    * @param { resume.update } request.body - resume info - application/json
    * 
    * @return { resume.success } 200 - success response
    * @return { message.badrequest_error }  400 - bad request respone
    * @return { message.badrequest_error }  404 - not found respone
    * @return { message.badrequest_error }       401 - UnauthorizedError
    * @return { message.server_error  }     500 - Server Error
    */
    async update(req, res, next) {
        try {
            let resume = await Resume.findById(req.params.id);
            if (!resume) throw new NotFoundError('resume.errors.resume_notfound');


            await Resume.findByIdAndUpdate(req.params.id, req.body, { new: true })
                .then(resume => {
                    EventEmitter.emit(ResumeEvents.UPDATE, resume)
                    AppResponse.builder(res).message("resume.messages.resume_successfully_updated").data(resume).send()
                })
                .catch(err => next(err));
        } catch (err) {
            next(err);
        }
    }

    /**
    * DELETE /resumes/{id}
    * 
    * @summary deletes a resume by id
    * @tags Resume
    * @security BearerAuth
    * 
    * 
    * @param  { string } id.path.required - resume id
    * 
    * @return { resume.success } 200 - success response
    * @return { message.badrequest_error }  400 - bad request respone
    * @return { message.badrequest_error }  404 - not found respone
    * @return { message.badrequest_error }       401 - UnauthorizedError
    * @return { message.server_error  }     500 - Server Error
    */
    async delete(req, res, next) {
        try {
            let resume = await Resume.findById(req.params.id);
            if (!resume) throw new NotFoundError('resume.errors.resume_notfound');
            resume.deleted_at = Date.now();
            resume.deleted_by = req.user._id;

            await resume.save();

            EventEmitter.emit(ResumeEvents.DELETE_RESUME, resume)


            AppResponse.builder(res).message("resume.messages.resume_successfully_deleted").data(resume).send();
        } catch (err) {
            next(err);
        }
    }

    /**
    * DELETE /resumes/{id}/status
    * 
    * @summary update status a resume by id
    * @tags Resume
    * @security BearerAuth
    * 
    * @param  { string } id.path.required - resume id
    * @param { resume.update_status } request.body - resume info - application/json
    * 
    * @return { resume.success } 200 - success response
    * @return { message.badrequest_error }  400 - bad request respone
    * @return { message.NotFoundError }     404 - not found respone
    * @return { message.badrequest_error }  401 - UnauthorizedError
    * @return { message.server_error  }     500 - Server Error
    */
    async updateStatus(req, res, next) {
        try {
            let resume = await resumeService.findByParamId(req);
            if (resume.status == req.body.status) throw new BadRequestError('resume.errors.can_not_update_status_to_current')
            resume.status_history.push({
                old_status: resume.status,
                new_status: req.body.status,
                createdAt: new Date(),
                created_by: req.user._id
            });
            resume.status = req.body.status;
            resume.index = req.body.index;
            await resume.save();

            EventEmitter.emit(ResumeEvents.UPDATE_STATUS, resume)

            AppResponse.builder(res).message("resume.messages.resume_status_successfully_updated").data(resume).send();
        } catch (err) {
            next(err);
        }
    }

    /**
    * PATCH /resumes/:id/file
    * @summary upload resume file
    * @tags Resume
    * @security BearerAuth
    * 
    * @param { string } id.path.required - resume id
    * @param { resume.upload_file } request.body - resume info - multipart/form-data
    * 
    * @return { resume.success }              200 - update resume profile
    * @return { message.badrequest_error }      400 - resume not found
    * @return { message.badrequest_error }      401 - UnauthorizedError
    * @return { message.server_error}      500 - Server Error
    */
    async uploadFile(req, res, next) {
        try {
            let resume = await Resume.findById(req.params.id);
            if (!resume) throw new NotFoundError('resume.error.resume_notfound');

            let files = [];
            if (resume.file) {
                files = resume.file.filter(fileName => {
                    return fileName != null & fileName != "";
                })
            }
            if (req.body.file) files.push(req.body.file);
            resume.file = files;
            await resume.save();

            EventEmitter.emit(ResumeEvents.ADD_FILE, resume)

            AppResponse.builder(res).message("resume.message.resume_file_successfully_upload").data(resume).send()
        } catch (err) {
            next(err);
        }
    }

    /**
    * GET /resumes/{id}/comments
    * 
    * @summary get resume comments list
    * @tags Resume
    * @security BearerAuth
    * 
    * @param  { string } id.path.required - resume id
    * @param { resume.call_history } request.body - call history info - application/json
    * 
    * @return { resume.call_history_success } 200 - success response
    * @return { message.badrequest_error }  400 - bad request respone
    * @return { message.badrequest_error }  401 - UnauthorizedError
    * @return { message.NotFoundError }     404 - not found respone
    * @return { message.server_error }     500 - Server Error
    */
    async comments(req, res, next) {
        try {
            let resume = await Resume.findById(req.params.id);
            if (!resume) throw new NotFoundError('resume.errors.resume_notfound');

            let resumeComments = await ResumeComments.find({ 'resume_id': resume._id });

            AppResponse.builder(res).message("resume.messages.resume_comments_list_found").data(resumeComments).send();
        } catch (err) {
            next(err);
        }
    }

    /**
    * PATCH /resumes/{id}/comments
    * 
    * @summary add  comments for resume in table
    * @tags Resume
    * @security BearerAuth
    * 
    * @param  { string } id.path.required - resume id
    * @param { resumeComment.create} request.body - resume info - application/json
    * 
    * @return { resumeComment.success }     201 - success response
    * @return { message.badrequest_error }  400 - bad request respone
    * @return { message.badrequest_error }  401 - UnauthorizedError
    * @return { message.NotFoundError }     404 - not found respone
    * @return { message.server_error  }     500 - Server Error
    */
    async addComments(req, res, next) {
        try {
            let resume = await Resume.findById(req.params.id);
            if (!resume) throw new NotFoundError('resume.errors.resume_notfound');

            req.body.body = req.body.body
            req.body.resume_id = resume._id
            req.body.created_by = req.user._id

            let resumeCommentsRes = await ResumeComments.create(req.body)
            EventEmitter.emit(ResumeEvents.ADD_COMMENT, resume)

            AppResponse.builder(res).status(201).message("resume.messages.resume_comment_successfully_created").data(resumeCommentsRes).send();
        } catch (err) {
            next(err);
        }
    }

    /**
      * PATCH /resumes/{id}/call-history
      * 
      * @summary creates a call history for specific resume
      * @tags Resume
      * @security BearerAuth
      * 
      * @param  { string } id.path.required - resume id
      * @param { resume.create } request.body - call history info - application/json
      * 
      * @return { resume.success } 200 - success response
      * @return { message.badrequest_error }  400 - bad request respone
      * @return { message.badrequest_error }  404 - not found respone
      * @return { message.badrequest_error }       401 - UnauthorizedError
      * @return { message.server_error  }     500 - Server Error
      */
    async callHistory(req, res, next) {
        try {
            let resume = await resumeService.findByParamId(req);

            let calling_date = new Date(req.body.calling_date)
            let callHistory = {
                result: req.body.result,
                calling_date: calling_date,
                description: req.body.description,
                rating: req.body.rating,
                created_by: req.user._id
            }

            let recall_at = null
            if (req.body.recall_at !== undefined && req.body.recall_at !== "") {
                recall_at = new Date(req.body.recall_at)
                callHistory.recall_at = recall_at
            }
            if (recall_at !== null && calling_date > recall_at) {
                throw new BadRequestError('calling_date must be before recall_at');
            }

            resume.call_history.push(callHistory)
            await resume.save()
            EventEmitter.emit(ResumeEvents.ADD_CALL_HISTORY, resume)

            AppResponse.builder(res).message("resume.messages.resume_call_history_successfully_created").data(resume).send();
        } catch (err) {
            next(err);
        }
    }

    /**
    * PATCH /resumes/{id}/hire_status
    * 
    * @summary update hire status
    * @tags Resume
    * @security BearerAuth
    * 
    * @param { string } id.path.required - resume id
    * @param { resume.hire_status } request.body - application/json
    * 
    * @return { resume.success }            200 - success response
    * @return { message.badrequest_error }  400 - bad request respone
    * @return { message.badrequest_error }  404 - not found respone
    * @return { message.badrequest_error }  401 - UnauthorizedError
    * @return { message.server_error  }     500 - Server Error
    */
    async hireStatus(req, res, next) {
        try {
            let resume = await Resume.findById(req.params.id);
            if (!resume) throw new NotFoundError('resume.errors.resume_notfound');

            if (req.body.hire_status == 'hired_on' && (req.body.income == '' || req.body.income == undefined)) {
                throw new BadRequestError('resume.errors.income_cant_be_empty');
            }

            resume.hire_status = req.body.hire_status;
            resume.income = req.body.income;
            await resume.save();

            AppResponse.builder(res).message("resume.messages.hire_status_successfully_updated").data(resume).send();
        } catch (err) {
            next(err);
        }
    }

    /**
    * PATCH /resumes/{id}/contributor/{user_id}
    * 
    * @summary set contributor to resume
    * @tags Resume
    * @security BearerAuth
    * 
    * @param { string } id.path.required - resume id
    * @param { string } user_id.path.required - user id
    * @param { resume.contributor } request.body - application/json
    * 
    * @return { resume.success }            200 - success response
    * @return { message.badrequest_error }  400 - bad request respone
    * @return { message.badrequest_error }  404 - not found respone
    * @return { message.badrequest_error }  401 - UnauthorizedError
    * @return { message.server_error  }     500 - Server Error
    */
    async setContributor(req, res, next) {
        try {
            let resume = await resumeService.findByParamId(req);

            let contributor_id = req.params.user_id;
            let user = await userService.findOne({ '_id': contributor_id })
            if (!user) throw new NotFoundError('user.errors.user_notfound');


            if (resume.contributors && resume.contributors.includes(contributor_id)) throw new BadRequestError('resume.errors.contributor_could_not_be_duplicate');
            
            resume.contributors.push(contributor_id) ;
            await resume.save();

            AppResponse.builder(res).message("resume.messages.contributor_successfully_added").data(resume).send();
        } catch (err) {
            next(err);
        }
    }

    /**
    * DELETE /resumes/{id}/contributor/{user_id}
    * 
    * @summary unset special contributor from resume
    * @tags Resume
    * @security BearerAuth
    * 
    * @param { string } id.path.required - resume id
    * @param { string } user_idid.path.required - user_id id
    * @param { resume.contributor } request.body - application/json
    * 
    * @return { resume.success }            200 - success response
    * @return { message.badrequest_error }  400 - bad request respone
    * @return { message.badrequest_error }  404 - not found respone
    * @return { message.badrequest_error }  401 - UnauthorizedError
    * @return { message.server_error  }     500 - Server Error
    */
    async unsetContributor(req, res, next) {
        try {
            let resume = await resumeService.findByParamId(req)

            let user = await userService.findOne({ '_id': req.params.user_id })
            if (!user) throw new NotFoundError('user.errors.user_notfound');

            let contributor = req.body.contributor;
            let contributors = []
            if (resume.contributors) {
                contributors = resume.contributors;
            }

            if (!contributors.includes(contributor)) throw new BadRequestError('resume.errors.contributor_not_exists');
            

            resume.contributors = contributors.filter(e => e != contributor)
            await resume.save();

            AppResponse.builder(res).message("resume.messages.contributor_successfully_removed").data(resume).send();
        } catch (err) {
            next(err);
        }
    }

    /**
    * PATCH /resumes/:id/avatar
    * @summary upload resume avatar
    * @tags Resume
    * @security BearerAuth
    * 
    * @param { string } id.path.required - resume id
    * @param { resume.upload_avatar } request.body - resume info - multipart/form-data
    * 
    * @return { resume.success }               200 - update resume profile
    * @return { message.badrequest_error }      400 - resume not found
    * @return { message.badrequest_error }      401 - UnauthorizedError
    * @return { message.server_error}           500 - Server Error
    */
    async updateAvatar(req, res, next) {
        try {
            let resume = await resumeService.findByParamId(req);

            if (req.body.avatar) {
                resume.avatar = req.body.avatar;
                await resume.save();
            }

            AppResponse.builder(res).message("resume.messages.resume_successfully_updated").data(resume).send()
        } catch (err) {
            next(err);
        }
    }

    /**
    * PATCH /resumes/{id}/tag/{tag_id}
    * 
    * @summary add comments for resume in table
    * @tags Resume
    * @security BearerAuth
    * 
    * @param  { string } id.path.required - resume id
    * @param  { string } tag_id.path.required - tag id
    * @param { tag.create } request.body - resume info - application/json
    * 
    * @return { tag.success }     201 - success response
    * @return { message.badrequest_error }  400 - bad request respone
    * @return { message.badrequest_error }  401 - UnauthorizedError
    * @return { message.NotFoundError }     404 - not found respone
    * @return { message.server_error  }     500 - Server Error
    */
    async setTag(req, res, next) {
        try {
            let resume = await resumeService.findByParamId(req);
            let tag = await TagService.findOne(req.params.tag_id);

            let tags = [];
            if (tags.some(value => value.id == tag._id)) throw new BadRequestError('resume.errors.tag_could_not_be_duplicate');

            tags.push(req.params.tag_id)
            await resume.save();

            EventEmitter.emit(ResumeEvents.ADD_TAG, resume)
            EventEmitter.emit(TagEvents.TAG_USE,tag);

            AppResponse.builder(res).status(200).message("resume.messages.resume_tags_successfully_updated").data(resume).send();
        } catch (err) {
            next(err);
        }
    }

    /**
    * DELETE /resumes/{id}/tag/{tag_id}
    * 
    * @summary add comments for resume in table
    * @tags Resume
    * @security BearerAuth
    * 
    * @param  { string } id.path.required - resume id
    * @param  { string } tag_id.path.required - tag id
    * @param { tag.remove } request.body - resume info - application/json
    * 
    * @return { tag.success }     201 - success response
    * @return { message.badrequest_error }  400 - bad request respone
    * @return { message.badrequest_error }  401 - UnauthorizedError
    * @return { message.NotFoundError }     404 - not found respone
    * @return { message.server_error  }     500 - Server Error
    */
    async unsetTag(req, res, next) {
        try {
            let resume = await resumeService.findByParamId(req);
            let tag = await TagService.findOne(req.params.tag_id);

            if (!resume.tags.some(value => value.id == tag)) throw new BadRequestError('resume.errors.tag_not_exists');

            resume.tags = resume.tags.filter(e => e.id != tag)
            await resume.save();
            EventEmitter.emit(ResumeEvents.REMOVE_TAG, resume)

            AppResponse.builder(res).status(200).message("resume.messages.resume_tags_successfully_deleted").data(resume).send();
        } catch (err) {
            next(err);
        }
    }

    /**
    * PATCH /resumes/{id}/hired
    * 
    * @summary change status of resume to hired
    * @tags Resume
    * @security BearerAuth
    * 
    * @param  { string } id.path.required - resume id
    * @param { resume.hired } request.body - application/json
    * 
    * @return { resume.success } 200 - success response
    * @return { message.badrequest_error }  400 - bad request respone
    * @return { message.badrequest_error }  404 - not found respone
    * @return { message.badrequest_error }       401 - UnauthorizedError
    * @return { message.server_error  }     500 - Server Error
    */
    async hired(req, res, next) {
        try {
            let resume = await resumeService.findByParamId(req);
            if (resume.status === 'hired') throw new BadRequestError('resume.errors.resume_already_hired')

            let fromDate = new Date(req.body.hired_from_date)
            let toDate = new Date(req.body.hired_to_date)
            if (fromDate > toDate) throw new BadRequestError('resume.errors.from_date_must_be_before_to_date');

            resume.status_history.push({
                old_status: resume.status,
                new_status: 'hired',
                createdAt: new Date(),
                created_by: req.user._id
            });

            resume.status = 'hired'
            resume.how_to_cooperate = req.body.how_to_cooperate
            resume.hired_from_date = fromDate
            resume.hired_to_date = toDate
            resume.income = req.body.income
            await resume.save();
            AppResponse.builder(res).status(200).message("resume.messages.resume_tags_successfully_deleted").data(resume).send();
        } catch (err) {
            next(err);
        }
    }
}

export default new ResumeController;