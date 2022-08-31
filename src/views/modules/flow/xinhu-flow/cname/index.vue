<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="编号" prop="num">
        <el-input
          v-model="queryParams.num"
          placeholder="请输入编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="审核组名" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入审核组名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="审核人" prop="checkname">
        <el-input
          v-model="queryParams.checkname"
          placeholder="请输入审核人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="接收人" prop="recename">
        <el-input
          v-model="queryParams.recename"
          placeholder="请输入接收人"
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
          v-hasPermi="['xinhu-flow:cname:add']"
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
          v-hasPermi="['xinhu-flow:cname:edit']"
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
          v-hasPermi="['xinhu-flow:cname:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['xinhu-flow:cname:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="cnameList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="编号" align="center" prop="num" />
      <el-table-column label="审核组名" align="center" prop="name" />
      <el-table-column label="审核人" align="center" prop="checkname" />
      <el-table-column label="接收人" align="center" prop="recename" />
      <el-table-column label="排序号" align="center" prop="sort" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['xinhu-flow:cname:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['xinhu-flow:cname:remove']"
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

    <!-- 添加或修改自定义审核人组对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="180px">
        <el-form-item label="编号" prop="num">
          <el-input v-model="form.num" placeholder="请输入编号" />
        </el-form-item>
        <el-form-item label="审核组名" prop="name">
          <el-input v-model="form.name" placeholder="请输入审核组名" />
        </el-form-item>
        <el-form-item label="审核人ID" prop="checkid">
          <el-input v-model="form.checkid" placeholder="请输入审核人ID" />
        </el-form-item>
        <el-form-item label="审核人" prop="checkname">
          <el-input v-model="form.checkname" placeholder="请输入审核人" />
        </el-form-item>
        <el-form-item label="上级ID" prop="pid">
          <el-input v-model="form.pid" placeholder="请输入上级ID" />
        </el-form-item>
        <el-form-item label="接收人ID" prop="receid">
          <el-input v-model="form.receid" placeholder="请输入接收人ID" />
        </el-form-item>
        <el-form-item label="适用对象" prop="recename">
          <el-input v-model="form.recename" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="排序号" prop="sort">
          <el-input-number v-model="form.sort" :min="1" :max="999" label="排序号"></el-input-number>
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
import { listCname, getCname, delCname, addCname, updateCname } from "@/api/xinhu-flow/cname";

export default {
  name: "Cname",
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
      // 自定义审核人组表格数据
      cnameList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        num: null,
        name: null,
        checkid: null,
        checkname: null,
        pid: null,
        receid: null,
        recename: null,
        sort: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        num: [
          { required: true, message: "编号不能为空", trigger: "blur" },
          { min: 5, max: 30, message: '长度在 5 到 30 个字符', trigger: 'blur' }
        ],
        name: [
          { required: true, message: "审核组名不能为空", trigger: "blur" },
          { min: 5, max: 50, message: '长度在 5 到 50 个字符', trigger: 'blur' }
        ],
        checkid: [
          { required: true, message: "审核人ID不能为空", trigger: "blur" },
        ],
        checkname: [
          { required: true, message: "审核人不能为空", trigger: "blur" },
          { min: 5, max: 50, message: '长度在 5 到 50 个字符', trigger: 'blur' }
        ],
        pid: [
          { required: true, message: "上级ID不能为空", trigger: "blur" }
        ],
        receid: [
          { required: true, message: "接收人ID不能为空", trigger: "blur" }
        ],
        recename: [
          { required: true, message: "适用对象不能为空", trigger: "blur" },
          { min: 5, max: 500, message: '长度在 5 到 500 个字符', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: "排序号不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询自定义审核人组列表 */
    getList() {
      this.loading = true;
      listCname(this.queryParams).then(response => {
        this.cnameList = response.rows;
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
        num: null,
        name: null,
        checkid: null,
        checkname: null,
        pid: null,
        receid: null,
        recename: null,
        sort: null
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
      this.title = "添加自定义审核人组";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getCname(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改自定义审核人组";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateCname(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addCname(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除自定义审核人组编号为"' + ids + '"的数据项？').then(function() {
        return delCname(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('xinhu-flow/cname/export', {
        ...this.queryParams
      }, `cname_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
