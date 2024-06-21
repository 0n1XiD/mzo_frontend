<template>
    <div class="radio-button" :class="setClass">
        <input
            class="custom-radio"
            type="radio"
            :id="id"
            :name="radioName"
            :value="val"
            :checked="checked"
            v-model="proxyValue"
            @input="$emit('input', $event.target.value)"
        />
        <label class="custom-radio-label" :for="id">{{ name }}</label>
    </div>
</template>

<script>
import '@/assets/css/radio-button.scss'
export default {
  name: 'checkbox',
    props: {
        radioName: String,
        name: String,
        id: String,
        val: [String, Number, Boolean],
        //Radio type
        default: Boolean,
        checked: Boolean,
    },
    computed: {
        setClass() {
            const typeCheckbox = this.default
            ? 'default'
            : ''
            return 'radio-button_' + typeCheckbox
        },
        proxyValue: {
            get() { 
                if(this.checked){
                    return this.val
                }
            },
            set(newValue) { this.$emit('input', newValue), this.$emit('focus', newValue) },
            setBlur(newValue) { 
                newValue = false
                this.$emit('blur.native', newValue); 
            },
        }
    }
}
</script>