<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="80px">
      <el-form-item label="步骤名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入步骤名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="编号" prop="num">
        <el-input
          v-model="queryParams.num"
          placeholder="请输入编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="审核人" prop="checktypename">
        <el-input
          v-model="queryParams.checktypename"
          placeholder="请输入审核人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="操作人" prop="optname">
        <el-input
          v-model="queryParams.optname"
          placeholder="请输入操作人姓名"
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
          v-hasPermi="['xinhu-flow:course:add']"
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
          v-hasPermi="['xinhu-flow:course:edit']"
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
          v-hasPermi="['xinhu-flow:course:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['xinhu-flow:course:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="courseList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="步骤名称" align="center" prop="name" />
      <el-table-column label="编号" align="center" prop="num" />
      <el-table-column label="审核人" align="center" prop="checktypename" />
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
            v-hasPermi="['xinhu-flow:course:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['xinhu-flow:course:remove']"
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

    <!-- 添加或修改流程步骤对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="200px">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="基本信息" name="first">
        <el-form-item label="上级ID" prop="mid">
          <el-input v-model="form.mid" placeholder="请输入上级ID" />
        </el-form-item>
        <el-form-item label="下级步骤ID" prop="nid">
          <el-input v-model="form.nid" placeholder="请输入下级步骤ID" />
        </el-form-item>
        <el-form-item label="模块ID" prop="setid">
          <el-input v-model="form.setid" placeholder="请输入模块ID" />
        </el-form-item>
        <el-form-item label="步骤名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入步骤名称" />
        </el-form-item>
        <el-form-item label="编号" prop="num">
          <el-input v-model="form.num" placeholder="请输入编号" />
        </el-form-item>
        <el-form-item label="审核人类型" prop="checktype">
          <el-radio v-model="form.checktype" label="1">已审核</el-radio>
          <el-radio v-model="form.checktype" label="0">未审核</el-radio>
        </el-form-item>
        <el-form-item label="审核类型ID" prop="checktypeid">
          <el-input v-model="form.checktypeid" placeholder="请输入审核类型ID" />
        </el-form-item>
        <el-form-item label="审核人" prop="checktypename">
          <el-input v-model="form.checktypename" placeholder="请输入审核人" />
        </el-form-item>
        <el-form-item label="排序号" prop="sort">
          <el-input-number v-model="form.sort" :min="1" :max="999" label="描述文字"></el-input-number>
        </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="审核条件" name="second">
        <el-form-item label="流程模块条件下的Id" prop="whereid">
          <el-input v-model="form.whereid" placeholder="请输入流程模块条件下的Id" />
        </el-form-item>
        <el-form-item label="审核条件" prop="wheres">
          <el-input v-model="form.wheres" type="textarea" placeholder="请输入审核条件" />
        </el-form-item>
        <el-form-item label="说明" prop="content">
          <el-input v-model="form.content" placeholder="请输入说明" />
        </el-form-item>
        <el-form-item label="操作时间" prop="optdt">
          <el-date-picker clearable size="small"
            v-model="form.optdt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择操作时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio v-model="form.status" label="1">良好</el-radio>
          <el-radio v-model="form.status" label="0">一般</el-radio>
        </el-form-item>
        <el-form-item label="审核动作" prop="courseact">
          <el-input v-model="form.courseact" placeholder="请输入审核动作" />
        </el-form-item>
        <el-form-item label="至少几人审核 ,0全部" prop="checkshu">
          <el-input v-model="form.checkshu" placeholder="请输入至少几人审核 ,0全部" />
        </el-form-item>
        <el-form-item label="审核处理表单" prop="checkfields">
          <el-input v-model="form.checkfields" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="上级Id(弃用)" prop="pid">
          <el-input v-model="form.pid" placeholder="请输入上级Id(弃用)" />
        </el-form-item>
        <el-form-item label="操作人id" prop="optid">
          <el-input v-model="form.optid" placeholder="请输入操作人id" />
        </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="审核流程" name="third">
        <el-form-item label="操作人姓名" prop="optname">
          <el-input v-model="form.optname" placeholder="请输入操作人姓名" />
        </el-form-item>
        <el-form-item label="适用对象id" prop="receid">
          <el-input v-model="form.receid" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="适用对象" prop="recename">
          <el-input v-model="form.recename" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="是否可以转给他人办理" prop="iszf">
          <el-radio v-model="form.iszf" label="1">是</el-radio>
          <el-radio v-model="form.iszf" label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="手写签名0不用,1都需要,2只需要通过,3只需要不通过" prop="isqm">
          <el-radio v-model="form.isqm" label="0">不用</el-radio>
          <el-radio v-model="form.isqm" label="1">都需要</el-radio>
          <el-radio v-model="form.isqm" label="2">只需要通过</el-radio>
          <el-radio v-model="form.isqm" label="3">只需要不通过</el-radio>
        </el-form-item>
        <el-form-item label="超时时间(分钟)" prop="zshtime">
          <el-input v-model="form.zshtime" placeholder="请输入超时时间(分钟)" />
        </el-form-item>
        <el-form-item label="自动审核类型" prop="zshstate">
          <el-radio v-model="form.zshstate" label="1">已审核</el-radio>
          <el-radio v-model="form.zshstate" label="0">未审核</el-radio>
        </el-form-item>
        <el-form-item label="转办人员可选范围" prop="zbrangeame">
          <el-input v-model="form.zbrangeame" placeholder="请输入转办人员可选范围" />
        </el-form-item>
        <el-form-item label="转办人员可选范围ID" prop="zbrangeid">
          <el-input v-model="form.zbrangeid" placeholder="请输入转办人员可选范围ID" />
        </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="审核处理" name="four">
        <el-form-item label="处理说明类型" prop="smlx">
          <el-radio v-model="form.smlx" label="1">已审核</el-radio>
          <el-radio v-model="form.smlx" label="0">未审核</el-radio>
        </el-form-item>
        <el-form-item label="相关文件类型" prop="wjlx">
          <el-radio v-model="form.wjlx" label="1">已审核</el-radio>
          <el-radio v-model="form.wjlx" label="0">未审核</el-radio>
        </el-form-item>
        <el-form-item label="审批时是否可直接编辑附件" prop="isxgfj">
          <el-radio v-model="form.isxgfj" label="1">是</el-radio>
          <el-radio v-model="form.isxgfj" label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="抄送类型" prop="cslx">
          <el-radio v-model="form.cslx" label="1">已审核</el-radio>
          <el-radio v-model="form.cslx" label="0">未审核</el-radio>
        </el-form-item>
        <el-form-item label="抄送范围" prop="csfwname">
          <el-input v-model="form.csfwname" placeholder="请输入抄送范围" />
        </el-form-item>
        <el-form-item label="抄送范围ID" prop="csfwid">
          <el-input v-model="form.csfwid" placeholder="请输入抄送范围ID" />
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
import { listCourse, getCourse, delCourse, addCourse, updateCourse } from "@/api/xinhu-flow/course";

export default {
  name: "Course",
  data() {
    return {
      //tabs
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
      // 流程步骤表格数据
      courseList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        mid: null,
        nid: null,
        setid: null,
        name: null,
        num: null,
        checktype: null,
        checktypeid: null,
        checktypename: null,
        sort: null,
        whereid: null,
        wheres: null,
        content: null,
        optdt: null,
        status: null,
        courseact: null,
        checkshu: null,
        checkfields: null,
        pid: null,
        optid: null,
        optname: null,
        receid: null,
        recename: null,
        iszf: null,
        isqm: null,
        coursetype: null,
        zshtime: null,
        zshstate: null,
        zbrangeame: null,
        zbrangeid: null,
        smlx: null,
        wjlx: null,
        isxgfj: null,
        cslx: null,
        csfwname: null,
        csfwid: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        mid: [
          { required: true, message: "上级ID不能为空", trigger: "blur" }
        ],
        nid: [
          { required: true, message: "下级步骤ID不能为空", trigger: "blur" }
        ],
        setid: [
          { required: true, message: "模块ID不能为空", trigger: "blur" }
        ],
        name: [
          { required: true, message: "步骤名称不能为空", trigger: "blur" },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        num: [
          { required: true, message: "编号不能为空", trigger: "blur" },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        checktype: [
          { required: true, message: "审核人类型不能为空", trigger: "change" },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        checktypeid: [
          { required: true, message: "审核人类型ID不能为空", trigger: "blur" },
          { pattern: /^\d+(\.\d+)?$/, message: "审核人类型ID必须是数字", trigger: "blur"}
        ],
        checktypename: [
          { required: true, message: "审核人不能为空", trigger: "blur" },
          { min: 5, max: 200, message: '长度在 5 到 200 个字符', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: "排序号不能为空", trigger: "blur" },
          { pattern: /^\d+(\.\d+)?$/, message: "排序号必须是数字", trigger: "blur"}
        ],
        whereid: [
          { required: true, message: "流程模块条件下的Id不能为空", trigger: "blur" },
          { pattern: /^\d+(\.\d+)?$/, message: "流程模块条件下的Id必须是数字", trigger: "blur"}
        ],
        wheres: [
          { required: true, message: "审核条件不能为空", trigger: "blur" },
          { pattern: /^\d+(\.\d+)?$/, message: "审核条件必须是数字", trigger: "blur"}
        ],
        content: [
          { required: true, message: "说明不能为空", trigger: "blur" },
          { min: 5, max: 100, message: '长度在 5 到 100 个字符', trigger: 'blur' }
        ],
        optdt: [
          { required: true, message: "操作时间不能为空", trigger: "blur" },
          {Type: 'date', required: true, message: '请选择入职时间', trigger: 'change'}
        ],
        status: [
          { required: true, message: "状态不能为空", trigger: "blur" },
          { pattern: /^\d+(\.\d+)?$/, message: "状态必须是数字", trigger: "blur"}
        ],
        courseact: [
          { required: true, message: "审核动作不能为空", trigger: "blur" },
          { min: 5, max: 50, message: '长度在 5 到 50 个字符', trigger: 'blur' }
        ],
        checkshu: [
          { required: true, message: "至少几人审核 ,0全部不能为空", trigger: "blur" },
          { pattern: /^\d+(\.\d+)?$/, message: "至少几人审核 ,0全部不能为空必须是数字", trigger: "blur"}
        ],
        checkfields: [
          { required: true, message: "审核处理表单不能为空", trigger: "blur" },
          { min: 5, max: 500, message: '长度在 5 到 500 个字符', trigger: 'blur' }
        ],
        pid: [
          { required: true, message: "上级Id(弃用)不能为空", trigger: "blur" }
        ],
        optid: [
          { required: true, message: "操作人id不能为空", trigger: "blur" }
        ],
        optname: [
          { required: true, message: "操作人姓名不能为空", trigger: "blur" },
          { min: 5, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur' }
        ],
        receid: [
          { required: true, message: "适用对象id不能为空", trigger: "blur" }
        ],
        recename: [
          { required: true, message: "适用对象不能为空", trigger: "blur" },
          { min: 5, max: 500, message: '长度在 5 到 500 个字符', trigger: 'blur' }
        ],
        iszf: [
          { required: true, message: "是否可以转给他人办理不能为空", trigger: "blur" }
        ],
        isqm: [
          { required: true, message: "手写签名0不用,1都需要,2只需要通过,3只需要不通过不能为空", trigger: "blur" }
        ],
        coursetype: [
          { required: true, message: "审批方式0顺序,1前置审批,2后置审批不能为空", trigger: "change" }
        ],
        zshtime: [
          { required: true, message: "超时时间(分钟)不能为空", trigger: "blur" }
        ],
        zshstate: [
          { required: true, message: "自动审核类型不能为空", trigger: "blur" }
        ],
        zbrangeame: [
          { required: true, message: "转办人员可选范围不能为空", trigger: "blur" },
          { min: 5, max: 200, message: '长度在 5 到 200 个字符', trigger: 'blur' }
        ],
        zbrangeid: [
          { required: true, message: "转办人员可选范围ID不能为空", trigger: "blur" }
        ],
        smlx: [
          { required: true, message: "处理说明类型不能为空", trigger: "blur" }
        ],
        wjlx: [
          { required: true, message: "相关文件类型不能为空", trigger: "blur" }
        ],
        isxgfj: [
          { required: true, message: "审批时是否可直接编辑附件不能为空", trigger: "blur" }
        ],
        cslx: [
          { required: true, message: "抄送类型不能为空", trigger: "blur" }
        ],
        csfwname: [
          { required: true, message: "抄送范围不能为空", trigger: "blur" },
          { min: 5, max: 200, message: '长度在 5 到 200 个字符', trigger: 'blur' }
        ],
        csfwid: [
          { required: true, message: "抄送范围ID不能为空", trigger: "blur" },
          { min: 5, max: 200, message: '长度在 5 到 200 个字符', trigger: 'blur' }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询流程步骤列表 */
    getList() {
      this.loading = true;
      listCourse(this.queryParams).then(response => {
        this.courseList = response.rows;
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
        mid: null,
        nid: null,
        setid: null,
        name: null,
        num: null,
        checktype: null,
        checktypeid: null,
        checktypename: null,
        sort: null,
        whereid: null,
        wheres: null,
        explain: null,
        optdt: null,
        status: 0,
        courseact: null,
        checkshu: null,
        checkfields: null,
        pid: null,
        optid: null,
        optname: null,
        receid: null,
        recename: null,
        iszf: null,
        isqm: null,
        coursetype: null,
        zshtime: null,
        zshstate: null,
        zbrangeame: null,
        zbrangeid: null,
        smlx: null,
        wjlx: null,
        isxgfj: null,
        cslx: null,
        csfwname: null,
        csfwid: null
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
      this.title = "添加流程步骤";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getCourse(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改流程步骤";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateCourse(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addCourse(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除流程步骤编号为"' + ids + '"的数据项？').then(function() {
        return delCourse(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('xinhu-flow/course/export', {
        ...this.queryParams
      }, `course_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
