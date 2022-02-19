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
        <el-table-column label="标题" align="center" width="200" >
          <template slot-scope="scope">{{scope.row.title}}</template>
        </el-table-column>
         <el-table-column label="资讯时间" align="center" width="200" >
          <template slot-scope="scope">{{scope.row.createTime}}</template>
        </el-table-column>
         <el-table-column label="封面图片" align="center" width="200" >
           <template style="white-space: nowrap;" slot-scope="scope"><img height="50px" :src="scope.row.coverImg" alt=""></template>
        </el-table-column>
         <el-table-column label="简介" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.intro}}</template>
        </el-table-column>
        <el-table-column label="操作" width="280" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="openCarouselDailog(scope.$index, scope.row)">设为轮播
            </el-button>
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
    <el-dialog :close-on-click-modal="false" :title="isEdit?'编辑资讯':'添加资讯'" :visible.sync="dialogVisible" width="900">
      <el-form :model="curDetail" ref="mainForm" :rules="formRules" label-width="150px" size="small">
         <el-form-item label="标题：" prop="title">
          <el-input v-model="curDetail.title" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="资讯时间：" prop="createTime">
          <el-date-picker
            v-model="curDetail.createTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择资讯时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="排序：" prop="sort">
          <el-input v-model="curDetail.sort" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="封面图片：" prop="coverImg" :class="[]">
          <single-upload v-model="curDetail.coverImg" style="width: 300px;display: inline-block;margin-left: 10px"></single-upload>
        </el-form-item>
        <el-form-item label="简介：" prop="intro">
          <el-input type="textarea" class="input-content"  :autosize="{ minRows: 3, maxRows: 8}" v-model="curDetail.intro" style="width: 500px;"></el-input>
        </el-form-item>
        <el-form-item label="详情：" prop="content">
          <YEditor :initalValue="curDetail.initalContent"  v-model="curDetail.content"  @input="editorChange"></YEditor>
        </el-form-item>
        
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm()" size="small">确 定</el-button>
      </span>
    </el-dialog>


    <el-dialog :close-on-click-modal="false" :title="'添加轮播图'" :visible.sync="carouselDialogVisible" width="900">
      <el-form :model="carouselDetail" ref="carouselForm" :rules="carouselFormRules" label-width="150px" size="small">
        <el-form-item label="图片：" prop="pic" :class="[]">
          <single-upload :disabled="true" v-model="carouselDetail.pic" style="width: 300px;display: inline-block;margin-left: 10px"></single-upload>
        </el-form-item>
        <el-form-item label="排序：" prop="sort">
          <el-input v-model="carouselDetail.sort" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="商品推荐：">
          <el-switch
            v-model="carouselDetail.status"
            :active-value="1"
            :active-text="'上线'"
            :inactive-value="0"
            :inactive-text="'下线'">
          </el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="carouselDialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="addToNewsCarousel()" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import SingleUpload from '@/components/Upload/singleUpload'

import { addnewsCarousel } from '@/api/carousel'
import { addNews, delNews, newsList, updateNews, getNewsById, } from '@/api/news'
import { formatDate } from '@/utils/date';
import YEditor from '@/components/YEditor'

const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
  keyword: null
};
const defaultNews = {
  title: null,
  createTime: null,
  coverImg: null,
  intro: null,
  content: null,
  initalContent: '请输入内容',
  sort: null,
};

let defaultCarouselDetail = {
  pic: null,
  relationId: null,
  sort: null,
  status: null,
}
export default {
  name: 'adminList',
  components: {SingleUpload, YEditor},
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
      curDetail: defaultNews,
      carouselDetail: Object.assign({}, defaultCarouselDetail),
      carouselDialogVisible: false,
      formRules: {
        title:  {required: true, trigger: 'blur', message: '请输入标题'},
        createTime:  {required: true, trigger: 'blur', message: '请输入资讯时间'},
        coverImg: [
          {required: true, message: '请上传封面图片', trigger: 'blur'},
        ],
        intro:  [
          {required: true, trigger: 'blur', message: '请输入简介'},
          {min: 2, max: 5000, message: '长度在 2 到 5000 个字符', trigger: 'blur'}
        ],
        content:  [
          {required: true, trigger: 'blur', message: '请输入详情'},
          {min: 2, max: 5000, message: '长度在 2 到 1000 个字符', trigger: 'blur'}
        ],
      },
      carouselFormRules: {
        pic: [
          {required: true, message: '请上传图片', trigger: 'blur'},
        ],
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
      this.curDetail = Object.assign({}, defaultNews);
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
        delNews(row.id).then(response => {
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
      getNewsById(row.id).then(res=> {
        this.curDetail = Object.assign({}, {
          ...res.data,
          initalContent: res.data.content
        });
        this.$nextTick(()=> {
          this.$refs.mainForm.clearValidate()
        })
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
              updateNews(this.curDetail.id, this.curDetail).then(response => {
                this.$message({
                  message: '修改成功！',
                  type: 'success'
                });
                this.dialogVisible = false;
                this.getList();
              })
            } else {
              addNews(this.curDetail).then(response => {
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
    editorChange(contentHmtl, eventName) {
      this.curDetail.content = contentHmtl;
      console.log(eventName);
    },
    getList() {
      this.listLoading = true;
      newsList(this.listQuery).then(response => {
        this.listLoading = false;
        this.list = response.data.list;
        this.total = response.data.total
      });
    },
    openCarouselDailog(index, row){
      this.carouselDialogVisible = true;
      this.carouselDetail = Object.assign({}, defaultCarouselDetail, {
        relationId: row.id,
        pic: row.coverImg
      });
      this.$nextTick(()=> {
        this.$refs.mainForm.clearValidate()
      })
    },
    addToNewsCarousel(){
      addnewsCarousel(this.carouselDetail).then(response=> {
        this.$message({
          message: '添加成功',
          type: 'success',
          duration: 1000
        });
        this.carouselDialogVisible = false;
      })
    }
  }
}
</script>

<style lang="scss">

</style>