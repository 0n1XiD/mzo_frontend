<template>
    <div class="exercise-programs-page">
        <div class="_container">
            <div class="main__breadcrumbs">
                <img src="@/assets/img/svg/breadcrumbs-arrow.svg" alt="small-arrow">
                <nuxt-link :to="localePath(`/trainer/clients/${client.id}/exercise-programs`)">
                    {{$t('trainerWeek.backLink')}}
                </nuxt-link> 
            </div>
            <ClientPageNav :id="client.id" :title="`${client.first_name} ${client.last_name}`"/>
            <div class="exercise-programs-page__title">
                <div class="text">Продвинутая программа</div>
                <div v-if="client.awaiting_new_month" class="open-month" @click="openMonth()">
                    <btn blue :name="`Открыть след. месяц`"/>
                </div>
            </div>
            <div class="exercise-programs-page__weeks">
                <WeekCard 
                    v-for="week in weeks" 
                    :key="week.id" 
                    :id="week.id"
                    :name="week.name" 
                    :description="week.description"
                    :disabled="!week.is_available_for_trainer"
                    :completeCount="week.complete_count"
                    :isTrainer="true"
                    :link="`/trainer/clients/${client.id}/exercise-programs/advanced-program/`"
                    @weeksRedirect="weeksRedirect(week.id)"
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
        if(store.state.trainer.current_client){
            client = store.state.trainer.current_client
        } else {
            client = await $axios.$get(`/api/v1/user/get-client/?client_id=${params.client}`, {
                headers: { 'Authorization': `Token ${token}` },
            })
            store.commit('trainer/setClientInfo', client)
        }
        let weeks = []
        weeks = await $axios.$get(`/api/v1/user/get-client-advanced-weeks/?client_id=${client.id}`, {
            headers: { 'Authorization': `Token ${token}` }
        })
        console.log(client)
        return {client, weeks, token}
    },
    methods: {
        async openMonth(){
            for (let i in this.weeks){
                if(!this.weeks[i].is_available_for_trainer){
                    this.weeks[i].is_available_for_trainer = true
                    this.weeks[i].is_available_for_client = true
                    let params = {
                        week: JSON.stringify(this.weeks[i])
                    }
                    await this.$axios.$put('/api/v1/user/update-client-advanced-week/', params, { 
                        headers: { Authorization: `Token ${this.token}` } 
                    })
                    await this.$axios.$post(`/api/v1/user/disable-client-awaiting-month/?client_id=${this.client.id}`, {}, { 
                        headers: { Authorization: `Token ${this.token}` } 
                    })
                    break
                }
            }
            this.$router.go(this.localePath())
        },
        weeksRedirect(id){
            window.location.href = this.localePath(`/trainer/clients/${this.client.id}/exercise-programs/advanced-program/${id}`)
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
    &__title{
        max-width: 1090px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 25px;
    }
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