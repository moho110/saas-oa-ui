<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="名称" prop="tplname">
        <el-input
          v-model="queryParams.tplname"
          placeholder="请输入名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="多模版编号" prop="tplnum">
        <el-input
          v-model="queryParams.tplnum"
          placeholder="请输入多模版编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="适用对象" prop="recename">
        <el-input
          v-model="queryParams.recename"
          placeholder="请输入适用对象"
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
          v-hasPermi="['xinhu-flow:modetpl:add']"
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
          v-hasPermi="['xinhu-flow:modetpl:edit']"
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
          v-hasPermi="['xinhu-flow:modetpl:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['xinhu-flow:modetpl:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="modetplList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="名称" align="center" prop="tplname" />
      <el-table-column label="多模版编号" align="center" prop="tplnum" />
      <el-table-column label="录入字段" align="center" prop="fieldsluru" />
      <el-table-column label="必填字段" align="center" prop="fieldsbitian" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['xinhu-flow:modetpl:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['xinhu-flow:modetpl:remove']"
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

    <!-- 添加或修改模块多模版设置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="180px">
        <el-form-item label="模块Id" prop="setid">
          <el-input v-model="form.setid" placeholder="请输入模块Id" />
        </el-form-item>
        <el-form-item label="名称" prop="tplname">
          <el-input v-model="form.tplname" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="多模版编号" prop="tplnum">
          <el-input v-model="form.tplnum" placeholder="请输入多模版编号" />
        </el-form-item>
        <el-form-item label="录入字段" prop="fieldsluru">
          <el-input v-model="form.fieldsluru" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="必填字段" prop="fieldsbitian">
          <el-input v-model="form.fieldsbitian" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="说明" prop="content">
          <el-input v-model="form.content" type="textarea" placeholder="请输入说明" />
        </el-form-item>
        <el-form-item label="适用对象" prop="recename">
          <el-input v-model="form.recename" placeholder="请输入适用对象" />
        </el-form-item>
        <el-form-item label="适用对象ID" prop="receid">
          <el-input v-model="form.receid" placeholder="请输入适用对象ID}" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio v-model="form.status" label="1">良好</el-radio>
          <el-radio v-model="form.status" label="0">一般</el-radio>
        </el-form-item>
        <el-form-item label="排序号" prop="sort">
          <el-input-number v-model="form.sort" :min="1" :max="99" label="描述文字"></el-input-number>
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
import { listModetpl, getModetpl, delModetpl, addModetpl, updateModetpl } from "@/api/xinhu-flow/modetpl";

export default {
  name: "Modetpl",
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
      // 模块多模版设置表格数据
      modetplList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        setid: null,
        tplname: null,
        tplnum: null,
        fieldsluru: null,
        fieldsbitian: null,
        explain: null,
        recename: null,
        receid: null,
        status: null,
        sort: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        setid: [
          { required: true, message: "模块Id不能为空", trigger: "blur" },
        ],
        tplname: [
          { required: true, message: "名称不能为空", trigger: "blur" },
          { min: 5, max: 200, message: '长度在 3 到 200 个字符', trigger: 'blur' }
        ],
        tplnum: [
          { required: true, message: "多模版编号不能为空", trigger: "blur" },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        fieldsluru: [
          { required: true, message: "录入字段不能为空", trigger: "blur" },
          { min: 3, max: 500, message: '长度在 3 到 500 个字符', trigger: 'blur' }
        ],
        fieldsbitian: [
          { required: true, message: "必填字段不能为空", trigger: "blur" },
          { min: 3, max: 500, message: '长度在 3 到 500 个字符', trigger: 'blur' }
        ],
        content: [
          { required: true, message: "说明不能为空", trigger: "blur" },
          { min: 10, max: 200, message: '长度在 10 到 200 个字符', trigger: 'blur' }
        ],
        recename: [
          { required: true, message: "适用对象不能为空", trigger: "blur" },
          { min: 10, max: 200, message: '长度在 10 到 200 个字符', trigger: 'blur' }
        ],
        receid: [
          { required: true, message: "适用对象ID不能为空", trigger: "blur" },
          { min: 3, max: 200, message: '长度在 3 到 200 个字符', trigger: 'blur' }
        ],
        status: [
          { required: true, message: "状态不能为空", trigger: "blur" }
        ],
        sort: [
          { required: true, message: "排序号不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询模块多模版设置列表 */
    getList() {
      this.loading = true;
      listModetpl(this.queryParams).then(response => {
        this.modetplList = response.rows;
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
        setid: null,
        tplname: null,
        tplnum: null,
        fieldsluru: null,
        fieldsbitian: null,
        explain: null,
        recename: null,
        receid: null,
        status: 0,
        sort: null
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
      this.title = "添加模块多模版设置";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getModetpl(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改模块多模版设置";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateModetpl(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addModetpl(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除模块多模版设置编号为"' + ids + '"的数据项？').then(function() {
        return delModetpl(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('xinhu-flow/modetpl/export', {
        ...this.queryParams
      }, `modetpl_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
