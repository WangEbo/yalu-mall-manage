<template>
  <!-- 通用设置 -->
  <div class="app-container">
    <el-form class="setting-form" :model="detail" :rules="rules" ref="productInfoForm" :disabled="formDisabled" label-width="120px" style="width: 600px" size="small">
      <el-form-item label="logo：" prop="logo">
        <el-input v-model="detail.logo"></el-input>
        <!-- <single-upload v-model="detail.logo" style="width: 300px;display: inline-block;margin-left: 10px"></single-upload> todo-->
      </el-form-item>
      <el-form-item label="团队定制信息：" prop="teamOrderInfo">
        <el-input v-model="detail.teamOrderInfo"></el-input>
      </el-form-item>
      <el-form-item label="QQ客服：" prop="qq">
        <el-input v-model="detail.qq"></el-input>
      </el-form-item>
      <el-form-item label="邮编：" prop="zipCode">
        <el-input v-model="detail.zipCode"></el-input>
      </el-form-item>
      <el-form-item label="工作时间：" prop="workingTime">
        <el-input v-model="detail.workingTime"></el-input>
      </el-form-item>
      <el-form-item label="全国服务热线：" prop="telephone">
        <el-input v-model="detail.telephone"></el-input>
      </el-form-item>
      <el-form-item label="地址：" prop="address">
        <el-input v-model="detail.address"></el-input>
      </el-form-item>
      <el-form-item label="校园招聘：" prop="campusHire">
        <el-input v-model="detail.campusHire"></el-input>
      </el-form-item>
      <el-form-item label="购物平台：" prop="shoppingPlatform">
        <el-input v-model="detail.shoppingPlatform"></el-input>
      </el-form-item>
      <el-form-item label="微博链接：" prop="weiboLink">
        <el-input v-model="detail.weiboLink"></el-input>
      </el-form-item>
      <el-form-item label="微信二维码：" prop="wechatQr">
        <el-input v-model="detail.wechatQr"></el-input>
        <!-- <el-input v-model="detail.weight" style="width: 300px"></el-input>
        <span style="margin-left: 20px">克</span> -->
      </el-form-item>
    </el-form>
    <div class="opt-btns">
      <el-button v-show="formDisabled" @click.stop="formDisabled = false" type="primary" >编辑</el-button>
      <el-button v-show="!formDisabled" @click.stop="submit" type="primary" >更新</el-button>
    </div>
  </div>
</template>

<script>
import SingleUpload from '@/components/Upload/singleUpload'
import { getSetting, setSetting } from '../../api/set'

export default {
  components: {SingleUpload },
  data(){
    return {
      detail: {},
      formDisabled: true,
      rules: {
        logo: [
          {required: true, message: '请输入商品名称', trigger: 'blur'},
          {min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur'}
        ],
      }
    }
  },
  created(){
    this.getDetail()
  },
  mounted(){

  },
  methods: {
    getDetail(){
      getSetting().then(res=> {
        this.$set(this, 'detail', res.data)
      })
    },
    edit(){

    },
    submit(){
      setSetting(this.detail).then(res=> {
        this.formDisabled = true;
        this.$message.success('更新成功')
      })
    }
    
  }
}
</script>

<style lang="scss">
.setting-form{
  margin: 0 auto;
  
}
.opt-btns{
  text-align: center;
}
</style>