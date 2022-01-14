<template>

  <p class="p-4 m-4 width-full text-2xl">
    Unsubscribe from My Daily Reads.
  </p>
  
  <notification :notification="notification" v-if="notification.message"></notification>

  <div
    class="flex flex-col p-4 m-4 max-w-lg mx-auto bg-white rounded-xl shadow-lg sm:py-4">
    <p class="p-4 max-w-lg">
      {{requestLoading ? "Let's see if we recognize you..." : ""}}
      {{sentUnsubscriptionRequest ? "We just sent a one time password to your email." : ""}}
    </p>

    <div class="flex flex-row justify-center">
      <svg :class="`${requestLoading ? 'animate-spin':''} -ml-1 mr-3 h-5 w-5 text-gray-700`" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" v-if="requestLoading">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>
    
    <form-message :formNotification="formNotification" v-if="formNotification.message"></form-message>

    <form class="grid grid-cols-4 grid-rows-auto gap-3 place-content-around p-4 m-4" v-if="sentUnsubscriptionRequest && !finalizedUnsubscription">
      
      <label for="otp" class="col-start-1">OTP: </label>
      <input type="otp" v-model="otp" class="col-start-2 col-span-3 h-8 p-4 rounded-sm border-sm ring-2 ring-gray-500" required>

      <button @click.prevent="unsubscribe()" :class="`inline-flex flex-row justify-center col-start-2 col-span-2 h-10 p-2 rounded-md border-gray-700 bg-gray-700 hover:bg-gray-800 text-white ring-2 ring-gray-500 mt-4 ${confirmLoading?'cursor-not-allowed':''}`">
        <svg v-if="confirmLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg> {{ confirmLoading ? 'Processing..' : 'UNSUBSCRIBE' }}
      </button>
    
    </form>
  </div>
  
</template>

<script setup>
import axios from "axios";
import { useRoute, useRouter } from "vue-router";
import { ref } from "vue";
import Notification from "./../components/Notification.vue";
import FormMessage from "./../components/FormMessage.vue";
const route = useRoute();
const router = useRouter();
let email = ref(""),
otp = ref(""),
requestLoading = ref(true),
confirmLoading = ref(false),
sentUnsubscriptionRequest = ref(false),
finalizedUnsubscription = ref(false),
notification = ref({type: "", message: ""}),
formNotification = ref({type: "", message: ""});

email.value = route.params.email;
// console.log("route.params.email: -- ", route.params.email)

function unsubscribeRequest() {
  if(!email.value){
    formNotification.value.type = "error";
    formNotification.value.message = "email is required!";
    requestLoading.value = false;
    return;
  }
  axios.post("/.netlify/functions/unsubscribe-request", {
    email: email.value
  })
  .then((response) => {
    notification.value.type = response.data.message === "Email Sent!" ? "success" : "error";
    notification.value.message =response.data.message === "No user with email!" ? "Account doesn't exist." : "Oops! Please refresh the page.";
    requestLoading.value = false;
    if(notification.value.type = response.data.message === "Email Sent!"){
      sentUnsubscriptionRequest.value = true;
    }
  })
  .catch(err => {
    requestLoading.value = false;
    console.log(err);
  })
}
unsubscribeRequest();

function unsubscribe() {
  confirmLoading.value = true;
  formNotification.value.type = "";
  formNotification.value.message = "";
  if(!otp.value){
    formNotification.value.type = "error";
    formNotification.value.message = "otp is required!";
    loading.value = false;
    return;
  }
  axios.post("/.netlify/functions/unsubscribe", {
    email: email.value
  })
  .then((response) => {
    confirmLoading.value = false;
    notification.value.type = response.data.message === "Successfully unsubscribed!" ? "success" : "error";
    email.value = "";
    if(response.data.message === "Successfully unsubscribed!"){
      finalizedUnsubscription.value = true;
      setTimeout(() => { router.push("/") }, 3000);
    } else if(response.data.message === "No user with email!"){
      notification.value.message = "This account has already been unsubscribed!";
      setTimeout(() => { router.push("/") }, 3000);
    } else if(response.data.message === "OTP expired!"){
      notification.value.message = "The one time password has expired!";
    } else {
      notification.value.message = "Oops, some error on our side, please refresh!";
    }
  })
  .catch(err => {
    confirmLoading.value = false;
    console.log(err);
  })
}


</script>