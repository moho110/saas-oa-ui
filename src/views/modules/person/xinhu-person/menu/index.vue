<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="菜单名" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入菜单名"
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
          v-hasPermi="['xinhu-person:menu:add']"
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
          v-hasPermi="['xinhu-person:menu:edit']"
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
          v-hasPermi="['xinhu-person:menu:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['xinhu-person:menu:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="menuList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="菜单名" align="center" prop="name" />
      <el-table-column label="URL地址" align="center" prop="url" />
      <el-table-column label="操作时间" align="center" prop="optdt" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.optdt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="编号" align="center" prop="num" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['xinhu-person:menu:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['xinhu-person:menu:remove']"
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

    <!-- 添加或修改系统菜单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="180px">
        <el-form-item label="菜单名" prop="name">
          <el-input v-model="form.name" placeholder="请输入菜单名" />
        </el-form-item>
        <el-form-item label="上级id" prop="pid">
          <el-input v-model="form.pid" placeholder="请输入上级id" />
        </el-form-item>
        <el-form-item label="排序" prop="sorts">
          <el-input-number v-model="sorts" :min="1" :max="999" label="排序"></el-input-number>
        </el-form-item>
        <el-form-item label="URL地址" prop="url">
          <el-input v-model="form.url" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="图标" prop="icons">
          <el-input v-model="form.icons" placeholder="请输入图标" />
        </el-form-item>
        <el-form-item label="操作时间" prop="optdt">
          <el-date-picker clearable size="small"
            v-model="form.optdt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择操作时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="编号" prop="num">
          <el-input v-model="form.num" placeholder="请输入编号" />
        </el-form-item>
        <el-form-item label="是否验证" prop="ispir">
          <el-radio v-model="form.ispir" label="1">是</el-radio>
          <el-radio v-model="form.ispir" label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="颜色" prop="color">
          <el-input v-model="form.color" placeholder="请输入${comment}" />
        </el-form-item>
        <el-form-item label="是否在首页显示" prop="ishs">
          <el-radio v-model="form.ishs" label="1">是</el-radio>
          <el-radio v-model="form.ishs" label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="是否为桌面版图标" prop="iszm">
          <el-radio v-model="form.iszm" label="1">是</el-radio>
          <el-radio v-model="form.iszm" label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="类型" prop="types">
          <el-input v-model="form.types" placeholder="请输入${comment}" />
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
import { listMenu, getMenu, delMenu, addMenu, updateMenu } from "@/api/xinhu-person/menu";

export default {
  name: "Menu",
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
      // 系统菜单表格数据
      menuList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: null,
        pid: null,
        sorts: null,
        url: null,
        icons: null,
        optdt: null,
        num: null,
        ispir: null,
        status: null,
        color: null,
        ishs: null,
        iszm: null,
        type: null,
        types: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [
          { required: true, message: "菜单名不能为空", trigger: "blur" },
          { min: 5, max: 50, message: '长度在 5 到 50 个字符', trigger: 'blur' }
        ],
        pid: [
          { required: true, message: "上级id不能为空", trigger: "blur" }
        ],
        sorts: [
          { required: true, message: "排序不能为空", trigger: "blur" }
        ],
        url: [
          { required: true, message: "Url地址不能为空", trigger: "blur" },
          { min: 10, max: 500, message: '长度在 10 到 500 个字符', trigger: 'blur' }
        ],
        icons: [
          { required: true, message: "图标不能为空", trigger: "blur" }
        ],
        optdt: [
          { required: true, message: "操作时间不能为空", trigger: "blur" }
        ],
        num: [
          { required: true, message: "编号不能为空", trigger: "blur" },
          { min: 10, max: 50, message: '长度在 10 到 50 个字符', trigger: 'blur' }
        ],
        ispir: [
          { required: true, message: "验证不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "启用不能为空", trigger: "blur" }
        ],
        color: [
          { required: true, message: "颜色不能为空", trigger: "blur" },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        ishs: [
          { required: true, message: "是否在首页显示不能为空", trigger: "blur" }
        ],
        iszm: [
          { required: true, message: "是否为桌面版图标不能为空", trigger: "blur" }
        ],
        type: [
          { required: true, message: "菜单类型不能为空", trigger: "change" }
        ],
        types: [
          { required: true, message: "类型不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询系统菜单列表 */
    getList() {
      this.loading = true;
      listMenu(this.queryParams).then(response => {
        this.menuList = response.rows;
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
        pid: null,
        sorts: null,
        url: null,
        icons: null,
        optdt: null,
        num: null,
        ispir: null,
        status: 0,
        color: null,
        ishs: null,
        iszm: null,
        type: null,
        types: null
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
      this.title = "添加系统菜单";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getMenu(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改系统菜单";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateMenu(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addMenu(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除系统菜单编号为"' + ids + '"的数据项？').then(function() {
        return delMenu(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('xinhu-person/menu/export', {
        ...this.queryParams
      }, `menu_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
