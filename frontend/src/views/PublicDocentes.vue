<template>
  <div>
    <h1>Lista de Docentes</h1>
    <p>Consulte aqui os orientadores disponíveis para projetos finais.</p>
    
    <div v-if="loading">A carregar...</div>
    
    <div class="grid-docentes" v-else>
      <div v-for="docente in docentes" :key="docente.id" class="card">
        <h3>{{ docente.nome }}</h3>
        <p>Email: {{ docente.email }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';

const docentes = ref([]);
const loading = ref(true);

onMounted(async () => {
  try {
    const response = await api.get('/docentes');
    docentes.value = response.data;
  } catch (error) {
    console.error("Erro ao carregar docentes", error);
  } finally {
    loading.value = false;
  }
});
</script>