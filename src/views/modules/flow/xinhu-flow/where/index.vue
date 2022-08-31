<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="编号" prop="num">
        <el-input
          v-model="queryParams.num"
          placeholder="请输入编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="编号分组" prop="pnum">
        <el-input
          v-model="queryParams.pnum"
          placeholder="请输入编号分组"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="条件名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入条件名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="包含用户" prop="recename">
        <el-input
          v-model="queryParams.recename"
          placeholder="请输入包含用户"
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
          v-hasPermi="['xinhu-flow:where:add']"
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
          v-hasPermi="['xinhu-flow:where:edit']"
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
          v-hasPermi="['xinhu-flow:where:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['xinhu-flow:where:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="whereList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="对应模块" align="center" prop="setid" />
      <el-table-column label="编号" align="center" prop="num" />
      <el-table-column label="编号分组" align="center" prop="pnum" />
      <el-table-column label="条件名称" align="center" prop="name" />
      <el-table-column label="对应部门条件" align="center" prop="wheredstr" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['xinhu-flow:where:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['xinhu-flow:where:remove']"
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

    <!-- 添加或修改单据条件对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="220px">
        <el-form-item label="对应模块" prop="setid">
          <el-input v-model="form.setid" placeholder="请输入对应模块" />
        </el-form-item>
        <el-form-item label="编号" prop="num">
          <el-input v-model="form.num" placeholder="请输入编号" />
        </el-form-item>
        <el-form-item label="编号分组" prop="pnum">
          <el-input v-model="form.pnum" placeholder="请输入编号分组" />
        </el-form-item>
        <el-form-item label="条件名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入条件名称" />
        </el-form-item>
        <el-form-item label="对应表条件" prop="wheresstr">
          <el-input v-model="form.wheresstr" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="用户条件" prop="whereustr">
          <el-input v-model="form.whereustr" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="对应部门条件" prop="wheredstr">
          <el-input v-model="form.wheredstr" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="form.sort" placeholder="请输入排序" />
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input v-model="form.content" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="包含用户ID" prop="receid">
          <el-input v-model="form.receid" placeholder="请输入包含用户ID" />
        </el-form-item>
        <el-form-item label="包含用户" prop="recename">
          <el-input v-model="form.recename" placeholder="请输入包含用户" />
        </el-form-item>
        <el-form-item label="不包含用户ID" prop="nreceid">
          <el-input v-model="form.nreceid" placeholder="请输入不包含用户ID" />
        </el-form-item>
        <el-form-item label="不包含用户" prop="nrecename">
          <el-input v-model="form.nrecename" placeholder="请输入不包含用户" />
        </el-form-item>
        <el-form-item label="是否在生成列表页面上显示" prop="islb">
          <el-radio v-model="form.islb" label="1">是</el-radio>
          <el-radio v-model="form.islb" label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="此条件可适用对象ID" prop="syrid">
          <el-input v-model="form.syrid" placeholder="请输入此条件可适用对象ID" />
        </el-form-item>
        <el-form-item label="此条件可适用对象" prop="syrname">
          <el-input v-model="form.syrname" placeholder="请输入此条件可适用对象" />
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
import { listWhere, getWhere, delWhere, addWhere, updateWhere } from "@/api/xinhu-flow/where";

export default {
  name: "Where",
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
      // 单据条件表格数据
      whereList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        setid: null,
        num: null,
        pnum: null,
        name: null,
        wheresstr: null,
        whereustr: null,
        wheredstr: null,
        sort: null,
        content: null,
        receid: null,
        recename: null,
        nreceid: null,
        nrecename: null,
        islb: null,
        status: null,
        syrid: null,
        syrname: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        setid: [
          { required: true, message: "对应模块不能为空", trigger: "blur" }
        ],
        num: [
          { required: true, message: "编号不能为空", trigger: "blur" }
        ],
        pnum: [
          { required: true, message: "编号分组不能为空", trigger: "blur" }
        ],
        name: [
          { required: true, message: "条件名称不能为空", trigger: "blur" }
        ],
        wheresstr: [
          { required: true, message: "对应表条件不能为空", trigger: "blur" }
        ],
        whereustr: [
          { required: true, message: "用户条件不能为空", trigger: "blur" }
        ],
        wheredstr: [
          { required: true, message: "对应部门条件不能为空", trigger: "blur" }
        ],
        sort: [
          { required: true, message: "排序不能为空", trigger: "blur" }
        ],
        content: [
          { required: true, message: "内容不能为空", trigger: "blur" }
        ],
        receid: [
          { required: true, message: "包含用户ID不能为空", trigger: "blur" }
        ],
        recename: [
          { required: true, message: "包含用户不能为空", trigger: "blur" }
        ],
        nreceid: [
          { required: true, message: "不包含用户ID不能为空", trigger: "blur" }
        ],
        nrecename: [
          { required: true, message: "不包含用户不能为空", trigger: "blur" }
        ],
        islb: [
          { required: true, message: "是否在生成列表页面上显示不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "状态不能为空", trigger: "blur" }
        ],
        syrid: [
          { required: true, message: "此条件可适用对象ID不能为空", trigger: "blur" }
        ],
        syrname: [
          { required: true, message: "此条件可适用对象不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询单据条件列表 */
    getList() {
      this.loading = true;
      listWhere(this.queryParams).then(response => {
        this.whereList = response.rows;
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
        num: null,
        pnum: null,
        name: null,
        wheresstr: null,
        whereustr: null,
        wheredstr: null,
        sort: null,
        content: null,
        receid: null,
        recename: null,
        nreceid: null,
        nrecename: null,
        islb: null,
        status: 0,
        syrid: null,
        syrname: null
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
      this.title = "添加单据条件";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getWhere(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改单据条件";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateWhere(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addWhere(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除单据条件编号为"' + ids + '"的数据项？').then(function() {
        return delWhere(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('xinhu-flow/where/export', {
        ...this.queryParams
      }, `where_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
