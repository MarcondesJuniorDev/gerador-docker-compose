<script setup>
import { onMounted, ref } from 'vue'
import ServiceSelector from '@/components/ServiceSelector.vue'
import ServiceCard from '@/components/ServiceCard.vue'
import YamlPreview from '@/components/YamlPreview.vue'
import { useDockerStore } from '@/stores/docker'

const store = useDockerStore()

// Estados para controle de colapso de painéis (somente desktop)
const isSidebarOpen = ref(true)
const isPreviewOpen = ref(true)

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const togglePreview = () => {
  isPreviewOpen.value = !isPreviewOpen.value
}

onMounted(() => {
  try {
    (window.adsbygoogle = window.adsbygoogle || []).push({})
  } catch {
    // Silencia erros em ambiente de desenvolvimento local
  }
})

const clearAll = () => {
  if (confirm('Tem certeza que deseja limpar todos os serviços configurados?')) {
    store.services = []
    store.currentTab = 'select' // Volta para aba de seleção após limpar tudo
  }
}
</script>

<template>
  <div class="flex flex-col md:flex-row h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans antialiased">
    
    <!-- Sidebar / Menu de Seleção -->
    <ServiceSelector
      :class="[
        store.currentTab === 'select' ? 'flex flex-1' : 'hidden md:flex',
        isSidebarOpen ? 'w-full md:w-80 opacity-100' : 'md:w-0 md:opacity-0 md:pointer-events-none md:border-r-0',
        'md:flex-none md:shrink-0 md:border-r md:border-slate-800 transition-all duration-300 ease-in-out overflow-hidden'
      ]"
    />

    <!-- Área de Configuração (Centro) -->
    <main
      :class="[
        store.currentTab === 'config' ? 'flex flex-1' : 'hidden md:flex',
        'md:flex-1 flex-col h-full bg-slate-900/20 overflow-hidden transition-all duration-300'
      ]"
    >
      <!-- Topbar da Área de Configuração -->
      <header class="flex items-center justify-between px-4 md:px-6 py-4 border-b border-slate-800/60 bg-slate-950/10 shrink-0">
        <div class="flex items-center gap-3">
          <!-- Botão Toggle Sidebar (Desktop Only) -->
          <button
            @click="toggleSidebar"
            class="hidden md:flex items-center justify-center p-2 rounded-lg bg-slate-800/40 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white transition-colors"
            :title="isSidebarOpen ? 'Recolher Barra de Serviços' : 'Expandir Barra de Serviços'"
          >
            <!-- Ícone Menu Lateral / Hamburguer adaptado -->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h10M4 18h16" v-if="isSidebarOpen" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" v-else />
            </svg>
          </button>
          
          <div>
            <h2 class="text-sm font-bold text-slate-300">Configuração da Stack</h2>
            <p class="text-xs text-slate-500 hidden sm:block">
              Configure as opções básicas e variáveis de ambiente dos seus containers.
            </p>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <span v-if="store.services.length > 0" class="text-xs text-slate-400 font-medium hidden lg:inline">
            {{ store.services.length }} {{ store.services.length === 1 ? 'serviço selecionado' : 'serviços selecionados' }}
          </span>
          <button
            v-if="store.services.length > 0"
            @click="clearAll"
            class="text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 px-3 py-1.5 rounded-lg border border-rose-500/20 hover:border-rose-500/30 transition-all duration-200"
          >
            Limpar Stack
          </button>

          <!-- Botão Toggle Preview (Desktop Only) -->
          <button
            @click="togglePreview"
            class="hidden md:flex items-center justify-center p-2 rounded-lg bg-slate-800/40 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white transition-colors"
            :title="isPreviewOpen ? 'Ocultar Visualização YAML' : 'Mostrar Visualização YAML'"
          >
            <!-- Ícone Olho (Eye / Eye Off) -->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" v-if="!isPreviewOpen" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" v-else />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" v-if="isPreviewOpen" />
            </svg>
          </button>
        </div>
      </header>

      <!-- Espaço AdSense Topo (Leaderboard 728x90 / Responsivo) -->
      <div class="w-full flex justify-center py-3 px-4 bg-slate-950/20 border-b border-slate-800/50 min-h-[116px] shrink-0">
        <div class="w-full max-w-[728px] h-[90px] bg-slate-900/30 border border-dashed border-slate-800 rounded-xl flex items-center justify-center text-[10px] text-slate-500 font-mono overflow-hidden">
          <ins class="adsbygoogle"
               style="display:inline-block;width:100%;height:90px"
               data-ad-client="ca-pub-4947694760683886"
               data-ad-slot="1234567890"></ins>
        </div>
      </div>

      <!-- Painel de Cards -->
      <div class="flex-1 overflow-y-auto p-4 md:p-8">
        <!-- Estado Vazio -->
        <div
          v-if="store.services.length === 0"
          class="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto py-10"
        >
          <div class="w-16 h-16 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center text-2xl mb-6 animate-pulse">
            🛠️
          </div>
          <h3 class="text-lg font-bold text-slate-200 mb-2">Sua stack está vazia</h3>
          <p class="text-sm text-slate-400 leading-relaxed mb-6">
            Adicione bancos de dados, servidores web e linguagens utilizando o menu lateral. Suas configurações e o arquivo docker-compose.yml serão atualizados em tempo real.
          </p>
          <button
            @click="store.currentTab = 'select'"
            class="md:hidden w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition-all mb-4"
          >
            Adicionar Primeiro Serviço
          </button>
          <div class="inline-flex items-center gap-2 text-xs text-slate-500 bg-slate-900/50 border border-slate-800/80 px-3 py-2 rounded-xl">
            <span class="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></span>
            Selecione um preset ou item na barra lateral
          </div>
        </div>

        <!-- Lista de Cards Ativos -->
        <div v-else class="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <ServiceCard
            v-for="service in store.services"
            :key="service.id"
            :service="service"
          />
        </div>
      </div>
    </main>

    <!-- Preview em Tempo Real (Direita) -->
    <YamlPreview
      :class="[
        store.currentTab === 'yaml' ? 'flex flex-1' : 'hidden md:flex',
        isPreviewOpen ? 'w-full md:w-[420px] xl:w-[480px] opacity-100' : 'md:w-0 md:opacity-0 md:pointer-events-none md:border-l-0',
        'md:flex-none md:shrink-0 md:border-l md:border-slate-800 transition-all duration-300 ease-in-out overflow-hidden'
      ]"
    />

    <!-- Barra de Navegação Inferior (Mobile Only) -->
    <nav class="md:hidden bg-slate-900/95 backdrop-blur border-t border-slate-800 py-2 flex justify-around items-center shrink-0 w-full z-50">
      <button
        @click="store.currentTab = 'select'"
        :class="['flex flex-col items-center gap-1 text-[10px] font-semibold transition-all duration-200', store.currentTab === 'select' ? 'text-indigo-400 scale-105' : 'text-slate-500']"
      >
        <span class="text-lg">🐳</span>
        <span>Serviços</span>
      </button>

      <button
        @click="store.currentTab = 'config'"
        :class="['flex flex-col items-center gap-1 text-[10px] font-semibold transition-all duration-200 relative', store.currentTab === 'config' ? 'text-indigo-400 scale-105' : 'text-slate-500']"
      >
        <span class="text-lg">🛠️</span>
        <span>Configurar</span>
        <span
          v-if="store.services.length > 0"
          class="absolute -top-1.5 -right-2.5 bg-indigo-600 text-[8px] text-white font-extrabold w-4 h-4 rounded-full flex items-center justify-center border border-slate-900"
        >
          {{ store.services.length }}
        </span>
      </button>

      <button
        @click="store.currentTab = 'yaml'"
        :class="['flex flex-col items-center gap-1 text-[10px] font-semibold transition-all duration-200', store.currentTab === 'yaml' ? 'text-indigo-400 scale-105' : 'text-slate-500']"
      >
        <span class="text-lg">📄</span>
        <span>Ver YAML</span>
      </button>
    </nav>
  </div>
</template>

<style>
/* Estilos globais de rolagem para deixar a interface limpa e premium */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.1);
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(148, 163, 184, 0.2);
}
</style>
