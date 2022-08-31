<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="模版消息id" prop="templateId">
        <el-input
          v-model="queryParams.templateId"
          placeholder="请输入模版消息id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="模板标题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入模板标题"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="模板所属行业的一级行业" prop="primaryIndustry">
        <el-input
          v-model="queryParams.primaryIndustry"
          placeholder="请输入模板所属行业的一级行业"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="模板所属行业的二级行业" prop="deputyIndustry">
        <el-input
          v-model="queryParams.deputyIndustry"
          placeholder="请输入模板所属行业的二级行业"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="使用名称" prop="modename">
        <el-input
          v-model="queryParams.modename"
          placeholder="请输入使用名称"
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
          v-hasPermi="['xinhu-system:wotpl:add']"
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
          v-hasPermi="['xinhu-system:wotpl:edit']"
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
          v-hasPermi="['xinhu-system:wotpl:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['xinhu-system:wotpl:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="wotplList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="${comment}" align="center" prop="id" />
      <el-table-column label="模版消息id" align="center" prop="templateId" />
      <el-table-column label="模板标题" align="center" prop="title" />
      <el-table-column label="模板所属行业的一级行业" align="center" prop="primaryIndustry" />
      <el-table-column label="模板所属行业的二级行业" align="center" prop="deputyIndustry" />
      <el-table-column label="模板内容" align="center" prop="content" />
      <el-table-column label="模板示例" align="center" prop="example" />
      <el-table-column label="使用名称" align="center" prop="modename" />
      <el-table-column label="参数设置" align="center" prop="modeparams" />
      <el-table-column label="状态" align="center" prop="status" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['xinhu-system:wotpl:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['xinhu-system:wotpl:remove']"
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

    <!-- 添加或修改微信公众号消息模版对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="模版消息id" prop="templateId">
          <el-input v-model="form.templateId" placeholder="请输入模版消息id" />
        </el-form-item>
        <el-form-item label="模板标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入模板标题" />
        </el-form-item>
        <el-form-item label="模板所属行业的一级行业" prop="primaryIndustry">
          <el-input v-model="form.primaryIndustry" placeholder="请输入模板所属行业的一级行业" />
        </el-form-item>
        <el-form-item label="模板所属行业的二级行业" prop="deputyIndustry">
          <el-input v-model="form.deputyIndustry" placeholder="请输入模板所属行业的二级行业" />
        </el-form-item>
        <el-form-item label="模板内容">
          <editor v-model="form.content" :min-height="192"/>
        </el-form-item>
        <el-form-item label="模板示例" prop="example">
          <el-input v-model="form.example" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="使用名称" prop="modename">
          <el-input v-model="form.modename" placeholder="请输入使用名称" />
        </el-form-item>
        <el-form-item label="参数设置" prop="modeparams">
          <el-input v-model="form.modeparams" type="textarea" placeholder="请输入内容" />
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
import { listWotpl, getWotpl, delWotpl, addWotpl, updateWotpl } from "@/api/xinhu-system/wotpl";

export default {
  name: "Wotpl",
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
      // 微信公众号消息模版表格数据
      wotplList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        templateId: null,
        title: null,
        primaryIndustry: null,
        deputyIndustry: null,
        content: null,
        example: null,
        modename: null,
        modeparams: null,
        status: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        templateId: [
          { required: true, message: "模版消息id不能为空", trigger: "blur" }
        ],
        title: [
          { required: true, message: "模板标题不能为空", trigger: "blur" }
        ],
        primaryIndustry: [
          { required: true, message: "模板所属行业的一级行业不能为空", trigger: "blur" }
        ],
        deputyIndustry: [
          { required: true, message: "模板所属行业的二级行业不能为空", trigger: "blur" }
        ],
        content: [
          { required: true, message: "模板内容不能为空", trigger: "blur" }
        ],
        example: [
          { required: true, message: "模板示例不能为空", trigger: "blur" }
        ],
        modename: [
          { required: true, message: "使用名称不能为空", trigger: "blur" }
        ],
        modeparams: [
          { required: true, message: "参数设置不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "状态不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询微信公众号消息模版列表 */
    getList() {
      this.loading = true;
      listWotpl(this.queryParams).then(response => {
        this.wotplList = response.rows;
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
        templateId: null,
        title: null,
        primaryIndustry: null,
        deputyIndustry: null,
        content: null,
        example: null,
        modename: null,
        modeparams: null,
        status: 0
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
      this.title = "添加微信公众号消息模版";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getWotpl(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改微信公众号消息模版";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateWotpl(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addWotpl(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除微信公众号消息模版编号为"' + ids + '"的数据项？').then(function() {
        return delWotpl(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('xinhu-system/wotpl/export', {
        ...this.queryParams
      }, `wotpl_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
