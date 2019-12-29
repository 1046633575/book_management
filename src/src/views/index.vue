<template>
  <div class="about">
    <el-card class="box-card">
      <!-- 卡片标题栏 -->
      <div slot="header" class="clearfix header">
        <el-button plain round type="success" @click="$router.push('/type')">
          <i class="el-icon-menu" /> 分类管理
        </el-button>
        <h2>书籍列表</h2>
        <el-button type="primary" @click="dialogFormVisible = true">
          <i class="el-icon-reading" /> 添加书籍
        </el-button>
      </div>

      <!-- 搜索栏 -->
      <el-card class="search">
        分类：
        <el-select v-model="value" placeholder="全部">
          <el-option
            v-for="(item,index) in options"
            :key="index"
            :label="item.name"
            :value="item._id"
          ></el-option>
        </el-select>
        <span style="margin-left: 15px;">价格：</span>
        <el-input v-model="input1" placeholder="请输入价格" style="max-width: 200px;"></el-input>~
        <el-input v-model="input2" placeholder="请输入价格" style="max-width: 200px;"></el-input>
        <el-button style="float: right;" type="primary" class="searButton">
          <i class="el-icon-search" /> 查询
        </el-button>
      </el-card>

      <!-- 列表 -->
      <el-card class="list">
        <el-table :data="tableData" height="600" border style="width: 100%">
          <el-table-column label="图片">
            <template slot-scope="scope">
              <img :src="imgBaseUrl + scope.row.img" alt />
            </template>
          </el-table-column>
          <el-table-column prop="name" label="名称"></el-table-column>
          <el-table-column prop="author" label="名称"></el-table-column>
          <el-table-column prop="detail" label="介绍"></el-table-column>
          <el-table-column prop="price" label="价格"></el-table-column>
          <el-table-column prop="type" label="书籍类目"></el-table-column>
          <el-table-column prop="press" label="出版社"></el-table-column>
          <el-table-column prop="borrowNum" label="已借数量"></el-table-column>
          <el-table-column prop="surplusNum" label="剩余数量"></el-table-column>
          <el-table-column prop="num" label="书籍总数"></el-table-column>
          <el-table-column fixed="right" label="操作" width="150">
            <el-button type="primary" size="small">借一本</el-button>
            <el-button type="success" size="small">编辑</el-button>
            <el-button type="danger" size="small">删除</el-button>
          </el-table-column>
        </el-table>
      </el-card>
    </el-card>

    <!-- 添加书籍表单 -->
    <el-dialog title="添加分类" :visible.sync="dialogFormVisible">
      <el-form>
        <el-form-item label="书籍名称">
          <el-input v-model="bookName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="作者">
          <el-input v-model="bookAuthor" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="书籍详情">
          <el-input v-model="bookDetail" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="书籍价格">
          <el-input v-model="bookPrice" autocomplete="off" value="number"></el-input>
        </el-form-item>
        <el-form-item label="书籍类目">
          <el-select v-model="bookType" placeholder="请选择">
            <el-option
              v-for="(item,index) in options"
              :key="index"
              :label="item.name"
              :value="item._id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="出版社">
          <el-input v-model="bookPress" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="书籍总数">
          <el-input v-model="bookNum" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="书籍图片">
          <el-upload
            :action="uploadImgUrl"
            list-type="picture-card"
            :auto-upload="true"
            :limit="1"
            :file-list="fileList"
            :on-exceed="handlerExceed"
            :on-success="handlerSuccess"
          >
            <i slot="default" class="el-icon-plus"></i>
            <div slot="file" slot-scope="{file}">
              <img class="el-upload-list__item-thumbnail" :src="imgBaseUrl + bookSrc" alt />
              <span class="el-upload-list__item-actions">
                <span
                  v-if="!disabled"
                  class="el-upload-list__item-delete"
                  @click="handleRemove(file)"
                >
                  <i class="el-icon-delete"></i>
                </span>
              </span>
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrModifyBook">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //添加或修改书籍表单的显示
      dialogFormVisible: false,
      //用于书籍图片上传
      dialogImageUrl: "",
      //图片显示
      disabled: false,
      //添加或修改书籍表单中的数据
      //书名
      bookName: "",
      //作者
      bookAuthor: '',
      //介绍
      bookDetail: "",
      //价格
      bookPrice: "",
      //分类
      bookType: "",
      //出版社
      bookPress: "",
      //总数量
      bookNum: "",
      //书籍图片
      bookUrl: "",
      //书籍分类
      options: [],
      //书籍列表
      tableData: [],
      //价格查询 开始
      input1: "",
      //价格查询 结束
      input2: "",
      //条件查询栏 选择框
      value: "",
      //上传图片的地址
      uploadImgUrl: "http://localhost:3000/uploadImg",
      //上传图片列表
      fileList: [],
      //图片服务器地址
      imgBaseUrl: "http://localhost:3000",
      //图片上传后的地址
      bookSrc: ""
    };
  },
  mounted() {
    //获取列表书籍
    this.getBooks();
    //获取书籍分类
    this.getBookType();
  },
  methods: {
    //获取列表所有书籍
    async getBooks() {
      let books = await this.axios.get("/books");
      if (books.data.length !== 0) {
        this.tableData = books.data;
      }
    },
    //获取书籍分类
    async getBookType() {
      let result = await this.axios.get("/findAllType");
      if (result.data.length) {
        this.options = result.data;
      }
    },
    //图片上传
    handleRemove(file, fileList) {
      this.fileList = [];
    },
    handlerSuccess(res) {
      this.bookSrc = res.imgSrc;
    },
    handlerExceed() {
      this.$message.error("最多上传一张图片");
    },
    //添加或修改书籍
    async addOrModifyBook() {
      let result = this.handlerCheck();
      if (!result) return false;
      const obj = {
        name: this.bookName,
        author: this.bookAuthor,
        detail: this.bookDetail,
        price: this.bookPrice,
        press: this.bookPress,
        img: this.bookSrc,
        type: this.bookType,
        num: this.bookNum
      };
      //添加书籍
      let res = await this.axios.post("/addBook", JSON.stringify(obj), {
        headers: { "Content-Type": "application/json" }
      });
      if(res.data.type) {
        console.log(res.data)
        this.$message({
          message: res.data.msg,
          type: "success"
        });
      } else {
        this.$message.error(res.data.msg)
      }
      //清空表单
      this.bookName = '',
      this.bookAuthor = '',
      this.bookDetail = '',
      this.bookPrice = '',
      this.bookSrc = '',
      this.bookType = '',
      this.bookPress = '',
      this.bookNum = ''
      //关闭表单
      this.dialogFormVisible = false
    },
    //添加或修改书籍时验证必填值是否填写
    handlerCheck() {
      if (!this.bookName) {
        this.$message.error("书籍名称不能为空");
        return false;
      }
      if (!this.bookAuthor) {
        this.$message.error("作者名称不能为空");
        return false;
      }
      if (!this.bookPrice) {
        this.$message.error("书籍价格不能为空");
        return false;
      }
      if (!this.bookType) {
        this.$message.error("书籍类型不能为空");
        return false;
      }
      if (!this.bookNum) {
        this.$message.error("书籍总数量不能为空");
        return false;
      }
      return true;
    }
  }
};
</script>

<style lang="scss" scoped>
.about {
  img{
    width: 80px;
    height: 80px;
  }
  .header {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    h2 {
      width: 85%;
    }
  }
  .search {
    display: flex;
    justify-content: center;
    align-items: center;
    .searButton {
      margin-left: 10px;
    }
  }
  .list {
    margin-top: 20px;
  }
}
</style>