<template>
    <div class="exercise-programs-page">
        <div class="_container">
            <div class="main__breadcrumbs">
                <img src="@/assets/img/svg/breadcrumbs-arrow.svg" alt="small-arrow">
                <nuxt-link :to="localePath(`/trainer/clients`)">
                    {{$t('trainerWeek.backLink')}}
                </nuxt-link> 
            </div>
            <ClientPageNav :id="client.id" :title="`${client.first_name} ${client.last_name}`"/>
            <div class="exercise-programs-page__weeks">
                <WeekCard 
                    v-for="week in weeks" 
                    :key="week.id" 
                    :id="week.id"
                    :name="week.name" 
                    :description="week.description"
                    :disabled="!week.is_available_for_trainer"
                    :completeCount="week.complete_count"
                    :isPeriod="isPeriod"
                    :isTrainer="true"
                    @weeksRedirect="weeksRedirect(week.id)"
                />
                <WeekCardAdditional
                    v-if="client.status == 'online_client' || client.status == 'mzo_client'"
                    :disabled="!client.is_advanced_active"
                    :isTrainer="true"
                    @activateAdvancedWeeks="activateAdvancedWeeks"
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
    async asyncData({ params, $axios, store }) {
        let token = store.state.userInfo.token
        let client = null
        let isPeriod = false
        if(store.state.trainer.current_client){
            client = store.state.trainer.current_client
        } else {
            client = await $axios.$get(`/api/v1/user/get-client/?client_id=${params.client}`, {
                headers: { 'Authorization': `Token ${token}` },
            })
            store.commit('trainer/setClientInfo', client)
        }
        let weeks = []
        if(store.state.trainer.client_weeks){
            weeks = store.state.trainer.client_weeks
        } else {
            if (client.type != 'pregnant'){
                weeks = await $axios.$get(`/api/v1/user/get-client-weeks/?client_id=${client.id}`, {
                    headers: { 'Authorization': `Token ${token}` }
                })
            } else {
                weeks = await $axios.$get(`/api/v1/user/get-client-periods/?client_id=${client.id}`, {
                    headers: { 'Authorization': `Token ${token}` }
                })   
                isPeriod = true
            }
            store.commit('trainer/setClientWeeks', weeks)
        }
        return {client, weeks, token, isPeriod}
    },
    methods: {
        async activateAdvancedWeeks(){
            await this.$axios.$post(`/api/v1/user/activate-client-advanced-weeks/?client_id=${this.client.id}`, {}, {
                headers: { 'Authorization': `Token ${this.token}` }
            }).catch(e => {
                console.log(e.response)
            })
            this.$router.go(this.localePath())
        },
        advancedWeeksRedirect(){
            this.$router.push(this.localePath(`/trainer/clients/${this.client.id}/exercise-programs/advanced-program`))
        },
        weeksRedirect(id){
            window.location.href = this.localePath(`/trainer/clients/${this.client.id}/exercise-programs/${id}`)
        }
    },
    components: {
        Btn: () => import('@/components/controls/Btn.vue'),
        InputFields: () => import('@/components/controls/Input-fields.vue'),
        ClientPageNav: () => import('@/components/client-page-nav.vue'),
        WeekCard: () => import(`@/components/WeekCard.vue`)
    }
}
</script>

<style lang="scss">
.exercise-programs-page{
    &__weeks{
        display: grid;
        grid-template-columns: repeat(auto-fill, 350px);
        grid-gap: 20px;
    }
}

@media (max-width: 768px){
    .exercise-programs-page{
        &__weeks{
            grid-template-columns: repeat(auto-fill, 100%);
        }
    }
}
</style>