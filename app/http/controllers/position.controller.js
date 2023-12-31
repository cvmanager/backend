import NotFoundError from "../../exceptions/NotFoundError.js";
import AlreadyExists from "../../exceptions/AlreadyExists.js";
import Project from "../../models/project.model.js";
import Position from "../../models/position.model.js";
import User from "../../models/user.model.js";
import Manager from "../../models/manager.model.js";
import AppResponse from "../../helper/response.js";
import Controller from "./controller.js";
import EventEmitter from "../../events/emitter.js";
import { PositionEvents } from "../../events/subscribers/positions.subscriber.js";
import Resume from "../../models/resume.model.js";
import BadRequestError from "../../exceptions/BadRequestError.js";
import Company from "../../models/company.model.js";
import i18n from "../../middlewares/lang.middleware.js";
import positionService from "../../helper/service/position.service.js";
import roleService from "../../helper/service/role.service.js";
import userService from "../../helper/service/user.service.js";
import { mergeQuery } from "../../helper/mergeQuery.js";
import managerService from "../../helper/service/manager.service.js";
import Interview from "../../models/interview.model.js";
import { getEnume } from "../../helper/helper.js";
import skillService from '../../helper/service/skill.service.js';

class PositionController extends Controller {
  /**
   * GET /positions
   *
   * @summary get a list of all positions
   * @tags Position
   * @security BearerAuth
   *
   * @return { position.success } 200 - success response
   * @return { message.bad_request_error } 400 - BadRequest respone
   * @return { message.bad_request_error } 404 - not found respone
   * @return { message.unauthorized_error }     401 - Unauthorized
   * @return { message.server_error  }    500 - Server Error
   */
  async index(req, res, next) {
    try {
      const { page = 1, size = 10, query = "" } = req.query;

      let searchQuery =
        query.length > 0
          ? { $or: [{ title: { $regex: new RegExp(query, "i") } }] }
          : null;

      searchQuery = mergeQuery(searchQuery, req.rbacQuery);
      const positionList = await Position.paginate(searchQuery, {
        page: page || 1,
        limit: size,
        sort: { createdAt: -1 },
        populate: [
          { path: "company_id", select: ["_id", "name", "logo"] },
          { path: "project_id", select: ["_id", "name", "logo"] },
          {
            path: "managers",
            populate: {
              path: "user_id",
              select: ["firstname", "lastname", "avatar"],
            },
            select: ["user_id", "type"],
          },
          { path: "created_by", select: ["firstname", "lastname", "avatar"] },
        ],
      });
      AppResponse.builder(res)
        .message("position.messages.position_list_found")
        .data(positionList)
        .send();
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /positions/{id}
   *
   * @summary get a position by id
   * @tags Position
   * @security BearerAuth
   *
   * @param  { string } id.path.required - position id
   *
   * @return { position.success } 200 - success response
   * @return { message.bad_request_error } 400 - BadRequest respone
   * @return { message.bad_request_error } 404 - not found respone
   * @return { message.unauthorized_error }     401 - Unauthorized
   * @return { message.server_error  }    500 - Server Error
   */
  async find(req, res, next) {
    try {
      const position = await positionService.findByParamId(req, [
        { path: "company_id", select: ["_id", "name", "logo"] },
        { path: "project_id", select: ["_id", "name", "logo"] },
        { path: "created_by", select: ["firstname", "lastname", "avatar"] },
      ]);

      EventEmitter.emit(PositionEvents.FIND, position, req);

      AppResponse.builder(res)
        .message("position.messages.position_found")
        .data(position)
        .send();
    } catch (err) {
      next(err);
    }
  }

  /**
    * POST /positions
    * 
    * @summary create a position
    * @tags Position
    * @security BearerAuth
    * 
    * @param { position.create } request.body - position info - application/json
    
    * @return { position.success }           201 - success response
    * @return { message.bad_request_error }  400 - BadRequest respone
    * @return { message.bad_request_error }  404 - not found respone
    * @return { message.bad_request_error }       401 - Unauthorized
    * @return { message.server_error  }     500 - Server Error
    */
  async create(req, res, next) {
    try {
      let project = await Project.findById(req.body.project_id);
      if (!project) throw new NotFoundError("project.errors.project_notfound");
      if (!project.is_active)
        throw new BadRequestError("project.errors.project_is_not_active");

      let company = await Company.findById(project.company_id);
      if (!company) throw new NotFoundError("company.errors.company_notfound");
      if (!company.is_active)
        throw new BadRequestError("project.errors.company_is_not_active");

      let position = await Position.findOne({
        title: req.body.title,
        project_id: req.body.project_id,
        level: req.body.level,
      });
      if (position)
        throw new AlreadyExists("position.errors.position_already_exists");

      req.body.created_by = req.user.id;
      req.body.company_id = project.company_id;
      position = await Position.create(req.body);

      EventEmitter.emit(PositionEvents.CREATE, position, req);
      AppResponse.builder(res)
        .status(201)
        .message("position.messages.position_successfully_created")
        .data(position)
        .send();
    } catch (err) {
      next(err);
    }
  }

  /**
   * PATCH /positions/{id}
   *
   * @summary updates a copmany
   * @tags Position
   * @security BearerAuth
   *
   * @param  { string } id.path - position id
   * @param { position.create } request.body - position info - application/json
   *
   * @return { position.success }           200 - success response
   * @return { message.bad_request_error }  400 - BadRequest respone
   * @return { message.bad_request_error }  404 - not found respone
   * @return { message.unauthorized_error }     401 - Unauthorized
   * @return { message.server_error  }    500 - Server Error
   */
  async update(req, res, next) {
    try {
      const position = await positionService.findByParamId(req);
      if (!position)
        throw new NotFoundError("position.errors.position_notfound");

      if (req.body.title !== undefined) {
        let dupplicatePosition = await Position.findOne({
          _id: { $ne: position._id },
          title: req.body.title,
          project_id: position.project_id,
        });
        if (dupplicatePosition && dupplicatePosition._id !== position._id)
          throw new AlreadyExists("position.errors.position_already_exists");
      }

      await Position.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then((position) => {
          EventEmitter.emit(PositionEvents.UPDATE, position, req);
          AppResponse.builder(res)
            .message("position.messages.position_successfully_updated")
            .data(position)
            .send();
        })
        .catch((err) => next(err));
    } catch (err) {
      next(err);
    }
  }

  /**
   * DELETE /positions/{id}
   *
   * @summary delete a position by id
   * @tags Position
   * @security BearerAuth
   *
   * @param  { string } id.path - position id
   *
   * @return { position.success } 200 - success response
   * @return { message.bad_request_error } 400 - BadRequest respone
   * @return { message.bad_request_error } 404 - not found respone
   * @return { message.unauthorized_error }     401 - Unauthorized
   * @return { message.server_error  }    500 - Server Error
   */
  async delete(req, res, next) {
    try {
      const position = await positionService.findByParamId(req);
      if (!position)
        throw new NotFoundError("position.errors.position_notfound");

      await position.delete(req.user.id);
      EventEmitter.emit(PositionEvents.DELETE, position, req);

      AppResponse.builder(res)
        .message("position.messages.position_successfully_deleted")
        .data(position)
        .send();
    } catch (err) {
      next(err);
    }
  }

  /**
   * PATCH /positions/{id}/manager
   *
   * @summary set manager for position
   * @tags Position
   * @security BearerAuth
   *
   * @param  { string } id.path.required - position id
   * @param { position.set_manager } request.body - position info - application/json
   *
   * @return { manager.success }           201 - success response
   * @return { message.bad_request_error } 400 - BadRequest respone
   * @return { message.bad_request_error } 404 - not found respone
   * @return { message.unauthorized_error }     401 - Unauthorized
   * @return { message.server_error  }    500 - Server Error
   *
   */
  async manager(req, res, next) {
    try {
      const position = await positionService.findByParamId(req);
      if (!position)
        throw new NotFoundError("position.errors.position_notfound");
      if (!position.is_active)
        throw new BadRequestError(
          "position.errors.position_deactivate_cant_set_manager"
        );

      let user = await userService.findOne({ _id: req.body.manager_id });

      let manager = await managerService.findOne({
        entity: "positions",
        entity_id: position.id,
        user_id: user.id,
      });
      if (manager)
        throw new BadRequestError(
          "project.errors.the_user_is_currently_an_manager_for_position"
        );

      await managerService.create({
        user_id: user._id,
        entity: "positions",
        entity_id: position._id,
        created_by: req.user.id,
      });

      const positionManagerRole = await roleService.findOne({
        name: "Position Manager",
      });
      await userService.addRole(user._id, positionManagerRole._id);

      EventEmitter.emit(PositionEvents.SET_MANAGER, position, req);
      AppResponse.builder(res)
        .status(201)
        .message("manager.messages.manager_successfully_created")
        .data(manager)
        .send();
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /positions/{id}/resumes
   *
   * @summary gets  positions resumes list by position id
   * @tags Position
   * @security BearerAuth
   *
   * @param  { string } id.path.required - position id
   *
   * @return { position.success }              200 - success response
   * @return { message.bad_request_error }      400 - BadRequest respone
   * @return { message.bad_request_error }      404 - not found respone
   * @return { message.unauthorized_error }    401 - Unauthorized
   * @return { message.server_error  }         500 - Server Error
   */
  async getResumes(req, res, next) {
    try {
      const position = await positionService.findByParamId(req);
      const { size = 10 } = req.query;

      let resumes = [];
      let promiseResumes = [];


      let statuses = getEnume("resume", "status");
      for (let status of statuses) {
        let resumeList = Resume.find({
          position_id: position._id,
          status: status,
        })
          .limit(size)
          .sort([["index", 1]])
          .populate([
            {
              path: "interviews",
              select: [
                "event_time",
                "event_type",
                "status",
                "type",
                "result",
                "description",
                "rating",
                "contribution",
              ],
            },
            { path: "created_by" },
            { path: "assigners", select: ["firstname", "lastname", "avatar"] },
            {
              path: "interviews",
              select: [
                "event_time",
                "event_type",
                "status",
                "type",
                "result",
                "description",
                "rating",
                "contribution",
              ],
            },
            { path: "tags", select: ["name", "color", "count"] },
            { path: "project_id" },
            { path: "position_id" },
            { path: "company_id" },
          ]);
        promiseResumes.push(resumeList);
      }
      let results = await Promise.all(promiseResumes);

      for (let i = 0; i < statuses.length; i++) {
        let resume = {};
        resume[statuses[i]] = results[i];
        resumes.push(resume);
      }

      AppResponse.builder(res)
        .message("company.messages.company_resumes_found")
        .data(resumes)
        .send();
    } catch (err) {
      next(err);
    }
  }


  /**
* GET /positions/{id}/managers
* 
* @summary gets  position managers list by position id
* @tags Position
* @security BearerAuth
* 
* @param  { string } id.path.required - position id
* 
* @return { position.success }              200 - success response
* @return { message.badrequest_error }      400 - bad request respone
* @return { message.badrequest_error }      404 - not found respone
* @return { message.unauthorized_error }    401 - UnauthorizedError
* @return { message.server_error  }         500 - Server Error
*/
  async getManagers(req, res, next) {
    try {
      const position = await positionService.findByParamId(req)
      let managers = await Manager.find({ 'entity': "positions", 'entity_id': position.id }).populate(
        [
          { path: 'user_id' },
          { path: 'created_by' }
        ]
      );
      AppResponse.builder(res).message('position.messages.position_managers_found').data(managers).send();
    } catch (err) {
      next(err);
    }
  }


  /**
   * PATCH /positions/{id}/active
   * @summary active positions
   * @tags Position
   * @security BearerAuth
   *
   * @param { string } id.path.required - position id
   *
   * @return { position.success }              200 - active positions
   * @return { message.bad_request_error }      400 - positions not found
   * @return { message.bad_request_error }      401 - Unauthorized
   * @return { message.server_error}           500 - Server Error
   */
  async active(req, res, next) {
    try {
      const position = await positionService.findByParamId(req);
      if (!position)
        throw new NotFoundError("position.errors.position_notfound");

      if (position.is_active == true)
        throw new BadRequestError("position.errors.position_activated_already");

      position.is_active = true;
      await position.save();

      EventEmitter.emit(PositionEvents.ACTIVE, position, req);
      AppResponse.builder(res)
        .message("position.messages.position_successfully_activated")
        .data(position)
        .send();
    } catch (err) {
      next(err);
    }
  }

  /**
   * PATCH /positions/{id}/deactive
   * @summary deactive positions
   * @tags Position
   * @security BearerAuth
   *
   * @param { string } id.path.required - positions id
   *
   * @return { position.success }              200 - deactive positions
   * @return { message.bad_request_error }      400 - positions not found
   * @return { message.bad_request_error }      401 - Unauthorized
   * @return { message.server_error}           500 - Server Error
   */
  async deActive(req, res, next) {
    try {
      const position = await positionService.findByParamId(req);
      if (!position)
        throw new NotFoundError("position.errors.position_notfound");

      if (position.is_active == false)
        throw new BadRequestError(
          "position.errors.position_deactivated_already"
        );

      position.is_active = false;
      await position.save();

      EventEmitter.emit(PositionEvents.DEACTIVE, position, req);
      AppResponse.builder(res)
        .message("position.messages.position_successfully_deactivated")
        .data(position)
        .send();
    } catch (err) {
      next(err);
    }
  }

  /**
   * DELETE /positions/{id}/manager
   *
   * @summary delete manager from position
   * @tags Position
   * @security BearerAuth
   *
   * @param  { string } id.path.required - position id - application/json
   * @param  { position.delete_manager } request.body - position info - application/json
   *
   * @return { message.unauthorized_error }     401 - Unauthorized
   * @return { message.bad_request_error }       404 - NotFoundError
   * @return { message.server_error }           500 - Server Error
   * @return { position.success }                200 - success respons
   */
  async deleteManager(req, res, next) {
    try {
      let position = await Position.findById(req.params.id);
      if (!position)
        throw new NotFoundError("position.errors.position_notfound");

      let user = await User.findById(req.body.manager_id);
      if (!user) throw new NotFoundError("user.errors.user_notfound");

      let manager = await Manager.findOne({
        entity: "positions",
        entity_id: position.id,
        user_id: user.id,
      });
      if (!manager)
        throw new BadRequestError(
          "position.errors.the_user_is_not_manager_for_this_position"
        );
      if (manager.type === "owner")
        throw new BadRequestError(
          "position.errors.the_owner_manager_cannot_be_deleted"
        );

      await manager.delete(req.user.id);
      EventEmitter.emit(PositionEvents.UNSET_MANAGER, position, req);

      AppResponse.builder(res)
        .message("position.messages.position_manager_deleted")
        .data(position)
        .send();
    } catch (err) {
      next(err);
    }
  }

  /**
   * PATCH /positions/{id}/logo
   * @summary upload position logo
   * @tags Position
   * @security BearerAuth
   *
   * @param { string } id.path.required - position id
   * @param { position.upload_logo } request.body - position info - multipart/form-data
   *
   * @return { position.success }               200 - update resume profile
   * @return { message.bad_request_error }      400 - resume not found
   * @return { message.bad_request_error }      401 - Unauthorized
   * @return { message.server_error}           500 - Server Error
   */
  async updateLogo(req, res, next) {
    try {
      let position = await Position.findById(req.params.id);
      if (!position)
        throw new NotFoundError("position.errors.position_notfound");

      if (req.body.logo) {
        position.logo = req.body.logo;
        await position.save();
      }

      AppResponse.builder(res)
        .message("position.messages.position_successfully_updated")
        .data(position)
        .send();
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /positions/{id}/statistics/resume-by-states
   *
   * @summary returns position resumes number by states
   * @tags Position
   * @security BearerAuth
   *
   * @param  { string } id.path.required - position id
   *
   * @return { position.success } 200 - success response
   * @return { message.bad_request_error } 400 - BadRequest response
   * @return { message.unauthorized_error }     401 - Unauthorized
   * @return { message.server_error  }    500 - Server Error
   */
  async resumeByStates(req, res, next) {
    try {
      let position = await positionService.findByParamId(req);

      let statusArray = getEnume("resume", "status");
      let totalResumeByStates = await Resume.aggregate([
        {
          $match: {
            position_id: position._id,
          },
        },
        {
          $group: {
            _id: "$status",
            count: {
              $sum: 1,
            },
          },
        },
        {
          $project: {
            state: "$_id",
            _id: 0,
            count: 1,
          },
        },
      ]);

      statusArray.forEach((element) => {
        if (totalResumeByStates.find((resume) => resume.state !== element)) {
          totalResumeByStates.push({ count: 0, state: element });
        }
      });

      AppResponse.builder(res)
        .message("position.messages.position_resume_by_states")
        .data(totalResumeByStates)
        .send();
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /positions/{id}/statistics/resume-count-from-month
   *
   * @summary This will return received resumes per month for position
   * @tags Position
   * @security BearerAuth
   *
   * @param { string } id.path.required - position id
   *
   * @return { position.success } 200 - success response
   * @return { message.bad_request_error } 400 - BadRequest response
   * @return { message.unauthorized_error }     401 - Unauthorized
   * @return { message.server_error  }    500 - Server Error
   *
   */
  async resumeCountFromMonth(req, res, next) {
    try {
      let position = await positionService.findByParamId(req);

      let date = new Date();
      let date7MonthAgo = date.setMonth(date.getMonth() - 7);
      date7MonthAgo = new Date(date7MonthAgo);
      const monthsArray = [
        "01",
        "02",
        "03",
        "04",
        "05",
        "06",
        "07",
        "08",
        "09",
        "10",
        "11",
        "12",
      ];

      let resumeCountFromMonth = await Resume.aggregate([
        {
          $match: {
            position_id: position._id,
            // createdAt: { $gte: YEAR_BEFORE, $lte: TODAY }
            createdAt: { $gte: date7MonthAgo },
          },
        },
        {
          $group: {
            _id: { year_month: { $substrCP: ["$createdAt", 0, 7] } },
            count: { $sum: 1 },
          },
        },
        {
          $sort: { "_id.year_month": -1 },
        },
        {
          $project: {
            _id: 0,
            count: 1,
            month_year: {
              $concat: [
                {
                  $arrayElemAt: [
                    monthsArray,
                    {
                      $subtract: [
                        { $toInt: { $substrCP: ["$_id.year_month", 5, 2] } },
                        1,
                      ],
                    },
                  ],
                },
                "-",
                { $substrCP: ["$_id.year_month", 0, 4] },
              ],
            },
          },
        },
        {
          $group: {
            _id: null,
            data: { $push: { k: "$month_year", v: "$count" } },
          },
        },
        {
          $project: {
            data: { $arrayToObject: "$data" },
            _id: 0,
          },
        },
      ]);

      AppResponse.builder(res)
        .message("position.messages.position_resume_count_from_month")
        .data(resumeCountFromMonth)
        .send();
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /positions/{id}/statistics/resume-state-in-last-month
   *
   * @summary This will return the position resumes number by states in last month
   * @tags position
   * @security BearerAuth
   *
   * @param  { string } id.path.required - position id
   *
   * @return { position.success } 200 - success response
   * @return { message.bad_request_error } 400 - BadRequest response
   * @return { message.unauthorized_error }     401 - Unauthorized
   * @return { message.server_error  }    500 - Server Error
   */
  async resumeStateInLastMonth(req, res, next) {
    try {
      let position = await positionService.findByParamId(req);

      let date = new Date();
      let date1MonthAgo = date.setMonth(date.getMonth() - 1);
      date1MonthAgo = new Date(date1MonthAgo);

      date = new Date();
      let date2MonthAgo = date.setMonth(date.getMonth() - 2);
      date2MonthAgo = new Date(date2MonthAgo);

      let receivedResumeInLastMonth = await Resume.aggregate([
        {
          $match: {
            position_id: position._id,
          },
        },
        {
          $facet: {
            resent_month: [
              {
                $match: {
                  createdAt: {
                    $gte: date1MonthAgo,
                  },
                },
              },
              {
                $group: {
                  _id: "",
                  count: {
                    $sum: 1,
                  },
                },
              },
              {
                $project: {
                  _id: 0,
                  count: 1,
                },
              },
            ],
            last_month: [
              {
                $match: {
                  createdAt: {
                    $gte: date2MonthAgo,
                    $lt: date1MonthAgo,
                  },
                },
              },
              {
                $group: {
                  _id: "",
                  count: {
                    $sum: 1,
                  },
                },
              },
              {
                $project: {
                  _id: 0,
                  count: 1,
                },
              },
            ],
          },
        },
      ]);
      let hiredResumeInLastMonth = await this.resumeCountByStateAndMonth(
        position,
        "hired",
        date1MonthAgo,
        date2MonthAgo
      );
      let rejectedResumeInLastMonth = await this.resumeCountByStateAndMonth(
        position,
        "rejected",
        date1MonthAgo,
        date2MonthAgo
      );

      let resumeStateInLastMonth = {
        received: receivedResumeInLastMonth,
        hired: hiredResumeInLastMonth,
        rejected: rejectedResumeInLastMonth,
      };

      AppResponse.builder(res)
        .message("position.messages.position_resume_state_in_last_month")
        .data(resumeStateInLastMonth)
        .send();
    } catch (err) {
      next(err);
    }
  }

  async resumeCountByStateAndMonth(position, status, start, end) {
    let resumeInMonth = await Resume.aggregate([
      {
        $match: {
          position_id: position._id,
        },
      },
      {
        $facet: {
          resent_month: [
            {
              $match: {
                status: status,
                createdAt: {
                  $gte: start,
                },
              },
            },
            {
              $group: {
                _id: "$status",
                count: {
                  $sum: 1,
                },
              },
            },
            {
              $project: {
                _id: 0,
                count: 1,
              },
            },
          ],
          last_month: [
            {
              $match: {
                status: status,
                createdAt: {
                  $gte: end,
                  $lt: start,
                },
              },
            },
            {
              $group: {
                _id: "$status",
                count: {
                  $sum: 1,
                },
              },
            },
            {
              $project: {
                _id: 0,
                count: 1,
              },
            },
          ],
        },
      },
    ]);
    return resumeInMonth;
  }

  /**
   * GET /positions/{id}/latest-interviews
   * @summary This Will Return Latest Resumes Interviews For A Position
   * @return { position.success } - 200 - success response
   * @return { message.bad_request_error }      400 - resume not found
   * @return { message.bad_request_error }      401 - Unauthorized
   * @return { message.server_error}           500 - Server Error
   */
  async getLatestInterviews(req, res, next) {
    try {
      const position = await positionService.findByParamId(req);

      const latestInterviews = await Interview.aggregate([
        {
          $lookup: {
            from: "resumes",
            localField: "resume_id",
            foreignField: "_id",
            as: "resume",
          },
        },

        {
          $match: {
            "resume.position_id": position._id,
            "event_time": {
              $gte: new Date()
            }
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "contribution",
            foreignField: "_id",
            as: "contributors",
          },
        },
        {
          $sort: {
            event_time: 1,
          },
        },
        {
          $limit: 6,
        },
      ]);

      const result = await Interview.populate(latestInterviews, {
        path: "contribution",
      });

      AppResponse.builder(res)
        .message("position.messages.position_latest_interviews")
        .data(result)
        .send();
    } catch (err) {
      next(err);
    }
  }

  /**
   * PATCH /positions/{id}/skill
   * 
   * @summary add skill for position in table
   * @tags Position
   * @security BearerAuth
   * 
   * @param  { string } id.path.required - position id
   * @param  { string } skill_id.path.required - skill id
   * 
   * @return { position.success }     201 - success response
   * @return { message.badrequest_error }  400 - bad request respone
   * @return { message.badrequest_error }  401 - UnauthorizedError
   * @return { message.NotFoundError }     404 - not found respone
   * @return { message.server_error  }     500 - Server Error
   */
  async setSkill(req, res, next) {
    try {
      let position = await positionService.findByParamId(req);
      let skill = await skillService.findOne(req.body.skill_id);
      if (!skill) throw new NotFoundError('skill.errors.skill_notfound');

      if (position.skills && position.skills.includes(skill._id)) throw new BadRequestError('position.errors.skill_could_not_be_duplicate');
      position.skills.push(skill._id)
      await position.save();

      // EventEmitter.emit(ResumeEvents.ADD_TAG, position, req)
      // EventEmitter.emit(TagEvents.TAG_USE,tag); error when uncomment :/

      AppResponse.builder(res).status(200).message("position.messages.position_skills_successfully_updated").data(position).send();
    } catch (err) {
      next(err);
    }
  }

  /**
  * DELETE /positions/{id}/skill
  * 
  * @summary add skill for position in table
  * @tags Position
  * @security BearerAuth
  * 
  * @param  { string } id.path.required - position id
  * @param  { string } skill_id.path.required - skill id
  * @param { skill.remove } request.body - position info - application/json
  * 
  * @return { skill.success }     201 - success response
  * @return { message.badrequest_error }  400 - bad request respone
  * @return { message.badrequest_error }  401 - UnauthorizedError
  * @return { message.NotFoundError }     404 - not found respone
  * @return { message.server_error  }     500 - Server Error
  */
  async unsetSkill(req, res, next) {
    try {
      let position = await positionService.findByParamId(req);
      let skill = await skillService.findOne(req.body.skill_id);
      if (!skill) throw new NotFoundError('skill.errors.skill_notfound');

      if (!position.skills.includes(skill._id)) throw new BadRequestError('position.errors.skill_not_exists');

      let skillIndex = position.skills.indexOf(skill._id);
      position.skills.splice(skillIndex, 1)
      await position.save();

      // EventEmitter.emit(PositionEvents.REMOVE_TAG, position, req)

      AppResponse.builder(res).status(200).message("position.messages.position_skills_successfully_deleted").data(position).send();
    } catch (err) {
      next(err);
    }
  }


}

export default new PositionController();
