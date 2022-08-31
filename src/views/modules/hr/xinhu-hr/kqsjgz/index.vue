<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入名称"
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
          v-hasPermi="['xinhu-hr:kqsjgz:add']"
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
          v-hasPermi="['xinhu-hr:kqsjgz:edit']"
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
          v-hasPermi="['xinhu-hr:kqsjgz:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['xinhu-hr:kqsjgz:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="kqsjgzList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="名称" align="center" prop="name" />
      <el-table-column label="排序号" align="center" prop="sort" />
      <el-table-column label="主ID" align="center" prop="pid" />
      <el-table-column label="开始时间" align="center" prop="stime" />
      <el-table-column label="结束时间" align="center" prop="etime" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['xinhu-hr:kqsjgz:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['xinhu-hr:kqsjgz:remove']"
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

    <!-- 添加或修改考勤时间规则对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="180px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="排序号" prop="sort">
          <el-input v-model="form.sort" placeholder="请输入排序号" />
        </el-form-item>
        <el-form-item label="主ID" prop="pid">
          <el-input v-model="form.pid" placeholder="请输入主ID" />
        </el-form-item>
        <el-form-item label="开始时间" prop="stime">
          <el-input v-model="form.stime" placeholder="请输入开始时间" />
        </el-form-item>
        <el-form-item label="结束时间" prop="etime">
          <el-input v-model="form.etime" placeholder="请输入结束时间" />
        </el-form-item>
        <el-form-item label="是否跨天" prop="iskt">
          <el-radio v-model="form.iskt" label="1">是</el-radio>
          <el-radio v-model="form.iskt" label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="取值类型" prop="qtype">
          <el-radio v-model="form.qtype" label="1">最大值</el-radio>
          <el-radio v-model="form.qtype" label="0">最小值</el-radio>
        </el-form-item>
        <el-form-item label="是否需要考勤" prop="iskq">
          <el-radio v-model="form.iskq" label="1">是</el-radio>
          <el-radio v-model="form.iskq" label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="是否休息断" prop="isxx">
          <el-radio v-model="form.isxx" label="1">是</el-radio>
          <el-radio v-model="form.isxx" label="0">否</el-radio>
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
import { listKqsjgz, getKqsjgz, delKqsjgz, addKqsjgz, updateKqsjgz } from "@/api/xinhu-hr/kqsjgz";

export default {
  name: "Kqsjgz",
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
      // 考勤时间规则表格数据
      kqsjgzList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: null,
        sort: null,
        pid: null,
        stime: null,
        etime: null,
        qtype: null,
        iskt: null,
        iskq: null,
        isxx: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [
          { required: true, message: "名称不能为空", trigger: "blur" }
        ],
        sort: [
          { required: true, message: "排序号不能为空", trigger: "blur" }
        ],
        pid: [
          { required: true, message: "主不能为空", trigger: "blur" }
        ],
        stime: [
          { required: true, message: "开始时间不能为空", trigger: "blur" }
        ],
        etime: [
          { required: true, message: "结束时间不能为空", trigger: "blur" }
        ],
        qtype: [
          { required: true, message: "取值类型@0|最小值,1|最大值不能为空", trigger: "change" }
        ],
        iskt: [
          { required: true, message: "是否跨天不能为空", trigger: "blur" }
        ],
        iskq: [
          { required: true, message: "是否需要考勤不能为空", trigger: "blur" }
        ],
        isxx: [
          { required: true, message: "是否休息断不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询考勤时间规则列表 */
    getList() {
      this.loading = true;
      listKqsjgz(this.queryParams).then(response => {
        this.kqsjgzList = response.rows;
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
        sort: null,
        pid: null,
        stime: null,
        etime: null,
        qtype: null,
        iskt: null,
        iskq: null,
        isxx: null
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
      this.title = "添加考勤时间规则";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getKqsjgz(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改考勤时间规则";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateKqsjgz(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addKqsjgz(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除考勤时间规则编号为"' + ids + '"的数据项？').then(function() {
        return delKqsjgz(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('xinhu-hr/kqsjgz/export', {
        ...this.queryParams
      }, `kqsjgz_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
