<template>
    <div class="trainer-message">
        <div class="trainer-message__header row">
            <div class="main-info row">
                <div class="trainer-message__icon" :class="{'pink': client.gender == 'female'}">
                    {{client.first_name.charAt(0)}}
                </div>
                <div class="trainer-message__client">
                    <div class="fullname row" @click="goToClientStatistic(client.id)">
                        <div class="fullname__name">{{client.first_name}}</div>
                        <div class="fullname__surname">{{client.last_name}}</div>
                    </div>
                    <div class="date">
                        {{ new Date(Date.parse(date)).toLocaleDateString('ru-RU') }} 
                        ({{ new Date(Date.parse(date)).toLocaleTimeString('ru-RU') }})
                    </div>
                </div>
            </div>
        </div>
        <div class="trainer-message__message">{{message}}</div>
        <div class="trainer-message__reply">
            <textarea 
                @keyup.enter="sendMessage()"
                v-model="new_message" 
                class="reply-field" 
                :placeholder="$t('trainerMessage.placeholder')"
                maxlength='200'
            ></textarea>
            <Btn @click="sendMessage()" blueBorder :name="$t('trainerMessage.sendBtn')"/>
        </div>
    </div>
</template>

<script>
export default {
    data: () => ({
        new_message: null
    }),
    props: {
        client: {
            type: Object,
            required: true
        },
        date: {
            type: String,
            required: true
        },
        message: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    },
    methods: {
        goToClientStatistic(client_id){
            this.$store.commit('trainer/resetClientinfo')
            this.$router.push(this.localePath(`/trainer/clients/${client_id}/statistics`))
        },
        async sendMessage(){
            let form_data= {
                'message_to': this.client.id,
                'message_text': this.new_message
            }
            await this.$axios.$post('/api/v1/user/send-message/', form_data, { 
                headers: { Authorization: `Token ${this.token}` } ,
            }).then(res => {
                
            }).catch(e => {
                console.log(e.response)
            })
            // this.old_messages.push({
            //     id: this.old_messages.length + 1, message: this.message
            // })
            this.new_message = null
        },
    },
    components:{
        Btn: () => import(`@/components/controls/Btn.vue`),
    }
}
</script>

<style lang="scss" scoped>
.trainer-message{
    border: 1px solid $gray;
    border-radius: 5px;
    padding: 15px 20px;
    max-width: 800px;
    width: 100%;
    &:not(:last-child){
        margin-bottom: 25px;
    }
    &__header{
        justify-content: space-between;
        margin-bottom: 10px;
        padding-bottom: 10px;
        border-bottom: 1px dashed $gray;
    }
    &__icon{
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 24px;
        font-weight: 600;
        margin-right: 20px;
        color: $blue;
        width: 50px;
        height: 50px;
        border-radius: 100%;
        background: $gray;
        &.pink{
            color: $pink;
        }
    }
    &__client{
        .fullname{
            cursor: pointer;
            &__name, &__surname{
                color: $blue;
            }
            &__name{
                margin-right: 10px;
            }
        }
        .date{
            color: $light-gray;
            font-size: 14px;
        }
    }
    &__message{
        // margin-left: 70px;
        font-size: 16px;
    }
    &__reply{
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 15px;
        border-top: 1px solid #D9D9D9;
        padding-top: 10px;
        .reply-field{
            background: #EFEFEF;
            overflow: hidden;
            resize:none;
            font-family: 'Gilroy';
            display: flex;
            align-items: center;
            height: 48px;
            padding: 15px 16px;
            border: none;
            border-radius: 4px;
            font-size: 16px;
            line-height: 19px;
            padding-right: 0;
            width: 80%;
            font-size: 14px;
            // background: none;
        }
        .btn{
            width: 15%;
            height: 48px;
        }
    }
}

</style>