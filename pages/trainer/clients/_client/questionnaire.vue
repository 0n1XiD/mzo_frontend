<template>
    <div class="questionnaire-page">
        <div class="_container">
            <div class="main__breadcrumbs">
                <img src="@/assets/img/svg/breadcrumbs-arrow.svg" alt="small-arrow">
                <nuxt-link :to="localePath(`/trainer/clients`)">
                    {{$t('questionnaireBlock.backLink')}}
                </nuxt-link> 
            </div>
            <ClientPageNav :id="client.id" :title="`${client.first_name} ${client.last_name}`"/>
            <QuestionnaireBlock
                :client="client"
                :statistic="statistic"
                :notes="notes"
            />
        </div>
    </div>
</template>

<script>

export default {
    async asyncData({ store, params, $axios, $nuxt }) {
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
        let statistic = await $axios.$get(`/api/v1/user/get-client-statistics/?client_id=${params.client}`, {
            headers: { 'Authorization': `Token ${token}` }
        })
        let notes = []
        for(let i in client.notes){
            if (client.notes[i].created_week != null){
                notes.push(client.notes[i])
            }
        }
        return {client, statistic, notes}
    },
    components: {
        QuestionnaireBlock: () => import(`~/components/QuestionnaireBlock.vue`),
    }
}
</script>

<style lang="scss">
</style>