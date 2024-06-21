<template>
  <div class="statistical-status statistical-collection">
    <div class="statistical-collection__title">{{$t('mzoStatisticalStatus.title')}}</div>
    <div class="statistical-collection__select">
        <p class="statistical-collection__text long">{{$t('mzoStatisticalStatus.condition')}}</p>
        <Selection 
            default
            :defaultName="`${generalCondition.default}`"
            :object="generalCondition"
        />
    </div>
    <div class="statistical-collection__select">
        <p class="statistical-collection__text long">{{$t('mzoStatisticalStatus.energy')}}</p>
        <Selection 
            default
            :defaultName="`${energyCondition.default}`"
            :object="energyCondition"
        />
    </div>
    <div class="statistical-collection__select">
        <p class="statistical-collection__text long">{{$t('mzoStatisticalStatus.sleep')}}</p>
        <Selection 
            default
            :defaultName="`${sleepCondition.default}`"
            :object="sleepCondition"
        />
    </div>
    <Btn @click="callback($event)" blue :name="$t('mzoStatisticalStatus.continueBtn')" class="statistical-collection__button"/>
  </div>
</template>

<script>
import '@/assets/css/statistical-collection.scss'

export default {
    props: ['staticInfoData'],
    data() {
        return{
            generalCondition: {
                items: [
                    0, 5, 10, 15, 20, 25, 
                    30, 35, 40, 45, 50, 55, 
                    60, 65, 70, 75, 80, 85, 
                    90, 95, 100
                ],
                default: 50
            },
            energyCondition: {
                items: [
                    0, 5, 10, 15, 20, 25, 
                    30, 35, 40, 45, 50, 55, 
                    60, 65, 70, 75, 80, 85, 
                    90, 95, 100
                ],
                default: 50
            },
            sleepCondition: {
                items: [
                    0, 5, 10, 15, 20, 25, 
                    30, 35, 40, 45, 50, 55, 
                    60, 65, 70, 75, 80, 85, 
                    90, 95, 100
                ],
                default: 50
            },
            localStaticInfoData: this.staticInfoData
        }
    },
    watch: {
        staticInfoData(newValue){
            this.localStaticInfoData = newValue
        }
    },
    methods: {
        callback(e){
            this.localStaticInfoData.condition = this.$store.state.client.statistic.condition.at(-1)
            this.localStaticInfoData.condition.common_feel = this.generalCondition.default
            this.localStaticInfoData.condition.common_energy = this.energyCondition.default
            this.localStaticInfoData.condition.common_sleep = this.sleepCondition.default
            this.$emit('click', this.localStaticInfoData);
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