<script setup lang="ts">
import { isObject, isArray, isPrimitive } from "../utils/typeHelpers";

defineProps<{
  data: any;
}>();

defineEmits(["open-nested"]);
</script>

<template>
  <div>
    <!-- If Array -->
    <table v-if="isArray(data)" border="1">
      <thead>
        <tr>
          <th v-for="(value, key) in data[0]" :key="key">
            {{ key }} , {{ value }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, rowIndex) in data" :key="rowIndex">
          <td v-for="(value, key) in row" :key="key">
            <span v-if="isPrimitive(value)">
              {{ value }}
            </span>

            <button
              v-else
              @click="$emit('open-nested', value)"
            >
              {{ isArray(value) ? "[Array]" : "{Object}" }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- If Object -->
    <table v-else-if="isObject(data)" border="1">
      <tbody>
        <tr v-for="(value, key) in data" :key="key">
          <td>{{ key }}</td>
          <td>
            <span v-if="isPrimitive(value)">
              {{ value }}
            </span>

            <button
              v-else
              @click="$emit('open-nested', value)"
            >
              {{ isArray(value) ? "[Array]" : "{Object}" }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-else>
      {{ data }}
    </div>
  </div>
</template>