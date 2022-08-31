<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="答案A" prop="ana">
        <el-input
          v-model="queryParams.ana"
          placeholder="请输入答案A"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="答案B" prop="anb">
        <el-input
          v-model="queryParams.anb"
          placeholder="请输入答案B"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="答案C" prop="anc">
        <el-input
          v-model="queryParams.anc"
          placeholder="请输入答案C"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="答案D" prop="and">
        <el-input
          v-model="queryParams.and"
          placeholder="请输入答案D"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="答案E" prop="ane">
        <el-input
          v-model="queryParams.ane"
          placeholder="请输入答案E"
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
          v-hasPermi="['xinhu-hr:knowtiku:add']"
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
          v-hasPermi="['xinhu-hr:knowtiku:edit']"
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
          v-hasPermi="['xinhu-hr:knowtiku:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['xinhu-hr:knowtiku:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="knowtikuList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="标题" align="center" prop="title" />
      <el-table-column label="答案A" align="center" prop="ana" />
      <el-table-column label="答案B" align="center" prop="anb" />
      <el-table-column label="答案C" align="center" prop="anc" />
      <el-table-column label="答案D" align="center" prop="and" />
      <el-table-column label="答案E" align="center" prop="ane" />
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
            v-hasPermi="['xinhu-hr:knowtiku:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['xinhu-hr:knowtiku:remove']"
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

    <!-- 添加或修改知识题库对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="180px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="类型ID" prop="typeid">
          <el-input v-model="form.typeid" placeholder="请输入类型ID" />
        </el-form-item>
        <el-form-item label="答案A" prop="ana">
          <el-input v-model="form.ana" placeholder="请输入答案A" />
        </el-form-item>
        <el-form-item label="答案B" prop="anb">
          <el-input v-model="form.anb" placeholder="请输入答案B" />
        </el-form-item>
        <el-form-item label="答案C" prop="anc">
          <el-input v-model="form.anc" placeholder="请输入答案C" />
        </el-form-item>
        <el-form-item label="答案D" prop="and">
          <el-input v-model="form.and" placeholder="请输入答案D" />
        </el-form-item>
        <el-form-item label="答案E" prop="ane">
          <el-input v-model="form.ane" placeholder="请输入答案E" />
        </el-form-item>
        <el-form-item label="答案" prop="answer">
          <el-input v-model="form.answer" placeholder="请输入答案" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="form.sort" placeholder="请输入排序" />
        </el-form-item>
        <el-form-item label="添加时间" prop="adddt">
          <el-date-picker clearable size="small"
            v-model="form.adddt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择添加时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="操作时间" prop="optdt">
          <el-date-picker clearable size="small"
            v-model="form.optdt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择操作时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="说明" prop="contents">
          <el-input v-model="form.contents" type="textarea" placeholder="请输入说明" />
        </el-form-item>
        <el-form-item label="内容">
          <editor v-model="form.content" :min-height="192"/>
        </el-form-item>
        <el-form-item label="操作ID" prop="optid">
          <el-input v-model="form.optid" placeholder="请输入操作ID" />
        </el-form-item>
        <el-form-item label="相关图片地址" prop="imgurl">
          <el-input v-model="form.imgurl" placeholder="请输入相关图片地址" />
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
import { listKnowtiku, getKnowtiku, delKnowtiku, addKnowtiku, updateKnowtiku } from "@/api/xinhu-hr/knowtiku";

export default {
  name: "Knowtiku",
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
      // 知识题库表格数据
      knowtikuList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        title: null,
        typeid: null,
        type: null,
        ana: null,
        anb: null,
        anc: null,
        and: null,
        ane: null,
        answer: null,
        sort: null,
        adddt: null,
        optdt: null,
        contents: null,
        status: null,
        content: null,
        optid: null,
        imgurl: null,
        comid: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        title: [
          { required: true, message: "标题不能为空", trigger: "blur" }
        ],
        typeid: [
          { required: true, message: "类型ID不能为空", trigger: "blur" }
        ],
        type: [
          { required: true, message: "0单选,1多选,2判断题不能为空", trigger: "change" }
        ],
        ana: [
          { required: true, message: "答案A不能为空", trigger: "blur" }
        ],
        anb: [
          { required: true, message: "答案B不能为空", trigger: "blur" }
        ],
        anc: [
          { required: true, message: "答案C不能为空", trigger: "blur" }
        ],
        and: [
          { required: true, message: "答案D不能为空", trigger: "blur" }
        ],
        ane: [
          { required: true, message: "答案E不能为空", trigger: "blur" }
        ],
        answer: [
          { required: true, message: "答案不能为空", trigger: "blur" }
        ],
        sort: [
          { required: true, message: "排序号不能为空", trigger: "blur" }
        ],
        adddt: [
          { required: true, message: "添加时间不能为空", trigger: "blur" }
        ],
        optdt: [
          { required: true, message: "操作时间不能为空", trigger: "blur" }
        ],
        contents: [
          { required: true, message: "说明不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "状态不能为空", trigger: "blur" }
        ],
        content: [
          { required: true, message: "内容不能为空", trigger: "blur" }
        ],
        optid: [
          { required: true, message: "操作人ID不能为空", trigger: "blur" }
        ],
        imgurl: [
          { required: true, message: "相关图片地址不能为空", trigger: "blur" }
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
    /** 查询知识题库列表 */
    getList() {
      this.loading = true;
      listKnowtiku(this.queryParams).then(response => {
        this.knowtikuList = response.rows;
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
        typeid: null,
        type: null,
        ana: null,
        anb: null,
        anc: null,
        and: null,
        ane: null,
        answer: null,
        sort: null,
        adddt: null,
        optdt: null,
        contents: null,
        status: 0,
        content: null,
        optid: null,
        imgurl: null,
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
      this.title = "添加知识题库";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getKnowtiku(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改知识题库";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateKnowtiku(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addKnowtiku(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除知识题库编号为"' + ids + '"的数据项？').then(function() {
        return delKnowtiku(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('xinhu-hr/knowtiku/export', {
        ...this.queryParams
      }, `knowtiku_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
