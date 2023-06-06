
import { mapState } from 'vuex'

export default {
  props: {
    collectionHandle: String
  },
  computed: {
    ...mapState({
      allCollections: state => state.collections.all
    }),
    collection () {
      return this.allCollections.find(collection => collection.handle === this.collectionHandle)
    }
  },
  mounted () {
    if (!this.collection) {
      this.$store.dispatch('collections/addCollection', this.collectionHandle)
    }
  }
}
