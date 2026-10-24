// Contenido y lógica del quiz "Futuro innovador UNICA".
// Todo el texto sale del documento de diseño del quiz. Para cambiar un texto, editalo aquí.

export const CONFIG = {
  // Hashtag del stand. Dejalo vacío ('') hasta que esté definido; si tiene valor, aparece en el carnet.
  hashtag: '',
  // Ruta de la función que cuenta los perfiles para el panel en vivo.
  apiPerfiles: '/api/perfiles',
};

export const TEXTOS = {
  equipo: 'Ningún perfil es mejor que otro: las ideas avanzan cuando se combinan.',
  complemento: (nombre) => `Te complementás muy bien con ${nombre}.`,
  complementoIgual:
    'Tu perfil secundario ya es tu mejor complemento: llevás al equipo completo dentro de vos.',
  carnetLinea: 'Innovar es cosa de equipo',
  carnetTitulo: 'Futuro innovador UNICA',
  credito:
    'Perfiles inspirados en Las 10 caras de la innovación (Tom Kelley, IDEO) y en los arquetipos de innovación de Carla Johnson (Pragmatic Institute). Es una herramienta de orientación y juego, no un diagnóstico.',
};

// Cada perfil tiene una forma de la identidad del Rally.
export const PERFILES = [
  {
    id: 'antropologo',
    nombre: 'Antropólogo',
    forma: 'anillo',
    frase: 'Veo lo que otros no ven.',
    descripcion:
      'Sos de los que miran antes de actuar. Te fijás en cómo vive la gente y descubrís necesidades que otros pasan por alto.',
    valor: 'descubrís lo que la gente realmente necesita antes de invertir tiempo en una solución.',
    aportes:
      'Entender a las personas a las que se dirige el proyecto, detectar problemas que otros no ven y evitar que el equipo resuelva algo que nadie pidió.',
    toque: 'escuchás y observás para entender mejor a las personas.',
    complemento: 'saltador',
    razonComplemento: 'Uno descubre qué hace falta y el otro lo hace realidad.',
  },
  {
    id: 'experimentador',
    nombre: 'Experimentador',
    forma: 'estrella',
    frase: 'Pruebo, aprendo y vuelvo a probar.',
    descripcion:
      'Sos de los que prueban. No esperás a tener todo perfecto: armás una versión, la ponés a prueba y aprendés.',
    valor: 'convertís las ideas en pruebas rápidas en lugar de dejarlas en el papel.',
    aportes: 'Prototipos sencillos, aprendizaje a partir de los errores y menos miedo a empezar.',
    toque: 'te animás a probar y a equivocarte rápido.',
    complemento: 'estratega',
    razonComplemento:
      'Uno prueba rápido y el otro da rumbo para que lo probado lleve a algún lado.',
  },
  {
    id: 'colaborador',
    nombre: 'Colaborador',
    forma: 'equis',
    frase: 'Las mejores ideas nacen juntos.',
    descripcion:
      'Sos el pegamento del equipo. Sabés unir a personas distintas y lograr que todas aporten.',
    valor: 'lográs que personas distintas trabajen como un solo equipo.',
    aportes:
      'Buena comunicación, que todas las voces se escuchen y un grupo que se mantiene unido cuando aparecen tensiones.',
    toque: 'buscás que todos participen y se sientan parte.',
    complemento: 'narrador',
    razonComplemento: 'Uno une al equipo por dentro y el otro lleva la idea hacia afuera.',
  },
  {
    id: 'narrador',
    nombre: 'Narrador',
    forma: 'triangulo',
    frase: 'Una idea necesita quien la cuente.',
    descripcion:
      'Sos quien hace que una idea se entienda y se contagie. Sabés contar lo que se hace para que otros quieran sumarse.',
    valor: 'hacés que la idea se entienda y despierte interés en otras personas.',
    aportes:
      'Presentaciones claras, mensajes que convencen y apoyo para que más gente se sume al proyecto.',
    toque: 'explicás tus ideas de forma que los demás las sientan.',
    complemento: 'colaborador',
    razonComplemento: 'Uno une al equipo por dentro y el otro lleva la idea hacia afuera.',
  },
  {
    id: 'estratega',
    nombre: 'Estratega',
    forma: 'rombo',
    frase: 'Sé hacia dónde vamos.',
    descripcion:
      'Ves el panorama completo. Ordenás prioridades, trazás el camino y ayudás al equipo a saber hacia dónde va.',
    valor: 'le das rumbo al equipo para que no se pierda en el camino.',
    aportes: 'Prioridades claras, un plan por etapas y una visión de hacia dónde va el proyecto.',
    toque: 'pensás en etapas y en prioridades.',
    complemento: 'experimentador',
    razonComplemento:
      'Uno prueba rápido y el otro da rumbo para que lo probado lleve a algún lado.',
  },
  {
    id: 'saltador',
    nombre: 'Saltador de obstáculos',
    forma: 'circulo',
    frase: 'Yo hago que pase.',
    descripcion:
      'Cuando todos se traban, vos buscás la salida. Destrabás lo que frena y convertís las ideas en acciones.',
    valor: 'hacés que las cosas pasen cuando el equipo se traba.',
    aportes:
      'Soluciones a bloqueos, impulso cuando el grupo se estanca y seguimiento hasta que el trabajo queda terminado.',
    toque: 'te mueve que las cosas pasen.',
    complemento: 'antropologo',
    razonComplemento: 'Uno descubre qué hace falta y el otro lo hace realidad.',
  },
];

export const PERFIL = Object.fromEntries(PERFILES.map((p) => [p.id, p]));

const o = (texto, principal, apoyo) => ({ texto, principal, apoyo });

// Cada opción suma 2 puntos a "principal" y 1 punto a "apoyo".
export const PREGUNTAS = [
  {
    enunciado: 'Tu colegio quiere reducir la basura del patio. Lo primero que hacés es…',
    opciones: [
      o('Pasás un recreo observando qué se tira, dónde y por qué.', 'antropologo', 'narrador'),
      o('Ponés cajas de reciclaje esta semana para ver si la gente las usa.', 'experimentador', 'antropologo'),
      o('Armás un plan con metas y fechas para todo el mes.', 'estratega', 'saltador'),
    ],
  },
  {
    enunciado: 'Tu grupo se trabó en un proyecto y nadie sabe qué hacer. Vos…',
    opciones: [
      o('Buscás qué lo está frenando (un permiso, un material, el tiempo) y lo destrabás.', 'saltador', 'estratega'),
      o('Reunís a todos para que cada quien diga cómo ve el problema.', 'colaborador', 'antropologo'),
      o('Proponés armar una versión rápida, aunque salga imperfecta, y probarla.', 'experimentador', 'colaborador'),
    ],
  },
  {
    enunciado: 'Tenés una buena idea, pero nadie la entiende. Entonces…',
    opciones: [
      o('La contás con una historia o un ejemplo real.', 'narrador', 'colaborador'),
      o('Preguntás qué les preocupa a los demás y ajustás la idea.', 'antropologo', 'experimentador'),
      o('Mostrás el paso a paso de cómo se haría.', 'estratega', 'narrador'),
    ],
  },
  {
    enunciado: 'Tu equipo va a presentar su proyecto ante público. Vos te ofrecés para…',
    opciones: [
      o('Preparar el relato y presentarlo.', 'narrador', 'estratega'),
      o('Coordinar quién hace qué para que todo salga a tiempo.', 'colaborador', 'saltador'),
      o('Conseguir lo que falta: materiales, permisos, contactos.', 'saltador', 'colaborador'),
    ],
  },
  {
    enunciado: 'Notás que mucha gente de tu barrio tiene el mismo problema. Lo primero que hacés es…',
    opciones: [
      o('Conversar con vecinos para entender cómo les afecta.', 'antropologo', 'colaborador'),
      o('Imaginar una solución nueva y probarla en pequeño.', 'experimentador', 'estratega'),
      o('Juntar a varias personas para buscar la solución entre todos.', 'colaborador', 'narrador'),
    ],
  },
  {
    enunciado: 'Te dan un reto y casi no hay tiempo. Tu primer movimiento es…',
    opciones: [
      o('Dividir el reto en etapas y decidir qué va primero.', 'estratega', 'experimentador'),
      o('Lanzarte con la primera idea y ajustar sobre la marcha.', 'experimentador', 'saltador'),
      o('Identificar el mayor obstáculo e ir directo a resolverlo.', 'saltador', 'antropologo'),
    ],
  },
  {
    enunciado: 'Una persona de tu equipo está desmotivada. Vos…',
    opciones: [
      o('Te acercás, la escuchás y buscás cómo sumarla.', 'colaborador', 'antropologo'),
      o('Le contás por qué este proyecto importa para que recupere las ganas.', 'narrador', 'experimentador'),
      o('Le das una tarea pequeña para que logre un primer avance rápido.', 'saltador', 'experimentador'),
    ],
  },
  {
    enunciado: 'Terminó el proyecto y toca decidir qué sigue. Preferís…',
    opciones: [
      o('Preguntar a quienes lo usaron cómo les fue y qué habría que arreglar.', 'antropologo', 'saltador'),
      o('Planificar la siguiente etapa y explicársela al equipo.', 'estratega', 'narrador'),
      o('Contar lo logrado para invitar a más gente a sumarse.', 'narrador', 'estratega'),
    ],
  },
];

// respuestas[q] = índice de la opción elegida (0, 1 o 2) en PREGUNTAS[q].opciones.
// Desempates, en orden: más selecciones directas, selección directa más temprana, orden de PERFILES.
export function calcular(respuestas) {
  const puntos = {};
  const directas = {};
  const primera = {};
  PERFILES.forEach((p) => {
    puntos[p.id] = 0;
    directas[p.id] = 0;
    primera[p.id] = 99;
  });
  respuestas.forEach((opcion, q) => {
    const { principal, apoyo } = PREGUNTAS[q].opciones[opcion];
    puntos[principal] += 2;
    puntos[apoyo] += 1;
    directas[principal] += 1;
    primera[principal] = Math.min(primera[principal], q);
  });
  const ids = PERFILES.map((p) => p.id);
  const orden = [...ids].sort(
    (a, b) =>
      puntos[b] - puntos[a] ||
      directas[b] - directas[a] ||
      primera[a] - primera[b] ||
      ids.indexOf(a) - ids.indexOf(b),
  );
  return {
    principal: orden[0],
    secundario: orden[1],
    complemento: PERFIL[orden[0]].complemento,
    puntos,
  };
}
