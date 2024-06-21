<template>
  <button
    class="btn"
    :class="setClass"
    :type="type"
    @click="callback($event)"
    :disabled="disabled"
  >
    <slot>
      {{ name }}
    </slot>
  </button>
</template>

<script>
import '@/assets/css/btn.scss'

export default {
  name: 'btn',
  props: {
    type: String,
    name: String,
    disabled: Boolean,
    //Button type
    blueBorder: Boolean,
    blue: Boolean,
    search: Boolean,
    delete: Boolean,
    drop: Boolean,
    sendBtn: Boolean
  },
  methods: {
    callback: function(e) {
      this.$emit('click', e);
    }
  },
  computed: {
    setClass() {
      const typeBtn = this.blueBorder
      ? 'blue-border'
      : this.blue
      ? 'blue'
      : this.delete
      ? 'delete'
      : this.search
      ? 'search'
      : this.drop
      ? 'drop'
      : this.sendBtn
      ? 'sendBtn'
      : ''
      return 'btn_' + typeBtn 
    }
  }
}
</script>