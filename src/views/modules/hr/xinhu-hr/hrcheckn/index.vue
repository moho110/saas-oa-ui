<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="评分项目" prop="itemname">
        <el-input
          v-model="queryParams.itemname"
          placeholder="请输入评分项目"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="评分名称" prop="pfname">
        <el-input
          v-model="queryParams.pfname"
          placeholder="请输入评分名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="评分分数" prop="fenshu">
        <el-input
          v-model="queryParams.fenshu"
          placeholder="请输入评分分数"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="评分人" prop="optname">
        <el-input
          v-model="queryParams.optname"
          placeholder="请输入评分人"
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
          v-hasPermi="['xinhu-hr:hrcheckn:add']"
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
          v-hasPermi="['xinhu-hr:hrcheckn:edit']"
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
          v-hasPermi="['xinhu-hr:hrcheckn:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['xinhu-hr:hrcheckn:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="hrchecknList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="评分项目" align="center" prop="itemname" />
      <el-table-column label="评分名称" align="center" prop="pfname" />
      <el-table-column label="评分分数" align="center" prop="fenshu" />
      <el-table-column label="评分人" align="center" prop="optname" />
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
            v-hasPermi="['xinhu-hr:hrcheckn:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['xinhu-hr:hrcheckn:remove']"
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

    <!-- 添加或修改考核评分记录对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="180px">
        <el-form-item label="评分项目" prop="itemname">
          <el-input v-model="form.itemname" placeholder="请输入评分项目" />
        </el-form-item>
        <el-form-item label="评分名称" prop="pfname">
          <el-input v-model="form.pfname" placeholder="请输入评分名称" />
        </el-form-item>
        <el-form-item label="对应主表hrcheck.id" prop="mid">
          <el-input v-model="form.mid" placeholder="请输入对应主表hrcheck.id" />
        </el-form-item>
        <el-form-item label="排序号" prop="sort">
          <el-input v-model="form.sort" placeholder="请输入排序号" />
        </el-form-item>
        <el-form-item label="对应hrchecks.id" prop="sid">
          <el-input v-model="form.sid" placeholder="请输入对应hrchecks.id" />
        </el-form-item>
        <el-form-item label="评分分数" prop="fenshu">
          <el-input v-model="form.fenshu" placeholder="请输入评分分数" />
        </el-form-item>
        <el-form-item label="权重" prop="weight">
          <el-input v-model="form.weight" placeholder="请输入权重" />
        </el-form-item>
        <el-form-item label="操作人ID" prop="optid">
          <el-input v-model="form.optid" placeholder="请输入操作人ID" />
        </el-form-item>
        <el-form-item label="评分人" prop="optname">
          <el-input v-model="form.optname" placeholder="请输入评分人" />
        </el-form-item>
        <el-form-item label="操作时间" prop="optdt">
          <el-date-picker clearable size="small"
            v-model="form.optdt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择操作时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="最后得分" prop="defen">
          <el-input v-model="form.defen" placeholder="请输入最后得分" />
        </el-form-item>
        <el-form-item label="关联评分hrkaohen.Id" prop="pfid">
          <el-input v-model="form.pfid" placeholder="请输入关联评分hrkaohen.Id" />
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
import { listHrcheckn, getHrcheckn, delHrcheckn, addHrcheckn, updateHrcheckn } from "@/api/xinhu-hr/hrcheckn";

export default {
  name: "Hrcheckn",
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
      // 考核评分记录表格数据
      hrchecknList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        itemname: null,
        pfname: null,
        mid: null,
        sort: null,
        sid: null,
        fenshu: null,
        weight: null,
        optid: null,
        optname: null,
        optdt: null,
        defen: null,
        pfid: null,
        comid: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        itemname: [
          { required: true, message: "评分项目不能为空", trigger: "blur" },
          { min: 3, max: 100, message: '长度在 3 到 100 个字符', trigger: 'blur' }
        ],
        pfname: [
          { required: true, message: "评分名称不能为空", trigger: "blur" },
          { min: 3, max: 100, message: '长度在 3 到 100 个字符', trigger: 'blur' }
        ],
        mid: [
          { required: true, message: "对应主表hrcheck.id不能为空", trigger: "blur" }
        ],
        sort: [
          { required: true, message: "排序号不能为空", trigger: "blur" }
        ],
        sid: [
          { required: true, message: "对应hrchecks.id不能为空", trigger: "blur" }
        ],
        fenshu: [
          { required: true, message: "评分分数不能为空", trigger: "blur" }
        ],
        weight: [
          { required: true, message: "权重不能为空", trigger: "blur" }
        ],
        optid: [
          { required: true, message: "$comment不能为空", trigger: "blur" }
        ],
        optname: [
          { required: true, message: "评分人不能为空", trigger: "blur" },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        optdt: [
          { required: true, message: "操作时间不能为空", trigger: "blur" },
          { type: 'date', required: true, message: '请选择操作时间', trigger: 'change' }
        ],
        defen: [
          { required: true, message: "最后得分不能为空", trigger: "blur" }
        ],
        pfid: [
          { required: true, message: "关联评分hrkaohen.Id不能为空", trigger: "blur" }
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
    /** 查询考核评分记录列表 */
    getList() {
      this.loading = true;
      listHrcheckn(this.queryParams).then(response => {
        this.hrchecknList = response.rows;
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
        itemname: null,
        pfname: null,
        mid: null,
        sort: null,
        sid: null,
        fenshu: null,
        weight: null,
        optid: null,
        optname: null,
        optdt: null,
        defen: null,
        pfid: null,
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
      this.title = "添加考核评分记录";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getHrcheckn(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改考核评分记录";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateHrcheckn(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addHrcheckn(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除考核评分记录编号为"' + ids + '"的数据项？').then(function() {
        return delHrcheckn(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('xinhu-hr/hrcheckn/export', {
        ...this.queryParams
      }, `hrcheckn_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
