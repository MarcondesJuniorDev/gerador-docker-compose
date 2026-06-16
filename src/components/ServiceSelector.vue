<script setup>
import { onMounted } from 'vue'
import { useDockerStore } from '@/stores/docker'

const store = useDockerStore()

onMounted(() => {
  try {
    (window.adsbygoogle = window.adsbygoogle || []).push({})
  } catch {
    // Silencia erros em ambiente de desenvolvimento local
  }
})
</script>

<template>
  <aside class="w-80 bg-slate-900 border-r border-slate-800 text-slate-100 flex flex-col h-full overflow-hidden">
    <!-- Header -->
    <div class="p-6 border-b border-slate-800 bg-slate-950/50">
      <div class="flex items-center gap-3">
        <div class="p-2 bg-indigo-600 rounded-lg text-white font-bold shadow-md shadow-indigo-500/20">
          🐳
        </div>
        <div>
          <h1 class="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Compose Builder
          </h1>
          <p class="text-xs text-slate-500 font-medium">Gerador Visual de Docker Compose</p>
        </div>
      </div>
    </div>

    <!-- Container com scroll para Presets e Categorias -->
    <div class="flex-1 overflow-y-auto flex flex-col gap-6 py-5">
      
      <!-- Presets Populares -->
      <div class="px-5 border-b border-slate-800/50 pb-5 flex flex-col gap-3">
        <h2 class="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
          Presets Rápidos
        </h2>
        <div class="grid grid-cols-1 gap-2">
          <button
            v-for="preset in store.presets"
            :key="preset.id"
            @click="store.loadPreset(preset.id)"
            class="flex flex-col items-start p-3 bg-slate-800/40 hover:bg-amber-500/10 border border-slate-800 hover:border-amber-500/30 rounded-xl transition-all duration-300 text-left group"
          >
            <div class="flex items-center justify-between w-full">
              <span class="font-semibold text-xs text-slate-200 group-hover:text-amber-400 transition-colors">
                {{ preset.name }}
              </span>
              <span class="text-[10px] text-slate-500 group-hover:text-amber-400/80 transition-colors">
                Carregar ➔
              </span>
            </div>
            <p class="text-[10px] text-slate-400 mt-1 leading-normal">
              {{ preset.description }}
            </p>
          </button>
        </div>
      </div>

      <!-- Lista de Categorias de Serviços -->
      <div class="px-5 flex flex-col gap-6">
        <div v-for="category in store.categories" :key="category.name" class="flex flex-col gap-2">
          <h2 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
            {{ category.name }}
          </h2>
          
          <div class="grid grid-cols-1 gap-2.5">
            <button
              v-for="service in category.services"
              :key="service.type"
              @click="store.addService(service.type)"
              class="flex flex-col items-start p-3 bg-slate-800/40 hover:bg-indigo-600/10 border border-slate-800 hover:border-indigo-500/30 rounded-xl transition-all duration-300 text-left group"
            >
              <div class="flex items-center justify-between w-full">
                <span class="font-semibold text-sm text-slate-200 group-hover:text-indigo-400 transition-colors">
                  {{ service.label }}
                </span>
                <span class="text-xs text-slate-500 group-hover:text-indigo-400/80 transition-colors">
                  + Adicionar
                </span>
              </div>
              <p class="text-xs text-slate-400 mt-1 leading-relaxed">
                {{ service.description }}
              </p>
            </button>
          </div>
        </div>
      </div>

    </div>

    <!-- Espaço AdSense Sidebar (Vertical/Quadrado) -->
    <div class="p-4 border-t border-slate-800/80 bg-slate-950/40 flex justify-center min-h-[266px]">
      <div class="w-[248px] h-[248px] bg-slate-900/30 border border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center text-[10px] text-slate-500 font-mono p-4 text-center overflow-hidden">
        <ins class="adsbygoogle"
             style="display:block"
             data-ad-client="ca-pub-4947694760683886"
             data-ad-slot="9876543210"
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
      </div>
    </div>

    <!-- Footer / SEO / Info -->
    <div class="p-3 border-t border-slate-800/40 bg-slate-950/20 text-center flex flex-col gap-1">
      <p class="text-[9px] text-slate-600">
        Gerador open-source • 100% Estático
      </p>
      <div class="flex items-center justify-center gap-2 text-[9px] text-slate-500">
        <a href="/politica-de-privacidade.html" target="_blank" class="hover:text-indigo-400 transition-colors">Privacidade</a>
        <span>•</span>
        <a href="/termos-de-uso.html" target="_blank" class="hover:text-indigo-400 transition-colors">Termos de Uso</a>
      </div>
    </div>
  </aside>
</template>
