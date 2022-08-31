<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="对应模块编号" prop="modenum">
        <el-input
          v-model="queryParams.modenum"
          placeholder="请输入对应模块编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="模块名称" prop="modename">
        <el-input
          v-model="queryParams.modename"
          placeholder="请输入模块名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="对应主表" prop="table">
        <el-input
          v-model="queryParams.table"
          placeholder="请输入对应主表"
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
          v-hasPermi="['xinhu-flow:todos:add']"
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
          v-hasPermi="['xinhu-flow:todos:edit']"
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
          v-hasPermi="['xinhu-flow:todos:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['xinhu-flow:todos:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="todosList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="对应模块编号" align="center" prop="modenum" />
      <el-table-column label="模块名称" align="center" prop="modename" />
      <el-table-column label="对应主表" align="center" prop="table" />
      <el-table-column label="添加时间" align="center" prop="adddt" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.adddt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="已读时间" align="center" prop="readdt" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.readdt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['xinhu-flow:todos:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['xinhu-flow:todos:remove']"
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

    <!-- 添加或修改单据通知给对应人员对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="180px">
        <el-form-item label="对应模块编号" prop="modenum">
          <el-input v-model="form.modenum" placeholder="请输入对应模块编号" />
        </el-form-item>
        <el-form-item label="模块名称" prop="modename">
          <el-input v-model="form.modename" placeholder="请输入模块名称" />
        </el-form-item>
        <el-form-item label="对应主表" prop="tables">
          <el-input v-model="form.tables" placeholder="请输入对应主表" />
        </el-form-item>
        <el-form-item label="主表Id" prop="mid">
          <el-input v-model="form.mid" placeholder="请输入主表Id" />
        </el-form-item>
        <el-form-item label="对应人员" prop="uid">
          <el-input v-model="form.uid" placeholder="请输入对应人员" />
        </el-form-item>
        <el-form-item label="添加时间" prop="adddt">
          <el-date-picker clearable size="small"
            v-model="form.adddt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择添加时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="已读时间" prop="readdt">
          <el-date-picker clearable size="small"
            v-model="form.readdt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择已读时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="是否已读" prop="isread">
          <el-radio v-model="form.isread" label="1">是</el-radio>
          <el-radio v-model="form.isread" label="0">否</el-radio>
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
import { listTodos, getTodos, delTodos, addTodos, updateTodos } from "@/api/xinhu-flow/todos";

export default {
  name: "Todos",
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
      // 单据通知给对应人员表格数据
      todosList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        modenum: null,
        modename: null,
        tables: null,
        mid: null,
        uid: null,
        adddt: null,
        readdt: null,
        isread: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        modenum: [
          { required: true, message: "对应模块编号不能为空", trigger: "blur" }
        ],
        modename: [
          { required: true, message: "模块名称不能为空", trigger: "blur" }
        ],
        tables: [
          { required: true, message: "对应主表不能为空", trigger: "blur" }
        ],
        mid: [
          { required: true, message: "主表Id不能为空", trigger: "blur" }
        ],
        uid: [
          { required: true, message: "对应人员不能为空", trigger: "blur" }
        ],
        adddt: [
          { required: true, message: "添加时间不能为空", trigger: "blur" }
        ],
        readdt: [
          { required: true, message: "已读时间不能为空", trigger: "blur" }
        ],
        isread: [
          { required: true, message: "是否已读不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询单据通知给对应人员列表 */
    getList() {
      this.loading = true;
      listTodos(this.queryParams).then(response => {
        this.todosList = response.rows;
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
        modenum: null,
        modename: null,
        table: null,
        mid: null,
        uid: null,
        adddt: null,
        readdt: null,
        isread: null
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
      this.title = "添加单据通知给对应人员";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getTodos(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改单据通知给对应人员";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateTodos(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addTodos(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除单据通知给对应人员编号为"' + ids + '"的数据项？').then(function() {
        return delTodos(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('xinhu-flow/todos/export', {
        ...this.queryParams
      }, `todos_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
