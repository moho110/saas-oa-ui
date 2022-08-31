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
          v-hasPermi="['xinhu-system:logintoken:add']"
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
          v-hasPermi="['xinhu-system:logintoken:edit']"
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
          v-hasPermi="['xinhu-system:logintoken:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['xinhu-system:logintoken:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="logintokenList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="用户ID" align="center" prop="uid" />
      <el-table-column label="名称" align="center" prop="name" />
      <el-table-column label="token" align="center" prop="token" />
      <el-table-column label="设备" align="center" prop="device" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['xinhu-system:logintoken:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['xinhu-system:logintoken:remove']"
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

    <!-- 添加或修改系统登录token对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="180px">
        <el-form-item label="用户ID" prop="uid">
          <el-input v-model="form.uid" placeholder="请输入用户ID" />
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="token" prop="token">
          <el-input v-model="form.token" placeholder="请输入token" />
        </el-form-item>
        <el-form-item label="添加时间" prop="adddt">
          <el-date-picker clearable size="small"
            v-model="form.adddt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择添加时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="日期" prop="moddt">
          <el-date-picker clearable size="small"
            v-model="form.moddt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="来自" prop="cfrom">
          <el-input v-model="form.cfrom" placeholder="请输入来自" />
        </el-form-item>
        <el-form-item label="设备" prop="device">
          <el-input v-model="form.device" placeholder="请输入设备" />
        </el-form-item>
        <el-form-item label="IP地址" prop="ip">
          <el-input v-model="form.ip" type="textarea" placeholder="请输入IP地址" />
        </el-form-item>
        <el-form-item label="web页面" prop="web">
          <el-input v-model="form.web" placeholder="请输入web页面" />
        </el-form-item>
        <el-form-item label="是否在线" prop="online">
          <el-radio v-model="form.online" label="1">是</el-radio>
          <el-radio v-model="form.online" label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="是否可推送" prop="ispush">
          <el-radio v-model="form.ispush" label="1">是</el-radio>
          <el-radio v-model="form.ispush" label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="推送token" prop="pushtoken">
          <el-input v-model="form.pushtoken" placeholder="请输入推送token" />
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
import { listLogintoken, getLogintoken, delLogintoken, addLogintoken, updateLogintoken } from "@/api/xinhu-system/logintoken";

export default {
  name: "Logintoken",
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
      // 系统登录token表格数据
      logintokenList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        uid: null,
        name: null,
        token: null,
        adddt: null,
        moddt: null,
        cfrom: null,
        device: null,
        ip: null,
        web: null,
        online: null,
        ispush: null,
        pushtoken: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        uid: [
          { required: true, message: "用户ID不能为空", trigger: "blur" }
        ],
        name: [
          { required: true, message: "名称不能为空", trigger: "blur" }
        ],
        token: [
          { required: true, message: "token不能为空", trigger: "blur" }
        ],
        adddt: [
          { required: true, message: "添加日期不能为空", trigger: "blur" }
        ],
        moddt: [
          { required: true, message: "mod日期不能为空", trigger: "blur" }
        ],
        cfrom: [
          { required: true, message: "来自不能为空", trigger: "blur" }
        ],
        device: [
          { required: true, message: "设备不能为空", trigger: "blur" }
        ],
        ip: [
          { required: true, message: "IP地址不能为空", trigger: "blur" }
        ],
        web: [
          { required: true, message: "web页面不能为空", trigger: "blur" }
        ],
        online: [
          { required: true, message: "是否在线不能为空", trigger: "blur" }
        ],
        ispush: [
          { required: true, message: "是否可推送不能为空", trigger: "blur" }
        ],
        pushtoken: [
          { required: true, message: "推送token不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询系统登录token列表 */
    getList() {
      this.loading = true;
      listLogintoken(this.queryParams).then(response => {
        this.logintokenList = response.rows;
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
        uid: null,
        name: null,
        token: null,
        adddt: null,
        moddt: null,
        cfrom: null,
        device: null,
        ip: null,
        web: null,
        online: null,
        ispush: null,
        pushtoken: null
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
      this.title = "添加系统登录token";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getLogintoken(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改系统登录token";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateLogintoken(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addLogintoken(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除系统登录token编号为"' + ids + '"的数据项？').then(function() {
        return delLogintoken(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('xinhu-system/logintoken/export', {
        ...this.queryParams
      }, `logintoken_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
