<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="名称" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="品牌" prop="brand">
        <el-input
          v-model="queryParams.brand"
          placeholder="请输入品牌"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="所属部门" prop="shuname">
        <el-input
          v-model="queryParams.shuname"
          placeholder="请输入所属部门"
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
          v-hasPermi="['xinhu-police:assetm:add']"
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
          v-hasPermi="['xinhu-police:assetm:edit']"
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
          v-hasPermi="['xinhu-police:assetm:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['xinhu-police:assetm:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="assetmList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="类别" align="center" prop="typeid" />
      <el-table-column label="名称" align="center" prop="title" />
      <el-table-column label="编号" align="center" prop="num" />
      <el-table-column label="品牌" align="center" prop="brand" />
      <el-table-column label="规格型号" align="center" prop="model" />
      <el-table-column label="来源" align="center" prop="laiyuan" />
      <el-table-column label="所属部门" align="center" prop="shuname" />
      <el-table-column label="日期" align="center" prop="dt" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.dt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="存放地点" align="center" prop="ckid" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['xinhu-police:assetm:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['xinhu-police:assetm:remove']"
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

    <!-- 添加或修改固定资产对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="180px">
        <el-form-item label="类别" prop="typeid">
          <el-input v-model="form.typeid" placeholder="请输入类别" />
        </el-form-item>
        <el-form-item label="名称" prop="title">
          <el-input v-model="form.title" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="编号" prop="num">
          <el-input v-model="form.num" placeholder="请输入编号" />
        </el-form-item>
        <el-form-item label="品牌" prop="brand">
          <el-input v-model="form.brand" placeholder="请输入品牌" />
        </el-form-item>
        <el-form-item label="规格型号" prop="model">
          <el-input v-model="form.model" placeholder="请输入规格型号" />
        </el-form-item>
        <el-form-item label="来源" prop="laiyuan">
          <el-input v-model="form.laiyuan" placeholder="请输入来源" />
        </el-form-item>
        <el-form-item label="所属部门" prop="shuname">
          <el-input v-model="form.shuname" placeholder="请输入所属部门" />
        </el-form-item>
        <el-form-item label="日期" prop="dt">
          <el-date-picker clearable size="small"
            v-model="form.dt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="存放地点" prop="ckid">
          <el-input v-model="form.ckid" placeholder="请输入存放地点" />
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-input v-model="form.state" placeholder="请输入状态" />
        </el-form-item>
        <el-form-item label="说明" prop="content">
          <el-input v-model="form.content" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="操作人" prop="optname">
          <el-input v-model="form.optname" placeholder="请输入操作人" />
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
        <el-form-item label="购进日期" prop="buydt">
          <el-date-picker clearable size="small"
            v-model="form.buydt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择购进日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input v-model="form.price" placeholder="请输入价格" />
        </el-form-item>
        <el-form-item label="操作人ID" prop="optid">
          <el-input v-model="form.optid" placeholder="请输入操作人ID" />
        </el-form-item>
        <el-form-item label="用户ID" prop="useid">
          <el-input v-model="form.useid" placeholder="请输入用户ID" />
        </el-form-item>
        <el-form-item label="使用人" prop="usename">
          <el-input v-model="form.usename" placeholder="请输入使用人" />
        </el-form-item>
        <el-form-item label="封面图片" prop="fengmian">
          <el-input v-model="form.fengmian" placeholder="请输入封面图片" />
        </el-form-item>
        <el-form-item label="对应单位id" prop="comid">
          <el-input v-model="form.comid" placeholder="请输入对应单位id" />
        </el-form-item>
        <el-form-item label="所在位置" prop="address">
          <el-input v-model="form.address" placeholder="请输入所在位置" />
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
import { listAssetm, getAssetm, delAssetm, addAssetm, updateAssetm } from "@/api/xinhu-police/assetm";

export default {
  name: "Assetm",
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
      // 固定资产表格数据
      assetmList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        typeid: null,
        title: null,
        num: null,
        brand: null,
        model: null,
        laiyuan: null,
        shuname: null,
        dt: null,
        ckid: null,
        state: null,
        content: null,
        optname: null,
        adddt: null,
        optdt: null,
        buydt: null,
        price: null,
        optid: null,
        status: null,
        useid: null,
        usename: null,
        fengmian: null,
        comid: null,
        address: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        typeid: [
          { required: true, message: "类别不能为空", trigger: "blur" }
        ],
        title: [
          { required: true, message: "名称不能为空", trigger: "blur" }
        ],
        num: [
          { required: true, message: "编号不能为空", trigger: "blur" }
        ],
        brand: [
          { required: true, message: "品牌不能为空", trigger: "blur" }
        ],
        model: [
          { required: true, message: "规格型号不能为空", trigger: "blur" }
        ],
        laiyuan: [
          { required: true, message: "来源不能为空", trigger: "blur" }
        ],
        shuname: [
          { required: true, message: "所属部门不能为空", trigger: "blur" }
        ],
        dt: [
          { required: true, message: "日期不能为空", trigger: "blur" }
        ],
        ckid: [
          { required: true, message: "存放地点不能为空", trigger: "blur" }
        ],
        state: [
          { required: true, message: "状态不能为空", trigger: "blur" }
        ],
        explain: [
          { required: true, message: "说明不能为空", trigger: "blur" }
        ],
        optname: [
          { required: true, message: "操作人不能为空", trigger: "blur" }
        ],
        adddt: [
          { required: true, message: "添加时间不能为空", trigger: "blur" }
        ],
        optdt: [
          { required: true, message: "操作时间不能为空", trigger: "blur" }
        ],
        buydt: [
          { required: true, message: "购进日期不能为空", trigger: "blur" }
        ],
        price: [
          { required: true, message: "价格不能为空", trigger: "blur" }
        ],
        optid: [
          { required: true, message: "操作人ID不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "状态不能为空", trigger: "blur" }
        ],
        useid: [
          { required: true, message: "用户ID不能为空", trigger: "blur" }
        ],
        usename: [
          { required: true, message: "使用人不能为空", trigger: "blur" }
        ],
        fengmian: [
          { required: true, message: "封面图片不能为空", trigger: "blur" }
        ],
        comid: [
          { required: true, message: "对应单位id不能为空", trigger: "blur" }
        ],
        address: [
          { required: true, message: "所在位置不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询固定资产列表 */
    getList() {
      this.loading = true;
      listAssetm(this.queryParams).then(response => {
        this.assetmList = response.rows;
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
        typeid: null,
        title: null,
        num: null,
        brand: null,
        model: null,
        laiyuan: null,
        shuname: null,
        dt: null,
        ckid: null,
        state: null,
        content: null,
        optname: null,
        adddt: null,
        optdt: null,
        buydt: null,
        price: null,
        optid: null,
        status: 0,
        useid: null,
        usename: null,
        fengmian: null,
        comid: null,
        address: null
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
      this.title = "添加固定资产";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getAssetm(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改固定资产";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateAssetm(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addAssetm(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除固定资产编号为"' + ids + '"的数据项？').then(function() {
        return delAssetm(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('xinhu-police/assetm/export', {
        ...this.queryParams
      }, `assetm_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
