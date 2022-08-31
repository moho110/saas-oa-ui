<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="考核名称" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入考核名称"
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
          v-hasPermi="['xinhu-hr:hrkaohem:add']"
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
          v-hasPermi="['xinhu-hr:hrkaohem:edit']"
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
          v-hasPermi="['xinhu-hr:hrkaohem:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['xinhu-hr:hrkaohem:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="hrkaohemList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="考核名称" align="center" prop="title" />
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
      <el-table-column label="对应考核人" align="center" prop="recename" />
      <el-table-column label="操作人" align="center" prop="optname" />
      <el-table-column label="操作时间" align="center" prop="optdt" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.optdt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="合格分数" align="center" prop="hegfen" />
      <el-table-column label="最高分数" align="center" prop="maxfen" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['xinhu-hr:hrkaohem:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['xinhu-hr:hrkaohem:remove']"
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

    <!-- 添加或修改考核项目对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="180px">
        <el-form-item label="考核名称" prop="title">
          <el-input v-model="form.title" placeholder="请输入考核名称" />
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
        <el-form-item label="对应考核人ID" prop="receid">
          <el-input v-model="form.receid" type="textarea" placeholder="请输入对应考核人ID" />
        </el-form-item>
        <el-form-item label="对应考核人" prop="recename">
          <el-input v-model="form.recename" type="textarea" placeholder="请输入对应考核人" />
        </el-form-item>
        <el-form-item label="操作ID" prop="optid">
          <el-input v-model="form.optid" placeholder="请输入操作ID" />
        </el-form-item>
        <el-form-item label="操作人" prop="optname">
          <el-input v-model="form.optname" placeholder="请输入操作人" />
        </el-form-item>
        <el-form-item label="操作时间" prop="optdt">
          <el-date-picker clearable size="small"
            v-model="form.optdt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择操作时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="合格分数" prop="hegfen">
          <el-input v-model="form.hegfen" placeholder="请输入合格分数" />
        </el-form-item>
        <el-form-item label="最高分数" prop="maxfen">
          <el-input v-model="form.maxfen" placeholder="请输入最高分数" />
        </el-form-item>
        <el-form-item label="考核频率" prop="pinlv">
          <el-input v-model="form.pinlv" placeholder="请输入考核频率" />
        </el-form-item>
        <el-form-item label="生成时间" prop="sctime">
          <el-input v-model="form.sctime" placeholder="请输入生成时间" />
        </el-form-item>
        <el-form-item label="评分时间(天)" prop="pfsj">
          <el-input v-model="form.pfsj" placeholder="请输入评分时间(天)" />
        </el-form-item>
        <el-form-item label="是否启用" prop="status">
          <el-radio v-model="form.status" label="1">是</el-radio>
          <el-radio v-model="form.status" label="0">否</el-radio>
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
import { listHrkaohem, getHrkaohem, delHrkaohem, addHrkaohem, updateHrkaohem } from "@/api/xinhu-hr/hrkaohem";

export default {
  name: "Hrkaohem",
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
      // 考核项目表格数据
      hrkaohemList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        title: null,
        startdt: null,
        enddt: null,
        receid: null,
        recename: null,
        optid: null,
        optname: null,
        optdt: null,
        hegfen: null,
        maxfen: null,
        pinlv: null,
        sctime: null,
        pfsj: null,
        status: null,
        comid: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        title: [
          { required: true, message: "考核名称不能为空", trigger: "blur" }
        ],
        startdt: [
          { required: true, message: "开始日期不能为空", trigger: "blur" }
        ],
        enddt: [
          { required: true, message: "截止日期不能为空", trigger: "blur" }
        ],
        receid: [
          { required: true, message: "对应考核人ID不能为空", trigger: "blur" }
        ],
        recename: [
          { required: true, message: "对应考核人不能为空", trigger: "blur" }
        ],
        optid: [
          { required: true, message: "操作人ID不能为空", trigger: "blur" }
        ],
        optname: [
          { required: true, message: "操作人不能为空", trigger: "blur" }
        ],
        optdt: [
          { required: true, message: "操作时间不能为空", trigger: "blur" }
        ],
        hegfen: [
          { required: true, message: "合格分数不能为空", trigger: "blur" }
        ],
        maxfen: [
          { required: true, message: "最高分数不能为空", trigger: "blur" }
        ],
        pinlv: [
          { required: true, message: "考核频率不能为空", trigger: "blur" }
        ],
        sctime: [
          { required: true, message: "生成时间不能为空", trigger: "blur" }
        ],
        pfsj: [
          { required: true, message: "评分时间(天)不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "是否启用不能为空", trigger: "blur" }
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
    /** 查询考核项目列表 */
    getList() {
      this.loading = true;
      listHrkaohem(this.queryParams).then(response => {
        this.hrkaohemList = response.rows;
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
        startdt: null,
        enddt: null,
        receid: null,
        recename: null,
        optid: null,
        optname: null,
        optdt: null,
        hegfen: null,
        maxfen: null,
        pinlv: null,
        sctime: null,
        pfsj: null,
        status: 0,
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
      this.title = "添加考核项目";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getHrkaohem(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改考核项目";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateHrkaohem(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addHrkaohem(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除考核项目编号为"' + ids + '"的数据项？').then(function() {
        return delHrkaohem(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('xinhu-hr/hrkaohem/export', {
        ...this.queryParams
      }, `hrkaohem_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
