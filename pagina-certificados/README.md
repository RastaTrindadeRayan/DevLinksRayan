# Página de Certificados - Rayan Marcelo

## Descrição
Página web moderna e responsiva para exibir e organizar certificados acadêmicos e profissionais.

## Funcionalidades

### ✨ Principais Recursos
- **Visualização em Grid**: Layout responsivo com cartões organizados
- **Sistema de Filtros**: Filtragem por categoria (Todos, Rocketseat, Python, Outros)
- **Modal de Visualização**: Visualização de PDFs em modal interativo
- **Download de Certificados**: Botão para download direto dos arquivos
- **Contador Dinâmico**: Mostra quantidade de certificados por filtro
- **Design Responsivo**: Funciona perfeitamente em desktop e mobile

### 🎨 Design
- **Gradiente Moderno**: Background com gradiente roxo/azul
- **Animações Suaves**: Transições e hover effects
- **Ícones Categorizados**: Cada categoria tem seu ícone e cor específica
- **Typography Moderna**: Fonte Inter para melhor legibilidade

### 📱 Responsividade
- Layout adaptativo para diferentes tamanhos de tela
- Menu de filtros responsivo
- Modal otimizado para mobile
- Grid que se adapta automaticamente

## Estrutura de Arquivos

```
pagina-certificados/
├── index.html          # Página principal
├── estilos.css         # Estilos e layout
├── script.js           # Funcionalidades JavaScript
├── README.md           # Esta documentação
└── certificados/       # Certificados organizados
    ├── Rocketseat/     # Certificados da Rocketseat
    ├── Python/         # Certificados de Python
    └── Genericos/      # Outros certificados
```

## Certificados Organizados

### 📂 Estrutura de Pastas
- **Rocketseat/**: 1 certificado
  - Certificado_Rocketseat_Discover_22_02_2025.pdf
- **Python/**: 1 certificado
  - Certificado_Python_Interface_Grafica_01_03_2025.pdf
- **Genericos/**: 11 certificados
  - Certificados renomeados com datas organizadas

### 🏷️ Padrão de Nomenclatura
- Formato: `Certificado_[Categoria]_[Descrição]_[Data].pdf`
- Datas no formato: DD_MM_AAAA
- Nomes descritivos e organizados

## Como Usar

1. **Abrir a Página**: Abra o arquivo `index.html` no navegador
2. **Filtrar Certificados**: Use os botões de filtro no topo
3. **Visualizar**: Clique em "Visualizar" para ver o certificado em modal
4. **Download**: Use o botão de download para salvar o arquivo
5. **Fechar Modal**: Clique no X ou pressione ESC para fechar

## Tecnologias Utilizadas

- **HTML5**: Estrutura semântica
- **CSS3**: Estilos modernos com Flexbox e Grid
- **JavaScript ES6**: Funcionalidades interativas
- **Font Awesome**: Ícones
- **Google Fonts**: Tipografia (Inter)

## Recursos Avançados

### 🔍 Sistema de Filtros
- Filtros por categoria com contadores dinâmicos
- Animações suaves na transição entre filtros
- Estado ativo visual nos botões

### 📱 Modal Responsivo
- Visualização de PDFs em iframe
- Controles de fechamento múltiplos
- Backdrop blur effect

### ⚡ Performance
- Lazy loading para PDFs
- Animações otimizadas
- Código JavaScript modular

## Personalização

### Cores
As cores podem ser facilmente alteradas no arquivo `estilos.css`:
- Gradiente principal: `#667eea` → `#764ba2`
- Rocketseat: `#8257e5` → `#996dff`
- Python: `#3776ab` → `#ffd43b`
- Genéricos: `#28a745` → `#20c997`

### Adicionando Novos Certificados
1. Adicione o arquivo PDF na pasta apropriada
2. Edite o `index.html` para incluir um novo cartão
3. Siga o padrão de nomenclatura estabelecido

## Compatibilidade
- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+
- ✅ Mobile browsers

---

**Desenvolvido para Rayan Marcelo de Oliveira Trindade**  
*Portfólio de certificações e conquistas acadêmicas*

