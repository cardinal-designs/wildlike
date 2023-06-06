<template lang="pug">
  .fifty-fifty-booking-container(:class="schema.settings.backgroundColor")
    fifty-fifty-booking-static.fifty-fifty-booking(
      v-for="(block, index) in schema.blocks"
      :key="block.id"
      :schema="block"
      :index="index"
    )
</template>

<script>
import FiftyFiftyBookingStatic from './FiftyFiftyBookingStatic.vue';

export default {
  name: "FiftyFiftyBookingContainerStatic",
  components: {
    FiftyFiftyBookingStatic
  },
  props: {
    schema: Object,
  },
}
</script>
