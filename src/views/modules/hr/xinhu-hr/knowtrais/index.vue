<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="考试时间" prop="kssdt">
        <el-date-picker clearable size="small"
          v-model="queryParams.kssdt"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择考试时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="考试结束时间" prop="ksedt">
        <el-date-picker clearable size="small"
          v-model="queryParams.ksedt"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择考试结束时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="得分" prop="fenshu">
        <el-input
          v-model="queryParams.fenshu"
          placeholder="请输入得分"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="考试时间(秒数)" prop="kstime">
        <el-input
          v-model="queryParams.kstime"
          placeholder="请输入考试时间(秒数)"
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
          v-hasPermi="['xinhu-hr:knowtrais:add']"
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
          v-hasPermi="['xinhu-hr:knowtrais:edit']"
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
          v-hasPermi="['xinhu-hr:knowtrais:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['xinhu-hr:knowtrais:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="knowtraisList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="主表ID" align="center" prop="mid" />
      <el-table-column label="用户ID" align="center" prop="uid" />
      <el-table-column label="考试时间" align="center" prop="kssdt" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.kssdt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="考试结束时间" align="center" prop="ksedt" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.ksedt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['xinhu-hr:knowtrais:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['xinhu-hr:knowtrais:remove']"
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

    <!-- 添加或修改考试培训子对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="10px">
        <el-form-item label="主表ID" prop="mid">
          <el-input v-model="form.mid" placeholder="请输入主表ID" />
        </el-form-item>
        <el-form-item label="用户ID" prop="uid">
          <el-input v-model="form.uid" placeholder="请输入用户ID" />
        </el-form-item>
        <el-form-item label="考试时间" prop="kssdt">
          <el-date-picker clearable size="small"
            v-model="form.kssdt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择考试时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="考试结束时间" prop="ksedt">
          <el-date-picker clearable size="small"
            v-model="form.ksedt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择考试结束时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="得分" prop="fenshu">
          <el-input v-model="form.fenshu" placeholder="请输入得分" />
        </el-form-item>
        <el-form-item label="考试时间(秒数)" prop="kstime">
          <el-input v-model="form.kstime" placeholder="请输入考试时间(秒数)" />
        </el-form-item>
        <el-form-item label="是否已考试" prop="isks">
          <el-radio v-model="form.isks" label="1">是</el-radio>
          <el-radio v-model="form.isks" label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="考试题目id" prop="tkids">
          <el-input v-model="form.tkids" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="我做题得到答案" prop="dyids">
          <el-input v-model="form.dyids" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="答题结果0未答,1正确,2错误" prop="dyjgs">
          <el-input v-model="form.dyjgs" type="textarea" placeholder="请输入内容" />
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
import { listKnowtrais, getKnowtrais, delKnowtrais, addKnowtrais, updateKnowtrais } from "@/api/xinhu-hr/knowtrais";

export default {
  name: "Knowtrais",
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
      // 考试培训子表格数据
      knowtraisList: [],
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
        kssdt: null,
        ksedt: null,
        fenshu: null,
        kstime: null,
        isks: null,
        tkids: null,
        dyids: null,
        dyjgs: null,
        comid: null
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
        kssdt: [
          { required: true, message: "考试时间不能为空", trigger: "blur" }
        ],
        ksedt: [
          { required: true, message: "考试结束时间不能为空", trigger: "blur" }
        ],
        fenshu: [
          { required: true, message: "得分不能为空", trigger: "blur" }
        ],
        kstime: [
          { required: true, message: "考试时间(秒数)不能为空", trigger: "blur" }
        ],
        isks: [
          { required: true, message: "是否已考试不能为空", trigger: "blur" }
        ],
        tkids: [
          { required: true, message: "考试题目id不能为空", trigger: "blur" }
        ],
        dyids: [
          { required: true, message: "我做题得到答案不能为空", trigger: "blur" }
        ],
        dyjgs: [
          { required: true, message: "答题结果0未答,1正确,2错误不能为空", trigger: "blur" }
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
    /** 查询考试培训子列表 */
    getList() {
      this.loading = true;
      listKnowtrais(this.queryParams).then(response => {
        this.knowtraisList = response.rows;
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
        kssdt: null,
        ksedt: null,
        fenshu: null,
        kstime: null,
        isks: null,
        tkids: null,
        dyids: null,
        dyjgs: null,
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
      this.title = "添加考试培训子";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getKnowtrais(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改考试培训子";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateKnowtrais(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addKnowtrais(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除考试培训子编号为"' + ids + '"的数据项？').then(function() {
        return delKnowtrais(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('xinhu-hr/knowtrais/export', {
        ...this.queryParams
      }, `knowtrais_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
