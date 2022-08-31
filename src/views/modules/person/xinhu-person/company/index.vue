<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="公司名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入公司名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="OA名称" prop="oaname">
        <el-input
          v-model="queryParams.oaname"
          placeholder="请输入显示OA名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="电话" prop="tel">
        <el-input
          v-model="queryParams.tel"
          placeholder="请输入电话"
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
          v-hasPermi="['xinhu-person:company:add']"
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
          v-hasPermi="['xinhu-person:company:edit']"
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
          v-hasPermi="['xinhu-person:company:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['xinhu-person:company:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="companyList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="公司名称" align="center" prop="name" />
      <el-table-column label="显示OA名称" align="center" prop="oaname" />
      <el-table-column label="电话" align="center" prop="tel" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['xinhu-person:company:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['xinhu-person:company:remove']"
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

    <!-- 添加或修改公司单位对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="180px">
        <el-form-item label="对应logo" prop="logo">
          <el-input v-model="form.logo" placeholder="请输入对应logo" />
        </el-form-item>
        <el-form-item label="公司名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入公司名称" />
        </el-form-item>
        <el-form-item label="英文名" prop="nameen">
          <el-input v-model="form.nameen" placeholder="请输入英文名" />
        </el-form-item>
        <el-form-item label="显示OA名称" prop="oaname">
          <el-input v-model="form.oaname" placeholder="请输入显示OA名称" />
        </el-form-item>
        <el-form-item label="移动端显示名称" prop="oanemes">
          <el-input v-model="form.oanemes" placeholder="请输入移动端显示名称" />
        </el-form-item>
        <el-form-item label="电话" prop="tel">
          <el-input v-model="form.tel" placeholder="请输入电话" />
        </el-form-item>
        <el-form-item label="传真" prop="fax">
          <el-input v-model="form.fax" placeholder="请输入传真" />
        </el-form-item>
        <el-form-item label="对应上级" prop="pid">
          <el-input v-model="form.pid" placeholder="请输入对应上级" />
        </el-form-item>
        <el-form-item label="排序号" prop="sorts">
          <el-input-number v-model="form.sorts" :min="1" :max="999" label="排序号"></el-input-number>
        </el-form-item>
        <el-form-item label="对应负责人Id" prop="fuzeid">
          <el-input v-model="form.fuzeid" placeholder="请输入对应负责人Id" />
        </el-form-item>
        <el-form-item label="对应负责人" prop="fuzename">
          <el-input v-model="form.fuzename" placeholder="请输入对应负责人" />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入地址" />
        </el-form-item>
        <el-form-item label="所在城市" prop="city">
          <el-input v-model="form.city" placeholder="请输入所在城市" />
        </el-form-item>
        <el-form-item label="单位编号" prop="num">
          <el-input v-model="form.num" placeholder="请输入单位编号" />
        </el-form-item>
        <el-form-item label="对应单位id" prop="comid">
          <el-input v-model="form.comid" placeholder="请输入对应单位id" />
        </el-form-item>
        <el-form-item label="是否创建" prop="iscreate">
          <el-radio v-model="form.iscreate" label="1" value="1">已创建</el-radio>
          <el-radio v-model="form.iscreate" label="0" value="0">未创建</el-radio>
        </el-form-item>
        <el-form-item label="使用域名" prop="yuming">
          <el-input placeholder="请输入内容" v-model="form.yuming">
            <template slot="prepend">Http://</template>
  </el-input>
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
import { listCompany, getCompany, delCompany, addCompany, updateCompany } from "@/api/xinhu-person/company";

export default {
  name: "Company",
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
      // 公司单位表格数据
      companyList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        logo: null,
        name: null,
        nameen: null,
        oaname: null,
        oanemes: null,
        tel: null,
        fax: null,
        pid: null,
        sorts: null,
        fuzeid: null,
        fuzename: null,
        address: null,
        city: null,
        num: null,
        comid: null,
        iscreate: null,
        yuming: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        logo: [
          { required: true, message: "对应logo不能为空", trigger: "blur" },
          { min: 1, max: 200, message: '长度在 10 到 200 个字符', trigger: 'blur' }
        ],
        name: [
          { required: true, message: "公司名称不能为空", trigger: "blur" },
          { min: 1, max: 100, message: '长度在 10 到 100 个字符', trigger: 'blur' }
        ],
        nameen: [
          { required: true, message: "英文名不能为空", trigger: "blur" },
          { min: 1, max: 200, message: '长度在 10 到 200 个字符', trigger: 'blur' }
        ],
        oaname: [
          { required: true, message: "显示OA名称不能为空", trigger: "blur" },
          { min: 1, max: 200, message: '长度在 10 到 200 个字符', trigger: 'blur' }
        ],
        oanemes: [
          { required: true, message: "移动端显示名称不能为空", trigger: "blur" },
          { min: 1, max: 200, message: '长度在 10 到 200 个字符', trigger: 'blur' }
        ],
        tel: [
          { required: true, message: "电话不能为空", trigger: "blur" },
          { type: "string", min: 11, message: "电话不允许小于11位", trigger: "blur"},
          { pattern: /^\d+(\.\d+)?$/, message: "电话必须是数字", trigger: "blur"}
        ],
        fax: [
          { required: true, message: "传真不能为空", trigger: "blur" },
          { type: "string", min: 11, message: "传真不允许小于11位", trigger: "blur"},
          { pattern: /^\d+(\.\d+)?$/, message: "传真必须是数字", trigger: "blur"}
        ],
        pid: [
          { required: true, message: "对应上级不能为空", trigger: "blur" }
        ],
        sorts: [
          { required: true, message: "排序号不能为空", trigger: "blur" }
        ],
        fuzeid: [
          { required: true, message: "对应负责人Id不能为空", trigger: "blur" }
        ],
        fuzename: [
          { required: true, message: "对应负责人不能为空", trigger: "blur" },
          { min: 1, max: 30, message: '长度在 10 到 30 个字符', trigger: 'blur' }
        ],
        address: [
          { required: true, message: "地址不能为空", trigger: "blur" },
          { min: 1, max: 50, message: '长度在 30 到 50 个字符', trigger: 'blur' }
        ],
        city: [
          { required: true, message: "所在城市不能为空", trigger: "blur" },
          { min: 1, max: 30, message: '长度在 10 到 30 个字符', trigger: 'blur' }
        ],
        num: [
          { required: true, message: "单位编号不能为空", trigger: "blur" },
          { min: 1, max: 50, message: '长度在 10 到 50 个字符', trigger: 'blur' }
        ],
        comid: [
          { required: true, message: "对应单位id不能为空", trigger: "blur" }
        ],
        iscreate: [
          { required: true, message: "是否不能为空", trigger: "blur" }
        ],
        yuming: [
          { required: true, message: "使用域名不能为空", trigger: "blur" },
          { min: 1, max: 100, message: '长度在 30 到 100 个字符', trigger: 'blur' }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询公司单位列表 */
    getList() {
      this.loading = true;
      listCompany(this.queryParams).then(response => {
        this.companyList = response.rows;
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
        logo: null,
        name: null,
        nameen: null,
        oaname: null,
        oanemes: null,
        tel: null,
        fax: null,
        pid: null,
        sorts: null,
        fuzeid: null,
        fuzename: null,
        address: null,
        city: null,
        num: null,
        comid: null,
        iscreate: null,
        yuming: null
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
      this.title = "添加公司单位";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getCompany(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改公司单位";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateCompany(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addCompany(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除公司单位编号为"' + ids + '"的数据项？').then(function() {
        return delCompany(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('xinhu-person/company/export', {
        ...this.queryParams
      }, `company_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
