<template>
    <div class="wrapper">
        <div class="popup-statistical-group" :class="{'popup-statistical-group_small': statisticalPage == 1}">
            <StatisticalCongratulations 
                v-if="statisticalPage == 1"
                :completeTimes="localCompleteTimes"
                @click="changePage($event, 2)"
            />
            <StatisticalPainLevel 
                v-if="statisticalPage == 2"
                :staticInfoData="staticInfoData"
                @click="changePage($event, 3)"
            />
            <StatisticalStatus 
                v-if="statisticalPage == 3"
                :staticInfoData="staticInfoData"
                @click="changePage($event, 4)"
            />
            <StatisticalResults 
                v-if="statisticalPage == 4"
                :staticInfoData="staticInfoData"
                @click="changePage($event, 5)"
            />
            <StatisticalAllDone v-if="statisticalPage == 5" @complete="completeQutions()"/>
        </div>
    </div>
</template>

<script>
export default {
    props: ['completeTimes'],
    data() {
        return{
            staticInfoData: {},
            statisticalPage: 1,
            localCompleteTimes: this.completeTimes
        }
    },
    watch: {
        completeTimes(newValue){
            this.localCompleteTimes = newValue
        }
    },
    methods: {
        closeWindow(){
            this.$emit("close");
        },
        async changePage(e, page){
            this.staticInfoData = e
            if(this.statisticalPage == 4){
                let params = {
                    pain_place: this.staticInfoData.pain.place,
                    place_pain_number: parseInt(this.staticInfoData.pain.place_pain_number),
                    common_feel: parseInt(this.staticInfoData.condition.common_feel),
                    common_energy: parseInt(this.staticInfoData.condition.common_energy),
                    common_sleep: parseInt(this.staticInfoData.condition.common_sleep),
                }
                await this.$axios.$post('/api/v1/user/set-client-statistics/', params, { 
                    headers: { Authorization: `Token ${this.$store.state.userInfo.token}` } 
                })
            }
            this.statisticalPage = page
        },
        completeQutions(){
            this.$emit("complete");
        }
    },
    components: {
        StatisticalCongratulations: () => import(`@/components/statistical-collection/StatisticalCongratulations.vue`),
        StatisticalPainLevel: () => import(`@/components/statistical-collection/StatisticalPainLevel.vue`),
        StatisticalStatus: () => import(`@/components/statistical-collection/StatisticalStatus.vue`),
        StatisticalResults: () => import(`@/components/statistical-collection/StatisticalResults.vue`),
        StatisticalAllDone: () => import(`@/components/statistical-collection/StatisticalAllDone.vue`)
    }
}
</script>

<style lang="scss">
.popup-statistical-group{
    overflow: visible;
    position: relative;
    background: $white;
    padding: 15px 25px 25px 25px;
    width: 900px;
    max-height: 80vh;
    border-radius: 10px;
    &_small{
        width: fit-content;
    }
}

@media (max-width: 768px){
    .popup-statistical-group{
        border-radius: 0;
        width: 100vw;
        height: 100vh;
        min-width: 100vw;
        min-height: 100vh;
    }
}
</style>