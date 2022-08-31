<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="${comment}" prop="personname">
        <el-input
          v-model="queryParams.personname"
          placeholder="请输入${comment}"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="人员id" prop="personid">
        <el-input
          v-model="queryParams.personid"
          placeholder="请输入人员id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-input
          v-model="queryParams.gender"
          placeholder="请输入性别"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="关联用户ID" prop="uid">
        <el-input
          v-model="queryParams.uid"
          placeholder="请输入关联用户ID"
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
          v-hasPermi="['xinhu-system:renlian:add']"
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
          v-hasPermi="['xinhu-system:renlian:edit']"
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
          v-hasPermi="['xinhu-system:renlian:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['xinhu-system:renlian:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="renlianList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="${comment}" align="center" prop="id" />
      <el-table-column label="${comment}" align="center" prop="personname" />
      <el-table-column label="人员id" align="center" prop="personid" />
      <el-table-column label="性别" align="center" prop="gender" />
      <el-table-column label="包含的人脸照片列表" align="center" prop="faceids" />
      <el-table-column label="是否启用" align="center" prop="status" />
      <el-table-column label="关联用户ID" align="center" prop="uid" />
      <el-table-column label="人脸图片" align="center" prop="imgurl" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['xinhu-system:renlian:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['xinhu-system:renlian:remove']"
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

    <!-- 添加或修改人脸识别对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="${comment}" prop="personname">
          <el-input v-model="form.personname" placeholder="请输入${comment}" />
        </el-form-item>
        <el-form-item label="人员id" prop="personid">
          <el-input v-model="form.personid" placeholder="请输入人员id" />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-input v-model="form.gender" placeholder="请输入性别" />
        </el-form-item>
        <el-form-item label="包含的人脸照片列表" prop="faceids">
          <el-input v-model="form.faceids" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="关联用户ID" prop="uid">
          <el-input v-model="form.uid" placeholder="请输入关联用户ID" />
        </el-form-item>
        <el-form-item label="人脸图片" prop="imgurl">
          <el-input v-model="form.imgurl" type="textarea" placeholder="请输入内容" />
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
import { listRenlian, getRenlian, delRenlian, addRenlian, updateRenlian } from "@/api/xinhu-system/renlian";

export default {
  name: "Renlian",
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
      // 人脸识别表格数据
      renlianList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        personname: null,
        personid: null,
        gender: null,
        faceids: null,
        status: null,
        uid: null,
        imgurl: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        personname: [
          { required: true, message: "$comment不能为空", trigger: "blur" }
        ],
        personid: [
          { required: true, message: "人员id不能为空", trigger: "blur" }
        ],
        gender: [
          { required: true, message: "性别不能为空", trigger: "blur" }
        ],
        faceids: [
          { required: true, message: "包含的人脸照片列表不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "是否启用不能为空", trigger: "blur" }
        ],
        uid: [
          { required: true, message: "关联用户ID不能为空", trigger: "blur" }
        ],
        imgurl: [
          { required: true, message: "人脸图片不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询人脸识别列表 */
    getList() {
      this.loading = true;
      listRenlian(this.queryParams).then(response => {
        this.renlianList = response.rows;
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
        personname: null,
        personid: null,
        gender: null,
        faceids: null,
        status: 0,
        uid: null,
        imgurl: null
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
      this.title = "添加人脸识别";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getRenlian(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改人脸识别";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateRenlian(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addRenlian(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除人脸识别编号为"' + ids + '"的数据项？').then(function() {
        return delRenlian(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('xinhu-system/renlian/export', {
        ...this.queryParams
      }, `renlian_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
