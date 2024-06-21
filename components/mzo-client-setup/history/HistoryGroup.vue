<template>
  <div class="account-setup-group">
    <Introductions v-if="step == 0" :max_step="max_step" @changePage="changePage($event)"/>
    <YourInfo v-if="step == 1" @changePage="changePage($event)"/>
    <YourCondition v-if="step == 2" @changePage="changePage($event)"/>
    <PainInfo v-if="step == 3" @changePage="changePage($event)"/>
  </div>
</template>

<script>
export default {
    props: {
      current_step: {
        type: Number,
        required: true
      },
      max_step: {
        type: Number,
        required: true
      }
    },
    data () {
      return{
        step: this.current_step,
        local_max_step: this.max_step
      }
    },
    watch: {
      current_step(newValue){
        this.step = newValue
      },
      max_step(newValue){
        this.local_max_step = newValue
      }
    },
    methods: {
      changePage(e){
        this.step = e
        if (this.local_max_step < e){
          this.local_max_step = e
        }
        this.$emit('changePage', e)
      }
    },
    components: {
      Introductions: () => import(`~/components/mzo-client-setup/history/Introductions.vue`),
      YourInfo: () => import(`~/components/mzo-client-setup/history/YourInfo.vue`),
      YourCondition: () => import(`~/components/mzo-client-setup/history/YourCondition.vue`),
      PainInfo: () => import(`~/components/mzo-client-setup/history/PainInfo.vue`),
    }
}
</script>