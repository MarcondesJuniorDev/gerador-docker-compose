<script setup>
import { ref } from 'vue'
import { useDockerStore } from '@/stores/docker'

const store = useDockerStore()
const copied = ref(false)

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(store.generatedYaml)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Falha ao copiar:', err)
  }
}

const downloadYaml = () => {
  const blob = new Blob([store.generatedYaml], { type: 'text/yaml' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'docker-compose.yml'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
</script>

<template>
  <div class="flex flex-col bg-slate-950 h-full">
    <!-- Header do Editor -->
    <div class="flex items-center justify-between px-6 py-4 bg-slate-900 border-b border-slate-800">
      <div class="flex items-center gap-2.5">
        <!-- Indicador estilo aba do editor -->
        <span class="w-3 h-3 rounded-full bg-emerald-500"></span>
        <span class="font-mono text-sm font-semibold text-slate-300">docker-compose.yml</span>
      </div>
      <div class="flex items-center gap-2">
        <!-- Botão de Copiar -->
        <button
          @click="copyToClipboard"
          :disabled="!store.services.length"
          class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 border"
          :class="[
            copied
              ? 'bg-emerald-600/10 text-emerald-400 border-emerald-500/20'
              : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed'
          ]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4.5 w-4.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              v-if="copied"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.5"
              d="M5 13l4 4L19 7"
            />
            <path
              v-else
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
            />
          </svg>
          {{ copied ? 'Copiado!' : 'Copiar' }}
        </button>

        <!-- Botão de Download -->
        <button
          @click="downloadYaml"
          :disabled="!store.services.length"
          class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4.5 w-4.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          Download
        </button>
      </div>
    </div>

    <!-- Bloco de Código YAML -->
    <div class="flex-1 overflow-auto p-6 font-mono text-sm leading-relaxed text-slate-300 selection:bg-indigo-500/30">
      <pre class="whitespace-pre-wrap select-all font-mono">{{ store.generatedYaml }}</pre>
    </div>
  </div>
</template>

<style scoped>
pre {
  font-family: 'Fira Code', 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}
</style>
