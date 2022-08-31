<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="设备号" prop="num">
        <el-input
          v-model="queryParams.num"
          placeholder="请输入设备号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="设备名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入设备名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="公司名" prop="company">
        <el-input
          v-model="queryParams.company"
          placeholder="请输入公司名"
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
          v-hasPermi="['xinhu-hr:kqjsn:add']"
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
          v-hasPermi="['xinhu-hr:kqjsn:edit']"
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
          v-hasPermi="['xinhu-hr:kqjsn:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['xinhu-hr:kqjsn:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="kqjsnList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="设备号" align="center" prop="num" />
      <el-table-column label="设备名称" align="center" prop="name" />
      <el-table-column label="公司名" align="center" prop="company" />
      <el-table-column label="排序号" align="center" prop="sort" />
      <el-table-column label="操作时间" align="center" prop="optdt" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.optdt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="人员数" align="center" prop="usershu" />
      <el-table-column label="指纹数" align="center" prop="fingerprintshu" />
      <el-table-column label="头像数量" align="center" prop="headpicshu" />
      <el-table-column label="打卡数" align="center" prop="clockinshu" />
      <el-table-column label="现场照片数" align="center" prop="picshu" />
      <el-table-column label="系统版本" align="center" prop="romver" />
      <el-table-column label="应用版本" align="center" prop="appver" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['xinhu-hr:kqjsn:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['xinhu-hr:kqjsn:remove']"
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

    <!-- 添加或修改考勤机设备对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="180px">
        <el-form-item label="设备号" prop="num">
          <el-input v-model="form.num" placeholder="请输入设备号" />
        </el-form-item>
        <el-form-item label="设备名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入设备名称" />
        </el-form-item>
        <el-form-item label="公司名" prop="company">
          <el-input v-model="form.company" placeholder="请输入公司名" />
        </el-form-item>
        <el-form-item label="排序号" prop="sort">
          <el-input v-model="form.sort" placeholder="请输入排序号" />
        </el-form-item>
        <el-form-item label="操作时间" prop="optdt">
          <el-date-picker clearable size="small"
            v-model="form.optdt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择操作时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio v-model="form.status" label="1">良好</el-radio>
          <el-radio v-model="form.status" label="0">一般</el-radio>
        </el-form-item>
        <el-form-item label="部门ID聚合" prop="deptids">
          <el-input v-model="form.deptids" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="人员ID聚合" prop="userids">
          <el-input v-model="form.userids" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="最后请求时间" prop="lastdt">
          <el-date-picker clearable size="small"
            v-model="form.lastdt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择最后请求时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="sd卡剩余空间" prop="space">
          <el-input v-model="form.space" placeholder="请输入sd卡剩余空间" />
        </el-form-item>
        <el-form-item label="剩余内存" prop="memory">
          <el-input v-model="form.memory" placeholder="请输入剩余内存" />
        </el-form-item>
        <el-form-item label="人员数" prop="usershu">
          <el-input v-model="form.usershu" placeholder="请输入人员数" />
        </el-form-item>
        <el-form-item label="指纹数" prop="fingerprintshu">
          <el-input v-model="form.fingerprintshu" placeholder="请输入指纹数" />
        </el-form-item>
        <el-form-item label="头像数量" prop="headpicshu">
          <el-input v-model="form.headpicshu" placeholder="请输入头像数量" />
        </el-form-item>
        <el-form-item label="打卡数" prop="clockinshu">
          <el-input v-model="form.clockinshu" placeholder="请输入打卡数" />
        </el-form-item>
        <el-form-item label="现场照片数" prop="picshu">
          <el-input v-model="form.picshu" placeholder="请输入现场照片数" />
        </el-form-item>
        <el-form-item label="系统版本" prop="romver">
          <el-input v-model="form.romver" placeholder="请输入系统版本" />
        </el-form-item>
        <el-form-item label="应用版本" prop="appver">
          <el-input v-model="form.appver" placeholder="请输入应用版本" />
        </el-form-item>
        <el-form-item label="设备型号" prop="model">
          <el-input v-model="form.model" placeholder="请输入设备型号" />
        </el-form-item>
        <el-form-item label="品牌0群英,1中控" prop="pinpai">
          <el-input v-model="form.pinpai" placeholder="请输入品牌0群英,1中控" />
        </el-form-item>
        <el-form-item label="分配的ip" prop="snip">
          <el-input v-model="form.snip" placeholder="请输入分配的ip" />
        </el-form-item>
        <el-form-item label="分配端口号" prop="snport">
          <el-input v-model="form.snport" placeholder="请输入分配端口号" />
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
import { listKqjsn, getKqjsn, delKqjsn, addKqjsn, updateKqjsn } from "@/api/xinhu-hr/kqjsn";

export default {
  name: "Kqjsn",
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
      // 考勤机设备表格数据
      kqjsnList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        num: null,
        name: null,
        company: null,
        sort: null,
        optdt: null,
        status: null,
        deptids: null,
        userids: null,
        lastdt: null,
        space: null,
        memory: null,
        usershu: null,
        fingerprintshu: null,
        headpicshu: null,
        clockinshu: null,
        picshu: null,
        romver: null,
        appver: null,
        model: null,
        pinpai: null,
        snip: null,
        snport: null,
        comid: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        num: [
          { required: true, message: "设备号不能为空", trigger: "blur" }
        ],
        name: [
          { required: true, message: "设备名称不能为空", trigger: "blur" }
        ],
        company: [
          { required: true, message: "公司名不能为空", trigger: "blur" }
        ],
        sort: [
          { required: true, message: "排序号不能为空", trigger: "blur" }
        ],
        optdt: [
          { required: true, message: "操作时间不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "状态不能为空", trigger: "blur" }
        ],
        deptids: [
          { required: true, message: "部门ID聚合不能为空", trigger: "blur" }
        ],
        userids: [
          { required: true, message: "人员ID聚合不能为空", trigger: "blur" }
        ],
        lastdt: [
          { required: true, message: "最后请求时间不能为空", trigger: "blur" }
        ],
        space: [
          { required: true, message: "sd卡剩余空间不能为空", trigger: "blur" }
        ],
        memory: [
          { required: true, message: "剩余内存不能为空", trigger: "blur" }
        ],
        usershu: [
          { required: true, message: "人员数不能为空", trigger: "blur" }
        ],
        fingerprintshu: [
          { required: true, message: "指纹数不能为空", trigger: "blur" }
        ],
        headpicshu: [
          { required: true, message: "头像数量不能为空", trigger: "blur" }
        ],
        clockinshu: [
          { required: true, message: "打卡数不能为空", trigger: "blur" }
        ],
        picshu: [
          { required: true, message: "现场照片数不能为空", trigger: "blur" }
        ],
        romver: [
          { required: true, message: "系统版本不能为空", trigger: "blur" }
        ],
        appver: [
          { required: true, message: "应用版本不能为空", trigger: "blur" }
        ],
        model: [
          { required: true, message: "设备型号不能为空", trigger: "blur" }
        ],
        pinpai: [
          { required: true, message: "品牌0群英,1中控不能为空", trigger: "blur" }
        ],
        snip: [
          { required: true, message: "分配的ip不能为空", trigger: "blur" }
        ],
        snport: [
          { required: true, message: "分配端口号不能为空", trigger: "blur" }
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
    /** 查询考勤机设备列表 */
    getList() {
      this.loading = true;
      listKqjsn(this.queryParams).then(response => {
        this.kqjsnList = response.rows;
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
        num: null,
        name: null,
        company: null,
        sort: null,
        optdt: null,
        status: 0,
        deptids: null,
        userids: null,
        lastdt: null,
        space: null,
        memory: null,
        usershu: null,
        fingerprintshu: null,
        headpicshu: null,
        clockinshu: null,
        picshu: null,
        romver: null,
        appver: null,
        model: null,
        pinpai: null,
        snip: null,
        snport: null,
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
      this.title = "添加考勤机设备";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getKqjsn(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改考勤机设备";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateKqjsn(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addKqjsn(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除考勤机设备编号为"' + ids + '"的数据项？').then(function() {
        return delKqjsn(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('xinhu-hr/kqjsn/export', {
        ...this.queryParams
      }, `kqjsn_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
