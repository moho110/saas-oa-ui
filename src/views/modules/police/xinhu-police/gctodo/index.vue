<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="操作人" prop="optname">
        <el-input
          v-model="queryParams.optname"
          placeholder="请输入操作人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="工程名称" prop="pgcname">
        <el-input
          v-model="queryParams.pgcname"
          placeholder="请输入工程名称"
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
          v-hasPermi="['xinhu-police:gctodo:add']"
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
          v-hasPermi="['xinhu-police:gctodo:edit']"
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
          v-hasPermi="['xinhu-police:gctodo:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['xinhu-police:gctodo:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="gctodoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="操作时间" align="center" prop="optdt" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.optdt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作人" align="center" prop="optname" />
      <el-table-column label="申请日期" align="center" prop="applydt" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.applydt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="工程名称" align="center" prop="pgcname" />
      <el-table-column label="巡检员" align="center" prop="selren" />
      <el-table-column label="巡检地方" align="center" prop="weizhi" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['xinhu-police:gctodo:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['xinhu-police:gctodo:remove']"
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

    <!-- 添加或修改工程通知对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="180px">
        <el-form-item label="用户ID" prop="uid">
          <el-input v-model="form.uid" placeholder="请输入用户ID" />
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
        <el-form-item label="操作人" prop="optname">
          <el-input v-model="form.optname" placeholder="请输入操作人" />
        </el-form-item>
        <el-form-item label="申请日期" prop="applydt">
          <el-date-picker clearable size="small"
            v-model="form.applydt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择申请日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="说明" prop="content">
          <el-input v-model="form.content" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio v-model="form.status" label="1">良好</el-radio>
          <el-radio v-model="form.status" label="0">一般</el-radio>
        </el-form-item>
        <el-form-item label="是否提交" prop="isturn">
          <el-radio v-model="form.isturn" label="1">是</el-radio>
          <el-radio v-model="form.isturn" label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="对应单位id" prop="comid">
          <el-input v-model="form.comid" placeholder="请输入对应单位id" />
        </el-form-item>
        <el-form-item label="类型" prop="djtype">
          <el-radio v-model="form.djtype" label="1">特殊</el-radio>
          <el-radio v-model="form.djtype" label="0">一般</el-radio>
        </el-form-item>
        <el-form-item label="日期" prop="djdt">
          <el-date-picker clearable size="small"
            v-model="form.djdt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="对应项目" prop="pgcid">
          <el-input v-model="form.pgcid" placeholder="请输入对应项目" />
        </el-form-item>
        <el-form-item label="工程名称" prop="pgcname">
          <el-input v-model="form.pgcname" placeholder="请输入工程名称" />
        </el-form-item>
        <el-form-item label="巡检员" prop="selren">
          <el-input v-model="form.selren" placeholder="请输入巡检员" />
        </el-form-item>
        <el-form-item label="巡检员的ID" prop="selrenid">
          <el-input v-model="form.selrenid" placeholder="请输入巡检员的ID" />
        </el-form-item>
        <el-form-item label="巡检地方" prop="weizhi">
          <el-input v-model="form.weizhi" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="检查情况" prop="qingkuan">
          <el-input v-model="form.qingkuan" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="预防措施" prop="cuoshi">
          <el-input v-model="form.cuoshi" type="textarea" placeholder="请输入内容" />
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
import { listGctodo, getGctodo, delGctodo, addGctodo, updateGctodo } from "@/api/xinhu-police/gctodo";

export default {
  name: "Gctodo",
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
      // 工程通知表格数据
      gctodoList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        uid: null,
        optdt: null,
        optid: null,
        optname: null,
        applydt: null,
        content: null,
        status: null,
        isturn: null,
        comid: null,
        djtype: null,
        djdt: null,
        pgcid: null,
        pgcname: null,
        selren: null,
        selrenid: null,
        weizhi: null,
        qingkuan: null,
        cuoshi: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        uid: [
          { required: true, message: "用户ID不能为空", trigger: "blur" }
        ],
        optdt: [
          { required: true, message: "操作时间不能为空", trigger: "blur" }
        ],
        optid: [
          { required: true, message: "操作人ID不能为空", trigger: "blur" }
        ],
        optname: [
          { required: true, message: "操作人不能为空", trigger: "blur" }
        ],
        applydt: [
          { required: true, message: "申请日期不能为空", trigger: "blur" }
        ],
        content: [
          { required: true, message: "说明不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "状态不能为空", trigger: "blur" }
        ],
        isturn: [
          { required: true, message: "是否提交不能为空", trigger: "blur" }
        ],
        comid: [
          { required: true, message: "对应单位id不能为空", trigger: "blur" }
        ],
        djtype: [
          { required: true, message: "类型不能为空", trigger: "change" }
        ],
        djdt: [
          { required: true, message: "日期不能为空", trigger: "blur" }
        ],
        pgcid: [
          { required: true, message: "对应项目不能为空", trigger: "blur" }
        ],
        pgcname: [
          { required: true, message: "工程名称不能为空", trigger: "blur" }
        ],
        selren: [
          { required: true, message: "巡检员不能为空", trigger: "blur" }
        ],
        selrenid: [
          { required: true, message: "巡检员的ID不能为空", trigger: "blur" }
        ],
        weizhi: [
          { required: true, message: "巡检地方不能为空", trigger: "blur" }
        ],
        qingkuan: [
          { required: true, message: "检查情况不能为空", trigger: "blur" }
        ],
        cuoshi: [
          { required: true, message: "预防措施不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询工程通知列表 */
    getList() {
      this.loading = true;
      listGctodo(this.queryParams).then(response => {
        this.gctodoList = response.rows;
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
        optdt: null,
        optid: null,
        optname: null,
        applydt: null,
        content: null,
        status: 0,
        isturn: null,
        comid: null,
        djtype: null,
        djdt: null,
        pgcid: null,
        pgcname: null,
        selren: null,
        selrenid: null,
        weizhi: null,
        qingkuan: null,
        cuoshi: null
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
      this.title = "添加工程通知";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getGctodo(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改工程通知";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateGctodo(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addGctodo(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除工程通知编号为"' + ids + '"的数据项？').then(function() {
        return delGctodo(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('xinhu-police/gctodo/export', {
        ...this.queryParams
      }, `gctodo_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
