<template>
    <div class="exercise-programs-page">
        <div class="_container">
            <div class="exercise-programs-page__end-rates" v-if="client.status == 'online_client'">
                {{$t('clientIndex.title1')}} <span>{{ new Date(Date.parse(client.rate_end_day)).toLocaleDateString('ru-RU') }}</span>
                    {{$t('clientIndex.title2')}} <span>{{ new Date(Date.parse(client.rate_end_day)).toLocaleTimeString('ru-RU') }}</span>
            </div>
            <div class="exercise-programs-page__weeks">
                <WeekCard 
                    v-for="week in weeks" 
                    :key="`${week.name}-${week.id}`" 
                    :id="week.id"
                    :name="week.name" 
                    :description="week.description"
                    :disabled="!week.is_available_for_client"
                    :completeCount="week.complete_count"
                    :isPeriod="is_period"
                    :link="`client/exercise/`"
                    @weeksRedirect="weeksRedirect(week.id)"
                />
                <WeekCardAdditional
                    v-if="client.status == 'online_client' || client.status == 'mzo_client'"
                    :disabled="!client.is_advanced_active"
                    @advancedWeeksRedirect="advancedWeeksRedirect"
                />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data: () => ({
       
    }),
    async asyncData({ store, $axios }) {
        let token = store.state.userInfo.token
        let client = store.state.userInfo
        let weeks = []
        let new_weeks = []
        let is_period = false
        let before_weeks = []
        let after_weeks = []
        if(store.state.client.client_weeks){
            weeks = store.state.client.client_weeks
        } else {
            if(client.type != 'pregnant'){
                weeks = await $axios.$get(`/api/v1/user/get-client-weeks/?client_id=${client.id}`, {
                    headers: { 'Authorization': `Token ${token}` }
                })
            }
            else{
                is_period = true
                weeks = await $axios.$get(`/api/v1/user/get-client-periods/?client_id=${client.id}`, {
                    headers: { 'Authorization': `Token ${token}` }
                })
            }
            store.commit('client/setClientWeeks', weeks)
        }
        let additional_weeks = []
        if (weeks.additional_weeks) {
            additional_weeks = weeks.additional_weeks
            for (let index in additional_weeks){
                additional_weeks[index].name = additional_weeks[index].week.name
                additional_weeks[index].description = ''
                additional_weeks[index].is_available_for_client = true
                additional_weeks[index].is_available_for_trainer = true
                additional_weeks[index].is_additional = true
                if (additional_weeks[index].week.before_week){
                    before_weeks.push(additional_weeks[index])
                } else {
                    after_weeks.push(additional_weeks[index])
                }
            }
        }
        weeks = weeks.weeks
        new_weeks = new_weeks.concat(before_weeks)
        new_weeks = new_weeks.concat(weeks)
        new_weeks = new_weeks.concat(after_weeks)
        weeks = new_weeks

        return {client, weeks, additional_weeks, token, is_period}
    },
    methods: {
        advancedWeeksRedirect(){
            window.location.href = this.localePath('/client/advanced-weeks')
        },
        weeksRedirect(id){
            window.location.href = this.localePath(`/client/exercise/${id}`)
        }
    },
    components: {
        Btn: () => import('@/components/controls/Btn.vue'),
        InputFields: () => import('@/components/controls/Input-fields.vue'),
        ClientPageNav: () => import('@/components/client-page-nav.vue'),
        WeekCard: () => import(`@/components/WeekCard.vue`),
        WeekCardAdditional: () => import(`@/components/WeekCardAdditional.vue`),
    }
}
</script>

<style lang="scss">
.exercise-programs-page{
    &__weeks{
        place-content: space-evenly;
        display: grid;
        grid-template-columns: repeat(auto-fill, 350px);
        grid-gap: 20px;
    }
    &__end-rates{
        color: $dark-blue;
        margin-bottom: 20px;
        margin-left: 14px;
        font-weight: 600;
        span{
            color: $orange;
            font-size: 16px;
        }
    }
}

@media (max-width: 768px){
    .exercise-programs-page{
        &__weeks{
            grid-template-columns: repeat(auto-fill, 95%);
        }
    }
}
</style>