<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      
      <el-form-item label="客户名称" prop="custname">
        <el-input
          v-model="queryParams.custname"
          placeholder="请输入客户名称"
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
      <el-form-item label="创建人" prop="createname">
        <el-input
          v-model="queryParams.createname"
          placeholder="请输入创建人"
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
          v-hasPermi="['xinhu-finance:custfina:add']"
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
          v-hasPermi="['xinhu-finance:custfina:edit']"
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
          v-hasPermi="['xinhu-finance:custfina:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['xinhu-finance:custfina:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="custfinaList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="合同ID" align="center" prop="htid" />
      <el-table-column label="合同数" align="center" prop="htnum" />
      <el-table-column label="所属日期" align="center" prop="dt" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.dt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="客户名称" align="center" prop="custname" />
      <el-table-column label="操作时间" align="center" prop="optdt" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.optdt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作人" align="center" prop="optname" />
      <el-table-column label="收付款时间" align="center" prop="paydt" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.paydt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建人" align="center" prop="createname" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['xinhu-finance:custfina:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['xinhu-finance:custfina:remove']"
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

    <!-- 添加或修改客户收付款对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="180px">
        <el-form-item label="合同ID" prop="htid">
          <el-input v-model="form.htid" placeholder="请输入合同ID" />
        </el-form-item>
        <el-form-item label="合同数" prop="htnum">
          <el-input v-model="form.htnum" placeholder="请输入合同数" />
        </el-form-item>
        <el-form-item label="所属日期" prop="dt">
          <el-date-picker clearable size="small"
            v-model="form.dt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择所属日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="用户ID" prop="uid">
          <el-input v-model="form.uid" placeholder="请输入用户ID" />
        </el-form-item>
        <el-form-item label="客户ID" prop="custid">
          <el-input v-model="form.custid" placeholder="请输入客户ID" />
        </el-form-item>
        <el-form-item label="客户名称" prop="custname">
          <el-input v-model="form.custname" placeholder="请输入客户名称" />
        </el-form-item>
        <el-form-item label="操作时间" prop="optdt">
          <el-date-picker clearable size="small"
            v-model="form.optdt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择操作时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="操作人" prop="optname">
          <el-input v-model="form.optname" placeholder="请输入操作人" />
        </el-form-item>
        <el-form-item label="金额" prop="money">
          <el-input v-model="form.money" placeholder="请输入金额" />
        </el-form-item>
        <el-form-item label="是否收款,付款" prop="ispay">
          <el-radio v-model="form.ispay" label="1">已收款</el-radio>
          <el-radio v-model="form.ispay" label="0">未收款</el-radio>
        </el-form-item>
        <el-form-item label="收付款时间" prop="paydt">
          <el-date-picker clearable size="small"
            v-model="form.paydt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择收付款时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="说明" prop="content">
          <el-input v-model="form.content" placeholder="请输入说明" />
        </el-form-item>
        <el-form-item label="创建时间" prop="createdt">
          <el-date-picker clearable size="small"
            v-model="form.createdt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择创建时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="创建人" prop="createname">
          <el-input v-model="form.createname" placeholder="请输入创建人" />
        </el-form-item>
        <el-form-item label="创建人ID" prop="createid">
          <el-input v-model="form.createid" placeholder="请输入创建人ID" />
        </el-form-item>
        <el-form-item label="是否转移的" prop="ismove">
          <el-radio v-model="form.ismove" label="1">已收款</el-radio>
          <el-radio v-model="form.ismove" label="0">未收款</el-radio>
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
import { listCustfina, getCustfina, delCustfina, addCustfina, updateCustfina } from "@/api/xinhu-finance/custfina";

export default {
  name: "Custfina",
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
      // 客户收付款表格数据
      custfinaList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        htid: null,
        htnum: null,
        dt: null,
        uid: null,
        custid: null,
        custname: null,
        optdt: null,
        optname: null,
        money: null,
        type: null,
        ispay: null,
        paydt: null,
        content: null,
        createdt: null,
        createname: null,
        createid: null,
        ismove: null,
        comid: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        htid: [
          { required: true, message: "合同ID不能为空", trigger: "blur" }
        ],
        htnum: [
          { required: true, message: "合同数不能为空", trigger: "blur" }
        ],
        dt: [
          { required: true, message: "所属日期不能为空", trigger: "blur" }
        ],
        uid: [
          { required: true, message: "用户ID不能为空", trigger: "blur" }
        ],
        custid: [
          { required: true, message: "客户ID不能为空", trigger: "blur" }
        ],
        custname: [
          { required: true, message: "客户名称不能为空", trigger: "blur" }
        ],
        optdt: [
          { required: true, message: "操作时间不能为空", trigger: "blur" }
        ],
        optname: [
          { required: true, message: "操作人不能为空", trigger: "blur" }
        ],
        money: [
          { required: true, message: "金额不能为空", trigger: "blur" }
        ],
        type: [
          { required: true, message: "0收款单,1付款单不能为空", trigger: "change" }
        ],
        ispay: [
          { required: true, message: "是否收款,付款不能为空", trigger: "blur" }
        ],
        paydt: [
          { required: true, message: "收付款时间不能为空", trigger: "blur" }
        ],
        content: [
          { required: true, message: "说明不能为空", trigger: "blur" }
        ],
        createdt: [
          { required: true, message: "创建时间不能为空", trigger: "blur" }
        ],
        createname: [
          { required: true, message: "创建人不能为空", trigger: "blur" }
        ],
        createid: [
          { required: true, message: "创建人ID不能为空", trigger: "blur" }
        ],
        ismove: [
          { required: true, message: "是否转移的不能为空", trigger: "blur" }
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
    /** 查询客户收付款列表 */
    getList() {
      this.loading = true;
      listCustfina(this.queryParams).then(response => {
        this.custfinaList = response.rows;
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
        htid: null,
        htnum: null,
        dt: null,
        uid: null,
        custid: null,
        custname: null,
        optdt: null,
        optname: null,
        money: null,
        type: null,
        ispay: null,
        paydt: null,
        content: null,
        createdt: null,
        createname: null,
        createid: null,
        ismove: null,
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
      this.title = "添加客户收付款";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getCustfina(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改客户收付款";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateCustfina(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addCustfina(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除客户收付款编号为"' + ids + '"的数据项？').then(function() {
        return delCustfina(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('xinhu-finance/custfina/export', {
        ...this.queryParams
      }, `custfina_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
