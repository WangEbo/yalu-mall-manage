<template>
  <!-- 品牌历程 -->
  <div class="app-container brand">
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
        <el-table-column label="事件时间" align="center" width="200" >
          <template slot-scope="scope">{{scope.row.eventTime}}</template>
        </el-table-column>
        <el-table-column label="事件内容" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.eventContent}}</template>
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
    <el-dialog :close-on-click-modal="false" :title="isEdit?'编辑历程':'添加历程'" :visible.sync="dialogVisible" width="900">
      <el-form :model="curDetail" ref="mainForm" :rules="formRules" label-width="150px" size="small">
        <el-form-item label="事件时间：" prop="eventTime">
          <el-date-picker
            v-model="curDetail.eventTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择事件时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="事件内容：" prop="eventContent">
          <el-input type="textarea" class="input-content"  :autosize="{ minRows: 8, maxRows: 8}" v-model="curDetail.eventContent" style="width: 500px;"></el-input>
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

import { addHistory, delHistory, historyList, updateHistory, getHistoryById, } from '@/api/history'
import { formatDate } from '@/utils/date';

const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
  keyword: null
};
const defaultHistory = {
  eventTime: null,
  eventContent: null,
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
      dataList: [],
      formDisabled: true,
      curDetail: defaultHistory,
      formRules: {
        eventTime:  {required: true, trigger: 'blur', message: '请输入事件时间'},
        eventContent:  [
          {required: true, trigger: 'blur', message: '请输入事件内容'},
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
      this.curDetail = Object.assign({}, defaultHistory);
      this.$nextTick(()=> {
        this.$refs.mainForm.clearValidate()
      })
    },
    handleDelete(index, row) {
      this.$confirm('是否要删除该用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delHistory(row.id).then(response => {
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
      this.$nextTick(()=> {
        this.$refs.mainForm.clearValidate()
      })
    },
    handleDialogConfirm() {
      this.$refs.mainForm.validate(valid=> {
        if(valid){
          this.$confirm('是否要确认?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            if (this.isEdit) {
              updateHistory(this.curDetail.id, this.curDetail).then(response => {
                this.$message({
                  message: '修改成功！',
                  type: 'success'
                });
                this.dialogVisible = false;
                this.getList();
              })
            } else {
              addHistory(this.curDetail).then(response => {
                this.$message({
                  message: '添加成功！',
                  type: 'success'
                });
                this.dialogVisible = false;
                this.getList();
              })
            }
          })
        }
      })
    },
    getList() {
      this.listLoading = true;
      historyList(this.listQuery).then(response => {
        this.listLoading = false;
        this.list = response.data.list;
        this.total = response.data.total
      });
    },
  }
}
</script>

<style lang="scss">

</style>