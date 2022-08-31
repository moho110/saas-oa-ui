<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="仓库名称" prop="depotname">
        <el-input
          v-model="queryParams.depotname"
          placeholder="请输入仓库名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="仓库管理员" prop="cgname">
        <el-input
          v-model="queryParams.cgname"
          placeholder="请输入仓库管理员"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="仓库编号" prop="depotnum">
        <el-input
          v-model="queryParams.depotnum"
          placeholder="请输入仓库编号"
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
          v-hasPermi="['xinhu-police:godepot:add']"
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
          v-hasPermi="['xinhu-police:godepot:edit']"
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
          v-hasPermi="['xinhu-police:godepot:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['xinhu-police:godepot:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="godepotList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="仓库名称" align="center" prop="depotname" />
      <el-table-column label="仓库管理员" align="center" prop="cgname" />
      <el-table-column label="仓库管理员的ID" align="center" prop="cgid" />
      <el-table-column label="排序号" align="center" prop="sort" />
      <el-table-column label="仓库编号" align="center" prop="depotnum" />
      <el-table-column label="物品数" align="center" prop="wpshu" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['xinhu-police:godepot:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['xinhu-police:godepot:remove']"
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

    <!-- 添加或修改物品仓库对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="180px">
        <el-form-item label="仓库名称" prop="depotname">
          <el-input v-model="form.depotname" placeholder="请输入仓库名称" />
        </el-form-item>
        <el-form-item label="仓库地址" prop="depotaddress">
          <el-input v-model="form.depotaddress" placeholder="请输入仓库地址" />
        </el-form-item>
        <el-form-item label="仓库管理员" prop="cgname">
          <el-input v-model="form.cgname" placeholder="请输入仓库管理员" />
        </el-form-item>
        <el-form-item label="仓库管理员的ID" prop="cgid">
          <el-input v-model="form.cgid" placeholder="请输入仓库管理员的ID" />
        </el-form-item>
        <el-form-item label="说明" prop="depotexplain">
          <el-input v-model="form.depotexplain" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="排序号" prop="sort">
          <el-input v-model="form.sort" placeholder="请输入排序号" />
        </el-form-item>
        <el-form-item label="仓库编号" prop="depotnum">
          <el-input v-model="form.depotnum" placeholder="请输入仓库编号" />
        </el-form-item>
        <el-form-item label="物品数" prop="wpshu">
          <el-input v-model="form.wpshu" placeholder="请输入物品数" />
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
import { listGodepot, getGodepot, delGodepot, addGodepot, updateGodepot } from "@/api/xinhu-police/godepot";

export default {
  name: "Godepot",
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
      // 物品仓库表格数据
      godepotList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        depotname: null,
        depotaddress: null,
        cgname: null,
        cgid: null,
        depotexplain: null,
        sort: null,
        depotnum: null,
        wpshu: null,
        comid: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        depotname: [
          { required: true, message: "仓库名称不能为空", trigger: "blur" }
        ],
        depotaddress: [
          { required: true, message: "仓库地址不能为空", trigger: "blur" }
        ],
        cgname: [
          { required: true, message: "仓库管理员不能为空", trigger: "blur" }
        ],
        cgid: [
          { required: true, message: "仓库管理员的ID不能为空", trigger: "blur" }
        ],
        depotexplain: [
          { required: true, message: "说明不能为空", trigger: "blur" }
        ],
        sort: [
          { required: true, message: "排序号不能为空", trigger: "blur" }
        ],
        depotnum: [
          { required: true, message: "仓库编号不能为空", trigger: "blur" }
        ],
        wpshu: [
          { required: true, message: "物品数不能为空", trigger: "blur" }
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
    /** 查询物品仓库列表 */
    getList() {
      this.loading = true;
      listGodepot(this.queryParams).then(response => {
        this.godepotList = response.rows;
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
        depotname: null,
        depotaddress: null,
        cgname: null,
        cgid: null,
        depotexplain: null,
        sort: null,
        depotnum: null,
        wpshu: null,
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
      this.title = "添加物品仓库";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getGodepot(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改物品仓库";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateGodepot(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addGodepot(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除物品仓库编号为"' + ids + '"的数据项？').then(function() {
        return delGodepot(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('xinhu-police/godepot/export', {
        ...this.queryParams
      }, `godepot_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
