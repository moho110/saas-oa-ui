<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="对应人" prop="uname">
        <el-input
          v-model="queryParams.uname"
          placeholder="请输入对应人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="对应人员部门" prop="udeptname">
        <el-input
          v-model="queryParams.udeptname"
          placeholder="请输入对应人员部门"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="操作人" prop="optname">
        <el-input
          v-model="queryParams.optname"
          placeholder="请输入操作人"
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
          v-hasPermi="['xinhu-hr:hrsalary:add']"
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
          v-hasPermi="['xinhu-hr:hrsalary:edit']"
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
          v-hasPermi="['xinhu-hr:hrsalary:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['xinhu-hr:hrsalary:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="hrsalaryList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="用户ID" align="center" prop="uid" />
      <el-table-column label="对应人" align="center" prop="uname" />
      <el-table-column label="对应人员部门" align="center" prop="udeptname" />
      <el-table-column label="职位" align="center" prop="ranking" />
      <el-table-column label="操作时间" align="center" prop="optdt" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.optdt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作人" align="center" prop="optname" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['xinhu-hr:hrsalary:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['xinhu-hr:hrsalary:remove']"
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

    <!-- 添加或修改工资对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="180px">
        <el-form-item label="用户ID" prop="uid">
          <el-input v-model="form.uid" placeholder="请输入用户ID" />
        </el-form-item>
        <el-form-item label="x用户ID" prop="xuid">
          <el-input v-model="form.xuid" placeholder="请输入x用户ID" />
        </el-form-item>
        <el-form-item label="对应人" prop="uname">
          <el-input v-model="form.uname" placeholder="请输入对应人" />
        </el-form-item>
        <el-form-item label="对应人员部门" prop="udeptname">
          <el-input v-model="form.udeptname" placeholder="请输入对应人员部门" />
        </el-form-item>
        <el-form-item label="职位" prop="ranking">
          <el-input v-model="form.ranking" placeholder="请输入职位" />
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
        <el-form-item label="申请日期" prop="applydt">
          <el-date-picker clearable size="small"
            v-model="form.applydt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择申请日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="说明" prop="content">
          <el-input v-model="form.content" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio v-model="form.status" label="1">良好</el-radio>
          <el-radio v-model="form.status" label="0">一般</el-radio>
        </el-form-item>
        <el-form-item label="是否提交" prop="isturn">
          <el-radio v-model="form.status" label="1">是</el-radio>
          <el-radio v-model="form.isturn" label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="月份" prop="month">
          <el-input v-model="form.month" placeholder="请输入月份" />
        </el-form-item>
        <el-form-item label="基本工资" prop="base">
          <el-input v-model="form.base" placeholder="请输入基本工资" />
        </el-form-item>
        <el-form-item label="实发" prop="money">
          <el-input v-model="form.money" placeholder="请输入实发" />
        </el-form-item>
        <el-form-item label="应发工资" prop="mones">
          <el-input v-model="form.mones" placeholder="请输入应发工资" />
        </el-form-item>
        <el-form-item label="职务津贴" prop="postjt">
          <el-input v-model="form.postjt" placeholder="请输入职务津贴" />
        </el-form-item>
        <el-form-item label="技能津贴" prop="skilljt">
          <el-input v-model="form.skilljt" placeholder="请输入技能津贴" />
        </el-form-item>
        <el-form-item label="交通补贴" prop="travelbt">
          <el-input v-model="form.travelbt" placeholder="请输入交通补贴" />
        </el-form-item>
        <el-form-item label="通信补贴" prop="telbt">
          <el-input v-model="form.telbt" placeholder="请输入通信补贴" />
        </el-form-item>
        <el-form-item label="奖励" prop="reward">
          <el-input v-model="form.reward" placeholder="请输入奖励" />
        </el-form-item>
        <el-form-item label="处罚" prop="punish">
          <el-input v-model="form.punish" placeholder="请输入处罚" />
        </el-form-item>
        <el-form-item label="个人社保" prop="socials">
          <el-input v-model="form.socials" placeholder="请输入个人社保" />
        </el-form-item>
        <el-form-item label="单位社保缴费" prop="socialsunit">
          <el-input v-model="form.socialsunit" placeholder="请输入单位社保缴费" />
        </el-form-item>
        <el-form-item label="个人所得税" prop="taxes">
          <el-input v-model="form.taxes" placeholder="请输入个人所得税" />
        </el-form-item>
        <el-form-item label="个税起征点" prop="taxbase">
          <el-input v-model="form.taxbase" placeholder="请输入个税起征点" />
        </el-form-item>
        <el-form-item label="是否发放" prop="ispay">
          <el-radio v-model="form.ispay" label="1">是</el-radio>
          <el-radio v-model="form.ispay" label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="其它增加" prop="otherzj">
          <el-input v-model="form.otherzj" placeholder="请输入其它增加" />
        </el-form-item>
        <el-form-item label="其它减少" prop="otherjs">
          <el-input v-model="form.otherjs" placeholder="请输入其它减少" />
        </el-form-item>
        <el-form-item label="迟到(次)" prop="cidao">
          <el-input v-model="form.cidao" placeholder="请输入迟到(次)" />
        </el-form-item>
        <el-form-item label="迟到处罚" prop="cidaos">
          <el-input v-model="form.cidaos" placeholder="请输入迟到处罚" />
        </el-form-item>
        <el-form-item label="早退(次)" prop="zaotui">
          <el-input v-model="form.zaotui" placeholder="请输入早退(次)" />
        </el-form-item>
        <el-form-item label="早退处罚" prop="zaotuis">
          <el-input v-model="form.zaotuis" placeholder="请输入早退处罚" />
        </el-form-item>
        <el-form-item label="请假(小时)" prop="leave">
          <el-input v-model="form.leave" placeholder="请输入请假(小时)" />
        </el-form-item>
        <el-form-item label="请假减少" prop="leaves">
          <el-input v-model="form.leaves" placeholder="请输入请假减少" />
        </el-form-item>
        <el-form-item label="加班(小时)" prop="jiaban">
          <el-input v-model="form.jiaban" placeholder="请输入加班(小时)" />
        </el-form-item>
        <el-form-item label="加班补贴" prop="jiabans">
          <el-input v-model="form.jiabans" placeholder="请输入加班补贴" />
        </el-form-item>
        <el-form-item label="未打卡(次)" prop="weidk">
          <el-input v-model="form.weidk" placeholder="请输入未打卡(次)" />
        </el-form-item>
        <el-form-item label="未打卡减少" prop="weidks">
          <el-input v-model="form.weidks" placeholder="请输入未打卡减少" />
        </el-form-item>
        <el-form-item label="绩效基数" prop="jxjs">
          <el-input v-model="form.jxjs" placeholder="请输入绩效基数" />
        </el-form-item>
        <el-form-item label="绩效系数" prop="jxxs">
          <el-input v-model="form.jxxs" placeholder="请输入绩效系数" />
        </el-form-item>
        <el-form-item label="绩效打分" prop="jxdf">
          <el-input v-model="form.jxdf" placeholder="请输入绩效打分" />
        </el-form-item>
        <el-form-item label="绩效收入" prop="jtpost">
          <el-input v-model="form.jtpost" placeholder="请输入绩效收入" />
        </el-form-item>
        <el-form-item label="应上班天数" prop="ysbtime">
          <el-input v-model="form.ysbtime" placeholder="请输入应上班天数" />
        </el-form-item>
        <el-form-item label="已上班天数" prop="zsbtime">
          <el-input v-model="form.zsbtime" placeholder="请输入已上班天数" />
        </el-form-item>
        <el-form-item label="公积金个人" prop="gonggeren">
          <el-input v-model="form.gonggeren" placeholder="请输入公积金个人" />
        </el-form-item>
        <el-form-item label="公积金单位" prop="gongunit">
          <el-input v-model="form.gongunit" placeholder="请输入公积金单位" />
        </el-form-item>
        <el-form-item label="餐补贴" prop="foodbt">
          <el-input v-model="form.foodbt" placeholder="请输入餐补贴" />
        </el-form-item>
        <el-form-item label="高温津贴" prop="hotbt">
          <el-input v-model="form.hotbt" placeholder="请输入高温津贴" />
        </el-form-item>
        <el-form-item label="电脑补贴" prop="dnbt">
          <el-input v-model="form.dnbt" placeholder="请输入电脑补贴" />
        </el-form-item>
        <el-form-item label="计件收入" prop="jiansr">
          <el-input v-model="form.jiansr" placeholder="请输入计件收入" />
        </el-form-item>
        <el-form-item label="其他补贴" prop="otherbt">
          <el-input v-model="form.otherbt" placeholder="请输入其他补贴" />
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
import { listHrsalary, getHrsalary, delHrsalary, addHrsalary, updateHrsalary } from "@/api/xinhu-hr/hrsalary";

export default {
  name: "Hrsalary",
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
      // 工资表格数据
      hrsalaryList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        uid: null,
        xuid: null,
        uname: null,
        udeptname: null,
        ranking: null,
        optdt: null,
        optid: null,
        optname: null,
        applydt: null,
        content: null,
        status: null,
        isturn: null,
        month: null,
        base: null,
        money: null,
        mones: null,
        postjt: null,
        skilljt: null,
        travelbt: null,
        telbt: null,
        reward: null,
        punish: null,
        socials: null,
        socialsunit: null,
        taxes: null,
        taxbase: null,
        ispay: null,
        otherzj: null,
        otherjs: null,
        cidao: null,
        cidaos: null,
        zaotui: null,
        zaotuis: null,
        leave: null,
        leaves: null,
        jiaban: null,
        jiabans: null,
        weidk: null,
        weidks: null,
        jxjs: null,
        jxxs: null,
        jxdf: null,
        jtpost: null,
        ysbtime: null,
        zsbtime: null,
        gonggeren: null,
        gongunit: null,
        foodbt: null,
        hotbt: null,
        dnbt: null,
        jiansr: null,
        otherbt: null,
        comid: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        uid: [
          { required: true, message: "用户ID不能为空", trigger: "blur" }
        ],
        xuid: [
          { required: true, message: "X用户ID不能为空", trigger: "blur" }
        ],
        uname: [
          { required: true, message: "对应人不能为空", trigger: "blur" }
        ],
        udeptname: [
          { required: true, message: "对应人员部门不能为空", trigger: "blur" }
        ],
        ranking: [
          { required: true, message: "职位不能为空", trigger: "blur" }
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
        applydt: [
          { required: true, message: "申请日期不能为空", trigger: "blur" }
        ],
        content: [
          { required: true, message: "说明不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "状态不能为空", trigger: "blur" }
        ],
        isturn: [
          { required: true, message: "是否提交不能为空", trigger: "blur" }
        ],
        month: [
          { required: true, message: "月份不能为空", trigger: "blur" }
        ],
        base: [
          { required: true, message: "基本工资不能为空", trigger: "blur" }
        ],
        money: [
          { required: true, message: "实发不能为空", trigger: "blur" }
        ],
        mones: [
          { required: true, message: "应发工资不能为空", trigger: "blur" }
        ],
        postjt: [
          { required: true, message: "职务津贴不能为空", trigger: "blur" }
        ],
        skilljt: [
          { required: true, message: "技能津贴不能为空", trigger: "blur" }
        ],
        travelbt: [
          { required: true, message: "交通补贴不能为空", trigger: "blur" }
        ],
        telbt: [
          { required: true, message: "通信补贴不能为空", trigger: "blur" }
        ],
        reward: [
          { required: true, message: "奖励不能为空", trigger: "blur" }
        ],
        punish: [
          { required: true, message: "处罚不能为空", trigger: "blur" }
        ],
        socials: [
          { required: true, message: "个人社保不能为空", trigger: "blur" }
        ],
        socialsunit: [
          { required: true, message: "单位社保缴费不能为空", trigger: "blur" }
        ],
        taxes: [
          { required: true, message: "个人所得税不能为空", trigger: "blur" }
        ],
        taxbase: [
          { required: true, message: "个税起征点不能为空", trigger: "blur" }
        ],
        ispay: [
          { required: true, message: "是否发放不能为空", trigger: "blur" }
        ],
        otherzj: [
          { required: true, message: "其它增加不能为空", trigger: "blur" }
        ],
        otherjs: [
          { required: true, message: "其它减少不能为空", trigger: "blur" }
        ],
        cidao: [
          { required: true, message: "迟到(次)不能为空", trigger: "blur" }
        ],
        cidaos: [
          { required: true, message: "迟到处罚不能为空", trigger: "blur" }
        ],
        zaotui: [
          { required: true, message: "早退(次)不能为空", trigger: "blur" }
        ],
        zaotuis: [
          { required: true, message: "早退处罚不能为空", trigger: "blur" }
        ],
        leave: [
          { required: true, message: "请假(小时)不能为空", trigger: "blur" }
        ],
        leaves: [
          { required: true, message: "请假减少不能为空", trigger: "blur" }
        ],
        jiaban: [
          { required: true, message: "加班(小时)不能为空", trigger: "blur" }
        ],
        jiabans: [
          { required: true, message: "加班补贴不能为空", trigger: "blur" }
        ],
        weidk: [
          { required: true, message: "未打卡(次)不能为空", trigger: "blur" }
        ],
        weidks: [
          { required: true, message: "未打卡减少不能为空", trigger: "blur" }
        ],
        jxjs: [
          { required: true, message: "绩效基数不能为空", trigger: "blur" }
        ],
        jxxs: [
          { required: true, message: "绩效系数不能为空", trigger: "blur" }
        ],
        jxdf: [
          { required: true, message: "绩效打分不能为空", trigger: "blur" }
        ],
        jtpost: [
          { required: true, message: "绩效收入不能为空", trigger: "blur" }
        ],
        ysbtime: [
          { required: true, message: "应上班天数不能为空", trigger: "blur" }
        ],
        zsbtime: [
          { required: true, message: "已上班天数不能为空", trigger: "blur" }
        ],
        gonggeren: [
          { required: true, message: "公积金个人不能为空", trigger: "blur" }
        ],
        gongunit: [
          { required: true, message: "公积金单位不能为空", trigger: "blur" }
        ],
        foodbt: [
          { required: true, message: "餐补贴不能为空", trigger: "blur" }
        ],
        hotbt: [
          { required: true, message: "高温津贴不能为空", trigger: "blur" }
        ],
        dnbt: [
          { required: true, message: "电脑补贴不能为空", trigger: "blur" }
        ],
        jiansr: [
          { required: true, message: "计件收入不能为空", trigger: "blur" }
        ],
        otherbt: [
          { required: true, message: "其他补贴不能为空", trigger: "blur" }
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
    /** 查询工资列表 */
    getList() {
      this.loading = true;
      listHrsalary(this.queryParams).then(response => {
        this.hrsalaryList = response.rows;
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
        xuid: null,
        uname: null,
        udeptname: null,
        ranking: null,
        optdt: null,
        optid: null,
        optname: null,
        applydt: null,
        content: null,
        status: 0,
        isturn: null,
        month: null,
        base: null,
        money: null,
        mones: null,
        postjt: null,
        skilljt: null,
        travelbt: null,
        telbt: null,
        reward: null,
        punish: null,
        socials: null,
        socialsunit: null,
        taxes: null,
        taxbase: null,
        ispay: null,
        otherzj: null,
        otherjs: null,
        cidao: null,
        cidaos: null,
        zaotui: null,
        zaotuis: null,
        leave: null,
        leaves: null,
        jiaban: null,
        jiabans: null,
        weidk: null,
        weidks: null,
        jxjs: null,
        jxxs: null,
        jxdf: null,
        jtpost: null,
        ysbtime: null,
        zsbtime: null,
        gonggeren: null,
        gongunit: null,
        foodbt: null,
        hotbt: null,
        dnbt: null,
        jiansr: null,
        otherbt: null,
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
      this.title = "添加工资";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getHrsalary(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改工资";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateHrsalary(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addHrsalary(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除工资编号为"' + ids + '"的数据项？').then(function() {
        return delHrsalary(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('xinhu-hr/hrsalary/export', {
        ...this.queryParams
      }, `hrsalary_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
