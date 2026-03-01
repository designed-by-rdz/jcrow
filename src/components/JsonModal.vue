<script setup lang="ts">
import JsonTable from "./JsonTable.vue";

defineProps<{
  data: any;
}>();

defineEmits(["close", "open-nested"]);
</script>

<template>
  <div class="overlay">
    <div class="modal">
      <JsonTable
        :data="data"
        @open-nested="$emit('open-nested', $event)"
      />

      <button @click="$emit('close')">Close</button>
    </div>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: white;
  padding: 20px;
  max-height: 80vh;
  overflow: auto;
}
</style>