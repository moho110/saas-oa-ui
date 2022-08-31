<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="模块名称" prop="modename">
        <el-input
          v-model="queryParams.modename"
          placeholder="请输入模块名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="申请人姓名" prop="uname">
        <el-input
          v-model="queryParams.uname"
          placeholder="请输入申请人姓名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="申请人部门" prop="udeptname">
        <el-input
          v-model="queryParams.udeptname"
          placeholder="请输入申请人部门"
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
          v-hasPermi="['xinhu-police:bill:add']"
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
          v-hasPermi="['xinhu-police:bill:edit']"
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
          v-hasPermi="['xinhu-police:bill:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['xinhu-police:bill:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="billList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="单号" align="center" prop="sericnum" />
      <el-table-column label="对应表" align="center" prop="table" />
      <el-table-column label="模块名称" align="center" prop="modename" />
      <el-table-column label="申请人姓名" align="center" prop="uname" />
      <el-table-column label="申请人部门" align="center" prop="udeptname" />
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
            v-hasPermi="['xinhu-police:bill:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['xinhu-police:bill:remove']"
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

    <!-- 添加或修改流程单据对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="180px">
        <el-form-item label="单号" prop="sericnum">
          <el-input v-model="form.sericnum" placeholder="请输入单号" />
        </el-form-item>
        <el-form-item label="对应表" prop="tables">
          <el-input v-model="form.tables" placeholder="请输入对应表" />
        </el-form-item>
        <el-form-item label="主id" prop="mid">
          <el-input v-model="form.mid" placeholder="请输入主id" />
        </el-form-item>
        <el-form-item label="模块id" prop="modeid">
          <el-input v-model="form.modeid" placeholder="请输入模块id" />
        </el-form-item>
        <el-form-item label="模块名称" prop="modename">
          <el-input v-model="form.modename" placeholder="请输入模块名称" />
        </el-form-item>
        <el-form-item label="申请人姓名" prop="uname">
          <el-input v-model="form.uname" placeholder="请输入申请人姓名" />
        </el-form-item>
        <el-form-item label="用户id" prop="uid">
          <el-input v-model="form.uid" placeholder="请输入用户id" />
        </el-form-item>
        <el-form-item label="部门0为主部门" prop="udeptid">
          <el-input v-model="form.udeptid" placeholder="请输入部门0为主部门" />
        </el-form-item>
        <el-form-item label="申请人部门" prop="udeptname">
          <el-input v-model="form.udeptname" placeholder="请输入申请人部门" />
        </el-form-item>
        <el-form-item label="操作时间" prop="optdt">
          <el-date-picker clearable size="small"
            v-model="form.optdt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择操作时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="操作人Id" prop="optid">
          <el-input v-model="form.optid" placeholder="请输入操作人Id" />
        </el-form-item>
        <el-form-item label="操作人" prop="optname">
          <el-input v-model="form.optname" placeholder="请输入操作人" />
        </el-form-item>
        <el-form-item label="@所有审核人" prop="allcheckid">
          <el-input v-model="form.allcheckid" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="是否删除" prop="isdel">
          <el-input v-model="form.isdel" placeholder="请输入是否删除" />
        </el-form-item>
        <el-form-item label="当前状态值" prop="nstatus">
          <el-radio v-model="form.nstatus" label="1">良好</el-radio>
          <el-radio v-model="form.nstatus" label="0">一般</el-radio>
        </el-form-item>
        <el-form-item label="申请日期" prop="applydt">
          <el-date-picker clearable size="small"
            v-model="form.applydt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择申请日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="当前状态" prop="nstatustext">
          <el-input v-model="form.nstatustext" placeholder="请输入当前状态" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio v-model="form.status" label="1">良好</el-radio>
          <el-radio v-model="form.status" label="0">一般</el-radio>
        </el-form-item>
        <el-form-item label="当前步骤Id" prop="nowcourseid">
          <el-input v-model="form.nowcourseid" placeholder="请输入当前步骤Id" />
        </el-form-item>
        <el-form-item label="当前审核人id" prop="nowcheckid">
          <el-input v-model="form.nowcheckid" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="当前审核人" prop="nowcheckname">
          <el-input v-model="form.nowcheckname" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="最后审核说明" prop="checksm">
          <el-input v-model="form.checksm" placeholder="请输入最后审核说明" />
        </el-form-item>
        <el-form-item label="最后更新时间" prop="updt">
          <el-date-picker clearable size="small"
            v-model="form.updt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择最后更新时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="创建时间" prop="createdt">
          <el-date-picker clearable size="small"
            v-model="form.createdt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择创建时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="退回flow_log.Id" prop="tuiid">
          <el-input v-model="form.tuiid" placeholder="请输入退回flow_log.Id" />
        </el-form-item>
        <el-form-item label="是否已提交了" prop="isturn">
          <el-radio v-model="form.isturn" label="1">是</el-radio>
          <el-radio v-model="form.isturn" label="0">否</el-radio>
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
import { listBill, getBill, delBill, addBill, updateBill } from "@/api/xinhu-police/bill";

export default {
  name: "Bill",
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
      // 流程单据表格数据
      billList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        sericnum: null,
        tables: null,
        mid: null,
        modeid: null,
        modename: null,
        uname: null,
        uid: null,
        udeptid: null,
        udeptname: null,
        optdt: null,
        optid: null,
        optname: null,
        allcheckid: null,
        isdel: null,
        nstatus: null,
        applydt: null,
        nstatustext: null,
        status: null,
        nowcourseid: null,
        nowcheckid: null,
        nowcheckname: null,
        checksm: null,
        updt: null,
        createdt: null,
        tuiid: null,
        isturn: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        sericnum: [
          { required: true, message: "单号不能为空", trigger: "blur" }
        ],
        table: [
          { required: true, message: "对应表不能为空", trigger: "blur" }
        ],
        mid: [
          { required: true, message: "主id不能为空", trigger: "blur" }
        ],
        modeid: [
          { required: true, message: "模块id不能为空", trigger: "blur" }
        ],
        modename: [
          { required: true, message: "模块名称不能为空", trigger: "blur" }
        ],
        uname: [
          { required: true, message: "申请人姓名不能为空", trigger: "blur" }
        ],
        uid: [
          { required: true, message: "用户id不能为空", trigger: "blur" }
        ],
        udeptid: [
          { required: true, message: "部门0为主部门不能为空", trigger: "blur" }
        ],
        udeptname: [
          { required: true, message: "申请人部门不能为空", trigger: "blur" }
        ],
        optdt: [
          { required: true, message: "操作时间不能为空", trigger: "blur" }
        ],
        optid: [
          { required: true, message: "操作人Id不能为空", trigger: "blur" }
        ],
        optname: [
          { required: true, message: "操作人不能为空", trigger: "blur" }
        ],
        allcheckid: [
          { required: true, message: "@所有审核人不能为空", trigger: "blur" }
        ],
        isdel: [
          { required: true, message: "是否删除不能为空", trigger: "blur" }
        ],
        nstatus: [
          { required: true, message: "当前状态值不能为空", trigger: "blur" }
        ],
        applydt: [
          { required: true, message: "申请日期不能为空", trigger: "blur" }
        ],
        nstatustext: [
          { required: true, message: "当前状态不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "状态不能为空", trigger: "blur" }
        ],
        nowcourseid: [
          { required: true, message: "当前步骤Id不能为空", trigger: "blur" }
        ],
        nowcheckid: [
          { required: true, message: "当前审核人id不能为空", trigger: "blur" }
        ],
        nowcheckname: [
          { required: true, message: "当前审核人不能为空", trigger: "blur" }
        ],
        checksm: [
          { required: true, message: "最后审核说明不能为空", trigger: "blur" }
        ],
        updt: [
          { required: true, message: "最后更新时间不能为空", trigger: "blur" }
        ],
        createdt: [
          { required: true, message: "创建时间不能为空", trigger: "blur" }
        ],
        tuiid: [
          { required: true, message: "退回flow_log.Id不能为空", trigger: "blur" }
        ],
        isturn: [
          { required: true, message: "是否已提交了不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询流程单据列表 */
    getList() {
      this.loading = true;
      listBill(this.queryParams).then(response => {
        this.billList = response.rows;
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
        sericnum: null,
        table: null,
        mid: null,
        modeid: null,
        modename: null,
        uname: null,
        uid: null,
        udeptid: null,
        udeptname: null,
        optdt: null,
        optid: null,
        optname: null,
        allcheckid: null,
        isdel: null,
        nstatus: 0,
        applydt: null,
        nstatustext: null,
        status: 0,
        nowcourseid: null,
        nowcheckid: null,
        nowcheckname: null,
        checksm: null,
        updt: null,
        createdt: null,
        tuiid: null,
        isturn: null
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
      this.title = "添加流程单据";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getBill(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改流程单据";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateBill(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addBill(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除流程单据编号为"' + ids + '"的数据项？').then(function() {
        return delBill(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('xinhu-police/bill/export', {
        ...this.queryParams
      }, `bill_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
