<template>
  <div class="editor-wrap" :id="id" ref="editor">

  </div>
</template>

<script>

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
  data(){
    return {
      id: 'ue-' + this._uid
    }
  },
  components: {

  },
  watch: {
    initalValue: {
      handler(nval){
        this.setContent()
      }
    }
  },
  mounted(){
    console.log(this);
    this.$nextTick(()=> {
      this.init()
    })
  },
  methods: {
    init() {
      let vm = this;
      ue = UE.getEditor(this.id, {
        serverUrl: window.UEDITOR_SERVERURL,
        imageUrl: window.UEDITOR_IMAGEURL
      });
      //对编辑器的操作最好在编辑器ready之后再做
      ue.ready(()=>{
          //设置编辑器的内容
          ue.setContent('请在此输入');
          //获取html内容，返回: <p>请在此输入</p>
          let html = ue.getContent();
          //获取纯文本内容，返回: 请在此输入
          let txt = ue.getContentTxt();

          ue.body.oninput = ()=> {
            let contentHtml = ue.getContent()
            console.log('inout监听改变:'+ contentHtml);
            vm.$emit('input', contentHtml, 'input')
          }
      });
    },
    getUe(){
      return ue
    },
    setContent(){
      let ue = this.getUe();
      if(ue){
        ue.setContent(this.initalValue);
      }
    }
  },
  destroyed(){
    UE.delEditor(this.id)
  }
}
</script>

<style lang="scss">

</style>