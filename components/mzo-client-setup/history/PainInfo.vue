<template>
    <div class="mzo-client-step">
        <div class="title">{{$t('historyPainInfo.title')}}</div>
        <div class="subtitle">{{$t('historyPainInfo.subtitle')}}</div>
            <div class="pain-step" v-for="(pain, index) in pain_places" :key="`pain-${index}`">
                <div class="pain-row">
                    <div class="pain-count">{{ index + 1 }}</div>
                    <p class="pain-count__text">{{$t('historyPainInfo.painPlace')}}</p>
                </div>
                <div class="item">
                    <div class="item__title">{{$t('historyPainInfo.painChoiceTitle')}}</div>
                    <div class="new-client__grid">
                        <RadioButton
                            v-for="item in pain_places_options"
                            :key="`pain-${index}-${item.id}`"
                            default
                            :checked="pain.pain_place == item.value"
                            :name="item.label"
                            :val="item.value"
                            v-model="pain.pain_place"
                            :radioName="`pain-${index}`"
                        />
                    </div>
                    <div class="item__subtitle">{{$t('historyPainInfo.painNumberTitle')}}</div>
                    <Selection 
                        default
                        class="item__field indent"
                        :defaultName="`${pain.painPower.default}`"
                        :object="pain.painPower"
                    />
                    <div class="error-text" v-if="pain.painError">{{$t('historyPainInfo.painPlaceError')}}</div>
                    <div class="error-text" v-if="pain.painPowerError">{{$t('historyPainInfo.painNubmerError')}}</div>
                </div>
                <div class="item">
                    <div class="item__title">{{$t('historyPainInfo.painTime')}}</div>
                    <div class="item__row item__field indent">
                        <InputFields class="item__row-field" v-model="pain.pain_yy" type="number" default :placeholder="$t('historyPainInfo.painTimePlaceholder1')"/>
                        <InputFields class="item__row-field" v-model="pain.pain_mm" type="number" default :placeholder="$t('historyPainInfo.painTimePlaceholder2')"/>
                        <InputFields class="item__row-field" v-model="pain.pain_dd" type="number" default :placeholder="$t('historyPainInfo.painTimePlaceholder3')"/>
                    </div>
                    <div class="error-text" v-if="pain.painTimeError">{{$t('historyPainInfo.painTimeError')}}</div>
                </div>
                <div class="item">
                    <div class="item__title">{{$t('historyPainInfo.painWhenTime')}}</div>
                    <div class="new-client__content history-when-pain__content">
                        <Checkbox v-model="pain.when_pain" value="after_waking_up" default :name="$t('historyPainInfo.painWhenTimePlaceholder1')" />
                        <Checkbox v-model="pain.when_pain" value="end_of_the_day" default :name="$t('historyPainInfo.painWhenTimePlaceholder2')" />
                        <Checkbox v-model="pain.when_pain" value="after_working_out" default :name="$t('historyPainInfo.painWhenTimePlaceholder3')" />
                        <Checkbox v-model="pain.when_pain" value="after_long_sitting" default :name="$t('historyPainInfo.painWhenTimePlaceholder4')" />
                        <Checkbox v-model="pain.when_pain" value="after_lifting_weights" default :name="$t('historyPainInfo.painWhenTimePlaceholder5')" />
                        <Checkbox v-model="pain.when_pain" value="always" default :name="$t('historyPainInfo.painWhenTimePlaceholder6')" />
                        <InputFields v-model="pain.when_pain_alt" default :placeholder="$t('historyPainInfo.painWhenTimePlaceholder7')"/>
                    </div>
                    <div class="error-text" v-if="pain.whenPainError">{{$t('historyPainInfo.painWhenTimeError')}}</div>
                </div>
                <div class="item">
                    <div class="item__title">{{$t('historyPainInfo.diagnosisTitle')}}</div>
                    <textarea maxlength='200' v-model="pain.diagnosis"  class="textarea"></textarea>
                </div>
                <div class="item__line" v-if="index == 0 && pain_places.length > 1"></div>
            </div>
            <div v-if="pain_places.length == 1" class="add-second-pain" @click="addMorePain()">
                {{$t('historyPainInfo.painAdd')}}
            </div>
            <div v-else class="delete-second-pain" @click="deleteMorePain()">
                {{$t('historyPainInfo.painDelete')}}
            </div>
            <div class="item__line"></div>
            <div class="item">
                <div class="item__title">{{$t('historyPainInfo.painAdditional')}}</div>
                <textarea maxlength='200' v-model="additional_pain_info" class="textarea item__field"></textarea>
            </div>
            <div class="item">
                <div class="item__title">{{$t('historyPainInfo.treatmentsTitle')}}</div>
                <div class="new-client__content history-when-pain__content">
                    <Checkbox v-model="treatments.tried" value="chiropractic" default :name="$t('historyPainInfo.treatmentsPlaceholder1')" />
                    <Checkbox v-model="treatments.tried" value="physical_therapy" default :name="$t('historyPainInfo.treatmentsPlaceholder2')" />
                    <Checkbox v-model="treatments.tried" value="surgery" default :name="$t('historyPainInfo.treatmentsPlaceholder3')" />
                    <Checkbox v-model="treatments.tried" value="analgesic" default :name="$t('historyPainInfo.treatmentsPlaceholder4')" />
                    <Checkbox v-model="treatments.tried" value="acupuncture" default :name="$t('historyPainInfo.treatmentsPlaceholder5')" />
                    <Checkbox v-model="treatments.tried" value="hirudotherapy" default :name="$t('historyPainInfo.treatmentsPlaceholder6')" />
                    <Checkbox v-model="treatments.tried" value="kinesiatrics" default :name="$t('historyPainInfo.treatmentsPlaceholder7')" />
                    <Checkbox v-model="treatments.tried" value="yoga_pilates" default :name="$t('historyPainInfo.treatmentsPlaceholder8')" />
                    <Checkbox v-model="treatments.tried" value="extension" default :name="$t('historyPainInfo.treatmentsPlaceholder9')" />
                    <InputFields v-model="treatments.tried_alt" default :placeholder="$t('historyPainInfo.treatmentsPlaceholder10')"/>
                </div>
                <div class="error-text" v-if="treatmentsError">{{$t('historyPainInfo.treatmentsError')}}</div>
            </div>
        <Btn blue :name="$t('historyPainInfo.continueBtn')" @click="goToPage(4)"/>
    </div>  
</template>

<script>
import { mapState } from "vuex";

export default {
    data: function(){
        return {
            pain_places_options: [
                {label: this.$nuxt.$t('historyPainInfo.painPlaceItem1'),value:1,id:1},
                {label: this.$t('historyPainInfo.painPlaceItem2'),value:2,id:2},
                {label: this.$t('historyPainInfo.painPlaceItem3'),value:3,id:3},
                {label: this.$t('historyPainInfo.painPlaceItem4'),value:4,id:4},
                {label: this.$t('historyPainInfo.painPlaceItem5'),value:5,id:5},
                {label: this.$t('historyPainInfo.painPlaceItem6'),value:6,id:6},
                {label: this.$t('historyPainInfo.painPlaceItem7'),value:7,id:7},
                {label: this.$t('historyPainInfo.painPlaceItem8'),value:8,id:8},
            ],
            pain_places:[
                {
                    id: -1,
                    pain_place: null,
                    place_pain_number: 5,
                    pain_yy:null,
                    pain_mm:null,
                    pain_dd:null,
                    when_pain: [],
                    when_pain_alt: '',
                    diagnosis: '',
                    is_setup_second_pain: false,
                    painPower: {
                        items: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                        default: 5,
                    },
                    painError: false,
                    painPowerError: false,
                    painTimeError: false,
                    whenPainError: false,
                    timeError: false,
                    is_server_pain: false,
                },
            ],
            pain_delete_id: null,
            second_pain_id: -1,
            treatments: {
                tried: [],
                tried_alt: ''
            },
            server_second_place: null,
            treatmentsError: false,
            additional_pain_info: ''
        }
    },
    computed:{
        ...mapState(["userInfo"]),
        ...mapState({
            statistic: state => state.client.statistic
        })
    },
    beforeMount(){
        if(this.statistic){
            if(this.statistic.pain.length > 0){
                if (this.statistic.pain.length > 1){
                    this.addMorePain()
                }
                for (let [index, pain] of this.statistic.pain.entries()) {
                    this.pain_places[index].is_server_pain = true
                    if (pain.id){
                        this.pain_places[index].id = pain.id
                    }
                    if (pain.place){
                        this.pain_places[index].pain_place = pain.place
                    }
                    if (pain.place_pain_number){
                        this.pain_places[index].painPower.default = pain.place_pain_number
                    }
                    if (pain.pain_yy){
                        this.pain_places[index].pain_yy = pain.pain_yy
                    }
                    if (pain.pain_mm){
                        this.pain_places[index].pain_mm = pain.pain_mm
                    }
                    if (pain.pain_dd){
                        this.pain_places[index].pain_dd = pain.pain_dd
                    }
                    if (pain.when_pain){
                        this.pain_places[index].when_pain = pain.when_pain
                    }
                    if (pain.when_pain_alt){
                        this.pain_places[index].when_pain_alt = pain.when_pain_alt
                    }
                    if (pain.diagnosis){
                        this.pain_places[index].diagnosis = pain.diagnosis
                    }
                    if(index == 1){
                        this.second_pain_id = this.pain_places[index].id
                        this.server_second_place = this.pain_places[index]
                    }
                }
            }
        }
        if(this.userInfo.additional_pain_info){
            this.additional_pain_info = this.userInfo.additional_pain_info
        }
        if (this.userInfo.pain_try_repare){
            this.treatments.tried = this.userInfo.pain_try_repare
        }
        if (this.userInfo.pain_try_repare_alt){
            this.treatments.tried_alt = this.userInfo.pain_try_repare_alt
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
            this.treatmentsError = false
            for (let pain of this.pain_places){
                pain.painError = false
                pain.painPowerError = false
                pain.painTimeError = false
                pain.whenPainError = false
                if(!pain.pain_place){
                    pain.painError = true
                    error = true
                }
                if(!pain.painPower.default){
                    pain.painPowerError = true
                    error = true
                }
                if(!pain.pain_yy && !pain.pain_mm && !pain.pain_dd){
                    pain.painTimeError = true
                    error = true
                }
                if(!pain.when_pain && !pain.when_pain_alt){
                    pain.whenPainError = true
                    error = true
                }this.statistic
            }
            if(!this.treatments.tried && !this.treatments.tried_alt){
                this.treatmentsError = true
                error = true
            }
            if (!error){
                let form_data= {
                    step: page,
                    pain_places: this.pain_places,
                    additional_pain_info: this.additional_pain_info,
                    pain_try_repare: this.treatments.tried,
                    pain_try_repare_alt: this.treatments.tried_alt,
                    pain_delete_id: this.pain_delete_id
                }
                await this.$axios.$post('/api/v1/user/mzo-client-setup/', form_data, { 
                    headers: { Authorization: `Token ${this.userInfo.token}`}
                }).then(res => {
                    let new_pain = this.statistic
                    if (this.statistic.pain.length != this.pain_places.length){
                        this.statistic.pain = []
                        for (let index in this.pain_places){
                            this.statistic.pain.push({
                                place: this.pain_places[index].pain_place,
                                place_pain_number: this.pain_places[index].painPower.default,
                                pain_yy: this.pain_places[index].pain_yy,
                                pain_mm: this.pain_places[index].pain_mm,
                                pain_dd: this.pain_places[index].pain_dd,
                                when_pain: this.pain_places[index].when_pain,
                                when_pain_alt: this.pain_places[index].when_pain_alt,
                                diagnosis: this.pain_places[index].diagnosis,
                            })
                        }
                    }
                    for (let [index, pain] of this.pain_places.entries()){
                        new_pain.pain[index].place = pain.pain_place
                        new_pain.pain[index].place_pain_number = pain.painPower.default
                        new_pain.pain[index].pain_yy = pain.pain_yy
                        new_pain.pain[index].pain_mm = pain.pain_mm
                        new_pain.pain[index].pain_dd = pain.pain_dd
                        new_pain.pain[index].when_pain = pain.when_pain
                        new_pain.pain[index].when_pain_alt = pain.when_pain_alt
                        new_pain.pain[index].diagnosis = pain.diagnosis
                    }
                    this.$store.commit('client/setStatistic', new_pain)
                    this.$store.commit('setUserInfo', res)
                    this.$emit('changePage', page)
                }).catch(e => {
                    console.log(e.response)
                })
            }
        },
        addMorePain(){
            if (this.server_second_place){
                this.pain_places.push(this.server_second_place)
            } else {
                this.pain_places.push({
                    id: this.second_pain_id,
                    pain_place: null,
                    place_pain_number: 5,
                    pain_yy:null,
                    pain_mm:null,
                    pain_dd:null,
                    when_pain: [],
                    when_pain_alt: '',
                    diagnosis: '',
                    is_setup_second_pain: true,
                    painPower: {
                        items: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                        default: 5,
                    },
                    painError: false,
                    painPowerError: false,
                    timeError: false,
                    is_server_pain: false,
                })
            }
        },
        deleteMorePain(){
            if (this.pain_places[1].is_server_pain){
                this.pain_delete_id = this.pain_places[1].id
            }
            this.pain_places.splice(1, 1);
        }
    },
    components:{
        RadioButton: () => import('@/components/controls/RadioButton.vue'),
        Btn: () => import('@/components/controls/Btn.vue'),
        Selection: () => import('@/components/controls/Selection.vue'),
        InputFields: () => import('@/components/controls/Input-fields.vue'),
        Checkbox: () => import('@/components/controls/Checkbox.vue'),
    }
}
</script>

<style lang="scss" scoped>
.mzo-client-step{
    .add-second-pain{
        margin-top: 20px;
        margin-bottom: 40px;
        cursor: pointer;
        color: $blue;
    }
    .delete-second-pain{
        margin-bottom: 40px;
        cursor: pointer;
        color: $red;
    }
    .pain-step{
        margin-bottom: 30px;
    }
    .pain-row{
        margin-bottom: 20px;
        display: flex;
        align-items: center;
    }
    .pain-count{
        border-radius: 100%;
        border: 1px solid $blue;
        padding: 10px 18px;
        width: fit-content;
        height: fit-content;
        &__text{
            font-weight: 600;
            margin-left: 10px;
        }
    }
}
</style>