<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="接收人名称" prop="recename">
        <el-input
          v-model="queryParams.recename"
          placeholder="请输入接收人名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="条件字段" prop="wherestr">
        <el-input
          v-model="queryParams.wherestr"
          placeholder="请输入条件字段"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="相关字段" prop="fieldstr">
        <el-input
          v-model="queryParams.fieldstr"
          placeholder="请输入相关字段"
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
          v-hasPermi="['xinhu-flow:extent:add']"
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
          v-hasPermi="['xinhu-flow:extent:edit']"
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
          v-hasPermi="['xinhu-flow:extent:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['xinhu-flow:extent:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="extentList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="接收人" align="center" prop="recename" />
      <el-table-column label="模块" align="center" prop="modeid" />
      <el-table-column label="条件" align="center" prop="wherestr" />
      <el-table-column label="相关字段" align="center" prop="fieldstr" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['xinhu-flow:extent:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['xinhu-flow:extent:remove']"
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

    <!-- 添加或修改模块权限对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="180px">
        <el-form-item label="接收人名称" prop="recename">
          <el-input v-model="form.recename" type="textarea" placeholder="请输入接收人名称" />
        </el-form-item>
        <el-form-item label="接收人ID" prop="receid">
          <el-input v-model="form.receid" type="textarea" placeholder="请输入接收人ID" />
        </el-form-item>
        <el-form-item label="模块" prop="modeid">
          <el-input v-model="form.modeid" placeholder="请输入模块" />
        </el-form-item>
        <el-form-item label="条件" prop="wherestr">
          <el-input v-model="form.wherestr" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="说明" prop="content">
          <el-input v-model="form.content" type="textarea" placeholder="请输入说明" />
        </el-form-item>
        <el-form-item label="条件Id" prop="whereid">
          <el-input v-model="form.whereid" placeholder="请输入条件Id" />
        </el-form-item>
        <el-form-item label="相关字段" prop="fieldstr">
          <el-input v-model="form.fieldstr" type="textarea" placeholder="请输入内容" />
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
import { listExtent, getExtent, delExtent, addExtent, updateExtent } from "@/api/xinhu-flow/extent";

export default {
  name: "Extent",
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
      // 模块权限表格数据
      extentList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        recename: null,
        receid: null,
        modeid: null,
        type: null,
        wherestr: null,
        explain: null,
        status: null,
        whereid: null,
        fieldstr: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        recename: [
          { required: true, message: "接收人名称不能为空", trigger: "blur" },
          { min: 5, max: 100, message: '长度在 5 到 100 个字符', trigger: 'blur' }
        ],
        receid: [
          { required: true, message: "接收人ID不能为空", trigger: "blur" },
          { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' }
        ],
        modeid: [
          { required: true, message: "模块不能为空", trigger: "blur" }
        ],
        type: [
          { required: true, message: "0查看,1添加,2编辑,3删除不能为空", trigger: "change" }
        ],
        wherestr: [
          { required: true, message: "条件不能为空", trigger: "blur" },
          { min: 3, max: 500, message: '长度在 3 到 500 个字符', trigger: 'blur' }
        ],
        content: [
          { required: true, message: "说明不能为空", trigger: "blur" },
          { min: 3, max: 500, message: '长度在 3 到 500 个字符', trigger: 'blur' }
        ],
        status: [
          { required: true, message: "状态不能为空", trigger: "blur" }
        ],
        whereid: [
          { required: true, message: "条件Id不能为空", trigger: "blur" }
        ],
        fieldstr: [
          { required: true, message: "相关字段不能为空", trigger: "blur" },
          { min: 3, max: 500, message: '长度在 3 到 500 个字符', trigger: 'blur' }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询模块权限列表 */
    getList() {
      this.loading = true;
      listExtent(this.queryParams).then(response => {
        this.extentList = response.rows;
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
        recename: null,
        receid: null,
        modeid: null,
        type: null,
        wherestr: null,
        explain: null,
        status: 0,
        whereid: null,
        fieldstr: null
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
      this.title = "添加模块权限";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getExtent(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改模块权限";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateExtent(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addExtent(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除模块权限编号为"' + ids + '"的数据项？').then(function() {
        return delExtent(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('xinhu-flow/extent/export', {
        ...this.queryParams
      }, `extent_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
