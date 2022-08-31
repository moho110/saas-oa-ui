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
      <el-form-item label="操作时间" prop="optdt">
        <el-date-picker clearable size="small"
          v-model="queryParams.optdt"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择操作时间">
        </el-date-picker>
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
          v-hasPermi="['xinhu-hr:kqout:add']"
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
          v-hasPermi="['xinhu-hr:kqout:edit']"
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
          v-hasPermi="['xinhu-hr:kqout:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['xinhu-hr:kqout:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="kqoutList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="用户ID" align="center" prop="uid" />
      <el-table-column label="申请人姓名" align="center" prop="applyname" />
      <el-table-column label="外出时间" align="center" prop="outtime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.outtime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="回岗时间" align="center" prop="intime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.intime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
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
            v-hasPermi="['xinhu-hr:kqout:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['xinhu-hr:kqout:remove']"
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

    <!-- 添加或修改外出出差对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="180px">
        <el-form-item label="用户ID" prop="uid">
          <el-input v-model="form.uid" placeholder="请输入用户ID" />
        </el-form-item>
        <el-form-item label="申请人姓名" prop="applyname">
          <el-input v-model="form.applyname" placeholder="请输入申请人姓名" />
        </el-form-item>
        <el-form-item label="外出时间" prop="outtime">
          <el-date-picker clearable size="small"
            v-model="form.outtime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择外出时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="回岗时间" prop="intime">
          <el-date-picker clearable size="small"
            v-model="form.intime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择回岗时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="外出地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入外出地址" />
        </el-form-item>
        <el-form-item label="外出事由" prop="reason">
          <el-input v-model="form.reason" type="textarea" placeholder="请输入外出事由" />
        </el-form-item>
        <el-form-item label="说明" prop="content">
          <el-input v-model="form.content" type="textarea" placeholder="请输入说明" />
        </el-form-item>
        <el-form-item label="操作时间" prop="optdt">
          <el-date-picker clearable size="small"
            v-model="form.optdt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择操作时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio v-model="form.status" label="0">一般</el-radio>
          <el-radio v-model="form.status" label="1">良好</el-radio>
        </el-form-item>
        <el-form-item label="@0|未提交,1|提交" prop="isturn">
          <el-radio v-model="form.isturn" label="0">未提交</el-radio>
          <el-radio v-model="form.isturn" label="1">提交</el-radio>
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
        <el-form-item label="是否销假@0|否,1|是" prop="isxj">
          <el-radio v-model="form.isxj" label="0">否</el-radio>
          <el-radio v-model="form.isxj" label="1">是</el-radio>
        </el-form-item>
        <el-form-item label="销假说明" prop="sicksm">
          <el-input v-model="form.sicksm" type="textarea" placeholder="请输入内容" />
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
import { listKqout, getKqout, delKqout, addKqout, updateKqout } from "@/api/xinhu-hr/kqout";

export default {
  name: "Kqout",
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
      // 外出出差表格数据
      kqoutList: [],
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
        outtime: null,
        intime: null,
        address: null,
        reason: null,
        atype: null,
        content: null,
        optdt: null,
        status: null,
        isturn: null,
        optid: null,
        optname: null,
        applydt: null,
        isxj: null,
        sicksm: null,
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
        outtime: [
          { required: true, message: "外出时间不能为空", trigger: "blur" }
        ],
        intime: [
          { required: true, message: "回岗时间不能为空", trigger: "blur" }
        ],
        address: [
          { required: true, message: "外出地址不能为空", trigger: "blur" }
        ],
        reason: [
          { required: true, message: "外出事由不能为空", trigger: "blur" }
        ],
        atype: [
          { required: true, message: "外出类型@外出,出差不能为空", trigger: "change" }
        ],
        explain: [
          { required: true, message: "说明不能为空", trigger: "blur" }
        ],
        optdt: [
          { required: true, message: "操作时间不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "@0|待审核,1|审核通过,2|审核不通过不能为空", trigger: "blur" }
        ],
        isturn: [
          { required: true, message: "@0|未提交,1|提交不能为空", trigger: "blur" }
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
        isxj: [
          { required: true, message: "是否销假@0|否,1|是不能为空", trigger: "blur" }
        ],
        sicksm: [
          { required: true, message: "销假说明不能为空", trigger: "blur" }
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
    /** 查询外出出差列表 */
    getList() {
      this.loading = true;
      listKqout(this.queryParams).then(response => {
        this.kqoutList = response.rows;
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
        outtime: null,
        intime: null,
        address: null,
        reason: null,
        atype: null,
        content: null,
        optdt: null,
        status: 0,
        isturn: null,
        optid: null,
        optname: null,
        applydt: null,
        isxj: null,
        sicksm: null,
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
      this.title = "添加外出出差";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getKqout(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改外出出差";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateKqout(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addKqout(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除外出出差编号为"' + ids + '"的数据项？').then(function() {
        return delKqout(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('xinhu-hr/kqout/export', {
        ...this.queryParams
      }, `kqout_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
