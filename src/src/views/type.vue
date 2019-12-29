<template>
  <div class="container">
    <el-card class="box-card">
      <!-- 卡片标题栏 -->
      <div slot="header" class="clearfix header">
        <el-button plain round type="success" @click="$router.push('/')">
          <i class="el-icon-arrow-left" /> 去主页
        </el-button>
        <h2>分类管理</h2>
        <el-button type="primary" @click="dialogFormVisible = true">
          <i class="el-icon-circle-plus" /> 添加分类
        </el-button>

        <!-- 添加分类  弹框表单 -->
        <el-dialog title="添加分类" :visible.sync="dialogFormVisible">
          <el-form>
            <el-form-item label="分类名称">
              <el-input v-model="typeName" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="addType">确 定</el-button>
          </div>
        </el-dialog>
      </div>

      <!-- 列表 -->
      <el-card class="list">
        <el-table :data="tableData" height="600" border style="width: 100%">
          <el-table-column prop="_id" label="ID"></el-table-column>
          <el-table-column prop="name" label="分类名称"></el-table-column>
          <el-table-column fixed="right" label="操作" width="200">
            <template slot-scope="scope">
              <el-button @click="openModify(scope.row)" type="success" size="small"><i class="el-icon-edit"></i> 编辑</el-button>
              <el-button @click="deleteType(scope.row)" type="danger" size="small"><i class="el-icon-delete"></i> 删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 修改分类  弹框表单 -->
        <el-dialog title="修改分类" :visible.sync="dialogFormVisible1">
          <el-form>
            <el-form-item label="分类名称">
              <el-input v-model="modifyName" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible1 = false">取 消</el-button>
            <el-button type="primary" @click="modifyType">确 定</el-button>
          </div>
        </el-dialog>
      </el-card>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //控制添加分类表单的显示
      dialogFormVisible: false,
      //控制修改分类表单的显示
      dialogFormVisible1: false,
      //分类名称
      typeName: "",
      //修改分类名称
      modifyName: "",
      //列表数据
      tableData: [],
      //修改分类时的id
      modifyId: ""
    };
  },
  mounted() {
    //获取所有分类
    this.getAllType();
  },
  methods: {
    //获取所有分类
    async getAllType() {
      let result = await this.axios.get("/findAllType");
      if (result.status === 200) {
        //查询成功
        this.tableData = result.data;
      }
    },
    //添加分类
    async addType() {
      if (this.type) {
        //修改分类
        this.modifyType();
        return false;
      }
      //关闭form表单
      this.dialogFormVisible = false;
      if (!this.typeName) return false;
      let result = await this.axios.post(
        "/addType",
        JSON.stringify({ name: this.typeName }),
        {
          headers: { "Content-Type": "application/json" }
        }
      );
      if (result.data.type) {
        this.$message({
          message: result.data.msg,
          type: "success"
        });
        //添加成功 调用查询所有分类方法
        this.getAllType();
      } else {
        this.$message.error(result.data.msg);
      }
      this.typeName = "";
    },
    //打开修改类名表单
    openModify(rowObj) {
      this.dialogFormVisible1 = true;
      this.modifyName = rowObj.name;
      this.modifyId = rowObj._id;
    },
    //修改分类
    async modifyType() {
      //关闭form表单
      this.dialogFormVisible1 = false;

      let result = await this.axios.post(
        "/updateType",
        JSON.stringify({ id: this.modifyId, name: this.modifyName }),
        {
          headers: { "Content-Type": "application/json" }
        }
      );
      if (result) {
        this.$message({
          message: result.data.msg,
          type: "success"
        });
        //添加成功 调用查询所有分类方法
        this.getAllType();
        //清空输入框
        this.modifyName = "";
      } else {
        this.modifyName = "";
      }
    },
    //删除分类
    deleteType(rowObj) {
      this.$confirm(`您确定要删除 ${rowObj.name} 分类?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          //删除分类
          this.axios.get(`/typeDelete?id=${rowObj._id}`).then(result => {
            if (result.data.type) {
              this.$message({
                type: "success",
                message: result.data.msg
              });
            } else {
              this.$message.error(result.data.msg);
            }
            //重新获取所有分类
            this.getAllType()
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  .header {
    h2 {
      width: 85%;
    }
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
}
</style>
