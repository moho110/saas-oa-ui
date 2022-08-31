<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="区域名称" prop="areaName">
        <el-input
          v-model="queryParams.areaName"
          placeholder="请输入区域名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="关键字" prop="areaKey">
        <el-input
          v-model="queryParams.areaKey"
          placeholder="请输入区域关键字"
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
          v-hasPermi="['xinhu-person:areas:add']"
        >新增</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="areasList"
      row-key="id"
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column label="父级ID" prop="parentId" />
      <el-table-column label="区域名称" align="center" prop="areaName" />
      <el-table-column label="是否显示" align="center" prop="isShow" />
      <el-table-column label="区域排序" align="center" prop="areaSort" />
      <el-table-column label="区域关键字" align="center" prop="areaKey" />
      <el-table-column label="创建时间" align="center" prop="createTime" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['xinhu-person:areas:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
            v-hasPermi="['xinhu-person:areas:add']"
          >新增</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['xinhu-person:areas:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改区域表对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="180px">
        <el-form-item label="父级ID" prop="parentId">
          <treeselect v-model="form.parentId" :options="areasOptions" :normalizer="normalizer" placeholder="请选择父级ID" />
        </el-form-item>
        <el-form-item label="区域名称" prop="areaName">
          <el-input v-model="form.areaName" placeholder="请输入区域名称" />
        </el-form-item>
        <el-form-item label="是否显示" prop="isShow">
          <el-radio v-model="form.isShow" label="1">显示</el-radio>
          <el-radio v-model="form.isShow" label="0">不显示</el-radio>
        </el-form-item>
        <el-form-item label="区域排序" prop="areaSort">
          <el-input-number v-model="form.areaSort" :min="1" :max="999" label="区域排序"></el-input-number>
        </el-form-item>
        <el-form-item label="区域关键字" prop="areaKey">
          <el-input v-model="form.areaKey" placeholder="请输入区域关键字" />
        </el-form-item>
        <el-form-item label="区域类型" prop="areaType">
          <el-input v-model="form.areaType" placeholder="请输入区域类型" />
        </el-form-item>
        <el-form-item label="数据标识" prop="dataFlag">
          <el-radio v-model="form.dataFlag" label="1">保留</el-radio>
          <el-radio v-model="form.dataFlag" label="0">删除</el-radio>
        </el-form-item>
        <el-form-item label="创建时间" prop="createTime">
          <el-date-picker clearable size="small"
            v-model="form.createTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择创建时间">
          </el-date-picker>
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
import { listAreas, getAreas, delAreas, addAreas, updateAreas } from "@/api/xinhu-person/areas";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "Areas",
  components: {
    Treeselect
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 区域表表格数据
      areasList: [],
      // 区域表树选项
      areasOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        parentId: null,
        areaName: null,
        isShow: null,
        areaSort: null,
        areaKey: null,
        areaType: null,
        dataFlag: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        parentId: [
          { required: true, message: "父级ID不能为空", trigger: "blur" }
        ],
        areaName: [
          { required: true, message: "区域名称不能为空", trigger: "blur" },
          { min: 4, max: 10, message: '长度在 4 到 10 个字符', trigger: 'blur' }
        ],
        isShow: [
          { required: true, message: "是否显示不能为空", trigger: "blur" }
        ],
        areaSort: [
          { required: true, message: "区域排序不能为空", trigger: "blur" }
        ],
        areaKey: [
          { required: true, message: "区域关键字不能为空", trigger: "blur" },
          { min: 4, max: 10, message: '长度在 4 到 10 个字符', trigger: 'blur' }
        ],
        areaType: [
          { required: true, message: "区域类型不能为空", trigger: "blur" },
          { min: 4, max: 10, message: '长度在 4 到 10 个字符', trigger: 'blur' }
        ],
        dataFlag: [
          { required: true, message: "数据标识不能为空", trigger: "blur" }
        ],
        createTime: [
          { required: true, message: "创建时间不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询区域表列表 */
    getList() {
      this.loading = true;
      listAreas(this.queryParams).then(response => {
        this.areasList = this.handleTree(response.data, "id", "parentId");
        this.loading = false;
      });
    },
    /** 转换区域表数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.areaName,
        children: node.children
      };
    },
	/** 查询区域表下拉树结构 */
    getTreeselect() {
      listAreas().then(response => {
        this.areasOptions = [];
        const data = { id: 0, areaName: '顶级节点', children: [] };
        data.children = this.handleTree(response.data, "id", "parentId");
        this.areasOptions.push(data);
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
        parentId: null,
        areaName: null,
        isShow: 0,

        areaSort: null,
        areaKey: null,
        areaType: 0,

        dataFlag: 0,

        createTime: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset();
      this.getTreeselect();
      if (row != null && row.id) {
        this.form.parentId = row.id;
      } else {
        this.form.parentId = 0;
      }
      this.open = true;
      this.title = "添加区域表";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getTreeselect();
      if (row != null) {
        this.form.parentId = row.id;
      }
      getAreas(row.id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改区域表";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateAreas(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addAreas(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除区域表编号为"' + row.id + '"的数据项？').then(function() {
        return delAreas(row.id);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    }
  }
};
</script>
