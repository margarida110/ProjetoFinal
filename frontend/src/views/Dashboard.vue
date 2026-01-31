<template>
  <div>
    <div class="header-dash">
      <h1>As Minhas Propostas</h1>
      <button @click="$router.push('/proposta/nova')" class="btn">Nova Proposta +</button>
    </div>

    <div v-if="loading">A carregar propostas...</div>

    <div v-else>
      <div v-if="propostas.length === 0">Não tem propostas criadas.</div>
      
      <div v-for="prop in propostas" :key="prop.id" class="card">
        <div class="card-header">
          <h3>{{ prop.titulo }}</h3>
          <button @click="deleteProposta(prop.id)" class="btn btn-danger">Apagar</button>
        </div>
        <p><strong>Descrição:</strong> {{ prop.descricao }}</p>
        
        <div class="meta-info">
          <p><strong>Palavras-Chave:</strong> 
            <span v-for="kw in prop.keywords" :key="kw" class="tag">{{ kw }} </span>
          </p>
          <p><strong>Coorientadores:</strong> 
            <span v-if="prop.coorientadores">{{ prop.coorientadores.map(c => c.nome).join(', ') }}</span>
            <span v-else>Nenhum</span>
          </p>
          <p><strong>Alunos Sugeridos:</strong>
             <span v-if="prop.alunos">{{ prop.alunos.map(a => a.nome).join(', ') }}</span>
             <span v-else>Aberto a todos</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';

const propostas = ref([]);
const loading = ref(true);

const loadPropostas = async () => {
  try {
    const res = await api.get('/propostas');
    propostas.value = res.data;
  } catch (err) {
    alert("Erro ao carregar dados.");
  } finally {
    loading.value = false;
  }
};

const deleteProposta = async (id) => {
  if (!confirm("Tem a certeza que deseja eliminar esta proposta?")) return;
  
  try {
    await api.delete(`/propostas/${id}`);
    propostas.value = propostas.value.filter(p => p.id !== id);
  } catch (err) {
    alert("Erro ao apagar.");
  }
};

onMounted(loadPropostas);
</script>

<style scoped>
.header-dash { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.card-header { display: flex; justify-content: space-between; align-items: flex-start; }
.tag { background: #e0e0e0; padding: 2px 6px; border-radius: 4px; margin-right: 5px; font-size: 0.9em; }
.meta-info p { margin: 5px 0; font-size: 0.95em; color: #555; }
</style>