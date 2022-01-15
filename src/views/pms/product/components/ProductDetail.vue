<template> 
  <el-card class="form-container" shadow="never">
    <product-info-detail
      v-model="productParam"
      :is-edit="isEdit">
    </product-info-detail>
    <div class="opt-bar" style="text-align: center;">
      <el-button type="primary" size="medium" style="margin: 0 auto" @click="finishCommit">提交商品</el-button>
    </div>
  </el-card>
</template>
<script>
  import {createProduct,getProduct,updateProduct} from '@/api/product';
  import ProductInfoDetail from './ProductInfoDetail';

  const defaultProductParam = {
    keywords: '',
    name: '',
    pic: '',
    price: 0,
    productCategoryId: null,
    productCategoryName: '',
    recommandStatus: 0,
    sort: 0,
  };
  export default {
    name: 'ProductDetail',
    components: { ProductInfoDetail },
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        productParam: Object.assign({}, defaultProductParam),
      }
    },
    created(){
      if(this.isEdit){
        getProduct(this.$route.query.id).then(response=>{
          this.productParam = response.data;
        });
      }
    },
    methods: {
      finishCommit() {
        this.$confirm('是否要提交该产品', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if(this.isEdit){
            updateProduct(this.$route.query.id,this.productParam).then(response=>{
              this.$message({
                type: 'success',
                message: '提交成功',
                duration:1000
              });
              this.$router.back();
            });
          }else{
            createProduct(this.productParam).then(response=>{
              this.$message({
                type: 'success',
                message: '提交成功',
                duration:1000
              });
              // location.reload();
            });
          }
        })
      }
    }
  }
</script>
<style>
  .form-container {
    width: 800px;
  }
</style>


