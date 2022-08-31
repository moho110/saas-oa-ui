<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="状态名称" prop="ztname">
        <el-input
          v-model="queryParams.ztname"
          placeholder="请输入状态名称"
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
          v-hasPermi="['xinhu-hr:kqanay:add']"
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
          v-hasPermi="['xinhu-hr:kqanay:edit']"
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
          v-hasPermi="['xinhu-hr:kqanay:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['xinhu-hr:kqanay:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="kqanayList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="日期" align="center" prop="dt" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.dt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态名称" align="center" prop="ztname" />
      <el-table-column label="状态名称" align="center" prop="state" />
      <el-table-column label="其他状态,如请假" align="center" prop="states" />
      <el-table-column label="操作时间" align="center" prop="optdt" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.optdt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['xinhu-hr:kqanay:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['xinhu-hr:kqanay:remove']"
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

    <!-- 添加或修改考勤分析对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="180px">
        <el-form-item label="日期" prop="dt">
          <el-date-picker clearable size="small"
            v-model="form.dt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="人员id" prop="uid">
          <el-input v-model="form.uid" placeholder="请输入人员id" />
        </el-form-item>
        <el-form-item label="状态名称" prop="ztname">
          <el-input v-model="form.ztname" placeholder="请输入状态名称" />
        </el-form-item>
        <el-form-item label="时间" prop="time">
          <el-date-picker clearable size="small"
            v-model="form.time"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="状态名称" prop="state">
          <el-input v-model="form.state" placeholder="请输入状态名称" />
        </el-form-item>
        <el-form-item label="其他状态,如请假" prop="states">
          <el-input v-model="form.states" placeholder="请输入其他状态,如请假" />
        </el-form-item>
        <el-form-item label="排序号" prop="sort">
          <el-input v-model="form.sort" placeholder="请输入排序号" />
        </el-form-item>
        <el-form-item label="是否工作日" prop="iswork">
          <el-radio v-model="form.iswork" label="1">是</el-radio>
          <el-radio v-model="form.iswork" label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="秒数" prop="emiao">
          <el-input v-model="form.emiao" placeholder="请输入秒数" />
        </el-form-item>
        <el-form-item label="操作时间" prop="optdt">
          <el-date-picker clearable size="small"
            v-model="form.optdt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择操作时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
        </el-form-item>
        <el-form-item label="应上班时间(小时)" prop="timesb">
          <el-input v-model="form.timesb" placeholder="请输入应上班时间(小时)" />
        </el-form-item>
        <el-form-item label="已上班时间(小时)" prop="timeys">
          <el-input v-model="form.timeys" placeholder="请输入已上班时间(小时)" />
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
import { listKqanay, getKqanay, delKqanay, addKqanay, updateKqanay } from "@/api/xinhu-hr/kqanay";

export default {
  name: "Kqanay",
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
      // 考勤分析表格数据
      kqanayList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        dt: null,
        uid: null,
        ztname: null,
        time: null,
        state: null,
        states: null,
        sort: null,
        iswork: null,
        emiao: null,
        optdt: null,
        timesb: null,
        timeys: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        dt: [
          { required: true, message: "日期不能为空", trigger: "blur" }
        ],
        uid: [
          { required: true, message: "人员id不能为空", trigger: "blur" }
        ],
        ztname: [
          { required: true, message: "状态名称不能为空", trigger: "blur" }
        ],
        time: [
          { required: true, message: "时间不能为空", trigger: "blur" }
        ],
        state: [
          { required: true, message: "状态名称不能为空", trigger: "blur" }
        ],
        states: [
          { required: true, message: "其他状态,如请假不能为空", trigger: "blur" }
        ],
        sort: [
          { required: true, message: "排序号不能为空", trigger: "blur" }
        ],
        iswork: [
          { required: true, message: "是否工作日不能为空", trigger: "blur" }
        ],
        emiao: [
          { required: true, message: "秒数不能为空", trigger: "blur" }
        ],
        optdt: [
          { required: true, message: "操作时间不能为空", trigger: "blur" }
        ],
        remark: [
          { required: true, message: "备注不能为空", trigger: "blur" }
        ],
        timesb: [
          { required: true, message: "应上班时间(小时)不能为空", trigger: "blur" }
        ],
        timeys: [
          { required: true, message: "已上班时间(小时)不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询考勤分析列表 */
    getList() {
      this.loading = true;
      listKqanay(this.queryParams).then(response => {
        this.kqanayList = response.rows;
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
        dt: null,
        uid: null,
        ztname: null,
        time: null,
        state: null,
        states: null,
        sort: null,
        iswork: null,
        emiao: null,
        optdt: null,
        remark: null,
        timesb: null,
        timeys: null
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
      this.title = "添加考勤分析";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getKqanay(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改考勤分析";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateKqanay(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addKqanay(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除考勤分析编号为"' + ids + '"的数据项？').then(function() {
        return delKqanay(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('xinhu-hr/kqanay/export', {
        ...this.queryParams
      }, `kqanay_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
