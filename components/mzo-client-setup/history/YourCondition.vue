<template>
    <div class="mzo-client-step">
        <div class="title">{{$t('historyYourCondition.title')}}</div>
        <div class="subtitle">{{$t('historyYourCondition.subtitle')}}</div>
        <div class="item">
            <div class="item__title">{{$t('historyYourCondition.conditionTitle')}}</div>
            <div class="item__subtitle">{{$t('historyYourCondition.conditionSubtitle')}}</div>
            <Selection 
                default
                class="item__selection item__field"
                :defaultName="`${generalCondition.default}%`"
                :object="generalCondition"
            />
            <textarea 
                class="textarea item__field" 
                maxlength='200'
                :placeholder="$t('historyYourCondition.conditionPlaceholder')"
                v-model="generalCondition.textarea"
            ></textarea>
            <div class="error-text" v-if="healthError">{{$t('historyYourCondition.conditionError')}}</div>
        </div>
        <div class="item">
            <div class="item__title">{{$t('historyYourCondition.energyTitle')}}</div>
            <div class="item__subtitle">{{$t('historyYourCondition.energySubtitle')}}</div>
            <Selection 
                default
                class="item__selection item__field"
                :defaultName="`${energyCondition.default}%`"
                :object="energyCondition"
            />
            <textarea 
                maxlength='200'
                class="textarea item__field" 
                :placeholder="$t('historyYourCondition.energyPlaceholder')"
                v-model="energyCondition.textarea"
            ></textarea>
            <div class="error-text" v-if="energyError">{{$t('historyYourCondition.energyError')}}</div>
        </div>
        <div class="item">
            <div class="item__title">{{$t('historyYourCondition.sleepTitle')}}</div>
            <div class="item__subtitle">{{$t('historyYourCondition.sleepSubtitle')}}</div>
            <Selection 
                default
                class="item__selection item__field"
                :defaultName="`${sleepCondition.default}%`"
                :object="sleepCondition"
            />
            <textarea 
                maxlength='200'
                class="textarea item__field" 
                :placeholder="$t('historyYourCondition.sleepPlaceholder')"
                v-model="sleepCondition.textarea"
            ></textarea>
            <div class="error-text" v-if="sleepError">{{$t('historyYourCondition.sleepError')}}</div>
        </div>
        <Btn blue :name="$t('historyYourCondition.continueBtn')" @click="goToPage(3)"/>
    </div>  
</template>

<script>
import { mapState } from "vuex";

export default {
    data: () => ({
        healthError: false,
        energyError: false,
        sleepError: false,
        generalCondition: {
            items: [
                0, 5, 10, 15, 20, 25, 
                30, 35, 40, 45, 50, 55, 
                60, 65, 70, 75, 80, 85, 
                90, 95, 100
            ],
            default: 50,
            textarea: ''
        },
        energyCondition: {
            items: [
                0, 5, 10, 15, 20, 25, 
                30, 35, 40, 45, 50, 55, 
                60, 65, 70, 75, 80, 85, 
                90, 95, 100
            ],
            default: 50,
            textarea: ''
        },
        sleepCondition: {
            items: [
                0, 5, 10, 15, 20, 25, 
                30, 35, 40, 45, 50, 55, 
                60, 65, 70, 75, 80, 85, 
                90, 95, 100
            ],
            default: 50,
            textarea: ''
        },
    }),
    computed:{
        ...mapState(["userInfo"]),
        ...mapState({
            statistic: state => state.client.statistic
        })
    },
    beforeMount(){
        if(this.statistic){
            if(this.statistic.condition[0]){
                if (this.statistic.condition[0].common_feel){
                    this.generalCondition.default = this.statistic.condition[0].common_feel
                }
                if (this.statistic.condition[0].common_feel_text){
                    this.generalCondition.textarea = this.statistic.condition[0].common_feel_text
                }
                if (this.statistic.condition[0].common_energy){
                    this.energyCondition.default = this.statistic.condition[0].common_energy
                }
                if (this.statistic.condition[0].common_energy_text){
                    this.energyCondition.textarea = this.statistic.condition[0].common_energy_text
                }
                if (this.statistic.condition[0].common_sleep){
                    this.sleepCondition.default = this.statistic.condition[0].common_sleep
                }
                if (this.statistic.condition[0].common_sleep_text){
                    this.sleepCondition.textarea = this.statistic.condition[0].common_sleep_text
                }
            }
        }
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
        goToPage: async function(page){
            let error = false
            this.healthError = false
            this.energyError = false
            this.sleepError = false
            if (this.generalCondition.default == null){
                this.healthError = true
                error = true
            }
            if (!this.energyCondition.default == null){
                this.energyError = true
                error = true
            }
            if (!this.sleepCondition.default == null){
                this.sleepError = true
                error = true
            }
            if (!error){
                let form_data= {
                    step: page,
                    common_feel: this.generalCondition.default,
                    common_feel_text: this.generalCondition.textarea,
                    common_energy: this.energyCondition.default,
                    common_energy_text: this.energyCondition.textarea,
                    common_sleep: this.sleepCondition.default,
                    common_sleep_text: this.sleepCondition.textarea,
                }
                await this.$axios.$post('/api/v1/user/mzo-client-setup/', form_data, { 
                    headers: { Authorization: `Token ${this.userInfo.token}`}
                }).then(res => {
                    let new_statistic = this.statistic
                    if(new_statistic.condition.length == 0){
                        this.statistic.condition.push({
                            common_feel: null,
                            common_feel_text: null,
                            common_energy: null,
                            common_energy_text: null,
                            common_sleep: null,
                            common_sleep_text: null,
                        })
                    }
                    new_statistic.condition[0].common_feel = this.generalCondition.default
                    new_statistic.condition[0].common_feel_text = this.generalCondition.textarea,
                    new_statistic.condition[0].common_energy = this.energyCondition.default,
                    new_statistic.condition[0].common_energy_text = this.energyCondition.textarea,
                    new_statistic.condition[0].common_sleep = this.sleepCondition.default,
                    new_statistic.condition[0].common_sleep_text = this.sleepCondition.textarea,
                    this.$store.commit('client/setStatistic', new_statistic)
                    this.$emit('changePage', page)
                }).catch(e => {
                    console.log(e.response)
                })
            }
        }
    },
    components:{
        RadioButton: () => import('@/components/controls/RadioButton.vue'),
        Btn: () => import('@/components/controls/Btn.vue'),
        Selection: () => import('@/components/controls/Selection.vue'),
    }
}
</script>