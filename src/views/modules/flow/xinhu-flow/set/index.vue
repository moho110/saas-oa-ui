<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="模块名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入模块名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="模块编号" prop="num">
        <el-input
          v-model="queryParams.num"
          placeholder="请输入模块编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="编号规则" prop="sericnum">
        <el-input
          v-model="queryParams.sericnum"
          placeholder="请输入编号规则"
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
          v-hasPermi="['xinhu-flow:set:add']"
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
          v-hasPermi="['xinhu-flow:set:edit']"
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
          v-hasPermi="['xinhu-flow:set:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['xinhu-flow:set:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="setList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="模块名称" align="center" prop="name" />
      <el-table-column label="模块编号" align="center" prop="num" />
      <el-table-column label="对应的表" align="center" prop="ttable" />
      <el-table-column label="相关条件" align="center" prop="wheres" />
      <el-table-column label="针对对象" align="center" prop="recename" />
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
            v-hasPermi="['xinhu-flow:set:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['xinhu-flow:set:remove']"
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

    <!-- 添加或修改流程模块对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="180px">
        <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="基本信息" name="first">
        <el-form-item label="模块名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入模块名称" />
        </el-form-item>
        <el-form-item label="模块编号" prop="num">
          <el-input v-model="form.num" placeholder="请输入模块编号" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="form.sort" :min="1" :max="999" label="描述文字"></el-input-number>
        </el-form-item>
        <el-form-item label="对应的表" prop="ttable">
          <el-input v-model="form.ttable" placeholder="请输入对应的表" />
        </el-form-item>
        <el-form-item label="相关条件" prop="wheres">
          <el-input v-model="form.wheres" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="摘要" prop="summary">
          <el-input v-model="form.summary" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="应用摘要" prop="summarx">
          <el-input v-model="form.summarx" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="类型" prop="types">
          <el-input v-model="form.types" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="pc端提醒" prop="pctx">
          <el-radio v-model="form.pctx" label="1">是</el-radio>
          <el-radio v-model="form.pctx" label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="app提醒" prop="mctx">
          <el-radio v-model="form.mctx" label="1">是</el-radio>
          <el-radio v-model="form.mctx" label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="微信提醒" prop="wxtx">
          <el-radio v-model="form.wxtx" label="1">是</el-radio>
          <el-radio v-model="form.wxtx" label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="是否邮件提醒" prop="emtx">
          <el-radio v-model="form.emtx" label="1">是</el-radio>
          <el-radio v-model="form.emtx" label="0">否</el-radio>
        </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="配置管理" name="second">
        <el-form-item label="编号规则" prop="sericnum">
          <el-input v-model="form.sericnum" placeholder="请输入编号规则" />
        </el-form-item>
        <el-form-item label="是否有流程" prop="isflow">
          <el-radio v-model="form.isflow" label="1">是</el-radio>
          <el-radio v-model="form.isflow" label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="针对对象ID" prop="receid">
          <el-input v-model="form.receid" placeholder="请输入针对对象ID" />
        </el-form-item>
        <el-form-item label="针对对象" prop="recename">
          <el-input v-model="form.recename" placeholder="请输入针对对象" />
        </el-form-item>
        <el-form-item label="操作时间" prop="optdt">
          <el-date-picker clearable size="small"
            v-model="form.optdt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择操作时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="是否可录入" prop="islu">
          <el-radio v-model="form.islu" label="1">是</el-radio>
          <el-radio v-model="form.islu" label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="多行子表" prop="tables">
          <el-input v-model="form.tables" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="多行子表名称" prop="names">
          <el-input v-model="form.names" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="状态管理" name="third">
        <el-form-item label="状态值设置" prop="statusstr">
          <el-input v-model="form.statusstr" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="是否关闭操作记录" prop="isgbjl">
          <el-radio v-model="form.isgbjl" label="1">是</el-radio>
          <el-radio v-model="form.isgbjl" label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="是否不显示查阅记录" prop="isgbcy">
          <el-radio v-model="form.isgbcy" label="1">是</el-radio>
          <el-radio v-model="form.isgbcy" label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="是否生成列表页" prop="isscl">
          <el-radio v-model="form.isscl" label="1">是</el-radio>
          <el-radio v-model="form.isscl" label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="更新时是否同步" prop="isup">
          <el-radio v-model="form.isup" label="1">是</el-radio>
          <el-radio v-model="form.isup" label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="是否钉钉提醒" prop="ddtx">
          <el-radio v-model="form.ddtx" label="1">是</el-radio>
          <el-radio v-model="form.ddtx" label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="录入页面是否不显示流程图" prop="isbxs">
          <el-radio v-model="form.isbxs" label="1">是</el-radio>
          <el-radio v-model="form.isbxs" label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="列表页状态搜索显示0默认,1必须显示,2显示" prop="lbztxs">
          <el-radio v-model="form.lbztxs" label="0">默认</el-radio>
          <el-radio v-model="form.lbztxs" label="1">必须显示</el-radio>
          <el-radio v-model="form.lbztxs" label="2">显示</el-radio>
        </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="其他任务" name="fourth">
        <el-form-item label="从新提交时0默认，1从新走流程" prop="isflowlx">
          <el-input v-model="form.isflowlx" placeholder="请输入从新提交时0默认，1从新走流程" />
        </el-form-item>
        <el-form-item label="是否自定义抄送" prop="iscs">
          <el-radio v-model="form.iscs" label="1">是</el-radio>
          <el-radio v-model="form.iscs" label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="超过分钟自动作废" prop="zfeitime">
          <el-input v-model="form.zfeitime" placeholder="请输入超过分钟自动作废" />
        </el-form-item>
        <el-form-item label="是否开启评论" prop="ispl">
          <el-radio v-model="form.ispl" label="1">是</el-radio>
          <el-radio v-model="form.ispl" label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="是否开启单据提醒设置" prop="istxset">
          <el-radio v-model="form.istxset" label="1">是</el-radio>
          <el-radio v-model="form.istxset" label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="回执确认0不开启,1必须选择,2可选" prop="ishz">
          <el-radio v-model="form.ishz" label="0">不开启</el-radio>
          <el-radio v-model="form.ishz" label="1">必须选择</el-radio>
          <el-radio v-model="form.ishz" label="2">可选</el-radio>
        </el-form-item>
        <el-form-item label="是否支持多模版" prop="istpl">
          <el-radio v-model="form.istpl" label="1">是</el-radio>
          <el-radio v-model="form.istpl" label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="默认排序" prop="sortdir">
          <el-input v-model="form.sortdir" placeholder="请输入默认排序" />
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
import { listSet, getSet, delSet, addSet, updateSet } from "@/api/xinhu-flow/set";

export default {
  name: "Set",
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
      // 流程模块表格数据
      setList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: null,
        num: null,
        sort: null,
        ttable: null,
        wheres: null,
        summary: null,
        summarx: null,
        types: null,
        pctx: null,
        mctx: null,
        wxtx: null,
        emtx: null,
        sericnum: null,
        isflow: null,
        receid: null,
        recename: null,
        optdt: null,
        status: null,
        islu: null,
        tables: null,
        names: null,
        statusstr: null,
        isgbjl: null,
        isgbcy: null,
        isscl: null,
        isup: null,
        ddtx: null,
        isbxs: null,
        lbztxs: null,
        isflowlx: null,
        iscs: null,
        zfeitime: null,
        ispl: null,
        istxset: null,
        ishz: null,
        istpl: null,
        sortdir: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [
          { required: true, message: "模块名称不能为空", trigger: "blur" },
          { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' }
        ],
        num: [
          { required: true, message: "模块编号不能为空", trigger: "blur" },
          { min: 3, max: 30, message: '长度在 3 到 30 个字符', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: "排序不能为空", trigger: "blur" }
        ],
        ttable: [
          { required: true, message: "对应的表不能为空", trigger: "blur" },
          { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' }
        ],
        wheres: [
          { required: true, message: "相关条件不能为空", trigger: "blur" },
          { min: 10, max: 500, message: '长度在 10 到 500 个字符', trigger: 'blur' }
        ],
        summary: [
          { required: true, message: "摘要不能为空", trigger: "blur" },
          { min: 10, max: 500, message: '长度在 10 到 500 个字符', trigger: 'blur' }
        ],
        summarx: [
          { required: true, message: "应用摘要不能为空", trigger: "blur" },
          { min: 10, max: 500, message: '长度在 10 到 500 个字符', trigger: 'blur' }
        ],
        types: [
          { required: true, message: "分类不能为空", trigger: "change" },
          { min: 10, max: 20, message: '长度在 10 到 20 个字符', trigger: 'blur' }
        ],
        pctx: [
          { required: true, message: "pc端提醒不能为空", trigger: "blur" }
        ],
        mctx: [
          { required: true, message: "app提醒不能为空", trigger: "blur" }
        ],
        wxtx: [
          { required: true, message: "微信提醒不能为空", trigger: "blur" }
        ],
        emtx: [
          { required: true, message: "是否邮件提醒不能为空", trigger: "blur" }
        ],
        sericnum: [
          { required: true, message: "编号规则不能为空", trigger: "blur" },
          { min: 10, max: 50, message: '长度在 10 到 50 个字符', trigger: 'blur' }
        ],
        isflow: [
          { required: true, message: "是否有流程不能为空", trigger: "blur" }
        ],
        receid: [
          { required: true, message: "$comment不能为空", trigger: "blur" }
        ],
        recename: [
          { required: true, message: "针对对象不能为空", trigger: "blur" },
          { min: 10, max: 255, message: '长度在 10 到 255 个字符', trigger: 'blur' }
        ],
        optdt: [
          { required: true, message: "操作时间不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "$comment不能为空", trigger: "blur" }
        ],
        islu: [
          { required: true, message: "是否可录入不能为空", trigger: "blur" }
        ],
        tables: [
          { required: true, message: "多行子表不能为空", trigger: "blur" },
          { min: 10, max: 255, message: '长度在 10 到 255 个字符', trigger: 'blur' }
        ],
        names: [
          { required: true, message: "多行子表名称不能为空", trigger: "blur" },
          { min: 10, max: 255, message: '长度在 10 到 255 个字符', trigger: 'blur' }
        ],
        statusstr: [
          { required: true, message: "状态值设置不能为空", trigger: "blur" },
          { min: 10, max: 255, message: '长度在 10 到 255 个字符', trigger: 'blur' }
        ],
        isgbjl: [
          { required: true, message: "是否关闭操作记录不能为空", trigger: "blur" }
        ],
        isgbcy: [
          { required: true, message: "是否不显示查阅记录不能为空", trigger: "blur" }
        ],
        isscl: [
          { required: true, message: "是否生成列表页不能为空", trigger: "blur" }
        ],
        isup: [
          { required: true, message: "更新时是否同步不能为空", trigger: "blur" }
        ],
        ddtx: [
          { required: true, message: "是否钉钉提醒不能为空", trigger: "blur" }
        ],
        isbxs: [
          { required: true, message: "录入页面是否不显示流程图不能为空", trigger: "blur" }
        ],
        lbztxs: [
          { required: true, message: "列表页状态搜索显示0默认,1必须显示,2显示不能为空", trigger: "blur" }
        ],
        isflowlx: [
          { required: true, message: "从新提交时0默认，1从新走流程不能为空", trigger: "blur" }
        ],
        iscs: [
          { required: true, message: "是否自定义抄送不能为空", trigger: "blur" }
        ],
        zfeitime: [
          { required: true, message: "超过分钟自动作废不能为空", trigger: "blur" }
        ],
        ispl: [
          { required: true, message: "是否开启评论不能为空", trigger: "blur" }
        ],
        istxset: [
          { required: true, message: "是否开启单据提醒设置不能为空", trigger: "blur" }
        ],
        ishz: [
          { required: true, message: "回执确认0不开启,1必须选择,2可选不能为空", trigger: "blur" }
        ],
        istpl: [
          { required: true, message: "是否支持多模版不能为空", trigger: "blur" }
        ],
        sortdir: [
          { required: true, message: "默认排序不能为空", trigger: "blur" },
          { min: 10, max: 50, message: '长度在 10 到 50 个字符', trigger: 'blur' }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询流程模块列表 */
    getList() {
      this.loading = true;
      listSet(this.queryParams).then(response => {
        this.setList = response.rows;
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
        name: null,
        num: null,
        sort: null,
        table: null,
        where: null,
        summary: null,
        summarx: null,
        type: null,
        pctx: null,
        mctx: null,
        wxtx: null,
        emtx: null,
        sericnum: null,
        isflow: null,
        receid: null,
        recename: null,
        optdt: null,
        status: 0,
        islu: null,
        tables: null,
        names: null,
        statusstr: null,
        isgbjl: null,
        isgbcy: null,
        isscl: null,
        isup: null,
        ddtx: null,
        isbxs: null,
        lbztxs: null,
        isflowlx: null,
        iscs: null,
        zfeitime: null,
        ispl: null,
        istxset: null,
        ishz: null,
        istpl: null,
        sortdir: null
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
      this.title = "添加流程模块";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getSet(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改流程模块";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateSet(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addSet(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除流程模块编号为"' + ids + '"的数据项？').then(function() {
        return delSet(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('xinhu-flow/set/export', {
        ...this.queryParams
      }, `set_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
