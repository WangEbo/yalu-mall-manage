<template> 
  <div>
    <el-upload
      :action="useOss?ossUploadUrl:minioUploadUrl"
      :data="useOss?dataObj:null"
      list-type="picture"
      :multiple="false"
      :show-file-list="showFileList"
      :file-list="fileList"
      :before-upload="beforeUpload"
      :on-remove="handleRemove"
      :on-success="handleUploadSuccess"
      :http-request="httpRequest"
      :on-preview="handlePreview">
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过10MB</div>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="fileList[0].url" alt="">
    </el-dialog>
  </div>
</template>
<script>


  import {policy} from '@/api/oss'
  import store from '@/store'
  import { getToken } from '@/utils/auth'


  function getBody(xhr) {
    var text = xhr.responseText || xhr.response;
    if (!text) {
      return text;
    }

    try {
      return JSON.parse(text);
    } catch (e) {
      return text;
    }
  }

  const BASE_API = process.env.BASE_API;
  export default {
    name: 'singleUpload',
    props: {
      value: String,
      validateProp: {
        type: String
      }
    },
    computed: {
      imageUrl() {
        return this.value;
      },
      imageName() {
        if (this.value != null && this.value !== '') {
          return this.value.substr(this.value.lastIndexOf("/") + 1);
        } else {
          return null;
        }
      },
      fileList() {
        return [{
          name: this.imageName,
          url: this.imageUrl
        }]
      },
      showFileList: {
        get: function () {
          return this.value !== null && this.value !== ''&& this.value!==undefined;
        },
        set: function (newValue) {
        }
      }
    },
    data() {
      return {
        dataObj: {
          policy: '',
          signature: '',
          key: '',
          ossaccessKeyId: '',
          dir: '',
          host: '',
          // callback:'',
        },
        dialogVisible: false,
        useOss: false, //使用oss->true;使用MinIO->false
        ossUploadUrl: 'http://macro-oss.oss-cn-shenzhen.aliyuncs.com',
        minioUploadUrl: BASE_API + 'minio/upload',
        
      };
    },
    methods: {
      emitInput(val) {
        this.$emit('input', val);
        let parent = this.$parent;
        while(parent){
          if(parent.$options.componentName == 'ElForm' && this.validateProp && parent.rules[this.validateProp]){
            parent.validateField(this.validateProp)
            return
          }
          parent = parent.$parent
        }
      },
      handleRemove(file, fileList) {
        this.emitInput('');
      },
      handlePreview(file) {
        this.dialogVisible = true;
      },

      httpRequest: (option)=>  {
        if (typeof XMLHttpRequest === 'undefined') {
          return;
        }

        var xhr = new XMLHttpRequest();
        var action = option.action;

        if (xhr.upload) {
          xhr.upload.onprogress = function progress(e) {
            if (e.total > 0) {
              e.percent = e.loaded / e.total * 100;
            }
            option.onProgress(e);
          };
        }

        var formData = new FormData();

        if (option.data) {
          Object.keys(option.data).forEach(function (key) {
            formData.append(key, option.data[key]);
          });
        }

        formData.append(option.filename, option.file);

        xhr.onerror = function error(e) {
          option.onError(e);
        };

        xhr.onload = function onload() {
          if (xhr.status < 200 || xhr.status >= 300) {
            return option.onError(getError(action, option, xhr));
          }

          option.onSuccess(getBody(xhr));
        };

        xhr.open('post', action, true);

        if (store.getters.token) {
          xhr.setRequestHeader('Authorization', getToken()); //携带token票据
        }

        if (option.withCredentials && 'withCredentials' in xhr) {
          xhr.withCredentials = true;
        }

        var headers = option.headers || {};

        for (var item in headers) {
          if (headers.hasOwnProperty(item) && headers[item] !== null) {
            xhr.setRequestHeader(item, headers[item]);
          }
        }
        xhr.send(formData);
        return xhr;
      },
      beforeUpload(file) {
        let _self = this;
        if(!this.useOss){
          //不使用oss不需要获取策略
          return true;
        }
        return new Promise((resolve, reject) => {
          policy().then(response => {
            _self.dataObj.policy = response.data.policy;
            _self.dataObj.signature = response.data.signature;
            _self.dataObj.ossaccessKeyId = response.data.accessKeyId;
            _self.dataObj.key = response.data.dir + '/${filename}';
            _self.dataObj.dir = response.data.dir;
            _self.dataObj.host = response.data.host;
            // _self.dataObj.callback = response.data.callback;
            resolve(true)
          }).catch(err => {
            console.log(err)
            reject(false)
          })
        })
      },
      handleUploadSuccess(res, file) {
        this.showFileList = true;
        this.fileList.pop();
        let url = this.dataObj.host + '/' + this.dataObj.dir + '/' + file.name;
        if(!this.useOss){
          //不使用oss直接获取图片路径
          url = res.data.url;
        }
        this.fileList.push({name: file.name, url: url});
        this.emitInput(this.fileList[0].url);
      }
    }
  }
</script>
<style lang="scss">
.el-upload-list--picture .el-upload-list__item-thumbnail{
  border-radius: 5px;
  width: auto;
  height: auto;
  max-width: 70px;
  max-height: 70px;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  top: 50%;
  transform: translateY(-50%);
}
</style>


