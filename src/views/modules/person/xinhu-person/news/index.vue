<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="新闻标题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入标题"
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
      <el-form-item label="类型名称" prop="typename">
        <el-input
          v-model="queryParams.typename"
          placeholder="请输入类型名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="url地址" prop="url">
        <el-input
          v-model="queryParams.url"
          placeholder="请输入url地址"
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
          v-hasPermi="['xinhu-person:news:add']"
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
          v-hasPermi="['xinhu-person:news:edit']"
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
          v-hasPermi="['xinhu-person:news:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['xinhu-person:news:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="newsList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="新闻标题" align="center" prop="title" />
      <el-table-column label="操作时间" align="center" prop="optdt" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.optdt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型名称" align="center" prop="typename" />
      <el-table-column label="url地址" align="center" prop="url" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['xinhu-person:news:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['xinhu-person:news:remove']"
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

    <!-- 添加或修改新闻资讯对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="180px">
        <el-form-item label="新闻标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入新闻标题" />
        </el-form-item>
        <el-form-item label="操作时间" prop="optdt">
          <el-date-picker clearable size="small"
            v-model="form.optdt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择操作时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="类型名称" prop="typename">
          <el-input v-model="form.typename" placeholder="请输入类型名称" />
        </el-form-item>
        <el-form-item label="新闻内容">
          <editor v-model="form.content" :min-height="192"/>
        </el-form-item>
        <el-form-item label="url地址" prop="url">
          <el-input v-model="form.url" placeholder="请输入url地址" />
        </el-form-item>
        <el-form-item label="接收人Id" prop="receid">
          <el-input v-model="form.receid" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="接收人名称" prop="recename">
          <el-input v-model="form.recename" type="textarea" placeholder="请输入接收人名称" />
        </el-form-item>
        <el-form-item label="操作人ID" prop="optid">
          <el-input v-model="form.optid" placeholder="请输入操作人ID" />
        </el-form-item>
        <el-form-item label="操作人名称" prop="optname">
          <el-input v-model="form.optname" placeholder="请输入操作人名称" />
        </el-form-item>
        <el-form-item label="截止时间" prop="enddt">
          <el-date-picker clearable size="small"
            v-model="form.enddt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择截止时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="开始时间" prop="startdt">
          <el-date-picker clearable size="small"
            v-model="form.startdt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择开始时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="发布者" prop="zuozhe">
          <el-input v-model="form.zuozhe" placeholder="请输入发布者" />
        </el-form-item>
        <el-form-item label="日期" prop="indate">
          <el-date-picker clearable size="small"
            v-model="form.indate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="封面图片" prop="fengmian">
          <el-input v-model="form.fengmian" placeholder="请输入封面图片" />
        </el-form-item>
        <el-form-item label="至少投票" prop="mintou">
          <el-input v-model="form.mintou" placeholder="请输入至少投票" />
        </el-form-item>
        <el-form-item label="最多投投票0不限制" prop="maxtou">
          <el-input v-model="form.maxtou" placeholder="请输入最多投投票0不限制" />
        </el-form-item>
        <el-form-item label="是否发短信" prop="issms">
          <el-radio v-model="form.issms" label="1">是</el-radio>
          <el-radio v-model="form.issms" label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="排序号越大越靠前" prop="istop">
          <el-input v-model="form.istop" placeholder="请输入排序号越大越靠前" />
        </el-form-item>
        <el-form-item label="对应单位id" prop="comid">
          <el-input v-model="form.comid" placeholder="请输入对应单位id" />
        </el-form-item>
        <el-form-item label="app首页显示" prop="appxs">
          <el-radio v-model="form.appxs" label="1">是</el-radio>
          <el-radio v-model="form.appxs" label="0">否</el-radio>
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
import { listNews, getNews, delNews, addNews, updateNews } from "@/api/xinhu-person/news";

export default {
  name: "News",
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
      // 新闻资讯表格数据
      newsList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        title: null,
        optdt: null,
        typename: null,
        content: null,
        url: null,
        receid: null,
        recename: null,
        optid: null,
        optname: null,
        enddt: null,
        startdt: null,
        zuozhe: null,
        indate: null,
        status: null,
        fengmian: null,
        mintou: null,
        maxtou: null,
        issms: null,
        istop: null,
        comid: null,
        appxs: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        title: [
          { required: true, message: "新闻标题不能为空", trigger: "blur" },
          { min: 10, max: 200, message: '长度在 10 到 200 个字符', trigger: 'blur' }
        ],
        optdt: [
          { required: true, message: "操作时间不能为空", trigger: "blur" },
          { type: 'date', required: true, message: '请选择操作时间', trigger: 'change' }
        ],
        typename: [
          { required: true, message: "类型名称不能为空", trigger: "blur" },
          { min: 10, max: 200, message: '长度在 10 到 200 个字符', trigger: 'blur' }
        ],
        content: [
          { required: true, message: "内容不能为空", trigger: "blur" },
          { min: 10, max: 200, message: '长度在 10 到 200 个字符', trigger: 'blur' }
        ],
        url: [
          { required: true, message: "url地址不能为空", trigger: "blur" },
          { min: 10, max: 200, message: '长度在 10 到 200 个字符', trigger: 'blur' }
        ],
        receid: [
          { required: true, message: "接收人Id不能为空", trigger: "blur" }
        ],
        recename: [
          { required: true, message: "接收人名称不能为空", trigger: "blur" },
          { min: 10, max: 200, message: '长度在 10 到 200 个字符', trigger: 'blur' }
        ],
        optid: [
          { required: true, message: "操作人ID不能为空", trigger: "blur" }
        ],
        optname: [
          { required: true, message: "操作人名称不能为空", trigger: "blur" },
          { min: 10, max: 200, message: '长度在 10 到 200 个字符', trigger: 'blur' }
        ],
        enddt: [
          { required: true, message: "截止时间不能为空", trigger: "blur" },
          { type: 'date', required: true, message: '请选择操作时间', trigger: 'change' }
        ],
        startdt: [
          { required: true, message: "开始时间不能为空", trigger: "blur" },
          { type: 'date', required: true, message: '请选择操作时间', trigger: 'change' }
        ],
        zuozhe: [
          { required: true, message: "发布者不能为空", trigger: "blur" },
          { min: 10, max: 30, message: '长度在 10 到 30 个字符', trigger: 'blur' }
        ],
        indate: [
          { required: true, message: "日期不能为空", trigger: "blur" },
          { type: 'date', required: true, message: '请选择操作时间', trigger: 'change' }
        ],
        status: [
          { required: true, message: "状态不能为空", trigger: "blur" }
        ],
        fengmian: [
          { required: true, message: "封面图片不能为空", trigger: "blur" },
          { min: 10, max: 100, message: '长度在 10 到 100 个字符', trigger: 'blur' }
        ],
        mintou: [
          { required: true, message: "至少投票不能为空", trigger: "blur" }
        ],
        maxtou: [
          { required: true, message: "最多投投票0不限制不能为空", trigger: "blur" }
        ],
        issms: [
          { required: true, message: "是否发短信不能为空", trigger: "blur" }
        ],
        istop: [
          { required: true, message: "排序号越大越靠前不能为空", trigger: "blur" }
        ],
        comid: [
          { required: true, message: "对应单位id不能为空", trigger: "blur" }
        ],
        appxs: [
          { required: true, message: "app首页显示不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询新闻资讯列表 */
    getList() {
      this.loading = true;
      listNews(this.queryParams).then(response => {
        this.newsList = response.rows;
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
        optdt: null,
        typename: null,
        content: null,
        url: null,
        receid: null,
        recename: null,
        optid: null,
        optname: null,
        enddt: null,
        startdt: null,
        zuozhe: null,
        indate: null,
        status: 0,
        fengmian: null,
        mintou: null,
        maxtou: null,
        issms: null,
        istop: null,
        comid: null,
        appxs: null
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
      this.title = "添加新闻资讯";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getNews(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改新闻资讯";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateNews(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addNews(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除新闻资讯编号为"' + ids + '"的数据项？').then(function() {
        return delNews(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('xinhu-person/news/export', {
        ...this.queryParams
      }, `news_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
