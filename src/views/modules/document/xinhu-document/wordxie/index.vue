<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="文档名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入文档名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="操作人名称" prop="optname">
        <el-input
          v-model="queryParams.optname"
          placeholder="请输入操作人名称"
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
          v-hasPermi="['xinhu-document:wordxie:add']"
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
          v-hasPermi="['xinhu-document:wordxie:edit']"
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
          v-hasPermi="['xinhu-document:wordxie:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['xinhu-document:wordxie:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="wordxieList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="文档名称" align="center" prop="name" />
      <el-table-column label="分类" align="center" prop="fenlei" />
      <el-table-column label="操作人名称" align="center" prop="optname" />
      <el-table-column label="操作时间" align="center" prop="optdt" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.optdt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="协作人" align="center" prop="xiename" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['xinhu-document:wordxie:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['xinhu-document:wordxie:remove']"
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

    <!-- 添加或修改文档协作对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="180px">
        <el-form-item label="文档名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入文档名称" />
        </el-form-item>
        <el-form-item label="分类" prop="fenlei">
          <el-input v-model="form.fenlei" placeholder="请输入分类" />
        </el-form-item>
        <el-form-item label="操作人名称" prop="optname">
          <el-input v-model="form.optname" placeholder="请输入操作人名称" />
        </el-form-item>
        <el-form-item label="操作人ID" prop="optid">
          <el-input v-model="form.optid" placeholder="请输入操作人ID" />
        </el-form-item>
        <el-form-item label="操作时间" prop="optdt">
          <el-date-picker clearable size="small"
            v-model="form.optdt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择操作人ID">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="协作人" prop="xiename">
          <el-input v-model="form.xiename" type="textarea" placeholder="请输入协作人" />
        </el-form-item>
        <el-form-item label="协作人ID" prop="xienameid">
          <el-input v-model="form.xienameid" type="textarea" placeholder="请输入协作人ID" />
        </el-form-item>
        <el-form-item label="可查看人" prop="recename">
          <el-input v-model="form.recename" type="textarea" placeholder="请输入可查看人" />
        </el-form-item>
        <el-form-item label="可查看人ID" prop="receid">
          <el-input v-model="form.receid" type="textarea" placeholder="请输入可查看人ID" />
        </el-form-item>
        <el-form-item label="文件ID" prop="fileid">
          <el-input v-model="form.fileid" placeholder="请输入文件ID" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio v-model="form.status" label="1" value="1">良好</el-radio>
          <el-radio v-model="form.status" label="0" value="0">一般</el-radio>
        </el-form-item>
        <el-form-item label="说明" prop="content">
          <el-input v-model="form.content" type="textarea" placeholder="请输入说明" />
        </el-form-item>
        <el-form-item label="对应单位id" prop="comid">
          <el-input v-model="form.comid" placeholder="请输入对应单位id" />
        </el-form-item>
        <el-form-item label="是否可让他人选择" prop="isgk">
          <el-radio v-model="form.isgk" label="1" value="1">是</el-radio>
          <el-radio v-model="form.isgk" label="0" value="0">否</el-radio>
        </el-form-item>
        <el-form-item label="模版中变量" prop="tplvar">
          <el-input v-model="form.tplvar" type="textarea" placeholder="请输入内容" />
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
import { listWordxie, getWordxie, delWordxie, addWordxie, updateWordxie } from "@/api/xinhu-document/wordxie";

export default {
  name: "Wordxie",
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
      // 文档协作表格数据
      wordxieList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: null,
        fenlei: null,
        wtype: null,
        optname: null,
        optid: null,
        optdt: null,
        xiename: null,
        xienameid: null,
        recename: null,
        receid: null,
        status: null,
        fileid: null,
        content: null,
        comid: null,
        isgk: null,
        tplvar: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [
          { required: true, message: "文档名称不能为空", trigger: "blur" },
          { min: 3, max: 100, message: '长度在 3 到 100 个字符', trigger: 'blur' }
        ],
        fenlei: [
          { required: true, message: "分类不能为空", trigger: "blur" },
          { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' }
        ],
        wtype: [
          { required: true, message: "文档类型不能为空", trigger: "change" },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        optname: [
          { required: true, message: "操作人名称不能为空", trigger: "blur" },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        optid: [
          { required: true, message: "操作人ID不能为空", trigger: "blur" }
        ],
        optdt: [
          { required: true, message: "操作时间不能为空", trigger: "blur" },
          { type: 'date', required: true, message: '请选择操作时间', trigger: 'change' }
        ],
        xiename: [
          { required: true, message: "协作人不能为空", trigger: "blur" },
          { min: 3, max: 500, message: '长度在 3 到 500 个字符', trigger: 'blur' }
        ],
        xienameid: [
          { required: true, message: "协作人ID不能为空", trigger: "blur" },
          { min: 3, max: 500, message: '长度在 3 到 500 个字符', trigger: 'blur' }
        ],
        recename: [
          { required: true, message: "可查看人不能为空", trigger: "blur" },
          { min: 3, max: 500, message: '长度在 3 到 500 个字符', trigger: 'blur' }
        ],
        receid: [
          { required: true, message: "可查看人ID不能为空", trigger: "blur" },
          { min: 3, max: 500, message: '长度在 3 到 500 个字符', trigger: 'blur' }
        ],
        status: [
          { required: true, message: "状态不能为空", trigger: "blur" }
        ],
        fileid: [
          { required: true, message: "文件ID不能为空", trigger: "blur" }
        ],
        content: [
          { required: true, message: "说明不能为空", trigger: "blur" },
          { min: 3, max: 2000, message: '长度在 3 到 2000 个字符', trigger: 'blur' }
        ],
        comid: [
          { required: true, message: "对应单位id不能为空", trigger: "blur" }
        ],
        isgk: [
          { required: true, message: "是否可让他人选择不能为空", trigger: "blur" }
        ],
        tplvar: [
          { required: true, message: "模版中变量不能为空", trigger: "blur" },
          { min: 3, max: 500, message: '长度在 3 到 500 个字符', trigger: 'blur' }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询文档协作列表 */
    getList() {
      this.loading = true;
      listWordxie(this.queryParams).then(response => {
        this.wordxieList = response.rows;
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
        fenlei: null,
        wtype: null,
        optname: null,
        optid: null,
        optdt: null,
        xiename: null,
        xienameid: null,
        recename: null,
        receid: null,
        status: 0,
        fileid: null,
        content: null,
        comid: null,
        isgk: null,
        tplvar: null
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
      this.title = "添加文档协作";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getWordxie(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改文档协作";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateWordxie(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addWordxie(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除文档协作编号为"' + ids + '"的数据项？').then(function() {
        return delWordxie(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('xinhu-document/wordxie/export', {
        ...this.queryParams
      }, `wordxie_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
