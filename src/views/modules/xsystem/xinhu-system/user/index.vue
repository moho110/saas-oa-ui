<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="${comment}" prop="user">
        <el-input
          v-model="queryParams.user"
          placeholder="请输入${comment}"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="${comment}" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入${comment}"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="${comment}" prop="position">
        <el-input
          v-model="queryParams.position"
          placeholder="请输入${comment}"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="${comment}" prop="mobile">
        <el-input
          v-model="queryParams.mobile"
          placeholder="请输入${comment}"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="${comment}" prop="email">
        <el-input
          v-model="queryParams.email"
          placeholder="请输入${comment}"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="部门id" prop="deptid">
        <el-input
          v-model="queryParams.deptid"
          placeholder="请输入部门id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="头像" prop="face">
        <el-input
          v-model="queryParams.face"
          placeholder="请输入头像"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="${comment}" prop="tel">
        <el-input
          v-model="queryParams.tel"
          placeholder="请输入${comment}"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['xinhu-system:user:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['xinhu-system:user:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['xinhu-system:user:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['xinhu-system:user:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="userList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="${comment}" align="center" prop="id" />
      <el-table-column label="${comment}" align="center" prop="user" />
      <el-table-column label="${comment}" align="center" prop="name" />
      <el-table-column label="${comment}" align="center" prop="position" />
      <el-table-column label="${comment}" align="center" prop="mobile" />
      <el-table-column label="${comment}" align="center" prop="email" />
      <el-table-column label="状态@1|已关注,2|已冻结,0|未关注" align="center" prop="status" />
      <el-table-column label="部门id" align="center" prop="deptid" />
      <el-table-column label="头像" align="center" prop="face" />
      <el-table-column label="${comment}" align="center" prop="tel" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['xinhu-system:user:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['xinhu-system:user:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改REIM即时通讯平台用户对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="${comment}" prop="user">
          <el-input v-model="form.user" placeholder="请输入${comment}" />
        </el-form-item>
        <el-form-item label="${comment}" prop="name">
          <el-input v-model="form.name" placeholder="请输入${comment}" />
        </el-form-item>
        <el-form-item label="${comment}" prop="position">
          <el-input v-model="form.position" placeholder="请输入${comment}" />
        </el-form-item>
        <el-form-item label="${comment}" prop="mobile">
          <el-input v-model="form.mobile" placeholder="请输入${comment}" />
        </el-form-item>
        <el-form-item label="${comment}" prop="email">
          <el-input v-model="form.email" placeholder="请输入${comment}" />
        </el-form-item>
        <el-form-item label="部门id" prop="deptid">
          <el-input v-model="form.deptid" placeholder="请输入部门id" />
        </el-form-item>
        <el-form-item label="头像" prop="face">
          <el-input v-model="form.face" placeholder="请输入头像" />
        </el-form-item>
        <el-form-item label="${comment}" prop="tel">
          <el-input v-model="form.tel" placeholder="请输入${comment}" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listUser, getUser, delUser, addUser, updateUser } from "@/api/xinhu-system/user";

export default {
  name: "User",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // REIM即时通讯平台用户表格数据
      userList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        user: null,
        name: null,
        position: null,
        mobile: null,
        email: null,
        status: null,
        deptid: null,
        face: null,
        tel: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        user: [
          { required: true, message: "$comment不能为空", trigger: "blur" }
        ],
        name: [
          { required: true, message: "$comment不能为空", trigger: "blur" }
        ],
        position: [
          { required: true, message: "$comment不能为空", trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "$comment不能为空", trigger: "blur" }
        ],
        email: [
          { required: true, message: "$comment不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "状态@1|已关注,2|已冻结,0|未关注不能为空", trigger: "blur" }
        ],
        deptid: [
          { required: true, message: "部门id不能为空", trigger: "blur" }
        ],
        face: [
          { required: true, message: "头像不能为空", trigger: "blur" }
        ],
        tel: [
          { required: true, message: "$comment不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询REIM即时通讯平台用户列表 */
    getList() {
      this.loading = true;
      listUser(this.queryParams).then(response => {
        this.userList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        user: null,
        name: null,
        position: null,
        mobile: null,
        email: null,
        status: 0,
        deptid: null,
        face: null,
        tel: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加REIM即时通讯平台用户";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getUser(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改REIM即时通讯平台用户";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateUser(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addUser(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除REIM即时通讯平台用户编号为"' + ids + '"的数据项？').then(function() {
        return delUser(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('xinhu-system/user/export', {
        ...this.queryParams
      }, `user_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
