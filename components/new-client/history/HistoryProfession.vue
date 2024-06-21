<template>
    <div class="history-pain new-client">
        <div class="new-client__title">Чем вы занимаетесь?</div>
        <div class="new-client__subtitle">Это поможет вам понять насколько много вы двигаетесь</div>
        <div class="error-text new-client__error" v-if="error">Укажите профессию</div>
        <div class="history-pain__content">
            <div class="new-client__grid">
                <RadioButton :checked="profession == 'entrepreneur'" v-model="profession" default :name="$t('historyYourInfo.workItem1')" val="entrepreneur" radioName="wherePain"/>
                    <RadioButton :checked="profession == 'housewife'" v-model="profession" default :name="$t('historyYourInfo.workItem2')" val="housewife" radioName="wherePain"/>
                    <RadioButton :checked="profession == 'driver'" v-model="profession" default :name="$t('historyYourInfo.workItem3')" val="driver" radioName="wherePain"/>
                    <RadioButton :checked="profession == 'freelancer'" v-model="profession" default :name="$t('historyYourInfo.workItem4')" val="freelancer" radioName="wherePain"/>
                    <RadioButton :checked="profession == 'student'" v-model="profession" default :name="$t('historyYourInfo.workItem5')" val="student" radioName="wherePain"/>
                    <RadioButton :checked="profession == 'programmer'" v-model="profession" default :name="$t('historyYourInfo.workItem6')" val="programmer" radioName="wherePain"/>
                    <RadioButton :checked="profession == 'office_worker'" v-model="profession" default :name="$t('historyYourInfo.workItem7')" val="office_worker" radioName="wherePain"/>
                    <RadioButton :checked="profession == 'teacher'" v-model="profession" default :name="$t('historyYourInfo.workItem8')" val="teacher" radioName="wherePain"/>
                    <RadioButton :checked="profession == 'retiree'" v-model="profession" default :name="$t('historyYourInfo.workItem9')" val="retiree" radioName="wherePain"/>
            </div>
            <InputFields v-model="profession_alt" default :placeholder="$t('historyYourInfo.workItem10')"/>
        </div>
        <div class="new-client__buttons">
            <Btn @click="callback($event)" blue :name="$t('historyYourInfo.continueBtn')"/>
        </div>
    </div>
</template>

<script>
import '@/assets/css/new-client.scss'
export default {
    props: ['get_profession', 'get_profession_alt'],
    data(){
        return{
            profession: this.get_profession,
            profession_alt: this.get_profession_alt,
            error: false,
        }
    },
    watch: {
        get_profession(newValue){
            this.profession = newValue
        },
        get_profession_alt(newValue){
            this.profession_alt = newValue
        }
    },
    methods: {
        callback(e) {
            if(this.profession || this.profession_alt) {
                this.error = false
                let data = {
                    profession: this.profession,
                    profession_alt: this.profession_alt
                }
                this.$emit('click', data);
            } else {
                this.error = true
            }
        }
    },
    components: {
        RadioButton: () => import('@/components/controls/RadioButton.vue'),
        Btn: () => import('@/components/controls/Btn.vue'),
        InputFields: () => import('@/components/controls/Input-fields.vue'),
    }
}
</script>

<style lang="scss">

</style>