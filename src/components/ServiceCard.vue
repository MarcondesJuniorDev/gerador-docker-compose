<script setup>
import { useDockerStore } from '@/stores/docker'

const props = defineProps({
  service: {
    type: Object,
    required: true
  }
})

const store = useDockerStore()

const handleRemove = () => {
  store.removeService(props.service.id)
}

const updateName = (e) => {
  const newName = e.target.value.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '')
  store.updateService(props.service.id, { name: newName || props.service.type })
}

const updateTag = (e) => {
  store.updateService(props.service.id, { tag: e.target.value.trim() })
}

const updateCommand = (e) => {
  store.updateService(props.service.id, { command: e.target.value })
}

const updatePort = (index, field, value) => {
  const updatedPorts = [...props.service.ports]
  updatedPorts[index] = { ...updatedPorts[index], [field]: value }
  store.updateService(props.service.id, { ports: updatedPorts })
}

const updateEnv = (index, value) => {
  const updatedEnv = [...props.service.env]
  updatedEnv[index] = { ...updatedEnv[index], value }
  store.updateService(props.service.id, { env: updatedEnv })
}

const updateVolume = (index, field, value) => {
  const updatedVolumes = [...props.service.volumes]
  updatedVolumes[index] = { ...updatedVolumes[index], [field]: value }
  store.updateService(props.service.id, { volumes: updatedVolumes })
}
</script>

<template>
  <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 relative group overflow-hidden">
    <!-- Efeito de hover decorativo -->
    <div class="absolute top-0 left-0 w-2 h-full bg-indigo-500 transition-all duration-300"></div>

    <!-- Header do Card -->
    <div class="flex items-start justify-between mb-5 pl-2">
      <div>
        <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/10 mb-2">
          {{ service.type.toUpperCase() }}
        </span>
        <div class="flex items-center gap-2">
          <input
            type="text"
            :value="service.name"
            @input="updateName"
            class="text-lg font-bold text-slate-100 bg-transparent border-b border-transparent hover:border-slate-700 focus:border-indigo-500 focus:outline-none transition-colors py-0.5 px-1 w-48"
            placeholder="Nome do serviço"
          />
        </div>
      </div>
      <button
        @click="handleRemove"
        class="text-slate-500 hover:text-rose-400 p-2 hover:bg-slate-800/80 rounded-xl transition-all duration-300"
        title="Remover serviço"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>

    <div class="space-y-5 pl-2">
      <!-- Configurações de Imagem/Tag -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Imagem Docker</label>
          <input
            type="text"
            :value="service.image"
            disabled
            class="w-full bg-slate-950/60 border border-slate-800 rounded-lg py-2 px-3 text-sm text-slate-400 cursor-not-allowed"
          />
        </div>
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Tag / Versão</label>
          <input
            type="text"
            :value="service.tag"
            @input="updateTag"
            class="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 focus:outline-none rounded-lg py-2 px-3 text-sm text-slate-200 transition-colors"
            placeholder="Ex: 8.0, latest"
          />
        </div>
      </div>

      <!-- Comando de Inicialização (se aplicável) -->
      <div v-if="service.command !== undefined">
        <label class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Comando de Inicialização (command)</label>
        <input
          type="text"
          :value="service.command"
          @input="updateCommand"
          class="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 focus:outline-none rounded-lg py-2 px-3 text-sm text-slate-200 font-mono transition-colors"
          placeholder="Ex: npm run dev, python app.py"
        />
      </div>

      <!-- Configurações de Portas (se existirem) -->
      <div v-if="service.ports && service.ports.length > 0">
        <label class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Mapeamento de Portas</label>
        <div class="space-y-2">
          <div v-for="(port, idx) in service.ports" :key="idx" class="flex items-center gap-2">
            <input
              type="text"
              :value="port.host"
              @input="(e) => updatePort(idx, 'host', e.target.value)"
              class="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 focus:outline-none rounded-lg py-2 px-3 text-sm text-slate-200 text-center transition-colors"
              placeholder="Host (Ex: 8080)"
            />
            <span class="text-slate-600 font-bold">:</span>
            <input
              type="text"
              :value="port.container"
              @input="(e) => updatePort(idx, 'container', e.target.value)"
              class="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 focus:outline-none rounded-lg py-2 px-3 text-sm text-slate-200 text-center transition-colors"
              placeholder="Container"
            />
          </div>
        </div>
      </div>

      <!-- Variáveis de Ambiente (se existirem) -->
      <div v-if="service.env && service.env.length > 0" class="border-t border-slate-800/60 pt-4">
        <label class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Variáveis de Ambiente</label>
        <div class="space-y-3">
          <div v-for="(envVar, idx) in service.env" :key="envVar.key" class="flex flex-col gap-1">
            <span class="text-[11px] font-semibold text-slate-500">{{ envVar.label }} ({{ envVar.key }})</span>
            <input
              :type="envVar.type"
              :value="envVar.value"
              @input="(e) => updateEnv(idx, e.target.value)"
              class="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 focus:outline-none rounded-lg py-2 px-3 text-sm text-slate-200 transition-colors"
              :placeholder="`Digite o valor para ${envVar.key}`"
            />
          </div>
        </div>
      </div>

      <!-- Volumes (se existirem) -->
      <div v-if="service.volumes && service.volumes.length > 0" class="border-t border-slate-800/60 pt-4">
        <label class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Volumes / Persistência</label>
        <div class="space-y-2">
          <div v-for="(vol, idx) in service.volumes" :key="idx" class="flex items-center gap-2">
            <input
              type="text"
              :value="vol.host"
              @input="(e) => updateVolume(idx, 'host', e.target.value)"
              class="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 focus:outline-none rounded-lg py-2 px-3 text-sm text-slate-200 transition-colors"
              placeholder="Host/Nome Volume"
            />
            <span class="text-slate-600 font-bold">➔</span>
            <input
              type="text"
              :value="vol.container"
              @input="(e) => updateVolume(idx, 'container', e.target.value)"
              class="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 focus:outline-none rounded-lg py-2 px-3 text-sm text-slate-200 transition-colors"
              placeholder="Container Path"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
