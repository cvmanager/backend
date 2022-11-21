import MongooseDelete from "mongoose-delete"
import MongoosePaginate from 'mongoose-paginate-v2';
function basePlugin(schema, options) {

    const timestamps = {
        createdAt: true,
        updatedAt: true
    },
        toJSON = {
            transform: function (doc, ret, opt) {
                delete ret['deletedBy']
                delete ret['deletedAt']
                delete ret['__v']

                if (options.transform.length > 0) options.transform.map(item => delete ret[item])
                return ret
            }
        }

    schema.set('timestamps', timestamps)
    schema.set('toJSON', toJSON)

    schema.pre([/^find/, /^count/], function () {
        this.where({ deleted: false });
    });

    schema.plugin(MongooseDelete, { deletedBy: true, deletedAt: true });
    schema.plugin(MongoosePaginate);

};

export default basePlugin