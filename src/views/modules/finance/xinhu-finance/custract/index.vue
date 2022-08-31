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
      <el-form-item label="客户名称" prop="custname">
        <el-input
          v-model="queryParams.custname"
          placeholder="请输入客户名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="客户联系人" prop="linkman">
        <el-input
          v-model="queryParams.linkman"
          placeholder="请输入客户联系人"
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
          v-hasPermi="['xinhu-finance:custract:add']"
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
          v-hasPermi="['xinhu-finance:custract:edit']"
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
          v-hasPermi="['xinhu-finance:custract:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['xinhu-finance:custract:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="custractList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
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
      <el-table-column label="客户名称" align="center" prop="custname" />
      <el-table-column label="客户联系人" align="center" prop="linkman" />
      <el-table-column label="合同金额" align="center" prop="money" />
      <el-table-column label="生效日期" align="center" prop="startdt" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.startdt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['xinhu-finance:custract:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['xinhu-finance:custract:remove']"
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

    <!-- 添加或修改客户合同对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="180px">
        <el-form-item label="用户ID" prop="uid">
          <el-input v-model="form.uid" placeholder="请输入用户ID" />
        </el-form-item>
        <el-form-item label="合同编号" prop="num">
          <el-input v-model="form.num" placeholder="请输入合同编号" />
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
        <el-form-item label="状态" prop="status">
          <el-radio v-model="form.status" label="1">良好</el-radio>
          <el-radio v-model="form.status" label="0">一般</el-radio>
        </el-form-item>
        <el-form-item label="客户ID" prop="custid">
          <el-input v-model="form.custid" placeholder="请输入客户ID" />
        </el-form-item>
        <el-form-item label="客户名称" prop="custname">
          <el-input v-model="form.custname" placeholder="请输入客户名称" />
        </el-form-item>
        <el-form-item label="客户联系人" prop="linkman">
          <el-input v-model="form.linkman" placeholder="请输入客户联系人" />
        </el-form-item>
        <el-form-item label="合同金额" prop="money">
          <el-input v-model="form.money" placeholder="请输入合同金额" />
        </el-form-item>
        <el-form-item label="待收金额" prop="moneys">
          <el-input v-model="form.moneys" placeholder="请输入待收金额" />
        </el-form-item>
        <el-form-item label="生效日期" prop="startdt">
          <el-date-picker clearable size="small"
            v-model="form.startdt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择生效日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="截止日期" prop="enddt">
          <el-date-picker clearable size="small"
            v-model="form.enddt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择截止日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="合同内容">
          <editor v-model="form.content" :min-height="192"/>
        </el-form-item>
        <el-form-item label="销售机会Id" prop="saleid">
          <el-input v-model="form.saleid" placeholder="请输入销售机会Id" />
        </el-form-item>
        <el-form-item label="是否提交" prop="isturn">
          <el-radio v-model="form.isturn" label="1">已提交</el-radio>
          <el-radio v-model="form.isturn" label="0">未提交</el-radio>
        </el-form-item>
        <el-form-item label="签约日期" prop="signdt">
          <el-date-picker clearable size="small"
            v-model="form.signdt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择签约日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="类型" prop="types">
          <el-radio v-model="form.types" label="1">付款合同</el-radio>
          <el-radio v-model="form.types" label="0">收款合同</el-radio>
        </el-form-item>
        <el-form-item label="0待,1已完成,2部分" prop="ispay">
          <el-radio v-model="form.ispay" label="0">待完成</el-radio>
          <el-radio v-model="form.ispay" label="1">已完成</el-radio>
          <el-radio v-model="form.ispay" label="2">部分</el-radio>
        </el-form-item>
        <el-form-item label="是否已全部创建收付款单" prop="isover">
          <el-radio v-model="form.isover" label="1">已完成</el-radio>
          <el-radio v-model="form.isover" label="0">未完成</el-radio>
        </el-form-item>
        <el-form-item label="创建人" prop="createname">
          <el-input v-model="form.createname" placeholder="请输入创建人" />
        </el-form-item>
        <el-form-item label="创建人ID" prop="createid">
          <el-input v-model="form.createid" placeholder="请输入创建人ID" />
        </el-form-item>
        <el-form-item label="对应销售goodm.id" prop="xiaoid">
          <el-input v-model="form.xiaoid" placeholder="请输入对应销售goodm.id" />
        </el-form-item>
        <el-form-item label="对应单位id" prop="comid">
          <el-input v-model="form.comid" placeholder="请输入对应单位id" />
        </el-form-item>
        <el-form-item label="合同分类" prop="fenlei">
          <el-input v-model="form.fenlei" placeholder="请输入合同分类" />
        </el-form-item>
        <el-form-item label="合同文件" prop="htfileid">
          <el-input v-model="form.htfileid" placeholder="请输入合同文件" />
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
import { listCustract, getCustract, delCustract, addCustract, updateCustract } from "@/api/xinhu-finance/custract";

export default {
  name: "Custract",
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
      // 客户合同表格数据
      custractList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        uid: null,
        num: null,
        optdt: null,
        optname: null,
        applydt: null,
        contents: null,
        status: null,
        custid: null,
        custname: null,
        linkman: null,
        money: null,
        moneys: null,
        startdt: null,
        enddt: null,
        content: null,
        saleid: null,
        isturn: null,
        signdt: null,
        type: null,
        ispay: null,
        isover: null,
        createname: null,
        createid: null,
        xiaoid: null,
        comid: null,
        fenlei: null,
        htfileid: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        uid: [
          { required: true, message: "用户ID不能为空", trigger: "blur" }
        ],
        num: [
          { required: true, message: "合同编号不能为空", trigger: "blur" }
        ],
        optdt: [
          { required: true, message: "操作时间不能为空", trigger: "blur" }
        ],
        optname: [
          { required: true, message: "操作人不能为空", trigger: "blur" }
        ],
        applydt: [
          { required: true, message: "申请日期不能为空", trigger: "blur" }
        ],
        explain: [
          { required: true, message: "说明不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "状态不能为空", trigger: "blur" }
        ],
        custid: [
          { required: true, message: "客户ID不能为空", trigger: "blur" }
        ],
        custname: [
          { required: true, message: "客户名称不能为空", trigger: "blur" }
        ],
        linkman: [
          { required: true, message: "客户联系人不能为空", trigger: "blur" }
        ],
        money: [
          { required: true, message: "合同金额不能为空", trigger: "blur" }
        ],
        moneys: [
          { required: true, message: "待收金额不能为空", trigger: "blur" }
        ],
        startdt: [
          { required: true, message: "生效日期不能为空", trigger: "blur" }
        ],
        enddt: [
          { required: true, message: "截止日期不能为空", trigger: "blur" }
        ],
        content: [
          { required: true, message: "合同内容不能为空", trigger: "blur" }
        ],
        saleid: [
          { required: true, message: "销售机会Id不能为空", trigger: "blur" }
        ],
        isturn: [
          { required: true, message: "是否提交不能为空", trigger: "blur" }
        ],
        signdt: [
          { required: true, message: "签约日期不能为空", trigger: "blur" }
        ],
        type: [
          { required: true, message: "0收款合同，1付款合同不能为空", trigger: "change" }
        ],
        ispay: [
          { required: true, message: "0待,1已完成,2部分不能为空", trigger: "blur" }
        ],
        isover: [
          { required: true, message: "是否已全部创建收付款单不能为空", trigger: "blur" }
        ],
        createname: [
          { required: true, message: "创建人不能为空", trigger: "blur" }
        ],
        createid: [
          { required: true, message: "创建人ID不能为空", trigger: "blur" }
        ],
        xiaoid: [
          { required: true, message: "对应销售goodm.id不能为空", trigger: "blur" }
        ],
        comid: [
          { required: true, message: "对应单位id不能为空", trigger: "blur" }
        ],
        fenlei: [
          { required: true, message: "合同分类不能为空", trigger: "blur" }
        ],
        htfileid: [
          { required: true, message: "合同文件不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询客户合同列表 */
    getList() {
      this.loading = true;
      listCustract(this.queryParams).then(response => {
        this.custractList = response.rows;
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
        num: null,
        optdt: null,
        optname: null,
        applydt: null,
        contents: null,
        status: 0,
        custid: null,
        custname: null,
        linkman: null,
        money: null,
        moneys: null,
        startdt: null,
        enddt: null,
        content: null,
        saleid: null,
        isturn: null,
        signdt: null,
        type: null,
        ispay: null,
        isover: null,
        createname: null,
        createid: null,
        xiaoid: null,
        comid: null,
        fenlei: null,
        htfileid: null
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
      this.title = "添加客户合同";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getCustract(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改客户合同";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateCustract(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addCustract(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除客户合同编号为"' + ids + '"的数据项？').then(function() {
        return delCustract(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('xinhu-finance/custract/export', {
        ...this.queryParams
      }, `custract_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
