import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

export const useDockerStore = defineStore('docker', () => {
  // Estado
  const services = ref([])
  const currentTab = ref('select')

  // Recupera do localStorage na inicialização
  const savedServices = localStorage.getItem('compose_builder_services')
  if (savedServices) {
    try {
      services.value = JSON.parse(savedServices)
      currentTab.value = services.value.length > 0 ? 'config' : 'select'
    } catch (e) {
      console.error('Falha ao restaurar serviços do localStorage:', e)
    }
  }

  // Persiste no localStorage sempre que houver mudanças
  watch(
    services,
    (newServices) => {
      localStorage.setItem('compose_builder_services', JSON.stringify(newServices))
    },
    { deep: true }
  )

  // Modelos de serviço pré-definidos
  const serviceTemplates = {
    // BANCOS DE DADOS
    mysql: {
      type: 'mysql',
      name: 'mysql',
      image: 'mysql',
      tag: '8.0',
      ports: [{ host: '3306', container: '3306' }],
      env: [
        { key: 'MYSQL_ROOT_PASSWORD', value: 'root_password', label: 'Senha do Root', type: 'password' },
        { key: 'MYSQL_DATABASE', value: 'app_db', label: 'Nome do Banco', type: 'text' },
        { key: 'MYSQL_USER', value: 'app_user', label: 'Usuário', type: 'text' },
        { key: 'MYSQL_PASSWORD', value: 'app_password', label: 'Senha do Usuário', type: 'password' }
      ],
      volumes: [{ host: 'mysql_data', container: '/var/lib/mysql', type: 'named' }]
    },
    postgres: {
      type: 'postgres',
      name: 'postgres',
      image: 'postgres',
      tag: '15-alpine',
      ports: [{ host: '5432', container: '5432' }],
      env: [
        { key: 'POSTGRES_USER', value: 'postgres_user', label: 'Usuário', type: 'text' },
        { key: 'POSTGRES_PASSWORD', value: 'postgres_password', label: 'Senha', type: 'password' },
        { key: 'POSTGRES_DB', value: 'app_db', label: 'Nome do Banco', type: 'text' }
      ],
      volumes: [{ host: 'postgres_data', container: '/var/lib/postgresql/data', type: 'named' }]
    },
    mariadb: {
      type: 'mariadb',
      name: 'mariadb',
      image: 'mariadb',
      tag: '10.11',
      ports: [{ host: '3306', container: '3306' }],
      env: [
        { key: 'MARIADB_ROOT_PASSWORD', value: 'root_password', label: 'Senha do Root', type: 'password' },
        { key: 'MARIADB_DATABASE', value: 'app_db', label: 'Nome do Banco', type: 'text' },
        { key: 'MARIADB_USER', value: 'app_user', label: 'Usuário', type: 'text' },
        { key: 'MARIADB_PASSWORD', value: 'app_password', label: 'Senha do Usuário', type: 'password' }
      ],
      volumes: [{ host: 'mariadb_data', container: '/var/lib/mysql', type: 'named' }]
    },
    redis: {
      type: 'redis',
      name: 'redis',
      image: 'redis',
      tag: '7-alpine',
      ports: [{ host: '6379', container: '6379' }],
      env: [],
      volumes: [{ host: 'redis_data', container: '/data', type: 'named' }]
    },
    mongodb: {
      type: 'mongodb',
      name: 'mongodb',
      image: 'mongo',
      tag: '6.0',
      ports: [{ host: '27017', container: '27017' }],
      env: [
        { key: 'MONGO_INITDB_ROOT_USERNAME', value: 'root', label: 'Usuário Admin', type: 'text' },
        { key: 'MONGO_INITDB_ROOT_PASSWORD', value: 'mongo_password', label: 'Senha Admin', type: 'password' }
      ],
      volumes: [{ host: 'mongo_data', container: '/data/db', type: 'named' }]
    },
    mssql: {
      type: 'mssql',
      name: 'mssql',
      image: 'mcr.microsoft.com/mssql/server',
      tag: '2022-latest',
      ports: [{ host: '1433', container: '1433' }],
      env: [
        { key: 'ACCEPT_EULA', value: 'Y', label: 'Aceitar Termos (EULA) [Y/N]', type: 'text' },
        { key: 'MSSQL_SA_PASSWORD', value: 'SqlSecurePassword123!', label: 'Senha do SA (Forte)', type: 'password' }
      ],
      volumes: [{ host: 'mssql_data', container: '/var/opt/mssql', type: 'named' }]
    },
    elasticsearch: {
      type: 'elasticsearch',
      name: 'elasticsearch',
      image: 'docker.elastic.co/elasticsearch/elasticsearch',
      tag: '8.11.0',
      ports: [{ host: '9200', container: '9200' }],
      env: [
        { key: 'discovery.type', value: 'single-node', label: 'Tipo de Descoberta', type: 'text' },
        { key: 'xpack.security.enabled', value: 'false', label: 'Habilitar Segurança', type: 'text' }
      ],
      volumes: [{ host: 'elastic_data', container: '/usr/share/elasticsearch/data', type: 'named' }]
    },

    // LINGUAGENS E WEB SERVERS
    'php-fpm': {
      type: 'php-fpm',
      name: 'php',
      image: 'php',
      tag: '8.2-fpm',
      ports: [],
      env: [],
      volumes: [{ host: './src', container: '/var/www/html', type: 'bind' }]
    },
    nginx: {
      type: 'nginx',
      name: 'nginx',
      image: 'nginx',
      tag: 'alpine',
      ports: [{ host: '80', container: '80' }],
      env: [],
      volumes: [
        { host: './src', container: '/var/www/html', type: 'bind' },
        { host: './nginx.conf', container: '/etc/nginx/conf.d/default.conf', type: 'bind' }
      ]
    },
    apache: {
      type: 'apache',
      name: 'apache',
      image: 'httpd',
      tag: 'alpine',
      ports: [{ host: '80', container: '80' }],
      env: [],
      volumes: [{ host: './src', container: '/usr/local/apache2/htdocs', type: 'bind' }]
    },
    node: {
      type: 'node',
      name: 'node',
      image: 'node',
      tag: '20-alpine',
      ports: [{ host: '3000', container: '3000' }],
      env: [{ key: 'NODE_ENV', value: 'development', label: 'Ambiente', type: 'text' }],
      volumes: [{ host: './', container: '/usr/src/app', type: 'bind' }],
      command: 'npm run dev'
    },
    python: {
      type: 'python',
      name: 'python',
      image: 'python',
      tag: '3.11-alpine',
      ports: [{ host: '8000', container: '8000' }],
      env: [{ key: 'PYTHONUNBUFFERED', value: '1', label: 'Logs Unbuffered', type: 'text' }],
      volumes: [{ host: './', container: '/app', type: 'bind' }],
      command: 'python app.py'
    },
    go: {
      type: 'go',
      name: 'go',
      image: 'golang',
      tag: '1.21-alpine',
      ports: [{ host: '8080', container: '8080' }],
      env: [],
      volumes: [{ host: './', container: '/app', type: 'bind' }],
      command: 'go run main.go'
    },

    // GERENCIADORES E ADMIN
    phpmyadmin: {
      type: 'phpmyadmin',
      name: 'phpmyadmin',
      image: 'phpmyadmin',
      tag: 'latest',
      ports: [{ host: '8080', container: '80' }],
      env: [
        { key: 'PMA_HOST', value: 'mysql', label: 'Host do MySQL', type: 'text' },
        { key: 'PMA_PORT', value: '3306', label: 'Porta do MySQL', type: 'text' }
      ],
      volumes: []
    },
    pgadmin: {
      type: 'pgadmin',
      name: 'pgadmin',
      image: 'dpage/pgadmin4',
      tag: 'latest',
      ports: [{ host: '5050', container: '80' }],
      env: [
        { key: 'PGADMIN_DEFAULT_EMAIL', value: 'admin@admin.com', label: 'Email Padrão', type: 'text' },
        { key: 'PGADMIN_DEFAULT_PASSWORD', value: 'admin_password', label: 'Senha Padrão', type: 'password' }
      ],
      volumes: [{ host: 'pgadmin_data', container: '/var/lib/pgadmin', type: 'named' }]
    },
    adminer: {
      type: 'adminer',
      name: 'adminer',
      image: 'adminer',
      tag: 'latest',
      ports: [{ host: '8080', container: '8080' }],
      env: [],
      volumes: []
    },

    // FILAS E UTILITÁRIOS
    rabbitmq: {
      type: 'rabbitmq',
      name: 'rabbitmq',
      image: 'rabbitmq',
      tag: '3-management-alpine',
      ports: [
        { host: '5672', container: '5672' },
        { host: '15672', container: '15672' }
      ],
      env: [
        { key: 'RABBITMQ_DEFAULT_USER', value: 'guest', label: 'Usuário Admin', type: 'text' },
        { key: 'RABBITMQ_DEFAULT_PASS', value: 'guest', label: 'Senha Admin', type: 'password' }
      ],
      volumes: [{ host: 'rabbitmq_data', container: '/var/lib/rabbitmq', type: 'named' }]
    },
    mailpit: {
      type: 'mailpit',
      name: 'mailpit',
      image: 'axllent/mailpit',
      tag: 'latest',
      ports: [
        { host: '1025', container: '1025' },
        { host: '8025', container: '8025' }
      ],
      env: [],
      volumes: []
    },
    minio: {
      type: 'minio',
      name: 'minio',
      image: 'minio/minio',
      tag: 'latest',
      ports: [
        { host: '9000', container: '9000' },
        { host: '9001', container: '9001' }
      ],
      env: [
        { key: 'MINIO_ROOT_USER', value: 'minioadmin', label: 'Usuário Root', type: 'text' },
        { key: 'MINIO_ROOT_PASSWORD', value: 'minioadmin', label: 'Senha Root', type: 'password' }
      ],
      volumes: [{ host: 'minio_data', container: '/data', type: 'named' }],
      command: 'server /data --console-address ":9001"'
    }
  }

  // Lista estática para renderizar a Sidebar
  const categories = [
    {
      name: 'Bancos de Dados',
      services: [
        { type: 'mysql', label: 'MySQL', description: 'Banco de dados relacional clássico' },
        { type: 'postgres', label: 'PostgreSQL', description: 'Banco relacional potente e robusto' },
        { type: 'mariadb', label: 'MariaDB', description: 'Banco relacional open-source moderno' },
        { type: 'redis', label: 'Redis', description: 'Cache e banco de dados NoSQL chave-valor em memória' },
        { type: 'mongodb', label: 'MongoDB', description: 'Banco de dados NoSQL orientado a documentos' },
        { type: 'mssql', label: 'SQL Server', description: 'Banco de dados corporativo da Microsoft' },
        { type: 'elasticsearch', label: 'Elasticsearch', description: 'Engine de busca e análise de logs' }
      ]
    },
    {
      name: 'Linguagens & Web Servers',
      services: [
        { type: 'php-fpm', label: 'PHP-FPM', description: 'Ambiente de execução rápido do PHP' },
        { type: 'nginx', label: 'Nginx', description: 'Servidor web e proxy reverso leve' },
        { type: 'apache', label: 'Apache', description: 'Servidor HTTP altamente configurável' },
        { type: 'node', label: 'Node.js', description: 'Ambiente JS para construir backend de alta performance' },
        { type: 'python', label: 'Python', description: 'Ideal para machine learning e backend em Django/FastAPI' },
        { type: 'go', label: 'Go (Golang)', description: 'Linguagem compilada focada em concorrência' }
      ]
    },
    {
      name: 'Administração & DB Tools',
      services: [
        { type: 'phpmyadmin', label: 'phpMyAdmin', description: 'Interface web administrativa para MySQL/MariaDB' },
        { type: 'pgadmin', label: 'pgAdmin4', description: 'Ferramenta de administração avançada para PostgreSQL' },
        { type: 'adminer', label: 'Adminer', description: 'Gerenciador universal de banco de dados super leve' }
      ]
    },
    {
      name: 'Filas, Storage & Dev',
      services: [
        { type: 'rabbitmq', label: 'RabbitMQ', description: 'Mensageria e brokers de fila' },
        { type: 'mailpit', label: 'Mailpit', description: 'Capturador SMTP de testes e interface de webmail local' },
        { type: 'minio', label: 'MinIO', description: 'Armazenamento de objetos local compatível com AWS S3' }
      ]
    }
  ]

  // Presets populares pré-definidos
  const presets = [
    {
      id: 'lemp',
      name: 'LEMP Stack',
      description: 'Nginx + PHP-FPM + MySQL',
      services: ['mysql', 'php-fpm', 'nginx']
    },
    {
      id: 'node-mongo',
      name: 'Node + MongoDB',
      description: 'Node.js Backend + MongoDB Database',
      services: ['node', 'mongodb']
    },
    {
      id: 'python-postgres',
      name: 'Python + PostgreSQL',
      description: 'Python + PostgreSQL + Redis Cache',
      services: ['postgres', 'python', 'redis']
    }
  ]

  // Ações
  const addService = (type) => {
    const template = serviceTemplates[type]
    if (!template) return

    const id = `${type}-${Date.now()}`
    const count = services.value.filter((s) => s.type === type).length
    const name = count > 0 ? `${template.name}${count + 1}` : template.name

    const newService = JSON.parse(JSON.stringify(template))
    newService.id = id
    newService.name = name

    services.value.push(newService)
  }

  const removeService = (id) => {
    services.value = services.value.filter((s) => s.id !== id)
  }

  const updateService = (id, fields) => {
    const idx = services.value.findIndex((s) => s.id === id)
    if (idx !== -1) {
      services.value[idx] = { ...services.value[idx], ...fields }
    }
  }

  // Carrega um preset completo limpando a stack atual
  const loadPreset = (presetId) => {
    const preset = presets.find((p) => p.id === presetId)
    if (!preset) return

    services.value = []
    
    // Pequeno delay reativo para preencher
    setTimeout(() => {
      preset.services.forEach((type) => {
        addService(type)
      })
      currentTab.value = 'config'
    }, 50)
  }

  // Getter de YAML gerado
  const generatedYaml = computed(() => {
    if (services.value.length === 0) {
      return `# Selecione serviços no painel lateral para começar a estruturar sua infraestrutura.\n# O arquivo docker-compose.yml será atualizado automaticamente em tempo real.`
    }

    let yaml = "version: '3.8'\n\nservices:\n"
    const namedVolumes = new Set()

    services.value.forEach((service) => {
      yaml += `  ${service.name}:\n`
      yaml += `    image: ${service.image}:${service.tag}\n`
      yaml += `    container_name: ${service.name}\n`
      yaml += `    restart: always\n`

      // Command
      if (service.command && service.command.trim() !== '') {
        yaml += `    command: ${service.command}\n`
      }

      // Portas
      if (service.ports && service.ports.length > 0) {
        const validPorts = service.ports.filter((p) => p.host && p.container)
        if (validPorts.length > 0) {
          yaml += `    ports:\n`
          validPorts.forEach((p) => {
            yaml += `      - "${p.host}:${p.container}"\n`
          })
        }
      }

      // Variáveis de ambiente
      if (service.env && service.env.length > 0) {
        const validEnv = service.env.filter((e) => e.key && e.value !== '')
        if (validEnv.length > 0) {
          yaml += `    environment:\n`
          validEnv.forEach((e) => {
            yaml += `      - ${e.key}=${e.value}\n`
          })
        }
      }

      // Volumes
      if (service.volumes && service.volumes.length > 0) {
        const validVolumes = service.volumes.filter((v) => v.host && v.container)
        if (validVolumes.length > 0) {
          yaml += `    volumes:\n`
          validVolumes.forEach((v) => {
            yaml += `      - ${v.host}:${v.container}\n`
            if (v.type === 'named') {
              namedVolumes.add(v.host)
            }
          })
        }
      }

      yaml += `\n`
    })

    // Volumes nomeados declarados na raiz
    if (namedVolumes.size > 0) {
      yaml += `volumes:\n`
      namedVolumes.forEach((vol) => {
        yaml += `  ${vol}:\n`
      })
    }

    return yaml.trim()
  })

  return {
    services,
    categories,
    presets,
    currentTab,
    addService,
    removeService,
    updateService,
    loadPreset,
    generatedYaml
  }
})
