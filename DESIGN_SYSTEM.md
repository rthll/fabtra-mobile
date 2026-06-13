# 🎨 Design System & Boas Práticas - ValidadorPasses

## 📐 Grid & Espaçamento

### Sistema de Espaçamento 8px
```javascript
SPACING = {
  xs: 4px    // Espaçamento mínimo
  sm: 8px    // Small
  md: 12px   // Medium (default)
  lg: 16px   // Large
  xl: 24px   // Extra Large
  xxl: 32px  // XX Large
}
```

**Regra**: Use o grid 8px para TUDO:
- Padding/Margin
- Gap entre elementos
- Border radius
- Font sizes (múltiplos de 4)

---

## 🎯 Cores & Variantes

### Paleta Principal
```javascript
PRIMARY:   #0066ff  (Azul vibrante)
SUCCESS:   #1fad5d  (Verde fresco)
ERROR:     #ff4757  (Vermelho moderno)
WARNING:   #ffa502  (Laranja)
INFO:      #00a8ff  (Ciano)
```

### Uso Recomendado
- **Primary**: Ações principais, botões, destaques
- **Success**: Validações OK, status positivo
- **Error**: Validações failed, alertas
- **Warning**: Atenção, quase vencimento
- **Info**: Informação adicional

---

## 🔲 Componentes Base

### 1. Buttons (Botões)
```javascript
// ✅ Bom
<ModernButton 
  title="Validar" 
  variant="primary" 
  icon="✓"
  onPress={onValidate}
/>

// ❌ Errado
<Button title="Validar" color="#2563eb" />
```

**Variantes**:
- `primary` - Ação principal
- `secondary` - Ação secundária
- `danger` - Ação destrutiva
- `success` - Ação bem-sucedida

**Sizes**:
- `sm` - Pequeno (compacto)
- `md` - Médio (padrão)
- `lg` - Grande (destaque)

### 2. Cards
```javascript
// ✅ Bom - Com sombra e border-left
<View style={validationStyles.passengerCard}>
  {/* conteúdo */}
</View>

// ❌ Errado - Sem elevação
<View style={{ backgroundColor: '#fff', padding: 16 }}>
```

**Propriedades obrigatórias**:
- `...SHADOW.md` - Elevação
- `borderRadius: 12` - Moderno
- `borderLeftWidth: 4` - Indicador de status

### 3. Badges
```javascript
// ✅ Bom - Colorido e labels claros
<Badge 
  label="PASSE COMUM" 
  variant="primary"
  icon="🎫"
  size="md"
/>

// ❌ Errado - Sem contexto
<Text style={{ background: '#ddd' }}>Comum</Text>
```

### 4. Empty States
```javascript
// ✅ Bom - Visual + Ação
<EmptyState 
  icon="📭"
  title="Nenhuma validação"
  message="Use a busca para validar passes"
  action={<ModernButton ... />}
/>

// ❌ Errado - Só texto
<Text>No data</Text>
```

---

## 🎬 Animações

### Quando Usar
✅ **Use animações para**:
- Transição entre estados (fade, scale)
- Indicar carregamento
- Feedback de interação (press, hover)
- Destacar mudanças importantes

❌ **Não use para**:
- Cada mudança de prop
- Animações decorativas excessivas
- Transições mais de 600ms (lento)

### Exemplos Recomendados

```javascript
// Fade-in ao montar
useEffect(() => {
  fadeInAnim.startAnimation();
}, []);

// Press feedback
<TouchableOpacity
  {...usePressAnimation()}
  onPress={onValidate}
>

// Contador animado
<CounterCard count={validations.length} />
```

---

## 📏 Tipografia

### Sistema de Tipos
```javascript
// Títulos
fontSize: 24, fontWeight: '700'  // Heading 1
fontSize: 20, fontWeight: '700'  // Heading 2
fontSize: 18, fontWeight: '700'  // Heading 3

// Body
fontSize: 16, fontWeight: '500'  // Regular
fontSize: 14, fontWeight: '600'  // Label
fontSize: 13, fontWeight: '500'  // Small
fontSize: 11, fontWeight: '600'  // Tiny
```

### Recomendações
- Máximo 3 tamanhos de font por screen
- Máximo 2 pesos (600, 700) por screen
- Line height = 1.5 × font-size
- Letter spacing +0.3 para headlines

---

## 🌈 Modo Escuro

### Implementação
```javascript
import { useColorScheme } from 'react-native';

export function MyComponent() {
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' 
    ? Colors.dark 
    : Colors.light;

  return (
    <View style={{ 
      backgroundColor: colors.background,
      color: colors.text 
    }}>
  );
}
```

### Cores para Modo Escuro
- Backgrounds: 950 → 900 → 800
- Texts: Inverter (escuro ↔ claro)
- Borders: Usar 600 (mais visível)

---

## ✅ Checklist de Qualidade

Antes de commitar, verifique:

- [ ] Espaçamento usa grid 8px
- [ ] Cards têm sombra apropriada
- [ ] Botões têm estados (pressed, disabled)
- [ ] Cores seguem paleta definida
- [ ] Tipografia segue sistema
- [ ] Icons/emoji são significativos
- [ ] Empty states são visuais
- [ ] Animações < 600ms
- [ ] Modo escuro funciona
- [ ] Touch targets ≥ 44x44pt

---

## 📚 Componentes Disponíveis

### Validação
- `Header` - Cabeçalho com info do motorista
- `CounterCard` - Contador de validações
- `PassengerCard` - Card de passageiro
- `SearchBar` - Busca com ícone
- `PassengerList` - Lista com empty states

### Modals
- `ValidationConfirmModal` - Confirmação
- `QRCodeModal` - Exibição de QR
- `ScannerModal` - Scanner QR

### Reutilizáveis
- `ModernButton` - Botão versátil
- `Badge` - Labels coloridos
- `StatusCard` - Cards de status
- `EmptyState` - Estado vazio
- `InfoCard` - Informações estruturadas
- `Divider` - Separador visual
- `Loader` - Indicador de carregamento

---

## 🚀 Performance

### Otimizações Aplicadas
- ✓ Sombras otimizadas (elevation ao invés de shadow complexo)
- ✓ Animações com `useNativeDriver: true`
- ✓ Components memoizados quando necessário
- ✓ ScrollView com `removeClippedSubviews`

### Monitorar
- [ ] FPS das animações
- [ ] Tempo de renderização
- [ ] Uso de memória
- [ ] Bundle size

---

## 🔗 Importações Padrão

```javascript
// Styles
import { validationStyles, SPACING, SHADOW, RADIUS } from '../../styles/validationStyles';
import { Colors } from '../../constants/theme';

// Components
import { ModernButton, Badge, EmptyState } from './ModernComponents';

// Utilities
import { useFadeIn, useScaleIn, usePressAnimation } from '../../utils/animationUtils';
```

---

## 📖 Exemplos

### Exemplo 1: Componente com Animação
```javascript
import { useFadeIn } from '../../utils/animationUtils';
import { validationStyles } from '../../styles/validationStyles';

export function MyComponent() {
  const { fadeAnim, fadeStyle, startAnimation } = useFadeIn(200);

  useEffect(() => {
    startAnimation();
  }, []);

  return (
    <Animated.View style={fadeStyle}>
      {/* Content */}
    </Animated.View>
  );
}
```

### Exemplo 2: Card Customizado
```javascript
<View style={validationStyles.passengerCard}>
  <View style={validationStyles.passengerInfo}>
    <Text style={validationStyles.passengerName}>João Silva</Text>
    <Text style={validationStyles.passengerDetail}>ID: 12345</Text>
  </View>
</View>
```

### Exemplo 3: Status Visual
```javascript
<StatusCard
  title="Passe Válido"
  message="Passageiro autorizado a embarcar"
  status="success"
  icon="✓"
/>
```

---

**Último update**: Março 2026  
**Versão**: 1.0  
**Autor**: UI/UX Modernization
