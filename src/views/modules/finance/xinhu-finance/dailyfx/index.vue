<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="应写次数" prop="totaly">
        <el-input
          v-model="queryParams.totaly"
          placeholder="请输入应写次数"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="已写次数" prop="totalx">
        <el-input
          v-model="queryParams.totalx"
          placeholder="请输入已写次数"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="未写次数" prop="totalw">
        <el-input
          v-model="queryParams.totalw"
          placeholder="请输入未写次数"
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
          v-hasPermi="['xinhu-finance:dailyfx:add']"
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
          v-hasPermi="['xinhu-finance:dailyfx:edit']"
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
          v-hasPermi="['xinhu-finance:dailyfx:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['xinhu-finance:dailyfx:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="dailyfxList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="用户ID" align="center" prop="uid" />
      <el-table-column label="月份" align="center" prop="month" />
      <el-table-column label="分析时间" align="center" prop="optdt" width="180">
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
            v-hasPermi="['xinhu-finance:dailyfx:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['xinhu-finance:dailyfx:remove']"
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

    <!-- 添加或修改日报分析统计对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="${comment}" prop="uid">
          <el-input v-model="form.uid" placeholder="请输入${comment}" />
        </el-form-item>
        <el-form-item label="月份" prop="month">
          <el-input v-model="form.month" placeholder="请输入月份" />
        </el-form-item>
        <el-form-item label="分析时间" prop="optdt">
          <el-date-picker clearable size="small"
            v-model="form.optdt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择分析时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="0未写,1已写,2请假,3休息日" prop="day1">
          <el-input v-model="form.day1" placeholder="请输入0未写,1已写,2请假,3休息日" />
        </el-form-item>
        <el-form-item label="${comment}" prop="day2">
          <el-input v-model="form.day2" placeholder="请输入${comment}" />
        </el-form-item>
        <el-form-item label="${comment}" prop="day3">
          <el-input v-model="form.day3" placeholder="请输入${comment}" />
        </el-form-item>
        <el-form-item label="${comment}" prop="day4">
          <el-input v-model="form.day4" placeholder="请输入${comment}" />
        </el-form-item>
        <el-form-item label="${comment}" prop="day5">
          <el-input v-model="form.day5" placeholder="请输入${comment}" />
        </el-form-item>
        <el-form-item label="${comment}" prop="day6">
          <el-input v-model="form.day6" placeholder="请输入${comment}" />
        </el-form-item>
        <el-form-item label="${comment}" prop="day7">
          <el-input v-model="form.day7" placeholder="请输入${comment}" />
        </el-form-item>
        <el-form-item label="${comment}" prop="day8">
          <el-input v-model="form.day8" placeholder="请输入${comment}" />
        </el-form-item>
        <el-form-item label="${comment}" prop="day9">
          <el-input v-model="form.day9" placeholder="请输入${comment}" />
        </el-form-item>
        <el-form-item label="${comment}" prop="day10">
          <el-input v-model="form.day10" placeholder="请输入${comment}" />
        </el-form-item>
        <el-form-item label="${comment}" prop="day11">
          <el-input v-model="form.day11" placeholder="请输入${comment}" />
        </el-form-item>
        <el-form-item label="${comment}" prop="day12">
          <el-input v-model="form.day12" placeholder="请输入${comment}" />
        </el-form-item>
        <el-form-item label="${comment}" prop="day13">
          <el-input v-model="form.day13" placeholder="请输入${comment}" />
        </el-form-item>
        <el-form-item label="${comment}" prop="day14">
          <el-input v-model="form.day14" placeholder="请输入${comment}" />
        </el-form-item>
        <el-form-item label="${comment}" prop="day15">
          <el-input v-model="form.day15" placeholder="请输入${comment}" />
        </el-form-item>
        <el-form-item label="${comment}" prop="day16">
          <el-input v-model="form.day16" placeholder="请输入${comment}" />
        </el-form-item>
        <el-form-item label="${comment}" prop="day17">
          <el-input v-model="form.day17" placeholder="请输入${comment}" />
        </el-form-item>
        <el-form-item label="${comment}" prop="day18">
          <el-input v-model="form.day18" placeholder="请输入${comment}" />
        </el-form-item>
        <el-form-item label="${comment}" prop="day19">
          <el-input v-model="form.day19" placeholder="请输入${comment}" />
        </el-form-item>
        <el-form-item label="${comment}" prop="day20">
          <el-input v-model="form.day20" placeholder="请输入${comment}" />
        </el-form-item>
        <el-form-item label="${comment}" prop="day21">
          <el-input v-model="form.day21" placeholder="请输入${comment}" />
        </el-form-item>
        <el-form-item label="${comment}" prop="day22">
          <el-input v-model="form.day22" placeholder="请输入${comment}" />
        </el-form-item>
        <el-form-item label="${comment}" prop="day23">
          <el-input v-model="form.day23" placeholder="请输入${comment}" />
        </el-form-item>
        <el-form-item label="${comment}" prop="day24">
          <el-input v-model="form.day24" placeholder="请输入${comment}" />
        </el-form-item>
        <el-form-item label="${comment}" prop="day25">
          <el-input v-model="form.day25" placeholder="请输入${comment}" />
        </el-form-item>
        <el-form-item label="${comment}" prop="day26">
          <el-input v-model="form.day26" placeholder="请输入${comment}" />
        </el-form-item>
        <el-form-item label="${comment}" prop="day27">
          <el-input v-model="form.day27" placeholder="请输入${comment}" />
        </el-form-item>
        <el-form-item label="${comment}" prop="day28">
          <el-input v-model="form.day28" placeholder="请输入${comment}" />
        </el-form-item>
        <el-form-item label="${comment}" prop="day29">
          <el-input v-model="form.day29" placeholder="请输入${comment}" />
        </el-form-item>
        <el-form-item label="${comment}" prop="day30">
          <el-input v-model="form.day30" placeholder="请输入${comment}" />
        </el-form-item>
        <el-form-item label="${comment}" prop="day31">
          <el-input v-model="form.day31" placeholder="请输入${comment}" />
        </el-form-item>
        <el-form-item label="应写次数" prop="totaly">
          <el-input v-model="form.totaly" placeholder="请输入应写次数" />
        </el-form-item>
        <el-form-item label="已写次数" prop="totalx">
          <el-input v-model="form.totalx" placeholder="请输入已写次数" />
        </el-form-item>
        <el-form-item label="未写次数" prop="totalw">
          <el-input v-model="form.totalw" placeholder="请输入未写次数" />
        </el-form-item>
        <el-form-item label="说明" prop="explain">
          <el-input v-model="form.explain" placeholder="请输入说明" />
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
import { listDailyfx, getDailyfx, delDailyfx, addDailyfx, updateDailyfx } from "@/api/xinhu-finance/dailyfx";

export default {
  name: "Dailyfx",
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
      // 日报分析统计表格数据
      dailyfxList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        uid: null,
        month: null,
        optdt: null,
        day1: null,
        day2: null,
        day3: null,
        day4: null,
        day5: null,
        day6: null,
        day7: null,
        day8: null,
        day9: null,
        day10: null,
        day11: null,
        day12: null,
        day13: null,
        day14: null,
        day15: null,
        day16: null,
        day17: null,
        day18: null,
        day19: null,
        day20: null,
        day21: null,
        day22: null,
        day23: null,
        day24: null,
        day25: null,
        day26: null,
        day27: null,
        day28: null,
        day29: null,
        day30: null,
        day31: null,
        totaly: null,
        totalx: null,
        totalw: null,
        explain: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        uid: [
          { required: true, message: "$comment不能为空", trigger: "blur" }
        ],
        month: [
          { required: true, message: "月份不能为空", trigger: "blur" }
        ],
        optdt: [
          { required: true, message: "分析时间不能为空", trigger: "blur" }
        ],
        day1: [
          { required: true, message: "0未写,1已写,2请假,3休息日不能为空", trigger: "blur" }
        ],
        day2: [
          { required: true, message: "$comment不能为空", trigger: "blur" }
        ],
        day3: [
          { required: true, message: "$comment不能为空", trigger: "blur" }
        ],
        day4: [
          { required: true, message: "$comment不能为空", trigger: "blur" }
        ],
        day5: [
          { required: true, message: "$comment不能为空", trigger: "blur" }
        ],
        day6: [
          { required: true, message: "$comment不能为空", trigger: "blur" }
        ],
        day7: [
          { required: true, message: "$comment不能为空", trigger: "blur" }
        ],
        day8: [
          { required: true, message: "$comment不能为空", trigger: "blur" }
        ],
        day9: [
          { required: true, message: "$comment不能为空", trigger: "blur" }
        ],
        day10: [
          { required: true, message: "$comment不能为空", trigger: "blur" }
        ],
        day11: [
          { required: true, message: "$comment不能为空", trigger: "blur" }
        ],
        day12: [
          { required: true, message: "$comment不能为空", trigger: "blur" }
        ],
        day13: [
          { required: true, message: "$comment不能为空", trigger: "blur" }
        ],
        day14: [
          { required: true, message: "$comment不能为空", trigger: "blur" }
        ],
        day15: [
          { required: true, message: "$comment不能为空", trigger: "blur" }
        ],
        day16: [
          { required: true, message: "$comment不能为空", trigger: "blur" }
        ],
        day17: [
          { required: true, message: "$comment不能为空", trigger: "blur" }
        ],
        day18: [
          { required: true, message: "$comment不能为空", trigger: "blur" }
        ],
        day19: [
          { required: true, message: "$comment不能为空", trigger: "blur" }
        ],
        day20: [
          { required: true, message: "$comment不能为空", trigger: "blur" }
        ],
        day21: [
          { required: true, message: "$comment不能为空", trigger: "blur" }
        ],
        day22: [
          { required: true, message: "$comment不能为空", trigger: "blur" }
        ],
        day23: [
          { required: true, message: "$comment不能为空", trigger: "blur" }
        ],
        day24: [
          { required: true, message: "$comment不能为空", trigger: "blur" }
        ],
        day25: [
          { required: true, message: "$comment不能为空", trigger: "blur" }
        ],
        day26: [
          { required: true, message: "$comment不能为空", trigger: "blur" }
        ],
        day27: [
          { required: true, message: "$comment不能为空", trigger: "blur" }
        ],
        day28: [
          { required: true, message: "$comment不能为空", trigger: "blur" }
        ],
        day29: [
          { required: true, message: "$comment不能为空", trigger: "blur" }
        ],
        day30: [
          { required: true, message: "$comment不能为空", trigger: "blur" }
        ],
        day31: [
          { required: true, message: "$comment不能为空", trigger: "blur" }
        ],
        totaly: [
          { required: true, message: "应写次数不能为空", trigger: "blur" }
        ],
        totalx: [
          { required: true, message: "已写次数不能为空", trigger: "blur" }
        ],
        totalw: [
          { required: true, message: "未写次数不能为空", trigger: "blur" }
        ],
        explain: [
          { required: true, message: "说明不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询日报分析统计列表 */
    getList() {
      this.loading = true;
      listDailyfx(this.queryParams).then(response => {
        this.dailyfxList = response.rows;
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
        month: null,
        optdt: null,
        day1: null,
        day2: null,
        day3: null,
        day4: null,
        day5: null,
        day6: null,
        day7: null,
        day8: null,
        day9: null,
        day10: null,
        day11: null,
        day12: null,
        day13: null,
        day14: null,
        day15: null,
        day16: null,
        day17: null,
        day18: null,
        day19: null,
        day20: null,
        day21: null,
        day22: null,
        day23: null,
        day24: null,
        day25: null,
        day26: null,
        day27: null,
        day28: null,
        day29: null,
        day30: null,
        day31: null,
        totaly: null,
        totalx: null,
        totalw: null,
        explain: null
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
      this.title = "添加日报分析统计";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getDailyfx(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改日报分析统计";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateDailyfx(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addDailyfx(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除日报分析统计编号为"' + ids + '"的数据项？').then(function() {
        return delDailyfx(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('xinhu-finance/dailyfx/export', {
        ...this.queryParams
      }, `dailyfx_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
