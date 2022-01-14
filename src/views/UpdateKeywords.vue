<template>
  <p class="p-4 m-4 width-full text-2xl">
    Update your daily reads content keywords.
  </p>
  
  <notification :notification="notification" v-if="notification.message"></notification>

  <div
    class="flex flex-col p-4 m-4 max-w-lg mx-auto bg-white rounded-xl shadow-lg sm:py-4">
    <p class="p-4 max-w-lg">
        Fill in the OTP from the email we sent you and the new keywords to your My Daily Reads content.
    </p>
    
    <form-message :formNotification="formNotification" v-if="formNotification.message"></form-message>

    <form class="grid grid-cols-4 grid-rows-auto gap-3 place-content-around p-4 m-4">

      <label for="otp" class="col-start-1">OTP: </label>
      <input type="text" v-model="otp" class="col-start-2 col-span-3 h-8 p-4 rounded-sm border-sm ring-2 ring-gray-500" required>

      <label for="keywords" class="col-start-1">Keywords: </label>
      <input type="text" v-model="keywords" placeholder="javascript, rust" class="col-start-2 col-span-3 h-8 p-4 rounded-sm border-sm ring-2 ring-gray-500" required>

      <button @click.prevent="updateKeywords()" :class="`inline-flex flex-row justify-center col-start-2 col-span-2 h-10 p-2 rounded-md border-gray-700 bg-gray-700 hover:bg-gray-800 text-white ring-2 ring-gray-500 mt-4 ${loading?'cursor-not-allowed':''}`">
        <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg> {{ loading ? 'Processing..' : 'UPDATE' }}
      </button>
    
    </form>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref } from "vue";
import Notification from "./../components/Notification.vue";
import FormMessage from "./../components/FormMessage.vue";
let otp = ref(""),
keywords = ref(""),
loading = ref(false),
notification = ref({type: "", message: ""}),
formNotification = ref({type: "", message: ""});

function updateKeywords() {
  loading.value = true;
  formNotification.value.type = "";
  formNotification.value.message = "";
  if(!otp.value){
    formNotification.value.type = "error";
    formNotification.value.message = "OTP is required!";
    loading.value = false;
    return;
  }
  if(!keywords.value){
    formNotification.value.type = "error";
    formNotification.value.message = "Keywords are required!";
    loading.value = false;
    return;
  }
  axios.post("/.netlify/functions/update-keywords", {
    otp: otp.value,
    keywords: keywords.value
  })
  .then((response) => {
    loading.value = false;
    notification.value.type = response.data.message === "You have successfully changed the keywords to your daily dev content." ? "success" : "error";
    notification.value.message = response.data.message;
    otp.value = "";
    keywords.value = "";
    setTimeout(() => {
      notification.value.type = "";
      notification.value.message = "";
    }, 5000)
  })
  .catch(err => {
    loading.value = false;
    console.log(err);
  })
}


</script>