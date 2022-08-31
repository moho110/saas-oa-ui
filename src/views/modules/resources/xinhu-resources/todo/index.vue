<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="类型" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入类型"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="对应模块编号" prop="modenum">
        <el-input
          v-model="queryParams.modenum"
          placeholder="请输入对应模块编号"
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
          v-hasPermi="['xinhu-resources:todo:add']"
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
          v-hasPermi="['xinhu-resources:todo:edit']"
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
          v-hasPermi="['xinhu-resources:todo:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['xinhu-resources:todo:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="todoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="用户ID" align="center" prop="uid" />
      <el-table-column label="类型" align="center" prop="title" />
      <el-table-column label="信息内容" align="center" prop="mess" />
      <el-table-column label="时间" align="center" prop="optdt" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.optdt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="对应模块编号" align="center" prop="modenum" />
      <el-table-column label="相关url" align="center" prop="url" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['xinhu-resources:todo:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['xinhu-resources:todo:remove']"
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

    <!-- 添加或修改提醒消息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="180px">
        <el-form-item label="用户ID" prop="uid">
          <el-input v-model="form.uid" placeholder="请输入用户ID" />
        </el-form-item>
        <el-form-item label="类型" prop="title">
          <el-input v-model="form.title" placeholder="请输入类型" />
        </el-form-item>
        <el-form-item label="信息内容" prop="mess">
          <el-input v-model="form.mess" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio v-model="form.status" label="1">已读</el-radio>
          <el-radio v-model="form.status" label="0">未读</el-radio>
        </el-form-item>
        <el-form-item label="时间" prop="optdt">
          <el-date-picker clearable size="small"
            v-model="form.optdt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="表名" prop="tables">
          <el-input v-model="form.tables" placeholder="请输入表名" />
        </el-form-item>
        <el-form-item label="主表ID" prop="mid">
          <el-input v-model="form.mid" placeholder="请输入主表ID" />
        </el-form-item>
        <el-form-item label="已读时间" prop="readdt">
          <el-date-picker clearable size="small"
            v-model="form.readdt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择已读时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="提醒时间" prop="tododt">
          <el-date-picker clearable size="small"
            v-model="form.tododt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择提醒时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="对应模块编号" prop="modenum">
          <el-input v-model="form.modenum" placeholder="请输入对应模块编号" />
        </el-form-item>
        <el-form-item label="相关url" prop="url">
          <el-input v-model="form.url" type="textarea" placeholder="请输入内容" />
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
import { listTodo, getTodo, delTodo, addTodo, updateTodo } from "@/api/xinhu-resources/todo";

export default {
  name: "Todo",
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
      // 提醒消息表格数据
      todoList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        uid: null,
        title: null,
        mess: null,
        status: null,
        optdt: null,
        tables: null,
        mid: null,
        readdt: null,
        tododt: null,
        modenum: null,
        url: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        uid: [
          { required: true, message: "用户ID不能为空", trigger: "blur" }
        ],
        title: [
          { required: true, message: "类型不能为空", trigger: "blur" }
        ],
        mess: [
          { required: true, message: "信息内容不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "状态@0|未读,1|已读不能为空", trigger: "blur" }
        ],
        optdt: [
          { required: true, message: "时间不能为空", trigger: "blur" }
        ],
        tables: [
          { required: true, message: "表名不能为空", trigger: "blur" }
        ],
        mid: [
          { required: true, message: "主表ID不能为空", trigger: "blur" }
        ],
        readdt: [
          { required: true, message: "已读时间不能为空", trigger: "blur" }
        ],
        tododt: [
          { required: true, message: "提醒时间不能为空", trigger: "blur" }
        ],
        modenum: [
          { required: true, message: "对应模块编号不能为空", trigger: "blur" }
        ],
        url: [
          { required: true, message: "相关url不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询提醒消息列表 */
    getList() {
      this.loading = true;
      listTodo(this.queryParams).then(response => {
        this.todoList = response.rows;
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
        title: null,
        mess: null,
        status: 0,
        optdt: null,
        tables: null,
        mid: null,
        readdt: null,
        tododt: null,
        modenum: null,
        url: null
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
      this.title = "添加提醒消息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getTodo(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改提醒消息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateTodo(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addTodo(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除提醒消息编号为"' + ids + '"的数据项？').then(function() {
        return delTodo(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('xinhu-resources/todo/export', {
        ...this.queryParams
      }, `todo_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
