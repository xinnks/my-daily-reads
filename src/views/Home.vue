<template>
  <p class="p-4 m-4 width-full text-2xl">
    Get customized dev content delivered to your inbox daily.
  </p>

  <div class="flex flex-row items-center justify-center p-4 m-4 width-full">
    <div class="mx-10 p-8 bg-sky-50 hover:bg-sky-100 rounded shadow-sm">
      <svg xmlns="http://www.w3.org/2000/svg" aria-label="dev.to" role="img" viewBox="0 0 512 512" class="h-20 w-20">
        <title>Dev.to</title>
        <rect width="512" height="512" rx="15%"/>
        <path d="m 140.47,203.94 h -17.44 v 104.47 h 17.45 c 10.15529,-0.54503 17.35752,-8.66899 17.47,-17.41 v -69.65 c -0.69578,-10.36382 -7.79596,-17.27188 -17.48,-17.41 z m 45.73,87.25 c 0,18.81 -11.61,47.31 -48.36,47.25 H 91.44 V 172.98 h 47.38 c 35.44,0 47.36,28.46 47.37,47.28 z M 286.88,202.53 H 233.6 v 38.42 h 32.57 v 29.57 H 233.6 v 38.41 h 53.29 v 29.57 h -62.18 c -11.16,0.29 -20.44,-8.53 -20.72,-19.69 V 193.7 c -0.27,-11.15 8.56,-20.41 19.71,-20.69 h 63.19 z m 103.64,115.29 c -13.2,30.75 -36.85,24.63 -47.44,0 l -38.53,-144.8 h 32.57 l 29.71,113.72 29.57,-113.72 h 32.58 z" fill="#fff"/></svg>
    </div>
    <!-- <div class="mx-10 p-8 bg-sky-50 hover:bg-sky-100 rounded shadow-sm">
      <svg width="337" height="337" viewBox="0 0 337 337" fill="none" class="h-20 w-20">
        <title>Hashnode</title>
        <rect x="113" y="113" width="111" height="111" rx="55.5" fill="white"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M23.155 112.598c-30.873 30.874-30.873 80.93 0 111.804l89.443 89.443c30.874 30.873 80.93 30.873 111.804 0l89.443-89.443c30.873-30.874 30.873-80.93 0-111.804l-89.443-89.443c-30.874-30.873-80.93-30.873-111.804 0l-89.443 89.443zm184.476 95.033c21.612-21.611 21.612-56.651 0-78.262-21.611-21.612-56.651-21.612-78.262 0-21.612 21.611-21.612 56.651 0 78.262 21.611 21.612 56.651 21.612 78.262 0z" fill="#2962FF"/>
        </svg>
    </div> -->
  </div>
  
  <notification :notification="notification" v-if="notification.message"></notification>

  <div
    class="flex flex-col px-4 py-2 m-4 max-w-lg mx-auto bg-white rounded-xl shadow-lg sm:py-4">
    <p class="p-4 max-w-lg">
      Provide us with your details and two keywords to get dev content from the above sources tailored to you.
    </p>
    
    <form-message :formNotification="formNotification" v-if="formNotification.message"></form-message>

    <form class="grid grid-cols-4 grid-rows-auto gap-3 place-content-around p-4 m-4">

      <label for="name" class="col-start-1">Name: </label>
      <input type="text" v-model="name" class="col-start-2 col-span-3 h-8 p-4 rounded-sm border-sm ring-2 ring-gray-500" required>

      <label for="email" class="col-start-1">Email: </label>
      <input type="email" v-model="email" class="col-start-2 col-span-3 h-8 p-4 rounded-sm border-sm ring-2 ring-gray-500" required>

      <label for="keywords" class="col-start-1">Keywords: </label>
      <input type="text" v-model="keywords" placeholder="javascript, rust" class="col-start-2 col-span-3 h-8 p-4 rounded-sm border-sm ring-2 ring-gray-500" required>

      <button @click.prevent="submit()" :class="`inline-flex flex-row justify-center col-start-2 col-span-2 h-10 p-2 rounded-md border-gray-700 bg-gray-700 hover:bg-gray-800 text-white ring-2 ring-gray-500 mt-4 ${loading?'cursor-not-allowed':''}`">
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
import { ref } from "vue";
import Notification from "./../components/Notification.vue";
import FormMessage from "./../components/FormMessage.vue";
let name = ref(""),
email = ref(""),
keywords = ref(""),
loading = ref(false),
notification = ref({type: "", message: ""}),
formNotification = ref({type: "", message: ""});

function submit() {
  loading.value = true;
  formNotification.value.type = "";
  formNotification.value.message = "";
  if(!name.value){
    formNotification.value.type = "error";
    formNotification.value.message = "name is required!";
    loading.value = false;
    return;
  }
  if(!email.value){
    formNotification.value.type = "error";
    formNotification.value.message = "email is required!";
    loading.value = false;
    return;
  }
  if(!email.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g)){
    formNotification.value.type = "error";
    formNotification.value.message = "This is not a valid email!";
    loading.value = false;
    return;
  }
  if(!keywords.value){
    formNotification.value.type = "error";
    formNotification.value.message = "Keywords are required!";
    loading.value = false;
    return;
  }
  axios.post("/.netlify/functions/subscribe", {
    name: name.value,
    email: email.value,
    keywords: keywords.value
  })
  .then((response) => {
    console.log(response.data);
    loading.value = false;
    notification.value.type = (response.data.message === "Successfully subscribed!") || (response.data.message === "Email already subscribed!") ? "success" : "error";
    notification.value.message = response.data.message;
    name.value = "";
    email.value = "";
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