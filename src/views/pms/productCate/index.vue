<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" style="margin-top: 5px"></i>
      <span style="margin-top: 5px">数据列表</span>
      <el-button
        class="btn-add"
        @click="handleAddProductCate()"
        size="mini">
        添加
      </el-button>
    </el-card>
    <div class="opts-bar" style="margin-top: 12px;">
      <el-button v-show="parentIdStack.length > 1" type="primary" @click="back">返回上级</el-button>
    </div>
    <div class="table-container">
      <el-table ref="productCateTable"
                style="width: 100%"
                :data="list"
                v-loading="listLoading" border>
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="分类名称" align="center">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column label="级别" width="100" align="center">
          <template slot-scope="scope">{{scope.row.level | levelFilter}}</template>
        </el-table-column>
        <el-table-column v-if="parentIdStack.length == 1" label="封面图片" align="center" width="300">
          <template style="white-space: nowrap;" slot-scope="scope"><img height="50px" :src="scope.row.coverImg" alt=""></template>
        </el-table-column>
        <!-- <el-table-column label="商品数量" width="100" align="center">
          <template slot-scope="scope">{{scope.row.productCount }}</template>
        </el-table-column> -->
        <!-- <el-table-column label="数量单位" width="100" align="center">
          <template slot-scope="scope">{{scope.row.productUnit }}</template>
        </el-table-column> -->
        <!-- <el-table-column label="导航栏" width="100" align="center">
          <template slot-scope="scope">
            <el-switch
              @change="handleNavStatusChange(scope.$index, scope.row)"
              :active-value="1"
              :inactive-value="0"
              v-model="scope.row.navStatus">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="是否显示" width="100" align="center">
          <template slot-scope="scope">
            <el-switch
              @change="handleShowStatusChange(scope.$index, scope.row)"
              :active-value="1"
              :inactive-value="0"
              v-model="scope.row.showStatus">
            </el-switch>
          </template>
        </el-table-column> -->
        <el-table-column label="排序" width="100" align="center">
          <template slot-scope="scope">{{scope.row.sort }}</template>
        </el-table-column>
        <el-table-column label="设置" width="200"  v-if="parentIdStack.length == 1" align="center">
          <template slot-scope="scope">
            <el-button
              v-show="parentIdStack.length == 1"
              size="mini"
              :disabled="scope.row.level | disableNextLevel"
              @click="handleShowNextLevel(scope.$index, scope.row)">查看下级
            </el-button>
            <!-- <el-button
              size="mini"
              @click="handleTransferProduct(scope.$index, scope.row)">转移商品
            </el-button> -->
          </template>
        </el-table-column>
        <el-table-column label="操作" width="280" align="center">
          <template slot-scope="scope">
            <el-button
              v-show="parentIdStack.length == 1"
              size="mini"
              type="primary"
              @click="openCarouselDailog(scope.$index, scope.row)">设为轮播
            </el-button>
            <el-button
              size="mini"
              @click="handleUpdate(scope.$index, scope.row)">编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :page-size="listQuery.pageSize"
        :page-sizes="[5,10,15]"
        :current-page.sync="listQuery.pageNum"
        :total="total">
      </el-pagination>
    </div>

    <el-dialog :close-on-click-modal="false" :title="'添加轮播图'" :visible.sync="carouselDialogVisible" width="900">
      <el-form :model="carouselDetail" ref="mainForm" :rules="formRules" label-width="150px" size="small">
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
        <el-button type="primary" @click="addToCateCarousel()" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {fetchList,deleteProductCate,updateShowStatus,updateNavStatus} from '@/api/productCate'
  import { addCateCarousel } from '@/api/carousel'

  import SingleUpload from '@/components/Upload/singleUpload'

  let defaultCarouselDetail = {
    pic: null,
    relationId: null,
    sort: null,
    status: null,
  }
  export default {
    name: "productCateList",
    components: { SingleUpload },
    data() {
      return {
        parentIdStack: [0],
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          pageNum: 1,
          pageSize: 5
        },
        parentId: 0,
        carouselDialogVisible: false,
        carouselDetail: Object.assign({}, defaultCarouselDetail),
        formRules: {
          pic: [
            {required: true, message: '请上传图片', trigger: 'blur'},
          ],
        }
      }
    },
    created() {
      this.resetParentId();
      this.getList();
    },
    watch: {
      parentIdStack: {
        handler(nval){
          this.getList()
        }
      }
    },
    methods: {
      back(){
        if(this.parentIdStack.length <= 0) return
        this.parentIdStack.pop()
      },
      resetParentId(){
        this.listQuery.pageNum = 1;
        if (this.$route.query.parentId != null) {
          this.parentId = this.$route.query.parentId;
        } else {
          this.parentId = 0;
        }
      },
      handleAddProductCate() {
        this.$router.push('/pms/addProductCate');
      },
      getList() {
        this.listLoading = true;
        fetchList(this.parentIdStack[this.parentIdStack.length - 1], this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.data.list;
          this.total = response.data.total;
        });
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
      handleNavStatusChange(index, row) {
        let data = new URLSearchParams();
        let ids=[];
        ids.push(row.id)
        data.append('ids',ids);
        data.append('navStatus',row.navStatus);
        updateNavStatus(data).then(response=>{
          this.$message({
            message: '修改成功',
            type: 'success',
            duration: 1000
          });
        });
      },
      handleShowStatusChange(index, row) {
        let data = new URLSearchParams();
        let ids=[];
        ids.push(row.id)
        data.append('ids',ids);
        data.append('showStatus',row.showStatus);
        updateShowStatus(data).then(response=>{
          this.$message({
            message: '修改成功',
            type: 'success',
            duration: 1000
          });
        });
      },
      handleShowNextLevel(index, row) {
        this.parentIdStack.push(row.id)
      },
      handleTransferProduct(index, row) {
        console.log('handleAddProductCate');
      },
      handleUpdate(index, row) {
        this.$router.push({path:'/pms/updateProductCate',query:{id: row.id}});
      },
      handleDelete(index, row) {
        this.$confirm('是否要删除该品牌', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteProductCate(row.id).then(response => {
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 1000
            });
            this.getList();
          });
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
      addToCateCarousel(){
        addCateCarousel(this.carouselDetail).then(response=> {
          this.$message({
            message: '添加成功',
            type: 'success',
            duration: 1000
          });
          this.carouselDialogVisible = false;
        })
      }
    },
    filters: {
      levelFilter(value) {
        if (value === 0) {
          return '一级';
        } else if (value === 1) {
          return '二级';
        }
      },
      disableNextLevel(value) {
        if (value === 0) {
          return false;
        } else {
          return true;
        }
      }
    }
  }
</script>

<style scoped>

</style>
