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
      <el-form-item label="打卡wifi名" prop="wifiname">
        <el-input
          v-model="queryParams.wifiname"
          placeholder="请输入打卡wifi名"
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
          v-hasPermi="['xinhu-hr:kqdw:add']"
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
          v-hasPermi="['xinhu-hr:kqdw:edit']"
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
          v-hasPermi="['xinhu-hr:kqdw:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['xinhu-hr:kqdw:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="kqdwList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="名称" align="center" prop="name" />
      <el-table-column label="X坐标" align="center" prop="locationX" />
      <el-table-column label="Y坐标" align="center" prop="locationY" />
      <el-table-column label="位置名称" align="center" prop="address" />
      <el-table-column label="允许误差米" align="center" prop="precision" />
      <el-table-column label="范围" align="center" prop="scale" />
      <el-table-column label="打卡wifi名" align="center" prop="wifiname" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['xinhu-hr:kqdw:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['xinhu-hr:kqdw:remove']"
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

    <!-- 添加或修改考勤定位规则对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="X坐标" prop="locationX">
          <el-input v-model="form.locationX" placeholder="请输入X坐标" />
        </el-form-item>
        <el-form-item label="Y坐标" prop="locationY">
          <el-input v-model="form.locationY" placeholder="请输入Y坐标" />
        </el-form-item>
        <el-form-item label="位置名称" prop="address">
          <el-input v-model="form.address" placeholder="请输入位置名称" />
        </el-form-item>
        <el-form-item label="允许误差米" prop="precision">
          <el-input v-model="form.precision" placeholder="请输入允许误差米" />
        </el-form-item>
        <el-form-item label="范围" prop="scale">
          <el-input v-model="form.scale" placeholder="请输入范围" />
        </el-form-item>
        <el-form-item label="打卡wifi名" prop="wifiname">
          <el-input v-model="form.wifiname" placeholder="请输入打卡wifi名" />
        </el-form-item>
        <el-form-item label="是否为无固定地点" prop="iswgd">
          <el-radio v-model="form.iswgd" label="1">是</el-radio>
          <el-radio v-model="form.iswgd" label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="关联对应ID,实现多点定位" prop="dwids">
          <el-input v-model="form.dwids" placeholder="请输入关联对应ID,实现多点定位" />
        </el-form-item>
        <el-form-item label="是否需要拍照才能打卡" prop="ispz">
          <el-radio v-model="form.ispz" label="1">是</el-radio>
          <el-radio v-model="form.ispz" label="0">否</el-radio>
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
import { listKqdw, getKqdw, delKqdw, addKqdw, updateKqdw } from "@/api/xinhu-hr/kqdw";

export default {
  name: "Kqdw",
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
      // 考勤定位规则表格数据
      kqdwList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: null,
        locationX: null,
        locationY: null,
        address: null,
        precision: null,
        scale: null,
        wifiname: null,
        iswgd: null,
        dwids: null,
        ispz: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [
          { required: true, message: "名称不能为空", trigger: "blur" }
        ],
        locationX: [
          { required: true, message: "X坐标不能为空", trigger: "blur" }
        ],
        locationY: [
          { required: true, message: "Y坐标不能为空", trigger: "blur" }
        ],
        address: [
          { required: true, message: "位置名称不能为空", trigger: "blur" }
        ],
        precision: [
          { required: true, message: "允许误差米不能为空", trigger: "blur" }
        ],
        scale: [
          { required: true, message: "范围不能为空", trigger: "blur" }
        ],
        wifiname: [
          { required: true, message: "打卡wifi名不能为空", trigger: "blur" }
        ],
        iswgd: [
          { required: true, message: "是否为无固定地点不能为空", trigger: "blur" }
        ],
        dwids: [
          { required: true, message: "关联对应ID,实现多点定位不能为空", trigger: "blur" }
        ],
        ispz: [
          { required: true, message: "是否需要拍照才能打卡不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询考勤定位规则列表 */
    getList() {
      this.loading = true;
      listKqdw(this.queryParams).then(response => {
        this.kqdwList = response.rows;
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
        locationX: null,
        locationY: null,
        address: null,
        precision: null,
        scale: null,
        wifiname: null,
        iswgd: null,
        dwids: null,
        ispz: null
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
      this.title = "添加考勤定位规则";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getKqdw(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改考勤定位规则";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateKqdw(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addKqdw(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除考勤定位规则编号为"' + ids + '"的数据项？').then(function() {
        return delKqdw(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('xinhu-hr/kqdw/export', {
        ...this.queryParams
      }, `kqdw_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
