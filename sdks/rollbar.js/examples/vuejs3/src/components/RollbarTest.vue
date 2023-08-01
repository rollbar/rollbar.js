<template>
  <div>
    <button @click="triggerError">Trigger Error</button>
  </div>
</template>

<script>
export default {
  methods: {
    triggerError() {
      // Simulate an error
      throw new Error('Testing Rollbar integration');
    },
  },
};
</script>
