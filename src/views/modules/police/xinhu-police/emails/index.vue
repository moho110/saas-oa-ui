<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="邮件" prop="email">
        <el-input
          v-model="queryParams.email"
          placeholder="请输入邮件"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="人员" prop="personal">
        <el-input
          v-model="queryParams.personal"
          placeholder="请输入人员"
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
          v-hasPermi="['xinhu-police:emails:add']"
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
          v-hasPermi="['xinhu-police:emails:edit']"
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
          v-hasPermi="['xinhu-police:emails:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['xinhu-police:emails:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="emailsList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="主表ID" align="center" prop="mid" />
      <el-table-column label="用户ID" align="center" prop="uid" />
      <el-table-column label="操作时间" align="center" prop="optdt" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.optdt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="电子邮件" align="center" prop="email" />
      <el-table-column label="人员" align="center" prop="personal" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['xinhu-police:emails:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['xinhu-police:emails:remove']"
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

    <!-- 添加或修改邮件子对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="180px">
        <el-form-item label="主表ID" prop="mid">
          <el-input v-model="form.mid" placeholder="请输入主表ID" />
        </el-form-item>
        <el-form-item label="用户ID" prop="uid">
          <el-input v-model="form.uid" placeholder="请输入用户ID" />
        </el-form-item>
        <el-form-item label="@0|未读,1|已读" prop="zt">
          <el-radio v-model="form.zt" label="0">未读</el-radio>
          <el-radio v-model="form.zt" label="1">已读</el-radio>
        </el-form-item>
        <el-form-item label="类型" prop="types">
          <el-radio v-model="form.types" label="0">接收</el-radio>
          <el-radio v-model="form.types" label="1">抄送</el-radio>
          <el-radio v-model="form.types" label="2">发送者</el-radio>
        </el-form-item>
        <el-form-item label="是否回复" prop="ishui">
          <el-radio v-model="form.ishui" label="0">否</el-radio>
          <el-radio v-model="form.ishui" label="1">是</el-radio>
        </el-form-item>
        <el-form-item label="@0|未删,1|已删" prop="isdel">
          <el-radio v-model="form.isdel" label="0">未删</el-radio>
          <el-radio v-model="form.isdel" label="1">已删</el-radio>
        </el-form-item>
        <el-form-item label="操作时间" prop="optdt">
          <el-date-picker clearable size="small"
            v-model="form.optdt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择操作时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="电子邮件" prop="email">
          <el-input v-model="form.email" placeholder="请输入电子邮件" />
        </el-form-item>
        <el-form-item label="人员" prop="personal">
          <el-input v-model="form.personal" placeholder="请输入人员" />
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
import { listEmails, getEmails, delEmails, addEmails, updateEmails } from "@/api/xinhu-police/emails";

export default {
  name: "Emails",
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
      // 邮件子表格数据
      emailsList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        mid: null,
        uid: null,
        zt: null,
        types: null,
        ishui: null,
        isdel: null,
        optdt: null,
        email: null,
        personal: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        mid: [
          { required: true, message: "主表ID不能为空", trigger: "blur" }
        ],
        uid: [
          { required: true, message: "用户ID不能为空", trigger: "blur" }
        ],
        zt: [
          { required: true, message: "@0|未读,1|已读不能为空", trigger: "blur" }
        ],
        types: [
          { required: true, message: "0接收,1抄送,2发送者不能为空", trigger: "change" }
        ],
        ishui: [
          { required: true, message: "是否回复不能为空", trigger: "blur" }
        ],
        isdel: [
          { required: true, message: "@0|未删,1|已删不能为空", trigger: "blur" }
        ],
        optdt: [
          { required: true, message: "操作时间不能为空", trigger: "blur" }
        ],
        email: [
          { required: true, message: "电子邮件不能为空", trigger: "blur" }
        ],
        personal: [
          { required: true, message: "人员不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询邮件子列表 */
    getList() {
      this.loading = true;
      listEmails(this.queryParams).then(response => {
        this.emailsList = response.rows;
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
        uid: null,
        zt: null,
        types: null,
        ishui: null,
        isdel: null,
        optdt: null,
        email: null,
        personal: null
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
      this.title = "添加邮件子";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getEmails(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改邮件子";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateEmails(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addEmails(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除邮件子编号为"' + ids + '"的数据项？').then(function() {
        return delEmails(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('xinhu-police/emails/export', {
        ...this.queryParams
      }, `emails_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
