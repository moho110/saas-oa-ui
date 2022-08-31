<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入名称"
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
      <el-form-item label="联系人" prop="linkname">
        <el-input
          v-model="queryParams.linkname"
          placeholder="请输入联系人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="单位名称" prop="unitname">
        <el-input
          v-model="queryParams.unitname"
          placeholder="请输入单位名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="创建人" prop="createname">
        <el-input
          v-model="queryParams.createname"
          placeholder="请输入创建人"
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
          v-hasPermi="['xinhu-finance:customer:add']"
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
          v-hasPermi="['xinhu-finance:customer:edit']"
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
          v-hasPermi="['xinhu-finance:customer:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['xinhu-finance:customer:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="customerList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="名称" align="center" prop="name" />
      <el-table-column label="操作人" align="center" prop="optname" />
      <el-table-column label="联系人" align="center" prop="linkname" />
      <el-table-column label="单位名称" align="center" prop="unitname" />
      <el-table-column label="创建人" align="center" prop="createname" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['xinhu-finance:customer:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['xinhu-finance:customer:remove']"
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

    <!-- 添加或修改客户对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="180px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="客户类型" prop="types">
          <el-input v-model="form.types" placeholder="请输入客户类型" />
        </el-form-item>
        <el-form-item label="所属人" prop="uid">
          <el-input v-model="form.uid" placeholder="请输入所属人" />
        </el-form-item>
        <el-form-item label="操作时间" prop="optdt">
          <el-date-picker clearable size="small"
            v-model="form.optdt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择操作时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="操作人" prop="optname">
          <el-input v-model="form.optname" placeholder="请输入操作人" />
        </el-form-item>
        <el-form-item label="联系人" prop="linkname">
          <el-input v-model="form.linkname" placeholder="请输入联系人" />
        </el-form-item>
        <el-form-item label="单位名称" prop="unitname">
          <el-input v-model="form.unitname" placeholder="请输入单位名称" />
        </el-form-item>
        <el-form-item label="来源" prop="laiyuan">
          <el-input v-model="form.laiyuan" placeholder="请输入来源" />
        </el-form-item>
        <el-form-item label="电话号码" prop="tel">
          <el-input v-model="form.tel" placeholder="请输入电话号码" />
        </el-form-item>
        <el-form-item label="移动电话" prop="mobile">
          <el-input v-model="form.mobile" placeholder="请输入移动电话" />
        </el-form-item>
        <el-form-item label="电子邮件" prop="email">
          <el-input v-model="form.email" placeholder="请输入电子邮件" />
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input v-model="form.content" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="联系地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入联系地址" />
        </el-form-item>
        <el-form-item label="线路" prop="routeline">
          <el-input v-model="form.routeline" placeholder="请输入线路" />
        </el-form-item>
        <el-form-item label="主页地址" prop="url">
          <el-input v-model="form.url" placeholder="请输入主页地址" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio v-model="form.status" label="1">已启用</el-radio>
          <el-radio v-model="form.status" label="0">已停用</el-radio>
        </el-form-item>
        <el-form-item label="添加时间" prop="adddt">
          <el-date-picker clearable size="small"
            v-model="form.adddt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择添加时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="创建人" prop="createname">
          <el-input v-model="form.createname" placeholder="请输入创建人" />
        </el-form-item>
        <el-form-item label="创建人ID" prop="createid">
          <el-input v-model="form.createid" placeholder="请输入创建人ID" />
        </el-form-item>
        <el-form-item label="共享给" prop="shate">
          <el-input v-model="form.shate" placeholder="请输入共享给" />
        </el-form-item>
        <el-form-item label="共享ID" prop="shateid">
          <el-input v-model="form.shateid" placeholder="请输入共享ID" />
        </el-form-item>
        <el-form-item label="是否供应商" prop="isgys">
          <el-radio v-model="form.isgys" label="1">是</el-radio>
          <el-radio v-model="form.isgys" label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="是否标*客户" prop="isstat">
          <el-radio v-model="form.isstat" label="1">是</el-radio>
          <el-radio v-model="form.isstat" label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="负责ID" prop="fzid">
          <el-input v-model="form.fzid" placeholder="请输入负责ID" />
        </el-form-item>
        <el-form-item label="客户负责人" prop="fzname">
          <el-input v-model="form.fzname" placeholder="请输入客户负责人" />
        </el-form-item>
        <el-form-item label="合同数" prop="htshu">
          <el-input v-model="form.htshu" placeholder="请输入合同数" />
        </el-form-item>
        <el-form-item label="销售总额" prop="moneyz">
          <el-input v-model="form.moneyz" placeholder="请输入销售总额" />
        </el-form-item>
        <el-form-item label="待收金额" prop="moneyd">
          <el-input v-model="form.moneyd" placeholder="请输入待收金额" />
        </el-form-item>
        <el-form-item label="所在省" prop="sheng">
          <el-input v-model="form.sheng" placeholder="请输入所在省" />
        </el-form-item>
        <el-form-item label="所在市" prop="shi">
          <el-input v-model="form.shi" placeholder="请输入所在市" />
        </el-form-item>
        <el-form-item label="是否放入公海" prop="isgh">
          <el-radio v-model="form.isgh" label="1">是</el-radio>
          <el-radio v-model="form.isgh" label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="最后跟进时间" prop="lastdt">
          <el-date-picker clearable size="small"
            v-model="form.lastdt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择最后跟进时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="纳税识别号" prop="shibieid">
          <el-input v-model="form.shibieid" placeholder="请输入纳税识别号" />
        </el-form-item>
        <el-form-item label="开户行" prop="openbank">
          <el-input v-model="form.openbank" placeholder="请输入开户行" />
        </el-form-item>
        <el-form-item label="开户帐号" prop="cardid">
          <el-input v-model="form.cardid" placeholder="请输入开户帐号" />
        </el-form-item>
        <el-form-item label="对应单位id" prop="comid">
          <el-input v-model="form.comid" placeholder="请输入对应单位id" />
        </el-form-item>
        <el-form-item label="地址经纬度" prop="addresslatlng">
          <el-input v-model="form.addresslatlng" placeholder="请输入地址经纬度" />
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
import { listCustomer, getCustomer, delCustomer, addCustomer, updateCustomer } from "@/api/xinhu-finance/customer";

export default {
  name: "Customer",
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
      // 客户表格数据
      customerList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: null,
        types: null,
        uid: null,
        optdt: null,
        optname: null,
        linkname: null,
        unitname: null,
        laiyuan: null,
        tel: null,
        mobile: null,
        email: null,
        content: null,
        address: null,
        routeline: null,
        url: null,
        status: null,
        adddt: null,
        createname: null,
        createid: null,
        shate: null,
        shateid: null,
        isgys: null,
        isstat: null,
        fzid: null,
        fzname: null,
        htshu: null,
        moneyz: null,
        moneyd: null,
        sheng: null,
        shi: null,
        isgh: null,
        lastdt: null,
        shibieid: null,
        openbank: null,
        cardid: null,
        comid: null,
        addresslatlng: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [
          { required: true, message: "名称不能为空", trigger: "blur" }
        ],
        types: [
          { required: true, message: "客户类型不能为空", trigger: "change" }
        ],
        uid: [
          { required: true, message: "所属人不能为空", trigger: "blur" }
        ],
        optdt: [
          { required: true, message: "操作时间不能为空", trigger: "blur" }
        ],
        optname: [
          { required: true, message: "操作人不能为空", trigger: "blur" }
        ],
        linkname: [
          { required: true, message: "联系人不能为空", trigger: "blur" }
        ],
        unitname: [
          { required: true, message: "单位名称不能为空", trigger: "blur" }
        ],
        laiyuan: [
          { required: true, message: "来源不能为空", trigger: "blur" }
        ],
        tel: [
          { required: true, message: "固定电话不能为空", trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "移动电话不能为空", trigger: "blur" }
        ],
        email: [
          { required: true, message: "电子邮件不能为空", trigger: "blur" }
        ],
        content: [
          { required: true, message: "内容不能为空", trigger: "blur" }
        ],
        address: [
          { required: true, message: "联系地址不能为空", trigger: "blur" }
        ],
        routeline: [
          { required: true, message: "线路不能为空", trigger: "blur" }
        ],
        url: [
          { required: true, message: "主页地址不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "启用停用不能为空", trigger: "blur" }
        ],
        adddt: [
          { required: true, message: "添加时间不能为空", trigger: "blur" }
        ],
        createname: [
          { required: true, message: "创建人不能为空", trigger: "blur" }
        ],
        createid: [
          { required: true, message: "创建ID不能为空", trigger: "blur" }
        ],
        shate: [
          { required: true, message: "共享给不能为空", trigger: "blur" }
        ],
        shateid: [
          { required: true, message: "共享ID不能为空", trigger: "blur" }
        ],
        isgys: [
          { required: true, message: "是否供应商不能为空", trigger: "blur" }
        ],
        isstat: [
          { required: true, message: "是否标*客户不能为空", trigger: "blur" }
        ],
        fzid: [
          { required: true, message: "负责ID不能为空", trigger: "blur" }
        ],
        fzname: [
          { required: true, message: "客户负责人不能为空", trigger: "blur" }
        ],
        htshu: [
          { required: true, message: "合同数不能为空", trigger: "blur" }
        ],
        moneyz: [
          { required: true, message: "销售总额不能为空", trigger: "blur" }
        ],
        moneyd: [
          { required: true, message: "待收金额不能为空", trigger: "blur" }
        ],
        sheng: [
          { required: true, message: "所在省不能为空", trigger: "blur" }
        ],
        shi: [
          { required: true, message: "所在市不能为空", trigger: "blur" }
        ],
        isgh: [
          { required: true, message: "是否放入公海不能为空", trigger: "blur" }
        ],
        lastdt: [
          { required: true, message: "最后跟进时间不能为空", trigger: "blur" }
        ],
        shibieid: [
          { required: true, message: "纳税识别号不能为空", trigger: "blur" }
        ],
        openbank: [
          { required: true, message: "开户行不能为空", trigger: "blur" }
        ],
        cardid: [
          { required: true, message: "开户帐号不能为空", trigger: "blur" }
        ],
        comid: [
          { required: true, message: "对应单位id不能为空", trigger: "blur" }
        ],
        addresslatlng: [
          { required: true, message: "地址经纬度不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询客户列表 */
    getList() {
      this.loading = true;
      listCustomer(this.queryParams).then(response => {
        this.customerList = response.rows;
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
        types: null,
        uid: null,
        optdt: null,
        optname: null,
        linkname: null,
        unitname: null,
        laiyuan: null,
        tel: null,
        mobile: null,
        email: null,
        content: null,
        address: null,
        routeline: null,
        url: null,
        status: 0,
        adddt: null,
        createname: null,
        createid: null,
        shate: null,
        shateid: null,
        isgys: null,
        isstat: null,
        fzid: null,
        fzname: null,
        htshu: null,
        moneyz: null,
        moneyd: null,
        sheng: null,
        shi: null,
        isgh: null,
        lastdt: null,
        shibieid: null,
        openbank: null,
        cardid: null,
        comid: null,
        addresslatlng: null
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
      this.title = "添加客户";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getCustomer(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改客户";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateCustomer(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addCustomer(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除客户编号为"' + ids + '"的数据项？').then(function() {
        return delCustomer(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('xinhu-finance/customer/export', {
        ...this.queryParams
      }, `customer_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
