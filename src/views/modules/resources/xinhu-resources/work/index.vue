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
      <el-form-item label="标题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入标题"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="任务等级" prop="grade">
        <el-input
          v-model="queryParams.grade"
          placeholder="请输入任务等级"
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
      
      <el-form-item label="操作人" prop="optname">
        <el-input
          v-model="queryParams.optname"
          placeholder="请输入操作人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="开始时间" prop="startdt">
        <el-date-picker clearable size="small"
          v-model="queryParams.startdt"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择开始时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间" prop="enddt">
        <el-date-picker clearable size="small"
          v-model="queryParams.enddt"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择结束时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="任务分数" prop="score">
        <el-input
          v-model="queryParams.score"
          placeholder="请输入任务分数"
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
          v-hasPermi="['xinhu-resources:work:add']"
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
          v-hasPermi="['xinhu-resources:work:edit']"
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
          v-hasPermi="['xinhu-resources:work:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['xinhu-resources:work:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="workList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="编号" align="center" prop="num" />
      <el-table-column label="标题" align="center" prop="title" />
      <el-table-column label="任务等级" align="center" prop="grade" />
      <el-table-column label="操作时间" align="center" prop="optdt" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.optdt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作人" align="center" prop="optname" />
      <el-table-column label="开始时间" align="center" prop="startdt" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.startdt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束时间" align="center" prop="enddt" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.enddt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['xinhu-resources:work:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['xinhu-resources:work:remove']"
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

    <!-- 添加或修改任务对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="180px">
        <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="基础配置" name="first">
        <el-form-item label="编号" prop="num">
          <el-input v-model="form.num" placeholder="请输入编号" />
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="类型" prop="types">
          <el-input v-model="form.types" placeholder="请输入类型" />
        </el-form-item>
        <el-form-item label="任务等级" prop="grade">
          <el-input v-model="form.grade" placeholder="请输入任务等级" />
        </el-form-item>
        <el-form-item label="分配给ID" prop="distid">
          <el-input v-model="form.distid" placeholder="请输入分配给ID" />
        </el-form-item>
        <el-form-item label="分配给" prop="dist">
          <el-input v-model="form.dist" placeholder="请输入分配给" />
        </el-form-item>
        <el-form-item label="说明" prop="content">
          <el-input v-model="form.content" type="textarea" placeholder="请输入说明" />
        </el-form-item>
        <el-form-item label="操作时间" prop="optdt">
          <el-date-picker clearable size="small"
            v-model="form.optdt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择操作时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="操作ID" prop="optid">
          <el-input v-model="form.optid" placeholder="请输入操作ID" />
        </el-form-item>
        <el-form-item label="操作人" prop="optname">
          <el-input v-model="form.optname" placeholder="请输入操作人" />
        </el-form-item>
        <el-form-item label="开始时间" prop="startdt">
          <el-date-picker clearable size="small"
            v-model="form.startdt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择开始时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="enddt">
          <el-date-picker clearable size="small"
            v-model="form.enddt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择结束时间">
          </el-date-picker>
        </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="配置管理" name="second">
        <el-form-item label="状态" prop="state">
          <el-input v-model="form.state" placeholder="请输入状态" />
        </el-form-item>
        <el-form-item label="tx时间" prop="txdt">
          <el-date-picker clearable size="small"
            v-model="form.txdt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择tx时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="分值" prop="fen">
          <el-input v-model="form.fen" placeholder="请输入分值" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio v-model="form.status" label="1">良好</el-radio>
          <el-radio v-model="form.status" label="0">一般</el-radio>
        </el-form-item>
        <el-form-item label="对应项目Id" prop="projectid">
          <el-input v-model="form.projectid" placeholder="请输入对应项目Id" />
        </el-form-item>
        <el-form-item label="ddid" prop="ddid">
          <el-input v-model="form.ddid" placeholder="请输入ddid" />
        </el-form-item>
        <el-form-item label="督导人员，不填默认上级" prop="ddname">
          <el-input v-model="form.ddname" placeholder="请输入督导人员，不填默认上级" />
        </el-form-item>
        <el-form-item label="任务分数" prop="score">
          <el-input v-model="form.score" placeholder="请输入任务分数" />
        </el-form-item>
        <el-form-item label="得分" prop="mark">
          <el-input v-model="form.mark" placeholder="请输入得分" />
        </el-form-item>
        <el-form-item label="用户ID" prop="uid">
          <el-input v-model="form.uid" placeholder="请输入用户ID" />
        </el-form-item>
        <el-form-item label="申请日期" prop="applydt">
          <el-date-picker clearable size="small"
            v-model="form.applydt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择申请日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="是否提交" prop="isturn">
          <el-radio v-model="form.isturn" label="1">是</el-radio>
          <el-radio v-model="form.isturn" label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="对应单位id" prop="comid">
          <el-input v-model="form.comid" placeholder="请输入对应单位id" />
        </el-form-item>
        </el-tab-pane>
        </el-tabs>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listWork, getWork, delWork, addWork, updateWork } from "@/api/xinhu-resources/work";

export default {
  name: "Work",
  data() {
    return {
      activeName: 'first',
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
      // 任务表格数据
      workList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        num: null,
        title: null,
        types: null,
        grade: null,
        distid: null,
        dist: null,
        content: null,
        optdt: null,
        optid: null,
        optname: null,
        startdt: null,
        enddt: null,
        state: null,
        txdt: null,
        fen: null,
        status: null,
        projectid: null,
        ddid: null,
        ddname: null,
        score: null,
        mark: null,
        uid: null,
        applydt: null,
        isturn: null,
        comid: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        num: [
          { required: true, message: "编号不能为空", trigger: "blur" },
          { min: 3, max: 30, message: '长度在 3 到 30 个字符', trigger: 'blur' }
        ],
        title: [
          { required: true, message: "标题不能为空", trigger: "blur" },
          { min: 3, max: 200, message: '长度在 3 到 200 个字符', trigger: 'blur' }
        ],
        types: [
          { required: true, message: "任务类型不能为空", trigger: "change" },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        grade: [
          { required: true, message: "任务等级不能为空", trigger: "blur" },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        distid: [
          { required: true, message: "分配给ID不能为空", trigger: "blur" },
          { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' }
        ],
        dist: [
          { required: true, message: "分配给不能为空", trigger: "blur" },
          { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' }
        ],
        content: [
          { required: true, message: "说明不能为空", trigger: "blur" },
          { min: 10, max: 500, message: '长度在 10 到 500 个字符', trigger: 'blur' }
        ],
        optdt: [
          { required: true, message: "操作时间不能为空", trigger: "blur" }
        ],
        optid: [
          { required: true, message: "操作ID不能为空", trigger: "blur" }
        ],
        optname: [
          { required: true, message: "操作人不能为空", trigger: "blur" },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        startdt: [
          { required: true, message: "开始时间不能为空", trigger: "blur" }
        ],
        enddt: [
          { required: true, message: "结束时间不能为空", trigger: "blur" }
        ],
        state: [
          { required: true, message: "状态不能为空", trigger: "blur" }
        ],
        txdt: [
          { required: true, message: "tx时间不能为空", trigger: "blur" }
        ],
        fen: [
          { required: true, message: "分值不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "状态不能为空", trigger: "blur" }
        ],
        projectid: [
          { required: true, message: "对应项目Id不能为空", trigger: "blur" }
        ],
        ddid: [
          { required: true, message: "ddid不能为空", trigger: "blur" },
          { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' }
        ],
        ddname: [
          { required: true, message: "督导人员，不填默认上级不能为空", trigger: "blur" },
          { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' }
        ],
        score: [
          { required: true, message: "任务分数不能为空", trigger: "blur" }
        ],
        mark: [
          { required: true, message: "得分不能为空", trigger: "blur" }
        ],
        uid: [
          { required: true, message: "用户ID不能为空", trigger: "blur" }
        ],
        applydt: [
          { required: true, message: "申请日期不能为空", trigger: "blur" }
        ],
        isturn: [
          { required: true, message: "是否提交不能为空", trigger: "blur" }
        ],
        comid: [
          { required: true, message: "对应单位id不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询任务列表 */
    getList() {
      this.loading = true;
      listWork(this.queryParams).then(response => {
        this.workList = response.rows;
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
        title: null,
        types: null,
        grade: null,
        distid: null,
        dist: null,
        content: null,
        optdt: null,
        optid: null,
        optname: null,
        startdt: null,
        enddt: null,
        state: null,
        txdt: null,
        fen: null,
        status: 0,
        projectid: null,
        ddid: null,
        ddname: null,
        score: null,
        mark: null,
        uid: null,
        applydt: null,
        isturn: null,
        comid: null
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
      this.title = "添加任务";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getWork(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改任务";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateWork(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addWork(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除任务编号为"' + ids + '"的数据项？').then(function() {
        return delWork(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('xinhu-resources/work/export', {
        ...this.queryParams
      }, `work_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
