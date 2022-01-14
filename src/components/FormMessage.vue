<template>
  <div :class="`${formNotification.type === 'success' ? 'bg-green-100 ring-green-300 text-green-600' : 'bg-red-100 ring-red-300 text-red-600'} font-semibold ring-2 rounded p-2`" v-if="formNotification.message">
    {{ formNotification.message }}
  </div>
</template>

<script>
  export default {
  props: {
    formNotification: {
      type: Object,
      required: true
    }
  }
}
</script>