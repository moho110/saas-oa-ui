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
      <el-form-item label="操作人" prop="optname">
        <el-input
          v-model="queryParams.optname"
          placeholder="请输入操作人"
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
          v-hasPermi="['xinhu-hr:knowtraim:add']"
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
          v-hasPermi="['xinhu-hr:knowtraim:edit']"
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
          v-hasPermi="['xinhu-hr:knowtraim:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['xinhu-hr:knowtraim:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="knowtraimList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="标题" align="center" prop="title" />
      <el-table-column label="操作人" align="center" prop="optname" />
      <el-table-column label="操作时间" align="center" prop="optdt" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.optdt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开始时间" align="center" prop="startdt" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.startdt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="截止时间" align="center" prop="enddt" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.enddt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['xinhu-hr:knowtraim:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['xinhu-hr:knowtraim:remove']"
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

    <!-- 添加或修改培训出题考试对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="操作人ID" prop="optid">
          <el-input v-model="form.optid" placeholder="请输入操作人ID" />
        </el-form-item>
        <el-form-item label="操作人" prop="optname">
          <el-input v-model="form.optname" placeholder="请输入操作人" />
        </el-form-item>
        <el-form-item label="操作时间" prop="optdt">
          <el-date-picker clearable size="small"
            v-model="form.optdt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择操作时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="多选题目数量" prop="dxshu">
          <el-input v-model="form.dxshu" placeholder="请输入多选题目数量" />
        </el-form-item>
        <el-form-item label="单选题目数量" prop="dsshu">
          <el-input v-model="form.dsshu" placeholder="请输入单选题目数量" />
        </el-form-item>
        <el-form-item label="判断题数" prop="pdshu">
          <el-input v-model="form.pdshu" placeholder="请输入判断题数" />
        </el-form-item>
        <el-form-item label="培训人数" prop="reshu">
          <el-input v-model="form.reshu" placeholder="请输入培训人数" />
        </el-form-item>
        <el-form-item label="开始时间" prop="startdt">
          <el-date-picker clearable size="small"
            v-model="form.startdt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择开始时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="截止时间" prop="enddt">
          <el-date-picker clearable size="small"
            v-model="form.enddt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择截止时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="考试时间(分钟)" prop="kstime">
          <el-input v-model="form.kstime" placeholder="请输入考试时间(分钟)" />
        </el-form-item>
        <el-form-item label="已答题人数" prop="ydshu">
          <el-input v-model="form.ydshu" placeholder="请输入已答题人数" />
        </el-form-item>
        <el-form-item label="发给谁培训ID" prop="receid">
          <el-input v-model="form.receid" placeholder="请输入发给谁培训ID" />
        </el-form-item>
        <el-form-item label="发给谁培训" prop="recename">
          <el-input v-model="form.recename" placeholder="请输入发给谁培训" />
        </el-form-item>
        <el-form-item label="说明" prop="content">
          <el-input v-model="form.content" type="textarea" placeholder="请输入说明" />
        </el-form-item>
        <el-form-item label="0还没开始,1考试中,2已结束" prop="state">
          <el-input v-model="form.state" placeholder="请输入0还没开始,1考试中,2已结束" />
        </el-form-item>
        <el-form-item label="总分" prop="zfenshu">
          <el-input v-model="form.zfenshu" placeholder="请输入总分" />
        </el-form-item>
        <el-form-item label="合格分数" prop="hgfen">
          <el-input v-model="form.hgfen" placeholder="请输入合格分数" />
        </el-form-item>
        <el-form-item label="对应题库ID" prop="tikuid">
          <el-input v-model="form.tikuid" placeholder="请输入对应题库ID" />
        </el-form-item>
        <el-form-item label="对应题库" prop="tikuname">
          <el-input v-model="form.tikuname" placeholder="请输入对应题库" />
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
import { listKnowtraim, getKnowtraim, delKnowtraim, addKnowtraim, updateKnowtraim } from "@/api/xinhu-hr/knowtraim";

export default {
  name: "Knowtraim",
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
      // 培训出题考试表格数据
      knowtraimList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        title: null,
        optid: null,
        optname: null,
        optdt: null,
        dxshu: null,
        dsshu: null,
        pdshu: null,
        reshu: null,
        startdt: null,
        enddt: null,
        kstime: null,
        ydshu: null,
        status: null,
        receid: null,
        recename: null,
        content: null,
        state: null,
        zfenshu: null,
        hgfen: null,
        tikuid: null,
        tikuname: null,
        comid: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        title: [
          { required: true, message: "标题不能为空", trigger: "blur" }
        ],
        optid: [
          { required: true, message: "操作人ID不能为空", trigger: "blur" }
        ],
        optname: [
          { required: true, message: "操作人不能为空", trigger: "blur" }
        ],
        optdt: [
          { required: true, message: "操作时间不能为空", trigger: "blur" }
        ],
        dxshu: [
          { required: true, message: "多选题目数量不能为空", trigger: "blur" }
        ],
        dsshu: [
          { required: true, message: "单选题目数量不能为空", trigger: "blur" }
        ],
        pdshu: [
          { required: true, message: "判断题数不能为空", trigger: "blur" }
        ],
        reshu: [
          { required: true, message: "培训人数不能为空", trigger: "blur" }
        ],
        startdt: [
          { required: true, message: "开始时间不能为空", trigger: "blur" }
        ],
        enddt: [
          { required: true, message: "截止时间不能为空", trigger: "blur" }
        ],
        kstime: [
          { required: true, message: "考试时间(分钟)不能为空", trigger: "blur" }
        ],
        ydshu: [
          { required: true, message: "已答题人数不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "状态不能为空", trigger: "blur" }
        ],
        receid: [
          { required: true, message: "发给谁培训ID不能为空", trigger: "blur" }
        ],
        recename: [
          { required: true, message: "发给谁培训不能为空", trigger: "blur" }
        ],
        content: [
          { required: true, message: "说明不能为空", trigger: "blur" }
        ],
        state: [
          { required: true, message: "0还没开始,1考试中,2已结束不能为空", trigger: "blur" }
        ],
        zfenshu: [
          { required: true, message: "总分不能为空", trigger: "blur" }
        ],
        hgfen: [
          { required: true, message: "合格分数不能为空", trigger: "blur" }
        ],
        tikuid: [
          { required: true, message: "对应题库ID不能为空", trigger: "blur" }
        ],
        tikuname: [
          { required: true, message: "对应题库不能为空", trigger: "blur" }
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
    /** 查询培训出题考试列表 */
    getList() {
      this.loading = true;
      listKnowtraim(this.queryParams).then(response => {
        this.knowtraimList = response.rows;
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
        optid: null,
        optname: null,
        optdt: null,
        dxshu: null,
        dsshu: null,
        pdshu: null,
        reshu: null,
        startdt: null,
        enddt: null,
        kstime: null,
        ydshu: null,
        status: 0,
        receid: null,
        recename: null,
        content: null,
        state: null,
        zfenshu: null,
        hgfen: null,
        tikuid: null,
        tikuname: null,
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
      this.title = "添加培训出题考试";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getKnowtraim(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改培训出题考试";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateKnowtraim(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addKnowtraim(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除培训出题考试编号为"' + ids + '"的数据项？').then(function() {
        return delKnowtraim(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('xinhu-hr/knowtraim/export', {
        ...this.queryParams
      }, `knowtraim_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
