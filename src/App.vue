<script setup>
import { onMounted } from 'vue'
import ServiceSelector from '@/components/ServiceSelector.vue'
import ServiceCard from '@/components/ServiceCard.vue'
import YamlPreview from '@/components/YamlPreview.vue'
import { useDockerStore } from '@/stores/docker'

const store = useDockerStore()

onMounted(() => {
  try {
    (window.adsbygoogle = window.adsbygoogle || []).push({})
  } catch (e) {
    // Silencia erros em ambiente de desenvolvimento local
  }
})

const clearAll = () => {
  if (confirm('Tem certeza que deseja limpar todos os serviços configurados?')) {
    store.services = []
  }
}
</script>

<template>
  <div class="flex h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans antialiased">
    <!-- Sidebar / Menu de Seleção -->
    <ServiceSelector />

    <!-- Área de Configuração (Centro) -->
    <main class="flex-1 flex flex-col h-full bg-slate-900/20 overflow-hidden">
      <!-- Topbar da Área de Configuração -->
      <header class="flex items-center justify-between px-8 py-4 border-b border-slate-800/60 bg-slate-950/10">
        <div>
          <h2 class="text-sm font-bold text-slate-300">Configuração da Stack</h2>
          <p class="text-xs text-slate-500">
            Configure as opções básicas e variáveis de ambiente dos seus containers.
          </p>
        </div>
        <div v-if="store.services.length > 0" class="flex items-center gap-4">
          <span class="text-xs text-slate-400 font-medium">
            {{ store.services.length }} {{ store.services.length === 1 ? 'serviço selecionado' : 'serviços selecionados' }}
          </span>
          <button
            @click="clearAll"
            class="text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 px-3 py-1.5 rounded-lg border border-rose-500/20 hover:border-rose-500/30 transition-all duration-200"
          >
            Limpar Stack
          </button>
        </div>
      </header>

      <!-- Espaço AdSense Topo (Leaderboard 728x90 / Responsivo) -->
      <div class="w-full flex justify-center py-3 bg-slate-950/20 border-b border-slate-800/50 min-h-[116px] shrink-0">
        <div class="w-[728px] h-[90px] bg-slate-900/30 border border-dashed border-slate-800 rounded-xl flex items-center justify-center text-[10px] text-slate-500 font-mono overflow-hidden">
          <ins class="adsbygoogle"
               style="display:inline-block;width:728px;height:90px"
               data-ad-client="ca-pub-4947694760683886"
               data-ad-slot="1234567890"></ins>
        </div>
      </div>

      <!-- Painel de Cards -->
      <div class="flex-1 overflow-y-auto p-8">
        <!-- Estado Vazio -->
        <div
          v-if="store.services.length === 0"
          class="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto"
        >
          <div class="w-16 h-16 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center text-2xl mb-6 animate-pulse">
            🛠️
          </div>
          <h3 class="text-lg font-bold text-slate-200 mb-2">Sua stack está vazia</h3>
          <p class="text-sm text-slate-400 leading-relaxed mb-6">
            Adicione bancos de dados, servidores web e linguagens utilizando o menu lateral. Suas configurações e o arquivo docker-compose.yml serão atualizados em tempo real.
          </p>
          <div class="inline-flex items-center gap-2 text-xs text-slate-500 bg-slate-900/50 border border-slate-800/80 px-3 py-2 rounded-xl">
            <span class="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></span>
            Clique em qualquer item na barra lateral para começar
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
    <YamlPreview class="w-[480px]" />
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

