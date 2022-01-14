<template>
  <div
    class="flex flex-col p-4 m-4 max-w-lg mx-auto rounded-xl shadow-lg sm:py-4" :class="`${notification.type === 'success' ? 'bg-green-100 ring-green-300 text-green-600' : 'bg-red-100 ring-red-300 text-red-600'} font-semibold ring-2`">
      {{ notification.message }}
  </div>
</template>

<script>
  export default {
  props: {
    notification: {
      type: Object,
      required: true
    }
  }
}
</script>