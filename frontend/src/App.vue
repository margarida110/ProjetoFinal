<template>
  <div id="app">
    <nav class="navbar">
      <div class="brand">Gestão de Projetos</div>
      <div class="links">
        <router-link to="/">Docentes</router-link>
        <span v-if="!isAuthenticated">
          | <router-link to="/login">Login</router-link>
          | <router-link to="/register">Registo</router-link>
        </span>
        <span v-else>
          | <router-link to="/dashboard">Minhas Propostas</router-link>
          | <a href="#" @click.prevent="logout">Sair</a>
        </span>
      </div>
    </nav>
    <main class="content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isAuthenticated = ref(false);

// Verificar autenticação reativamente
watchEffect(() => {
  isAuthenticated.value = !!localStorage.getItem('token');
});

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  isAuthenticated.value = false;
  router.push('/login');
};
</script>

<style>
/* Estilos Globais Básicos */
body { font-family: Arial, sans-serif; margin: 0; background-color: #f4f4f9; }
.navbar { background: #333; color: white; padding: 1rem; display: flex; justify-content: space-between; }
.navbar a { color: white; text-decoration: none; margin: 0 5px; }
.content { padding: 20px; max-width: 900px; margin: 0 auto; }
.btn { padding: 8px 15px; background: #007BFF; color: white; border: none; cursor: pointer; border-radius: 4px; }
.btn-danger { background: #dc3545; }
input, textarea, select { width: 100%; padding: 8px; margin: 5px 0 15px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;}
.card { background: white; padding: 20px; margin-bottom: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
label { font-weight: bold; }
</style>