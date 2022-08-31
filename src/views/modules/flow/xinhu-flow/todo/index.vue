<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="名称标题" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入名称标题"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="编号" prop="num">
        <el-input
          v-model="queryParams.num"
          placeholder="请输入编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      
      <el-form-item label="改变字段" prop="changefields">
        <el-input
          v-model="queryParams.changefields"
          placeholder="请输入改变字段"
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
          v-hasPermi="['xinhu-flow:todo:add']"
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
          v-hasPermi="['xinhu-flow:todo:edit']"
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
          v-hasPermi="['xinhu-flow:todo:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['xinhu-flow:todo:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="todoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="名称标题" align="center" prop="name" />
      <el-table-column label="编号" align="center" prop="num" />
      <el-table-column label="通知给" align="center" prop="recename" />
      <el-table-column label="改变字段" align="center" prop="changefields" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['xinhu-flow:todo:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['xinhu-flow:todo:remove']"
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

    <!-- 添加或修改单据通知设置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="180px">
        <el-form-item label="名称标题" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称标题" />
        </el-form-item>
        <el-form-item label="编号" prop="num">
          <el-input v-model="form.num" placeholder="请输入编号" />
        </el-form-item>
        <el-form-item label="对应模块" prop="setid">
          <el-input v-model="form.setid" placeholder="请输入对应模块" />
        </el-form-item>
        <el-form-item label="说明" prop="content">
          <el-input v-model="form.content" placeholder="请输入说明" />
        </el-form-item>
        <el-form-item label="对应条件id" prop="whereid">
          <el-input v-model="form.whereid" placeholder="请输入对应条件id" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio v-model="form.status" label="1">良好</el-radio>
          <el-radio v-model="form.status" label="0">一般</el-radio>
        </el-form-item>
        <el-form-item label="通知给ID" prop="receid">
          <el-input v-model="form.receid" type="textarea" placeholder="请输入通知给ID" />
        </el-form-item>        
        <el-form-item label="通知给" prop="recename">
          <el-input v-model="form.recename" type="textarea" placeholder="请输入通知给" />
        </el-form-item>
        <el-form-item label="改变字段" prop="changefields">
          <el-input v-model="form.changefields" placeholder="请输入改变字段" />
        </el-form-item>
        <el-form-item label="对应步做id" prop="changecourse">
          <el-input v-model="form.changecourse" placeholder="请输入对应步做id" />
        </el-form-item>
        <el-form-item label="提交时" prop="boturn">
          <el-input v-model="form.boturn" placeholder="请输入提交时" />
        </el-form-item>
        <el-form-item label="编辑时" prop="boedit">
          <el-input v-model="form.boedit" placeholder="请输入编辑时" />
        </el-form-item>
        <el-form-item label="字段改变时" prop="bochang">
          <el-input v-model="form.bochang" placeholder="请输入字段改变时" />
        </el-form-item>
        <el-form-item label="删除时" prop="bodel">
          <el-input v-model="form.bodel" placeholder="请输入删除时" />
        </el-form-item>
        <el-form-item label="作废时" prop="bozuofei">
          <el-input v-model="form.bozuofei" placeholder="请输入作废时" />
        </el-form-item>
        <el-form-item label="步骤处理通过时" prop="botong">
          <el-input v-model="form.botong" placeholder="请输入步骤处理通过时" />
        </el-form-item>
        <el-form-item label="步骤处理不通过时" prop="bobutong">
          <el-input v-model="form.bobutong" placeholder="请输入步骤处理不通过时" />
        </el-form-item>
        <el-form-item label="处理完成时" prop="bofinish">
          <el-input v-model="form.bofinish" placeholder="请输入处理完成时" />
        </el-form-item>
        <el-form-item label="追加说明时" prop="bozhui">
          <el-input v-model="form.bozhui" placeholder="请输入追加说明时" />
        </el-form-item>
        <el-form-item label="流程转办时" prop="bozhuan">
          <el-input v-model="form.bozhuan" placeholder="请输入流程转办时" />
        </el-form-item>
        <el-form-item label="是否通知给提交人" prop="toturn">
          <el-input v-model="form.toturn" placeholder="请输入是否通知给提交人" />
        </el-form-item>
        <el-form-item label="是否通知给流程所有参与人" prop="tocourse">
          <el-input v-model="form.tocourse" placeholder="请输入是否通知给流程所有参与人" />
        </el-form-item>
        <el-form-item label="通知给主表上字段" prop="todofields">
          <el-input v-model="form.todofields" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="通知内容摘要" prop="summary">
          <el-input v-model="form.summary" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="计划任务" prop="botask">
          <el-input v-model="form.botask" placeholder="请输入计划任务" />
        </el-form-item>
        <el-form-item label="评论时" prop="boping">
          <el-input v-model="form.boping" placeholder="请输入评论时" />
        </el-form-item>
        <el-form-item label="回执时" prop="bohuiz">
          <el-input v-model="form.bohuiz" placeholder="请输入回执时" />
        </el-form-item>
        <el-form-item label="直属上级" prop="tosuper">
          <el-input v-model="form.tosuper" placeholder="请输入直属上级" />
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
import { listTodo, getTodo, delTodo, addTodo, updateTodo } from "@/api/xinhu-flow/todo";

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
      // 单据通知设置表格数据
      todoList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: null,
        num: null,
        setid: null,
        content: null,
        whereid: null,
        status: null,
        receid: null,
        recename: null,
        changefields: null,
        changecourse: null,
        boturn: null,
        boedit: null,
        bochang: null,
        bodel: null,
        bozuofei: null,
        botong: null,
        bobutong: null,
        bofinish: null,
        bozhui: null,
        bozhuan: null,
        toturn: null,
        tocourse: null,
        todofields: null,
        summary: null,
        botask: null,
        boping: null,
        bohuiz: null,
        tosuper: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [
          { required: true, message: "名称标题不能为空", trigger: "blur" },
          { min: 3, max: 30, message: '长度在 3 到 30 个字符', trigger: 'blur' }
        ],
        num: [
          { required: true, message: "编号不能为空", trigger: "blur" },
          { min: 3, max: 30, message: '长度在 3 到 30 个字符', trigger: 'blur' }
        ],
        setid: [
          { required: true, message: "对应模块不能为空", trigger: "blur" }
        ],
        content: [
          { required: true, message: "说明不能为空", trigger: "blur" },
          { min: 3, max: 100, message: '长度在 3 到 100 个字符', trigger: 'blur' }
        ],
        whereid: [
          { required: true, message: "对应条件id不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "状态不能为空", trigger: "blur" }
        ],
        receid: [
          { required: true, message: "通知给ID不能为空", trigger: "blur" },
          { min: 3, max: 500, message: '长度在 3 到 500 个字符', trigger: 'blur' }
        ],
        recename: [
          { required: true, message: "通知给不能为空", trigger: "blur" },
          { min: 3, max: 500, message: '长度在 3 到 500 个字符', trigger: 'blur' }
        ],
        changefields: [
          { required: true, message: "改变字段不能为空", trigger: "blur" },
          { min: 3, max: 200, message: '长度在 3 到 200 个字符', trigger: 'blur' }
        ],
        changecourse: [
          { required: true, message: "对应步做id不能为空", trigger: "blur" },
          { min: 3, max: 30, message: '长度在 3 到 30 个字符', trigger: 'blur' }
        ],
        boturn: [
          { required: true, message: "提交时不能为空", trigger: "blur" }
        ],
        boedit: [
          { required: true, message: "编辑时不能为空", trigger: "blur" }
        ],
        bochang: [
          { required: true, message: "字段改变时不能为空", trigger: "blur" }
        ],
        bodel: [
          { required: true, message: "删除时不能为空", trigger: "blur" }
        ],
        bozuofei: [
          { required: true, message: "作废时不能为空", trigger: "blur" }
        ],
        botong: [
          { required: true, message: "步骤处理通过时不能为空", trigger: "blur" }
        ],
        bobutong: [
          { required: true, message: "步骤处理不通过时不能为空", trigger: "blur" }
        ],
        bofinish: [
          { required: true, message: "处理完成时不能为空", trigger: "blur" }
        ],
        bozhui: [
          { required: true, message: "追加说明时不能为空", trigger: "blur" }
        ],
        bozhuan: [
          { required: true, message: "流程转办时不能为空", trigger: "blur" }
        ],
        toturn: [
          { required: true, message: "是否通知给提交人不能为空", trigger: "blur" }
        ],
        tocourse: [
          { required: true, message: "是否通知给流程所有参与人不能为空", trigger: "blur" }
        ],
        todofields: [
          { required: true, message: "通知给主表上字段不能为空", trigger: "blur" }
        ],
        summary: [
          { required: true, message: "通知内容摘要不能为空", trigger: "blur" }
        ],
        botask: [
          { required: true, message: "计划任务不能为空", trigger: "blur" }
        ],
        boping: [
          { required: true, message: "评论时不能为空", trigger: "blur" }
        ],
        bohuiz: [
          { required: true, message: "回执时不能为空", trigger: "blur" }
        ],
        tosuper: [
          { required: true, message: "直属上级不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询单据通知设置列表 */
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
        name: null,
        num: null,
        setid: null,
        content: null,
        whereid: null,
        status: 0,
        receid: null,
        recename: null,
        changefields: null,
        changecourse: null,
        boturn: null,
        boedit: null,
        bochang: null,
        bodel: null,
        bozuofei: null,
        botong: null,
        bobutong: null,
        bofinish: null,
        bozhui: null,
        bozhuan: null,
        toturn: null,
        tocourse: null,
        todofields: null,
        summary: null,
        botask: null,
        boping: null,
        bohuiz: null,
        tosuper: null
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
      this.title = "添加单据通知设置";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getTodo(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改单据通知设置";
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
      this.$modal.confirm('是否确认删除单据通知设置编号为"' + ids + '"的数据项？').then(function() {
        return delTodo(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('xinhu-flow/todo/export', {
        ...this.queryParams
      }, `todo_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
