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
      <el-form-item label="跟进人" prop="optname">
        <el-input
          v-model="queryParams.optname"
          placeholder="请输入跟进人"
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
          v-hasPermi="['xinhu-finance:custplan:add']"
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
          v-hasPermi="['xinhu-finance:custplan:edit']"
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
          v-hasPermi="['xinhu-finance:custplan:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['xinhu-finance:custplan:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="custplanList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="客户名称" align="center" prop="custname" />
      <el-table-column label="跟进人" align="center" prop="optname" />
      <el-table-column label="操作时间" align="center" prop="optdt" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.optdt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="计划时间" align="center" prop="plandt" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.plandt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="完成时间" align="center" prop="findt" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.findt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['xinhu-finance:custplan:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['xinhu-finance:custplan:remove']"
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

    <!-- 添加或修改跟进计划对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="180px">
        <el-form-item label="对应单位id" prop="comid">
          <el-input v-model="form.comid" placeholder="请输入对应单位id" />
        </el-form-item>
        <el-form-item label="客户Id" prop="custid">
          <el-input v-model="form.custid" placeholder="请输入客户Id" />
        </el-form-item>
        <el-form-item label="客户名称" prop="custname">
          <el-input v-model="form.custname" placeholder="请输入客户名称" />
        </el-form-item>
        <el-form-item label="操作ID" prop="optid">
          <el-input v-model="form.optid" placeholder="请输入操作ID" />
        </el-form-item>
        <el-form-item label="跟进人" prop="optname">
          <el-input v-model="form.optname" placeholder="请输入跟进人" />
        </el-form-item>
        <el-form-item label="操作时间" prop="optdt">
          <el-date-picker clearable size="small"
            v-model="form.optdt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择操作时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="计划时间" prop="plandt">
          <el-date-picker clearable size="small"
            v-model="form.plandt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择计划时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio v-model="form.status" label="0">计划</el-radio>
          <el-radio v-model="form.status" label="1">完成</el-radio>          
          <el-radio v-model="form.status" label="2">取消</el-radio>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input v-model="form.content" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="跟进方式" prop="gentype">
          <el-radio v-model="form.gentype" label="0">未跟进</el-radio>
          <el-radio v-model="form.gentype" label="1">已跟进</el-radio>          
          <el-radio v-model="form.gentype" label="2">未知</el-radio>
        </el-form-item>
        <el-form-item label="用户ID" prop="uid">
          <el-input v-model="form.uid" placeholder="请输入用户ID" />
        </el-form-item>
        <el-form-item label="完成时间" prop="findt">
          <el-date-picker clearable size="small"
            v-model="form.findt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择完成时间">
          </el-date-picker>
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
import { listCustplan, getCustplan, delCustplan, addCustplan, updateCustplan } from "@/api/xinhu-finance/custplan";

export default {
  name: "Custplan",
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
      // 跟进计划表格数据
      custplanList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        comid: null,
        custid: null,
        custname: null,
        optid: null,
        optname: null,
        optdt: null,
        plandt: null,
        status: null,
        content: null,
        gentype: null,
        uid: null,
        findt: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        comid: [
          { required: true, message: "对应单位id不能为空", trigger: "blur" }
        ],
        custid: [
          { required: true, message: "客户Id不能为空", trigger: "blur" }
        ],
        custname: [
          { required: true, message: "客户名称不能为空", trigger: "blur" }
        ],
        optid: [
          { required: true, message: "操作ID不能为空", trigger: "blur" }
        ],
        optname: [
          { required: true, message: "跟进人不能为空", trigger: "blur" }
        ],
        optdt: [
          { required: true, message: "操作时间不能为空", trigger: "blur" }
        ],
        plandt: [
          { required: true, message: "计划时间不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "状态0计划,1完成,5取消不能为空", trigger: "blur" }
        ],
        content: [
          { required: true, message: "内容不能为空", trigger: "blur" }
        ],
        gentype: [
          { required: true, message: "跟进方式不能为空", trigger: "change" }
        ],
        uid: [
          { required: true, message: "用户ID不能为空", trigger: "blur" }
        ],
        findt: [
          { required: true, message: "完成时间不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询跟进计划列表 */
    getList() {
      this.loading = true;
      listCustplan(this.queryParams).then(response => {
        this.custplanList = response.rows;
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
        comid: null,
        custid: null,
        custname: null,
        optid: null,
        optname: null,
        optdt: null,
        plandt: null,
        status: 0,
        content: null,
        gentype: null,
        uid: null,
        findt: null
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
      this.title = "添加跟进计划";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getCustplan(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改跟进计划";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateCustplan(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addCustplan(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除跟进计划编号为"' + ids + '"的数据项？').then(function() {
        return delCustplan(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('xinhu-finance/custplan/export', {
        ...this.queryParams
      }, `custplan_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
