<template>
  <div style="margin-top: 50px">
    <el-form :model="value" :rules="rules" @submit.stop.prevent ref="productInfoForm" label-width="120px" style="width: 600px" size="small">
      <el-form-item label="商品分类：" prop="productCategoryId">
        <el-cascader
          v-model="selectProductCateValue"
          :options="productCateOptions">
        </el-cascader>
      </el-form-item>
      <el-form-item label="商品名称：" prop="name">
        <el-input v-model="value.name"></el-input>
      </el-form-item>
      <el-form-item label="图片：" prop="pic" >
        <single-upload v-model="value.pic" style="width: 300px;display: inline-block;margin-left: 10px"></single-upload>
      </el-form-item>
      <el-form-item label="颜色：" prop="color">
          <color-picker v-model="value.color"></color-picker>
      </el-form-item>
      <el-form-item label="商品售价：" prop="price">
        <el-input v-model="value.price"></el-input>
      </el-form-item>
      <el-form-item label="平台销售链接：" prop="url">
        <el-input v-model="value.url"></el-input>
      </el-form-item>
      <el-form-item label="关键词：" prop="keywords" >
        <el-input v-model="value.keywords"></el-input>
      </el-form-item>
      <el-form-item label="商品推荐：">
        <!-- <span style="margin-right: 10px">新品</span>
        <el-switch
          v-model="value.newStatus"
          :active-value="1"
          :inactive-value="0">
        </el-switch> -->
        <span style="margin-left: 10px;margin-right: 10px">推荐</span>
        <el-switch
          v-model="value.recommandStatus"
          :active-value="1"
          :inactive-value="0">
        </el-switch>
      </el-form-item>
      <el-form-item label="排序">
        <el-input v-model="value.sort"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {fetchListWithChildren} from '@/api/productCate'
  import SingleUpload from '@/components/Upload/singleUpload'
  import ColorPicker from './ColorPicker'

  export default {
    name: "ProductInfoDetail",
    components: { SingleUpload, ColorPicker },
    props: {
      value: {
        type: Object,

      },
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        hasEditCreated:false,
        //选中商品分类的值
        selectProductCateValue: [],
        productCateOptions: [],
        rules: {
          productCategoryId: [
            {required: true, trigger: 'blur', message: '请选择商品类型'},
          ],
          name: [
            {required: true, trigger: 'blur', message: '请输入商品名称'},
          ],
          pic: [
            {required: true, trigger: 'blur', message: '请上传商品图片'},
          ],
          url: [
            {required: true, trigger: 'blur', message: '请输入平台销售链接'},
          ],
          price: [
            {required: true, trigger: 'blur', message: '请输入售价'},
          ],
        }
      };
    },
    created() {
      this.getProductCateList();
    },
    computed:{
      //商品的编号
      productId(){
        return this.value.id;
      }
    },
    watch: {
      productId:function(newValue){
        if(!this.isEdit)return;
        if(this.hasEditCreated)return;
        if(newValue===undefined||newValue==null||newValue===0)return;
        this.handleEditCreated();
      },
      selectProductCateValue: function (newValue) {
        if (newValue != null && newValue.length === 2) {
          this.value.productCategoryId = newValue[1];
          this.value.productCategoryName= this.getCateNameById(this.value.productCategoryId);
        } else {
          this.value.productCategoryId = null;
          this.value.productCategoryName=null;
        }
      }
    },
    methods: {
      //处理编辑逻辑
      handleEditCreated(){
        if(this.value.productCategoryId!=null){
          this.selectProductCateValue.push(this.value.cateParentId);
          this.selectProductCateValue.push(this.value.productCategoryId);
        }
        this.hasEditCreated=true;
      },
      getProductCateList() {
        fetchListWithChildren().then(response => {
          let list = response.data;
          this.productCateOptions = [];
          for (let i = 0; i < list.length; i++) {
            let children = [];
            if (list[i].children != null && list[i].children.length > 0) {
              for (let j = 0; j < list[i].children.length; j++) {
                children.push({label: list[i].children[j].name, value: list[i].children[j].id});
              }
            }
            this.productCateOptions.push({label: list[i].name, value: list[i].id, children: children});
          }
        });
      },
      getCateNameById(id){
        let name=null;
        for(let i=0;i<this.productCateOptions.length;i++){
          for(let j=0;j<this.productCateOptions[i].children.length;j++){
            if(this.productCateOptions[i].children[j].value===id){
              name=this.productCateOptions[i].children[j].label;
              return name;
            }
          }
        }
        return name;
      },
    }
  }
</script>

<style scoped>
</style>
