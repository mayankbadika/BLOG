const { Schema, model } = require('mongoose');

const schema = new Schema({
    content: {
        type: String,
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    blogId: {
        type: Schema.Types.ObjectId,
        ref: 'Blog'
    }
},{timestamps: true});

const commentModel = model('Comment', schema);

module.exports = commentModel;