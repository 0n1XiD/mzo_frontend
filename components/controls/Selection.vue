<template>
    <div class="selection" 
        :class="setClass"  
        @mouseleave="isOpen = false"
    >
        <div class="selection__preview" @click="isOpen = !isOpen" 
            v-bind:class="{'selection__preview_open': isOpen}"
            
        >
            <div class="name">{{ defaultName }}</div>
            <div class="arrow">
                <!-- <img src="@/assets/img/svg/drop-down-arrow.svg" alt="drop"> -->
            </div>
        </div>
        <div class="selection__expand" v-if="isOpen && !disabled && items">
            <div class="selection__item" 
                v-for="(item, index) in items" :key="`item-${index}`"
                @click="activeByItems(item, items)"
                v-bind:class="{'item_active': item.is_active}"
            >
                {{ item }}
            </div>
        </div>
        <div class="selection__expand" v-if="isOpen && !disabled && object">
            <div class="selection__item" 
                v-for="(item, index) in object.items" :key="`item-${index}`"
                @click="activeByItems(item, items)"
                v-bind:class="{'item_active': item.is_active}"
            >
                {{ item }}
            </div>
        </div>
    </div>
</template>

<script>
import '@/assets/css/selection.scss'

export default {
  name: 'selection',
    data: function(){ 
        return {
            isOpen: false,
            transition: 'selectionAnimation',
        }
    },
    props: {
        type: String,
        defaultName: String,
        description: String,
        //Button type
        default: Boolean,
        items: Array,
        object: Object,
        disabled: Boolean,
        pickup: Boolean,
    },
    methods: {
        activeByName(i, items){
            let newName = this.defaultName
            for(let k in items){
                items[k].is_active = false
            }
            i.is_active = true
            newName = i.name
            this.$emit("name", newName);
            this.isOpen = false
        },
        activeByItems(i){
            let newObject = this.object
            newObject.default = i
            this.$emit("name", newObject);
            this.isOpen = false
        },
    },
    computed: {
        setClass() {
        const typeBtn = this.default
        ? 'default'
        : this.disabled
        ? 'disabled'
        : this.pickup
        ? 'pickup'
        : ''
        return 'selection_' + typeBtn 
        }
    },
}
</script>