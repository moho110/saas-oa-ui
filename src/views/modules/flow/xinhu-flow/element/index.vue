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
      <el-form-item label="对应字段" prop="fields">
        <el-input
          v-model="queryParams.fields"
          placeholder="请输入对应字段"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="字段长度" prop="lens">
        <el-input
          v-model="queryParams.lens"
          placeholder="请输入字段长度"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="保存条件" prop="savewhere">
        <el-input
          v-model="queryParams.savewhere"
          placeholder="请输入保存条件"
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
          v-hasPermi="['xinhu-flow:element:add']"
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
          v-hasPermi="['xinhu-flow:element:edit']"
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
          v-hasPermi="['xinhu-flow:element:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['xinhu-flow:element:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="elementList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="名称" align="center" prop="name" />
      <el-table-column label="对应字段" align="center" prop="fields" />
      <el-table-column label="属性" align="center" prop="attr" />
      <el-table-column label="列属性" align="center" prop="lattr" />
      <el-table-column label="列宽" align="center" prop="width" />
      <el-table-column label="字段长度" align="center" prop="lens" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['xinhu-flow:element:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['xinhu-flow:element:remove']"
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

    <!-- 添加或修改模块元素对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="180px">
        <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="基本配置" name="first">
        <el-form-item label="mid" prop="mid">
          <el-input v-model="form.mid" placeholder="请输入mid" />
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="对应字段" prop="fields">
          <el-input v-model="form.fields" placeholder="请输入对应字段" />
        </el-form-item>
        <el-form-item label="对应字段类型" prop="fieldstype">
          <el-input v-model="form.fieldstype" placeholder="请输入对应字段" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="form.sort" :min="1" :max="999" label="描述文字"></el-input-number>
        </el-form-item>
        <el-form-item label="默认值" prop="dev">
          <el-input v-model="form.dev" placeholder="请输入默认值" />
        </el-form-item>
        <el-form-item label="是否必填" prop="isbt">
          <el-radio v-model="form.isbt" label="1">是</el-radio>
          <el-radio v-model="form.isbt" label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="数据源" prop="data">
          <el-input v-model="form.data" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="录入管理" name="second">
        <el-form-item label="是否录入元素" prop="islu">
          <el-radio v-model="form.islu" label="1">是</el-radio>
          <el-radio v-model="form.islu" label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="是否列表展示" prop="iszs">
          <el-radio v-model="form.iszs" label="1">是</el-radio>
          <el-radio v-model="form.iszs" label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="属性" prop="attr">
          <el-input v-model="form.attr" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="iszb" prop="iszb">
          <el-radio v-model="form.iszb" label="1">是</el-radio>
          <el-radio v-model="form.iszb" label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="isss" prop="isss">
          <el-radio v-model="form.isss" label="1">是</el-radio>
          <el-radio v-model="form.isss" label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="列属性" prop="lattr">
          <el-input v-model="form.lattr" placeholder="请输入列属性" />
        </el-form-item>
        <el-form-item label="列宽" prop="width">
          <el-input v-model="form.width" placeholder="请输入列宽" />
        </el-form-item>
        <el-form-item label="字段长度" prop="lens">
          <el-input v-model="form.lens" placeholder="请输入字段长度" />
        </el-form-item>
        <el-form-item label="保存条件" prop="savewhere">
          <el-input v-model="form.savewhere" placeholder="请输入保存条件" />
        </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="属性配置" name="third">
        <el-form-item label="是否列表列" prop="islb">
          <el-radio v-model="form.islb" label="1">是</el-radio>
          <el-radio v-model="form.islb" label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="是否可排序" prop="ispx">
          <el-radio v-model="form.ispx" label="1">是</el-radio>
          <el-radio v-model="form.ispx" label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="0居中,1居左,2居右" prop="isalign">
          <el-radio v-model="form.isalign" label="0">居中</el-radio>
          <el-radio v-model="form.isalign" label="1">居左</el-radio>
          <el-radio v-model="form.isalign" label="2">居右</el-radio>
        </el-form-item>
        <el-form-item label="是否可搜索" prop="issou">
          <el-radio v-model="form.issou" label="1">是</el-radio>
          <el-radio v-model="form.issou" label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="是否可统计" prop="istj">
          <el-radio v-model="form.istj" label="1">是</el-radio>
          <el-radio v-model="form.istj" label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="计算公式" prop="gongsi">
          <el-input v-model="form.gongsi" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="提示内容" prop="placeholder">
          <el-input v-model="form.placeholder" placeholder="请输入提示内容" />
        </el-form-item>
        <el-form-item label="是否唯一" prop="isonly">
          <el-radio v-model="form.isonly" label="1">是</el-radio>
          <el-radio v-model="form.isonly" label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="是否导入字段" prop="isdr">
          <el-radio v-model="form.isdr" label="1">是</el-radio>
          <el-radio v-model="form.isdr" label="0">否</el-radio>
        </el-form-item>
        </el-tab-pane>
        </el-tabs>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listElement, getElement, delElement, addElement, updateElement } from "@/api/xinhu-flow/element";

export default {
  name: "Element",
  data() {
    return {
      activeName: 'first',
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
      // 模块元素表格数据
      elementList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        mid: null,
        name: null,
        fields: null,
        fieldstype: null,
        sort: null,
        dev: null,
        isbt: null,
        data: null,
        islu: null,
        iszs: null,
        attr: null,
        iszb: null,
        isss: null,
        lattr: null,
        width: null,
        lens: null,
        savewhere: null,
        islb: null,
        ispx: null,
        isalign: null,
        issou: null,
        istj: null,
        gongsi: null,
        placeholder: null,
        isonly: null,
        isdr: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        mid: [
          { required: true, message: "mid不能为空", trigger: "blur" }
        ],
        name: [
          { required: true, message: "名称不能为空", trigger: "blur" },
          { min: 5, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur' }
        ],
        fields: [
          { required: true, message: "对应字段不能为空", trigger: "blur" },
          { min: 5, max: 50, message: '长度在 5 到 50 个字符', trigger: 'blur' }
        ],
        fieldstype: [
          { required: true, message: "字段类型不能为空", trigger: "change" },
          { min: 5, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: "排序号不能为空", trigger: "blur" }
        ],
        dev: [
          { required: true, message: "默认值不能为空", trigger: "blur" },
          { min: 5, max: 100, message: '长度在 5 到 100 个字符', trigger: 'blur' }
        ],
        isbt: [
          { required: true, message: "是否必填不能为空", trigger: "blur" }
        ],
        data: [
          { required: true, message: "数据源不能为空", trigger: "blur" },
          { min: 10, max: 500, message: '长度在 10 到 500 个字符', trigger: 'blur' }
        ],
        islu: [
          { required: true, message: "是否录入元素不能为空", trigger: "blur" }
        ],
        iszs: [
          { required: true, message: "是否列表展示不能为空", trigger: "blur" }
        ],
        attr: [
          { required: true, message: "属性不能为空", trigger: "blur" },
          { min: 5, max: 500, message: '长度在 5 到 500 个字符', trigger: 'blur' }
        ],
        iszb: [
          { required: true, message: "iszb不能为空", trigger: "blur" }
        ],
        isss: [
          { required: true, message: "isss不能为空", trigger: "blur" }
        ],
        lattr: [
          { required: true, message: "列属性不能为空", trigger: "blur" },
          { min: 5, max: 100, message: '长度在 5 到 100 个字符', trigger: 'blur' }
        ],
        width: [
          { required: true, message: "列宽不能为空", trigger: "blur" },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        lens: [
          { required: true, message: "字段长度不能为空", trigger: "blur" }
        ],
        savewhere: [
          { required: true, message: "保存条件不能为空", trigger: "blur" },
          { min: 5, max: 100, message: '长度在 5 到 100 个字符', trigger: 'blur' }
        ],
        islb: [
          { required: true, message: "是否列表列不能为空", trigger: "blur" }
        ],
        ispx: [
          { required: true, message: "是否可排序不能为空", trigger: "blur" }
        ],
        isalign: [
          { required: true, message: "0居中,1居左,2居右不能为空", trigger: "blur" }
        ],
        issou: [
          { required: true, message: "是否可搜索不能为空", trigger: "blur" }
        ],
        istj: [
          { required: true, message: "是否可统计不能为空", trigger: "blur" }
        ],
        gongsi: [
          { required: true, message: "计算公式不能为空", trigger: "blur" },
          { min: 10, max: 500, message: '长度在 10 到 500 个字符', trigger: 'blur' }
        ],
        placeholder: [
          { required: true, message: "提示内容不能为空", trigger: "blur" },
          { min: 5, max: 50, message: '长度在 5 到 50 个字符', trigger: 'blur' }
        ],
        isonly: [
          { required: true, message: "是否唯一不能为空", trigger: "blur" }
        ],
        isdr: [
          { required: true, message: "是否导入字段不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询模块元素列表 */
    getList() {
      this.loading = true;
      listElement(this.queryParams).then(response => {
        this.elementList = response.rows;
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
        name: null,
        fields: null,
        fieldstype: null,
        sort: null,
        dev: null,
        isbt: null,
        data: null,
        islu: null,
        iszs: null,
        attr: null,
        iszb: null,
        isss: null,
        lattr: null,
        width: null,
        lens: null,
        savewhere: null,
        islb: null,
        ispx: null,
        isalign: null,
        issou: null,
        istj: null,
        gongsi: null,
        placeholder: null,
        isonly: null,
        isdr: null
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
      this.title = "添加模块元素";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getElement(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改模块元素";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateElement(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addElement(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除模块元素编号为"' + ids + '"的数据项？').then(function() {
        return delElement(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('xinhu-flow/element/export', {
        ...this.queryParams
      }, `element_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
