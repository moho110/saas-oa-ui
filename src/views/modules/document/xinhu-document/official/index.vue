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
      <el-form-item label="副标题" prop="titles">
        <el-input
          v-model="queryParams.titles"
          placeholder="请输入副标题"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="等级" prop="grade">
        <el-input
          v-model="queryParams.grade"
          placeholder="请输入等级"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="操作人" prop="optname">
        <el-input
          v-model="queryParams.optname"
          placeholder="请输入操作人名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="编号" prop="num">
        <el-input
          v-model="queryParams.num"
          placeholder="请输入编号"
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
          v-hasPermi="['xinhu-document:official:add']"
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
          v-hasPermi="['xinhu-document:official:edit']"
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
          v-hasPermi="['xinhu-document:official:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['xinhu-document:official:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="officialList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="标题" align="center" prop="title" />
      <el-table-column label="副标题" align="center" prop="titles" />
      <el-table-column label="等级" align="center" prop="grade" />
      <el-table-column label="操作时间" align="center" prop="optdt" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.optdt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发给" align="center" prop="recename" />
      <el-table-column label="日期" align="center" prop="applydt" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.applydt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="编号" align="center" prop="num" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['xinhu-document:official:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['xinhu-document:official:remove']"
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

    <!-- 添加或修改公文对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="180px">
        <el-form-item label="用户ID" prop="uid">
          <el-input v-model="form.uid" placeholder="请输入用户ID" />
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="副标题" prop="titles">
          <el-input v-model="form.titles" placeholder="请输入副标题" />
        </el-form-item>
        <el-form-item label="类型" prop="types">
          <el-input v-model="form.types" placeholder="请输入类型" />
        </el-form-item>
        <el-form-item label="等级" prop="grade">
          <el-input v-model="form.grade" placeholder="请输入等级" />
        </el-form-item>
        <el-form-item label="操作人名称" prop="optname">
          <el-input v-model="form.optname" placeholder="请输入操作人名称" />
        </el-form-item>
        <el-form-item label="操作时间" prop="optdt">
          <el-date-picker clearable size="small"
            v-model="form.optdt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择操作时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="内容">
          <editor v-model="form.contents" :min-height="192"/>
        </el-form-item>
        <el-form-item label="来源" prop="receid">
          <el-input v-model="form.receid" placeholder="请输入来源" />
        </el-form-item>
        <el-form-item label="发给" prop="recename">
          <el-input v-model="form.recename" placeholder="请输入发给" />
        </el-form-item>
        <el-form-item label="日期" prop="applydt">
          <el-date-picker clearable size="small"
            v-model="form.applydt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="编号" prop="num">
          <el-input v-model="form.num" placeholder="请输入编号" />
        </el-form-item>
        <el-form-item label="操作ID" prop="optid">
          <el-input v-model="form.optid" placeholder="请输入操作ID" />
        </el-form-item>
        <el-form-item label="说明" prop="content">
          <el-input v-model="form.content" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="是否提交" prop="isturn">
          <el-input v-model="form.isturn" placeholder="请输入是否提交" />
        </el-form-item>
        <el-form-item label="正文文件Id" prop="filecontid">
          <el-input v-model="form.filecontid" placeholder="请输入正文文件Id" />
        </el-form-item>
        <el-form-item label="发文字号" prop="zinum">
          <el-input v-model="form.zinum" placeholder="请输入发文字号" />
        </el-form-item>
        <el-form-item label="主送单位" prop="unitname">
          <el-input v-model="form.unitname" placeholder="请输入主送单位" />
        </el-form-item>
        <el-form-item label="发文单位" prop="unitsame">
          <el-input v-model="form.unitsame" placeholder="请输入发文单位" />
        </el-form-item>
        <el-form-item label="公文密级" prop="miji">
          <el-input v-model="form.miji" placeholder="请输入公文密级" />
        </el-form-item>
        <el-form-item label="来文日期" prop="laidt">
          <el-date-picker clearable size="small"
            v-model="form.laidt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择来文日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="抄送单位" prop="chaoname">
          <el-input v-model="form.chaoname" placeholder="请输入抄送单位" />
        </el-form-item>
        <el-form-item label="正文上称呼" prop="zuncheng">
          <el-input v-model="form.zuncheng" placeholder="请输入正文上称呼" />
        </el-form-item>
        <el-form-item label="对应officialhong里id" prop="thid">
          <el-input v-model="form.thid" placeholder="请输入对应officialhong里id" />
        </el-form-item>
        <el-form-item label="对应印章sealapl里Id" prop="yzid">
          <el-input v-model="form.yzid" placeholder="请输入对应印章sealapl里Id" />
        </el-form-item>
        <el-form-item label="对应分发表officialfa的Id" prop="ffid">
          <el-input v-model="form.ffid" placeholder="请输入对应分发表officialfa的Id" />
        </el-form-item>
        <el-form-item label="截止日期" prop="enddt">
          <el-date-picker clearable size="small"
            v-model="form.enddt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择截止日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="查阅日期" prop="startdt">
          <el-date-picker clearable size="small"
            v-model="form.startdt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择查阅日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="对应单位id" prop="comid">
          <el-input v-model="form.comid" placeholder="请输入对应单位id" />
        </el-form-item>
        <el-form-item label="分发日期" prop="ffdt">
          <el-date-picker clearable size="small"
            v-model="form.ffdt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择分发日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="生成pdf文件id" prop="pdfid">
          <el-input v-model="form.pdfid" placeholder="请输入生成pdf文件id" />
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
import { listOfficial, getOfficial, delOfficial, addOfficial, updateOfficial } from "@/api/xinhu-document/official";

export default {
  name: "Official",
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
      // 公文表格数据
      officialList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        uid: null,
        title: null,
        titles: null,
        types: null,
        type: null,
        grade: null,
        optname: null,
        optdt: null,
        status: null,
        contents: null,
        receid: null,
        recename: null,
        applydt: null,
        num: null,
        optid: null,
        content: null,
        isturn: null,
        filecontid: null,
        zinum: null,
        unitname: null,
        unitsame: null,
        miji: null,
        laidt: null,
        chaoname: null,
        zuncheng: null,
        thid: null,
        yzid: null,
        ffid: null,
        enddt: null,
        startdt: null,
        comid: null,
        ffdt: null,
        pdfid: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        uid: [
          { required: true, message: "$comment不能为空", trigger: "blur" }
        ],
        title: [
          { required: true, message: "标题不能为空", trigger: "blur" }
        ],
        titles: [
          { required: true, message: "副标题不能为空", trigger: "blur" }
        ],
        types: [
          { required: true, message: "类型不能为空", trigger: "blur" }
        ],
        type: [
          { required: true, message: "1收文单,0发文单不能为空", trigger: "change" }
        ],
        grade: [
          { required: true, message: "等级不能为空", trigger: "blur" }
        ],
        optname: [
          { required: true, message: "$comment不能为空", trigger: "blur" }
        ],
        optdt: [
          { required: true, message: "$comment不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "状态不能为空", trigger: "blur" }
        ],
        contents: [
          { required: true, message: "内容不能为空", trigger: "blur" }
        ],
        receid: [
          { required: true, message: "来源不能为空", trigger: "blur" }
        ],
        recename: [
          { required: true, message: "发给不能为空", trigger: "blur" }
        ],
        applydt: [
          { required: true, message: "日期不能为空", trigger: "blur" }
        ],
        num: [
          { required: true, message: "编号不能为空", trigger: "blur" }
        ],
        optid: [
          { required: true, message: "$comment不能为空", trigger: "blur" }
        ],
        content: [
          { required: true, message: "说明不能为空", trigger: "blur" }
        ],
        isturn: [
          { required: true, message: "是否提交不能为空", trigger: "blur" }
        ],
        filecontid: [
          { required: true, message: "正文文件Id不能为空", trigger: "blur" }
        ],
        zinum: [
          { required: true, message: "发文字号不能为空", trigger: "blur" }
        ],
        unitname: [
          { required: true, message: "主送单位不能为空", trigger: "blur" }
        ],
        unitsame: [
          { required: true, message: "发文单位不能为空", trigger: "blur" }
        ],
        miji: [
          { required: true, message: "公文密级不能为空", trigger: "blur" }
        ],
        laidt: [
          { required: true, message: "来文日期不能为空", trigger: "blur" }
        ],
        chaoname: [
          { required: true, message: "抄送单位不能为空", trigger: "blur" }
        ],
        zuncheng: [
          { required: true, message: "正文上称呼不能为空", trigger: "blur" }
        ],
        thid: [
          { required: true, message: "对应officialhong里id不能为空", trigger: "blur" }
        ],
        yzid: [
          { required: true, message: "对应印章sealapl里Id不能为空", trigger: "blur" }
        ],
        ffid: [
          { required: true, message: "对应分发表officialfa的Id不能为空", trigger: "blur" }
        ],
        enddt: [
          { required: true, message: "截止日期不能为空", trigger: "blur" }
        ],
        startdt: [
          { required: true, message: "查阅日期不能为空", trigger: "blur" }
        ],
        comid: [
          { required: true, message: "对应单位id不能为空", trigger: "blur" }
        ],
        ffdt: [
          { required: true, message: "分发日期不能为空", trigger: "blur" }
        ],
        pdfid: [
          { required: true, message: "生成pdf文件id不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询公文列表 */
    getList() {
      this.loading = true;
      listOfficial(this.queryParams).then(response => {
        this.officialList = response.rows;
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
        title: null,
        titles: null,
        types: null,
        type: null,
        grade: null,
        optname: null,
        optdt: null,
        status: 0,
        contents: null,
        receid: null,
        recename: null,
        applydt: null,
        num: null,
        optid: null,
        content: null,
        isturn: null,
        filecontid: null,
        zinum: null,
        unitname: null,
        unitsame: null,
        miji: null,
        laidt: null,
        chaoname: null,
        zuncheng: null,
        thid: null,
        yzid: null,
        ffid: null,
        enddt: null,
        startdt: null,
        comid: null,
        ffdt: null,
        pdfid: null
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
      this.title = "添加公文";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getOfficial(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改公文";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateOfficial(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addOfficial(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除公文编号为"' + ids + '"的数据项？').then(function() {
        return delOfficial(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('xinhu-document/official/export', {
        ...this.queryParams
      }, `official_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
