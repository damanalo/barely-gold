import { defineNuxtPlugin } from '#app';

import awsExports from '../aws-exports.js'; 

import { Amplify } from 'aws-amplify';

export default defineNuxtPlugin(() => {
  // This ensures the configuration is loaded before any Amplify API call is made.
  Amplify.configure(awsExports);
  
  // Optional: Make Amplify available globally via $amplify
  return {
    provide: {
      amplify: Amplify
    }
  };
});