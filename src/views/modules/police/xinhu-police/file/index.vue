<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="文件编号" prop="filenum">
        <el-input
          v-model="queryParams.filenum"
          placeholder="请输入文件编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="文件名称" prop="filename">
        <el-input
          v-model="queryParams.filename"
          placeholder="请输入文件名称"
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
          v-hasPermi="['xinhu-police:file:add']"
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
          v-hasPermi="['xinhu-police:file:edit']"
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
          v-hasPermi="['xinhu-police:file:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['xinhu-police:file:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="fileList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="文件编号" align="center" prop="filenum" />
      <el-table-column label="文件名称" align="center" prop="filename" />
      <el-table-column label="文件类型" align="center" prop="filetype" />
      <el-table-column label="扩展名" align="center" prop="fileext" />
      <el-table-column label="文件大小" align="center" prop="filesize" />
      <el-table-column label="上传者" align="center" prop="optname" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['xinhu-police:file:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['xinhu-police:file:remove']"
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

    <!-- 添加或修改上传文件记录对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="180px">
        <el-form-item label="文件编号" prop="filenum">
          <el-input v-model="form.filenum" placeholder="请输入文件编号" />
        </el-form-item>
        <el-form-item label="过期" prop="valid">
          <el-input v-model="form.valid" placeholder="请输入过期" />
        </el-form-item>
        <el-form-item label="文件名称" prop="filename">
          <el-input v-model="form.filename" placeholder="请输入文件名称" />
        </el-form-item>
        <el-form-item label="文件扩展名" prop="fileext">
          <el-input v-model="form.fileext" placeholder="请输入文件扩展名" />
        </el-form-item>
        <el-form-item label="文件大小" prop="filesize">
          <el-input v-model="form.filesize" placeholder="请输入文件大小" />
        </el-form-item>
        <el-form-item label="文件数" prop="filesizecn">
          <el-input v-model="form.filesizecn" placeholder="请输入文件数" />
        </el-form-item>
        <el-form-item label="文件路径" prop="filepath">
          <el-input v-model="form.filepath" placeholder="请输入文件路径" />
        </el-form-item>
        <el-form-item label="缩略图路径" prop="thumbpath">
          <el-input v-model="form.thumbpath" placeholder="请输入缩略图路径" />
        </el-form-item>
        <el-form-item label="操作者ID" prop="optid">
          <el-input v-model="form.optid" placeholder="请输入操作者ID" />
        </el-form-item>
        <el-form-item label="上传者" prop="optname">
          <el-input v-model="form.optname" placeholder="请输入上传者" />
        </el-form-item>
        <el-form-item label="添加时间" prop="adddt">
          <el-date-picker clearable size="small"
            v-model="form.adddt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择添加时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="IP地址" prop="ip">
          <el-input v-model="form.ip" placeholder="请输入IP地址" />
        </el-form-item>
        <el-form-item label="WEB页面" prop="web">
          <el-input v-model="form.web" placeholder="请输入WEB页面" />
        </el-form-item>
        <el-form-item label="对应类型" prop="mtype">
          <el-radio v-model="form.mtype" label="1">特殊</el-radio>
          <el-radio v-model="form.mtype" label="0">一般</el-radio>
        </el-form-item>
        <el-form-item label="管理id" prop="mid">
          <el-input v-model="form.mid" placeholder="请输入管理id" />
        </el-form-item>
        <el-form-item label="下载次数" prop="downci">
          <el-input v-model="form.downci" placeholder="请输入下载次数" />
        </el-form-item>
        <el-form-item label="对应序号邮件附件中用到" prop="keyoi">
          <el-input v-model="form.keyoi" placeholder="请输入对应序号邮件附件中用到" />
        </el-form-item>
        <el-form-item label="转pdf后路径" prop="pdfpath">
          <el-input v-model="form.pdfpath" placeholder="请输入转pdf后路径" />
        </el-form-item>
        <el-form-item label="旧ID" prop="oid">
          <el-input v-model="form.oid" placeholder="请输入旧ID" />
        </el-form-item>
        <el-form-item label="模块编号" prop="mknum">
          <el-input v-model="form.mknum" placeholder="请输入模块编号" />
        </el-form-item>
        <el-form-item label="所属单位" prop="comid">
          <el-input v-model="form.comid" placeholder="请输入所属单位" />
        </el-form-item>
        <el-form-item label="上传到平台上缩略图" prop="thumbplat">
          <el-input v-model="form.thumbplat" placeholder="请输入上传到平台上缩略图" />
        </el-form-item>
        <el-form-item label="读取数" prop="onlynum">
          <el-input v-model="form.onlynum" placeholder="请输入读取数" />
        </el-form-item>
        <el-form-item label="远程路径" prop="filepathout">
          <el-input v-model="form.filepathout" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="说明" prop="content">
          <el-input v-model="form.content" placeholder="请输入说明" />
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
import { listFile, getFile, delFile, addFile, updateFile } from "@/api/xinhu-police/file";

export default {
  name: "File",
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
      // 上传文件记录表格数据
      fileList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        filenum: null,
        valid: null,
        filename: null,
        filetype: null,
        fileext: null,
        filesize: null,
        filesizecn: null,
        filepath: null,
        thumbpath: null,
        optid: null,
        optname: null,
        adddt: null,
        ip: null,
        web: null,
        mtype: null,
        mid: null,
        downci: null,
        keyoi: null,
        pdfpath: null,
        oid: null,
        mknum: null,
        comid: null,
        thumbplat: null,
        onlynum: null,
        filepathout: null,
        content: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        filenum: [
          { required: true, message: "文件编号不能为空", trigger: "blur" }
        ],
        valid: [
          { required: true, message: "期限不能为空", trigger: "blur" }
        ],
        filename: [
          { required: true, message: "文件名称不能为空", trigger: "blur" }
        ],
        filetype: [
          { required: true, message: "文件类型不能为空", trigger: "change" }
        ],
        fileext: [
          { required: true, message: "扩展名不能为空", trigger: "blur" }
        ],
        filesize: [
          { required: true, message: "文件大小不能为空", trigger: "blur" }
        ],
        filesizecn: [
          { required: true, message: "文件数不能为空", trigger: "blur" }
        ],
        filepath: [
          { required: true, message: "文件路径不能为空", trigger: "blur" }
        ],
        thumbpath: [
          { required: true, message: "缩略图路径不能为空", trigger: "blur" }
        ],
        optid: [
          { required: true, message: "操作人ID不能为空", trigger: "blur" }
        ],
        optname: [
          { required: true, message: "上传者不能为空", trigger: "blur" }
        ],
        adddt: [
          { required: true, message: "添加时间不能为空", trigger: "blur" }
        ],
        ip: [
          { required: true, message: "IP地址不能为空", trigger: "blur" }
        ],
        web: [
          { required: true, message: "WEB页面不能为空", trigger: "blur" }
        ],
        mtype: [
          { required: true, message: "对应类型不能为空", trigger: "change" }
        ],
        mid: [
          { required: true, message: "管理id不能为空", trigger: "blur" }
        ],
        downci: [
          { required: true, message: "下载次数不能为空", trigger: "blur" }
        ],
        keyoi: [
          { required: true, message: "对应序号邮件附件中用到不能为空", trigger: "blur" }
        ],
        pdfpath: [
          { required: true, message: "转pdf后路径不能为空", trigger: "blur" }
        ],
        oid: [
          { required: true, message: "旧ID不能为空", trigger: "blur" }
        ],
        mknum: [
          { required: true, message: "模块编号不能为空", trigger: "blur" }
        ],
        comid: [
          { required: true, message: "所属单位不能为空", trigger: "blur" }
        ],
        thumbplat: [
          { required: true, message: "上传到平台上缩略图不能为空", trigger: "blur" }
        ],
        onlynum: [
          { required: true, message: "读取数不能为空", trigger: "blur" }
        ],
        filepathout: [
          { required: true, message: "远程路径不能为空", trigger: "blur" }
        ],
        content: [
          { required: true, message: "说明不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询上传文件记录列表 */
    getList() {
      this.loading = true;
      listFile(this.queryParams).then(response => {
        this.fileList = response.rows;
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
        filenum: null,
        valid: null,
        filename: null,
        filetype: null,
        fileext: null,
        filesize: null,
        filesizecn: null,
        filepath: null,
        thumbpath: null,
        optid: null,
        optname: null,
        adddt: null,
        ip: null,
        web: null,
        mtype: null,
        mid: null,
        downci: null,
        keyoi: null,
        pdfpath: null,
        oid: null,
        mknum: null,
        comid: null,
        thumbplat: null,
        onlynum: null,
        filepathout: null,
        content: null
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
      this.title = "添加上传文件记录";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getFile(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改上传文件记录";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateFile(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addFile(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除上传文件记录编号为"' + ids + '"的数据项？').then(function() {
        return delFile(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('xinhu-police/file/export', {
        ...this.queryParams
      }, `file_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
