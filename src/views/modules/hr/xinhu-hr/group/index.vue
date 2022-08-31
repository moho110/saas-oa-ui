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
          v-hasPermi="['xinhu-hr:group:add']"
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
          v-hasPermi="['xinhu-hr:group:edit']"
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
          v-hasPermi="['xinhu-hr:group:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['xinhu-hr:group:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="groupList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="名称" align="center" prop="name" />
      <el-table-column label="创建人" align="center" prop="createname" />
      <el-table-column label="创建时间" align="center" prop="createdt" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createdt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="接收人" align="center" prop="recename" />
      <el-table-column label="url地址" align="center" prop="url" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['xinhu-hr:group:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['xinhu-hr:group:remove']"
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

    <!-- 添加或修改IM会话对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="180px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="对应上级" prop="pid">
          <el-input v-model="form.pid" placeholder="请输入对应上级" />
        </el-form-item>
        <el-form-item label="应用分类" prop="types">
          <el-input v-model="form.types" placeholder="请输入应用分类" />
        </el-form-item>
        <el-form-item label="类型" prop="ctype">
          <el-radio v-model="form.ctype" label="0">群</el-radio>
          <el-radio v-model="form.ctype" label="1">讨论组</el-radio>
          <el-radio v-model="form.ctype" label="2">应用</el-radio>
        </el-form-item>
        <el-form-item label="排序号" prop="sort">
          <el-input v-model="form.sort" placeholder="请输入排序号" />
        </el-form-item>
        <el-form-item label="创建人ID" prop="createid">
          <el-input v-model="form.createid" placeholder="请输入创建人ID" />
        </el-form-item>
        <el-form-item label="创建人" prop="createname">
          <el-input v-model="form.createname" placeholder="请输入创建人" />
        </el-form-item>
        <el-form-item label="创建时间" prop="createdt">
          <el-date-picker clearable size="small"
            v-model="form.createdt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择创建时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="头像" prop="face">
          <el-input v-model="form.face" placeholder="请输入头像" />
        </el-form-item>
        <el-form-item label="编号" prop="num">
          <el-input v-model="form.num" placeholder="请输入编号" />
        </el-form-item>
        <el-form-item label="接收人ID" prop="receid">
          <el-input v-model="form.receid" placeholder="请输入接收人ID" />
        </el-form-item>
        <el-form-item label="接收人" prop="recename">
          <el-input v-model="form.recename" placeholder="请输入接收人" />
        </el-form-item>
        <el-form-item label="url地址" prop="url">
          <el-input v-model="form.url" placeholder="请输入url地址" />
        </el-form-item>
        <el-form-item label="期限" prop="valid">
          <el-input v-model="form.valid" placeholder="请输入期限" />
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input v-model="form.content" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="对应字体图标" prop="iconfont">
          <el-input v-model="form.iconfont" placeholder="请输入对应字体图标" />
        </el-form-item>
        <el-form-item label="字体图标颜色" prop="iconcolor">
          <el-input v-model="form.iconcolor" placeholder="请输入字体图标颜色" />
        </el-form-item>
        <el-form-item label="应用类型" prop="yylx">
          <el-radio v-model="form.yylx" label="0">全部</el-radio>
          <el-radio v-model="form.yylx" label="1">pc</el-radio>
          <el-radio v-model="form.yylx" label="2">手机</el-radio>
        </el-form-item>
        <el-form-item label="应用上PC地址" prop="urlpc">
          <el-input v-model="form.urlpc" placeholder="请输入应用上PC地址" />
        </el-form-item>
        <el-form-item label="应用上手机端地址" prop="urlm">
          <el-input v-model="form.urlm" placeholder="请输入应用上手机端地址" />
        </el-form-item>
        <el-form-item label="对应部门id" prop="deptid">
          <el-input v-model="form.deptid" placeholder="请输入对应部门id" />
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
import { listGroup, getGroup, delGroup, addGroup, updateGroup } from "@/api/xinhu-hr/group";

export default {
  name: "Group",
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
      // IM会话表格数据
      groupList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: null,
        pid: null,
        types: null,
        type: null,
        sort: null,
        createid: null,
        createname: null,
        createdt: null,
        face: null,
        num: null,
        receid: null,
        recename: null,
        url: null,
        valid: null,
        content: null,
        iconfont: null,
        iconcolor: null,
        yylx: null,
        urlpc: null,
        urlm: null,
        deptid: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [
          { required: true, message: "名称不能为空", trigger: "blur" }
        ],
        pid: [
          { required: true, message: "对应上级不能为空", trigger: "blur" }
        ],
        types: [
          { required: true, message: "应用分类不能为空", trigger: "blur" }
        ],
        type: [
          { required: true, message: "类型@0|群,1|讨论组,2|应用不能为空", trigger: "change" }
        ],
        sort: [
          { required: true, message: "排序号不能为空", trigger: "blur" }
        ],
        createid: [
          { required: true, message: "创建人ID不能为空", trigger: "blur" }
        ],
        createname: [
          { required: true, message: "创建人不能为空", trigger: "blur" }
        ],
        createdt: [
          { required: true, message: "创建时间不能为空", trigger: "blur" }
        ],
        face: [
          { required: true, message: "头像不能为空", trigger: "blur" }
        ],
        num: [
          { required: true, message: "编号不能为空", trigger: "blur" }
        ],
        receid: [
          { required: true, message: "接收人ID不能为空", trigger: "blur" }
        ],
        recename: [
          { required: true, message: "接收人不能为空", trigger: "blur" }
        ],
        url: [
          { required: true, message: "url地址不能为空", trigger: "blur" }
        ],
        valid: [
          { required: true, message: "期限不能为空", trigger: "blur" }
        ],
        content: [
          { required: true, message: "内容不能为空", trigger: "blur" }
        ],
        iconfont: [
          { required: true, message: "对应字体图标不能为空", trigger: "blur" }
        ],
        iconcolor: [
          { required: true, message: "字体图标颜色不能为空", trigger: "blur" }
        ],
        yylx: [
          { required: true, message: "应用类型0全部,1pc,2手机不能为空", trigger: "blur" }
        ],
        urlpc: [
          { required: true, message: "应用上PC地址不能为空", trigger: "blur" }
        ],
        urlm: [
          { required: true, message: "应用上手机端地址不能为空", trigger: "blur" }
        ],
        deptid: [
          { required: true, message: "对应部门id不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询IM会话列表 */
    getList() {
      this.loading = true;
      listGroup(this.queryParams).then(response => {
        this.groupList = response.rows;
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
        pid: null,
        types: null,
        type: null,
        sort: null,
        createid: null,
        createname: null,
        createdt: null,
        face: null,
        num: null,
        receid: null,
        recename: null,
        url: null,
        valid: null,
        content: null,
        iconfont: null,
        iconcolor: null,
        yylx: null,
        urlpc: null,
        urlm: null,
        deptid: null
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
      this.title = "添加IM会话";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getGroup(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改IM会话";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateGroup(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addGroup(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除IM会话编号为"' + ids + '"的数据项？').then(function() {
        return delGroup(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('xinhu-hr/group/export', {
        ...this.queryParams
      }, `group_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
