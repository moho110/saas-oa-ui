<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="表" prop="tables">
        <el-input
          v-model="queryParams.tables"
          placeholder="请输入表"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态名称" prop="statusname">
        <el-input
          v-model="queryParams.statusname"
          placeholder="请输入状态名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="进程名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入进程名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="操作时间" prop="optdt">
        <el-date-picker clearable size="small"
          v-model="queryParams.optdt"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择操作时间">
        </el-date-picker>
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
          v-hasPermi="['xinhu-flow:log:add']"
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
          v-hasPermi="['xinhu-flow:log:edit']"
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
          v-hasPermi="['xinhu-flow:log:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['xinhu-flow:log:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="logList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="表" align="center" prop="tables" />
      <el-table-column label="状态名称" align="center" prop="statusname" />
      <el-table-column label="进程名称" align="center" prop="name" />
      <el-table-column label="操作时间" align="center" prop="optdt" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.optdt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="ip地址" align="center" prop="ip" />
      <el-table-column label="浏览器" align="center" prop="web" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['xinhu-flow:log:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['xinhu-flow:log:remove']"
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

    <!-- 添加或修改单据操作记录对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="180px">
        <el-form-item label="表" prop="tables">
          <el-input v-model="form.tables" placeholder="请输入表" />
        </el-form-item>
        <el-form-item label="mid" prop="mid">
          <el-input v-model="form.mid" placeholder="请输入mid" />
        </el-form-item>
        <el-form-item label="状态名称" prop="statusname">
          <el-input v-model="form.statusname" placeholder="请输入状态名称" />
        </el-form-item>
        <el-form-item label="进程名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入进程名称" />
        </el-form-item>
        <el-form-item label="进程ID" prop="courseid">
          <el-input v-model="form.courseid" placeholder="请输入进程ID" />
        </el-form-item>
        <el-form-item label="操作时间" prop="optdt">
          <el-date-picker clearable size="small"
            v-model="form.optdt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择操作时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="说明" prop="content">
          <el-input v-model="form.content" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="IP地址" prop="ip">
          <el-input v-model="form.ip" placeholder="请输入IP地址" />
        </el-form-item>
        <el-form-item label="浏览器" prop="web">
          <el-input v-model="form.web" placeholder="请输入浏览器" />
        </el-form-item>
        <el-form-item label="审核人名称" prop="checkname">
          <el-input v-model="form.checkname" placeholder="请输入审核人名称" />
        </el-form-item>
        <el-form-item label="审核人ID" prop="checkid">
          <el-input v-model="form.checkid" placeholder="请输入审核人ID" />
        </el-form-item>
        <el-form-item label="@模块Id" prop="modeid">
          <el-input v-model="form.modeid" placeholder="请输入@模块Id" />
        </el-form-item>
        <el-form-item label="颜色" prop="color">
          <el-input v-model="form.color" placeholder="请输入颜色" />
        </el-form-item>
        <el-form-item label="是否有效" prop="valid">
          <el-radio v-model="form.valid" label="1">是</el-radio>
          <el-radio v-model="form.valid" label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="步骤号" prop="step">
          <el-input v-model="form.step" placeholder="请输入步骤号" />
        </el-form-item>
        <el-form-item label="签名的图片base64" prop="qmimg">
          <el-input v-model="form.qmimg" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="是否转办记录" prop="iszb">
          <el-radio v-model="form.iszb" label="1">是</el-radio>
          <el-radio v-model="form.iszb" label="0">否</el-radio>
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
import { listLog, getLog, delLog, addLog, updateLog } from "@/api/xinhu-flow/log";

export default {
  name: "Log",
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
      // 单据操作记录表格数据
      logList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        tables: null,
        mid: null,
        status: null,
        statusname: null,
        name: null,
        courseid: null,
        optdt: null,
        explain: null,
        ip: null,
        web: null,
        checkname: null,
        checkid: null,
        modeid: null,
        color: null,
        valid: null,
        step: null,
        qmimg: null,
        iszb: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        tables: [
          { required: true, message: "表不能为空", trigger: "blur" },
          { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' }
        ],
        mid: [
          { required: true, message: "mid不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "1通过不能为空", trigger: "blur" }
        ],
        statusname: [
          { required: true, message: "状态名称不能为空", trigger: "blur" },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        name: [
          { required: true, message: "进程名称不能为空", trigger: "blur" },
          { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' }
        ],
        courseid: [
          { required: true, message: "进程ID不能为空", trigger: "blur" }
        ],
        optdt: [
          { required: true, message: "操作时间不能为空", trigger: "blur" }
        ],
        content: [
          { required: true, message: "说明不能为空", trigger: "blur" },
          { min: 3, max: 500, message: '长度在 3 到 500 个字符', trigger: 'blur' }
        ],
        ip: [
          { required: true, message: "IP地址不能为空", trigger: "blur" },
          { min: 16, max: 16, message: '长度在 16 到 16 个字符', trigger: 'blur' }
        ],
        web: [
          { required: true, message: "浏览器不能为空", trigger: "blur" },
          { min: 10, max: 100, message: '长度在 10 到 100 个字符', trigger: 'blur' }
        ],
        checkname: [
          { required: true, message: "审核人名称不能为空", trigger: "blur" },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        checkid: [
          { required: true, message: "审核人ID不能为空", trigger: "blur" }
        ],
        modeid: [
          { required: true, message: "@模块Id不能为空", trigger: "blur" }
        ],
        color: [
          { required: true, message: "颜色不能为空", trigger: "blur" },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        valid: [
          { required: true, message: "有效期不能为空", trigger: "blur" }
        ],
        step: [
          { required: true, message: "步骤号不能为空", trigger: "blur" }
        ],
        qmimg: [
          { required: true, message: "签名的图片base64不能为空", trigger: "blur" }
        ],
        iszb: [
          { required: true, message: "是否转办记录不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询单据操作记录列表 */
    getList() {
      this.loading = true;
      listLog(this.queryParams).then(response => {
        this.logList = response.rows;
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
        table: null,
        mid: null,
        status: 0,
        statusname: null,
        name: null,
        courseid: null,
        optdt: null,
        explain: null,
        ip: null,
        web: null,
        checkname: null,
        checkid: null,
        modeid: null,
        color: null,
        valid: null,
        step: null,
        qmimg: null,
        iszb: null
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
      this.title = "添加单据操作记录";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getLog(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改单据操作记录";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateLog(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addLog(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除单据操作记录编号为"' + ids + '"的数据项？').then(function() {
        return delLog(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('xinhu-flow/log/export', {
        ...this.queryParams
      }, `log_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
