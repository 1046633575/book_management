const express = require('express')
const app = express()
const path = require('path')

let formidable = require('formidable');

//引入获取POST参数的模块
const bodyParser = require('body-parser')

require('./model/index')
const Book = require('./model/book')
const Type = require('./model/type')

//跨域
app.all("*", function (req, res, next) {
    //设置允许跨域的域名，*代表允许任意域名跨域
    res.header("Access-Control-Allow-Origin", "*");
    //允许的header类型
    res.header("Access-Control-Allow-Headers", "content-type");
    //跨域允许的请求方式 
    res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
    if (req.method.toLowerCase() == 'options')
        res.send(200); //让options尝试请求快速结束
    else
        next()
})

//实现静态资源访问功能
app.use('/static', express.static(path.join(__dirname, 'public', 'images')))

//获取POST请求参数  使用 querystring 处理数据
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json())

//根据分类查询
app.get('/typeBooks', async (req, res) => {
    //拿到请求的参数
    const type = req.query.type
    if (!type || type === '全部') {
        const books = await Book.find()
        if (books) {
            res.json(books)
        } else {
            res.json({
                type: false,
                msg: '查询失败！'
            })
        }
    } else {
        const books = await Book.find({
            type: req.query.type
        })
        if (books) {
            res.json(books)
        } else {
            res.json({
                type: false,
                msg: '查询失败！'
            })
        }
    }

})

//获取所有的书
app.get('/books', async (req, res) => {
    let books = await Book.find()
    if (books) {
        res.json(books)
    } else {
        res.json({
            type: false,
            msg: '查询失败！'
        })
    }
})

//根据id获取书
app.get('/book', async (req, res) => {
    //根据id查找数据库
    let book = await Book.findOne({
        _id: req.query.id
    })
    res.json(book)
})

//删除一本书
app.get('/bookDelete', async (req, res) => {
    let result = await Book.findOneAndDelete({
        _id: req.query.id
    })
    if (result) {
        res.json({
            type: true,
            msg: '删除成功'
        })
    } else {
        res.json({
            type: false,
            msg: '删除失败'
        })
    }
})

//借书  
/**
 *  已借数量 +1  borrowNum
 *  剩余数量 -1  surplusNum
 */
app.get('/bookBorrow', async (req, res) => {
    let book = await Book.findOne({
        _id: req.query.id
    })
    if (book) {
        //判断剩余数量大于 1
        if (!book.surplusNum >= 1) {
            res.json({
                type: false,
                message: '剩余数量小于1'
            })
            return false
        }
        let bookBorrow = await Book.updateOne({
            _id: req.query.id
        }, {
            $set: {
                borrowNum: book.borrowNum + 1,
                surplusNum: surplusNum - 1
            }
        })
        if (bookBorrow) {
            res.json({
                type: true,
                message: '借书成功'
            })
        } else {
            res.json({
                type: false,
                message: '借书失败'
            })
        }
    } else {
        res.json({
            type: false,
            message: '失败！未找到该 id'
        })
    }

})

//添加一本书
app.post('/addBook', async (req, res) => {
    let result = await Book.create(req.body).catch((err) => console.log(err))
    if (result) {
        res.json({
            type: true,
            msg: '添加成功!'
        })
    } else {
        res.json({
            type: false,
            msg: '添加失败！'
        })
    }
})

//更新一本书
app.post('/updateBook', async (req, res) => {
    let book = await Book.updateOne({
        _id: req.body._id
    }, req.body)
    if (book) {
        res.json({
            type: true,
            msg: '更新成功'
        })
    } else {
        res.json({
            type: false,
            msg: '更新失败'
        })
    }
})


//查询所有分类
app.get('/findAllType', async (req, res) => {
    let types = await Type.find()
    res.json(types)
})

//添加一个分类
app.post('/addType', async (req, res) => {
    let result = await Type.create({
        name: req.body.name
    }).catch(err => console.log(err))
    if (result) {
        res.json({
            type: true,
            msg: '添加成功'
        })
    } else {
        res.json({
            type: false,
            msg: '添加失败'
        })
    }

})

//修改一个分类
app.post('/updateType', async (req, res) => {
    let result = await Type.updateOne({
        _id: req.body.id
    }, {
        _id: req.body.id,
        name: req.body.name
    })
    if (result) {
        res.json({
            type: true,
            msg: '修改成功'
        })
    } else {
        res.json({
            type: false,
            msg: '修改失败'
        })
    }
})

//删除一个分类
app.get('/typeDelete', async (req, res) => {
    //删除前查询改分类下有没有书籍
    /**
     * 传入值为 _id
     * 1.根据传入的 id 找到对应的 分类名称
     * 2.根据分类名称查询还有没有书籍
     */
    //1.根据传入的 id 找到对应的 分类名称
    let typeObj = await Type.findOne({
        _id: req.query.id
    })
    //2.根据分类名称查询还有没有书籍
    let booksObj = await Book.find({
        type: typeObj.name
    })
    if (booksObj.length === 0) {
        let result = await Type.findOneAndDelete({
            _id: req.query.id
        })
        if (result) {
            res.json({
                type: true,
                msg: '删除成功！'
            })
        } else {
            res.json({
                type: false,
                msg: '删除失败！'
            })
        }
    } else {
        res.json({
            type: false,
            message: '删除失败！请确保该分类下没有书籍'
        })
    }
})

//上传图片
app.post('/uploadImg', (req, res) => {
    let form = new formidable.IncomingForm();
    form.encoding = 'utf-8'; // 编码
    // 保留扩展名
    form.keepExtensions = true;
    //文件存储路径 最后要注意加 '/' 否则会被存在public下
    form.uploadDir = path.join(__dirname, './public/images/');
    // 解析 formData 数据
    form.parse(req, (err, fields, files) => {
        if (err) return res.json({
            type: false,
            msg: '图片上传失败'
        })
        //文件名
        let imgName = files.file.name;
        let imgPath = files.file.path;
        let imgSrc = '/static/' + (imgPath.substring(imgPath.lastIndexOf('\\') + 1))
        // 返回路径和文件名
        res.json({
            type: true,
            msg: '图片上传成功',
            imgSrc,
            imgName
        });
    })
})


app.listen(3000)
console.log('服务器启动成功 http://localhost:3000')