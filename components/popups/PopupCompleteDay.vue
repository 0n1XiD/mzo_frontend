<template>
    <div class="wrapper">
        <div class="complete-day">
            <div class="complete-day__inner">
                <div class="complete-day__icon">
                    <img width="80" height="80" src="@/assets/img/svg/congratulations.svg" alt="congratulations">
                </div>
                <div class="complete-day__title">{{$t('completeDay.title')}} {{$store.state.userInfo.first_name}}</div>
                <div class="complete-day__subtitle">{{$t('completeDay.subtitle')}} {{ day }}</div>
                <textarea
                    maxlength='200'
                    class="textarea complete-day__note" 
                    :placeholder="$t('completeDay.placeholder')"
                    v-model="note"
                ></textarea>
                <Btn @click="closeWindow()" blue :name="getButtonText()" class="complete-day__button"/>
            </div>
        </div>
    </div>
</template>
  
<script>
  export default {
    data: () => ({
        note: null,
    }),
    props: {
        day: {
            type: Number,
            required: true
        },
        week: {
            type: Number,
            requied: true
        },
        client: {
            type: Object,
            required: true
        }
      },
    methods: {
        closeWindow(){
            if (this.note){
                this.addNote()
            }
            window.location.href = this.localePath('/client')
        },
        getButtonText(){
            if (this.note){
                let text = this.$nuxt.$t('completeDay.sendBtn1')
                return text
            } else {
                let text = this.$nuxt.$t('completeDay.sendBtn2')
                return text
            }
        },
        addNote(){
            let params = {
                client_id: this.client.id,
                text: this.note,
                day: this.day,
                week: this.week + 1 
            }
            let response = this.$axios.$post('/api/v1/user/add-client-note/', params, { 
                headers: { Authorization: `Token ${this.client.token}` } 
            }).then(response => {
                let new_note = {id: response.id, text: response.text, created_at: response.created_at, visible_to_client: true}
                this.$store.commit('addClientNote', new_note)
            }).catch(e => {
                console.log(e.response)
            })
        },
    },
    components: {
        Btn: () => import('@/components/controls/Btn.vue'),
    }
  }
</script>
  
<style lang="scss">
  .complete-day{
    overflow: visible;
    position: relative;
    background: $white;
    padding: 15px 25px 25px 25px;
    width: 400px;
    max-height: 80vh;
    border-radius: 10px;
    &__inner{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    &__title{
        text-align: center;
        margin-bottom: 20px;
        font-weight: 700;
        font-size: 28px;
        line-height: 32px;
    }
    &__subtitle{
        text-align: center;
        font-weight: 600;
        margin-bottom: 20px;
        font-size: 18px;
    }
    &__note{
        margin-bottom: 20px;
    }
}

@media (max-width: 768px){
    .complete-day{
        width: 95vw;
        min-width: 95vw;
        &__inner{
            height: 100%;
        }
    }
}

@media (max-width: 576px){
    .complete-day{
        &__title{
            margin-bottom: 10px;
            font-size: 20px;
        }
        &__subtitle{
            margin-bottom: 15px;
            font-size: 16px;
        }
    }
}
</style>