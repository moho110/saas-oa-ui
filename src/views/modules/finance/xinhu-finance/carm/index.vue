<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="车牌号" prop="carnum">
        <el-input
          v-model="queryParams.carnum"
          placeholder="请输入车牌号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="车辆品牌" prop="carbrand">
        <el-input
          v-model="queryParams.carbrand"
          placeholder="请输入车辆品牌"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="型号" prop="carmode">
        <el-input
          v-model="queryParams.carmode"
          placeholder="请输入型号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="购买日期" prop="buydt">
        <el-date-picker clearable size="small"
          v-model="queryParams.buydt"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择购买日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="购买价格" prop="buyprice">
        <el-input
          v-model="queryParams.buyprice"
          placeholder="请输入购买价格"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="发动机号" prop="enginenb">
        <el-input
          v-model="queryParams.enginenb"
          placeholder="请输入发动机号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否公开使用" prop="ispublic">
        <el-input
          v-model="queryParams.ispublic"
          placeholder="请输入是否公开使用"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="${comment}" prop="optdt">
        <el-date-picker clearable size="small"
          v-model="queryParams.optdt"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择${comment}">
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
      <el-form-item label="${comment}" prop="optname">
        <el-input
          v-model="queryParams.optname"
          placeholder="请输入${comment}"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="${comment}" prop="adddt">
        <el-date-picker clearable size="small"
          v-model="queryParams.adddt"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择${comment}">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="${comment}" prop="createname">
        <el-input
          v-model="queryParams.createname"
          placeholder="请输入${comment}"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态@0|办理中,1|可用,2|维修中,3|报废" prop="state">
        <el-input
          v-model="queryParams.state"
          placeholder="请输入状态@0|办理中,1|可用,2|维修中,3|报废"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="车架号" prop="framenum">
        <el-input
          v-model="queryParams.framenum"
          placeholder="请输入车架号"
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
          v-hasPermi="['xinhu-finance:carm:add']"
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
          v-hasPermi="['xinhu-finance:carm:edit']"
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
          v-hasPermi="['xinhu-finance:carm:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['xinhu-finance:carm:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="carmList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="${comment}" align="center" prop="id" />
      <el-table-column label="车牌号" align="center" prop="carnum" />
      <el-table-column label="车辆品牌" align="center" prop="carbrand" />
      <el-table-column label="型号" align="center" prop="carmode" />
      <el-table-column label="车辆类型" align="center" prop="cartype" />
      <el-table-column label="购买日期" align="center" prop="buydt" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.buydt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="购买价格" align="center" prop="buyprice" />
      <el-table-column label="发动机号" align="center" prop="enginenb" />
      <el-table-column label="是否公开使用" align="center" prop="ispublic" />
      <el-table-column label="${comment}" align="center" prop="optdt" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.optdt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="${comment}" align="center" prop="optid" />
      <el-table-column label="${comment}" align="center" prop="optname" />
      <el-table-column label="${comment}" align="center" prop="adddt" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.adddt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="${comment}" align="center" prop="createname" />
      <el-table-column label="说明" align="center" prop="explain" />
      <el-table-column label="状态@0|办理中,1|可用,2|维修中,3|报废" align="center" prop="state" />
      <el-table-column label="车架号" align="center" prop="framenum" />
      <el-table-column label="${comment}" align="center" prop="status" />
      <el-table-column label="对应单位id" align="center" prop="comid" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['xinhu-finance:carm:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['xinhu-finance:carm:remove']"
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

    <!-- 添加或修改车辆对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="车牌号" prop="carnum">
          <el-input v-model="form.carnum" placeholder="请输入车牌号" />
        </el-form-item>
        <el-form-item label="车辆品牌" prop="carbrand">
          <el-input v-model="form.carbrand" placeholder="请输入车辆品牌" />
        </el-form-item>
        <el-form-item label="型号" prop="carmode">
          <el-input v-model="form.carmode" placeholder="请输入型号" />
        </el-form-item>
        <el-form-item label="购买日期" prop="buydt">
          <el-date-picker clearable size="small"
            v-model="form.buydt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择购买日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="购买价格" prop="buyprice">
          <el-input v-model="form.buyprice" placeholder="请输入购买价格" />
        </el-form-item>
        <el-form-item label="发动机号" prop="enginenb">
          <el-input v-model="form.enginenb" placeholder="请输入发动机号" />
        </el-form-item>
        <el-form-item label="是否公开使用" prop="ispublic">
          <el-input v-model="form.ispublic" placeholder="请输入是否公开使用" />
        </el-form-item>
        <el-form-item label="${comment}" prop="optdt">
          <el-date-picker clearable size="small"
            v-model="form.optdt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择${comment}">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="${comment}" prop="optid">
          <el-input v-model="form.optid" placeholder="请输入${comment}" />
        </el-form-item>
        <el-form-item label="${comment}" prop="optname">
          <el-input v-model="form.optname" placeholder="请输入${comment}" />
        </el-form-item>
        <el-form-item label="${comment}" prop="adddt">
          <el-date-picker clearable size="small"
            v-model="form.adddt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择${comment}">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="${comment}" prop="createname">
          <el-input v-model="form.createname" placeholder="请输入${comment}" />
        </el-form-item>
        <el-form-item label="说明" prop="explain">
          <el-input v-model="form.explain" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="状态@0|办理中,1|可用,2|维修中,3|报废" prop="state">
          <el-input v-model="form.state" placeholder="请输入状态@0|办理中,1|可用,2|维修中,3|报废" />
        </el-form-item>
        <el-form-item label="车架号" prop="framenum">
          <el-input v-model="form.framenum" placeholder="请输入车架号" />
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
import { listCarm, getCarm, delCarm, addCarm, updateCarm } from "@/api/xinhu-finance/carm";

export default {
  name: "Carm",
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
      // 车辆表格数据
      carmList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        carnum: null,
        carbrand: null,
        carmode: null,
        cartype: null,
        buydt: null,
        buyprice: null,
        enginenb: null,
        ispublic: null,
        optdt: null,
        optid: null,
        optname: null,
        adddt: null,
        createname: null,
        explain: null,
        state: null,
        framenum: null,
        status: null,
        comid: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        carnum: [
          { required: true, message: "车牌号不能为空", trigger: "blur" }
        ],
        carbrand: [
          { required: true, message: "车辆品牌不能为空", trigger: "blur" }
        ],
        carmode: [
          { required: true, message: "型号不能为空", trigger: "blur" }
        ],
        cartype: [
          { required: true, message: "车辆类型不能为空", trigger: "change" }
        ],
        buydt: [
          { required: true, message: "购买日期不能为空", trigger: "blur" }
        ],
        buyprice: [
          { required: true, message: "购买价格不能为空", trigger: "blur" }
        ],
        enginenb: [
          { required: true, message: "发动机号不能为空", trigger: "blur" }
        ],
        ispublic: [
          { required: true, message: "是否公开使用不能为空", trigger: "blur" }
        ],
        optdt: [
          { required: true, message: "$comment不能为空", trigger: "blur" }
        ],
        optid: [
          { required: true, message: "$comment不能为空", trigger: "blur" }
        ],
        optname: [
          { required: true, message: "$comment不能为空", trigger: "blur" }
        ],
        adddt: [
          { required: true, message: "$comment不能为空", trigger: "blur" }
        ],
        createname: [
          { required: true, message: "$comment不能为空", trigger: "blur" }
        ],
        explain: [
          { required: true, message: "说明不能为空", trigger: "blur" }
        ],
        state: [
          { required: true, message: "状态@0|办理中,1|可用,2|维修中,3|报废不能为空", trigger: "blur" }
        ],
        framenum: [
          { required: true, message: "车架号不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "$comment不能为空", trigger: "blur" }
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
    /** 查询车辆列表 */
    getList() {
      this.loading = true;
      listCarm(this.queryParams).then(response => {
        this.carmList = response.rows;
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
        carnum: null,
        carbrand: null,
        carmode: null,
        cartype: null,
        buydt: null,
        buyprice: null,
        enginenb: null,
        ispublic: null,
        optdt: null,
        optid: null,
        optname: null,
        adddt: null,
        createname: null,
        explain: null,
        state: null,
        framenum: null,
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
      this.title = "添加车辆";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getCarm(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改车辆";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateCarm(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addCarm(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除车辆编号为"' + ids + '"的数据项？').then(function() {
        return delCarm(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('xinhu-finance/carm/export', {
        ...this.queryParams
      }, `carm_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
