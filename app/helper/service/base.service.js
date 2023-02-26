import autoBind from "auto-bind";

let _model = new WeakMap()

export default class ServiceBase {
    modelName

    constructor(model) {
        _model.set(this, model)
        this.modelName = model.modelName
        autoBind(this)
    }

    async findOne(filter, populates = []) {
        if (typeof filter === "string") {
            filter = { _id: filter };
        }
        return _model.get(this).findOne(filter).populate(populates).exec()
    }

    async create(data) {
        return _model.get(this).create(data);
    }

    async createMany(docs) {
        return _model.get(this).insertMany(docs)
    }

    async delete(doc, userId) {
        return doc.delete(userId)
    }

    async updateOne(filter, updateData) {
        return _model.get(this).findOneAndUpdate(filter, { $set: updateData }, { new: true })
    }

    async getAll(filter = {}, populate = []) {
        return _model.get(this).find(filter).populate(populate)
    }

    async find(filters, pagination, sort) { // pagination: {skip: number, limit: number }
        return _model.get(this).aggregate([
                { '$match': filters },
                {
                    '$facet': {
                        'meta': [
                            {
                                '$group': {
                                    '_id': null,
                                    'totalDocs': {
                                        '$sum': 1
                                    }
                                }
                            }
                        ],
                        'docs': [
                            {
                                '$sort': sort
                            },
                            {
                                '$skip': pagination.skip
                            },
                            {
                                '$limit': pagination.limit
                            }
                        ]
                    }
                }
            ])
    }
};
  