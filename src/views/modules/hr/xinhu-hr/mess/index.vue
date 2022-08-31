<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="对应文件Id" prop="fileid">
        <el-input
          v-model="queryParams.fileid"
          placeholder="请输入对应文件Id"
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
          v-hasPermi="['xinhu-hr:mess:add']"
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
          v-hasPermi="['xinhu-hr:mess:edit']"
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
          v-hasPermi="['xinhu-hr:mess:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['xinhu-hr:mess:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="messList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="操作时间" align="center" prop="optdt" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.optdt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="文件发送ID" align="center" prop="sendid" />
      <el-table-column label="相关地址" align="center" prop="url" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['xinhu-hr:mess:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['xinhu-hr:mess:remove']"
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

    <!-- 添加或修改IM聊天记录对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="180px">
        <el-form-item label="操作时间" prop="optdt">
          <el-date-picker clearable size="small"
            v-model="form.optdt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择操作时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="状态" prop="zt">
          <el-input v-model="form.zt" placeholder="请输入状态" />
        </el-form-item>
        <el-form-item label="内容" prop="cont">
          <el-input v-model="form.cont" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="发送ID" prop="sendid">
          <el-input v-model="form.sendid" placeholder="请输入发送ID" />
        </el-form-item>
        <el-form-item label="接收" prop="receid">
          <el-input v-model="form.receid" placeholder="请输入接收" />
        </el-form-item>
        <el-form-item label="接收用户id" prop="receuid">
          <el-input v-model="form.receuid" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="相关地址" prop="url">
          <el-input v-model="form.url" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="对应文件Id" prop="fileid">
          <el-input v-model="form.fileid" placeholder="请输入对应文件Id" />
        </el-form-item>
        <el-form-item label="消息ID" prop="msgid">
          <el-input v-model="form.msgid" placeholder="请输入${comment}" />
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
import { listMess, getMess, delMess, addMess, updateMess } from "@/api/xinhu-hr/mess";

export default {
  name: "Mess",
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
      // IM聊天记录表格数据
      messList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        optdt: null,
        zt: null,
        cont: null,
        sendid: null,
        receid: null,
        receuid: null,
        type: null,
        url: null,
        fileid: null,
        msgid: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        optdt: [
          { required: true, message: "操作时间不能为空", trigger: "blur" }
        ],
        zt: [
          { required: true, message: "状态不能为空", trigger: "blur" }
        ],
        cont: [
          { required: true, message: "内容不能为空", trigger: "blur" }
        ],
        sendid: [
          { required: true, message: "发送ID不能为空", trigger: "blur" }
        ],
        receid: [
          { required: true, message: "接收不能为空", trigger: "blur" }
        ],
        receuid: [
          { required: true, message: "接收用户id不能为空", trigger: "blur" }
        ],
        type: [
          { required: true, message: "信息类型不能为空", trigger: "change" }
        ],
        url: [
          { required: true, message: "相关地址不能为空", trigger: "blur" }
        ],
        fileid: [
          { required: true, message: "对应文件Id不能为空", trigger: "blur" }
        ],
        msgid: [
          { required: true, message: "消息ID不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询IM聊天记录列表 */
    getList() {
      this.loading = true;
      listMess(this.queryParams).then(response => {
        this.messList = response.rows;
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
        optdt: null,
        zt: null,
        cont: null,
        sendid: null,
        receid: null,
        receuid: null,
        type: null,
        url: null,
        fileid: null,
        msgid: null
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
      this.title = "添加IM聊天记录";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getMess(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改IM聊天记录";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateMess(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addMess(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除IM聊天记录编号为"' + ids + '"的数据项？').then(function() {
        return delMess(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('xinhu-hr/mess/export', {
        ...this.queryParams
      }, `mess_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
