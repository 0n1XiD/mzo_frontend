<template>
    <form method="POST" onsubmit="return false" class="registration-new-client new-client">
        <div class="new-client__title">{{$t('registrationNewClient.title')}}</div>
        <div class="error-text new-client__error" v-if="error">{{$t('registrationNewClient.error1')}}</div>
        <div class="error-text new-client__error" v-if="emailUsed">{{$t('registrationNewClient.error2')}}</div>
        <InputFields 
            v-model.trim="$v.form.email.$model"
            :error="$v.form.email.$error"
            default 
            :placeholder="$t('registrationNewClient.placeholder1')"
        />
        <InputFields 
            v-model.trim="$v.form.first_name.$model"
            :error="$v.form.first_name.$error"
            default 
            :placeholder="$t('registrationNewClient.placeholder2')"
        />
        <InputFields 
            v-model.trim="$v.form.last_name.$model"
            :error="$v.form.last_name.$error"
            default 
            :placeholder="$t('registrationNewClient.placeholder3')"
        />
        <vue-phone-number-input
            class="registration-new-client__phone"
            v-model="form.phone" 
            @update="countryChanged($event)" 
            :fetch-country="true"
            :translations="phoneTranslations"
            :error="!phoneError"
        />
        <Btn @click="callback($event)" blue :name="$t('registrationNewClient.continueBtn')" class="lg-btn" type="submit"/>
    </form>
</template>

<script>
if (process.client) require('@/plugins/vue-phone-number-input.js')
import { required, email, minLength, helpers } from 'vuelidate/lib/validators'
import '@/assets/css/new-client.scss'
const isRussianAlpha = helpers.regex('isRussianAlpha',/^[а-яa-z]*$/i)

export default {
    props: ['reg_data'],
    data: function() {
        return{
            form: this.reg_data,
            phoneError: false,
            phoneTranslations:{
                countrySelectorLabel: this.$nuxt.$t('registrationNewClient.phonePlaceholder1'),
                countrySelectorError: this.$nuxt.$t('registrationNewClient.phonePlaceholder2'),
                phoneNumberLabel: this.$nuxt.$t('registrationNewClient.phonePlaceholder3'),
                example: this.$nuxt.$t('registrationNewClient.phonePlaceholder4')
            },
            emailUsed: false,
            error: false
        }
    },
    validations: {
        form: {
            first_name: {
                required,
                isRussianAlpha,
                minLength: minLength(2)
            },
            last_name: {
                required,
                isRussianAlpha,
                minLength: minLength(2)
            },
            email: {
                required,
                email
            },
        }
    },
    methods: {
        countryChanged(e) {
            try{
                this.phonePayload = e
                if(e.isValid != undefined){
                    this.phoneError = e.isValid
                }
            }
            catch{

            }
        },
        async callback(e) {
            this.$v.form.$touch()
            if(this.phonePayload.isValid && !this.$v.$invalid){
                this.error = false
                let form_data= {
                    'email': this.form.email.toLowerCase().trim()
                }
                let response = await this.$axios.$post('/api/v1/user/check-valid-email/', form_data, {})
                if(response.message == 'email invalid'){
                    this.emailUsed = true
                } else {
                    this.emailUsed = false
                }
                if (!this.emailUsed){
                    this.form.phone = this.phonePayload.formatNational
                    this.$emit('click', this.form);
                }
            } else {
                this.error = true
                this.emailUsed = false
            }
        }
    },
    watch: {
        reg_data(new_data){
            this.form = new_data
        }
    },
    components: {
        InputFields: () => import('@/components/controls/Input-fields.vue'),
        Btn: () => import('@/components/controls/Btn.vue'),
    }
}
</script>

<style lang="scss">
.registration-new-client{
    &__phone{
        margin-bottom: 10px;
        height: 48px;
        .iti-flag{
            margin-top: 5px;
        }
        .select-country-container, .country-selector, .country-selector__input, input{
            height: 48px !important;
        }
        .input-tel.has-error:not(.is-valid) .input-tel__input{
            border-color: $red !important;
        }
    }
}
</style>