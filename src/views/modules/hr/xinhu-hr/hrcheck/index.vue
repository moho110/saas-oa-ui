<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="考核名称" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入考核名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="申请人" prop="applyname">
        <el-input
          v-model="queryParams.applyname"
          placeholder="请输入申请人姓名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
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
          v-hasPermi="['xinhu-hr:hrcheck:add']"
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
          v-hasPermi="['xinhu-hr:hrcheck:edit']"
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
          v-hasPermi="['xinhu-hr:hrcheck:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['xinhu-hr:hrcheck:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="hrcheckList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="考核名称" align="center" prop="title" />
      <el-table-column label="申请人姓名" align="center" prop="applyname" />
      <el-table-column label="操作时间" align="center" prop="optdt" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.optdt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作人" align="center" prop="optname" />
      <el-table-column label="申请日期" align="center" prop="applydt" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.applydt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status" :formatter="stateFormat" />
      <el-table-column label="是否提交" align="center" prop="isturn" :formatter="submitFormat"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['xinhu-hr:hrcheck:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['xinhu-hr:hrcheck:remove']"
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

    <!-- 添加或修改考核评分对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="180px">
        <el-form-item label="用户ID" prop="uid">
          <el-input v-model="form.uid" placeholder="请输入用户ID" />
        </el-form-item>
        <el-form-item label="考核名称" prop="title">
          <el-input v-model="form.title" placeholder="请输入考核名称" />
        </el-form-item>
        <el-form-item label="申请人姓名" prop="applyname">
          <el-input v-model="form.applyname" placeholder="请输入申请人姓名" />
        </el-form-item>
        <el-form-item label="操作时间" prop="optdt">
          <el-date-picker clearable size="small"
            v-model="form.optdt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择操作时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="操作人ID" prop="optid">
          <el-input v-model="form.optid" placeholder="请输入操作人ID" />
        </el-form-item>
        <el-form-item label="操作人" prop="optname">
          <el-input v-model="form.optname" placeholder="请输入操作人" />
        </el-form-item>
        <el-form-item label="申请日期" prop="applydt">
          <el-date-picker clearable size="small"
            v-model="form.applydt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择申请日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="说明" prop="contents">
          <el-input v-model="form.contents" type="textarea" placeholder="请输入说明" />
        </el-form-item>
        <el-form-item label="状态" prop="optnastatusme">
          <el-radio v-model="form.status" label="1">良好</el-radio>
          <el-radio v-model="form.status" label="0">一般</el-radio>
        </el-form-item>
        <el-form-item label="是否提交" prop="isturn">
          <el-radio v-model="form.isturn" label="1">已提交</el-radio>
          <el-radio v-model="form.isturn" label="0">未提交</el-radio>
        </el-form-item>
        <el-form-item label="对应人" prop="uname">
          <el-input v-model="form.uname" placeholder="请输入对应人" />
        </el-form-item>
        <el-form-item label="月份" prop="month">
          <el-input v-model="form.month" placeholder="请输入月份" />
        </el-form-item>
        <el-form-item label="考核内容">
          <editor v-model="form.content" :min-height="192"/>
        </el-form-item>
        <el-form-item label="自评分数" prop="fenzp">
          <el-input v-model="form.fenzp" placeholder="请输入自评分数" />
        </el-form-item>
        <el-form-item label="上级评分" prop="fensj">
          <el-input v-model="form.fensj" placeholder="请输入上级评分" />
        </el-form-item>
        <el-form-item label="人事评分" prop="fenrs">
          <el-input v-model="form.fenrs" placeholder="请输入人事评分" />
        </el-form-item>
        <el-form-item label="最后得分" prop="fen">
          <el-input v-model="form.fen" placeholder="请输入最后得分" />
        </el-form-item>
        <el-form-item label="关联考核项目hrkaohem.id" prop="khid">
          <el-input v-model="form.khid" placeholder="请输入关联考核项目hrkaohem.id" />
        </el-form-item>
        <el-form-item label="创建时间" prop="createdt">
          <el-date-picker clearable size="small"
            v-model="form.createdt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择创建时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="评分开始时间" prop="startdt">
          <el-date-picker clearable size="small"
            v-model="form.startdt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择评分开始时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="评分截止时间" prop="enddt">
          <el-date-picker clearable size="small"
            v-model="form.enddt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择评分截止时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="评分人" prop="pfren">
          <el-input v-model="form.pfren" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="未评分人ID" prop="pfrenid">
          <el-input v-model="form.pfrenid" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="未评分人Id" prop="pfrenids">
          <el-input v-model="form.pfrenids" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="未评分人" prop="pfrens">
          <el-input v-model="form.pfrens" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="对应单位id" prop="comid">
          <el-input v-model="form.comid" placeholder="请输入对应单位id" />
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
import { listHrcheck, getHrcheck, delHrcheck, addHrcheck, updateHrcheck } from "@/api/xinhu-hr/hrcheck";

export default {
  name: "Hrcheck",
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
      // 考核评分表格数据
      hrcheckList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        uid: null,
        title: null,
        applyname: null,
        optdt: null,
        optid: null,
        optname: null,
        applydt: null,
        contents: null,
        status: null,
        isturn: null,
        uname: null,
        month: null,
        content: null,
        fenzp: null,
        fensj: null,
        fenrs: null,
        fen: null,
        khid: null,
        createdt: null,
        startdt: null,
        enddt: null,
        pfren: null,
        pfrenid: null,
        pfrenids: null,
        pfrens: null,
        comid: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        uid: [
          { required: true, message: "用户ID不能为空", trigger: "blur" }
        ],
        title: [
          { required: true, message: "考核名称不能为空", trigger: "blur" },
          { min: 3, max: 100, message: '长度在 3 到 100 个字符', trigger: 'blur' }
        ],
        applyname: [
          { required: true, message: "申请人姓名不能为空", trigger: "blur" },
          { min: 3, max: 30, message: '长度在 3 到 30 个字符', trigger: 'blur' }
        ],
        optdt: [
          { required: true, message: "操作时间不能为空", trigger: "blur" },
          { type: 'date', required: true, message: '请选择操作时间', trigger: 'change' }
        ],
        optid: [
          { required: true, message: "操作人ID不能为空", trigger: "blur" }
        ],
        optname: [
          { required: true, message: "操作人不能为空", trigger: "blur" },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        applydt: [
          { required: true, message: "申请日期不能为空", trigger: "blur" },
          { type: 'date', required: true, message: '请选择申请日期', trigger: 'change' }
        ],
        contents: [
          { required: true, message: "说明不能为空", trigger: "blur" },
          { min: 3, max: 500, message: '长度在 3 到 500 个字符', trigger: 'blur' }
        ],
        status: [
          { required: true, message: "状态不能为空", trigger: "blur" }
        ],
        isturn: [
          { required: true, message: "是否提交不能为空", trigger: "blur" }
        ],
        uname: [
          { required: true, message: "对应人不能为空", trigger: "blur" },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        month: [
          { required: true, message: "月份不能为空", trigger: "blur" },
          { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' }
        ],
        content: [
          { required: true, message: "考核内容不能为空", trigger: "blur" },
          { min: 3, max: 2000, message: '长度在 3 到 2000 个字符', trigger: 'blur' }
        ],
        fenzp: [
          { required: true, message: "自评分数不能为空", trigger: "blur" }
        ],
        fensj: [
          { required: true, message: "上级评分不能为空", trigger: "blur" }
        ],
        fenrs: [
          { required: true, message: "人事评分不能为空", trigger: "blur" }
        ],
        fen: [
          { required: true, message: "最后得分不能为空", trigger: "blur" }
        ],
        khid: [
          { required: true, message: "关联考核项目hrkaohem.id不能为空", trigger: "blur" }
        ],
        createdt: [
          { required: true, message: "创建时间不能为空", trigger: "blur" },
          { type: 'date', required: true, message: '请选择创建时间', trigger: 'change' }
        ],
        startdt: [
          { required: true, message: "评分开始时间不能为空", trigger: "blur" },
          { type: 'date', required: true, message: '请选择评分开始时间', trigger: 'change' }
        ],
        enddt: [
          { required: true, message: "评分截止时间不能为空", trigger: "blur" },
          { type: 'date', required: true, message: '请选择评分截止时间', trigger: 'change' }
        ],
        pfren: [
          { required: true, message: "评分人不能为空", trigger: "blur" },
          { min: 3, max: 500, message: '长度在 3 到 500 个字符', trigger: 'blur' }
        ],
        pfrenid: [
          { required: true, message: "未评分人ID不能为空", trigger: "blur" },
          { min: 3, max: 500, message: '长度在 3 到 500 个字符', trigger: 'blur' }
        ],
        pfrenids: [
          { required: true, message: "未评分人Id不能为空", trigger: "blur" },
         { min: 3, max: 500, message: '长度在 3 到 500 个字符', trigger: 'blur' }
        ],
        pfrens: [
          { required: true, message: "未评分人不能为空", trigger: "blur" },
          { min: 3, max: 500, message: '长度在 3 到 500 个字符', trigger: 'blur' }
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
    /** 状态 */
    stateFormat(row,column) {
      if(row.status === 1) {
        return "良好";
      } else {
        return "一般";
      }
    },
    /** 是否提交 */
    submitFormat(row,column) {
      if(row.isturn == 1) {
        return "已提交";
      } else {
        return "未提交";
      }
    },
    /** 查询考核评分列表 */
    getList() {
      this.loading = true;
      listHrcheck(this.queryParams).then(response => {
        this.hrcheckList = response.rows;
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
        uid: null,
        title: null,
        applyname: null,
        optdt: null,
        optid: null,
        optname: null,
        applydt: null,
        explain: null,
        status: 0,
        isturn: null,
        uname: null,
        month: null,
        content: null,
        fenzp: null,
        fensj: null,
        fenrs: null,
        fen: null,
        khid: null,
        createdt: null,
        startdt: null,
        enddt: null,
        pfren: null,
        pfrenid: null,
        pfrenids: null,
        pfrens: null,
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
      this.title = "添加考核评分";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getHrcheck(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改考核评分";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateHrcheck(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addHrcheck(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除考核评分编号为"' + ids + '"的数据项？').then(function() {
        return delHrcheck(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('xinhu-hr/hrcheck/export', {
        ...this.queryParams
      }, `hrcheck_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
