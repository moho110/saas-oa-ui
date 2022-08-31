<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="编号如销售号" prop="num">
        <el-input
          v-model="queryParams.num"
          placeholder="请输入编号如销售号"
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
      <el-form-item label="供应商名称" prop="custname">
        <el-input
          v-model="queryParams.custname"
          placeholder="请输入供应商名称"
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
          v-hasPermi="['xinhu-police:goodm:add']"
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
          v-hasPermi="['xinhu-police:goodm:edit']"
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
          v-hasPermi="['xinhu-police:goodm:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['xinhu-police:goodm:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="goodmList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="编号如销售号" align="center" prop="num" />
      <el-table-column label="操作时间" align="center" prop="optdt" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.optdt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作人" align="center" prop="optname" />
      <el-table-column label="申请日期" align="center" prop="applydt" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.applydt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="费用" align="center" prop="money" />
      <el-table-column label="供应商名称" align="center" prop="custname" />
      <el-table-column label="优惠价格" align="center" prop="discount" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['xinhu-police:goodm:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['xinhu-police:goodm:remove']"
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

    <!-- 添加或修改物品领用采购申请主对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="180px">
        <el-form-item label="用户ID" prop="uid">
          <el-input v-model="form.uid" placeholder="请输入用户ID" />
        </el-form-item>
        <el-form-item label="编号如销售号" prop="num">
          <el-input v-model="form.num" placeholder="请输入编号如销售号" />
        </el-form-item>
        <el-form-item label="操作时间" prop="optdt">
          <el-date-picker clearable size="small"
            v-model="form.optdt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择操作时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="操作人ID" prop="optid">
          <el-input v-model="form.optid" placeholder="请输入操作人ID" />
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
        <el-form-item label="说明" prop="content">
          <el-input v-model="form.content" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio v-model="form.status" label="1">良好</el-radio>
          <el-radio v-model="form.status" label="0">一般</el-radio>
        </el-form-item>
        <el-form-item label="是否提交" prop="isturn">
          <el-radio v-model="form.isturn" label="1">是</el-radio>
          <el-radio v-model="form.isturn" label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="领用类型" prop="types">
          <el-radio v-model="form.types" label="1">领用</el-radio>
          <el-radio v-model="form.types" label="0">采购申请</el-radio>
        </el-form-item>
        <el-form-item label="费用" prop="money">
          <el-input v-model="form.money" placeholder="请输入费用" />
        </el-form-item>
        <el-form-item label="供应商ID" prop="custid">
          <el-input v-model="form.custid" placeholder="请输入${comment}" />
        </el-form-item>
        <el-form-item label="供应商名称" prop="custname">
          <el-input v-model="form.custname" placeholder="请输入供应商名称" />
        </el-form-item>
        <el-form-item label="优惠价格" prop="discount">
          <el-input v-model="form.discount" placeholder="请输入优惠价格" />
        </el-form-item>
        <el-form-item label="类型" prop="state">
          <el-radio v-model="form.state" label="0">待出入库</el-radio>
          <el-radio v-model="form.state" label="1">已全部出入库</el-radio>
          <el-radio v-model="form.state" label="2">部分出入库</el-radio>
        </el-form-item>
        <el-form-item label="0待出入库,2部分出入库,1已全部出入库" prop="state">
          <el-input v-model="form.state" placeholder="请输入0待出入库,2部分出入库,1已全部出入库" />
        </el-form-item>
        <el-form-item label="关联客户合同custract.id" prop="custractid">
          <el-input v-model="form.custractid" placeholder="请输入关联客户合同custract.id" />
        </el-form-item>
        <el-form-item label="是否全部创建收款单" prop="ispay">
          <el-input v-model="form.ispay" placeholder="请输入是否全部创建收款单" />
        </el-form-item>
        <el-form-item label="对应单位id" prop="comid">
          <el-input v-model="form.comid" placeholder="请输入对应单位id" />
        </el-form-item>
        <el-form-item label="退货类型" prop="leixing">
          <el-input v-model="form.leixing" placeholder="请输入退货类型" />
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
import { listGoodm, getGoodm, delGoodm, addGoodm, updateGoodm } from "@/api/xinhu-police/goodm";

export default {
  name: "Goodm",
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
      // 物品领用采购申请主表格数据
      goodmList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        uid: null,
        num: null,
        optdt: null,
        optid: null,
        optname: null,
        applydt: null,
        content: null,
        status: null,
        isturn: null,
        type: null,
        money: null,
        custid: null,
        custname: null,
        discount: null,
        state: null,
        custractid: null,
        ispay: null,
        comid: null,
        leixing: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        uid: [
          { required: true, message: "用户ID不能为空", trigger: "blur" }
        ],
        num: [
          { required: true, message: "编号如销售号不能为空", trigger: "blur" }
        ],
        optdt: [
          { required: true, message: "操作时间不能为空", trigger: "blur" }
        ],
        optid: [
          { required: true, message: "操作人ID不能为空", trigger: "blur" }
        ],
        optname: [
          { required: true, message: "操作人不能为空", trigger: "blur" }
        ],
        applydt: [
          { required: true, message: "申请日期不能为空", trigger: "blur" }
        ],
        content: [
          { required: true, message: "说明不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "状态不能为空", trigger: "blur" }
        ],
        isturn: [
          { required: true, message: "是否提交不能为空", trigger: "blur" }
        ],
        type: [
          { required: true, message: "0领用,1采购申请不能为空", trigger: "change" }
        ],
        money: [
          { required: true, message: "费用不能为空", trigger: "blur" }
        ],
        custid: [
          { required: true, message: "供应商ID不能为空", trigger: "blur" }
        ],
        custname: [
          { required: true, message: "供应商名称不能为空", trigger: "blur" }
        ],
        discount: [
          { required: true, message: "优惠价格不能为空", trigger: "blur" }
        ],
        state: [
          { required: true, message: "0待出入库,2部分出入库,1已全部出入库不能为空", trigger: "blur" }
        ],
        custractid: [
          { required: true, message: "关联客户合同custract.id不能为空", trigger: "blur" }
        ],
        ispay: [
          { required: true, message: "是否全部创建收款单不能为空", trigger: "blur" }
        ],
        comid: [
          { required: true, message: "对应单位id不能为空", trigger: "blur" }
        ],
        leixing: [
          { required: true, message: "退货类型不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询物品领用采购申请主列表 */
    getList() {
      this.loading = true;
      listGoodm(this.queryParams).then(response => {
        this.goodmList = response.rows;
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
        num: null,
        optdt: null,
        optid: null,
        optname: null,
        applydt: null,
        content: null,
        status: 0,
        isturn: null,
        type: null,
        money: null,
        custid: null,
        custname: null,
        discount: null,
        state: null,
        custractid: null,
        ispay: null,
        comid: null,
        leixing: null
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
      this.title = "添加物品领用采购申请主";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getGoodm(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改物品领用采购申请主";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateGoodm(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addGoodm(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除物品领用采购申请主编号为"' + ids + '"的数据项？').then(function() {
        return delGoodm(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('xinhu-police/goodm/export', {
        ...this.queryParams
      }, `goodm_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
