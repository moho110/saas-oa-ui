<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="申请人姓名" prop="applyname">
        <el-input
          v-model="queryParams.applyname"
          placeholder="请输入申请人姓名"
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
          v-hasPermi="['xinhu-hr:hrredund:add']"
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
          v-hasPermi="['xinhu-hr:hrredund:edit']"
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
          v-hasPermi="['xinhu-hr:hrredund:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['xinhu-hr:hrredund:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="hrredundList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="用户ID" align="center" prop="uid" />
      <el-table-column label="申请人姓名" align="center" prop="applyname" />
      <el-table-column label="职位" align="center" prop="ranking" />
      <el-table-column label="入职日期" align="center" prop="entrydt" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.entrydt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['xinhu-hr:hrredund:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['xinhu-hr:hrredund:remove']"
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

    <!-- 添加或修改离职申请对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="180px">
        <el-form-item label="用户ID" prop="uid">
          <el-input v-model="form.uid" placeholder="请输入用户ID" />
        </el-form-item>
        <el-form-item label="申请人姓名" prop="applyname">
          <el-input v-model="form.applyname" placeholder="请输入申请人姓名" />
        </el-form-item>
        <el-form-item label="职位" prop="ranking">
          <el-input v-model="form.ranking" placeholder="请输入职位" />
        </el-form-item>
        <el-form-item label="入职日期" prop="entrydt">
          <el-date-picker clearable size="small"
            v-model="form.entrydt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择入职日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="离职日期" prop="quitdt">
          <el-date-picker clearable size="small"
            v-model="form.quitdt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择离职日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="离职原因" prop="redundreson">
          <el-input v-model="form.redundreson" placeholder="请输入离职原因" />
        </el-form-item>
        <el-form-item label="操作时间" prop="optdt">
          <el-date-picker clearable size="small"
            v-model="form.optdt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择操作时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="说明" prop="content">
          <el-input v-model="form.content" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio v-model="form.status" label="0">待审核</el-radio>
          <el-radio v-model="form.status" label="1">审核通过</el-radio>
          <el-radio v-model="form.status" label="2">审核不通过</el-radio>
        </el-form-item>
        <el-form-item label="是否提交" prop="isturn">
          <el-radio v-model="form.isturn" label="1">已提交</el-radio>
          <el-radio v-model="form.isturn" label="0">未提交</el-radio>
        </el-form-item>
        <el-form-item label="是否结束" prop="isover">
          <el-radio v-model="form.isover" label="1">是</el-radio>
          <el-radio v-model="form.isover" label="0">否</el-radio>
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
import { listHrredund, getHrredund, delHrredund, addHrredund, updateHrredund } from "@/api/xinhu-hr/hrredund";

export default {
  name: "Hrredund",
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
      // 离职申请表格数据
      hrredundList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        uid: null,
        applyname: null,
        ranking: null,
        entrydt: null,
        quitdt: null,
        redundtype: null,
        redundreson: null,
        optdt: null,
        content: null,
        status: null,
        isturn: null,
        isover: null,
        optid: null,
        optname: null,
        applydt: null,
        comid: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        uid: [
          { required: true, message: "用户ID不能为空", trigger: "blur" }
        ],
        applyname: [
          { required: true, message: "申请人姓名不能为空", trigger: "blur" }
        ],
        ranking: [
          { required: true, message: "职位不能为空", trigger: "blur" }
        ],
        entrydt: [
          { required: true, message: "入职日期不能为空", trigger: "blur" }
        ],
        quitdt: [
          { required: true, message: "离职日期不能为空", trigger: "blur" }
        ],
        redundtype: [
          { required: true, message: "离职类型不能为空", trigger: "change" }
        ],
        redundreson: [
          { required: true, message: "离职原因不能为空", trigger: "blur" }
        ],
        optdt: [
          { required: true, message: "操作时间不能为空", trigger: "blur" }
        ],
        content: [
          { required: true, message: "说明不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "@0|待审核,1|审核通过,2|审核不通过不能为空", trigger: "blur" }
        ],
        isturn: [
          { required: true, message: "@0|未提交,1|提交不能为空", trigger: "blur" }
        ],
        isover: [
          { required: true, message: "是否结束不能为空", trigger: "blur" }
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
    /** 查询离职申请列表 */
    getList() {
      this.loading = true;
      listHrredund(this.queryParams).then(response => {
        this.hrredundList = response.rows;
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
        applyname: null,
        ranking: null,
        entrydt: null,
        quitdt: null,
        redundtype: null,
        redundreson: null,
        optdt: null,
        content: null,
        status: 0,
        isturn: null,
        isover: null,
        optid: null,
        optname: null,
        applydt: null,
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
      this.title = "添加离职申请";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getHrredund(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改离职申请";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateHrredund(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addHrredund(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除离职申请编号为"' + ids + '"的数据项？').then(function() {
        return delHrredund(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('xinhu-hr/hrredund/export', {
        ...this.queryParams
      }, `hrredund_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
