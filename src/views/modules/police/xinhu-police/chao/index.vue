<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="对应表" prop="tables">
        <el-input
          v-model="queryParams.table"
          placeholder="请输入对应表"
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
          v-hasPermi="['xinhu-police:chao:add']"
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
          v-hasPermi="['xinhu-police:chao:edit']"
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
          v-hasPermi="['xinhu-police:chao:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['xinhu-police:chao:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="chaoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="对应表" align="center" prop="tables" />
      <el-table-column label="人员Id" align="center" prop="uid" />
      <el-table-column label="抄送给" align="center" prop="csname" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['xinhu-police:chao:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['xinhu-police:chao:remove']"
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

    <!-- 添加或修改抄送对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="180px">
        <el-form-item label="规型ID" prop="modeid">
          <el-input v-model="form.modeid" placeholder="请输入规型ID" />
        </el-form-item>
        <el-form-item label="对应表" prop="tables">
          <el-input v-model="form.table" placeholder="请输入对应表" />
        </el-form-item>
        <el-form-item label="对应记录Id" prop="mid">
          <el-input v-model="form.mid" placeholder="请输入对应记录Id" />
        </el-form-item>
        <el-form-item label="人员Id" prop="uid">
          <el-input v-model="form.uid" placeholder="请输入人员Id" />
        </el-form-item>
        <el-form-item label="抄送给" prop="csname">
          <el-input v-model="form.csname" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="抄送给ID" prop="csnameid">
          <el-input v-model="form.csnameid" placeholder="请输入抄送给ID" />
        </el-form-item>
        <el-form-item label="类型" prop="types">
          <el-radio v-model="form.types" label="1">关注</el-radio>
          <el-radio v-model="form.types" label="0">抄送</el-radio>
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
import { listChao, getChao, delChao, addChao, updateChao } from "@/api/xinhu-police/chao";

export default {
  name: "Chao",
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
      // 抄送表格数据
      chaoList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        modeid: null,
        table: null,
        mid: null,
        uid: null,
        csname: null,
        csnameid: null,
        type: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        modeid: [
          { required: true, message: "模型ID不能为空", trigger: "blur" }
        ],
        tables: [
          { required: true, message: "对应表不能为空", trigger: "blur" }
        ],
        mid: [
          { required: true, message: "对应记录Id不能为空", trigger: "blur" }
        ],
        uid: [
          { required: true, message: "人员Id不能为空", trigger: "blur" }
        ],
        csname: [
          { required: true, message: "抄送给不能为空", trigger: "blur" }
        ],
        csnameid: [
          { required: true, message: "抄送人ID不能为空", trigger: "blur" }
        ],
        types: [
          { required: true, message: "0抄送,1关注不能为空", trigger: "change" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询抄送列表 */
    getList() {
      this.loading = true;
      listChao(this.queryParams).then(response => {
        this.chaoList = response.rows;
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
        modeid: null,
        table: null,
        mid: null,
        uid: null,
        csname: null,
        csnameid: null,
        type: null
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
      this.title = "添加抄送";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getChao(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改抄送";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateChao(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addChao(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除抄送编号为"' + ids + '"的数据项？').then(function() {
        return delChao(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('xinhu-police/chao/export', {
        ...this.queryParams
      }, `chao_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
