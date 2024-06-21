<template>
    <div class="history-when-pain new-client">
        <div class="new-client__title">{{$t('historyPainInfo.painWhenTimeShort')}}</div>
        <div class="error-text new-client__error" v-if="error">{{$t('historyPainInfo.painWhenTimeError')}}</div>
        <div class="new-client__content history-when-pain__content">
            <Checkbox v-model="time_data.time" value="after_waking_up" default :name="$t('historyPainInfo.painWhenTimePlaceholder1')" />
            <Checkbox v-model="time_data.time" value="end_of_the_day" default :name="$t('historyPainInfo.painWhenTimePlaceholder2')" />
            <Checkbox v-model="time_data.time" value="after_working_out" default :name="$t('historyPainInfo.painWhenTimePlaceholder3')" />
            <Checkbox v-model="time_data.time" value="after_long_sitting" default :name="$t('historyPainInfo.painWhenTimePlaceholder4')" />
            <Checkbox v-model="time_data.time" value="after_lifting_weights" default :name="$t('historyPainInfo.painWhenTimePlaceholder5')" />
            <Checkbox v-model="time_data.time" value="always" default :name="$t('historyPainInfo.painWhenTimePlaceholder6')" />
            <InputFields v-model="time_data.time_alt" default :placeholder="$t('historyPainInfo.painWhenTimePlaceholder7')"/>
        </div>
        <div class="new-client__buttons">
            <Btn @click="callback($event)" blue :name="$t('historyPainInfo.continueBtn')"/>
        </div>
    </div>
</template>

<script>
import '@/assets/css/new-client.scss'
export default {
    props: ['get_time', 'get_time_alt'],
    data(){
        return{
            time_data: {
                time: this.get_time,
                time_alt: this.get_time_alt,
            },
            error: false,
        }
    },
    watch: {
        get_time(newValue){
            this.time_data.time = newValue
        },
        get_time_alt(newValue){
            this.time_data.time_alt = newValue
        }
    },
    methods: {
        callback(e) {
            if(this.time_data.time || this.time_data.time_alt){
                this.error = false
                this.$emit('click', this.time_data);
            } else {
                this.error = true
            }
        },
        appendTime(time){
            this.time_data.time.push(time)
        }
    },
    components: {
        Btn: () => import('@/components/controls/Btn.vue'),
        Checkbox: () => import('@/components/controls/Checkbox.vue'),
        InputFields: () => import('@/components/controls/Input-fields.vue'),
    }
}
</script>

<style lang="scss">
.history-when-pain{
    &__content{
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-gap: 20px;
        .input{
            grid-column: 1 / span 2;
        }
    }
}

@media (max-width: 576px){
    .history-when-pain{
        &__content{
            display: flex;
            flex-direction: column;
        }
    }
}
</style>