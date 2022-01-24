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
//照样引入css文件
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";


import Quill from "quill";

var BlockEmbed = Quill.import('blots/block/embed')
class ImageBlot extends BlockEmbed {
  static create(value) {
    let node = super.create();
    node.setAttribute('src', value.url);
    node.setAttribute('controls', value.controls)
    node.setAttribute('width', value.width)
    node.setAttribute('height', value.height)
    return node;
  }

  static value(node) {
    return {
      url: node.getAttribute('src'),
      controls: node.getAttribute('controls'),
      width: node.getAttribute('width'),
      height: node.getAttribute('height')
    }
  }
}
ImageBlot.blotName = 'image';
ImageBlot.tagName = 'img';
Quill.register(ImageBlot)
import request from '@/utils/request'

let quill;
const id = 0;
export default {
  name: 'YEditor',
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
        // [{ 'script': 'sub' }, { 'script': 'super' }], // 上标/下标
        [{ 'indent': '-1' }, { 'indent': '+1' }], // 减少缩进/缩进
        [{ 'direction': 'rtl' }], // 文本方向
        [{ 'size': ['small', false, 'large', 'huge'] }], // 自定义下拉
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'color': [] }, { 'background': [] }], //使用主题的默认下拉
        [{ 'font': [] }],
        [{ 'align': [] }],
        ['clean'], //移除格式化
        ['image'],
        // ['video'],
        // ['formula'] //需要加载cdnjs.cloudflare.com/ajax/libs/KaTeX/0.7.1/katex.min.js
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
      quill.on('text-change', (delta, oldDelta, source)=> {
        this.$emit('input', quill.container.firstChild.innerHTML)

      });

      let toolbar = quill.getModule('toolbar');
      toolbar.addHandler('image', () => {
        document.getElementById('imgData').click();
      });


    },
    updateImg(e) {
      let fileInput = e.target;
      let file = fileInput.files[0];
      var formData = new FormData();
      formData.append('file', file);        //追加的自定义节点，第一个参数：php用$_FILES接收时的key；第2个参数：当前图片
      console.log(formData.get("avatar"));    //打印当前图片的信息

      request({
        url: '/minio/upload',
        method: 'post',
        data: formData,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then(res=> {
        const range = quill.getSelection();
        if (range) {
          let attrs = {
            with: '100%',
            height: 'auto',
            ...res.data
          }
          quill.insertEmbed(range.index, 'image',
            {
              url: res.data.url,
              controls:'controls',
              width:'100%',
              height:'auto'
            }
          ); //将上传好的图片，插入到富文本的range.index（当前光标处）
          const dt = new DataTransfer();
          fileInput.files = dt.files
        }
      })
    },
    setContent(){
      quill.pasteHTML(this.initalValue)
    }
  },
  destroyed() {

  }
}
</script>

<style lang="scss">
.editor-wrap{
  #editor{
    height: 400px;
  }
}

</style>