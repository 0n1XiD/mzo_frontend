<template>
  <div class="history-group">
    <HistoryIntroductions v-if="historyGroup.step == 1" @click="historyGroup.step = 2"/>
    <HistoryGender :get_gender="historyData.gender" v-if="historyGroup.step == 2" @click="getGender($event)"/>
    <HistoryBirthday :date="historyData.birthday" v-if="historyGroup.step == 3" @click="getBirthday($event)"/>
    <HistoryHeightWeight 
      v-if="historyGroup.step == 4"
      :height="historyData.height"
      :weight="historyData.weight"
      @click="getheightAndWeight($event)"
    />
    <HistoryProfession 
      v-if="historyGroup.step == 5"
      :get_profession="historyData.work"
      :get_profession_alt="historyData.work_alt"
      @click="getProffesion($event)"
    />
    <HistoryHealth 
      v-if="historyGroup.step == 6"
      :get_condition="historyData.common_feel"
      :get_condition_alt="historyData.common_feel_text"
      @click="getHealth($event)"
    />
    <HistoryEnergy 
      v-if="historyGroup.step == 7"
      :get_condition="historyData.common_energy"
      :get_condition_alt="historyData.common_energy_text"
      @click="getEnergy($event)"
    />
    <HistorySleep 
      v-if="historyGroup.step == 8"
      :get_condition="historyData.common_sleep"
      :get_condition_alt="historyData.common_sleep_text"
      @click="getSleep($event)"
    />
    <!-- Reply -->
    <HistoryPain 
      v-if="historyGroup.step == 9"
      :get_place="historyData.pain_places[0].pain_place"
      :get_power="historyData.pain_places[0].place_pain_number"
      @click="getPain($event, 0)"
    />
    <HistoryPainTime 
      v-if="historyGroup.step == 10" 
      :get_years="historyData.pain_places[0].pain_yy"
      :get_months="historyData.pain_places[0].pain_mm"
      :get_days="historyData.pain_places[0].pain_dd"
      @click="getPainTime($event, 0)"
    />
    <HistoryWhenPain 
      v-if="historyGroup.step == 11" 
      :get_time="historyData.pain_places[0].when_pain"
      :get_time_alt="historyData.pain_places[0].when_pain_alt"
      @click="getWhenPain($event, 0)"
    />
    <HistoryDiagnosis 
      v-if="historyGroup.step == 12"
      :get_diagnosis="historyData.pain_places[0].diagnosis"
      @click="getDiagnosis($event, 0)"
    />

    <HistoryMorePain v-if="historyGroup.step == 13" @click="getMorePain($event)"/>

    <HistoryPain 
      v-if="historyGroup.step == 14 && historyGroup.haveMorePain" 
      :get_place="historyData.pain_places[1].pain_place"
      :get_power="historyData.pain_places[1].place_pain_number"
      @click="getPain($event, 1)"
    />
    <HistoryPainTime 
      v-if="historyGroup.step == 15 && historyGroup.haveMorePain"
      :get_years="historyData.pain_places[1].pain_yy"
      :get_months="historyData.pain_places[1].pain_mm"
      :get_days="historyData.pain_places[1].pain_dd"
      @click="getPainTime($event, 1)"
    />
    <HistoryWhenPain 
      v-if="historyGroup.step == 16 && historyGroup.haveMorePain"
      :get_time="historyData.pain_places[1].when_pain"
      :get_time_alt="historyData.pain_places[1].when_pain_alt"
      @click="getWhenPain($event, 1)"
    />
    <HistoryDiagnosis 
      v-if="historyGroup.step == 17 && historyGroup.haveMorePain"
      :get_diagnosis="historyData.pain_places[1].diagnosis"
      @click="getDiagnosis($event, 1)"
    />
    <!-- Stop -->
    <HistoryAdditionalPain v-if="
      (historyGroup.step == 14 && !historyGroup.haveMorePain) || 
      (historyGroup.step == 18 && historyGroup.haveMorePain)"
      :get_pain_info="historyData.additional_pain_info"
      @click="getAdditionalPain($event)"
    />
    <HistoryTreatmentsTried v-if="
      (historyGroup.step == 15 && !historyGroup.haveMorePain) ||
      (historyGroup.step == 19 && historyGroup.haveMorePain)"
      :get_tried="historyData.pain_try_repare"
      :get_tried_alt="historyData.pain_try_repare_alt"
      @click="getTreatmentsTried($event)"
    />
    <div class="steps__pagination">
      <div class="step-dots">
          <div @click="goToStep(step)" class="dot" :class="{'dot_active': step == historyGroup.step, 'dot_complete': step <= historyGroup.step_complete}" v-for="step in historyGroup.step_count" :key="`historyGroup-${step}`"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
    props: {
      historyData: {
        type: Object,
        required: true
      },
      historyStepsComplete: {
        type: Number,
      }
    },
    data () {
      return{
        historyGroup: {
          haveMorePain: false,
          step: 1,
          step_complete: this.historyStepsComplete,
          step_count: 15
        },
      }
    },
    watch: {
      historyStepsComplete(newValue) {
        this.historyGroup.step_complete = newValue
      },
    },
    methods: {
      getGender(e) {
        this.historyData.gender = e
        this.historyGroup.step = 3
        this.historyGroup.step_complete = 3
        this.$emit('changePage', this.historyGroup.step_complete);
      },
      getBirthday(e){
        this.historyData.birthday = e
        this.historyGroup.step = 4
        this.historyGroup.step_complete = 4
        this.$emit('changePage', this.historyGroup.step_complete);
      },
      getheightAndWeight(e){
        this.historyData.height = e.height
        this.historyData.weight = e.weight
        this.historyGroup.step = 5
        this.historyGroup.step_complete = 5
        this.$emit('changePage', this.historyGroup.step_complete);
      },
      getProffesion(e){
        this.historyData.work = e.profession
        this.historyData.work_alt = e.profession_alt
        this.historyGroup.step = 6
        this.historyGroup.step_complete = 6
        this.$emit('changePage', this.historyGroup.step_complete);
      },
      getHealth(e){
        this.historyData.common_feel = e.default
        this.historyData.common_feel_text = e.textarea
        this.historyGroup.step = 7
        this.historyGroup.step_complete = 7
        this.$emit('changePage', this.historyGroup.step_complete);
      },
      getEnergy(e){
        this.historyData.common_energy = e.default
        this.historyData.common_energy_text = e.textarea
        this.historyGroup.step = 8
        this.historyGroup.step_complete = 8
        this.$emit('changePage', this.historyGroup.step_complete);
      },
      getSleep(e){
        this.historyData.common_sleep = e.default
        this.historyData.common_sleep_text = e.textarea
        this.historyGroup.step = 9
        this.historyGroup.step_complete = 9
        this.$emit('changePage', this.historyGroup.step_complete);
      },
      getPain(e, index){
        this.historyData.pain_places[index].pain_place = e.place
        this.historyData.pain_places[index].place_pain_number = e.power
        if(index == 0){
          this.historyGroup.step = 10
          this.historyGroup.step_complete = 10
        } else {
          this.historyGroup.step = 15
          this.historyGroup.step_complete = 15
        }
        this.$emit('changePage', this.historyGroup.step_complete);
      },
      getPainTime(e, index){
        this.historyData.pain_places[index].pain_yy = e.years
        this.historyData.pain_places[index].pain_mm = e.months
        this.historyData.pain_places[index].pain_dd = e.days
        if(index == 0){
          this.historyGroup.step = 11
          this.historyGroup.step_complete = 11
        } else {
          this.historyGroup.step = 16
          this.historyGroup.step_complete = 16
        }
        this.$emit('changePage', this.historyGroup.step_complete);
      },
      getWhenPain(e, index){
        this.historyData.pain_places[index].when_pain = e.time
        this.historyData.pain_places[index].when_pain_alt = e.time_alt
        if(index == 0){
          this.historyGroup.step = 12
          this.historyGroup.step_complete = 12
        } else {
          this.historyGroup.step = 17
          this.historyGroup.step_complete = 17
        }
        this.$emit('changePage', this.historyGroup.step_complete);
      },
      getDiagnosis(e, index){
        this.historyData.pain_places[index].diagnosis = e
        if(index == 0){
          this.historyGroup.step = 13
          this.historyGroup.step_complete = 13
        } else {
          this.historyGroup.step = 18
          this.historyGroup.step_complete = 18
        }
        this.$emit('changePage', this.historyGroup.step_complete);
      },
      getMorePain(e){
        this.historyGroup.haveMorePain = e
        if(e){
          let add_more_pain_place = {
            pain_place: null,
            place_pain_number: 5,
            pain_yy:null,
            pain_mm:null,
            pain_dd:null,
            when_pain: [],
            when_pain_alt: '',
            diagnosis: '',
            is_setup_second_pain: true
          }
          this.historyData.pain_places.push(add_more_pain_place)
          this.historyGroup.step_count = 19
        } else {
          if(this.historyData.pain_places.length > 1){
            this.historyData.pain_places.splice(1, 1)
          }
          this.historyGroup.step_count = 15
        }
        this.historyGroup.step = 14
        this.historyGroup.step_complete = 14
        this.$emit('changePage', this.historyGroup.step_complete);
      },
      getAdditionalPain(e){
        this.historyData.additional_pain_info = e
        if(!this.historyGroup.haveMorePain){
          this.historyGroup.step = 15
          this.historyGroup.step_complete = 15
        } else {
          this.historyGroup.step = 19
          this.historyGroup.step_complete = 19
        }
        this.$emit('changePage', this.historyGroup.step_complete);
      },
      getTreatmentsTried(e){
        this.historyData.pain_try_repare = e.tried
        this.historyData.pain_try_repare_alt = e.tried_alt
        this.$emit('complete', this.historyData);
      },
      goToStep(step){
        if(this.historyGroup.step_complete >= step){
          this.historyGroup.step = step
        }
      },
    },
    components: {
        HistoryIntroductions: () => import(`~/components/new-client/history/HistoryIntroductions.vue`),
        HistoryGender: () => import(`~/components/new-client/history/HistoryGender.vue`),
        HistoryBirthday: () => import(`~/components/new-client/history/HistoryBirthday.vue`),
        HistoryHeightWeight: () => import(`~/components/new-client/history/HistoryHeightWeight.vue`),
        HistoryProfession: () => import(`~/components/new-client/history/HistoryProfession.vue`),
        HistoryHealth: () => import(`~/components/new-client/history/HistoryHealth.vue`),
        HistoryEnergy: () => import(`~/components/new-client/history/HistoryEnergy.vue`),
        HistorySleep: () => import(`~/components/new-client/history/HistorySleep.vue`),
        HistoryPain: () => import(`~/components/new-client/history/HistoryPain.vue`),
        HistoryPainTime: () => import(`~/components/new-client/history/HistoryPainTime.vue`),
        HistoryWhenPain: () => import(`~/components/new-client/history/HistoryWhenPain.vue`),
        HistoryDiagnosis: () => import(`~/components/new-client/history/HistoryDiagnosis.vue`),
        HistoryMorePain: () => import(`~/components/new-client/history/HistoryMorePain.vue`),
        HistoryAdditionalPain: () => import(`~/components/new-client/history/HistoryAdditionalPain.vue`),
        HistoryTreatmentsTried: () => import(`~/components/new-client/history/HistoryTreatmentsTried.vue`),
    }
}
</script>

<style lang="scss">
.history-group{

}
</style>