<template> 
  <div class="add-product-cate">
    <el-button style="float: left;margin: 20px;" type="primary" @click="back">返回</el-button>
    <product-cate-detail :is-edit="false"></product-cate-detail>
  </div>
</template>
<script>
  import ProductCateDetail from './components/ProductCateDetail'
  export default {
    name: 'addProductCate',
    components: { ProductCateDetail },
    methods: {
      back(){
        this.$router.back();
      },
    }
  }
</script>
<style>
</style>


