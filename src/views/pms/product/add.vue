<template> 
  <div>
    <el-button style="float: left;margin: 20px;" type="primary" @click="back">返回</el-button>
    <product-detail :is-edit='false'></product-detail>
  </div>
</template>
<script>
  import ProductDetail from './components/ProductDetail'
  export default {
    name: 'addProduct',
    components: { ProductDetail },
    methods: {
      back(){
        this.$router.push('/pms/product');
      },
    }
  }
</script>
<style>
</style>
