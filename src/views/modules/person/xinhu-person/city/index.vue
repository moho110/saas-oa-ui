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
          v-hasPermi="['xinhu-person:city:add']"
        >新增</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="cityList"
      row-key="id"
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column label="上级ＩＤ" prop="pid" />
      <el-table-column label="名称" align="center" prop="name" />
      <el-table-column label="类型0国家,1省,2市,3县" align="center" prop="types" />
      <el-table-column label="排序" align="center" prop="sorts" />
      <el-table-column label="拼音" align="center" prop="pinyin" />
      <el-table-column label="拼音简称" align="center" prop="pinyins" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['xinhu-person:city:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
            v-hasPermi="['xinhu-person:city:add']"
          >新增</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['xinhu-person:city:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改城市对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="上级ＩＤ" prop="pid">
          <treeselect v-model="form.pid" :options="cityOptions" :normalizer="normalizer" placeholder="请选择上级ＩＤ" />
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="类型" prop="types">
          <el-radio v-model="form.types" label="0" value="0">国家</el-radio>
          <el-radio v-model="form.types" label="1" value="1">省</el-radio>
          <el-radio v-model="form.types" label="2" value="2">市</el-radio>
          <el-radio v-model="form.types" label="3" value="3">县</el-radio>
        </el-form-item>
        <el-form-item label="排序" prop="sorts">
          <el-input-number v-model="form.sorts" :min="1" :max="99" label="排序"></el-input-number>
        </el-form-item>
        <el-form-item label="拼音" prop="pinyin">
          <el-input v-model="form.pinyin" placeholder="请输入拼音" />
        </el-form-item>
        <el-form-item label="拼音简称" prop="pinyins">
          <el-input v-model="form.pinyins" placeholder="请输入拼音简称" />
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
import { listCity, getCity, delCity, addCity, updateCity } from "@/api/xinhu-person/city";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "City",
  components: {
    Treeselect
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 城市表格数据
      cityList: [],
      // 城市树选项
      cityOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pid: null,
        name: null,
        types: null,
        sorts: null,
        pinyin: null,
        pinyins: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        pid: [
          { required: true, message: "上级ＩＤ不能为空", trigger: "blur" }
        ],
        name: [
          { required: true, message: "名称不能为空", trigger: "blur" },
          { min: 10, max: 50, message: '长度在 10 到 50 个字符', trigger: 'blur' }
        ],
        types: [
          { required: true, message: "类型0国家,1省,2市,3县不能为空", trigger: "change" }
        ],
        sorts: [
          { required: true, message: "排序不能为空", trigger: "blur" }
        ],
        pinyin: [
          { required: true, message: "拼音不能为空", trigger: "blur" },
          { min: 10, max: 50, message: '长度在 10 到 50 个字符', trigger: 'blur' }
        ],
        pinyins: [
          { required: true, message: "拼音简称不能为空", trigger: "blur" },
          { min: 10, max: 50, message: '长度在 10 到 50 个字符', trigger: 'blur' }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询城市列表 */
    getList() {
      this.loading = true;
      listCity(this.queryParams).then(response => {
        this.cityList = this.handleTree(response.data, "id", "pid");
        this.loading = false;
      });
    },
    /** 转换城市数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.name,
        children: node.children
      };
    },
	/** 查询城市下拉树结构 */
    getTreeselect() {
      listCity().then(response => {
        this.cityOptions = [];
        const data = { id: 0, name: '顶级节点', children: [] };
        data.children = this.handleTree(response.data, "id", "pid");
        this.cityOptions.push(data);
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
        pid: null,
        name: null,
        types: null,
        sorts: null,
        pinyin: null,
        pinyins: null
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
        this.form.pid = row.id;
      } else {
        this.form.pid = 0;
      }
      this.open = true;
      this.title = "添加城市";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getTreeselect();
      if (row != null) {
        this.form.pid = row.id;
      }
      getCity(row.id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改城市";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateCity(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addCity(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除城市编号为"' + row.id + '"的数据项？').then(function() {
        return delCity(row.id);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    }
  }
};
</script>
