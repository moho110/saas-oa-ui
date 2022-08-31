<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="姓名" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入姓名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="编号" prop="num">
        <el-input
          v-model="queryParams.num"
          placeholder="请输入编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="部门名称" prop="deptname">
        <el-input
          v-model="queryParams.deptname"
          placeholder="请输入部门名称"
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
          v-hasPermi="['xinhu-person:userinfo:add']"
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
          v-hasPermi="['xinhu-person:userinfo:edit']"
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
          v-hasPermi="['xinhu-person:userinfo:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['xinhu-person:userinfo:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="userinfoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="姓名" align="center" prop="name" />
      <el-table-column label="编号" align="center" prop="num" />
      <el-table-column label="部门名称" align="center" prop="deptname" />
      <el-table-column label="电话" align="center" prop="tel" />
      <el-table-column label="手机号" align="center" prop="mobile" />
      <el-table-column label="入职时间" align="center" prop="workdate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.workdate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="邮箱" align="center" prop="email" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['xinhu-person:userinfo:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['xinhu-person:userinfo:remove']"
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

    <!-- 添加或修改用户档案对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="编号" prop="num">
          <el-input v-model="form.num" placeholder="请输入编号" />
        </el-form-item>
        <el-form-item label="部门名称" prop="deptname">
          <el-input v-model="form.deptname" placeholder="请输入部门名称" />
        </el-form-item>
        <el-form-item label="多部门" prop="deptnames">
          <el-input v-model="form.deptnames" placeholder="请输入多部门" />
        </el-form-item>
        <el-form-item label="部门全名" prop="deptallname">
          <el-input v-model="form.deptallname" placeholder="请输入部门全名" />
        </el-form-item>
        <el-form-item label="职位" prop="ranking">
          <el-input v-model="form.ranking" placeholder="请输入职位" />
        </el-form-item>
        <el-form-item label="多职位" prop="rankings">
          <el-input v-model="form.rankings" placeholder="请输入多职位" />
        </el-form-item>
        <el-form-item label="dkip" prop="dkip">
          <el-input v-model="form.dkip" placeholder="请输入dkip" />
        </el-form-item>
        <el-form-item label="dkmac" prop="dkmac">
          <el-input v-model="form.dkmac" placeholder="请输入dkmac" />
        </el-form-item>
        <el-form-item label="状态来自userstate" prop="state">
          <el-input v-model="form.state" placeholder="请输入状态来自userstate" />
        </el-form-item>
        <el-form-item label="电话" prop="tel">
          <el-input v-model="form.tel" placeholder="请输入电话" />
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="form.mobile" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="入职时间" prop="workdate">
          <el-date-picker clearable size="small"
            v-model="form.workdate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择入职时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="离职日期" prop="quitdt">
          <el-date-picker clearable size="small"
            v-model="form.quitdt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择离职日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="是否考勤" prop="iskq">
          <el-input v-model="form.iskq" placeholder="请输入是否考勤" />
        </el-form-item>
        <el-form-item label="是否定位打卡" prop="isdwdk">
          <el-input v-model="form.isdwdk" placeholder="请输入是否定位打卡" />
        </el-form-item>
        <el-form-item label="生日" prop="birthday">
          <el-date-picker clearable size="small"
            v-model="form.birthday"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择生日">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="学历" prop="xueli">
          <el-input v-model="form.xueli" placeholder="请输入学历" />
        </el-form-item>
        <el-form-item label="民族" prop="minzu">
          <el-input v-model="form.minzu" placeholder="请输入民族" />
        </el-form-item>
        <el-form-item label="婚姻" prop="hunyin">
          <el-input v-model="form.hunyin" placeholder="请输入婚姻" />
        </el-form-item>
        <el-form-item label="籍贯" prop="jiguan">
          <el-input v-model="form.jiguan" placeholder="请输入籍贯" />
        </el-form-item>
        <el-form-item label="现住址" prop="nowdizhi">
          <el-input v-model="form.nowdizhi" placeholder="请输入现住址" />
        </el-form-item>
        <el-form-item label="家庭地址" prop="housedizhi">
          <el-input v-model="form.housedizhi" placeholder="请输入家庭地址" />
        </el-form-item>
        <el-form-item label="试用期到" prop="syenddt">
          <el-date-picker clearable size="small"
            v-model="form.syenddt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择试用期到">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="转正日期" prop="positivedt">
          <el-date-picker clearable size="small"
            v-model="form.positivedt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择转正日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="开户行" prop="bankname">
          <el-input v-model="form.bankname" placeholder="请输入开户行" />
        </el-form-item>
        <el-form-item label="工资卡帐号" prop="banknum">
          <el-input v-model="form.banknum" placeholder="请输入工资卡帐号" />
        </el-form-item>
        <el-form-item label="照片" prop="zhaopian">
          <el-input v-model="form.zhaopian" placeholder="请输入照片" />
        </el-form-item>
        <el-form-item label="身份证号" prop="idnum">
          <el-input v-model="form.idnum" placeholder="请输入身份证号" />
        </el-form-item>
        <el-form-item label="备用联系人" prop="spareman">
          <el-input v-model="form.spareman" placeholder="请输入备用联系人" />
        </el-form-item>
        <el-form-item label="备用联系人电话" prop="sparetel">
          <el-input v-model="form.sparetel" placeholder="请输入备用联系人电话" />
        </el-form-item>
        <el-form-item label="是否需要写日报" prop="isdaily">
          <el-input v-model="form.isdaily" placeholder="请输入是否需要写日报" />
        </el-form-item>
        <el-form-item label="所在公司单位Id" prop="companyid">
          <el-input v-model="form.companyid" placeholder="请输入所在公司单位Id" />
        </el-form-item>
        <el-form-item label="关联考勤机人员编号" prop="finger">
          <el-input v-model="form.finger" placeholder="请输入关联考勤机人员编号" />
        </el-form-item>
        <el-form-item label="加入单位id" prop="dwid">
          <el-input v-model="form.dwid" placeholder="请输入加入单位id" />
        </el-form-item>
        <el-divider content-position="center">人员档案子信息</el-divider>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAddXinhuUserinfos">添加</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDeleteXinhuUserinfos">删除</el-button>
          </el-col>
        </el-row>
        <el-table :data="xinhuUserinfosList" :row-class-name="rowXinhuUserinfosIndex" @selection-change="handleXinhuUserinfosSelectionChange" ref="xinhuUserinfos">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="序号" align="center" prop="index" width="50"/>
          <el-table-column label="排序号" prop="sort">
            <template slot-scope="scope">
              <el-input v-model="scope.row.sort" placeholder="请输入排序号" />
            </template>
          </el-table-column>
          <el-table-column label="开始日期" prop="startdt">
            <template slot-scope="scope">
              <el-input v-model="scope.row.startdt" placeholder="请输入开始日期" />
            </template>
          </el-table-column>
          <el-table-column label="截止日期" prop="enddt">
            <template slot-scope="scope">
              <el-input v-model="scope.row.enddt" placeholder="请输入截止日期" />
            </template>
          </el-table-column>
          <el-table-column label="职位" prop="rank">
            <template slot-scope="scope">
              <el-input v-model="scope.row.rank" placeholder="请输入职位" />
            </template>
          </el-table-column>
          <el-table-column label="单位名称" prop="unitname">
            <template slot-scope="scope">
              <el-input v-model="scope.row.unitname" placeholder="请输入单位名称" />
            </template>
          </el-table-column>
          <el-table-column label="0工作经历,1教育经历" prop="sslx">
            <template slot-scope="scope">
              <el-input v-model="scope.row.sslx" placeholder="请输入0工作经历,1教育经历" />
            </template>
          </el-table-column>
          <el-table-column label="对应单位id" prop="comid">
            <template slot-scope="scope">
              <el-input v-model="scope.row.comid" placeholder="请输入对应单位id" />
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listUserinfo, getUserinfo, delUserinfo, addUserinfo, updateUserinfo } from "@/api/xinhu-person/userinfo";

export default {
  name: "Userinfo",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 子表选中数据
      checkedXinhuUserinfos: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 用户档案表格数据
      userinfoList: [],
      // 人员档案子表格数据
      xinhuUserinfosList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: null,
        num: null,
        deptname: null,
        deptnames: null,
        deptallname: null,
        ranking: null,
        rankings: null,
        dkip: null,
        dkmac: null,
        state: null,
        sex: null,
        tel: null,
        mobile: null,
        workdate: null,
        email: null,
        quitdt: null,
        iskq: null,
        isdwdk: null,
        birthday: null,
        xueli: null,
        birtype: null,
        minzu: null,
        hunyin: null,
        jiguan: null,
        nowdizhi: null,
        housedizhi: null,
        syenddt: null,
        positivedt: null,
        bankname: null,
        banknum: null,
        zhaopian: null,
        idnum: null,
        spareman: null,
        sparetel: null,
        isdaily: null,
        companyid: null,
        finger: null,
        dwid: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [
          { required: true, message: "姓名不能为空", trigger: "blur" }
        ],
        num: [
          { required: true, message: "编号不能为空", trigger: "blur" }
        ],
        deptname: [
          { required: true, message: "部门名称不能为空", trigger: "blur" }
        ],
        deptnames: [
          { required: true, message: "多部门不能为空", trigger: "blur" }
        ],
        deptallname: [
          { required: true, message: "部门所有名称不能为空", trigger: "blur" }
        ],
        ranking: [
          { required: true, message: "排名不能为空", trigger: "blur" }
        ],
        rankings: [
          { required: true, message: "多职位不能为空", trigger: "blur" }
        ],
        dkip: [
          { required: true, message: "IP地址不能为空", trigger: "blur" }
        ],
        dkmac: [
          { required: true, message: "MAC地址不能为空", trigger: "blur" }
        ],
        state: [
          { required: true, message: "状态来自userstate不能为空", trigger: "blur" }
        ],
        sex: [
          { required: true, message: "性别不能为空", trigger: "change" }
        ],
        tel: [
          { required: true, message: "电话不能为空", trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "手机号不能为空", trigger: "blur" }
        ],
        workdate: [
          { required: true, message: "入职时间不能为空", trigger: "blur" }
        ],
        email: [
          { required: true, message: "邮箱不能为空", trigger: "blur" }
        ],
        quitdt: [
          { required: true, message: "离职日期不能为空", trigger: "blur" }
        ],
        iskq: [
          { required: true, message: "是否考勤不能为空", trigger: "blur" }
        ],
        isdwdk: [
          { required: true, message: "是否定位打卡不能为空", trigger: "blur" }
        ],
        birthday: [
          { required: true, message: "生日不能为空", trigger: "blur" }
        ],
        xueli: [
          { required: true, message: "学历不能为空", trigger: "blur" }
        ],
        birtype: [
          { required: true, message: "0阳历1农历不能为空", trigger: "change" }
        ],
        minzu: [
          { required: true, message: "民族不能为空", trigger: "blur" }
        ],
        hunyin: [
          { required: true, message: "婚姻不能为空", trigger: "blur" }
        ],
        jiguan: [
          { required: true, message: "籍贯不能为空", trigger: "blur" }
        ],
        nowdizhi: [
          { required: true, message: "现住址不能为空", trigger: "blur" }
        ],
        housedizhi: [
          { required: true, message: "家庭地址不能为空", trigger: "blur" }
        ],
        syenddt: [
          { required: true, message: "试用期到不能为空", trigger: "blur" }
        ],
        positivedt: [
          { required: true, message: "转正日期不能为空", trigger: "blur" }
        ],
        bankname: [
          { required: true, message: "开户行不能为空", trigger: "blur" }
        ],
        banknum: [
          { required: true, message: "工资卡帐号不能为空", trigger: "blur" }
        ],
        zhaopian: [
          { required: true, message: "照片不能为空", trigger: "blur" }
        ],
        idnum: [
          { required: true, message: "身份证号不能为空", trigger: "blur" }
        ],
        spareman: [
          { required: true, message: "备用联系人不能为空", trigger: "blur" }
        ],
        sparetel: [
          { required: true, message: "备用联系人电话不能为空", trigger: "blur" }
        ],
        isdaily: [
          { required: true, message: "是否需要写日报不能为空", trigger: "blur" }
        ],
        companyid: [
          { required: true, message: "所在公司单位Id不能为空", trigger: "blur" }
        ],
        finger: [
          { required: true, message: "关联考勤机人员编号不能为空", trigger: "blur" }
        ],
        dwid: [
          { required: true, message: "加入单位id不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询用户档案列表 */
    getList() {
      this.loading = true;
      listUserinfo(this.queryParams).then(response => {
        this.userinfoList = response.rows;
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
        num: null,
        deptname: null,
        deptnames: null,
        deptallname: null,
        ranking: null,
        rankings: null,
        dkip: null,
        dkmac: null,
        state: null,
        sex: null,
        tel: null,
        mobile: null,
        workdate: null,
        email: null,
        quitdt: null,
        iskq: null,
        isdwdk: null,
        birthday: null,
        xueli: null,
        birtype: null,
        minzu: null,
        hunyin: null,
        jiguan: null,
        nowdizhi: null,
        housedizhi: null,
        syenddt: null,
        positivedt: null,
        bankname: null,
        banknum: null,
        zhaopian: null,
        idnum: null,
        spareman: null,
        sparetel: null,
        isdaily: null,
        companyid: null,
        finger: null,
        dwid: null
      };
      this.xinhuUserinfosList = [];
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
      this.title = "添加用户档案";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getUserinfo(id).then(response => {
        this.form = response.data;
        this.xinhuUserinfosList = response.data.xinhuUserinfosList;
        this.open = true;
        this.title = "修改用户档案";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.xinhuUserinfosList = this.xinhuUserinfosList;
          if (this.form.id != null) {
            updateUserinfo(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addUserinfo(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除用户档案编号为"' + ids + '"的数据项？').then(function() {
        return delUserinfo(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
	/** 人员档案子序号 */
    rowXinhuUserinfosIndex({ row, rowIndex }) {
      row.index = rowIndex + 1;
    },
    /** 人员档案子添加按钮操作 */
    handleAddXinhuUserinfos() {
      let obj = {};
      obj.sort = "";
      obj.startdt = "";
      obj.enddt = "";
      obj.rank = "";
      obj.unitname = "";
      obj.sslx = "";
      obj.comid = "";
      this.xinhuUserinfosList.push(obj);
    },
    /** 人员档案子删除按钮操作 */
    handleDeleteXinhuUserinfos() {
      if (this.checkedXinhuUserinfos.length == 0) {
        this.$modal.msgError("请先选择要删除的人员档案子数据");
      } else {
        const xinhuUserinfosList = this.xinhuUserinfosList;
        const checkedXinhuUserinfos = this.checkedXinhuUserinfos;
        this.xinhuUserinfosList = xinhuUserinfosList.filter(function(item) {
          return checkedXinhuUserinfos.indexOf(item.index) == -1
        });
      }
    },
    /** 复选框选中数据 */
    handleXinhuUserinfosSelectionChange(selection) {
      this.checkedXinhuUserinfos = selection.map(item => item.index)
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('xinhu-person/userinfo/export', {
        ...this.queryParams
      }, `userinfo_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
