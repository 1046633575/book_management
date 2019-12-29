const mongoose = require('mongoose')

//创建集合规则
const bookSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 20,
        require: true
    },
    author: {
        type: String,
        required: true
    },
    detail: {
        type: String
    },
    price: {
        type: Number,
        min: 1,
        max: 999,
        required: true
    },
    //出版社
    press: {
        type: String
    },
    //书籍图片
    img: String,
    //已借数量
    borrowNum: {
        type: Number,

    },
    //剩余数量
    surplusNum: {
        type: Number
    },
    //书籍类目
    type:{
        type: String,
        required: true
    },
    //书籍总数
    num: {
        type: Number,
        required: true
    }
})

//创建集合
const book = mongoose.model('Book', bookSchema)

module.exports = book