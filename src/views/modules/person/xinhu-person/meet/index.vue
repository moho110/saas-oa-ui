<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="会议室名称" prop="hyname">
        <el-input
          v-model="queryParams.hyname"
          placeholder="请输入会议室名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="主题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入主题"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="发起人" prop="optname">
        <el-input
          v-model="queryParams.optname"
          placeholder="请输入发起人"
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
          v-hasPermi="['xinhu-person:meet:add']"
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
          v-hasPermi="['xinhu-person:meet:edit']"
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
          v-hasPermi="['xinhu-person:meet:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['xinhu-person:meet:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="meetList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="会议室名称" align="center" prop="hyname" />
      <el-table-column label="主题" align="center" prop="title" />
      <el-table-column label="开始时间" align="center" prop="startdt" />
      <el-table-column label="结束时间" align="center" prop="enddt" />
      <el-table-column label="发起人" align="center" prop="optname" />
      <el-table-column label="操作时间" align="center" prop="optdt" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.optdt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="主持人" align="center" prop="zcren" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['xinhu-person:meet:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['xinhu-person:meet:remove']"
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

    <!-- 添加或修改会议对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="180px">
        <el-form-item label="会议室名称" prop="hyname">
          <el-input v-model="form.hyname" placeholder="请输入会议室名称" />
        </el-form-item>
        <el-form-item label="主题" prop="title">
          <el-input v-model="form.title" placeholder="请输入主题" />
        </el-form-item>
        <el-form-item label="开始时间" prop="startdt">
          <el-date-picker clearable size="small"
            v-model="form.startdt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择开始时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="enddt">
          <el-date-picker clearable size="small"
            v-model="form.enddt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择结束时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="会议状态" prop="state">
          <el-select v-model="form.state" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.state"
              :label="item.label"
              :value="item.state">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="参加人ID" prop="joinid">
          <el-input v-model="form.joinid" placeholder="请输入参加人ID" />
        </el-form-item>
        <el-form-item label="参加人员" prop="joinname">
          <el-input v-model="form.joinname" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="会议ID" prop="mid">
          <el-input v-model="form.mid" placeholder="请输入会议ID" />
        </el-form-item>
        <el-form-item label="发起人" prop="optname">
          <el-input v-model="form.optname" placeholder="请输入发起人" />
        </el-form-item>
        <el-form-item label="完成率" prop="rate">
          <el-input v-model="form.rate" placeholder="请输入完成率" />
        </el-form-item>
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
        <el-form-item label="操作ID" prop="optid">
          <el-input v-model="form.optid" placeholder="请输入操作ID" />
        </el-form-item>
        <el-form-item label="说明" prop="contents">
          <el-input v-model="form.contents" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="取消理由" prop="cancelreason">
          <el-input v-model="form.cancelreason" type="textarea" placeholder="请输入取消理由" />
        </el-form-item>
        <el-form-item label="会议纪要人id" prop="jyid">
          <el-input v-model="form.jyid" placeholder="请输入会议纪要人id" />
        </el-form-item>
        <el-form-item label="会议纪要人" prop="jyname">
          <el-input v-model="form.jyname" placeholder="请输入会议纪要人" />
        </el-form-item>
        <el-form-item label="会议纪要内容">
          <editor v-model="form.content" :min-height="192"/>
        </el-form-item>
        <el-form-item label="是否短信通知" prop="issms">
          <el-radio v-model="form.issms" label="1">是</el-radio>
          <el-radio v-model="form.issms" label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="对应单位id" prop="comid">
          <el-input v-model="form.comid" placeholder="请输入对应单位id" />
        </el-form-item>
        <el-form-item label="主持人ID" prop="zcrenid">
          <el-input v-model="form.zcrenid" placeholder="请输入${comment}" />
        </el-form-item>
        <el-form-item label="主持人" prop="zcren">
          <el-input v-model="form.zcren" placeholder="请输入主持人" />
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
import { listMeet, getMeet, delMeet, addMeet, updateMeet } from "@/api/xinhu-person/meet";

export default {
  name: "Meet",
  data() {
    return {
      //选择器数据
      options: [{
        state: '1',
        label: '会议中'
      }, {
        state: '2',
        label: '结束'
      }, {
        state: '3',
        label: '取消'
      }, {
        state: '0',
        label: '正常'
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
      // 会议表格数据
      meetList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        hyname: null,
        title: null,
        startdt: null,
        enddt: null,
        state: null,
        status: null,
        type: null,
        joinid: null,
        joinname: null,
        mid: null,
        optname: null,
        rate: null,
        uid: null,
        optdt: null,
        optid: null,
        contents: null,
        cancelreason: null,
        jyid: null,
        jyname: null,
        content: null,
        issms: null,
        comid: null,
        zcrenid: null,
        zcren: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        hyname: [
          { required: true, message: "会议室名称不能为空", trigger: "blur" },
          { min: 10, max: 20, message: '长度在 10 到 20 个字符', trigger: 'blur' }
        ],
        title: [
          { required: true, message: "主题不能为空", trigger: "blur" },
          { min: 10, max: 100, message: '长度在 10 到 100 个字符', trigger: 'blur' }
        ],
        startdt: [
          { required: true, message: "开始时间不能为空", trigger: "blur" },
          { type: 'date', required: true, message: '请选择开始时间', trigger: 'change' }
        ],
        enddt: [
          { required: true, message: "结束时间不能为空", trigger: "blur" },
          { type: 'date', required: true, message: '请选择结束时间', trigger: 'change' }
        ],
        state: [
          { required: true, message: "会议状态@0|正常,1|会议中,2|结束,3|取消不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "状态不能为空", trigger: "blur" }
        ],
        type: [
          { required: true, message: "类型@0|普通,1|固定,2|纪要不能为空", trigger: "change" }
        ],
        joinid: [
          { required: true, message: "参加者ID不能为空", trigger: "blur" }
        ],
        joinname: [
          { required: true, message: "参加人员不能为空", trigger: "blur" },
          { min: 10, max: 500, message: '长度在 10 到 500 个字符', trigger: 'blur' }
        ],
        mid: [
          { required: true, message: "会议ID不能为空", trigger: "blur" }
        ],
        optname: [
          { required: true, message: "发起人不能为空", trigger: "blur" },
          { min: 10, max: 20, message: '长度在 10 到 20 个字符', trigger: 'blur' }
        ],
        rate: [
          { required: true, message: "参加率不能为空", trigger: "blur" }
        ],
        uid: [
          { required: true, message: "用户ID不能为空", trigger: "blur" }
        ],
        optdt: [
          { required: true, message: "操作时间不能为空", trigger: "blur" },
          { type: 'date', required: true, message: '请选择操作时间', trigger: 'change' }
        ],
        optid: [
          { required: true, message: "操作人ID不能为空", trigger: "blur" }
        ],
        contents: [
          { required: true, message: "说明不能为空", trigger: "blur" },
          { min: 10, max: 500, message: '长度在 10 到 500 个字符', trigger: 'blur' }
        ],
        cancelreason: [
          { required: true, message: "取消理由不能为空", trigger: "blur" },
          { min: 10, max: 200, message: '长度在 10 到 200 个字符', trigger: 'blur' }
        ],
        jyid: [
          { required: true, message: "会议纪要人id不能为空", trigger: "blur" }
        ],
        jyname: [
          { required: true, message: "会议纪要人不能为空", trigger: "blur" },
          { min: 10, max: 100, message: '长度在 10 到 100 个字符', trigger: 'blur' }
        ],
        content: [
          { required: true, message: "会议纪要内容不能为空", trigger: "blur" },
          { min: 10, max: 4000, message: '长度在 10 到 4000 个字符', trigger: 'blur' }
        ],
        issms: [
          { required: true, message: "是否短信通知不能为空", trigger: "blur" }
        ],
        comid: [
          { required: true, message: "对应单位id不能为空", trigger: "blur" }
        ],
        zcrenid: [
          { required: true, message: "主持人ID不能为空", trigger: "blur" }
        ],
        zcren: [
          { required: true, message: "主持人不能为空", trigger: "blur" },
          { min: 10, max: 50, message: '长度在 10 到 50 个字符', trigger: 'blur' }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询会议列表 */
    getList() {
      this.loading = true;
      listMeet(this.queryParams).then(response => {
        this.meetList = response.rows;
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
        hyname: null,
        title: null,
        startdt: null,
        enddt: null,
        state: null,
        status: 0,
        type: null,
        joinid: null,
        joinname: null,
        mid: null,
        optname: null,
        rate: null,
        uid: null,
        optdt: null,
        optid: null,
        contents: null,
        cancelreason: null,
        jyid: null,
        jyname: null,
        content: null,
        issms: null,
        comid: null,
        zcrenid: null,
        zcren: null
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
      this.title = "添加会议";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getMeet(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改会议";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateMeet(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addMeet(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除会议编号为"' + ids + '"的数据项？').then(function() {
        return delMeet(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('xinhu-person/meet/export', {
        ...this.queryParams
      }, `meet_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
