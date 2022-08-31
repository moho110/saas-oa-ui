<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="审核人" prop="checkname">
        <el-input
          v-model="queryParams.checkname"
          placeholder="请输入审核人名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="操作人" prop="optname">
        <el-input
          v-model="queryParams.optname"
          placeholder="请输入操作人名称"
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
          v-hasPermi="['xinhu-flow:checks:add']"
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
          v-hasPermi="['xinhu-flow:checks:edit']"
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
          v-hasPermi="['xinhu-flow:checks:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['xinhu-flow:checks:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="checksList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="审核人名称" align="center" prop="checkname" />
      <el-table-column label="操作人名称" align="center" prop="optname" />
      <el-table-column label="操作时间" align="center" prop="optdt" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.optdt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['xinhu-flow:checks:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['xinhu-flow:checks:remove']"
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

    <!-- 添加或修改单据的审核人对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="180px">
        <el-form-item label="表文件" prop="tables">
          <el-input v-model="form.tables" placeholder="请输入表文件" />
        </el-form-item>
        <el-form-item label="mid" prop="mid">
          <el-input v-model="form.mid" placeholder="请输入mid" />
        </el-form-item>
        <el-form-item label="modeid" prop="modeid">
          <el-input v-model="form.modeid" placeholder="请输入modeid" />
        </el-form-item>
        <el-form-item label="courseid" prop="courseid">
          <el-input v-model="form.courseid" placeholder="请输入courseid" />
        </el-form-item>
        <el-form-item label="checkid" prop="checkid">
          <el-input v-model="form.checkid" placeholder="请输入checkid" />
        </el-form-item>
        <el-form-item label="审核人" prop="checkname">
          <el-input v-model="form.checkname" placeholder="请输入审核人" />
        </el-form-item>
        <el-form-item label="操作人ID" prop="optid">
          <el-input v-model="form.optid" placeholder="请输入操作人ID" />
        </el-form-item>
        <el-form-item label="操作人名称" prop="optname">
          <el-input v-model="form.optname" placeholder="请输入操作人名称" />
        </el-form-item>
        <el-form-item label="操作人时间" prop="optdt">
          <el-date-picker clearable size="small"
            v-model="form.optdt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择操作人名称">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio v-model="form.status" label="1">良好</el-radio>
          <el-radio v-model="form.status" label="0">一般</el-radio>
        </el-form-item>
        <el-form-item label="类型" prop="addlx">
          <el-radio v-model="form.addlx" label="1">自定义</el-radio>
          <el-radio v-model="form.addlx" label="2">撤回添加</el-radio>
          <el-radio v-model="form.addlx" label="3">退回添加</el-radio>
          <el-radio v-model="form.addlx" label="4">转移添加</el-radio>
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
import { listChecks, getChecks, delChecks, addChecks, updateChecks } from "@/api/xinhu-flow/checks";

export default {
  name: "Checks",
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
      // 单据的审核人表格数据
      checksList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        table: null,
        mid: null,
        modeid: null,
        courseid: null,
        checkid: null,
        checkname: null,
        optid: null,
        optname: null,
        optdt: null,
        status: null,
        addlx: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        tables: [
          { required: true, message: "表名称不能为空", trigger: "blur" },
          { min: 10, max: 30, message: '长度在 10 到 30 个字符', trigger: 'blur' }
        ],
        mid: [
          { required: true, message: "mid不能为空", trigger: "blur" }
        ],
        modeid: [
          { required: true, message: "modeid不能为空", trigger: "blur" }
        ],
        courseid: [
          { required: true, message: "courseid不能为空", trigger: "blur" }
        ],
        checkid: [
          { required: true, message: "checkid不能为空", trigger: "blur" },
          { min: 10, max: 100, message: '长度在 10 到 100 个字符', trigger: 'blur' }
        ],
        checkname: [
          { required: true, message: "审核人名称不能为空", trigger: "blur" },
          { min: 10, max: 100, message: '长度在 10 到 100 个字符', trigger: 'blur' }
        ],
        optid: [
          { required: true, message: "操作人ID不能为空", trigger: "blur" }
        ],
        optname: [
          { required: true, message: "操作人名称不能为空", trigger: "blur" },
          { min: 10, max: 20, message: '长度在 10 到 20 个字符', trigger: 'blur' }
        ],
        optdt: [
          { required: true, message: "操作时间不能为空", trigger: "blur" },
          { type: 'date', required: true, message: '请选择操作时间', trigger: 'change' }
        ],
        status: [
          { required: true, message: "状态不能为空", trigger: "blur" }
        ],
        addlx: [
          { required: true, message: "类型1自定义,2撤回添加,3退回添加,4转移添加不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询单据的审核人列表 */
    getList() {
      this.loading = true;
      listChecks(this.queryParams).then(response => {
        this.checksList = response.rows;
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
        tables: null,
        mid: null,
        modeid: null,
        courseid: null,
        checkid: null,
        checkname: null,
        optid: null,
        optname: null,
        optdt: null,
        status: 0,
        addlx: null
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
      this.title = "添加单据的审核人";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getChecks(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改单据的审核人";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateChecks(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addChecks(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除单据的审核人编号为"' + ids + '"的数据项？').then(function() {
        return delChecks(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('xinhu-flow/checks/export', {
        ...this.queryParams
      }, `checks_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
