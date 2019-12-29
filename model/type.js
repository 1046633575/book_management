const mongoose = require('mongoose')

//创建集合规则
const typeSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

//创建集合
const type = mongoose.model('type', typeSchema)

module.exports = type