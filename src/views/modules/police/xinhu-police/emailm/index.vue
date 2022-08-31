<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="主题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入主题"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="发送人" prop="sendname">
        <el-input
          v-model="queryParams.sendname"
          placeholder="请输入发送人"
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
          v-hasPermi="['xinhu-police:emailm:add']"
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
          v-hasPermi="['xinhu-police:emailm:edit']"
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
          v-hasPermi="['xinhu-police:emailm:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['xinhu-police:emailm:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="emailmList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="用户iD" align="center" prop="uid" />
      <el-table-column label="主题" align="center" prop="title" />
      <el-table-column label="邮件内容" align="center" prop="content" />
      <el-table-column label="发送人" align="center" prop="sendname" />
      <el-table-column label="发送时间" align="center" prop="senddt" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.senddt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作时间" align="center" prop="optdt" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.optdt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="${comment}" align="center" prop="numoi" />
      <el-table-column label="对应单位id" align="center" prop="comid" />
      <el-table-column label="外发状态" align="center" prop="outzt" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['xinhu-police:emailm:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['xinhu-police:emailm:remove']"
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

    <!-- 添加或修改邮件主对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="180px">
        <el-form-item label="用户iD" prop="uid">
          <el-input v-model="form.uid" placeholder="请输入用户iD" />
        </el-form-item>
        <el-form-item label="主题" prop="title">
          <el-input v-model="form.title" placeholder="请输入主题" />
        </el-form-item>
        <el-form-item label="邮件内容">
          <editor v-model="form.content" :min-height="192"/>
        </el-form-item>
        <el-form-item label="发送人ID" prop="sendid">
          <el-input v-model="form.sendid" placeholder="请输入发送人ID" />
        </el-form-item>
        <el-form-item label="发送人" prop="sendname">
          <el-input v-model="form.sendname" placeholder="请输入发送人" />
        </el-form-item>
        <el-form-item label="发送时间" prop="senddt">
          <el-date-picker clearable size="small"
            v-model="form.senddt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择发送时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="接收人ID" prop="receid">
          <el-input v-model="form.receid" type="textarea" placeholder="请输入接收人ID" />
        </el-form-item>
        <el-form-item label="接收人" prop="recename">
          <el-input v-model="form.recename" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="是否发送" prop="isturn">
          <el-radio v-model="form.isturn" label="1">是</el-radio>
          <el-radio v-model="form.isturn" label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="@回复id" prop="hid">
          <el-input v-model="form.hid" placeholder="请输入@回复id" />
        </el-form-item>
        <el-form-item label="@是否有附件">
          <el-radio v-model="form.isfile" label="1">是</el-radio>
          <el-radio v-model="form.isfile" label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="申请时间" prop="applydt">
          <el-date-picker clearable size="small"
            v-model="form.applydt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择申请时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="邮件Id" prop="messageId">
          <el-input v-model="form.messageId" placeholder="请输入邮件Id" />
        </el-form-item>
        <el-form-item label="发送人邮件" prop="fromemail">
          <el-input v-model="form.fromemail" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="发给邮件人" prop="toemail">
          <el-input v-model="form.toemail" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="回复邮件" prop="replyToemail">
          <el-input v-model="form.replyToemail" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="抄送给" prop="ccemail">
          <el-input v-model="form.ccemail" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="邮件大小" prop="size">
          <el-input v-model="form.size" placeholder="请输入邮件大小" />
        </el-form-item>
        <el-form-item label="抄送给" prop="ccname">
          <el-input v-model="form.ccname" placeholder="请输入抄送给" />
        </el-form-item>
        <el-form-item label="抄送给ID" prop="ccid">
          <el-input v-model="form.ccid" placeholder="请输入抄送给ID" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-radio v-model="form.type" label="1">用邮件外发</el-radio>
          <el-radio v-model="form.type" label="0">内部邮件</el-radio>
        </el-form-item>
        <el-form-item label="操作时间" prop="optdt">
          <el-date-picker clearable size="small"
            v-model="form.optdt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择操作时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="numoi" prop="numoi">
          <el-input v-model="form.numoi" placeholder="请输入numoi" />
        </el-form-item>
        <el-form-item label="对应单位id" prop="comid">
          <el-input v-model="form.comid" placeholder="请输入对应单位id" />
        </el-form-item>
        <el-form-item label="外发状态" prop="outzt">
          <el-input v-model="form.outzt" placeholder="请输入外发状态" />
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
import { listEmailm, getEmailm, delEmailm, addEmailm, updateEmailm } from "@/api/xinhu-police/emailm";

export default {
  name: "Emailm",
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
      // 邮件主表格数据
      emailmList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        uid: null,
        title: null,
        content: null,
        sendid: null,
        sendname: null,
        senddt: null,
        receid: null,
        recename: null,
        isturn: null,
        hid: null,
        isfile: null,
        applydt: null,
        messageId: null,
        fromemail: null,
        toemail: null,
        replyToemail: null,
        ccemail: null,
        size: null,
        ccname: null,
        ccid: null,
        type: null,
        optdt: null,
        numoi: null,
        comid: null,
        outzt: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        uid: [
          { required: true, message: "用户iD不能为空", trigger: "blur" }
        ],
        title: [
          { required: true, message: "主题不能为空", trigger: "blur" }
        ],
        content: [
          { required: true, message: "邮件内容不能为空", trigger: "blur" }
        ],
        sendid: [
          { required: true, message: "发送ID不能为空", trigger: "blur" }
        ],
        sendname: [
          { required: true, message: "发送人不能为空", trigger: "blur" }
        ],
        senddt: [
          { required: true, message: "发送时间不能为空", trigger: "blur" }
        ],
        receid: [
          { required: true, message: "接收人ID不能为空", trigger: "blur" }
        ],
        recename: [
          { required: true, message: "接收人不能为空", trigger: "blur" }
        ],
        isturn: [
          { required: true, message: "@0|草稿,1|已发送不能为空", trigger: "blur" }
        ],
        hid: [
          { required: true, message: "@回复id不能为空", trigger: "blur" }
        ],
        isfile: [
          { required: true, message: "@是否有附件不能为空", trigger: "blur" }
        ],
        applydt: [
          { required: true, message: "申请时间不能为空", trigger: "blur" }
        ],
        messageId: [
          { required: true, message: "邮件Id不能为空", trigger: "blur" }
        ],
        fromemail: [
          { required: true, message: "发送人邮件不能为空", trigger: "blur" }
        ],
        toemail: [
          { required: true, message: "发给邮件人不能为空", trigger: "blur" }
        ],
        replyToemail: [
          { required: true, message: "回复邮件不能为空", trigger: "blur" }
        ],
        ccemail: [
          { required: true, message: "抄送给不能为空", trigger: "blur" }
        ],
        size: [
          { required: true, message: "邮件大小不能为空", trigger: "blur" }
        ],
        ccname: [
          { required: true, message: "抄送给不能为空", trigger: "blur" }
        ],
        ccid: [
          { required: true, message: "抄送ID不能为空", trigger: "blur" }
        ],
        type: [
          { required: true, message: "0内部邮件,1用邮件外发不能为空", trigger: "change" }
        ],
        optdt: [
          { required: true, message: "操作时间不能为空", trigger: "blur" }
        ],
        numoi: [
          { required: true, message: "numoi不能为空", trigger: "blur" }
        ],
        comid: [
          { required: true, message: "对应单位id不能为空", trigger: "blur" }
        ],
        outzt: [
          { required: true, message: "外发状态不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询邮件主列表 */
    getList() {
      this.loading = true;
      listEmailm(this.queryParams).then(response => {
        this.emailmList = response.rows;
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
        title: null,
        content: null,
        sendid: null,
        sendname: null,
        senddt: null,
        receid: null,
        recename: null,
        isturn: null,
        hid: null,
        isfile: null,
        applydt: null,
        messageId: null,
        fromemail: null,
        toemail: null,
        replyToemail: null,
        ccemail: null,
        size: null,
        ccname: null,
        ccid: null,
        type: null,
        optdt: null,
        numoi: null,
        comid: null,
        outzt: null
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
      this.title = "添加邮件主";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getEmailm(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改邮件主";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateEmailm(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addEmailm(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除邮件主编号为"' + ids + '"的数据项？').then(function() {
        return delEmailm(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('xinhu-police/emailm/export', {
        ...this.queryParams
      }, `emailm_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
