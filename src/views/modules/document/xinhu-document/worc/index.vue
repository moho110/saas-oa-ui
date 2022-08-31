<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="分区名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入文档分区名称"
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
      <el-form-item label="创建人" prop="optname">
        <el-input
          v-model="queryParams.optname"
          placeholder="请输入创建人"
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
          v-hasPermi="['xinhu-document:worc:add']"
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
          v-hasPermi="['xinhu-document:worc:edit']"
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
          v-hasPermi="['xinhu-document:worc:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['xinhu-document:worc:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="worcList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="文档分区名称" align="center" prop="name" />
      <el-table-column label="可查看人员" align="center" prop="recename" />
      <el-table-column label="排序号" align="center" prop="sort" />
      <el-table-column label="管理人员" align="center" prop="guanname" />
      <el-table-column label="操作时间" align="center" prop="optdt" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.optdt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建人" align="center" prop="optname" />
      <el-table-column label="可上传人员" align="center" prop="upuser" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['xinhu-document:worc:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['xinhu-document:worc:remove']"
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

    <!-- 添加或修改文档分区对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="180px">
        <el-form-item label="文档分区名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入文档分区名称" />
        </el-form-item>
        <el-form-item label="可查看人员" prop="recename">
          <el-input v-model="form.recename" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="可查看人员ID" prop="receid">
          <el-input v-model="form.receid" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="排序号" prop="sort">
          <el-input v-model="form.sort" placeholder="请输入排序号" />
        </el-form-item>
        <el-form-item label="管理人员" prop="guanname">
          <el-input v-model="form.guanname" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="管理人员ID" prop="guanid">
          <el-input v-model="form.guanid" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="操作时间" prop="optdt">
          <el-date-picker clearable size="small"
            v-model="form.optdt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择操作时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="所属用户" prop="uid">
          <el-input v-model="form.uid" placeholder="请输入所属用户" />
        </el-form-item>
        <el-form-item label="创建人" prop="optname">
          <el-input v-model="form.optname" placeholder="请输入创建人" />
        </el-form-item>
        <el-form-item label="可上传人员ID" prop="upuserid">
          <el-input v-model="form.upuserid" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="可上传人员" prop="upuser">
          <el-input v-model="form.upuser" type="textarea" placeholder="请输入内容" />
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
import { listWorc, getWorc, delWorc, addWorc, updateWorc } from "@/api/xinhu-document/worc";

export default {
  name: "Worc",
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
      // 文档分区表格数据
      worcList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: null,
        recename: null,
        receid: null,
        sort: null,
        guanname: null,
        guanid: null,
        optdt: null,
        uid: null,
        optname: null,
        uptype: null,
        upuserid: null,
        upuser: null,
        comid: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [
          { required: true, message: "文档分区名称不能为空", trigger: "blur" },
          { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' }
        ],
        recename: [
          { required: true, message: "可查看人员不能为空", trigger: "blur" },
          { min: 3, max: 500, message: '长度在 3 到 500 个字符', trigger: 'blur' }
        ],
        receid: [
          { required: true, message: "可查看人员ID不能为空", trigger: "blur" },
          { min: 3, max: 500, message: '长度在 3 到 500 个字符', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: "排序号不能为空", trigger: "blur" }
        ],
        guanname: [
          { required: true, message: "管理人员不能为空", trigger: "blur" },
          { min: 3, max: 500, message: '长度在 3 到 500 个字符', trigger: 'blur' }
        ],
        guanid: [
          { required: true, message: "管理人员ID不能为空", trigger: "blur" },
          { min: 3, max: 500, message: '长度在 3 到 500 个字符', trigger: 'blur' }
        ],
        optdt: [
          { required: true, message: "操作时间不能为空", trigger: "blur" }
        ],
        uid: [
          { required: true, message: "所属用户不能为空", trigger: "blur" }
        ],
        optname: [
          { required: true, message: "创建人不能为空", trigger: "blur" },
          { min: 3, max: 30, message: '长度在 3 到 30 个字符', trigger: 'blur' }
        ],
        uptype: [
          { required: true, message: "限制上传类型不能为空", trigger: "change" },
          { min: 3, max: 100, message: '长度在 3 到 100 个字符', trigger: 'blur' }
        ],
        upuserid: [
          { required: true, message: "可上传人员ID不能为空", trigger: "blur" },
          { min: 3, max: 500, message: '长度在 3 到 500 个字符', trigger: 'blur' }
        ],
        upuser: [
          { required: true, message: "可上传人员不能为空", trigger: "blur" },
          { min: 3, max: 500, message: '长度在 3 到 500 个字符', trigger: 'blur' }
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
    /** 查询文档分区列表 */
    getList() {
      this.loading = true;
      listWorc(this.queryParams).then(response => {
        this.worcList = response.rows;
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
        recename: null,
        receid: null,
        sort: null,
        guanname: null,
        guanid: null,
        optdt: null,
        uid: null,
        optname: null,
        uptype: null,
        upuserid: null,
        upuser: null,
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
      this.title = "添加文档分区";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getWorc(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改文档分区";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateWorc(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addWorc(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除文档分区编号为"' + ids + '"的数据项？').then(function() {
        return delWorc(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('xinhu-document/worc/export', {
        ...this.queryParams
      }, `worc_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
