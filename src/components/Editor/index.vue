<template>
  <div class="editor-wrap" :id="id" ref="editor">

  </div>
</template>

<script>

const id = 0;
let ue;
export default {
  name: 'Editor',
  data(){
    return {
      id: 'ue-' + this._uid
    }
  },
  components: {

  },
  mounted(){
    console.log(this);
    this.$nextTick(()=> {
      this.init()
    })
  },
  methods: {
    init() {
      ue = UE.getEditor(this.id, {
        serverUrl: window.UEDITOR_SERVERURL,
        imageUrl: window.UEDITOR_IMAGEURL
      });
      //对编辑器的操作最好在编辑器ready之后再做
      ue.ready(function() {
          //设置编辑器的内容
          ue.setContent('请在此输入');
          //获取html内容，返回: <p>请在此输入</p>
          var html = ue.getContent();
          //获取纯文本内容，返回: 请在此输入
          var txt = ue.getContentTxt();
      });
    },
    getUe(){
      return ue
    }
  },
  destroyed(){
    UE.delEditor(this.id)
  }
}
</script>

<style lang="scss">
.editor-wrap{
  height: 400px;
}
</style>