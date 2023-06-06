<template lang="pug">
  .fifty-fifty-booking-container(:class="schema.settings.backgroundColor")
    fifty-fifty-booking.fifty-fifty-booking(
      v-for="(block, index) in schema.blocks"
      :key="block.id"
      :schema="block"
      :index="index"
      :popupHeader="schema.settings.popupHeader"
      :popupDescription="schema.settings.popupDescription"
    )
</template>

<script>
import FiftyFiftyBooking from './FiftyFiftyBooking.vue';

export default {
  name: "FiftyFiftyBookingContainer",
  components: {
    FiftyFiftyBooking
  },
  props: {
    schema: Object,
  },
}
</script>

<style lang="scss">

</style>
