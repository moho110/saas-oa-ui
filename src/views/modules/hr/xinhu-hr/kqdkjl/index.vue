<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="定位地址" prop="address">
        <el-input
          v-model="queryParams.address"
          placeholder="请输入定位地址"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="纬度" prop="lat">
        <el-input
          v-model="queryParams.lat"
          placeholder="请输入纬度"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="经度" prop="lng">
        <el-input
          v-model="queryParams.lng"
          placeholder="请输入经度"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="精确范围" prop="accuracy">
        <el-input
          v-model="queryParams.accuracy"
          placeholder="请输入精确范围"
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
          v-hasPermi="['xinhu-hr:kqdkjl:add']"
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
          v-hasPermi="['xinhu-hr:kqdkjl:edit']"
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
          v-hasPermi="['xinhu-hr:kqdkjl:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['xinhu-hr:kqdkjl:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="kqdkjlList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="打卡时间" align="center" prop="dkdt" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.dkdt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作时间" align="center" prop="optdt" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.optdt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="纬度" align="center" prop="lat" />
      <el-table-column label="经度" align="center" prop="lng" />
      <el-table-column label="精确范围" align="center" prop="accuracy" />
      <el-table-column label="IP地址" align="center" prop="ip" />
      <el-table-column label="mac地址" align="center" prop="mac" />
      <el-table-column label="相关图片" align="center" prop="imgpath" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['xinhu-hr:kqdkjl:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['xinhu-hr:kqdkjl:remove']"
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

    <!-- 添加或修改打卡记录对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户ID" prop="uid">
          <el-input v-model="form.uid" placeholder="请输入用户ID" />
        </el-form-item>
        <el-form-item label="打卡时间" prop="dkdt">
          <el-date-picker clearable size="small"
            v-model="form.dkdt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择打卡时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="操作时间" prop="optdt">
          <el-date-picker clearable size="small"
            v-model="form.optdt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择操作时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="定位地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入定位地址" />
        </el-form-item>
        <el-form-item label="纬度" prop="lat">
          <el-input v-model="form.lat" placeholder="请输入纬度" />
        </el-form-item>
        <el-form-item label="经度" prop="lng">
          <el-input v-model="form.lng" placeholder="请输入经度" />
        </el-form-item>
        <el-form-item label="精确范围" prop="accuracy">
          <el-input v-model="form.accuracy" placeholder="请输入精确范围" />
        </el-form-item>
        <el-form-item label="IP地址" prop="ip">
          <el-input v-model="form.ip" placeholder="请输入IP地址" />
        </el-form-item>
        <el-form-item label="mac地址" prop="mac">
          <el-input v-model="form.mac" placeholder="请输入mac地址" />
        </el-form-item>
        <el-form-item label="说明" prop="content">
          <el-input v-model="form.content" placeholder="请输入说明" />
        </el-form-item>
        <el-form-item label="相关图片" prop="imgpath">
          <el-input v-model="form.imgpath" placeholder="请输入相关图片" />
        </el-form-item>
        <el-form-item label="考勤机设备id" prop="snid">
          <el-input v-model="form.snid" placeholder="请输入考勤机设备id" />
        </el-form-item>
        <el-form-item label="考勤机设备id" prop="snid">
          <el-input v-model="form.snid" placeholder="请输入考勤机设备id" />
        </el-form-item>
        <el-form-item label="考勤机打卡方式" prop="sntype">
          <el-radio v-model="form.sntype" label="0">密码</el-radio>
          <el-radio v-model="form.sntype" label="1">指纹</el-radio>
          <el-radio v-model="form.sntype" label="2">刷卡</el-radio>
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
import { listKqdkjl, getKqdkjl, delKqdkjl, addKqdkjl, updateKqdkjl } from "@/api/xinhu-hr/kqdkjl";

export default {
  name: "Kqdkjl",
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
      // 打卡记录表格数据
      kqdkjlList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        uid: null,
        dkdt: null,
        optdt: null,
        type: null,
        address: null,
        lat: null,
        lng: null,
        accuracy: null,
        ip: null,
        mac: null,
        content: null,
        imgpath: null,
        snid: null,
        sntype: null,
        comid: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        uid: [
          { required: true, message: "用户ID不能为空", trigger: "blur" }
        ],
        dkdt: [
          { required: true, message: "打卡时间不能为空", trigger: "blur" }
        ],
        optdt: [
          { required: true, message: "操作时间不能为空", trigger: "blur" }
        ],
        type: [
          { required: true, message: "0在线打卡,1考勤机,2手机定位,3手动添加,4异常添加,5数据导入,6接口导入不能为空", trigger: "change" }
        ],
        address: [
          { required: true, message: "定位地址不能为空", trigger: "blur" }
        ],
        lat: [
          { required: true, message: "纬度不能为空", trigger: "blur" }
        ],
        lng: [
          { required: true, message: "经度不能为空", trigger: "blur" }
        ],
        accuracy: [
          { required: true, message: "精确范围不能为空", trigger: "blur" }
        ],
        ip: [
          { required: true, message: "IP地址不能为空", trigger: "blur" }
        ],
        mac: [
          { required: true, message: "MAC地址不能为空", trigger: "blur" }
        ],
        content: [
          { required: true, message: "说明不能为空", trigger: "blur" }
        ],
        imgpath: [
          { required: true, message: "相关图片不能为空", trigger: "blur" }
        ],
        snid: [
          { required: true, message: "考勤机设备id不能为空", trigger: "blur" }
        ],
        sntype: [
          { required: true, message: "考勤机打卡方式0密码,1指纹,2刷卡不能为空", trigger: "change" }
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
    /** 查询打卡记录列表 */
    getList() {
      this.loading = true;
      listKqdkjl(this.queryParams).then(response => {
        this.kqdkjlList = response.rows;
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
        uid: null,
        dkdt: null,
        optdt: null,
        type: null,
        address: null,
        lat: null,
        lng: null,
        accuracy: null,
        ip: null,
        mac: null,
        content: null,
        imgpath: null,
        snid: null,
        sntype: null,
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
      this.title = "添加打卡记录";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getKqdkjl(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改打卡记录";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateKqdkjl(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addKqdkjl(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除打卡记录编号为"' + ids + '"的数据项？').then(function() {
        return delKqdkjl(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('xinhu-hr/kqdkjl/export', {
        ...this.queryParams
      }, `kqdkjl_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
