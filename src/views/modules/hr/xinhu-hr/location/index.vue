<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="用户" prop="user">
        <el-input
          v-model="queryParams.user"
          placeholder="请输入用户"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="操作时间" prop="optdt">
        <el-date-picker clearable size="small"
          v-model="queryParams.optdt"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择操作时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="地理位置纬度" prop="locationX">
        <el-input
          v-model="queryParams.locationX"
          placeholder="请输入地理位置纬度"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="地理位置经度 " prop="locationY">
        <el-input
          v-model="queryParams.locationY"
          placeholder="请输入地理位置经度 "
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
          v-hasPermi="['xinhu-hr:location:add']"
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
          v-hasPermi="['xinhu-hr:location:edit']"
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
          v-hasPermi="['xinhu-hr:location:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['xinhu-hr:location:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="locationList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="用户" align="center" prop="user" />
      <el-table-column label="应用Id" align="center" prop="agentid" />
      <el-table-column label="操作时间" align="center" prop="optdt" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.optdt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="地理位置纬度" align="center" prop="locationX" />
      <el-table-column label="地理位置经度 " align="center" prop="locationY" />
      <el-table-column label="地图缩放大小" align="center" prop="scale" />
      <el-table-column label="地理位置" align="center" prop="label" />
      <el-table-column label="相关图片" align="center" prop="imgpath" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['xinhu-hr:location:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['xinhu-hr:location:remove']"
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

    <!-- 添加或修改外勤定位对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="180px">
        <el-form-item label="用户" prop="user">
          <el-input v-model="form.user" placeholder="请输入用户" />
        </el-form-item>
        <el-form-item label="用户ID" prop="uid">
          <el-input v-model="form.uid" placeholder="请输入用户ID" />
        </el-form-item>
        <el-form-item label="应用Id" prop="agentid">
          <el-input v-model="form.agentid" placeholder="请输入应用Id" />
        </el-form-item>
        <el-form-item label="操作时间" prop="optdt">
          <el-date-picker clearable size="small"
            v-model="form.optdt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择操作时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="地理位置纬度" prop="locationX">
          <el-input v-model="form.locationX" placeholder="请输入地理位置纬度" />
        </el-form-item>
        <el-form-item label="地理位置经度 " prop="locationY">
          <el-input v-model="form.locationY" placeholder="请输入地理位置经度 " />
        </el-form-item>
        <el-form-item label="地图缩放大小" prop="scale">
          <el-input v-model="form.scale" placeholder="请输入地图缩放大小" />
        </el-form-item>
        <el-form-item label="地理位置" prop="label">
          <el-input v-model="form.label" placeholder="请输入地理位置" />
        </el-form-item>
        <el-form-item label="消息ID" prop="msgid">
          <el-input v-model="form.msgid" placeholder="请输入消息ID" />
        </el-form-item>
        <el-form-item label="地理位置精度" prop="precisions">
          <el-input v-model="form.precisions" placeholder="请输入地理位置精度" />
        </el-form-item>
        <el-form-item label="类型" prop="types">
          <el-radio v-model="form.types" label="0">普通</el-radio>
          <el-radio v-model="form.types" label="1">事件</el-radio>
          <el-radio v-model="form.types" label="2">企业微信定位</el-radio>
        </el-form-item>
        <el-form-item label="说明" prop="content">
          <el-input v-model="form.content" placeholder="请输入说明" />
        </el-form-item>
        <el-form-item label="相关图片" prop="imgpath">
          <el-input v-model="form.imgpath" placeholder="请输入相关图片" />
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
import { listLocation, getLocation, delLocation, addLocation, updateLocation } from "@/api/xinhu-hr/location";

export default {
  name: "Location",
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
      // 外勤定位表格数据
      locationList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        user: null,
        uid: null,
        agentid: null,
        optdt: null,
        locationX: null,
        locationY: null,
        scale: null,
        label: null,
        msgid: null,
        precisions: null,
        types: null,
        content: null,
        imgpath: null,
        comid: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        user: [
          { required: true, message: "用户不能为空", trigger: "blur" }
        ],
        uid: [
          { required: true, message: "用户ID不能为空", trigger: "blur" }
        ],
        agentid: [
          { required: true, message: "应用Id不能为空", trigger: "blur" }
        ],
        optdt: [
          { required: true, message: "操作时间不能为空", trigger: "blur" }
        ],
        locationX: [
          { required: true, message: "地理位置纬度不能为空", trigger: "blur" }
        ],
        locationY: [
          { required: true, message: "地理位置经度 不能为空", trigger: "blur" }
        ],
        scale: [
          { required: true, message: "地图缩放大小不能为空", trigger: "blur" }
        ],
        label: [
          { required: true, message: "地理位置不能为空", trigger: "blur" }
        ],
        msgid: [
          { required: true, message: "消息ID不能为空", trigger: "blur" }
        ],
        precisions: [
          { required: true, message: "地理位置精度不能为空", trigger: "blur" }
        ],
        types: [
          { required: true, message: "0普通,1事件,2企业微信定位不能为空", trigger: "change" }
        ],
        content: [
          { required: true, message: "说明不能为空", trigger: "blur" }
        ],
        imgpath: [
          { required: true, message: "相关图片不能为空", trigger: "blur" }
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
    /** 查询外勤定位列表 */
    getList() {
      this.loading = true;
      listLocation(this.queryParams).then(response => {
        this.locationList = response.rows;
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
        user: null,
        uid: null,
        agentid: null,
        optdt: null,
        locationX: null,
        locationY: null,
        scale: null,
        label: null,
        msgid: null,
        precisions: null,
        types: null,
        content: null,
        imgpath: null,
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
      this.title = "添加外勤定位";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getLocation(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改外勤定位";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateLocation(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addLocation(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除外勤定位编号为"' + ids + '"的数据项？').then(function() {
        return delLocation(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('xinhu-hr/location/export', {
        ...this.queryParams
      }, `location_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
