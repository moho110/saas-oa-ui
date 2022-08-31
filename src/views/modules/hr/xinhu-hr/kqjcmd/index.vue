<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="设备ID" prop="snid">
        <el-input
          v-model="queryParams.snid"
          placeholder="请输入设备ID"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="请求时间" prop="qjtime">
        <el-date-picker clearable size="small"
          v-model="queryParams.qjtime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择请求时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="操作时间" prop="optdt">
        <el-date-picker clearable size="small"
          v-model="queryParams.optdt"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择操作时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="处理时间" prop="cjtime">
        <el-date-picker clearable size="small"
          v-model="queryParams.cjtime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择处理时间">
        </el-date-picker>
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
          v-hasPermi="['xinhu-hr:kqjcmd:add']"
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
          v-hasPermi="['xinhu-hr:kqjcmd:edit']"
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
          v-hasPermi="['xinhu-hr:kqjcmd:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['xinhu-hr:kqjcmd:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="kqjcmdList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="设备ID" align="center" prop="snid" />
      <el-table-column label="发送命令内容" align="center" prop="cmd" />
      <el-table-column label="运行状态0待运行,1已运行,2请求中" align="center" prop="status" />
      <el-table-column label="请求时间" align="center" prop="qjtime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.qjtime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作时间" align="center" prop="optdt" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.optdt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="处理时间" align="center" prop="cjtime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.cjtime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" align="center" prop="atype" />
      <el-table-column label="推送主键id" align="center" prop="others" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['xinhu-hr:kqjcmd:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['xinhu-hr:kqjcmd:remove']"
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

    <!-- 添加或修改考勤机命令发送对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="180px">
        <el-form-item label="设备ID" prop="snid">
          <el-input v-model="form.snid" placeholder="请输入设备ID" />
        </el-form-item>
        <el-form-item label="发送命令内容" prop="cmd">
          <el-input v-model="form.cmd" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="请求时间" prop="qjtime">
          <el-date-picker clearable size="small"
            v-model="form.qjtime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择请求时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="操作时间" prop="optdt">
          <el-date-picker clearable size="small"
            v-model="form.optdt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择操作时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="处理时间" prop="cjtime">
          <el-date-picker clearable size="small"
            v-model="form.cjtime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择处理时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="类型" prop="atype">
          <el-radio v-model="form.atype" label="1">特殊类型</el-radio>
          <el-radio v-model="form.atype" label="0">一般类型</el-radio>
        </el-form-item>
        <el-form-item label="推送主键id" prop="others">
          <el-input v-model="form.others" type="textarea" placeholder="请输入内容" />
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
import { listKqjcmd, getKqjcmd, delKqjcmd, addKqjcmd, updateKqjcmd } from "@/api/xinhu-hr/kqjcmd";

export default {
  name: "Kqjcmd",
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
      // 考勤机命令发送表格数据
      kqjcmdList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        snid: null,
        cmd: null,
        status: null,
        qjtime: null,
        optdt: null,
        cjtime: null,
        atype: null,
        others: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        snid: [
          { required: true, message: "设备ID不能为空", trigger: "blur" }
        ],
        cmd: [
          { required: true, message: "发送命令内容不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "运行状态0待运行,1已运行,2请求中不能为空", trigger: "blur" }
        ],
        qjtime: [
          { required: true, message: "请求时间不能为空", trigger: "blur" }
        ],
        optdt: [
          { required: true, message: "操作时间不能为空", trigger: "blur" }
        ],
        cjtime: [
          { required: true, message: "处理时间不能为空", trigger: "blur" }
        ],
        atype: [
          { required: true, message: "类型不能为空", trigger: "change" }
        ],
        others: [
          { required: true, message: "推送主键id不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询考勤机命令发送列表 */
    getList() {
      this.loading = true;
      listKqjcmd(this.queryParams).then(response => {
        this.kqjcmdList = response.rows;
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
        snid: null,
        cmd: null,
        status: 0,
        qjtime: null,
        optdt: null,
        cjtime: null,
        atype: null,
        others: null
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
      this.title = "添加考勤机命令发送";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getKqjcmd(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改考勤机命令发送";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateKqjcmd(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addKqjcmd(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除考勤机命令发送编号为"' + ids + '"的数据项？').then(function() {
        return delKqjcmd(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('xinhu-hr/kqjcmd/export', {
        ...this.queryParams
      }, `kqjcmd_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
