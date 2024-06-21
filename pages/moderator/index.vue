<template>
  <div class="moderator-page">
    <div class="moderator-page__content">
        <div class="title">
            Создать нового клиента
        </div>
        <div class="pages">
            <div class="pages__page">
                <InputFields 
                v-model.trim="$v.settingsForm.email.$model"
                :error="$v.settingsForm.email.$error"
                default 
                :placeholder="$t('profileSettings.placeholderEmail')"
                />
                <InputFields 
                    v-model.trim="$v.settingsForm.first_name.$model"
                    :error="$v.settingsForm.first_name.$error"
                    default 
                    :placeholder="$t('profileSettings.placeholderName')"
                />
                <InputFields 
                    v-model.trim="$v.settingsForm.last_name.$model"
                    :error="$v.settingsForm.last_name.$error"
                    default 
                    :placeholder="$t('profileSettings.placeholderSurname')"
                />
                <vue-phone-number-input
                    class="registration-new-client__phone"
                    v-model="phone" 
                    @update="countryChanged($event)" 
                    :fetch-country="true"
                    :translations="phoneTranslations"
                    :error="!phoneError"
                />
            </div>
            <div class="pages__page">

            </div>
        </div>
    </div>
  </div>
</template>

<script>
if (process.client) require('@/plugins/vue-phone-number-input.js')
import { required, email, sameAs, minLength, helpers } from 'vuelidate/lib/validators'
const isRussianAlpha = helpers.regex('isRussianAlpha',/^[а-яa-z]*$/i)
export default {
    data: function() {
        return{
            phoneError: false,
            phoneTranslations:{
                countrySelectorLabel: this.$nuxt.$t('profileSettings.placeholderPhone1'),
                countrySelectorError: this.$nuxt.$t('profileSettings.placeholderPhone2'),
                phoneNumberLabel: this.$nuxt.$t('profileSettings.placeholderPhone3'),
                example: this.$nuxt.$t('profileSettings.placeholderPhone4')
            },
            error: false,
            settingsForm: {
                first_name: '',
                last_name: '',
                email: '',
            },
            phone: ''
        }
    },
    validations: {
        settingsForm: {
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
        },
    },
    methods: {
        countryChanged(e) {
            try{
                this.phonePayload = e
                if(e.isValid != undefined){
                    this.phoneError = e.isValid
                }
            } catch {
                this.phonePayload.isValid = false
                this.phoneError = true
            }
        },
    },
    components: {
        Btn: () => import('@/components/controls/Btn.vue'),
        InputFields: () => import('@/components/controls/Input-fields.vue'),
    }
}
</script>

<style lang="scss" scoped>
    .moderator-page{
        height: calc(100vh - 70px);
        position: relative;
        &__content{
            height: 100%;
            width: 350px;
            margin: auto;
            .title{
                margin: auto;
                margin-bottom: 20px;
                text-align: center;
                width: fit-content;
            }
            .pages{
                &__page{
                    .input{
                        width: 100%;
                        margin-bottom: 12px;
                    }
                }
            }
        }
    }
</style>