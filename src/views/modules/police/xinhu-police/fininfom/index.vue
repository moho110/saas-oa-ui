<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="操作人" prop="optname">
        <el-input
          v-model="queryParams.optname"
          placeholder="请输入操作人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="收款人全称" prop="fullname">
        <el-input
          v-model="queryParams.fullname"
          placeholder="请输入收款人全称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="开户行" prop="openbank">
        <el-input
          v-model="queryParams.openbank"
          placeholder="请输入开户行"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="开票名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入开票名称"
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
          v-hasPermi="['xinhu-police:fininfom:add']"
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
          v-hasPermi="['xinhu-police:fininfom:edit']"
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
          v-hasPermi="['xinhu-police:fininfom:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['xinhu-police:fininfom:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="fininfomList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="用户ID" align="center" prop="uid" />
      <el-table-column label="金额" align="center" prop="money" />
      <el-table-column label="大写金额" align="center" prop="moneycn" />
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
      <el-table-column label="开票名称" align="center" prop="name" />
      <el-table-column label="纳税识别号" align="center" prop="shibieid" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['xinhu-police:fininfom:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['xinhu-police:fininfom:remove']"
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

    <!-- 添加或修改费用报销对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="180px">
        <el-form-item label="用户ID" prop="uid">
          <el-input v-model="form.uid" placeholder="请输入用户ID" />
        </el-form-item>
        <el-form-item label="金额" prop="money">
          <el-input v-model="form.money" placeholder="请输入金额" />
        </el-form-item>
        <el-form-item label="大写金额" prop="moneycn">
          <el-input v-model="form.moneycn" placeholder="请输入大写金额" />
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
        <el-form-item label="说明" prop="content">
          <el-input v-model="form.content" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio v-model="form.status" label="1">良好</el-radio>
          <el-radio v-model="form.status" label="0">一般</el-radio>
        </el-form-item>
        <el-form-item label="是否提交" prop="isturn">
          <el-radio v-model="form.isturn" label="1">是</el-radio>
          <el-radio v-model="form.isturn" label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="附单据(张)" prop="bills">
          <el-input v-model="form.bills" placeholder="请输入附单据(张)" />
        </el-form-item>
        <el-form-item label="付款方式" prop="paytype">
          <el-radio v-model="form.paytype" label="1">微信</el-radio>
          <el-radio v-model="form.paytype" label="0">现金</el-radio>
        </el-form-item>
        <el-form-item label="收款人全称" prop="fullname">
          <el-input v-model="form.fullname" placeholder="请输入收款人全称" />
        </el-form-item>
        <el-form-item label="收款帐号" prop="cardid">
          <el-input v-model="form.cardid" placeholder="请输入收款帐号" />
        </el-form-item>
        <el-form-item label="开户行" prop="openbank">
          <el-input v-model="form.openbank" placeholder="请输入开户行" />
        </el-form-item>
        <el-form-item label="用途" prop="purpose">
          <el-input v-model="form.purpose" placeholder="请输入用途" />
        </el-form-item>
        <el-form-item label="用途结果" prop="purresult">
          <el-input v-model="form.purresult" placeholder="请输入用途结果" />
        </el-form-item>
        <el-form-item label="付款日期" prop="paydt">
          <el-date-picker clearable size="small"
            v-model="form.paydt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择付款日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="合同号/订单号" prop="num">
          <el-input v-model="form.num" placeholder="请输入合同号/订单号" />
        </el-form-item>
        <el-form-item label="开票名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入开票名称" />
        </el-form-item>
        <el-form-item label="纳税识别号" prop="shibieid">
          <el-input v-model="form.shibieid" placeholder="请输入纳税识别号" />
        </el-form-item>
        <el-form-item label="公司地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入公司地址" />
        </el-form-item>
        <el-form-item label="电话" prop="tel">
          <el-input v-model="form.tel" placeholder="请输入电话" />
        </el-form-item>
        <el-form-item label="对应客户ID" prop="custid">
          <el-input v-model="form.custid" placeholder="请输入对应客户ID" />
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
import { listFininfom, getFininfom, delFininfom, addFininfom, updateFininfom } from "@/api/xinhu-police/fininfom";

export default {
  name: "Fininfom",
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
      // 费用报销表格数据
      fininfomList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        type: null,
        uid: null,
        money: null,
        moneycn: null,
        optdt: null,
        optid: null,
        optname: null,
        applydt: null,
        content: null,
        status: null,
        isturn: null,
        bills: null,
        paytype: null,
        fullname: null,
        cardid: null,
        openbank: null,
        purpose: null,
        purresult: null,
        paydt: null,
        num: null,
        name: null,
        shibieid: null,
        address: null,
        tel: null,
        custid: null,
        comid: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        type: [
          { required: true, message: "类型@0|报销单,1|出差报销,2|借款单,3|还款单,4|付款申请,5|开票申请不能为空", trigger: "change" }
        ],
        uid: [
          { required: true, message: "用户ID不能为空", trigger: "blur" }
        ],
        money: [
          { required: true, message: "金额不能为空", trigger: "blur" }
        ],
        moneycn: [
          { required: true, message: "大写金额不能为空", trigger: "blur" }
        ],
        optdt: [
          { required: true, message: "操作时间不能为空", trigger: "blur" }
        ],
        optid: [
          { required: true, message: "操作人ID不能为空", trigger: "blur" }
        ],
        optname: [
          { required: true, message: "操作人不能为空", trigger: "blur" }
        ],
        applydt: [
          { required: true, message: "申请日期不能为空", trigger: "blur" }
        ],
        content: [
          { required: true, message: "说明不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "状态不能为空", trigger: "blur" }
        ],
        isturn: [
          { required: true, message: "是否提交不能为空", trigger: "blur" }
        ],
        bills: [
          { required: true, message: "附单据(张)不能为空", trigger: "blur" }
        ],
        paytype: [
          { required: true, message: "付款方式不能为空", trigger: "change" }
        ],
        fullname: [
          { required: true, message: "收款人全称不能为空", trigger: "blur" }
        ],
        cardid: [
          { required: true, message: "收款帐号不能为空", trigger: "blur" }
        ],
        openbank: [
          { required: true, message: "开户行不能为空", trigger: "blur" }
        ],
        purpose: [
          { required: true, message: "用途不能为空", trigger: "blur" }
        ],
        purresult: [
          { required: true, message: "用途结果不能为空", trigger: "blur" }
        ],
        paydt: [
          { required: true, message: "付款日期不能为空", trigger: "blur" }
        ],
        num: [
          { required: true, message: "合同号/订单号不能为空", trigger: "blur" }
        ],
        name: [
          { required: true, message: "开票名称不能为空", trigger: "blur" }
        ],
        shibieid: [
          { required: true, message: "纳税识别号不能为空", trigger: "blur" }
        ],
        address: [
          { required: true, message: "公司地址不能为空", trigger: "blur" }
        ],
        tel: [
          { required: true, message: "电话不能为空", trigger: "blur" }
        ],
        custid: [
          { required: true, message: "对应客户ID不能为空", trigger: "blur" }
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
    /** 查询费用报销列表 */
    getList() {
      this.loading = true;
      listFininfom(this.queryParams).then(response => {
        this.fininfomList = response.rows;
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
        type: null,
        uid: null,
        money: null,
        moneycn: null,
        optdt: null,
        optid: null,
        optname: null,
        applydt: null,
        content: null,
        status: 0,
        isturn: null,
        bills: null,
        paytype: null,
        fullname: null,
        cardid: null,
        openbank: null,
        purpose: null,
        purresult: null,
        paydt: null,
        num: null,
        name: null,
        shibieid: null,
        address: null,
        tel: null,
        custid: null,
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
      this.title = "添加费用报销";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getFininfom(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改费用报销";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateFininfom(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addFininfom(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除费用报销编号为"' + ids + '"的数据项？').then(function() {
        return delFininfom(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('xinhu-police/fininfom/export', {
        ...this.queryParams
      }, `fininfom_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
