<template>
  <div class="statistical-pain-level statistical-collection">
    <div class="statistical-collection__title">{{$t('mzoStatisticalPainLevel.title')}}</div>
    <p class="statistical-collection__text">
        {{$t('mzoStatisticalPainLevel.description1')}} "{{getPainPlaceName()}}" 
        {{$t('mzoStatisticalPainLevel.description2')}} "{{pain.place_pain_number}}" 
        {{$t('mzoStatisticalPainLevel.description3')}}
    </p>
    <div class="statistical-collection__select">
        <p class="statistical-collection__text">{{$t('mzoStatisticalPainLevel.description4')}}</p>
        <Selection 
            default
            :defaultName="`${painPower.default}`"
            :object="painPower"
        />
    </div>
    <Btn @click="callback($event)" blue :name="$t('mzoStatisticalPainLevel.continueBtn')" class="statistical-collection__button"/>
  </div>
</template>

<script>
import '@/assets/css/statistical-collection.scss'

export default {
    props: ['staticInfoData'],
    data() {
        return{
            painPower: {
                items: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                default: 5,
            },
            localStaticInfoData: this.staticInfoData,
            pain: null
        }
    },
    watch: {
        staticInfoData(newValue){
            this.localStaticInfoData = newValue
        }
    },
    methods: {
        callback(e){
            this.localStaticInfoData.pain = this.pain
            this.localStaticInfoData.pain.place_pain_number = this.painPower.default
            this.$emit('click', this.localStaticInfoData);
        },
        getPainPlaceName(){
            this.pain = !this.$store.state.client.statistic.pain[0].is_setup_second_pain ? this.$store.state.client.statistic.pain[0] : this.$store.state.client.statistic.pain[1]
                   if (this.pain.place == 1) { return this.$nuxt.$t('mzoStatisticalPainLevel.painItem1')
            } else if (this.pain.place == 2) { return this.$nuxt.$t('mzoStatisticalPainLevel.painItem2')
            } else if (this.pain.place == 3) { return this.$nuxt.$t('mzoStatisticalPainLevel.painItem3')
            } else if (this.pain.place == 4) { return this.$nuxt.$t('mzoStatisticalPainLevel.painItem4')
            } else if (this.pain.place == 5) { return this.$nuxt.$t('mzoStatisticalPainLevel.painItem5')
            } else if (this.pain.place == 6) { return this.$nuxt.$t('mzoStatisticalPainLevel.painItem6')
            } else if (this.pain.place == 7) { return this.$nuxt.$t('mzoStatisticalPainLevel.painItem7')
            } else if (this.pain.place == 8) { return this.$nuxt.$t('mzoStatisticalPainLevel.painItem8')
            }
        }
    },
    components: {
        Btn: () => import('@/components/controls/Btn.vue'),
        Selection: () => import('@/components/controls/Selection.vue'),
    }
}
</script>

<style lang="scss">

</style>