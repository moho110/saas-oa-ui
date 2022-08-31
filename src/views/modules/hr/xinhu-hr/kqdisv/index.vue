<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="1组排班,2人员" prop="plx">
        <el-input
          v-model="queryParams.plx"
          placeholder="请输入1组排班,2人员"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="组id,人员Id" prop="receid">
        <el-input
          v-model="queryParams.receid"
          placeholder="请输入组id,人员Id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="日期" prop="dt">
        <el-date-picker clearable size="small"
          v-model="queryParams.dt"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="对应主ID" prop="mid">
        <el-input
          v-model="queryParams.mid"
          placeholder="请输入对应主ID"
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
          v-hasPermi="['xinhu-hr:kqdisv:add']"
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
          v-hasPermi="['xinhu-hr:kqdisv:edit']"
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
          v-hasPermi="['xinhu-hr:kqdisv:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['xinhu-hr:kqdisv:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="kqdisvList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="1组排班,2人员" align="center" prop="plx" />
      <el-table-column label="组id,人员Id" align="center" prop="receid" />
      <el-table-column label="日期" align="center" prop="dt" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.dt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="0考勤时间,1休息,2工作日" align="center" prop="types" />
      <el-table-column label="对应主ID" align="center" prop="mid" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['xinhu-hr:kqdisv:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['xinhu-hr:kqdisv:remove']"
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

    <!-- 添加或修改考勤排班对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="180px">
        <el-form-item label="1组排班,2人员" prop="plx">
          <el-input v-model="form.plx" placeholder="请输入1组排班,2人员" />
        </el-form-item>
        <el-form-item label="组id,人员Id" prop="receid">
          <el-input v-model="form.receid" placeholder="请输入组id,人员Id" />
        </el-form-item>
        <el-form-item label="日期" prop="dt">
          <el-date-picker clearable size="small"
            v-model="form.dt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="类型" prop="types">
          <el-radio v-model="form.types" label="0">考勤时间</el-radio>
          <el-radio v-model="form.types" label="1">休息</el-radio>
          <el-radio v-model="form.types" label="2">工作日</el-radio>
        </el-form-item>
        <el-form-item label="对应主ID" prop="mid">
          <el-input v-model="form.mid" placeholder="请输入对应主ID" />
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
import { listKqdisv, getKqdisv, delKqdisv, addKqdisv, updateKqdisv } from "@/api/xinhu-hr/kqdisv";

export default {
  name: "Kqdisv",
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
      // 考勤排班表格数据
      kqdisvList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        plx: null,
        receid: null,
        dt: null,
        type: null,
        mid: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        plx: [
          { required: true, message: "1组排班,2人员不能为空", trigger: "blur" }
        ],
        receid: [
          { required: true, message: "组id,人员Id不能为空", trigger: "blur" }
        ],
        dt: [
          { required: true, message: "日期不能为空", trigger: "blur" }
        ],
        types: [
          { required: true, message: "0考勤时间,1休息,2工作日不能为空", trigger: "change" }
        ],
        mid: [
          { required: true, message: "对应主ID不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询考勤排班列表 */
    getList() {
      this.loading = true;
      listKqdisv(this.queryParams).then(response => {
        this.kqdisvList = response.rows;
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
        plx: null,
        receid: null,
        dt: null,
        type: null,
        mid: null
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
      this.title = "添加考勤排班";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getKqdisv(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改考勤排班";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateKqdisv(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addKqdisv(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除考勤排班编号为"' + ids + '"的数据项？').then(function() {
        return delKqdisv(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('xinhu-hr/kqdisv/export', {
        ...this.queryParams
      }, `kqdisv_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
