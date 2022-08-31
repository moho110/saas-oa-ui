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
      <el-form-item label="${comment}" prop="pid">
        <el-input
          v-model="queryParams.pid"
          placeholder="请输入${comment}"
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
      <el-form-item label="排序号" prop="sort">
        <el-input
          v-model="queryParams.sort"
          placeholder="请输入排序号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="${comment}" prop="values">
        <el-input
          v-model="queryParams.values"
          placeholder="请输入${comment}"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="${comment}" prop="valid">
        <el-input
          v-model="queryParams.valid"
          placeholder="请输入${comment}"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="${comment}" prop="optdt">
        <el-date-picker clearable size="small"
          v-model="queryParams.optdt"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择${comment}">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="${comment}" prop="optid">
        <el-input
          v-model="queryParams.optid"
          placeholder="请输入${comment}"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="${comment}" prop="receid">
        <el-input
          v-model="queryParams.receid"
          placeholder="请输入${comment}"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="${comment}" prop="recename">
        <el-input
          v-model="queryParams.recename"
          placeholder="请输入${comment}"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="说明" prop="explain">
        <el-input
          v-model="queryParams.explain"
          placeholder="请输入说明"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="所属单位id" prop="comid">
        <el-input
          v-model="queryParams.comid"
          placeholder="请输入所属单位id"
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
          v-hasPermi="['xinhu-system:option:add']"
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
          v-hasPermi="['xinhu-system:option:edit']"
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
          v-hasPermi="['xinhu-system:option:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['xinhu-system:option:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="optionList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="${comment}" align="center" prop="id" />
      <el-table-column label="名称" align="center" prop="name" />
      <el-table-column label="选项类型" align="center" prop="type" />
      <el-table-column label="${comment}" align="center" prop="pid" />
      <el-table-column label="编号" align="center" prop="num" />
      <el-table-column label="对应值" align="center" prop="value" />
      <el-table-column label="排序号" align="center" prop="sort" />
      <el-table-column label="${comment}" align="center" prop="values" />
      <el-table-column label="${comment}" align="center" prop="valid" />
      <el-table-column label="${comment}" align="center" prop="optdt" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.optdt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="${comment}" align="center" prop="optid" />
      <el-table-column label="${comment}" align="center" prop="receid" />
      <el-table-column label="${comment}" align="center" prop="recename" />
      <el-table-column label="说明" align="center" prop="explain" />
      <el-table-column label="所属单位id" align="center" prop="comid" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['xinhu-system:option:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['xinhu-system:option:remove']"
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

    <!-- 添加或修改系统选项对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="${comment}" prop="pid">
          <el-input v-model="form.pid" placeholder="请输入${comment}" />
        </el-form-item>
        <el-form-item label="编号" prop="num">
          <el-input v-model="form.num" placeholder="请输入编号" />
        </el-form-item>
        <el-form-item label="对应值" prop="value">
          <el-input v-model="form.value" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="排序号" prop="sort">
          <el-input v-model="form.sort" placeholder="请输入排序号" />
        </el-form-item>
        <el-form-item label="${comment}" prop="values">
          <el-input v-model="form.values" placeholder="请输入${comment}" />
        </el-form-item>
        <el-form-item label="${comment}" prop="valid">
          <el-input v-model="form.valid" placeholder="请输入${comment}" />
        </el-form-item>
        <el-form-item label="${comment}" prop="optdt">
          <el-date-picker clearable size="small"
            v-model="form.optdt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择${comment}">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="${comment}" prop="optid">
          <el-input v-model="form.optid" placeholder="请输入${comment}" />
        </el-form-item>
        <el-form-item label="${comment}" prop="receid">
          <el-input v-model="form.receid" placeholder="请输入${comment}" />
        </el-form-item>
        <el-form-item label="${comment}" prop="recename">
          <el-input v-model="form.recename" placeholder="请输入${comment}" />
        </el-form-item>
        <el-form-item label="说明" prop="explain">
          <el-input v-model="form.explain" placeholder="请输入说明" />
        </el-form-item>
        <el-form-item label="所属单位id" prop="comid">
          <el-input v-model="form.comid" placeholder="请输入所属单位id" />
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
import { listOption, getOption, delOption, addOption, updateOption } from "@/api/xinhu-system/option";

export default {
  name: "Option",
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
      // 系统选项表格数据
      optionList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: null,
        type: null,
        pid: null,
        num: null,
        value: null,
        sort: null,
        values: null,
        valid: null,
        optdt: null,
        optid: null,
        receid: null,
        recename: null,
        explain: null,
        comid: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [
          { required: true, message: "名称不能为空", trigger: "blur" }
        ],
        type: [
          { required: true, message: "选项类型不能为空", trigger: "change" }
        ],
        pid: [
          { required: true, message: "$comment不能为空", trigger: "blur" }
        ],
        num: [
          { required: true, message: "编号不能为空", trigger: "blur" }
        ],
        value: [
          { required: true, message: "对应值不能为空", trigger: "blur" }
        ],
        sort: [
          { required: true, message: "排序号不能为空", trigger: "blur" }
        ],
        values: [
          { required: true, message: "$comment不能为空", trigger: "blur" }
        ],
        valid: [
          { required: true, message: "$comment不能为空", trigger: "blur" }
        ],
        optdt: [
          { required: true, message: "$comment不能为空", trigger: "blur" }
        ],
        optid: [
          { required: true, message: "$comment不能为空", trigger: "blur" }
        ],
        receid: [
          { required: true, message: "$comment不能为空", trigger: "blur" }
        ],
        recename: [
          { required: true, message: "$comment不能为空", trigger: "blur" }
        ],
        explain: [
          { required: true, message: "说明不能为空", trigger: "blur" }
        ],
        comid: [
          { required: true, message: "所属单位id不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询系统选项列表 */
    getList() {
      this.loading = true;
      listOption(this.queryParams).then(response => {
        this.optionList = response.rows;
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
        type: null,
        pid: null,
        num: null,
        value: null,
        sort: null,
        values: null,
        valid: null,
        optdt: null,
        optid: null,
        receid: null,
        recename: null,
        explain: null,
        comid: null
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
      this.title = "添加系统选项";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getOption(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改系统选项";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateOption(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addOption(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除系统选项编号为"' + ids + '"的数据项？').then(function() {
        return delOption(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('xinhu-system/option/export', {
        ...this.queryParams
      }, `option_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
