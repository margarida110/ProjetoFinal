<template>
  <div class="auth-container">
    <h2>Registo de Docente</h2>
    <form @submit.prevent="handleRegister" class="card">
      <label>Nome Completo</label>
      <input v-model="form.nome" required type="text" />

      <label>Email Institucional</label>
      <input v-model="form.email" required type="email" />

      <label>Password</label>
      <input v-model="form.password" required type="password" />

      <button type="submit" class="btn">Registar</button>
    </form>
    <p v-if="error" style="color: red">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import api from '../services/api';
import { useRouter } from 'vue-router';

const router = useRouter();
const form = ref({ nome: '', email: '', password: '' });
const error = ref('');

const handleRegister = async () => {
  try {
    await api.post('/auth/register', form.value);
    alert("Registo efetuado! Por favor faça login.");
    router.push('/login');
  } catch (err) {
    error.value = err.response?.data?.error || "Erro ao registar.";
  }
};
</script>