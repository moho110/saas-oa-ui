<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="所属人" prop="uname">
        <el-input
          v-model="queryParams.uname"
          placeholder="请输入所属人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="证件名称" prop="mingc">
        <el-input
          v-model="queryParams.mingc"
          placeholder="请输入证件名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="证书编号" prop="numc">
        <el-input
          v-model="queryParams.numc"
          placeholder="请输入证书编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="操作人名称" prop="optname">
        <el-input
          v-model="queryParams.optname"
          placeholder="请输入操作人名称"
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
          v-hasPermi="['xinhu-resources:userzheng:add']"
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
          v-hasPermi="['xinhu-resources:userzheng:edit']"
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
          v-hasPermi="['xinhu-resources:userzheng:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['xinhu-resources:userzheng:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="userzhengList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="所属人" align="center" prop="uname" />
      <el-table-column label="证件名称" align="center" prop="mingc" />
      <el-table-column label="证书编号" align="center" prop="numc" />
      <el-table-column label="取得时间" align="center" prop="sdt" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.sdt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="到期时间" align="center" prop="edt" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.edt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作时间" align="center" prop="optdt" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.optdt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作人名称" align="center" prop="optname" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['xinhu-resources:userzheng:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['xinhu-resources:userzheng:remove']"
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

    <!-- 添加或修改说明对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="180px">
        <el-form-item label="对应单位id" prop="comid">
          <el-input v-model="form.comid" placeholder="请输入对应单位id" />
        </el-form-item>
        <el-form-item label="用户ID" prop="uid">
          <el-input v-model="form.uid" placeholder="请输入用户ID" />
        </el-form-item>
        <el-form-item label="所属人" prop="uname">
          <el-input v-model="form.uname" placeholder="请输入所属人" />
        </el-form-item>
        <el-form-item label="证件名称" prop="mingc">
          <el-input v-model="form.mingc" placeholder="请输入证件名称" />
        </el-form-item>
        <el-form-item label="证书编号" prop="numc">
          <el-input v-model="form.numc" placeholder="请输入证书编号" />
        </el-form-item>
        <el-form-item label="取得时间" prop="sdt">
          <el-date-picker clearable size="small"
            v-model="form.sdt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择取得时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="到期时间" prop="edt">
          <el-date-picker clearable size="small"
            v-model="form.edt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择到期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="相关图标" prop="fengmian">
          <el-input v-model="form.fengmian" placeholder="请输入相关图标" />
        </el-form-item>
        <el-form-item label="操作人ID" prop="optid">
          <el-input v-model="form.optid" placeholder="请输入操作人ID" />
        </el-form-item>
        <el-form-item label="操作时间" prop="optdt">
          <el-date-picker clearable size="small"
            v-model="form.optdt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择操作时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="操作人名称" prop="optname">
          <el-input v-model="form.optname" placeholder="请输入操作人名称" />
        </el-form-item>
        <el-form-item label="说明" prop="content">
          <el-input v-model="form.content" type="textarea" placeholder="请输入内容" />
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
import { listUserzheng, getUserzheng, delUserzheng, addUserzheng, updateUserzheng } from "@/api/xinhu-resources/userzheng";

export default {
  name: "Userzheng",
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
      // 说明表格数据
      userzhengList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        comid: null,
        uid: null,
        uname: null,
        mingc: null,
        numc: null,
        sdt: null,
        edt: null,
        fengmian: null,
        optid: null,
        optdt: null,
        optname: null,
        content: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        comid: [
          { required: true, message: "对应单位id不能为空", trigger: "blur" }
        ],
        uid: [
          { required: true, message: "用户ID不能为空", trigger: "blur" }
        ],
        uname: [
          { required: true, message: "所属人不能为空", trigger: "blur" }
        ],
        mingc: [
          { required: true, message: "证件名称不能为空", trigger: "blur" }
        ],
        numc: [
          { required: true, message: "证书编号不能为空", trigger: "blur" }
        ],
        sdt: [
          { required: true, message: "取得时间不能为空", trigger: "blur" }
        ],
        edt: [
          { required: true, message: "到期时间不能为空", trigger: "blur" }
        ],
        fengmian: [
          { required: true, message: "相关图标不能为空", trigger: "blur" }
        ],
        optid: [
          { required: true, message: "操作ID不能为空", trigger: "blur" }
        ],
        optdt: [
          { required: true, message: "操作时间不能为空", trigger: "blur" }
        ],
        optname: [
          { required: true, message: "操作人名称不能为空", trigger: "blur" }
        ],
        content: [
          { required: true, message: "说明不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询说明列表 */
    getList() {
      this.loading = true;
      listUserzheng(this.queryParams).then(response => {
        this.userzhengList = response.rows;
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
        comid: null,
        uid: null,
        uname: null,
        mingc: null,
        numc: null,
        sdt: null,
        edt: null,
        fengmian: null,
        optid: null,
        optdt: null,
        optname: null,
        content: null
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
      this.title = "添加说明";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getUserzheng(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改说明";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateUserzheng(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addUserzheng(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除说明编号为"' + ids + '"的数据项？').then(function() {
        return delUserzheng(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('xinhu-resources/userzheng/export', {
        ...this.queryParams
      }, `userzheng_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
