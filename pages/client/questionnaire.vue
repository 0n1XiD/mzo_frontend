<template>
    <QuestionnaireBlock
        :client="userInfo"
        :statistic="statistic"
        :notes="notes"
    />
</template>

<script>

export default {
    async asyncData({ store, $axios }) {
        let token = store.state.userInfo.token
        let statistic = await $axios.$get(`/api/v1/user/get-client-statistics/`, {
            headers: { 'Authorization': `Token ${token}` }
        })
        let userInfo = store.state.userInfo
        let notes = []
        for(let i in userInfo.notes){
            if (userInfo.notes[i].created_week != null){
                notes.push(userInfo.notes[i])
            }
        }
        return {userInfo, statistic, notes}
    },
    components: {
        QuestionnaireBlock: () => import(`~/components/QuestionnaireBlock.vue`),
    }
}
</script>

<style lang="scss">
</style>