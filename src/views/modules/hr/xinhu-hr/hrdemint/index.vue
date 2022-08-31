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
      <el-form-item label="需求职位" prop="zhiwei">
        <el-input
          v-model="queryParams.zhiwei"
          placeholder="请输入需求职位"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入姓名"
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
          v-hasPermi="['xinhu-hr:hrdemint:add']"
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
          v-hasPermi="['xinhu-hr:hrdemint:edit']"
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
          v-hasPermi="['xinhu-hr:hrdemint:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['xinhu-hr:hrdemint:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="hrdemintList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="用户ID" align="center" prop="uid" />
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
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['xinhu-hr:hrdemint:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['xinhu-hr:hrdemint:remove']"
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

    <!-- 添加或修改面试和人员需求对话框 -->
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
        <el-form-item label="类型" prop="types">
          <el-radio v-model="form.types" label="1">面试</el-radio>
          <el-radio v-model="form.types" label="0">需求</el-radio>
        </el-form-item>
        <el-form-item label="申请日期" prop="applydt">
          <el-date-picker clearable size="small"
            v-model="form.applydt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择申请日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="说明" prop="contents">
          <el-input v-model="form.contents" type="textarea" placeholder="请输入说明" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio v-model="form.status" label="1">良好</el-radio>
          <el-radio v-model="form.status" label="0">一般</el-radio>
        </el-form-item>
        <el-form-item label="是否提交" prop="isturn">
          <el-radio v-model="form.isturn" label="1">已提交</el-radio>
          <el-radio v-model="form.isturn" label="0">未提交</el-radio>
        </el-form-item>
        <el-form-item label="需求职位" prop="zhiwei">
          <el-input v-model="form.zhiwei" placeholder="请输入需求职位" />
        </el-form-item>
        <el-form-item label="薪资" prop="xinzi">
          <el-input v-model="form.xinzi" placeholder="请输入薪资" />
        </el-form-item>
        <el-form-item label="需求人数" prop="renshu">
          <el-input v-model="form.renshu" placeholder="请输入需求人数" />
        </el-form-item>
        <el-form-item label="职位要求/面试者简历">
          <editor v-model="form.content" :min-height="192"/>
        </el-form-item>
        <el-form-item label="需求部门" prop="bumen">
          <el-input v-model="form.bumen" placeholder="请输入需求部门" />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="面试人员" prop="msuser">
          <el-input v-model="form.msuser" placeholder="请输入面试人员" />
        </el-form-item>
        <el-form-item label="面试人员的ID" prop="msuserid">
          <el-input v-model="form.msuserid" placeholder="请输入面试人员的ID" />
        </el-form-item>
        <el-form-item label="面试记录" prop="mscont">
          <el-input v-model="form.mscont" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="面试结果" prop="state">
          <el-radio v-model="form.state" label="0">待面试</el-radio>
          <el-radio v-model="form.state" label="1">录用</el-radio>
          <el-radio v-model="form.state" label="2">不适合</el-radio>
        </el-form-item>
        <el-form-item label="面试时间" prop="msdt">
          <el-date-picker clearable size="small"
            v-model="form.msdt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择面试时间">
          </el-date-picker>
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
import { listHrdemint, getHrdemint, delHrdemint, addHrdemint, updateHrdemint } from "@/api/xinhu-hr/hrdemint";

export default {
  name: "Hrdemint",
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
      // 面试和人员需求表格数据
      hrdemintList: [],
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
        types: null,
        applydt: null,
        contents: null,
        status: null,
        isturn: null,
        zhiwei: null,
        xinzi: null,
        renshu: null,
        content: null,
        bumen: null,
        name: null,
        msuser: null,
        msuserid: null,
        mscont: null,
        state: null,
        msdt: null,
        comid: null
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
        types: [
          { required: true, message: "0需求,1面试不能为空", trigger: "change" }
        ],
        applydt: [
          { required: true, message: "申请日期不能为空", trigger: "blur" }
        ],
        contents: [
          { required: true, message: "说明不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "状态不能为空", trigger: "blur" }
        ],
        isturn: [
          { required: true, message: "是否提交不能为空", trigger: "blur" }
        ],
        zhiwei: [
          { required: true, message: "需求职位不能为空", trigger: "blur" }
        ],
        xinzi: [
          { required: true, message: "薪资不能为空", trigger: "blur" }
        ],
        renshu: [
          { required: true, message: "需求人数不能为空", trigger: "blur" }
        ],
        content: [
          { required: true, message: "职位要求/面试者简历不能为空", trigger: "blur" }
        ],
        bumen: [
          { required: true, message: "需求部门不能为空", trigger: "blur" }
        ],
        name: [
          { required: true, message: "姓名不能为空", trigger: "blur" }
        ],
        msuser: [
          { required: true, message: "面试人员不能为空", trigger: "blur" }
        ],
        msuserid: [
          { required: true, message: "面试人员的ID不能为空", trigger: "blur" }
        ],
        mscont: [
          { required: true, message: "面试记录不能为空", trigger: "blur" }
        ],
        state: [
          { required: true, message: "面试结果0待面试,1录用,2不适合不能为空", trigger: "blur" }
        ],
        msdt: [
          { required: true, message: "面试时间不能为空", trigger: "blur" }
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
    /** 查询面试和人员需求列表 */
    getList() {
      this.loading = true;
      listHrdemint(this.queryParams).then(response => {
        this.hrdemintList = response.rows;
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
        type: null,
        applydt: null,
        contents: null,
        status: 0,
        isturn: null,
        zhiwei: null,
        xinzi: null,
        renshu: null,
        content: null,
        bumen: null,
        name: null,
        msuser: null,
        msuserid: null,
        mscont: null,
        state: null,
        msdt: null,
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
      this.title = "添加面试和人员需求";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getHrdemint(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改面试和人员需求";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateHrdemint(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addHrdemint(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除面试和人员需求编号为"' + ids + '"的数据项？').then(function() {
        return delHrdemint(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('xinhu-hr/hrdemint/export', {
        ...this.queryParams
      }, `hrdemint_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
