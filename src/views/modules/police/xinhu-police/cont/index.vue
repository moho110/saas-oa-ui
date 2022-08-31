<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="标题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入标题"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="添加人" prop="optname">
        <el-input
          v-model="queryParams.optname"
          placeholder="请输入添加人"
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
          v-hasPermi="['xinhu-police:cont:add']"
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
          v-hasPermi="['xinhu-police:cont:edit']"
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
          v-hasPermi="['xinhu-police:cont:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['xinhu-police:cont:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="contList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="标题" align="center" prop="title" />
      <el-table-column label="内容" align="center" prop="body" />
      <el-table-column label="接收人" align="center" prop="recename" />
      <el-table-column label="接收邮件" align="center" prop="receemail" />
      <el-table-column label="操作时间" align="center" prop="optdt" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.optdt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作人ID" align="center" prop="optid" />
      <el-table-column label="添加人" align="center" prop="optname" />
      <el-table-column label="发送时间" align="center" prop="senddt" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.senddt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['xinhu-police:cont:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['xinhu-police:cont:remove']"
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

    <!-- 添加或修改系统发送邮件内容对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="内容" prop="body">
          <el-input v-model="form.body" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="接收人ID" prop="receid">
          <el-input v-model="form.receid" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="接收人" prop="recename">
          <el-input v-model="form.recename" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="接收邮件" prop="receemail">
          <el-input v-model="form.receemail" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="操作时间" prop="optdt">
          <el-date-picker clearable size="small"
            v-model="form.optdt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择操作时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="操作人ID" prop="optid">
          <el-input v-model="form.optid" placeholder="请输入操作人ID" />
        </el-form-item>
        <el-form-item label="添加人" prop="optname">
          <el-input v-model="form.optname" placeholder="请输入添加人" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio v-model="form.status" label="0">待发送</el-radio>
          <el-radio v-model="form.status" label="1">成功</el-radio>
          <el-radio v-model="form.status" label="2">失败</el-radio>
        </el-form-item>
        <el-form-item label="发送时间" prop="senddt">
          <el-date-picker clearable size="small"
            v-model="form.senddt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择发送时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="抄送给" prop="ccname">
          <el-input v-model="form.ccname" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="抄送邮件" prop="ccemail">
          <el-input v-model="form.ccemail" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="附件路径" prop="attachpath">
          <el-input v-model="form.attachpath" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="附件名称" prop="attachname">
          <el-input v-model="form.attachname" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="emailm.id" prop="mid">
          <el-input v-model="form.mid" placeholder="请输入emailm.id" />
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
import { listCont, getCont, delCont, addCont, updateCont } from "@/api/xinhu-police/cont";

export default {
  name: "Cont",
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
      // 系统发送邮件内容表格数据
      contList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        title: null,
        body: null,
        receid: null,
        recename: null,
        receemail: null,
        optdt: null,
        optid: null,
        optname: null,
        status: null,
        senddt: null,
        ccname: null,
        ccemail: null,
        attachpath: null,
        attachname: null,
        mid: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        title: [
          { required: true, message: "标题不能为空", trigger: "blur" }
        ],
        body: [
          { required: true, message: "内容不能为空", trigger: "blur" }
        ],
        receid: [
          { required: true, message: "接收人ID不能为空", trigger: "blur" }
        ],
        recename: [
          { required: true, message: "接收人不能为空", trigger: "blur" }
        ],
        receemail: [
          { required: true, message: "接收邮件不能为空", trigger: "blur" }
        ],
        optdt: [
          { required: true, message: "操作时间不能为空", trigger: "blur" }
        ],
        optid: [
          { required: true, message: "操作人ID不能为空", trigger: "blur" }
        ],
        optname: [
          { required: true, message: "添加人不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "0待发送,1成功,2失败不能为空", trigger: "blur" }
        ],
        senddt: [
          { required: true, message: "发送时间不能为空", trigger: "blur" }
        ],
        ccname: [
          { required: true, message: "抄送给不能为空", trigger: "blur" }
        ],
        ccemail: [
          { required: true, message: "抄送邮件不能为空", trigger: "blur" }
        ],
        attachpath: [
          { required: true, message: "附件路径不能为空", trigger: "blur" }
        ],
        attachname: [
          { required: true, message: "附件名称不能为空", trigger: "blur" }
        ],
        mid: [
          { required: true, message: "emailm.id不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询系统发送邮件内容列表 */
    getList() {
      this.loading = true;
      listCont(this.queryParams).then(response => {
        this.contList = response.rows;
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
        title: null,
        body: null,
        receid: null,
        recename: null,
        receemail: null,
        optdt: null,
        optid: null,
        optname: null,
        status: 0,
        senddt: null,
        ccname: null,
        ccemail: null,
        attachpath: null,
        attachname: null,
        mid: null
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
      this.title = "添加系统发送邮件内容";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getCont(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改系统发送邮件内容";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateCont(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addCont(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除系统发送邮件内容编号为"' + ids + '"的数据项？').then(function() {
        return delCont(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('xinhu-police/cont/export', {
        ...this.queryParams
      }, `cont_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
