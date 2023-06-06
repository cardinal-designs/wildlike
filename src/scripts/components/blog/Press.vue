<template lang="pug">
  div
    div.press.js-press
    .press__load-more-buttons(v-if="page_num != total_page")
      button.button.button--primary(@click="loadMore") LOAD MORE
      button.button.button--secondary(@click="loadAll") VIEW ALL
</template>

<script>
  export default {
    name: 'Press',
    props: {
      schema: Object
    },
    mounted () {
      this.getTotalPage();
      this.renderHtml();
    },
    data () {
      return {
        page_num: 1,
        total_page: 1,
        idx: 1,
        total_html: ''
      }
    },
    methods: {
      getTotalPage(){
        const total = this.schema.settings.total;
        if(total > 0) {
          this.total_page = Math.ceil(total / 4);
        }
      },
      renderHtml () {
        fetch(`${this.schema.settings.ajax_url}?view=ajax&page=${this.page_num}`).then(res => res.text()).then(data => {
          let element = document.querySelector('.js-press');
          if (element != null) {
            element.innerHTML = element.innerHTML + data;
          }
        })
      },
      loadMore () {
        this.page_num += 1;
        this.renderHtml();
      },
      loadAll () {
        this.page_num = this.total_page;

        this.idx = 1;
        this.total_html = '';

        this.runRequest(this.idx);
      },

      runRequest (idx) {
        fetch(`${this.schema.settings.ajax_url}?view=ajax&page=${idx}`).then(res => res.text()).then(data => {
          this.total_html += data;

          if (idx != this.total_page) {
            this.idx ++;
            this.runRequest(this.idx);
          } else {
            let element = document.querySelector('.js-press');
            if (element != null) {
              element.innerHTML = '';
              element.innerHTML = this.total_html;
            }
          }
        });
      },
    }
  }
</script>

<style scoped lang="scss">

</style>
