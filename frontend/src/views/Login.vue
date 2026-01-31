<template>
  <div class="auth-container">
    <h2>Login Docente</h2>
    <form @submit.prevent="handleLogin" class="card">
      <label>Email</label>
      <input v-model="email" required type="email" />

      <label>Password</label>
      <input v-model="password" required type="password" />

      <button type="submit" class="btn">Entrar</button>
    </form>
    <p v-if="error" style="color: red">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import api from '../services/api';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const error = ref('');
const router = useRouter();

const handleLogin = async () => {
  try {
    const res = await api.post('/auth/login', { email: email.value, password: password.value });
    
    // Guardar token e user info
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    
    // Forçar atualização do estado no App.vue 
    window.location.href = '/dashboard'; 
  } catch (err) {
    error.value = err.response?.data?.error || "Credenciais inválidas.";
  }
};
</script>