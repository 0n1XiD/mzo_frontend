<template>
    <div class="exercise-programs-page">
        <div class="_container">
            <div class="main__breadcrumbs">
                <img src="@/assets/img/svg/breadcrumbs-arrow.svg" alt="small-arrow">
                <nuxt-link :to="localePath(`/client`)">
                    {{$t('trainerWeek.backLink')}}
                </nuxt-link> 
            </div>
            <div class="exercise-programs-page__title">Продвинутая программа</div>
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
                    :isAdvanced="true"
                    :link="`advanced-weeks/`"
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
    async asyncData({ store, $axios }) {
        let token = store.state.userInfo.token
        let client = store.state.userInfo
        let weeks = []
        let new_weeks = []
        weeks = await $axios.$get(`/api/v1/user/get-client-advanced-weeks/?client_id=${client.id}`, {
            headers: { 'Authorization': `Token ${token}` }
        })
        console.log(weeks)

        return {client, weeks, token}
    },
    methods: {
        weeksRedirect(id){
            window.location.href = this.localePath(`/client/advanced-weeks/${id}`)
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
    &__title{
        font-weight: 500;
        padding-left: 15px;
        margin-bottom: 15px;
    }
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