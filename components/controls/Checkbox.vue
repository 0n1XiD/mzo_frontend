<template>
    <div class="checkbox" :class="setClass" @click="callback($event)">
        <input 
            class="custom-checkbox" 
            type="checkbox" 
            :checked="isChecked" 
            :value="value" 
            @change="updateInput"
            :disabled="disabled"
        >
        <label class="custom-label" :for="id">{{ name }}</label>
    </div>
</template>

<script>
import '@/assets/css/checkbox.scss'
export default {
  model: {
        prop: 'modelValue',
        event: 'change'
},
  name: 'checkbox',
    props: {
        name: String,
        id: String,
        disable: Boolean,
        val: [Boolean],

        value: { type: [String, Array, Number, Boolean] },
        modelValue: { default: "" },
        trueValue: { default: true },
        falseValue: { default: false },
        //Button type
        button: Boolean,
        default: Boolean,
        checked: Boolean,
        switcher: Boolean,
        disabled: Boolean,
        group: String
    },
    methods: {
        callback: function(e) {
            this.$emit('click', e);
        },
        updateInput(event) {
            let isChecked = event.target.checked
            if (this.modelValue instanceof Array) {
                let newValue = [...this.modelValue]
                if (isChecked) {
                    newValue.push(this.value)
                } else {
                    newValue.splice(newValue.indexOf(this.value), 1)
                }
                    this.$emit('change', newValue)
            } else {
                this.$emit('change', isChecked ? this.trueValue : this.falseValue)
            }
        }
    },
    computed: {
        setClass() {
            const typeCheckbox = this.button
            ? 'button'
            : this.default
            ? 'default'
            : this.switcher
            ? 'switcher'
            : ''
            return 'checkbox_' + typeCheckbox
        },
        isChecked() {
            if (this.modelValue instanceof Array) {
                return this.modelValue.includes(this.value)
            }
            // Note that `true-value` and `false-value` are camelCase in the JS
            return this.modelValue === this.trueValue
        },
        proxyValue: {
            get() { return this.val; },
            set(newValue) { 
                this.$emit('input', newValue), 
                this.$emit('focus', newValue), 
                this.$emit('change', newValue) 
            },
        }
    },
}
</script>