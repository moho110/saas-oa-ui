<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="开始日期" prop="startdt">
        <el-date-picker clearable size="small"
          v-model="queryParams.startdt"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择开始日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="截止日期" prop="enddt">
        <el-date-picker clearable size="small"
          v-model="queryParams.enddt"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择截止日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="操作时间" prop="optdt">
        <el-date-picker clearable size="small"
          v-model="queryParams.optdt"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择操作时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="签署人" prop="uname">
        <el-input
          v-model="queryParams.uname"
          placeholder="请输入签署人"
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
          v-hasPermi="['xinhu-person:userract:add']"
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
          v-hasPermi="['xinhu-person:userract:edit']"
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
          v-hasPermi="['xinhu-person:userract:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['xinhu-person:userract:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="userractList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="名称" align="center" prop="name" />
      <el-table-column label="开始日期" align="center" prop="startdt" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.startdt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="截止日期" align="center" prop="enddt" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.enddt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作时间" align="center" prop="optdt" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.optdt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="签署公司" align="center" prop="company" />
      <el-table-column label="签署人" align="center" prop="uname" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['xinhu-person:userract:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['xinhu-person:userract:remove']"
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

    <!-- 添加或修改用户合同对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="180px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="开始日期" prop="startdt">
          <el-date-picker clearable size="small"
            v-model="form.startdt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择开始日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="截止日期" prop="enddt">
          <el-date-picker clearable size="small"
            v-model="form.enddt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择截止日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="用户ID" prop="uid">
          <el-input v-model="form.uid" placeholder="请输入用户ID" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="form.sort" :min="1" :max="999" label="排序"></el-input-number>
        </el-form-item>
        <el-form-item label="操作时间" prop="optdt">
          <el-date-picker clearable size="small"
            v-model="form.optdt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择操作时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input v-model="form.content" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-select v-model="form.state" placeholder="状态">
            <el-option
            v-for="item in options"
            :key="item.state"
            :label="item.label"
            :value="item.state">
           </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="提前终止" prop="tqenddt">
          <el-date-picker clearable size="small"
            v-model="form.tqenddt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择提前终止">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="签署公司" prop="company">
          <el-input v-model="form.company" placeholder="请输入签署公司" />
        </el-form-item>
        <el-form-item label="签署人" prop="uname">
          <el-input v-model="form.uname" placeholder="请输入签署人" />
        </el-form-item>
        <el-form-item label="签署公司Id" prop="companyid">
          <el-input v-model="form.companyid" placeholder="请输入签署公司Id" />
        </el-form-item>
        <el-form-item label="合同文件" prop="htfid">
          <el-input v-model="form.htfid" placeholder="请输入合同文件" />
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
import { listUserract, getUserract, delUserract, addUserract, updateUserract } from "@/api/xinhu-person/userract";

export default {
  name: "Userract",
  data() {
    return {
    //选择器
    options: [{
          state: '0',
          label: '待执行'
        }, {
          state: '1',
          label: '生效中'
        }, {
          state: '2',
          label: '已终止'
        }, {
          state: '3',
          label: '已过期'
        }],
          state: '',
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
      // 用户合同表格数据
      userractList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: null,
        startdt: null,
        enddt: null,
        uid: null,
        sort: null,
        optdt: null,
        content: null,
        httype: null,
        state: null,
        tqenddt: null,
        company: null,
        uname: null,
        companyid: null,
        htfid: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [
          { required: true, message: "名称不能为空", trigger: "blur" },
          { min: 10, max: 50, message: '长度在 10 到 50 个字符', trigger: 'blur' }
        ],
        startdt: [
          { required: true, message: "开始日期不能为空", trigger: "blur" },
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ],
        enddt: [
          { required: true, message: "截止日期不能为空", trigger: "blur" },
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ],
        uid: [
          { required: true, message: "用户ID不能为空", trigger: "blur" }
        ],
        sort: [
          { required: true, message: "排序不能为空", trigger: "blur" }
        ],
        optdt: [
          { required: true, message: "操作时间不能为空", trigger: "blur" },
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ],
        content: [
          { required: true, message: "内容不能为空", trigger: "blur" },
          { min: 10, max: 500, message: '长度在 10 到 500 个字符', trigger: 'blur' }
        ],
        httype: [
          { required: true, message: "合同类型不能为空", trigger: "change" },
          { min: 10, max: 30, message: '长度在 10 到 30 个字符', trigger: 'blur' }
        ],
        state: [
          { required: true, message: "0|待执行,1|生效中,2|已终止,3|已过期不能为空", trigger: "blur" }
        ],
        tqenddt: [
          { required: true, message: "提前终止不能为空", trigger: "blur" }
        ],
        company: [
          { required: true, message: "签署公司不能为空", trigger: "blur" },
          { min: 10, max: 50, message: '长度在 10 到 50 个字符', trigger: 'blur' }
        ],
        uname: [
          { required: true, message: "签署人不能为空", trigger: "blur" },
          { min: 10, max: 20, message: '长度在 10 到 20 个字符', trigger: 'blur' }
        ],
        companyid: [
          { required: true, message: "签署公司Id不能为空", trigger: "blur" }
        ],
        htfid: [
          { required: true, message: "合同文件不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询用户合同列表 */
    getList() {
      this.loading = true;
      listUserract(this.queryParams).then(response => {
        this.userractList = response.rows;
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
        name: null,
        startdt: null,
        enddt: null,
        uid: null,
        sort: null,
        optdt: null,
        content: null,
        httype: null,
        state: null,
        tqenddt: null,
        company: null,
        uname: null,
        companyid: null,
        htfid: null
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
      this.title = "添加用户合同";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getUserract(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改用户合同";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateUserract(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addUserract(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除用户合同编号为"' + ids + '"的数据项？').then(function() {
        return delUserract(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('xinhu-person/userract/export', {
        ...this.queryParams
      }, `userract_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
