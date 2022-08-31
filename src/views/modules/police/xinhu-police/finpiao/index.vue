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
      <el-form-item label="购买方" prop="maicustname">
        <el-input
          v-model="queryParams.maicustname"
          placeholder="请输入购买方"
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
      <el-form-item label="开票人" prop="kainame">
        <el-input
          v-model="queryParams.kainame"
          placeholder="请输入开票人"
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
          v-hasPermi="['xinhu-police:finpiao:add']"
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
          v-hasPermi="['xinhu-police:finpiao:edit']"
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
          v-hasPermi="['xinhu-police:finpiao:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['xinhu-police:finpiao:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="finpiaoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="操作人" align="center" prop="optname" />
      <el-table-column label="操作时间" align="center" prop="optdt" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.optdt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作人ID" align="center" prop="optid" />
      <el-table-column label="购买方" align="center" prop="maicustname" />
      <el-table-column label="客户名称" align="center" prop="custname" />
      <el-table-column label="发票代码" align="center" prop="daima" />
      <el-table-column label="发票号码" align="center" prop="haoma" />
      <el-table-column label="金额" align="center" prop="money" />
      <el-table-column label="开票日期" align="center" prop="opendt" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.opendt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开票人" align="center" prop="kainame" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['xinhu-police:finpiao:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['xinhu-police:finpiao:remove']"
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

    <!-- 添加或修改发票管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="180px">
        <el-form-item label="操作人" prop="optname">
          <el-input v-model="form.optname" placeholder="请输入操作人" />
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
        <el-form-item label="对应客户ID" prop="custid">
          <el-input v-model="form.custid" placeholder="请输入对应客户ID" />
        </el-form-item>
        <el-form-item label="购买方" prop="maicustname">
          <el-input v-model="form.maicustname" placeholder="请输入购买方" />
        </el-form-item>
        <el-form-item label="购买方Id" prop="maicustid">
          <el-input v-model="form.maicustid" placeholder="请输入购买方Id" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-radio v-model="form.type" label="1">收到</el-radio>
          <el-radio v-model="form.type" label="0">开</el-radio>
        </el-form-item>
        <el-form-item label="客户名称" prop="custname">
          <el-input v-model="form.custname" placeholder="请输入客户名称" />
        </el-form-item>
        <el-form-item label="发票代码" prop="daima">
          <el-input v-model="form.daima" placeholder="请输入发票代码" />
        </el-form-item>
        <el-form-item label="发票号码" prop="haoma">
          <el-input v-model="form.haoma" placeholder="请输入发票号码" />
        </el-form-item>
        <el-form-item label="金额" prop="money">
          <el-input v-model="form.money" placeholder="请输入金额" />
        </el-form-item>
        <el-form-item label="开票日期" prop="opendt">
          <el-date-picker clearable size="small"
            v-model="form.opendt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择开票日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="发票类型" prop="ptype">
          <el-radio v-model="form.ptype" label="1">特殊</el-radio>
          <el-radio v-model="form.ptype" label="0">一般</el-radio>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio v-model="form.status" label="1">良好</el-radio>
          <el-radio v-model="form.status" label="0">一般</el-radio>
        </el-form-item>
        <el-form-item label="开票人" prop="kainame">
          <el-input v-model="form.kainame" placeholder="请输入开票人" />
        </el-form-item>
        <el-form-item label="说明" prop="content">
          <el-input v-model="form.content" type="textarea" placeholder="请输入内容" />
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
import { listFinpiao, getFinpiao, delFinpiao, addFinpiao, updateFinpiao } from "@/api/xinhu-police/finpiao";

export default {
  name: "Finpiao",
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
      // 发票管理表格数据
      finpiaoList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        optname: null,
        optdt: null,
        optid: null,
        custid: null,
        maicustname: null,
        maicustid: null,
        type: null,
        custname: null,
        daima: null,
        haoma: null,
        money: null,
        opendt: null,
        ptype: null,
        status: null,
        kainame: null,
        content: null,
        comid: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        optname: [
          { required: true, message: "操作人不能为空", trigger: "blur" }
        ],
        optdt: [
          { required: true, message: "操作时间不能为空", trigger: "blur" }
        ],
        optid: [
          { required: true, message: "操作人ID不能为空", trigger: "blur" }
        ],
        custid: [
          { required: true, message: "对应客户ID不能为空", trigger: "blur" }
        ],
        maicustname: [
          { required: true, message: "购买方不能为空", trigger: "blur" }
        ],
        maicustid: [
          { required: true, message: "购买方Id不能为空", trigger: "blur" }
        ],
        type: [
          { required: true, message: "0开,1收到不能为空", trigger: "change" }
        ],
        custname: [
          { required: true, message: "客户名称不能为空", trigger: "blur" }
        ],
        daima: [
          { required: true, message: "发票代码不能为空", trigger: "blur" }
        ],
        haoma: [
          { required: true, message: "发票号码不能为空", trigger: "blur" }
        ],
        money: [
          { required: true, message: "金额不能为空", trigger: "blur" }
        ],
        opendt: [
          { required: true, message: "开票日期不能为空", trigger: "blur" }
        ],
        ptype: [
          { required: true, message: "发票类型不能为空", trigger: "change" }
        ],
        status: [
          { required: true, message: "状态不能为空", trigger: "blur" }
        ],
        kainame: [
          { required: true, message: "开票人不能为空", trigger: "blur" }
        ],
        content: [
          { required: true, message: "说明不能为空", trigger: "blur" }
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
    /** 查询发票管理列表 */
    getList() {
      this.loading = true;
      listFinpiao(this.queryParams).then(response => {
        this.finpiaoList = response.rows;
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
        optname: null,
        optdt: null,
        optid: null,
        custid: null,
        maicustname: null,
        maicustid: null,
        type: null,
        custname: null,
        daima: null,
        haoma: null,
        money: null,
        opendt: null,
        ptype: null,
        status: 0,
        kainame: null,
        content: null,
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
      this.title = "添加发票管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getFinpiao(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改发票管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateFinpiao(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addFinpiao(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除发票管理编号为"' + ids + '"的数据项？').then(function() {
        return delFinpiao(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('xinhu-police/finpiao/export', {
        ...this.queryParams
      }, `finpiao_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
