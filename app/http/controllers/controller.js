import autoBind from "auto-bind";

import NotFoundError from "../../exceptions/NotFoundError.js";
import AppResponse from "../../helper/response.js";

let _service = new WeakMap()

class Controller {

  constructor(service, modelName) {
    this.modelName = modelName
    _service.set(this, service);
    autoBind(this)
  }

  async create(req, res, next) {
    try {
        req.body.created_by = req.user._id;
        let createdDocument = await _service.get(this).create(req.body);

        AppResponse.builder(res).status(201).message(`${this.modelName}.message.${this.modelName}_successfully_created`).data(createdDocument).send();
    } catch (err) {
        next(err);
    }
  }

  async update(req, res, next) {
    try {
        await _service.get(this).findByParamId(req);
        const updatedDocument = await _service.get(this).updateOne(query, req.body)
        if (!updatedDocument) throw new NotFoundError(`${this.modelName}.error.${this.modelName}_notfound`); 

        AppResponse.builder(res).message(`${this.modelName}.message.${this.modelName}_successfully_updated`).data(updatedDocument).send()
    } catch (err) {
        next(err);
    }
  }

  async find(req, res, next) {
    try {
      const fetchedDocument = await _service.get(this).findByParamId(req);
      if (!fetchedDocument) throw new NotFoundError(`${this.modelName}.error.${this.modelName}_notfound`);

      AppResponse.builder(res).message(`${this.modelName}.message.${this.modelName}_found`).data(fetchedDocument).send();
    } catch (err) {
        next(err);
    }
  }

  async delete(req, res, next) {
    try {
        let document = await _service.get(this).findByParamId(req);
        if (!document) throw new NotFoundError(`${this.modelName}.error.${this.modelName}_notfound`);

        await _service.get(this).delete(document, req.user._id)

        AppResponse.builder(res).message(`${this.modelName}.message.${this.modelName}_successfully_deleted`).data(document).send();
    } catch (err) {
        next(err);
    }
  }

}

export default Controller