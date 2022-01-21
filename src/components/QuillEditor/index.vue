<template>
  <div class="editor-wrap" :id="id" ref="editor">
    <div id="editor" class="showContent">
      <!--回显的内容，库中查出来的放这-->
      <!--可以直接在指定元素内加入文本或者html标签-->
      哈哈哈哈
    </div>
    <input type="file" @change="updateImg($event)" id="imgData" style="display: none;">
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
let quill;

const id = 0;
let ue;
export default {
  name: 'Editor',
  props: {
    value: {
      type: String
    },
    initalValue: {
      type: String
    }
  },
  data() {
    return {
      id: 'ue-' + this._uid
    }
  },
  components: {

  },
  watch: {
    initalValue: {
      handler(nval) {
        this.setContent()
      }
    }
  },
  mounted() {
    console.log(this);
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    init() {
      /* 编辑器操作条选项 */
      var toolbarOptions = [
        ['bold', 'italic', 'underline', 'strike'], //开关按钮
        ['blockquote', 'code-block'],
        [{ 'header': 1 }, { 'header': 2 }], //自定义按钮值
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'script': 'sub' }, { 'script': 'super' }], // 上标/下标
        [{ 'indent': '-1' }, { 'indent': '+1' }], // 减少缩进/缩进
        [{ 'direction': 'rtl' }], // 文本方向
        [{ 'size': ['small', false, 'large', 'huge'] }], // 自定义下拉
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'color': [] }, { 'background': [] }], //使用主题的默认下拉
        [{ 'font': [] }],
        [{ 'align': [] }],
        ['clean'], //移除格式化
        ['image'],
        ['video'],
        ['formula'] //需要加载cdnjs.cloudflare.com/ajax/libs/KaTeX/0.7.1/katex.min.js
      ];

      /* 实例化编辑器 */
      quill = new Quill('#editor', {
        /*debug: 'info',*/

        modules: {
          //formula: true, //公式；需要加载cdnjs.cloudflare.com/ajax/libs/KaTeX/0.7.1/katex.min.js
          //syntax: true,  //高亮；需要加载cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/highlight.min.js
          /*toolbar: {
              container:"#editor_header"
          }*/ // 或者 toolbar :'#editor_header'
          toolbar: toolbarOptions  //指定编辑器操作条
        },
        theme: 'snow', //主题，有两种，snow和bubble
        placeholder: '请输入',
        readOnly: false
      });

      //修改样式
      var Align = Quill.import('attributors/style/align');
      Align.whitelist = ['right', 'center', 'justify'];
      Quill.register(Align, true);

      /* 传入布尔值，控制编辑器是否可用 */
      quill.enable();
      //quill.blur(); //失去焦点
      //quill.focus(); //获得焦点



      /* 事件的绑定；注意：text-change这个获取值放这的话是编辑器内容发生改变的时候才能获取到值,如果想每次提交都有值，要放到提交那 */
      quill.on('text-change', function (delta, oldDelta, source) {
        // console.log(delta);             //当前输入的
        // console.log(oldDelta);          //上一次输入的
        // console.log(source);
        //res = quill.container.firstChild.innerHTML; //获取当前富文本编辑器实例的内容（带html标签）
        //console.log(res); 
      });

      /* 自定义按钮 */
      // var myBtn = document.querySelector("#my_button");
      // myBtn.addEventListener("click", function () {
      //   //console.log('my-btn')
      // });

      //【自定义上传图片1】通过addHander来监听image事件
      let toolbar = quill.getModule('toolbar');
      toolbar.addHandler('image', () => {
        document.getElementById('imgData').click();
      });


    },
    //【自定义上传图片2】发送ajax处理好图片
    updateImg(e) {
      let file = e.target.files[0];
      var formData = new FormData();
      formData.append('file', file);        //追加的自定义节点，第一个参数：php用$_FILES接收时的key；第2个参数：当前图片
      console.log(formData.get("avatar"));    //打印当前图片的信息
      $.ajax({                                //发送ajax
        url: '/minio/upload',                        //url
        type: 'post',                        //以post发送
        data: formData,             //要发送的数据。后端接收$_POST['user']
        dataType: 'json',          //返回的数据类型
        cache: false,
        headers: {
          'Authorization': getToken()
        },
        traditional: true,
        contentType: false,
        processData: false,
        success: function (res) {
          console.log(res);
          //图片上传成功之后的回调
          const range = quill.getSelection();
          if (range) {
            let attrs = {
              with: '100%',
              height: 'auto',
              ...res.data
            }
            quill.insertEmbed(range.index, 'image', res.data.url
            // {
            //   url: res.data.url,
            //   controls:'controls',
            //   width:'150px',
            //   height:'50px'
            // }
            /** res.data.url */ 
            ); //将上传好的图片，插入到富文本的range.index（当前光标处）
            
          }
        }
      });
    }
  },
  destroyed() {
    UE.delEditor(this.id)
  }
}
</script>

<style lang="scss">
</style>