<template>
  <input
    class="input"
    :class="[{'input_error': error }, setClass]"
    @input="$emit('input', $event.target.value)"
    @keyup="$emit('keyup', $event)"
    :type="type"
    :placeholder="placeholder"
    
    v-model="proxyValue"
  />
</template>

<script>
import '@/assets/css/input-fields.scss'
export default {
  name: 'inputFields',
  props: {
    type: {
        type: String,
        default: 'text'
    },
    value: [String, Number],
    error: Boolean,
    placeholder: String,
    //Input type
    default: Boolean,
    disabledInput: Boolean,
    searchInput: Boolean,
    darkInput: Boolean
  },
  computed: {
    setClass() {
      const typeInput = this.default
      ? 'default'
      : this.disabledInput ? 'disabledInput'
      : this.darkInput ? 'darkInput'
      : this.searchInput ? 'searchInput'
      : ''
      return 'input_' + typeInput
    },
    proxyValue: {
      get() { return this.value; },
      set(newValue) { this.$emit('input', newValue), this.$emit('focus', newValue) },
      setBlur(newValue) { 
        newValue = false
        this.$emit('blur.native', newValue); 
      },
    }
  }
}
</script>