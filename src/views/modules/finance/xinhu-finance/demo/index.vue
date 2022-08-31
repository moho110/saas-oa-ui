<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="操作人" prop="optname">
        <el-input
          v-model="queryParams.optname"
          placeholder="请输入操作人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="客户" prop="custname">
        <el-input
          v-model="queryParams.custname"
          placeholder="请输入客户"
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
          v-hasPermi="['xinhu-finance:demo:add']"
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
          v-hasPermi="['xinhu-finance:demo:edit']"
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
          v-hasPermi="['xinhu-finance:demo:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['xinhu-finance:demo:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="demoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="申请日期" align="center" prop="applydt" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.applydt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作时间" align="center" prop="optdt" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.optdt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作人" align="center" prop="optname" />
      <el-table-column label="客户" align="center" prop="custname" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['xinhu-finance:demo:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['xinhu-finance:demo:remove']"
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

    <!-- 添加或修改演示测试模块对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="180px">
        <el-form-item label="省" prop="sheng">
          <el-input v-model="form.sheng" placeholder="请输入省" />
        </el-form-item>
        <el-form-item label="市" prop="shi">
          <el-input v-model="form.shi" placeholder="请输入市" />
        </el-form-item>
        <el-form-item label="县(区)" prop="xian">
          <el-input v-model="form.xian" placeholder="请输入县(区)" />
        </el-form-item>
        <el-form-item label="申请日期" prop="applydt">
          <el-date-picker clearable size="small"
            v-model="form.applydt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择申请日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="用户ID" prop="uid">
          <el-input v-model="form.uid" placeholder="请输入用户ID" />
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
        <el-form-item label="说明" prop="content">
          <el-input v-model="form.content" type="textarea" placeholder="请输入说明" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio v-model="form.status" label="1">良好</el-radio>
          <el-radio v-model="form.status" label="0">一般</el-radio>
        </el-form-item>
        <el-form-item label="是否提交" prop="isturn">
          <el-radio v-model="form.isturn" label="1">已提交</el-radio>
          <el-radio v-model="form.isturn" label="0">未提交</el-radio>
        </el-form-item>
        <el-form-item label="弹出下来单选" prop="tanxuan">
          <el-input v-model="form.tanxuan" placeholder="请输入弹出下来单选" />
        </el-form-item>
        <el-form-item label="弹框下拉多选" prop="tanxuancheck">
          <el-input v-model="form.tanxuancheck" placeholder="请输入弹框下拉多选" />
        </el-form-item>
        <el-form-item label="文件上传1" prop="upfile1">
          <el-input v-model="form.upfile1" placeholder="请输入文件上传1" />
        </el-form-item>
        <el-form-item label="文件上传2" prop="upfile2">
          <el-input v-model="form.upfile2" placeholder="请输入文件上传2" />
        </el-form-item>
        <el-form-item label="测试字段" prop="testfirs">
          <el-input v-model="form.testfirs" placeholder="请输入测试字段" />
        </el-form-item>
        <el-form-item label="客户" prop="custname">
          <el-input v-model="form.custname" placeholder="请输入客户" />
        </el-form-item>
        <el-form-item label="客户id" prop="custid">
          <el-input v-model="form.custid" placeholder="请输入客户id" />
        </el-form-item>
        <el-form-item label="金额" prop="money">
          <el-input v-model="form.money" placeholder="请输入金额" />
        </el-form-item>
        <el-form-item label="单选弹出选择id" prop="tanxuanid">
          <el-input v-model="form.tanxuanid" placeholder="请输入单选弹出选择id" />
        </el-form-item>
        <el-form-item label="封面图片" prop="fengmian">
          <el-input v-model="form.fengmian" placeholder="请输入封面图片" />
        </el-form-item>
        <el-form-item label="编号" prop="num">
          <el-input v-model="form.num" placeholder="请输入编号" />
        </el-form-item>
        <el-form-item label="主ID" prop="mid">
          <el-input v-model="form.mid" placeholder="请输入主ID" />
        </el-form-item>
        <el-form-item label="对应单位id" prop="comid">
          <el-input v-model="form.comid" placeholder="请输入对应单位id" />
        </el-form-item>
        <el-form-item label="排序号" prop="sort">
          <el-input v-model="form.sort" placeholder="请输入排序号" />
        </el-form-item>
        <el-form-item label="0多行子表1,1多行子表2" prop="sslx">
          <el-input v-model="form.sslx" placeholder="请输入0多行子表1,1多行子表2" />
        </el-form-item>
        <el-form-item label="html编辑器" prop="htmlcont">
          <el-input v-model="form.htmlcont" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="选择人员" prop="xuanren">
          <el-input v-model="form.xuanren" placeholder="请输入选择人员" />
        </el-form-item>
        <el-form-item label="选择人员的ID" prop="xuanrenid">
          <el-input v-model="form.xuanrenid" placeholder="请输入选择人员的ID" />
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
import { listDemo, getDemo, delDemo, addDemo, updateDemo } from "@/api/xinhu-finance/demo";

export default {
  name: "Demo",
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
      // 演示测试模块表格数据
      demoList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        sheng: null,
        shi: null,
        xian: null,
        applydt: null,
        uid: null,
        optdt: null,
        optid: null,
        optname: null,
        content: null,
        status: null,
        isturn: null,
        tanxuan: null,
        tanxuancheck: null,
        upfile1: null,
        upfile2: null,
        testfirs: null,
        custname: null,
        custid: null,
        money: null,
        tanxuanid: null,
        fengmian: null,
        num: null,
        mid: null,
        comid: null,
        sort: null,
        sslx: null,
        htmlcont: null,
        xuanren: null,
        xuanrenid: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        sheng: [
          { required: true, message: "省不能为空", trigger: "blur" }
        ],
        shi: [
          { required: true, message: "市不能为空", trigger: "blur" }
        ],
        xian: [
          { required: true, message: "县(区)不能为空", trigger: "blur" }
        ],
        applydt: [
          { required: true, message: "申请日期不能为空", trigger: "blur" }
        ],
        uid: [
          { required: true, message: "用户ID不能为空", trigger: "blur" }
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
        explain: [
          { required: true, message: "说明不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "状态不能为空", trigger: "blur" }
        ],
        isturn: [
          { required: true, message: "是否提交不能为空", trigger: "blur" }
        ],
        tanxuan: [
          { required: true, message: "弹出下来单选不能为空", trigger: "blur" }
        ],
        tanxuancheck: [
          { required: true, message: "弹框下拉多选不能为空", trigger: "blur" }
        ],
        upfile1: [
          { required: true, message: "文件上传1不能为空", trigger: "blur" }
        ],
        upfile2: [
          { required: true, message: "文件上传2不能为空", trigger: "blur" }
        ],
        testfirs: [
          { required: true, message: "测试字段不能为空", trigger: "blur" }
        ],
        custname: [
          { required: true, message: "客户不能为空", trigger: "blur" }
        ],
        custid: [
          { required: true, message: "客户id不能为空", trigger: "blur" }
        ],
        money: [
          { required: true, message: "金额不能为空", trigger: "blur" }
        ],
        tanxuanid: [
          { required: true, message: "单选弹出选择id不能为空", trigger: "blur" }
        ],
        fengmian: [
          { required: true, message: "封面图片不能为空", trigger: "blur" }
        ],
        num: [
          { required: true, message: "编号不能为空", trigger: "blur" }
        ],
        mid: [
          { required: true, message: "主ID不能为空", trigger: "blur" }
        ],
        comid: [
          { required: true, message: "对应单位id不能为空", trigger: "blur" }
        ],
        sort: [
          { required: true, message: "排序号不能为空", trigger: "blur" }
        ],
        sslx: [
          { required: true, message: "0多行子表1,1多行子表2不能为空", trigger: "blur" }
        ],
        htmlcont: [
          { required: true, message: "html编辑器不能为空", trigger: "blur" }
        ],
        xuanren: [
          { required: true, message: "选择人员不能为空", trigger: "blur" }
        ],
        xuanrenid: [
          { required: true, message: "选择人员的ID不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询演示测试模块列表 */
    getList() {
      this.loading = true;
      listDemo(this.queryParams).then(response => {
        this.demoList = response.rows;
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
        sheng: null,
        shi: null,
        xian: null,
        applydt: null,
        uid: null,
        optdt: null,
        optid: null,
        optname: null,
        content: null,
        status: 0,
        isturn: null,
        tanxuan: null,
        tanxuancheck: null,
        upfile1: null,
        upfile2: null,
        testfirs: null,
        custname: null,
        custid: null,
        money: null,
        tanxuanid: null,
        fengmian: null,
        num: null,
        mid: null,
        comid: null,
        sort: null,
        sslx: null,
        htmlcont: null,
        xuanren: null,
        xuanrenid: null
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
      this.title = "添加演示测试模块";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getDemo(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改演示测试模块";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateDemo(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addDemo(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除演示测试模块编号为"' + ids + '"的数据项？').then(function() {
        return delDemo(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('xinhu-finance/demo/export', {
        ...this.queryParams
      }, `demo_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
