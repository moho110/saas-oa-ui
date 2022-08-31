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
          v-hasPermi="['xinhu-hr:hrshebao:add']"
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
          v-hasPermi="['xinhu-hr:hrshebao:edit']"
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
          v-hasPermi="['xinhu-hr:hrshebao:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['xinhu-hr:hrshebao:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="hrshebaoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="名称" align="center" prop="title" />
      <el-table-column label="适用对象" align="center" prop="recename" />
      <el-table-column label="公积金个人" align="center" prop="gonggeren" />
      <el-table-column label="公积金单位" align="center" prop="gongunit" />
      <el-table-column label="开始月份" align="center" prop="startdt" />
      <el-table-column label="截止月份" align="center" prop="enddt" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['xinhu-hr:hrshebao:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['xinhu-hr:hrshebao:remove']"
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

    <!-- 添加或修改社保公积金对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="名称" prop="title">
          <el-input v-model="form.title" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="适用对象" prop="recename">
          <el-input v-model="form.recename" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="适用对象ID" prop="receid">
          <el-input v-model="form.receid" type="textarea" placeholder="请输入适用对象ID" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio v-model="form.status" label="1">良好</el-radio>
          <el-radio v-model="form.status" label="0">一般</el-radio>
        </el-form-item>
        <el-form-item label="公积金基数" prop="gongjishu">
          <el-input v-model="form.gongjishu" placeholder="请输入公积金基数" />
        </el-form-item>
        <el-form-item label="养老保险基数" prop="yljishu">
          <el-input v-model="form.yljishu" placeholder="请输入养老保险基数" />
        </el-form-item>
        <el-form-item label="养老个人比例(%)" prop="ylgeren">
          <el-input v-model="form.ylgeren" placeholder="请输入养老个人比例(%)" />
        </el-form-item>
        <el-form-item label="养老单位比例(%)" prop="ylunit">
          <el-input v-model="form.ylunit" placeholder="请输入养老单位比例(%)" />
        </el-form-item>
        <el-form-item label="失业报销基数" prop="syjishu">
          <el-input v-model="form.syjishu" placeholder="请输入失业报销基数" />
        </el-form-item>
        <el-form-item label="失业个人比例(%)" prop="sygeren">
          <el-input v-model="form.sygeren" placeholder="请输入失业个人比例(%)" />
        </el-form-item>
        <el-form-item label="失业单位比例(%)" prop="syunit">
          <el-input v-model="form.syunit" placeholder="请输入失业单位比例(%)" />
        </el-form-item>
        <el-form-item label="工伤报销基数" prop="gsjishu">
          <el-input v-model="form.gsjishu" placeholder="请输入工伤报销基数" />
        </el-form-item>
        <el-form-item label="工伤个人比例(%)" prop="gsgeren">
          <el-input v-model="form.gsgeren" placeholder="请输入工伤个人比例(%)" />
        </el-form-item>
        <el-form-item label="工伤单位比例(%)" prop="gsunit">
          <el-input v-model="form.gsunit" placeholder="请输入工伤单位比例(%)" />
        </el-form-item>
        <el-form-item label="生育保险基数" prop="syujishu">
          <el-input v-model="form.syujishu" placeholder="请输入生育保险基数" />
        </el-form-item>
        <el-form-item label="生育个人比例(%)" prop="syugeren">
          <el-input v-model="form.syugeren" placeholder="请输入生育个人比例(%)" />
        </el-form-item>
        <el-form-item label="生育单位比例(%)" prop="syuunit">
          <el-input v-model="form.syuunit" placeholder="请输入生育单位比例(%)" />
        </el-form-item>
        <el-form-item label="医疗报销基数" prop="yijishu">
          <el-input v-model="form.yijishu" placeholder="请输入医疗报销基数" />
        </el-form-item>
        <el-form-item label="医疗个人比例(%)" prop="yigeren">
          <el-input v-model="form.yigeren" placeholder="请输入医疗个人比例(%)" />
        </el-form-item>
        <el-form-item label="医疗单位比例(%)" prop="yiunit">
          <el-input v-model="form.yiunit" placeholder="请输入医疗单位比例(%)" />
        </el-form-item>
        <el-form-item label="大病个人" prop="dbgeren">
          <el-input v-model="form.dbgeren" placeholder="请输入大病个人" />
        </el-form-item>
        <el-form-item label="公积金个人比例(%)" prop="gjjgeren">
          <el-input v-model="form.gjjgeren" placeholder="请输入公积金个人比例(%)" />
        </el-form-item>
        <el-form-item label="公积金单位比例(%)" prop="gjjunit">
          <el-input v-model="form.gjjunit" placeholder="请输入公积金单位比例(%)" />
        </el-form-item>
        <el-form-item label="个人社保缴费" prop="shebaogeren">
          <el-input v-model="form.shebaogeren" placeholder="请输入个人社保缴费" />
        </el-form-item>
        <el-form-item label="单位社保缴费" prop="shebaounit">
          <el-input v-model="form.shebaounit" placeholder="请输入单位社保缴费" />
        </el-form-item>
        <el-form-item label="每月生成时间" prop="sctime">
          <el-input v-model="form.sctime" placeholder="请输入每月生成时间" />
        </el-form-item>
        <el-form-item label="操作时间" prop="optdt">
          <el-date-picker clearable size="small"
            v-model="form.optdt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择操作时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="公积金个人" prop="gonggeren">
          <el-input v-model="form.gonggeren" placeholder="请输入公积金个人" />
        </el-form-item>
        <el-form-item label="公积金单位" prop="gongunit">
          <el-input v-model="form.gongunit" placeholder="请输入公积金单位" />
        </el-form-item>
        <el-form-item label="说明" prop="explian">
          <el-input v-model="form.explian" type="textarea" placeholder="请输入说明" />
        </el-form-item>
        <el-form-item label="开始月份" prop="startdt">
          <el-input v-model="form.startdt" placeholder="请输入开始月份" />
        </el-form-item>
        <el-form-item label="截止月份" prop="enddt">
          <el-input v-model="form.enddt" placeholder="请输入截止月份" />
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
import { listHrshebao, getHrshebao, delHrshebao, addHrshebao, updateHrshebao } from "@/api/xinhu-hr/hrshebao";

export default {
  name: "Hrshebao",
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
      // 社保公积金表格数据
      hrshebaoList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        title: null,
        recename: null,
        receid: null,
        status: null,
        gongjishu: null,
        yljishu: null,
        ylgeren: null,
        ylunit: null,
        syjishu: null,
        sygeren: null,
        syunit: null,
        gsjishu: null,
        gsgeren: null,
        gsunit: null,
        syujishu: null,
        syugeren: null,
        syuunit: null,
        yijishu: null,
        yigeren: null,
        yiunit: null,
        dbgeren: null,
        gjjgeren: null,
        gjjunit: null,
        shebaogeren: null,
        shebaounit: null,
        sctime: null,
        optdt: null,
        gonggeren: null,
        gongunit: null,
        explian: null,
        startdt: null,
        enddt: null,
        comid: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        title: [
          { required: true, message: "名称不能为空", trigger: "blur" }
        ],
        recename: [
          { required: true, message: "适用对象不能为空", trigger: "blur" }
        ],
        receid: [
          { required: true, message: "适用对象ID不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "是否开启不能为空", trigger: "blur" }
        ],
        gongjishu: [
          { required: true, message: "公积金基数不能为空", trigger: "blur" }
        ],
        yljishu: [
          { required: true, message: "养老保险基数不能为空", trigger: "blur" }
        ],
        ylgeren: [
          { required: true, message: "养老个人比例(%)不能为空", trigger: "blur" }
        ],
        ylunit: [
          { required: true, message: "养老单位比例(%)不能为空", trigger: "blur" }
        ],
        syjishu: [
          { required: true, message: "失业报销基数不能为空", trigger: "blur" }
        ],
        sygeren: [
          { required: true, message: "失业个人比例(%)不能为空", trigger: "blur" }
        ],
        syunit: [
          { required: true, message: "失业单位比例(%)不能为空", trigger: "blur" }
        ],
        gsjishu: [
          { required: true, message: "工伤报销基数不能为空", trigger: "blur" }
        ],
        gsgeren: [
          { required: true, message: "工伤个人比例(%)不能为空", trigger: "blur" }
        ],
        gsunit: [
          { required: true, message: "工伤单位比例(%)不能为空", trigger: "blur" }
        ],
        syujishu: [
          { required: true, message: "生育保险基数不能为空", trigger: "blur" }
        ],
        syugeren: [
          { required: true, message: "生育个人比例(%)不能为空", trigger: "blur" }
        ],
        syuunit: [
          { required: true, message: "生育单位比例(%)不能为空", trigger: "blur" }
        ],
        yijishu: [
          { required: true, message: "医疗报销基数不能为空", trigger: "blur" }
        ],
        yigeren: [
          { required: true, message: "医疗个人比例(%)不能为空", trigger: "blur" }
        ],
        yiunit: [
          { required: true, message: "医疗单位比例(%)不能为空", trigger: "blur" }
        ],
        dbgeren: [
          { required: true, message: "大病个人不能为空", trigger: "blur" }
        ],
        gjjgeren: [
          { required: true, message: "公积金个人比例(%)不能为空", trigger: "blur" }
        ],
        gjjunit: [
          { required: true, message: "公积金单位比例(%)不能为空", trigger: "blur" }
        ],
        shebaogeren: [
          { required: true, message: "个人社保缴费不能为空", trigger: "blur" }
        ],
        shebaounit: [
          { required: true, message: "单位社保缴费不能为空", trigger: "blur" }
        ],
        sctime: [
          { required: true, message: "每月生成时间不能为空", trigger: "blur" }
        ],
        optdt: [
          { required: true, message: "$comment不能为空", trigger: "blur" }
        ],
        gonggeren: [
          { required: true, message: "公积金个人不能为空", trigger: "blur" }
        ],
        gongunit: [
          { required: true, message: "公积金单位不能为空", trigger: "blur" }
        ],
        explian: [
          { required: true, message: "说明不能为空", trigger: "blur" }
        ],
        startdt: [
          { required: true, message: "开始月份不能为空", trigger: "blur" }
        ],
        enddt: [
          { required: true, message: "截止月份不能为空", trigger: "blur" }
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
    /** 查询社保公积金列表 */
    getList() {
      this.loading = true;
      listHrshebao(this.queryParams).then(response => {
        this.hrshebaoList = response.rows;
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
        title: null,
        recename: null,
        receid: null,
        status: 0,
        gongjishu: null,
        yljishu: null,
        ylgeren: null,
        ylunit: null,
        syjishu: null,
        sygeren: null,
        syunit: null,
        gsjishu: null,
        gsgeren: null,
        gsunit: null,
        syujishu: null,
        syugeren: null,
        syuunit: null,
        yijishu: null,
        yigeren: null,
        yiunit: null,
        dbgeren: null,
        gjjgeren: null,
        gjjunit: null,
        shebaogeren: null,
        shebaounit: null,
        sctime: null,
        optdt: null,
        gonggeren: null,
        gongunit: null,
        explian: null,
        startdt: null,
        enddt: null,
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
      this.title = "添加社保公积金";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getHrshebao(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改社保公积金";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateHrshebao(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addHrshebao(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除社保公积金编号为"' + ids + '"的数据项？').then(function() {
        return delHrshebao(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('xinhu-hr/hrshebao/export', {
        ...this.queryParams
      }, `hrshebao_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
