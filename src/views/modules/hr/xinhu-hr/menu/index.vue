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
      <el-form-item label="可使用人员" prop="recename">
        <el-input
          v-model="queryParams.recename"
          placeholder="请输入可使用人员"
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
          v-hasPermi="['xinhu-hr:menu:add']"
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
          v-hasPermi="['xinhu-hr:menu:edit']"
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
          v-hasPermi="['xinhu-hr:menu:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['xinhu-hr:menu:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="menuList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="名称" align="center" prop="name" />
      <el-table-column label="排序号" align="center" prop="sort" />
      <el-table-column label="对应地址" align="center" prop="url" />
      <el-table-column label="编号" align="center" prop="num" />
      <el-table-column label="颜色" align="center" prop="color" />
      <el-table-column label="可使用人员" align="center" prop="recename" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['xinhu-hr:menu:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['xinhu-hr:menu:remove']"
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

    <!-- 添加或修改IM下应用菜单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="180px">
        <el-form-item label="主表ID" prop="mid">
          <el-input v-model="form.mid" placeholder="请输入主表ID" />
        </el-form-item>
        <el-form-item label="父级ID" prop="pid">
          <el-input v-model="form.pid" placeholder="请输入父级ID" />
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="排序号" prop="sort">
          <el-input v-model="form.sort" placeholder="请输入排序号" />
        </el-form-item>
        <el-form-item label="类型" prop="types">
          <el-radio v-model="form.types" label="1">URL地址</el-radio>
          <el-radio v-model="form.types" label="0">事件</el-radio>
        </el-form-item>
        <el-form-item label="对应地址" prop="url">
          <el-input v-model="form.url" placeholder="请输入对应地址" />
        </el-form-item>
        <el-form-item label="编号" prop="num">
          <el-input v-model="form.num" placeholder="请输入编号" />
        </el-form-item>
        <el-form-item label="颜色" prop="color">
          <el-input v-model="form.color" placeholder="请输入颜色" />
        </el-form-item>
        <el-form-item label="可使用人员ID" prop="receid">
          <el-input v-model="form.receid" placeholder="请输入可使用人员ID" />
        </el-form-item>
        <el-form-item label="可使用人员" prop="recename">
          <el-input v-model="form.recename" placeholder="请输入可使用人员" />
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
import { listMenu, getMenu, delMenu, addMenu, updateMenu } from "@/api/xinhu-hr/menu";

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
      // IM下应用菜单表格数据
      menuList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        mid: null,
        pid: null,
        name: null,
        sort: null,
        types: null,
        url: null,
        num: null,
        color: null,
        receid: null,
        recename: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        mid: [
          { required: true, message: "主表ID不能为空", trigger: "blur" }
        ],
        pid: [
          { required: true, message: "父级ID不能为空", trigger: "blur" }
        ],
        name: [
          { required: true, message: "名称不能为空", trigger: "blur" }
        ],
        sort: [
          { required: true, message: "排序号不能为空", trigger: "blur" }
        ],
        types: [
          { required: true, message: "1url,0事件不能为空", trigger: "change" }
        ],
        url: [
          { required: true, message: "对应地址不能为空", trigger: "blur" }
        ],
        num: [
          { required: true, message: "编号不能为空", trigger: "blur" }
        ],
        color: [
          { required: true, message: "颜色不能为空", trigger: "blur" }
        ],
        receid: [
          { required: true, message: "可使用人员ID不能为空", trigger: "blur" }
        ],
        recename: [
          { required: true, message: "可使用人员不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询IM下应用菜单列表 */
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
        mid: null,
        pid: null,
        name: null,
        sort: null,
        types: null,
        url: null,
        num: null,
        color: null,
        receid: null,
        recename: null
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
      this.title = "添加IM下应用菜单";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getMenu(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改IM下应用菜单";
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
      this.$modal.confirm('是否确认删除IM下应用菜单编号为"' + ids + '"的数据项？').then(function() {
        return delMenu(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('xinhu-hr/menu/export', {
        ...this.queryParams
      }, `menu_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
