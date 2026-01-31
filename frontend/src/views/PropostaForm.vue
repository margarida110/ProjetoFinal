<template>
  <div>
    <h2>Criar Nova Proposta</h2>
    <form @submit.prevent="submitForm" class="card">
      
      <label>Título do Projeto</label>
      <input v-model="form.titulo" required type="text" placeholder="Ex: Desenvolvimento Web Fullstack" />

      <label>Descrição e Objetivos</label>
      <textarea v-model="form.descricao" required rows="6" placeholder="Descreva o trabalho..."></textarea>

      <label>Palavras-Chave (Separadas por vírgula)</label>
      <input v-model="keywordsString" type="text" placeholder="Javascript, Vue, SQL" />

      <!-- Coorientadores -->
      <label>Coorientadores (Opcional - Use Ctrl+Click para selecionar vários)</label>
      <select v-model="form.coorientadoresIds" multiple class="multi-select">
        <option v-for="doc in docentesList" :key="doc.id" :value="doc.id">
          {{ doc.nome }}
        </option>
      </select>

      <!-- Alunos -->
      <label>Alunos Sugeridos (Opcional - Use Ctrl+Click para selecionar vários)</label>
      <select v-model="form.alunosIds" multiple class="multi-select">
        <option v-for="aluno in alunosList" :key="aluno.id" :value="aluno.id">
          {{ aluno.nome }} ({{ aluno.numero_estudante }})
        </option>
      </select>

      <div class="actions">
        <button type="submit" class="btn">Guardar Proposta</button>
        <button type="button" @click="$router.push('/dashboard')" class="btn btn-danger" style="margin-left: 10px">Cancelar</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';
import { useRouter } from 'vue-router';

const router = useRouter();

// Listas para os selects
const docentesList = ref([]);
const alunosList = ref([]);

// Estado do formulário
const keywordsString = ref('');
const form = ref({
  titulo: '',
  descricao: '',
  coorientadoresIds: [],
  alunosIds: []
});

onMounted(async () => {
  try {
    const [resDocentes, resAlunos] = await Promise.all([
      api.get('/docentes'),
      api.get('/alunos')
    ]);
    
    // Filtrar o próprio utilizador da lista de coorientadores
    const currentUser = JSON.parse(localStorage.getItem('user'));
    docentesList.value = resDocentes.data.filter(d => d.id !== currentUser.id);
    
    alunosList.value = resAlunos.data;
  } catch (err) {
    console.error("Erro ao carregar listas auxiliares");
  }
});

const submitForm = async () => {
  // Converter string de keywords num array limpo
  const keywordsArray = keywordsString.value
    .split(',')
    .map(k => k.trim())
    .filter(k => k.length > 0);

  const payload = {
    titulo: form.value.titulo,
    descricao: form.value.descricao,
    coorientadoresIds: form.value.coorientadoresIds,
    alunosIds: form.value.alunosIds,
    keywords: keywordsArray
  };

  try {
    await api.post('/propostas', payload);
    alert("Proposta criada com sucesso!");
    router.push('/dashboard');
  } catch (err) {
    console.error(err);
    alert("Erro ao criar proposta. Verifique os dados.");
  }
};
</script>

<style scoped>
.multi-select { height: 100px; }
.actions { margin-top: 20px; }
</style>