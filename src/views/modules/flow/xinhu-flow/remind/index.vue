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
      <el-form-item label="对应模块编号" prop="modenum">
        <el-input
          v-model="queryParams.modenum"
          placeholder="请输入对应模块编号"
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
          v-hasPermi="['xinhu-flow:remind:add']"
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
          v-hasPermi="['xinhu-flow:remind:edit']"
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
          v-hasPermi="['xinhu-flow:remind:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['xinhu-flow:remind:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="remindList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
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
      <el-table-column label="optdt" align="center" prop="optdt" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.optdt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作人" align="center" prop="optname" />
      <el-table-column label="频率" align="center" prop="ratecont" />
      <el-table-column label="提醒给" align="center" prop="recename" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['xinhu-flow:remind:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['xinhu-flow:remind:remove']"
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

    <!-- 添加或修改单据提醒设置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="180px">
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
        <el-form-item label="用户Id" prop="uid">
          <el-input v-model="form.uid" placeholder="请输入用户Id" />
        </el-form-item>
        <el-form-item label="操作时间" prop="optdt">
          <el-date-picker clearable size="small"
            v-model="form.optdt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择操作时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="操作人" prop="optname">
          <el-input v-model="form.optname" placeholder="请输入操作人" />
        </el-form-item>
        <el-form-item label="对应模块编号" prop="modenum">
          <el-input v-model="form.modenum" placeholder="请输入对应模块编号" />
        </el-form-item>
        <el-form-item label="主表" prop="tables">
          <el-input v-model="form.tables" placeholder="请输入主表" />
        </el-form-item>
        <el-form-item label="主Id" prop="mid">
          <el-input v-model="form.mid" placeholder="请输入主Id" />
        </el-form-item>
        <el-form-item label="频率" prop="ratecont">
          <el-input v-model="form.ratecont" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="提醒内容" prop="content">
          <el-input v-model="form.content" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="提醒频率o仅一次,d天,w周,m月" prop="rate">
          <el-input v-model="form.rate" placeholder="请输入提醒频率o仅一次,d天,w周,m月" />
        </el-form-item>
        <el-form-item label="频率值" prop="rateval">
          <el-input v-model="form.rateval" placeholder="请输入频率值" />
        </el-form-item>
        <el-form-item label="提醒给ID" prop="receid">
          <el-input v-model="form.receid" type="textarea" placeholder="请输入提醒ID" />
        </el-form-item>
        <el-form-item label="提醒给" prop="recename">
          <el-input v-model="form.recename" type="textarea" placeholder="请输入提醒给" />
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
import { listRemind, getRemind, delRemind, addRemind, updateRemind } from "@/api/xinhu-flow/remind";

export default {
  name: "Remind",
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
      // 单据提醒设置表格数据
      remindList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        startdt: null,
        enddt: null,
        uid: null,
        optdt: null,
        optname: null,
        modenum: null,
        tables: null,
        mid: null,
        ratecont: null,
        content: null,
        rate: null,
        rateval: null,
        status: null,
        receid: null,
        recename: null,
        comid: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        startdt: [
          { required: true, message: "开始时间不能为空", trigger: "blur" }
        ],
        enddt: [
          { required: true, message: "截止时间不能为空", trigger: "blur" }
        ],
        uid: [
          { required: true, message: "用户Id不能为空", trigger: "blur" }
        ],
        optdt: [
          { required: true, message: "$comment不能为空", trigger: "blur" }
        ],
        optname: [
          { required: true, message: "操作人不能为空", trigger: "blur" }
        ],
        modenum: [
          { required: true, message: "对应模块编号不能为空", trigger: "blur" }
        ],
        tables: [
          { required: true, message: "$comment不能为空", trigger: "blur" }
        ],
        mid: [
          { required: true, message: "主Id不能为空", trigger: "blur" }
        ],
        ratecont: [
          { required: true, message: "频率不能为空", trigger: "blur" }
        ],
        content: [
          { required: true, message: "提醒内容不能为空", trigger: "blur" }
        ],
        rate: [
          { required: true, message: "提醒频率o仅一次,d天,w周,m月不能为空", trigger: "blur" }
        ],
        rateval: [
          { required: true, message: "$comment不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "$comment不能为空", trigger: "blur" }
        ],
        receid: [
          { required: true, message: "$comment不能为空", trigger: "blur" }
        ],
        recename: [
          { required: true, message: "提醒给不能为空", trigger: "blur" }
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
    /** 查询单据提醒设置列表 */
    getList() {
      this.loading = true;
      listRemind(this.queryParams).then(response => {
        this.remindList = response.rows;
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
        startdt: null,
        enddt: null,
        uid: null,
        optdt: null,
        optname: null,
        modenum: null,
        tables: null,
        mid: null,
        ratecont: null,
        content: null,
        rate: null,
        rateval: null,
        status: 0,
        receid: null,
        recename: null,
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
      this.title = "添加单据提醒设置";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getRemind(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改单据提醒设置";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateRemind(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addRemind(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除单据提醒设置编号为"' + ids + '"的数据项？').then(function() {
        return delRemind(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('xinhu-flow/remind/export', {
        ...this.queryParams
      }, `remind_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
