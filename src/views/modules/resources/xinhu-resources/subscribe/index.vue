<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="订阅标题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入订阅标题"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="操作人" prop="optname">
        <el-input
          v-model="queryParams.optname"
          placeholder="请输入操作人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="操作时间" prop="optdt">
        <el-date-picker clearable size="small"
          v-model="queryParams.optdt"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择操作时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="最后运行时间" prop="lastdt">
        <el-date-picker clearable size="small"
          v-model="queryParams.lastdt"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择最后运行时间">
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
          v-hasPermi="['xinhu-resources:subscribe:add']"
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
          v-hasPermi="['xinhu-resources:subscribe:edit']"
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
          v-hasPermi="['xinhu-resources:subscribe:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['xinhu-resources:subscribe:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="subscribeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="订阅标题" align="center" prop="title" />
      <el-table-column label="订阅时提醒内容" align="center" prop="cont" />
      <el-table-column label="订阅说明" align="center" prop="explain" />
      <el-table-column label="操作人ID" align="center" prop="optid" />
      <el-table-column label="操作人" align="center" prop="optname" />
      <el-table-column label="最后运行时间" align="center" prop="lastdt" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.lastdt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['xinhu-resources:subscribe:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['xinhu-resources:subscribe:remove']"
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

    <!-- 添加或修改订阅管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="180px">
        <el-form-item label="订阅标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入订阅标题" />
        </el-form-item>
        <el-form-item label="订阅时提醒内容" prop="cont">
          <el-input v-model="form.cont" placeholder="请输入订阅时提醒内容" />
        </el-form-item>
        <el-form-item label="订阅说明" prop="content">
          <el-input v-model="form.content" placeholder="请输入订阅说明" />
        </el-form-item>
        <el-form-item label="操作人ID" prop="optid">
          <el-input v-model="form.optid" placeholder="请输入操作人ID" />
        </el-form-item>
        <el-form-item label="操作人" prop="optname">
          <el-input v-model="form.optname" placeholder="请输入操作人" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio v-model="form.status" label="1">良好</el-radio>
          <el-radio v-model="form.status" label="0">一般</el-radio>
        </el-form-item>
        <el-form-item label="操作时间" prop="optdt">
          <el-date-picker clearable size="small"
            v-model="form.optdt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择操作时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="订阅地址" prop="suburl">
          <el-input v-model="form.suburl" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="订阅地址post参数" prop="suburlpost">
          <el-input v-model="form.suburlpost" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="最后运行时间" prop="lastdt">
          <el-date-picker clearable size="small"
            v-model="form.lastdt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择最后运行时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="共享给" prop="shateid">
          <el-input v-model="form.shateid" placeholder="请输入共享给" />
        </el-form-item>
        <el-form-item label="共享给" prop="shatename">
          <el-input v-model="form.shatename" placeholder="请输入共享给" />
        </el-form-item>
        <el-form-item label="对应单位id" prop="comid">
          <el-input v-model="form.comid" placeholder="请输入对应单位id" />
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
import { listSubscribe, getSubscribe, delSubscribe, addSubscribe, updateSubscribe } from "@/api/xinhu-resources/subscribe";

export default {
  name: "Subscribe",
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
      // 订阅管理表格数据
      subscribeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        title: null,
        cont: null,
        content: null,
        optid: null,
        optname: null,
        optdt: null,
        status: null,
        suburl: null,
        suburlpost: null,
        lastdt: null,
        shateid: null,
        shatename: null,
        comid: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        title: [
          { required: true, message: "订阅标题不能为空", trigger: "blur" },
          { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' }
        ],
        cont: [
          { required: true, message: "订阅时提醒内容不能为空", trigger: "blur" },
          { min: 3, max: 200, message: '长度在 3 到 200 个字符', trigger: 'blur' }
        ],
        content: [
          { required: true, message: "订阅说明不能为空", trigger: "blur" },
          { min: 3, max: 100, message: '长度在 3 到 100 个字符', trigger: 'blur' }
        ],
        optid: [
          { required: true, message: "操作人ID不能为空", trigger: "blur" }
        ],
        optname: [
          { required: true, message: "操作人不能为空", trigger: "blur" },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        optdt: [
          { required: true, message: "操作时间不能为空", trigger: "blur" },
          { type: 'date', required: true, message: '请选择操作时间', trigger: 'change' }
        ],
        status: [
          { required: true, message: "状态不能为空", trigger: "blur" }
        ],
        suburl: [
          { required: true, message: "订阅地址不能为空", trigger: "blur" },
          { min: 3, max: 500, message: '长度在 3 到 500 个字符', trigger: 'blur' }
        ],
        suburlpost: [
          { required: true, message: "订阅地址post参数不能为空", trigger: "blur" },
          { min: 3, max: 4000, message: '长度在 3 到 4000 个字符', trigger: 'blur' }
        ],
        lastdt: [
          { required: true, message: "最后运行时间不能为空", trigger: "blur" },
          { type: 'date', required: true, message: '请选择最后运行时间', trigger: 'change' }
        ],
        shateid: [
          { required: true, message: "共享给ID不能为空", trigger: "blur" },
          { min: 3, max: 300, message: '长度在 3 到 300 个字符', trigger: 'blur' }
        ],
        shatename: [
          { required: true, message: "共享给不能为空", trigger: "blur" },
          { min: 3, max: 300, message: '长度在 3 到 300 个字符', trigger: 'blur' }
        ],
        comid: [
          { required: true, message: "对应单位id不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询订阅管理列表 */
    getList() {
      this.loading = true;
      listSubscribe(this.queryParams).then(response => {
        this.subscribeList = response.rows;
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
        cont: null,
        content: null,
        optid: null,
        optname: null,
        optdt: null,
        status: 0,
        suburl: null,
        suburlpost: null,
        lastdt: null,
        shateid: null,
        shatename: null,
        comid: null
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
      this.title = "添加订阅管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getSubscribe(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改订阅管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateSubscribe(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addSubscribe(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除订阅管理编号为"' + ids + '"的数据项？').then(function() {
        return delSubscribe(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('xinhu-resources/subscribe/export', {
        ...this.queryParams
      }, `subscribe_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
