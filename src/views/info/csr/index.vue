<template>
  <!-- 概况 -->
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button style="float:right" type="primary" @click="handleSearchList()" size="small">
          查询搜索
        </el-button>
        <el-button style="float:right;margin-right: 15px" @click="handleResetSearch()" size="small">
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="输入搜索：">
            <el-input v-model="listQuery.keyword" @keydown.native.enter="handleSearchList" class="input-width" placeholder="请输入关键词" clearable></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button size="mini" class="btn-add" @click="handleAdd()" style="margin-left: 20px">添加</el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="adminTable" :data="list" style="width: 100%;" v-loading="listLoading" border>
        <el-table-column label="标题" align="center" width="200" >
          <template slot-scope="scope">{{scope.row.title}}</template>
        </el-table-column>
        <el-table-column label="图片" align="center"   width="300">
          <template slot-scope="scope"><img height="30px" :src="scope.row.imgUrl" alt=""></template>
        </el-table-column>
        <el-table-column label="内容" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.content}}</template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleUpdate(scope.$index, scope.row)">
              编辑
            </el-button>
            <el-button size="mini" type="text" @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total, sizes,prev, pager, next,jumper" :current-page.sync="listQuery.pageNum" :page-size="listQuery.pageSize" :page-sizes="[10,15,20]" :total="total">
      </el-pagination>
    </div>
    <el-dialog :title="isEdit?'编辑用户':'添加用户'" :visible.sync="dialogVisible" width="900">
      <el-form :model="curDetail" ref="adminForm" label-width="150px" size="small">
        <el-form-item label="标题：">
          <el-input v-model="curDetail.title" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="图片：" prop="im" :class="[formDisabled ? 'form-item-logo-disabled' : 'form-item-logo']">
        <single-upload v-model="curDetail.imgUrl" style="width: 300px;display: inline-block;margin-left: 10px"></single-upload>
      </el-form-item>
        <el-form-item label="内容：">
          <el-input type="textarea" class="input-content"  :autosize="{ minRows: 8, maxRows: 8}" v-model="curDetail.content" style="width: 500px;min-height: 200px"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm()" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import SingleUpload from '@/components/Upload/singleUpload'

import { addCsr, delCsr, csrList, updateCsr, getCsrById, } from '@/api/csr'
import { formatDate } from '@/utils/date';

const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
  keyword: null
};
const defaultCsr = {
  title: null,
  imgUrl: null,
  content: null,
};
export default {
  name: 'adminList',
  components: {SingleUpload},
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      list: null,
      total: null,
      listLoading: false,
      dialogVisible: false,
      isEdit: false,
      allocDialogVisible: false,
      allocRoleIds: [],
      dataList: [],
      allocAdminId: null,
      formDisabled: true,
      curDetail: defaultCsr,
      formRules: {
        title:  {required: true, trigger: 'blur', message: '请输入标题'},
        imgUrl: [
          {required: true, message: '请输入商品名称', trigger: 'blur'},
        ],
        content:  [
          {required: true, trigger: 'blur', message: '请输内容'},
          {min: 2, max: 5000, message: '长度在 2 到 5000 个字符', trigger: 'blur'}
        ]
      }
    }
  },
  created() {
    this.getList();
  },
  filters: {
    formatDateTime(time) {
      if (time == null || time === '') {
        return 'N/A';
      }
      let date = new Date(time);
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    }
  },
  methods: {
    handleResetSearch() {
      this.listQuery = Object.assign({}, defaultListQuery);
    },
    handleSearchList() {
      this.listQuery.pageNum = 1;
      this.getList();
    },
    handleSizeChange(val) {
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.getList();
    },
    handleAdd() {
      this.dialogVisible = true;
      this.isEdit = false;
      this.curDetail = Object.assign({}, defaultCsr);
    },
    handleDelete(index, row) {
      this.$confirm('是否要删除该用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delCsr(row.id).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getList();
        });
      });
    },
    handleUpdate(index, row) {
      this.dialogVisible = true;
      this.isEdit = true;
      this.curDetail = Object.assign({}, row);
    },
    handleDialogConfirm() {
      this.$confirm('是否要确认?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.isEdit) {
          updateCsr(this.curDetail.id, this.curDetail).then(response => {
            this.$message({
              message: '修改成功！',
              type: 'success'
            });
            this.dialogVisible = false;
            this.getList();
          })
        } else {
          addCsr(this.curDetail).then(response => {
            this.$message({
              message: '添加成功！',
              type: 'success'
            });
            this.dialogVisible = false;
            this.getList();
          })
        }
      })
    },
    getList() {
      this.listLoading = true;
      csrList(this.listQuery).then(response => {
        this.listLoading = false;
        this.list = response.data;
        this.total = response.data && response.data.length;
      });
    },
  }
}
</script>

<style lang="scss">

</style>