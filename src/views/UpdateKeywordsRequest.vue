<template>

  <p class="p-4 m-4 width-full text-2xl">
    Update your daily reads content keywords.
  </p>
  
  <notification :notification="notification" v-if="notification.message"></notification>

  <div
    class="flex flex-col p-4 m-4 max-w-lg mx-auto bg-white rounded-xl shadow-lg sm:py-4">
    <p class="p-4 max-w-lg">
      We need to verify that you own this email account, fill in your email to receive a one time password.
    </p>
    
    <form-message :formNotification="formNotification" v-if="formNotification.message"></form-message>

    <form class="grid grid-cols-4 grid-rows-auto gap-3 place-content-around p-4 m-4">
      
      <label for="email" class="col-start-1">Email: </label>
      <input type="email" v-model="email" class="col-start-2 col-span-3 h-8 p-4 rounded-sm border-sm ring-2 ring-gray-500" required>
      
      <button @click.prevent="update()" :class="`inline-flex flex-row justify-center col-start-2 col-span-2 h-10 p-2 rounded-md border-gray-700 bg-gray-700 hover:bg-gray-800 text-white ring-2 ring-gray-500 mt-4 ${loading?'cursor-not-allowed':''}`">
        <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg> {{ loading ? 'Processing..' : 'SUBMIT' }}
      </button>
    
    </form>
  </div>
  
</template>

<script setup>
import axios from "axios";
import { useRouter } from "vue-router";
import Notification from "./../components/Notification.vue";
import FormMessage from "./../components/FormMessage.vue";
import { ref } from "vue";
const router = useRouter();
let email = ref(""),
loading = ref(false),
notification = ref({type: "", message: ""}),
formNotification = ref({type: "", message: ""});

function update() {
  loading.value = true;
  formNotification.value.type = "";
  formNotification.value.message = "";
  if(!email.value){
    formNotification.value.type = "error";
    formNotification.value.message = "email is required!";
    loading.value = false;
    return;
  }
  axios.post("/.netlify/functions/update", {
    email: email.value
  })
  .then((response) => {
    loading.value = false;
    notification.value.type = response.data.message === "No user with email!" ? "success" : "error";
    notification.value.message =response.data.message === "No user with email!" ? "OTP Email Sent" : "Oop! Please retry that.";
    email.value = "";
    router.push("/");
  })
  .catch(err => {
    loading.value = false;
    console.log(err);
  })
}


</script>