<template>
    <div class="statistics-page">
        <div class="_container">
            <div class="main__breadcrumbs">
                <img src="@/assets/img/svg/breadcrumbs-arrow.svg" alt="small-arrow">
                <nuxt-link :to="localePath(`/trainer/clients`)">
                    {{$t('statistics.backLinkTrainer')}}
                </nuxt-link> 
            </div>
            <ClientPageNav :id="client.id" :title="`${client.first_name} ${client.last_name}`"/>
            <div class="statistics-page__content">
                <div class="statistics-page__calendar">
                    <client-only>
                        <calendar-heatmap 
                            :no-data-text="$t('statistics.noData')" 
                            :tooltip-unit="$t('statistics.unit')" 
                            :values="activeDaysValues" 
                            :end-date="new Date().toLocaleDateString(`en-US`)"
                        />
                    </client-only>
                </div>
                <div class="statistics-page__statistics">
                    <LineChart :chartData="chartDataCondition" :chartOptions="chartOptions" class="line-chart line-chart_condition"/>
                    <LineChart :chartData="chartDataPain" :chartOptions="chartOptions" class="line-chart line-chart_pain"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
if (process.client) require('@/plugins/vue-calendar-heatmap.js')

export default {
    data(){
        return{
            chartOptions: {
                maintainAspectRatio: false,
                responsive: false,
                tooltips: {
                    backgroundColor: '#00055e',
                    titleFontColor: '#ffffff',
                    bodyFontColor: '#ffffff',
                    position: 'nearest',
                    mode: 'nearest',
                    intersect: 0,
                    bodySpacing: 4,
                    xPadding: 20,

                },
            }
        }
    },
    async asyncData({ params, $axios, store }) {
        let token = store.state.userInfo.token
        let client = null
        if(store.state.trainer.current_client){
            client = store.state.trainer.current_client
        } else {
            client = await $axios.$get(`/api/v1/user/get-client/?client_id=${params.client}`, {
                headers: { 'Authorization': `Token ${token}` },
            })
            store.commit('trainer/setClientInfo', client)
        }
        let statistic = await $axios.$get(`/api/v1/user/get-client-statistics/?client_id=${client.id}`, {
            headers: { 'Authorization': `Token ${token}` }
        }) 
        let labels = []
        let condition_feel = []
        let condition_energy = []
        let condition_sleep = []
        let week_number = 0
        for (let i in statistic.condition) {
            condition_feel.push(statistic.condition[i].common_feel)
            condition_energy.push(statistic.condition[i].common_energy)
            condition_sleep.push(statistic.condition[i].common_sleep)
            if(week_number == 0){
                labels.push('Регистрация')
            } else {
                labels.push(`Неделя ${week_number}`)
            }
            week_number += 0.5
        }
        let chartDataCondition = {
            labels: labels,
            datasets: [
                {
                    label: "Общее состояние в %",
                    borderColor: '#55ACFE',
                    borderWidth: 4,
                    pointBackgroundColor: "#55ACFE",
                    pointRadius: 2,
                    pointHoverRadius: 8,
                    fill: false,
                    data: condition_feel
                },
                {
                    label: "Состояние энергии в %",
                    borderColor: '#0DB886',
                    borderWidth: 4,
                    pointBackgroundColor: "#0DB886",
                    pointRadius: 2,
                    pointHoverRadius: 8,
                    fill: false,
                    data: condition_energy
                },
                {
                    label: "Качество сна в %",
                    borderColor: '#e089b0',
                    borderWidth: 4,
                    pointBackgroundColor: "#e089b0",
                    pointRadius: 2,
                    pointHoverRadius: 8,
                    fill: false,
                    data: condition_sleep
                }
            ]
        }

        let pain = []
        for (let i in statistic.pain) {
            if (statistic.pain.length > 1){
                if (statistic.pain[i].is_setup_second_pain == true){
                    continue
                } else {
                    pain.push(statistic.pain[i].place_pain_number)
                }
            } else {
                pain.push(statistic.pain[i].place_pain_number)
            }
        }
        let chartDataPain = {
            labels: labels,
            datasets: [
                {
                    label: "Состояние боли",
                    borderColor: '#D80027',
                    borderWidth: 4,
                    pointBackgroundColor: "#D80027",
                    pointRadius: 2,
                    pointHoverRadius: 8,
                    fill: false,
                    data: pain
                }
            ]
        }

        let activeDaysValues = statistic.complete_exercise
        return {client, token, chartDataCondition, chartDataPain, activeDaysValues}
    },
    methods: {
        
    },
    components: {
        Btn: () => import("@/components/controls/Btn.vue"),
        InputFields: () => import("@/components/controls/Input-fields.vue"),
        ClientPageNav: () => import("@/components/client-page-nav.vue"),
        LineChart: () => import(`@/components/charts/LineChart.vue`),
    }
}
</script>

<style lang="scss">
.statistics-page{
    &__content{
        display: block;
    }
    &__calendar{
        display: flex;
        border-bottom: 2px solid #EBEBEB;
        padding-bottom: 30px;
        margin-bottom: 30px;
        .vch__legend__wrapper{
            transform: translate(565px, 100px);
        }
    }
    &__statistics{
        display: flex;
        .line-chart{
            width: 400px;
            height: 400px;
        }
        .line-chart_condition{
            margin-right: 50px;
        }
    }
}

@media (max-width: 992px){
    .statistics-page{
        &__calendar{
            height: 100% !important;
            overflow: hidden !important;
            align-items: flex-end !important;
            display: flex !important;
            text-align: center !important;
            flex-direction: column !important;
            svg{
                width: 900px;
                height: 200px;
                overflow: hidden;
            }
        }
        &__statistics{
            display: block;
            .line-chart{
                width: 100%;
                height: 100%;
                &_condition{
                    margin-right: 0;
                    margin-bottom: 50px;
                }
            }
        }
    }
}
</style>