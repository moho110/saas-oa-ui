<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="所属项目" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入所属项目"
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
          v-hasPermi="['xinhu-police:fininfos:add']"
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
          v-hasPermi="['xinhu-police:fininfos:edit']"
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
          v-hasPermi="['xinhu-police:fininfos:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['xinhu-police:fininfos:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="fininfosList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="对应主表fininfom.id" align="center" prop="mid" />
      <el-table-column label="排序号" align="center" prop="sort" />
      <el-table-column label="发生日期" align="center" prop="sdt" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.sdt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属项目" align="center" prop="name" />
      <el-table-column label="金额" align="center" prop="money" />
      <el-table-column label="发生地点" align="center" prop="didian" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['xinhu-police:fininfos:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['xinhu-police:fininfos:remove']"
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

    <!-- 添加或修改费用报销子对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="180px">
        <el-form-item label="对应主表fininfom.id" prop="mid">
          <el-input v-model="form.mid" placeholder="请输入对应主表fininfom.id" />
        </el-form-item>
        <el-form-item label="排序号" prop="sort">
          <el-input v-model="form.sort" placeholder="请输入排序号" />
        </el-form-item>
        <el-form-item label="发生日期" prop="sdt">
          <el-date-picker clearable size="small"
            v-model="form.sdt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择发生日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="所属项目" prop="name">
          <el-input v-model="form.name" placeholder="请输入所属项目" />
        </el-form-item>
        <el-form-item label="金额" prop="money">
          <el-input v-model="form.money" placeholder="请输入金额" />
        </el-form-item>
        <el-form-item label="说明" prop="sm">
          <el-input v-model="form.sm" placeholder="请输入说明" />
        </el-form-item>
        <el-form-item label="发生地点" prop="didian">
          <el-input v-model="form.didian" placeholder="请输入发生地点" />
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
import { listFininfos, getFininfos, delFininfos, addFininfos, updateFininfos } from "@/api/xinhu-police/fininfos";

export default {
  name: "Fininfos",
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
      // 费用报销子表格数据
      fininfosList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        mid: null,
        sort: null,
        sdt: null,
        name: null,
        money: null,
        sm: null,
        didian: null,
        comid: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        mid: [
          { required: true, message: "对应主表fininfom.id不能为空", trigger: "blur" }
        ],
        sort: [
          { required: true, message: "排序号不能为空", trigger: "blur" }
        ],
        sdt: [
          { required: true, message: "发生日期不能为空", trigger: "blur" }
        ],
        name: [
          { required: true, message: "所属项目不能为空", trigger: "blur" }
        ],
        money: [
          { required: true, message: "金额不能为空", trigger: "blur" }
        ],
        sm: [
          { required: true, message: "说明不能为空", trigger: "blur" }
        ],
        didian: [
          { required: true, message: "发生地点不能为空", trigger: "blur" }
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
    /** 查询费用报销子列表 */
    getList() {
      this.loading = true;
      listFininfos(this.queryParams).then(response => {
        this.fininfosList = response.rows;
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
        mid: null,
        sort: null,
        sdt: null,
        name: null,
        money: null,
        sm: null,
        didian: null,
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
      this.title = "添加费用报销子";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getFininfos(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改费用报销子";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateFininfos(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addFininfos(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除费用报销子编号为"' + ids + '"的数据项？').then(function() {
        return delFininfos(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('xinhu-police/fininfos/export', {
        ...this.queryParams
      }, `fininfos_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
