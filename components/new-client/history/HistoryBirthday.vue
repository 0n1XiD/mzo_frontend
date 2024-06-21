<template>
  <div class="history-birthday new-client">
        <div class="new-client__title">{{$t('historyBirthday.title')}}</div>
        <div class="history-birthday__calendar">
            <date-picker
                class="custom-calendar"
                v-model="calendarDateValue"
                value-type="format"
                format="DD MMMM, YYYY"
                :disabled-date="disabledDates"
                :inline="true"
                :lang="'ru'"
            ></date-picker>
        </div>
        <div class="new-client__buttons">
            <Btn @click="callback($event)" blue :name="$t('historyBirthday.continueBtn')"/>
        </div>
    </div>
</template>

<script>
import 'vue2-datepicker/index.css';
import 'vue2-datepicker/locale/ru';

import '@/assets/css/new-client.scss'
import '@/assets/css/custom-calendar.scss';

export default {
    data: () => ({
        calendarDateValue: '12 март, 1997',
    }),
    props: ['date'],
    fetch(){
        this.calendarDateValue = this.date
    },
    methods: {
        disabledDates(date) {
            let newDate = new Date()
            newDate.setDate(newDate.getDate() - 1);
            if (newDate >= date){
                return false
            }
            return true
        },
        callback(e) {
            this.$emit('click', this.calendarDateValue);
        }
    },
    components: {
        Btn: () => import('@/components/controls/Btn.vue'),
        DatePicker: () => import('vue2-datepicker'),
    }
}
</script>

<style lang="scss">
.history-birthday{
    &__calendar{
        display: flex;
        justify-content: center;
        margin-bottom: 40px;
    }
}
</style>