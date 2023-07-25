import { ResumeEvents } from '../../events/subscribers/resumes.subscriber.js';
import NotFoundError from '../../exceptions/NotFoundError.js';
import ResumeComments from '../../models/resumeComment.model.js';
import Interview from '../../models/interview.model.js';
import EventEmitter from '../../events/emitter.js';
import AppResponse from '../../helper/response.js';
import Resume from '../../models/resume.model.js';
import Controller from './controller.js';
import BadRequestError from '../../exceptions/BadRequestError.js';
import { mergeQuery } from '../../helper/mergeQuery.js';
import userService from '../../helper/service/user.service.js';
import TagService from '../../helper/service/tag.service.js';
import SkillService from '../../helper/service/skill.service.js';
import resumeService from '../../helper/service/resume.service.js';
import positionService from '../../helper/service/position.service.js';
import companyService from '../../helper/service/company.service.js';
import i18n from '../../middlewares/lang.middleware.js';
import { getEnume } from '../../helper/helper.js';


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
    * @return { message.bad_request_error } 400 - BadRequest response
    * @return { message.bad_request_error } 404 - not found response
    * @return { message.unauthorized_error }     401 - Unauthorized
    * @return { message.server_error  }    500 - Server Error
    */
    async index(req, res, next) {
        try {
            const { page = 1, size = 10, query = '' } = req.query

            let searchQuery = {}
            let resumes = [], promiseResumes = []

            let resumeStates = getEnume("resume", "status");

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

            resumeStates.map((status) => {
                let resumeList = Resume.find({ status, ...searchQuery })
                    .sort([['index', 1]])
                    .populate([
                        { path: 'interviews', select: ['event_time', 'event_type', 'status', 'type', 'result', 'description', 'rating', 'contribution'] },
                        { path: 'created_by' },
                        { path: 'assigners', select: ['firstname', 'lastname', 'avatar'] },
                        { path: 'interviews', select: ['event_time', 'event_type', 'status', 'type', 'result', 'description', 'rating', 'contribution'] },
                        { path: 'tags', select: ['name', 'color', 'count'] },
                        { path: 'project_id' },
                        { path: 'position_id' },
                        { path: 'company_id' },
                        {
                            path: 'residence_city',
                            populate: [
                                { path: 'province_id' }
                            ],
                        },
                        {
                            path: 'work_city',
                            populate: [
                                { path: 'province_id' }
                            ],
                        }
                    ])
                promiseResumes.push(resumeList)
            })

            let results = await Promise.all(promiseResumes)

            for (let i = 0; i < resumeStates.length; i++) {
                let resume = {}
                resume[resumeStates[i]] = results[i]
                resumes.push(resume)
            }

            AppResponse.builder(res).message("project.messages.resume_list_found").data(resumes).send();
        } catch (err) {
            next(err);
        }
    }


    /**
    * GET /resumes/by-states
    * 
    * @summary get a list of all resumes grouped by states
    * @tags Resume
    * @security BearerAuth
    * 
    * @param  { string } query.path - search for special fields - application/json
    * 
    * @return { resume.success } 200 - success response
    * @return { message.bad_request_error } 400 - BadRequest response
    * @return { message.bad_request_error } 404 - not found response
    * @return { message.unauthorized_error }     401 - Unauthorized
    * @return { message.server_error  }    500 - Server Error
    */
    async resumesByStates(req, res, next) {
        try {
            const { page = 1, size = 10, query = '' } = req.query

            let resumes = [], promiseResumes = []

            let resumeStates = getEnume('resume', 'status');
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

            resumeStates.map((status) => {
                let resumeList = Resume.find({ status, ...searchQuery })
                    .sort([['index', 1]])
                    .populate([
                        { path: 'interviews', select: ['event_time', 'event_type', 'status', 'type', 'result', 'description', 'rating', 'contribution'] },
                        { path: 'created_by' },
                        { path: 'assigners', select: ['firstname', 'lastname', 'avatar'] },
                        { path: 'interviews', select: ['event_time', 'event_type', 'status', 'type', 'result', 'description', 'rating', 'contribution'] },
                        { path: 'tags', select: ['name', 'color', 'count'] },
                        { path: 'project_id' },
                        { path: 'position_id' },
                        { path: 'company_id' },
                        {
                            path: 'residence_city',
                            populate: [
                                { path: 'province_id' }
                            ],
                        },
                        {
                            path: 'work_city',
                            populate: [
                                { path: 'province_id' }
                            ],
                        }
                    ])
                promiseResumes.push(resumeList)
            })

            let results = await Promise.all(promiseResumes)

            for (let i = 0; i < resumeStates.length; i++) {
                let resume = {}
                resume[resumeStates[i]] = results[i]
                resumes.push(resume)
            }

            AppResponse.builder(res).message("project.messages.resume_list_found").data(resumes).send();
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
    * @return { message.bad_request_error }  400 - BadRequest response
    * @return { message.bad_request_error }  404 - not found response
    * @return { message.bad_request_error }       401 - Unauthorized
    * @return { message.server_error  }     500 - Server Error
    */
    async find(req, res, next) {
        try {
            let resume = await resumeService.findById(req.params.id, [
                { path: 'company_id' },
                { path: 'project_id' },
                { path: 'position_id' },
                { path: 'assigners', select: ['firstname', 'lastname', 'avatar'] },
                {
                    path: 'call_history',
                    populate: [
                        { path: 'created_by', select: ['firstname', 'lastname', 'avatar'] }
                    ],
                },
                {
                    path: 'interviews',
                    populate: [
                        { path: 'created_by', select: ['firstname', 'lastname', 'avatar'] },
                        { path: 'contribution', select: ['firstname', 'lastname', 'avatar'] }
                    ],
                    select: ['event_time', 'event_type', 'status', 'type', 'result', 'description', 'rating', 'contribution', 'created_by', 'createdAt']
                },
                { path: 'tags', select: ['name', 'color', 'count'] },
                { path: 'skills', select: ['title', 'color'] },
                {
                    path: 'views',
                    populate: [
                        { path: 'created_by', select: ['firstname', 'lastname', 'avatar', 'username'] }
                    ],
                    select: ['created_by', 'createdAt']
                },
                {
                    path: 'comments',
                    populate: [
                        { path: 'created_by', select: ['firstname', 'lastname', 'avatar'] }
                    ],
                    select: ['resume_id', 'body', 'created_by', 'createdAt']
                },
                { path: 'created_by', select: ['firstname', 'lastname', 'avatar'] },
                {
                    path: 'residence_city',
                    populate: [
                        { path: 'province_id' }
                    ],
                },
                {
                    path: 'work_city',
                    populate: [
                        { path: 'province_id' }
                    ],
                }
            ])

            if (!resume) throw new NotFoundError('resume.errors.resume_notfound');

            EventEmitter.emit(ResumeEvents.FIND, resume, req);

            AppResponse.builder(res).message("resume.messages.resume_found").data(resume).send();
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
    * @return { message.bad_request_error }  400 - BadRequest response
    * @return { message.notfound_error }  404 - not found response
    * @return { message.bad_request_error }  401 - Unauthorized
    * @return { message.server_error  }     500 - Server Error
    */
    async create(req, res, next) {
        try {
            let position = await positionService.findById(req.body.position_id);
            if (!position) throw new NotFoundError('position.errors.position_not_found');

            req.body.created_by = req.user.id;
            req.body.project_id = position.project_id;
            req.body.company_id = position.company_id;

            if (req.body?.birth_year?.length && req.body?.marital_status?.length && req.body?.education?.length) {
                req.body.status = 'pending';
            }

            let company = await companyService.findById(position.company_id);
            if (!company.is_active) throw new BadRequestError('company.errors.company_is_not_active');
            let resume = await Resume.create(req.body)

            EventEmitter.emit(ResumeEvents.CREATE, resume, req)

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
    * @return { message.bad_request_error }  400 - BadRequest response
    * @return { message.bad_request_error }  404 - not found response
    * @return { message.bad_request_error }       401 - Unauthorized
    * @return { message.server_error  }     500 - Server Error
    */
    async update(req, res, next) {
        try {
            let resume = resumeService.findByParamId(req);
            await Resume.findByIdAndUpdate(req.params.id, req.body, { new: true })
                .then(resume => {
                    EventEmitter.emit(ResumeEvents.UPDATE, resume, req)
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
    * @return { message.bad_request_error }  400 - BadRequest response
    * @return { message.bad_request_error }  404 - not found response
    * @return { message.bad_request_error }       401 - Unauthorized
    * @return { message.server_error  }     500 - Server Error
    */
    async delete(req, res, next) {
        try {
            let resume = await resumeService.findByParamId(req);
            resume.deleted_at = Date.now();
            resume.deleted_by = req.user.id;

            await resume.save();

            EventEmitter.emit(ResumeEvents.DELETE_RESUME, resume, req)


            AppResponse.builder(res).message("resume.messages.resume_successfully_deleted").data(resume).send();
        } catch (err) {
            next(err);
        }
    }

    /**
    * PATCH /resumes/{id}/status
    * 
    * @summary update status a resume by id
    * @tags Resume
    * @security BearerAuth
    * 
    * @param  { string } id.path.required - resume id
    * @param { resume.update_status } request.body - resume info - application/json
    * 
    * @return { resume.success } 200 - success response
    * @return { message.bad_request_error }  400 - BadRequest response
    * @return { message.notfound_error }     404 - not found response
    * @return { message.bad_request_error }  401 - Unauthorized
    * @return { message.server_error  }     500 - Server Error
    */
    async updateStatus(req, res, next) {
        try {
            let resume = await resumeService.findByParamId(req);
            if (resume.status == req.body.status) throw new BadRequestError('resume.errors.can_not_update_status_to_current')

            if (resume.status == 'draft' && (!resume.education.length || !resume.marital_status.length || !resume.birth_year)) {
                throw new BadRequestError('resume.errors.resume_information_is_not_complete_to_change_status')
            }

            let oldStatus = resume.status

            resume.status = req.body.status;
            resume.index = req.body.index;
            await resume.save();

            EventEmitter.emit(ResumeEvents.UPDATE_STATUS, resume, req, oldStatus)

            AppResponse.builder(res).message("resume.messages.resume_status_successfully_updated").data(resume).send();
        } catch (err) {
            next(err);
        }
    }

    /**
    * PATCH /resumes/{id}/file
    * @summary upload resume file
    * @tags Resume
    * @security BearerAuth
    * 
    * @param { string } id.path.required - resume id
    * @param { resume.upload_file } request.body - resume info - multipart/form-data
    * 
    * @return { resume.success }              200 - update resume profile
    * @return { message.bad_request_error }      400 - resume not found
    * @return { message.bad_request_error }      401 - Unauthorized
    * @return { message.server_error}      500 - Server Error
    */
    async uploadFile(req, res, next) {
        try {
            let resume = await resumeService.findByParamId(req);

            let files = [];
            if (resume.file) {
                files = resume.file.filter(fileName => {
                    return fileName != null & fileName != "";
                })
            }
            if (req.body.file) files.push(req.body.file);
            resume.file = files;
            await resume.save();

            EventEmitter.emit(ResumeEvents.ADD_FILE, resume, req)

            AppResponse.builder(res).message("resume.messages.resume_file_successfully_upload").data(resume).send()
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
    * @return { message.bad_request_error }  400 - BadRequest response
    * @return { message.bad_request_error }  401 - Unauthorized
    * @return { message.notfound_error }     404 - not found response
    * @return { message.server_error }     500 - Server Error
    */
    async comments(req, res, next) {
        try {
            let resume = await resumeService.findByParamId(req);

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
    * @return { message.bad_request_error }  400 - BadRequest response
    * @return { message.bad_request_error }  401 - Unauthorized
    * @return { message.notfound_error }     404 - not found response
    * @return { message.server_error  }     500 - Server Error
    */
    async addComments(req, res, next) {
        try {
            let resume = await resumeService.findByParamId(req);

            req.body.body = req.body.body
            req.body.resume_id = resume._id
            req.body.created_by = req.user.id

            let resumeCommentsRes = await ResumeComments.create(req.body)
            EventEmitter.emit(ResumeEvents.ADD_COMMENT, resume, req)

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
      * @return { message.bad_request_error }  400 - BadRequest response
      * @return { message.bad_request_error }  404 - not found response
      * @return { message.bad_request_error }       401 - Unauthorized
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
                created_by: req.user.id
            }

            let recall_at = null
            if (req.body.recall_at !== undefined && req.body.recall_at !== "") {
                recall_at = new Date(req.body.recall_at)
                callHistory.recall_at = recall_at
            }
            if (recall_at !== null && calling_date > recall_at) throw new BadRequestError('resume.errors.calling_date_must_be_before_recall_at');

            resume.call_history.push(callHistory)
            await resume.save()
            EventEmitter.emit(ResumeEvents.ADD_CALL_HISTORY, resume, req)

            AppResponse.builder(res).message("resume.messages.resume_call_history_successfully_created").data(resume).send();
        } catch (err) {
            next(err);
        }
    }


    /**
    * PATCH /resumes/{id}/assigners
    * 
    * @summary set assigner to resume
    * @tags Resume
    * @security BearerAuth
    * 
    * @param { string } id.path.required - resume id
    * @param { resume.set_assigners } request.body - application/json
    * 
    * @return { resume.success }            200 - success response
    * @return { message.bad_request_error }  400 - BadRequest response
    * @return { message.bad_request_error }  404 - not found response
    * @return { message.bad_request_error }  401 - Unauthorized
    * @return { message.server_error  }     500 - Server Error
    */
    async setAssigner(req, res, next) {
        try {
            let resume = await resumeService.findByParamId(req);

            let user_id = req.body.user_id;
            let user = await userService.findOne({ '_id': user_id })
            if (!user) throw new NotFoundError('user.errors.user_notfound');


            if (resume.assigners && resume.assigners.includes(user._id)) throw new BadRequestError('resume.errors.assigner_could_not_be_duplicate');

            resume.assigners.push(user._id);
            await resume.save();
            EventEmitter.emit(ResumeEvents.SET_ASSIGNER, resume, req);

            AppResponse.builder(res).message("resume.messages.assigner_successfully_added").data(resume).send();
        } catch (err) {
            next(err);
        }
    }

    /**
    * DELETE /resumes/{id}/assigners
    * 
    * @summary unset special assigner from resume
    * @tags Resume
    * @security BearerAuth
    * 
    * @param { string } id.path.required - resume id
    * @param { resume.unset_assigners } request.body - application/json
    * 
    * @return { resume.success }            200 - success response
    * @return { message.bad_request_error }  400 - BadRequest response
    * @return { message.bad_request_error }  404 - not found response
    * @return { message.bad_request_error }  401 - Unauthorized
    * @return { message.server_error  }     500 - Server Error
    */
    async unsetAssigner(req, res, next) {
        try {
            let resume = await resumeService.findByParamId(req)

            let user = await userService.findOne({ '_id': req.body.user_id })
            if (!user) throw new NotFoundError('user.errors.user_notfound');

            let assigners = resume.assigners
            if (!resume.assigners.includes(user._id)) throw new BadRequestError('resume.errors.assigner_not_exists');

            resume.assigners = assigners.filter(e => e != user._id)
            await resume.save();
            EventEmitter.emit(ResumeEvents.UNSET_ASSIGNER, resume, req)

            EventEmitter.emit(ResumeEvents.UNSET_ASSIGNER, resume, req);

            AppResponse.builder(res).message("resume.messages.assigner_successfully_removed").data(resume).send();
        } catch (err) {
            next(err);
        }
    }

    /**
    * PATCH /resumes/{id}/avatar
    * @summary upload resume avatar
    * @tags Resume
    * @security BearerAuth
    * 
    * @param { string } id.path.required - resume id
    * @param { resume.upload_avatar } request.body - resume info - multipart/form-data
    * 
    * @return { resume.success }               200 - update resume profile
    * @return { message.bad_request_error }      400 - resume not found
    * @return { message.bad_request_error }      401 - Unauthorized
    * @return { message.server_error}           500 - Server Error
    */
    async updateAvatar(req, res, next) {
        try {
            let resume = await resumeService.findByParamId(req);

            if (req.body.avatar) {
                resume.avatar = req.body.avatar;
                await resume.save();
                EventEmitter.emit(ResumeEvents.UPDATE_AVATAR, resume, req);
            }

            AppResponse.builder(res).message("resume.messages.resume_successfully_updated").data(resume).send()
        } catch (err) {
            next(err);
        }
    }

    /**
    * PATCH /resumes/{id}/tags
    * 
    * @summary add comments for resume in table
    * @tags Resume
    * @security BearerAuth
    * 
    * @param  { string } id.path.required - resume id
    * @param { resume.set_tag } request.body - tag info - application/json 
    * @return { tag.success }     201 - success response
    * @return { message.bad_request_error }  400 - BadRequest response
    * @return { message.bad_request_error }  401 - Unauthorized
    * @return { message.notfound_error }     404 - not found response
    * @return { message.server_error  }     500 - Server Error
    */
    async setTag(req, res, next) {
        try {
            let resume = await resumeService.findByParamId(req);
            let tag = await TagService.findOne(req.body.tag_id);
            if (!tag) throw new NotFoundError('tag.errors.tag_notfound');

            if (resume.tags && resume.tags.includes(tag._id)) throw new BadRequestError('resume.errors.tag_could_not_be_duplicate');
            resume.tags.push(tag._id)
            await resume.save();

            EventEmitter.emit(ResumeEvents.ADD_TAG, resume, req)
            // EventEmitter.emit(TagEvents.TAG_USE,tag); error when uncomment :/

            AppResponse.builder(res).status(200).message("resume.messages.resume_tags_successfully_updated").data(resume).send();
        } catch (err) {
            next(err);
        }
    }

    /**
    * DELETE /resumes/{id}/tags
    * 
    * @summary add comments for resume in table
    * @tags Resume
    * @security BearerAuth
    * 
    * @param  { string } id.path.required - resume id
    * @param { resume.unset_tag } request.body - tag info - application/json
    * 
    * @return { tag.success }     201 - success response
    * @return { message.bad_request_error }  400 - BadRequest response
    * @return { message.bad_request_error }  401 - Unauthorized
    * @return { message.notfound_error }     404 - not found response
    * @return { message.server_error  }     500 - Server Error
    */
    async unsetTag(req, res, next) {
        try {
            let resume = await resumeService.findByParamId(req);
            let tag = await TagService.findOne(req.body.tag_id);
            if (!tag) throw new NotFoundError('tag.errors.tag_notfound');

            if (!resume.tags.includes(tag._id)) throw new BadRequestError('resume.errors.tag_not_exists');

            let tagIndex = resume.tags.indexOf(tag._id);
            resume.tags.splice(tagIndex, 1)
            await resume.save();

            EventEmitter.emit(ResumeEvents.REMOVE_TAG, resume, req)

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
    * @return { message.bad_request_error }  400 - BadRequest response
    * @return { message.bad_request_error }  404 - not found response
    * @return { message.bad_request_error }       401 - Unauthorized
    * @return { message.server_error  }     500 - Server Error
    */
    async hired(req, res, next) {
        try {
            let resume = await resumeService.findByParamId(req);
            if (resume.status === 'hired') throw new BadRequestError('resume.errors.resume_already_hired')

            let fromDate = new Date(req.body.hired_from_date)
            let oldStatus = resume.status

            resume.status = 'hired'
            resume.hired_from_date = fromDate
            resume.income = req.body.income
            await resume.save();

            EventEmitter.emit(ResumeEvents.UPDATE_STATUS, resume, req, oldStatus)

            AppResponse.builder(res).status(200).message("resume.messages.resume_successfully_hired").data(resume).send();
        } catch (err) {
            next(err);
        }
    }

    /**
   * PATCH /resumes/{id}/reject
   * 
   * @summary reject  resume 
   * @tags Resume
   * @security BearerAuth
   * 
   * @param  { string } id.path.required - resume id
   * @param { resume.reject } request.body - reject info - application/json
   * 
   * @return { resume.success }     200 - success response
   * @return { message.bad_request_error }  400 - BadRequest response
   * @return { message.bad_request_error }  401 - Unauthorized
   * @return { message.notfound_error }     404 - not found response
   * @return { message.server_error  }     500 - Server Error
   */
    async reject(req, res, next) {
        try {
            let resume = await resumeService.findByParamId(req);
            if (resume.status == 'rejected') throw new BadRequestError('resume.errors.resume_already_rejected');
            let oldStatus = resume.status

            resume.status = 'rejected';
            resume.reject_reason = req.body.reject_reason;
            resume.reject_description = req.body.reject_description;
            await resume.save();

            EventEmitter.emit(ResumeEvents.UPDATE_STATUS, resume, req, oldStatus)

            AppResponse.builder(res).status(200).message("resume.messages.resume_successfully_rejected").data(resume).send();
        } catch (err) {
            next(err);
        }
    }

    /**
    * PATCH /resumes/{id}/end-cooperation
    * 
    * @summary change status of resume to end-cooperation
    * @tags Resume
    * @security BearerAuth
    * 
    * @param  { string } id.path.required - resume id
    * @param { resume.end_cooperation } request.body - application/json
    * 
    * @return { resume.success } 200 - success response
    * @return { message.bad_request_error }  400 - BadRequest response
    * @return { message.bad_request_error }  404 - not found response
    * @return { message.bad_request_error }       401 - Unauthorized
    * @return { message.server_error  }     500 - Server Error
    */
    async endCooperation(req, res, next) {
        try {
            let resume = await resumeService.findByParamId(req);
            if (resume.status === 'end_cooperation') throw new BadRequestError('resume.errors.resume_already_end_cooperation')
            if (resume.status !== 'hired') throw new BadRequestError('resume.errors.you_can_set_end_cooperation_just_for_hired_resume')
            let endCooperationDate = new Date(req.body.end_cooperation_date)

            let oldStatus = resume.status

            resume.status = 'end_cooperation'
            resume.end_cooperation_date = endCooperationDate
            resume.end_cooperation_reason = req.body.end_cooperation_reason
            resume.end_cooperation_description = req.body.end_cooperation_description
            await resume.save();

            EventEmitter.emit(ResumeEvents.UPDATE_STATUS, resume, req, oldStatus)

            AppResponse.builder(res).status(200).message("resume.messages.resume_successfully_end_cooperation").data(resume).send();
        } catch (err) {
            next(err);
        }
    }

    /**
    * PATCH /resumes/{id}/skills
    * 
    * @summary add skill for resume in table
    * @tags Resume
    * @security BearerAuth
    * 
    * @param  { string } id.path.required - resume id
    * @param { resume.set_skill } request.body - resume info - application/json
    * 
    * @return { tag.success }     201 - success response
    * @return { message.bad_request_error }  400 - BadRequest response
    * @return { message.bad_request_error }  401 - Unauthorized
    * @return { message.notfound_error }     404 - not found response
    * @return { message.server_error  }     500 - Server Error
    */
    async setSkill(req, res, next) {
        try {
            let resume = await resumeService.findByParamId(req);

            let skill = await SkillService.findOne(req.body.skill_id);
            if (!skill) throw new NotFoundError('skill.errors.skill_notfound');

            if (resume.skills && resume.skills.includes(skill._id)) throw new BadRequestError('resume.errors.skill_could_not_be_duplicate');
            resume.skills.push(skill._id)
            await resume.save();

            EventEmitter.emit(ResumeEvents.SET_SKILL, resume, req)

            AppResponse.builder(res).status(200).message("resume.messages.resume_skills_successfully_updated").data(resume).send();
        } catch (err) {
            next(err);
        }
    }

    /**
    * DELETE /resumes/{id}/skills
    * 
    * @summary unset skill from resume in table
    * @tags Resume
    * @security BearerAuth
    * 
    * @param  { string } id.path.required - resume id
    * @param { resume.unset_skill } request.body - resume info - application/json
    * 
    * @return { tag.success }     201 - success response
    * @return { message.bad_request_error }  400 - BadRequest response
    * @return { message.bad_request_error }  401 - Unauthorized
    * @return { message.notfound_error }     404 - not found response
    * @return { message.server_error  }     500 - Server Error
    */
    async unsetSkill(req, res, next) {
        try {
            let resume = await resumeService.findByParamId(req);
            let skill = await SkillService.findOne(req.body.skill_id);
            if (!skill) throw new NotFoundError('skill.errors.skill_notfound');

            if (!resume.skills.includes(skill._id)) throw new BadRequestError('resume.errors.skill_not_exists');

            let skillIndex = resume.skills.indexOf(skill._id);
            resume.skills.splice(skillIndex, 1)
            await resume.save();

            EventEmitter.emit(ResumeEvents.UNSET_SKILL, resume, req)

            AppResponse.builder(res).status(200).message("resume.messages.resume_skills_successfully_deleted").data(resume).send();
        } catch (err) {
            next(err);
        }
    }

    /**
    * GET /resumes/{id}/interviews
    * 
    * @summary gets a interview by id
    * @tags Resume
    * @security BearerAuth
    * 
    * @param { string } id.path.required - resume id
    * @param  { resume.action_interview } request.body    application/json
    * 
    * @return { interview.success } 200 - success response
    * @return { message.bad_request_error } 400 - BadRequest response
    * @return { message.bad_request_error } 404 - not found response
    * @return { message.unauthorized_error }     401 - Unauthorized
    * @return { message.server_error  }    500 - Server Error
    */
    async getInterviews(req, res, next) {
        try {
            let resume = await resumeService.findByParamId(req);
            let interview = await Interview.findById(req.body.interview_id).populate({ path: 'created_by', select: ['firstname', 'lastname', 'avatar'] }).exec();
            if (!interview) throw new NotFoundError('interview.errors.interview_notfound');

            EventEmitter.emit(ResumeEvents.GET_INTERVIEW, resume, req);

            AppResponse.builder(res).message("resume.messages.list_of_interviews").data(interview).send();
        } catch (err) {
            next(err);
        }
    }


    /**
    * PATCH /resumes/{id}/interviews
    * 
    * @summary update interview info
    * @tags Resume
    * @security BearerAuth
    * 
    * @param { string } id.path.required - resume id
    * @param  { resume.action_interview } request.body -  application/json
    * 
    * @return { interview.success }           200 - success response
    * @return { message.bad_request_error }  400 - BadRequest response
    * @return { message.bad_request_error }  404 - not found response
    * @return { message.unauthorized_error }     401 - Unauthorized
    * @return { message.server_error  }    500 - Server Error
    */
    async updateInterview(req, res, next) {
        try {
            let resume = await resumeService.findByParamId(req);

            let interview = await Interview.findById(req.body.interview_id);
            if (!interview) throw new NotFoundError('interview.errors.interview_notfound');

            if (req.body.event_time) {
                req.body.event_time = new Date(req.body.event_time)
            }

            if (req.body.contribution) {
                contribution = [];
                for (let contributer of req.body.contribution) {
                    let user = userService.findById(contributer)
                    if (user) contribution.push(contributer);
                }
                req.body.contribution = contribution
            }


            await Interview.findByIdAndUpdate(req.body.interview_id, req.body, { new: true })
                .then(interview => {
                    EventEmitter.emit(ResumesInterviewEvents.UPDATE, interview, req);
                    AppResponse.builder(res).message("resume.messages.interview_successfully_updated").data(interview).send();
                })
                .catch(err => {
                    next(err);
                });
        } catch (err) {
            next(err);
        }
    }

    /**
    * POST /resumes/{id}/interviews
    * 
    * @summary create a interview for resume
    * @tags Resume
    * @security BearerAuth
    * 
    * @param { string } id.path.required - resume id
    * @param  { interview.create } request.body -  application/json
    * 
    * @return { interview.success }         201 - success response
    * @return { message.bad_request_error }  400 - BadRequest response
    * @return { message.bad_request_error }  404 - not found response
    * @return { message.bad_request_error }  401 - Unauthorized
    * @return { message.server_error  }     500 - Server Error
    */
    async createInterview(req, res, next) {
        try {

            let resume = await resumeService.findByParamId(req);

            let contribution = [];
            if (req.body.contribution) {
                for (let contributer of req.body.contribution) {
                    let user = userService.findById(contributer)
                    if (user) contribution.push(contributer);
                }
            }

            req.body.resume_id = resume._id;
            req.body.contribution = contribution
            req.body.event_time = new Date(req.body.event_time)
            req.body.created_by = req.user.id
            let interview = await Interview.create(req.body)
            // EventEmitter.emit(ResumesInterviewEvents.CREATE, interview, req)

            AppResponse.builder(res).status(201).message("resume.messages.interview_successfully_created").data(interview).send();
        } catch (err) {
            next(err);
        }
    }


    /**
    * DELETE /resumes/{id}/interviews
    * 
    * @summary delete a interview from resume
    * @tags Resume
    * @security BearerAuth
    * 
    * @param { string } id.path.required - resume id
    * @param  { resume.action_interview } request.body -  application/json
    * 
    * @return { interview.success } 200 - success response
    * @return { message.bad_request_error } 400 - BadRequest response
    * @return { message.bad_request_error } 404 - not found response
    * @return { message.unauthorized_error }     401 - Unauthorized
    * @return { message.server_error  }    500 - Server Error
    */
    async removeInterview(req, res, next) {
        try {
            let resume = await resumeService.findByParamId(req);

            let interview = await Interview.findById(req.body.interview_id);
            if (!interview) throw new NotFoundError('interview.errors.interview_notfound');

            await interview.delete(req.user.id);
            EventEmitter.emit(ResumesInterviewEvents.DELETE, interview, req)


            AppResponse.builder(res).message("resume.messages.interview_successfully_deleted").data(interview).send();
        } catch (err) {
            next(err);
        }
    }

    /**
   * GET /resumes/{id}/view-logs
   * 
   * @summary get last view logs of resume
   * @tags Resume
   * 
   * @param  { string } id.path.required - resume id
   * 
   * @return { interview.success } 200 - success response
   * @return { message.bad_request_error } 400 - BadRequest response
   * @return { message.bad_request_error } 404 - not found response
   * @return { message.unauthorized_error }     401 - Unauthorized
   * @return { message.server_error  }    500 - Server Error
   */
    async lastViewLogs(req, res, next) {
        try {
            let resume = await resumeService.findByParamId(req);
            let results = await resumeService.getUniqueResumeView(resume)


            AppResponse.builder(res).message("resume.messages.view_logs_list_found").data(results).send();
        } catch (err) {
            next(err);
        }
    }
}

export default new ResumeController;