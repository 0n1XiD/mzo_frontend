<template>
    <div class="history-gender new-client">
        <div class="new-client__title">{{$t('historyYourInfo.sexTitle')}}</div>
        <div class="error-text new-client__error" v-if="error">{{$t('historyYourInfo.sexError')}}</div>
        <div class="history-gender__content">
            <div class="gender-item">
                <img width="90" height="90" src="@/assets/img/svg/men.svg" alt="men" class="gender-item__icon">
                <RadioButton :checked="gender == 'male'" v-model="gender" default :name="$t('historyYourInfo.sexItem1')" val="male" radioName="gender"/>
            </div>
            <div class="gender-item">
                <img width="90" height="90" src="@/assets/img/svg/women.svg" alt="women" class="gender-item__icon">
                <RadioButton :checked="gender == 'female'" v-model="gender" default :name="$t('historyYourInfo.sexItem2')" val="female" radioName="gender"/>
            </div>
        </div>
        <div class="new-client__buttons">
            <Btn @click="callback($event)" blue :name="$t('historyYourInfo.continueBtn')"/>
        </div>
    </div>
</template>

<script>
import '@/assets/css/new-client.scss'
export default {
    data: () => ({
        gender: null,
        error: false
    }),
    props: ['get_gender'],
    fetch(){
        this.gender = this.get_gender
    },
    methods: {
        callback(e) {
            if(this.gender){
                this.error = false
                this.$emit('click', this.gender);
            } else {
                this.error = true
            }
        }
    },
    watch: {
        get_gender(newValue){
            this.gender = newValue
        }
    },
    components: {
        RadioButton: () => import('@/components/controls/RadioButton.vue'),
        Btn: () => import('@/components/controls/Btn.vue')
    }
}
</script>

<style lang="scss">
.history-gender{
    &__content{
        margin-bottom: 50px;
        display: flex;
        justify-content: center;
        .gender-item{
            display: flex;
            align-items: center;
            flex-direction: column;
            &__icon{
                margin-bottom: 10px;
                display: flex;
                justify-content: center;
                align-items: center;
                background: $gray;
                border-radius: 100%;
                width: 150px;
                height: 150px;
            }
            &:first-child{
                margin-right: 100px;
            }
        }
    }
}

@media (max-width: 576px){
    .history-gender{
        &__content{
            justify-content: space-evenly;
            .gender-item{
                &__icon{
                    width: 100px;
                    height: 100px;
                }
                &:first-child{
                    margin-right: 10px;
                }
            }
        }
    }
}
</style>