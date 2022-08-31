<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="编号" prop="num">
        <el-input
          v-model="queryParams.num"
          placeholder="请输入编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入姓名"
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
          v-hasPermi="['xinhu-person:admin:add']"
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
          v-hasPermi="['xinhu-person:admin:edit']"
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
          v-hasPermi="['xinhu-person:admin:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['xinhu-person:admin:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="adminList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="编号" align="center" prop="num" />
      <el-table-column label="用户名" align="center" prop="user" />
      <el-table-column label="姓名" align="center" prop="name" />
      <el-table-column label="电话" align="center" prop="tel" />
      <el-table-column label="移动电话" align="center" prop="mobile" />
      <el-table-column label="入职时间" align="center" prop="workdate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.workdate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['xinhu-person:admin:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['xinhu-person:admin:remove']"
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

    <!-- 添加或修改用户对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="180px">
      <el-tabs v-model="activeName">
      <el-tab-pane label="用户管理" name="first" @tab-click="handleClick">
        <el-form-item label="编号" prop="num">
          <el-input v-model="form.num" placeholder="请输入编号" />
        </el-form-item>
        <el-form-item label="用户名" prop="user">
          <el-input v-model="form.user" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="密码" prop="pass">
          <el-input placeholder="请输入密码" v-model="form.pass" show-password></el-input>
        </el-form-item>
        <el-form-item label="登录次数" prop="loginci">
          <el-input-number v-model="form.loginci" :min="1" :max="999" label="登录次数"></el-input-number>
        </el-form-item>
        <el-form-item label="是否启用" prop="status">
          <el-radio v-model="form.status" label="1">已启用</el-radio>
          <el-radio v-model="form.status" label="0">未启用</el-radio>
        </el-form-item>
        <el-form-item label="0普通1管理员" prop="type">
          <el-radio v-model="form.type" label="1">管理员</el-radio>
          <el-radio v-model="form.type" label="0">普通</el-radio>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio v-model="form.sex" label="1">男</el-radio>
          <el-radio v-model="form.sex" label="0">女</el-radio>
        </el-form-item>
        <el-form-item label="电话" prop="tel">
          <el-input v-model="form.tel" placeholder="请输入电话" />
        </el-form-item>
        <el-form-item label="头像地址" prop="face">
          <!--<el-input v-model="form.face" placeholder="请输入头像地址" />-->
          <el-upload
              class="upload-demo"
              drag
              action="https://localhost:9000"
              multiple>
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="资源管理" name="second">
          <el-form-item label="主部门ID" prop="deptid">
          <el-select v-model="form.uid" placeholder="请输入用户ID">
            <el-option
              v-for="item in userList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
            </el-option>
          </el-select>

        </el-form-item>
        <el-form-item label="部门" prop="deptname">
          <el-input v-model="form.deptname" placeholder="请输入部门" />
        </el-form-item>
        <el-form-item label="其他部门ID" prop="deptids">
          <el-select v-model="form.deptids" placeholder="请输入主部门ID">
            <el-option v-for="odept in odepts" :key="odept.deptids" :label="odept.label" :value="odept.deptids">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="多部门" prop="deptnames">
          <el-input v-model="form.deptnames" placeholder="请输入多部门" />
        </el-form-item>
        <el-form-item label="多职位" prop="rankings">
          <el-input v-model="form.rankings" placeholder="请输入多职位" />
        </el-form-item>
        <el-form-item label="部门全部路径" prop="deptallname">
          <el-input v-model="form.deptallname" placeholder="请输入部门全部路径" />
        </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="主管配置" name="supervisor">
        <el-form-item label="上级主管ID" prop="superid">
          <el-select v-model="form.uid" placeholder="请输入上级主管ID">
            <el-option
              v-for="item in bookList"
                :key="item.id"
                :label="item.author"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上级主管" prop="superman">
          <el-input v-model="form.superman" placeholder="请输入上级主管" />
        </el-form-item>
        <el-form-item label="岗位" prop="ranking">
          <el-input v-model="form.ranking" placeholder="请输入岗位" />
        </el-form-item>
        <el-form-item label="排序号" prop="sorts">
          <el-input-number v-model="form.sorts" :min="1" :max="999" label="排序号"></el-input-number>
        </el-form-item>
        <el-form-item label="部门路径" prop="deptpath">
          <el-input v-model="form.deptpath" placeholder="请输入部门路径" />
        </el-form-item>
        <el-form-item label="上级主管路径" prop="superpath">
          <el-input v-model="form.superpath" placeholder="请输入上级主管路径" />
        </el-form-item>
        <el-form-item label="组名称" prop="groupname">
          <el-input v-model="form.groupname" placeholder="请输入组名称" />
        </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="个人隐私" name="third">
        <el-form-item label="移动电话" prop="mobile">
          <el-input v-model="form.mobile" placeholder="请输入移动电话" />
        </el-form-item>
        <el-form-item label="是否app提醒" prop="apptx">
          <el-radio v-model="form.apptx" label="1">是</el-radio>
          <el-radio v-model="form.apptx" label="0">否</el-radio>
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
        <el-form-item label="最后app推送时间" prop="lastpush">
          <el-date-picker clearable size="small"
            v-model="form.lastpush"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择最后app推送时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="新增时间" prop="adddt">
          <el-date-picker clearable size="small"
            v-model="form.adddt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择新增时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="微信号" prop="weixinid">
          <el-input v-model="form.weixinid" placeholder="请输入微信号" />
        </el-form-item>
        <el-form-item label="离职日期" prop="quitdt">
          <el-date-picker clearable size="small"
            v-model="form.quitdt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择离职日期">
          </el-date-picker>
        </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="其他" name="four">
        <el-form-item label="默认样式" prop="style">
          <el-input v-model="form.style" placeholder="请输入默认样式" />
        </el-form-item>
        <el-form-item label="名字拼音" prop="pingyin">
          <el-input v-model="form.pingyin" placeholder="请输入名字拼音" />
        </el-form-item>
        <el-form-item label="邮箱密码" prop="emailpass">
          <el-input placeholder="请输入密码" v-model="form.emailpass" show-password></el-input>
        </el-form-item>
        <el-form-item label="所在公司单位Id" prop="companyid">
          <el-input v-model="form.companyid" placeholder="请输入所在公司单位Id" />
        </el-form-item>
        <el-form-item label="在线状态" prop="online">
          <el-radio v-model="form.online" label="1">是</el-radio>
          <el-radio v-model="form.online" label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="最后在线时间" prop="lastonline">
          <el-date-picker clearable size="small"
            v-model="form.lastonline"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择最后在线时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="是否在通讯录上显示" prop="isvcard">
          <el-radio v-model="form.isvcard" label="1">是</el-radio>
          <el-radio v-model="form.isvcard" label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="随机字符串" prop="randslat">
          <el-input v-model="form.randslat" placeholder="请输入随机字符串" />
        </el-form-item>
        <el-form-item label="加入单位id" prop="dwid">
          <el-select v-model="form.dwid" placeholder="请输入加入单位id">
            <el-option v-for="dw in dws" :key="dw.dwid" :label="dw.label" :value="dw.dwid">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="修改密码次数" prop="editpass">
          <el-input-number v-model="form.editpass" :min="1" :max="999" label="修改密码次数"></el-input-number>

        </el-form-item>
        <el-form-item label="默认单位Id" prop="comid">
          <el-select v-model="form.comid" placeholder="请输入默认单位Id">
            <el-option v-for="acomid in comids" :key="acomid.comid" :label="acomid.label" :value="acomid.comid">
            </el-option>
          </el-select>
        </el-form-item>
        </el-tab-pane>
        </el-tabs>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listAdmin, getAdmin, delAdmin, addAdmin, updateAdmin, getUserList, getBookList } from "@/api/xinhu-person/admin";

export default {
  name: "Admin",
  data() {
    return {
      deptsOptions: [],
      userList: [],
      bookList: [],
      activeName: 'first',
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
      // 用户表格数据
      adminList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        num: null,
        user: null,
        name: null,
        pass: null,
        loginci: null,
        status: null,
        type: null,
        sex: null,
        tel: null,
        face: null,
        deptid: null,
        deptname: null,
        deptids: null,
        deptnames: null,
        rankings: null,
        deptallname: null,
        superid: null,
        superman: null,
        ranking: null,
        sorts: null,
        deptpath: null,
        superpath: null,
        groupname: null,
        mobile: null,
        apptx: null,
        workdate: null,
        email: null,
        lastpush: null,
        adddt: null,
        weixinid: null,
        quitdt: null,
        style: null,
        pingyin: null,
        emailpass: null,
        companyid: null,
        online: null,
        lastonline: null,
        isvcard: null,
        randslat: null,
        dwid: null,
        editpass: null,
        comid: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        num: [
          { required: true, message: "编号不能为空", trigger: "blur" },
          { min: 2, max: 10, message: "编号长度在2到10个字符", trigger: "blur"}
        ],
        user: [
          { required: true, message: "用户名不能为空", trigger: "blur" },
          { min: 2, max: 10, message: "用户名长度在2到10个字符", trigger: "blur"}
        ],
        name: [
          { required: true, message: "姓名不能为空", trigger: "blur" },
          { min: 2, max: 10, message: "姓名长度在2到10个字符", trigger: "blur"}
        ],
        pass: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          { type: "string", min: 8, max: 20,message: "密码不允许小于8位和大于20位", trigger: "blur"}
        ],
        loginci: [
          { required: true, message: "登录次数不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "是否启用不能为空", trigger: "blur" }
        ],
        type: [
          { required: true, message: "0普通1管理员不能为空", trigger: "change" }
        ],
        sex: [
          { required: true, message: "性别不能为空", trigger: "change" }
        ],
        tel: [
          { required: true, message: "电话不能为空", trigger: "blur" },
          { type: "string", min: 11, message: "电话不允许小于11位", trigger: "blur"},
          { pattern: /^\d+(\.\d+)?$/, message: "电话必须是数字", trigger: "blur"}
        ],
        face: [
          { required: true, message: "头像地址不能为空", trigger: "blur" }
        ],
        deptid: [
          { required: true, message: "主部门ID不能为空", trigger: "blur" }
        ],
        deptname: [
          { required: true, message: "部门不能为空", trigger: "blur" },
          { min: 5, max: 15, message: "部门长度在5到15个字符", trigger: "blur"}
        ],
        deptids: [
          { required: true, message: "其他部门ID不能为空", trigger: "blur" }
        ],
        deptnames: [
          { required: true, message: "多部门不能为空", trigger: "blur" },
          { min: 5, max: 15, message: "多部门长度在5到15个字符", trigger: "blur"}
        ],
        rankings: [
          { required: true, message: "多职位不能为空", trigger: "blur" },
          { min: 5, max: 15, message: "多职位长度在5到15个字符", trigger: "blur"}
        ],
        deptallname: [
          { required: true, message: "部门全部路径不能为空", trigger: "blur" },
          { min: 5, max: 15, message: "部门长度在5到15个字符", trigger: "blur"}
        ],
        superid: [
          { required: true, message: "上级主管ID不能为空", trigger: "blur" }
        ],
        superman: [
          { required: true, message: "上级主管不能为空", trigger: "blur" },
          { min: 5, max: 15, message: "上级主管长度在5到15个字符", trigger: "blur"}
        ],
        ranking: [
          { required: true, message: "岗位不能为空", trigger: "blur" },
          { min: 5, max: 15, message: "岗位长度在5到15个字符", trigger: "blur"}
        ],
        sorts: [
          { required: true, message: "排序号不能为空", trigger: "blur" }
        ],
        deptpath: [
          { required: true, message: "部门路径不能为空", trigger: "blur" },
          { min: 5, max: 50, message: "部门路径长度在5到50个字符", trigger: "blur"}
        ],
        superpath: [
          { required: true, message: "上级主管路径不能为空", trigger: "blur" },
          { min: 5, max: 50, message: "上级主管路径长度在5到50个字符", trigger: "blur"}
        ],
        groupname: [
          { required: true, message: "组名称不能为空", trigger: "blur" },
          { min: 5, max: 15, message: "组名称长度在5到15个字符", trigger: "blur"}
        ],
        mobile: [
          { required: true, message: "移动电话不能为空", trigger: "blur" },
          { type: "string", min: 11, message: "移动电话不允许小于11位", trigger: "blur"},
          { pattern: /^\d+(\.\d+)?$/, message: "移动电话必须是数字", trigger: "blur"}
        ],
        apptx: [
          { required: true, message: "是否app提醒不能为空", trigger: "blur" }
        ],
        workdate: [
          { required: true, message: "入职时间不能为空", trigger: "blur" },
          {Type: 'date', required: true, message: '请选择入职时间', trigger: 'change'}
        ],
        email: [
          { required: true, message: "邮箱不能为空", trigger: "blur" },
          {
            type: "email",
            message: "'请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        lastpush: [
          { required: true, message: "最后app推送时间不能为空", trigger: "blur" },
          {Type: 'date', required: true, message: '请选择最后app推送时间', trigger: 'change'}
        ],
        adddt: [
          { required: true, message: "新增时间不能为空", trigger: "blur" },
          {Type: 'date', required: true, message: '请选择新增时间', trigger: 'change'}
        ],
        weixinid: [
          { required: true, message: "微信号不能为空", trigger: "blur" },
          { min: 5, max: 15, message: "微信号长度在5到15个字符", trigger: "blur"}
        ],
        quitdt: [
          { required: true, message: "离职日期不能为空", trigger: "blur" },
          {Type: 'date', required: true, message: '请选择离职日期', trigger: 'change'}
        ],
        style: [
          { required: true, message: "默认样式不能为空", trigger: "blur" },
          { min: 5, max: 15, message: "默认样式长度在5到15个字符", trigger: "blur"}
        ],
        pingyin: [
          { required: true, message: "名字拼音不能为空", trigger: "blur" },
          { min: 5, max: 15, message: "名字拼音长度在5到15个字符", trigger: "blur"}
        ],
        emailpass: [
          { required: true, message: "邮箱密码不能为空", trigger: "blur" },
          { min: 5, max: 15, message: "邮箱密码长度在5到15个字符", trigger: "blur"}
        ],
        companyid: [
          { required: true, message: "所在公司单位Id不能为空", trigger: "blur" }
        ],
        online: [
          { required: true, message: "在线状态不能为空", trigger: "blur" }
        ],
        lastonline: [
          { required: true, message: "最后在线时间不能为空", trigger: "blur" },
          {Type: 'date', required: true, message: '请选择最后在线时间', trigger: 'change'}
        ],
        isvcard: [
          { required: true, message: "是否在通讯录上显示不能为空", trigger: "blur" }
        ],
        randslat: [
          { required: true, message: "随机字符串不能为空", trigger: "blur" }
        ],
        dwid: [
          { required: true, message: "加入单位id不能为空", trigger: "blur" }
        ],
        editpass: [
          { required: true, message: "修改密码次数不能为空", trigger: "blur" }
        ],
        comid: [
          { required: true, message: "默认单位Id不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
    //获取用户列表
    getUserList().then(response=> {
      this.userList = response.data;
    }),
    //获取用户列表
    getBookList().then(response=> {
      this.bookList = response.data;
    })
  },
  methods: {
    /** 查询用户列表 */
    getList() {
      this.loading = true;
      listAdmin(this.queryParams).then(response => {
        this.adminList = response.rows;
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
        user: null,
        name: null,
        pass: null,
        loginci: null,
        status: 0,
        type: null,
        sex: null,
        tel: null,
        face: null,
        deptid: null,
        deptids:[],
        deptname: null,
        deptids: null,
        deptnames: null,
        rankings: null,
        deptallname: null,
        superid: null,
        superman: null,
        ranking: null,
        sorts: null,
        deptpath: null,
        superpath: null,
        groupname: null,
        mobile: null,
        apptx: null,
        workdate: null,
        email: null,
        lastpush: null,
        adddt: null,
        weixinid: null,
        quitdt: null,
        style: null,
        pingyin: null,
        emailpass: null,
        companyid: null,
        online: null,
        lastonline: null,
        isvcard: null,
        randslat: null,
        dwid: null,
        editpass: null,
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
      getAdmin().then(response => {
        this.deptsOptions = response.depts;
        this.open = true;
        this.title = "添加用户";
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getAdmin(id).then(response => {
        this.form = response.data;
        this.deptsOptions = response.depts;
        this.form.deptids = response.deptids;
        this.open = true;
        this.title = "修改用户";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateAdmin(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addAdmin(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除用户编号为"' + ids + '"的数据项？').then(function() {
        return delAdmin(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('xinhu-person/admin/export', {
        ...this.queryParams
      }, `admin_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
