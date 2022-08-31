<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="${comment}" prop="uid">
        <el-input
          v-model="queryParams.uid"
          placeholder="请输入${comment}"
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
      <el-form-item label="${comment}" prop="optid">
        <el-input
          v-model="queryParams.optid"
          placeholder="请输入${comment}"
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
      <el-form-item label="申请日期" prop="applydt">
        <el-date-picker clearable size="small"
          v-model="queryParams.applydt"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择申请日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="是否提交" prop="isturn">
        <el-input
          v-model="queryParams.isturn"
          placeholder="请输入是否提交"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="维修车辆" prop="carid">
        <el-input
          v-model="queryParams.carid"
          placeholder="请输入维修车辆"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="维修地点" prop="address">
        <el-input
          v-model="queryParams.address"
          placeholder="请输入维修地点"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="驾驶员" prop="jianame">
        <el-input
          v-model="queryParams.jianame"
          placeholder="请输入驾驶员"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="${comment}" prop="jiaid">
        <el-input
          v-model="queryParams.jiaid"
          placeholder="请输入${comment}"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="更换部件" prop="bujian">
        <el-input
          v-model="queryParams.bujian"
          placeholder="请输入更换部件"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="维修时间" prop="startdt">
        <el-date-picker clearable size="small"
          v-model="queryParams.startdt"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择维修时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="维修截止时间" prop="enddt">
        <el-date-picker clearable size="small"
          v-model="queryParams.enddt"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择维修截止时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="维修金额" prop="money">
        <el-input
          v-model="queryParams.money"
          placeholder="请输入维修金额"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="下次保养日期" prop="nextdt">
        <el-date-picker clearable size="small"
          v-model="queryParams.nextdt"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择下次保养日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="当前保养公里数" prop="kmshu">
        <el-input
          v-model="queryParams.kmshu"
          placeholder="请输入当前保养公里数"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="下次保养公里数" prop="kmnshu">
        <el-input
          v-model="queryParams.kmnshu"
          placeholder="请输入下次保养公里数"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="对应单位id" prop="comid">
        <el-input
          v-model="queryParams.comid"
          placeholder="请输入对应单位id"
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
          v-hasPermi="['xinhu-finance:carmang:add']"
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
          v-hasPermi="['xinhu-finance:carmang:edit']"
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
          v-hasPermi="['xinhu-finance:carmang:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['xinhu-finance:carmang:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="carmangList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="${comment}" align="center" prop="id" />
      <el-table-column label="${comment}" align="center" prop="uid" />
      <el-table-column label="操作时间" align="center" prop="optdt" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.optdt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="${comment}" align="center" prop="optid" />
      <el-table-column label="操作人" align="center" prop="optname" />
      <el-table-column label="申请日期" align="center" prop="applydt" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.applydt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="说明" align="center" prop="explain" />
      <el-table-column label="状态" align="center" prop="status" />
      <el-table-column label="是否提交" align="center" prop="isturn" />
      <el-table-column label="维修车辆" align="center" prop="carid" />
      <el-table-column label="维修原因" align="center" prop="reason" />
      <el-table-column label="维修地点" align="center" prop="address" />
      <el-table-column label="驾驶员" align="center" prop="jianame" />
      <el-table-column label="${comment}" align="center" prop="jiaid" />
      <el-table-column label="更换部件" align="center" prop="bujian" />
      <el-table-column label="维修时间" align="center" prop="startdt" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.startdt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="维修截止时间" align="center" prop="enddt" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.enddt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="维修金额" align="center" prop="money" />
      <el-table-column label="类型@0|车辆维修,1|保养" align="center" prop="type" />
      <el-table-column label="下次保养日期" align="center" prop="nextdt" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.nextdt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="当前保养公里数" align="center" prop="kmshu" />
      <el-table-column label="下次保养公里数" align="center" prop="kmnshu" />
      <el-table-column label="对应单位id" align="center" prop="comid" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['xinhu-finance:carmang:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['xinhu-finance:carmang:remove']"
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

    <!-- 添加或修改车辆维修保养记录对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="${comment}" prop="uid">
          <el-input v-model="form.uid" placeholder="请输入${comment}" />
        </el-form-item>
        <el-form-item label="操作时间" prop="optdt">
          <el-date-picker clearable size="small"
            v-model="form.optdt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择操作时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="${comment}" prop="optid">
          <el-input v-model="form.optid" placeholder="请输入${comment}" />
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
        <el-form-item label="说明" prop="explain">
          <el-input v-model="form.explain" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="是否提交" prop="isturn">
          <el-input v-model="form.isturn" placeholder="请输入是否提交" />
        </el-form-item>
        <el-form-item label="维修车辆" prop="carid">
          <el-input v-model="form.carid" placeholder="请输入维修车辆" />
        </el-form-item>
        <el-form-item label="维修原因" prop="reason">
          <el-input v-model="form.reason" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="维修地点" prop="address">
          <el-input v-model="form.address" placeholder="请输入维修地点" />
        </el-form-item>
        <el-form-item label="驾驶员" prop="jianame">
          <el-input v-model="form.jianame" placeholder="请输入驾驶员" />
        </el-form-item>
        <el-form-item label="${comment}" prop="jiaid">
          <el-input v-model="form.jiaid" placeholder="请输入${comment}" />
        </el-form-item>
        <el-form-item label="更换部件" prop="bujian">
          <el-input v-model="form.bujian" placeholder="请输入更换部件" />
        </el-form-item>
        <el-form-item label="维修时间" prop="startdt">
          <el-date-picker clearable size="small"
            v-model="form.startdt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择维修时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="维修截止时间" prop="enddt">
          <el-date-picker clearable size="small"
            v-model="form.enddt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择维修截止时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="维修金额" prop="money">
          <el-input v-model="form.money" placeholder="请输入维修金额" />
        </el-form-item>
        <el-form-item label="下次保养日期" prop="nextdt">
          <el-date-picker clearable size="small"
            v-model="form.nextdt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择下次保养日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="当前保养公里数" prop="kmshu">
          <el-input v-model="form.kmshu" placeholder="请输入当前保养公里数" />
        </el-form-item>
        <el-form-item label="下次保养公里数" prop="kmnshu">
          <el-input v-model="form.kmnshu" placeholder="请输入下次保养公里数" />
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
import { listCarmang, getCarmang, delCarmang, addCarmang, updateCarmang } from "@/api/xinhu-finance/carmang";

export default {
  name: "Carmang",
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
      // 车辆维修保养记录表格数据
      carmangList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        uid: null,
        optdt: null,
        optid: null,
        optname: null,
        applydt: null,
        explain: null,
        status: null,
        isturn: null,
        carid: null,
        reason: null,
        address: null,
        jianame: null,
        jiaid: null,
        bujian: null,
        startdt: null,
        enddt: null,
        money: null,
        type: null,
        nextdt: null,
        kmshu: null,
        kmnshu: null,
        comid: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        uid: [
          { required: true, message: "$comment不能为空", trigger: "blur" }
        ],
        optdt: [
          { required: true, message: "操作时间不能为空", trigger: "blur" }
        ],
        optid: [
          { required: true, message: "$comment不能为空", trigger: "blur" }
        ],
        optname: [
          { required: true, message: "操作人不能为空", trigger: "blur" }
        ],
        applydt: [
          { required: true, message: "申请日期不能为空", trigger: "blur" }
        ],
        explain: [
          { required: true, message: "说明不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "状态不能为空", trigger: "blur" }
        ],
        isturn: [
          { required: true, message: "是否提交不能为空", trigger: "blur" }
        ],
        carid: [
          { required: true, message: "维修车辆不能为空", trigger: "blur" }
        ],
        reason: [
          { required: true, message: "维修原因不能为空", trigger: "blur" }
        ],
        address: [
          { required: true, message: "维修地点不能为空", trigger: "blur" }
        ],
        jianame: [
          { required: true, message: "驾驶员不能为空", trigger: "blur" }
        ],
        jiaid: [
          { required: true, message: "$comment不能为空", trigger: "blur" }
        ],
        bujian: [
          { required: true, message: "更换部件不能为空", trigger: "blur" }
        ],
        startdt: [
          { required: true, message: "维修时间不能为空", trigger: "blur" }
        ],
        enddt: [
          { required: true, message: "维修截止时间不能为空", trigger: "blur" }
        ],
        money: [
          { required: true, message: "维修金额不能为空", trigger: "blur" }
        ],
        type: [
          { required: true, message: "类型@0|车辆维修,1|保养不能为空", trigger: "change" }
        ],
        nextdt: [
          { required: true, message: "下次保养日期不能为空", trigger: "blur" }
        ],
        kmshu: [
          { required: true, message: "当前保养公里数不能为空", trigger: "blur" }
        ],
        kmnshu: [
          { required: true, message: "下次保养公里数不能为空", trigger: "blur" }
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
    /** 查询车辆维修保养记录列表 */
    getList() {
      this.loading = true;
      listCarmang(this.queryParams).then(response => {
        this.carmangList = response.rows;
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
        optdt: null,
        optid: null,
        optname: null,
        applydt: null,
        explain: null,
        status: 0,
        isturn: null,
        carid: null,
        reason: null,
        address: null,
        jianame: null,
        jiaid: null,
        bujian: null,
        startdt: null,
        enddt: null,
        money: null,
        type: null,
        nextdt: null,
        kmshu: null,
        kmnshu: null,
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
      this.title = "添加车辆维修保养记录";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getCarmang(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改车辆维修保养记录";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateCarmang(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addCarmang(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除车辆维修保养记录编号为"' + ids + '"的数据项？').then(function() {
        return delCarmang(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('xinhu-finance/carmang/export', {
        ...this.queryParams
      }, `carmang_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
