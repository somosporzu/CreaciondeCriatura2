import { ChallengeRating, Size, Category, Trait, Weapon, Armor, Shield, DamageType, MovementType, StatusEffect } from './types';

export const CHALLENGE_RATINGS: ChallengeRating[] = [
  { nd: '1/8', resistencia: 4, defensa: 7, bonoBase: 0, danoBase: '1d6 - 3', pr: 0 },
  { nd: '1/4', resistencia: 7, defensa: 8, bonoBase: 0, danoBase: '1d6 - 2', pr: 1 },
  { nd: '1/2', resistencia: 12, defensa: 8, bonoBase: 1, danoBase: '1d6 - 1', pr: 1 },
  { nd: '1', resistencia: 17, defensa: 8, bonoBase: 2, danoBase: '1d6', pr: 2 },
  { nd: '2', resistencia: 27, defensa: 8, bonoBase: 3, danoBase: '1d6+1', pr: 3 },
  { nd: '3', resistencia: 37, defensa: 9, bonoBase: 4, danoBase: '2d6-1', pr: 4 },
  { nd: '4', resistencia: 52, defensa: 9, bonoBase: 4, danoBase: '2d6', pr: 5 },
  { nd: '5', resistencia: 67, defensa: 10, bonoBase: 5, danoBase: '2d6+1', pr: 6 },
  { nd: '6', resistencia: 72, defensa: 10, bonoBase: 5, danoBase: '2d6+2', pr: 7 },
  { nd: '7', resistencia: 82, defensa: 11, bonoBase: 6, danoBase: '2d6+2', pr: 8 },
  { nd: '8', resistencia: 92, defensa: 11, bonoBase: 6, danoBase: '2d6+3', pr: 9 },
  { nd: '9', resistencia: 102, defensa: 12, bonoBase: 7, danoBase: '3d6', pr: 10 },
  { nd: '10', resistencia: 112, defensa: 12, bonoBase: 7, danoBase: '3d6+1', pr: 10 },
  { nd: '11', resistencia: 122, defensa: 12, bonoBase: 7, danoBase: '3d6+1', pr: 11 },
  { nd: '12', resistencia: 132, defensa: 13, bonoBase: 8, danoBase: '3d6+2', pr: 11 },
  { nd: '13', resistencia: 142, defensa: 13, bonoBase: 8, danoBase: '4d6', pr: 12 },
  { nd: '14', resistencia: 152, defensa: 14, bonoBase: 9, danoBase: '4d6+1', pr: 13 },
  { nd: '15', resistencia: 162, defensa: 14, bonoBase: 9, danoBase: '4d6+2', pr: 14 },
];

export const SIZES: Size[] = [
  { name: 'Minúsculo', modResistencia: -5, modDefensa: 3 },
  { name: 'Pequeño', modResistencia: -5, modDefensa: 1 },
  { name: 'Mediano', modResistencia: 0, modDefensa: 0 },
  { name: 'Grande', modResistencia: 15, modDefensa: -1 },
  { name: 'Enorme', modResistencia: 30, modDefensa: -2 },
  { name: 'Colosal', modResistencia: 60, modDefensa: -4 },
];

export const CATEGORIES: Category[] = [
  { name: 'Bestia', ability: 'Instinto Primario: Tiene ventaja en las tiradas de percepción para detectar peligros.' },
  { name: 'Monstruo', ability: 'Presencia Aterradora: Quienes lo vean por primera vez deben superar una Salvación de Aura (ND 12) o quedar Asustados por 1 turno.' },
  { name: 'Espíritu', ability: 'Incorpóreo: Tiene Resistencia a los daños Cortante, Penetrante y Contundente de fuentes no mágicas' },
  { name: 'Exaltado', ability: 'Toque divino: Sus ataques infligen 1d6 de daño Radiante adicional' },
  { name: 'Corrupto', ability: 'Toque Profano: Sus ataques infligen 1d6 de daño Corrosivo adicional.' },
  { name: 'Elemental', ability: 'Toque elemental: Sus ataques infligen 1d6 de daño adicional acorde al elemento del que este hecho.' },
  { name: 'Artificial', ability: 'Mente Mecánica: Es inmune al daño Mental, al estado Asustado y a los venenos.' },
  { name: 'NPC', ability: 'Vocación: Gana un Concepto gratis.' },
];

export const NATURES: string[] = [
    "Alegremente", "Apasionadamente", "Astutamente", "Brutalmente", "Caóticamente",
    "Carismáticamente", "Cautelosamente", "Curiosamente", "Despiadadamente", "Discretamente",
    "Elegantemente", "Fríamente", "Impulsivamente", "Inestablemente", "Metódicamente",
    "Rápidamente", "Silenciosamente", "Siniestramente", "Sutilmente", "Tenazmente",
    "Torpemente", "Valientemente"
];

export const DAMAGE_TYPES: DamageType[] = [
    'Contundente', 'Cortante', 'Penetrante', 'Fuego', 'Hielo', 'Eléctrico', 'Corrosivo', 'Radiante', 'Mental', 'Variable'
];

export const ALL_CONCEPTS: string[] = [
    "Agricultor", "Alfarero", "Artesano", "Astrólogo", "Bardo", 
    "Botánico", "Carpintero", "Cazador", "Cocinero", "Constructor", 
    "Cortesano", "Curandero", "Domador", "Erudito", "Espía", 
    "Espiritista", "Explorador", "Filósofo", "Guerrero", "Hechicero", 
    "Herrero", "Historiador", "Ingeniero", "Ladrón", "Lingüista", 
    "Marinero", "Mercader", "Minero", "Monje", "Noble", 
    "Naturalista", "Pescador", "Pícaro", "Profesor", "Sacerdote", 
    "Sastre", "Tintorero"
];

export const MOVEMENT_TYPES: MovementType[] = ['Nadar', 'Trepar', 'Excavar'];

export const STATUS_EFFECTS: StatusEffect[] = [
    'Asfixiado', 'Asustado', 'Aturdido', 'Controlado', 'Derribado', 'Dormido', 'Encantado', 'Envenenado', 'Envenenado Mayor', 'Inmovilizado', 'Quemado', 'Quemado Mayor'
];

export const ALL_TRAITS: Trait[] = [
  // Atributos y Vitalidad
  { name: 'Mejora de Atributo', cost: 2, category: 'Atributos y Vitalidad', description: 'Aumenta en +1 uno de los Atributos Primarios (Cuerpo, Destreza o Aura). Puede comprarse varias veces.', restriction: null },
  { name: 'Deficiencia de Atributo', cost: 'Gana 1', category: 'Atributos y Vitalidad', description: 'Reduce en -1 uno de los Atributos Primarios. Un atributo no puede ser reducido por debajo de -3 con este rasgo.', restriction: null },
  { name: 'Vitalidad Aumentada', cost: 1, category: 'Atributos y Vitalidad', description: 'Aumenta la Resistencia máxima de la criatura en +10. Puede comprarse varias veces.', restriction: null },
  { name: 'Versatilidad Conceptual', cost: 2, category: 'Atributos y Vitalidad', description: 'La criatura aprende un nuevo Concepto de la lista general (Ej: Guerrero, Cazador, Espía).', restriction: null },
  { name: 'Versatilidad de Carácter', cost: 1, category: 'Atributos y Vitalidad', description: 'La criatura aprende una nueva Naturaleza de la lista general (Ej: Cautelosamente, Rápidamente).', restriction: null },
  // Ofensivos
  { name: 'Ataque Adicional', cost: 1, category: 'Ofensivos', description: 'Puede hacer un segundo ataque en su turno (sin sumar su Bono de Ataque).', restriction: null },
  { name: 'Alcance Mejorado', cost: 1, category: 'Ofensivos', description: 'El alcance de sus ataques cuerpo a cuerpo aumenta en 3 metros.', restriction: null },
  { name: 'Ataque Poderoso', cost: 1, category: 'Ofensivos', description: 'Puede elegir sufrir -2 a su tirada de ataque para ganar +3 al daño.', restriction: null },
  { name: 'Sangrado', cost: 1, category: 'Ofensivos', description: 'Sus ataques Cortantes/Penetrantes hacen que el objetivo sufra 1d6 de daño al final de su próximo turno.', restriction: null },
  { name: 'Carga Imparable', cost: 1, category: 'Ofensivos', description: 'Si se mueve al menos 5m en línea recta antes de atacar, inflige 1d6 de daño adicional.', restriction: null },
  { name: 'Arrollar', cost: 1, category: 'Ofensivos', description: 'Puede moverse a través del espacio de criaturas de un tamaño inferior, forzándolas a una Salvación de Destreza (ND 12) o ser Derribados.', restriction: null },
  { name: 'Engarro', cost: 1, category: 'Ofensivos', description: 'Si impacta un ataque, puede intentar una maniobra de Apresar como Acción Rápida.', restriction: null },
  { name: 'Crítico Mejorado', cost: 2, category: 'Ofensivos', description: 'Sus ataques infligen el doble de dados de daño con un resultado natural de 5 o 6 en los dados de daño.', restriction: null },
  { name: 'Golpe Debilitante', cost: 2, category: 'Ofensivos', description: 'Cuando impacta un ataque, el objetivo sufre una penalización de -1 a todas sus acciones hasta el final de su próximo turno.', restriction: null },
  { name: 'Furia', cost: 2, category: 'Ofensivos', description: 'Mientras tenga la mitad de su Resistencia o menos, sus ataques infligen 1d6 de daño adicional.', restriction: null },
  { name: 'Veneno de Contacto', cost: 2, category: 'Ofensivos', description: 'Al impactar, el objetivo debe superar una Salvación de Cuerpo (ND 13) o quedar Envenenado.', restriction: null },
  { name: 'Estado añadido', cost: 2, category: 'Ofensivos', description: 'Al impactar con un ataque, el objetivo debe superar una Salvación de Aura (ND 12) o sufrir un estado alterado seleccionado.', restriction: null },
  { name: 'Corrosión', cost: 2, category: 'Ofensivos', description: 'Sus ataques Corrosivos reducen el bono de la armadura del objetivo en 1 punto permanentemente.', restriction: null },
  { name: 'Francotirador', cost: 1, category: 'Ofensivos', description: 'No sufre penalización por atacar a larga distancia con armas de rango.', restriction: null },
  { name: 'Combate a Ciegas', cost: 2, category: 'Ofensivos', description: 'No sufre penalizaciones a sus ataques por no poder ver a su objetivo.', restriction: null },
  { name: 'Ataque Vorpal', cost: 3, category: 'Ofensivos', description: 'En un golpe crítico, el ataque inflige el triple de daño en lugar del doble.', restriction: null },
  { name: 'Ráfaga', cost: 3, category: 'Ofensivos', description: 'Si reduce a una criatura a 0 de Resistencia, puede realizar un ataque adicional como Acción Rápida.', restriction: null },
  { name: 'Drenaje menor', cost: 2, category: 'Ofensivos', description: 'Al realizar daño con uno de sus ataques recupera la mitad del daño realizado como resistencia.', restriction: null },
  { name: 'Drenaje', cost: 3, category: 'Ofensivos', description: 'Al realizar daño con uno de sus ataques recupera la misma cantidad de resistencia que el daño realizado.', restriction: null },
  { name: 'Inducir fatiga', cost: 3, category: 'Ofensivos', description: 'Al realizar daño con uno de sus ataques el objetivo obtiene un nivel de fatiga.', restriction: null },
  // Defensivos
  { name: 'Armadura Natural', cost: 1, category: 'Defensivos', description: '+1 a la Defensa. (Comprable varias veces).', restriction: null },
  { name: 'Resistente', cost: 1, category: 'Defensivos', description: 'Gana Resistencia a un tipo de daño.', restriction: null },
  { name: 'Inmune', cost: 2, category: 'Defensivos', description: 'Gana Inmunidad a un tipo de daño.', restriction: null },
  { name: 'Inmunidad a estado', cost: 2, category: 'Defensivos', description: 'La criatura es inmune a un estado alterado seleccionado.', restriction: null },
  { name: 'Vulnerable', cost: 'Gana 2', category: 'Defensivos', description: 'Gana Vulnerabilidad a un tipo de daño. (Te devuelve 2 PR).', restriction: null },
  { name: 'Piel Gruesa', cost: 1, category: 'Defensivos', description: 'Ignora 1 punto de daño de todas las fuentes. (Comprable varias veces).', restriction: null },
  { name: 'Indomable', cost: 2, category: 'Defensivos', description: 'Es inmune al estados Asustado y Controlado.', restriction: null },
  { name: 'Escurridizo', cost: 1, category: 'Defensivos', description: 'No provoca ataques de oportunidad al moverse fuera del alcance de un enemigo.', restriction: null },
  { name: 'Regeneración Menor', cost: 1, category: 'Defensivos', description: 'Al inicio de su turno, la criatura recupera 3 de Resistencia.', restriction: null },
  { name: 'Regeneración Mayor', cost: 2, category: 'Defensivos', description: 'Al inicio de su turno, la criatura recupera 5 de Resistencia.', restriction: null },
  { name: 'Piel de Espinas', cost: 2, category: 'Defensivos', description: 'Cualquier criatura que le golpee con un ataque cuerpo a cuerpo sufre 1d6 de daño Penetrante.', restriction: null },
  { name: 'Resistencia a Críticos', cost: 1, category: 'Defensivos', description: 'Cualquier golpe crítico contra esta criatura se considera un golpe normal.', restriction: null },
  { name: 'Fortaleza Interior', cost: 1, category: 'Defensivos', description: 'Tiene ventaja en las Tiradas de Salvación contra veneno y enfermedades.', restriction: null },
  { name: 'Piel Resbaladiza', cost: 1, category: 'Defensivos', description: 'Tiene ventaja en las tiradas para evitar o escapar de una presa (Apresar).', restriction: null },
  { name: 'Desplazamiento', cost: 3, category: 'Defensivos', description: 'Los ataques contra la criatura tienen desventaja. Si es golpeada, este rasgo se desactiva hasta el inicio de su próximo turno.', restriction: null },
  { name: 'Amorfo', cost: 3, category: 'Defensivos', description: 'Es inmune al golpes críticos y no puede ser apresado.', restriction: 'Monstruo' },
  { name: 'Corazón Doble', cost: 3, category: 'Defensivos', description: 'La primera vez que llega a 0 de Resistencia en un combate, en su lugar, se queda con la mitad de su Resistencia máxima (redondeado hacia abajo).', restriction: null },
  { name: 'Duro de Matar', cost: 2, category: 'Defensivos', description: 'Si llega a 0 de Resistencia, no cae Agotado inmediatamente. Puede actuar normalmente en su próximo turno y luego cae.', restriction: null },
  { name: 'Muerte Explosiva', cost: 1, category: 'Defensivos', description: 'Cuando la criatura es reducida a 0 de Resistencia, su cuerpo explota, infligiendo 1d6 de daño a todas las criaturas a 5 metros a su alrededor.', restriction: null },
  { name: 'Muerte Explosiva Mayor', cost: 2, category: 'Defensivos', description: 'Cuando la criatura es reducida a 0 de Resistencia, su cuerpo detona violentamente, infligiendo 2d6 de daño a todas las criaturas a 10 metros a su alrededor.', restriction: null },
  { name: 'Absorción de Daño', cost: 2, category: 'Defensivos', description: 'Gana Resistencia a un tipo de daño elegido. La criatura recupera 1 punto de Resistencia por cada punto de daño reducido por esta resistencia.', restriction: null },
  { name: 'Recuperación Menor', cost: 1, category: 'Defensivos', description: 'En vez de atacar, la criatura recupera 1d6 puntos de resistencia.', restriction: null },
  { name: 'Recuperación', cost: 2, category: 'Defensivos', description: 'En vez de atacar, la criatura recupera 1d6+1 puntos de resistencia.', restriction: null },
  { name: 'Recuperación Mayor', cost: 3, category: 'Defensivos', description: 'En vez de atacar, la criatura recupera 3d6+3 puntos de resistencia.', restriction: null },
  // Movilidad
  { name: 'Movimiento Especial', cost: 1, category: 'Movilidad', description: 'Gana una velocidad de Nadar, Trepar o Excavar.', restriction: null },
  { name: 'Iniciativa Mejorada', cost: 1, category: 'Movilidad', description: 'Aumenta la iniciativa en 3. (Comprable varias veces).', restriction: null },
  { name: 'Velocidad Mejorada', cost: 1, category: 'Movilidad', description: 'Su velocidad terrestre aumenta en 3 metros.', restriction: null },
  { name: 'Pies Ligeros', cost: 1, category: 'Movilidad', description: 'Ignora el terreno difícil.', restriction: null },
  { name: 'Saltador', cost: 1, category: 'Movilidad', description: 'Puede saltar el doble de la distancia normal.', restriction: null },
  { name: 'Anfibio', cost: 1, category: 'Movilidad', description: 'Puede respirar tanto aire como agua.', restriction: 'Bestia' },
  { name: 'Vuelo', cost: 2, category: 'Movilidad', description: 'Gana una velocidad de vuelo igual a su velocidad terrestre.', restriction: null },
  { name: 'Inamovible', cost: 1, category: 'Movilidad', description: 'No puede ser empujado o derribado en contra de su voluntad.', restriction: null },
  { name: 'Libertad de Movimiento', cost: 2, category: 'Movilidad', description: 'No puede ser apresado o inmovilizado.', restriction: null },
  { name: 'Acechador del Terreno', cost: 1, category: 'Movilidad', description: 'Elige un terreno (bosque, etc.). Tiene ventaja en sigilo en ese terreno.', restriction: null },
  { name: 'Acróbata', cost: 2, category: 'Movilidad', description: 'Puede moverse a través de los espacios ocupados por criaturas enemigas.', restriction: null },
  { name: 'Retirada Veloz', cost: 1, category: 'Movilidad', description: 'Puede usar la Acción Rápida para retirarse sin provocar ataques de oportunidad.', restriction: null },
  { name: 'Siempre de Pie', cost: 1, category: 'Movilidad', description: 'Levantarse del estado Derribado no le cuesta movimiento.', restriction: null },
  { name: 'Caminar por los Muros', cost: 2, category: 'Movilidad', description: 'Puede trepar por superficies verticales y techos sin usar las manos.', restriction: 'Bestia, Monstruo' },
  { name: 'Acechador de las Sombras', cost: 2, category: 'Movilidad', description: 'Puede usar la Acción Rápida para teletransportarse 5 metros de una sombra a otra.', restriction: 'Corrupto, Espíritu' },
  { name: 'Paso Etéreo', cost: 3, category: 'Movilidad', description: 'Como Acción Principal, puede moverse a través de objetos y criaturas hasta el final de su turno.', restriction: 'Espíritu' },
  { name: 'Nómada del Plano', cost: 3, category: 'Movilidad', description: 'Una vez al día, puede teletransportarse a cualquier lugar que haya visto, sin importar la distancia.', restriction: 'Exaltado, Espíritu' },
  // Aura y Percepción
  { name: 'Sentidos Agudos', cost: 1, category: 'Aura y Percepción', description: 'Gana ventaja en todas las tiradas de percepción.', restriction: null },
  { name: 'Visión en la Oscuridad', cost: 1, category: 'Aura y Percepción', description: 'Puede ver en la oscuridad total.', restriction: null },
  { name: 'Sentido del Peligro', cost: 2, category: 'Aura y Percepción', description: 'No puede ser sorprendida en combate.', restriction: null },
  { name: 'Percepción Sísmica', cost: 1, category: 'Aura y Percepción', description: 'Siente la ubicación de cualquier criatura en contacto con el suelo en un radio de 10m.', restriction: null },
  { name: 'Camuflaje', cost: 1, category: 'Aura y Percepción', description: 'Tiene ventaja en sigilo para esconderse siempre que permanezca inmóvil.', restriction: null },
  { name: 'Olor Nauseabundo', cost: 1, category: 'Aura y Percepción', description: 'Quien empiece su turno a 3m debe superar una Salvación de Cuerpo (ND 12) o terá desventaja en su próximo ataque.', restriction: null },
  { name: 'Sentido Ciego', cost: 2, category: 'Aura y Percepción', description: '`Ve` en un radio de 10m sin usar los ojos. No puede ser Cegado.', restriction: null },
  { name: 'Aura Elemental', cost: 2, category: 'Aura y Percepción', description: 'Al inicio del turno de la criatura, todos a 3m de ella sufren 1d6 de dano elemental.', restriction: null },
  { name: 'Aura de Lentitud', cost: 2, category: 'Aura y Percepción', description: 'El área en un radio de 5m alrededor de la criatura es terreno difícil para sus enemigos.', restriction: null },
  { name: 'Incorpóreo', cost: 3, category: 'Aura y Percepción', description: 'Tiene Resistencia a todo daño físico y puede moverse a través de objetos y criaturas.', restriction: 'Espíritu' },
  { name: 'Visión Verdadera', cost: 3, category: 'Aura y Percepción', description: 'Puede ver a través de ilusiones e invisibilidad en un radio de 15m.', restriction: 'Artificial' },
  { name: 'Aura de Miedo', cost: 3, category: 'Aura y Percepción', description: 'Quien empiece su turno a 5m debe superar una Salvación de Aura (ND 13) o quedar Asustado.', restriction: 'Monstruo, Corrupto' },
  { name: 'Aura de Vida', cost: 2, category: 'Aura y Percepción', description: 'Los aliados que empiecen su turno a 5m de la criatura recuperan 1d6 de Resistencia.', restriction: null },
  { name: 'Aura Antimagia', cost: 4, category: 'Aura y Percepción', description: 'Cualquiera que intente usar una Técnica a 10m de la criatura debe superar una tirada de Aura (ND 14) o la técnica falla.', restriction: 'Artificial, Exaltado' },
  { name: 'Mirada Hipnótica', cost: 2, category: 'Aura y Percepción', description: 'Quien inicie su turno mirando a los ojos de la criatura debe superar una Salvación de Aura (ND 13) o no podrá atacar a la criatura en ese turno.', restriction: null },
  { name: 'Campo de Interferencia', cost: 2, category: 'Aura y Percepción', description: 'Los ataques a distancia contra la criatura tienen desventaja.', restriction: 'Artificial' },
  // Control y Únicos
  { name: 'Jefe Solitario', cost: 3, category: 'Control y Únicos', description: 'Puede realizar una Acción Rápida al final del turno de cada jugador.', restriction: null },
  { name: 'Mente Colmena', cost: 1, category: 'Control y Únicos', description: 'Es inmune al estado Asustado mientras possa ver a otra criatura aliada con este rasgo.', restriction: 'Bestia, Artificial' },
  { name: 'Líder de la Manada', cost: 2, category: 'Control y Únicos', description: 'Los aliados a 10m que puedan ver a la criatura ganan un bono de +1 a sus tiradas de ataque.', restriction: 'Bestia' },
  { name: 'Último Aliento', cost: 2, category: 'Control y Únicos', description: 'Cuando muere, explota o libera una nube tóxica. Todos a 3m sufren 2d6 de daño o un efecto.', restriction: null },
  { name: 'Reanimar', cost: 3, category: 'Control y Únicos', description: 'Una vez al día, puede usar su Reacción para reanimar a un humanoide que muera a 5m como un zombi de ND 1/4 bajo su control.', restriction: 'Corrupto' },
  { name: 'Adaptación Rápida', cost: 2, category: 'Control y Únicos', description: 'La primera vez que recibe daño elemental en un combate, gana Resistencia a ese tipo de daño por el resto del encuentro.', restriction: 'Monstruo' },
  { name: 'Dividirse', cost: 3, category: 'Control y Únicos', description: 'Si es reducido a la mitad de su Resistencia por un ataque, se divide en dos criaturas idénticas, cada una con la mitad de la Resistencia actual.', restriction: 'Monstruo, Artificial' },
  { name: 'Absorber Elemento', cost: 3, category: 'Control y Únicos', description: 'Elige un tipo de daño elemental. Es inmune al ese daño y lo absorbe, recuperando Resistencia en lugar de sufrirlo.', restriction: 'Espíritu, Artificial' },
  { name: 'Resistencia Legendaria', cost: 2, category: 'Control y Únicos', description: 'Puede elegir superar automáticamente una Tirada de Salvación que haya fallado. (Comprable varias veces para ganar mais usos diarios).', restriction: null },
  { name: 'Múltiples Cabezas', cost: 2, category: 'Control y Únicos', description: 'Tiene ventaja en las salvaciones contra el estado Aturdido y puede realizar una Reacción adicional por ronda.', restriction: 'Bestia, Monstruo' },
  { name: 'Asimilar', cost: 4, category: 'Control y Únicos', description: 'Una vez por día, al matar a una criatura, puede gastar una Acción Principal para devorarla y ganar uno de sus Rasgos (de coste 2 PR o menos) durante 1 hora.', restriction: 'Monstruo' },
  { name: 'Reflejar Técnica', cost: 3, category: 'Control y Únicos', description: 'Si es el único objetivo de una Técnica, puede usar su Reacción para forzar al lanzador a hacer una Salvación de Aura (ND 15). Si falla, el lanzador es el objetivo en su lugar.', restriction: 'Exaltado, Espíritu' },
  { name: 'Tragar Entero', cost: 2, category: 'Control y Únicos', description: 'Si apresa a un objetivo de un tamaño inferior, puede intentar tragarlo con una maniobra. Si tiene éxito, el objetivo está dentro, Cegado, Inmovilizado y sufre daño Corrosivo cada turno.', restriction: null },
  { name: 'Afinidad con Técnicas', cost: 1, category: 'Control y Únicos', description: 'Por cada PR gastado aquí, la criatura gana 5 Puntos de Creación (PC) para diseñar sus propias Técnicas.', restriction: null },
  { name: 'Grito Reactivo', cost: 2, category: 'Control y Únicos', description: 'La primera vez que sufre daño en un combate, puede usar su Reacción para emitir un grito. Todos a 5m deben hacer una Salvación de Cuerpo (ND 13) o quedarán Aturdidos por 1 turno.', restriction: null },
  { name: 'Invocador Innato', cost: 3, category: 'Control y Únicos', description: 'Al inicio del combate, invoca automáticamente 1d6 criaturas de su misma categoría de un ND igual o inferior a 1/4.', restriction: null },
  { name: 'Tamaño cambiante', cost: 2, category: 'Control y Únicos', description: 'La criatura puede cambiar su tamaño hasta en dos categorías, este cambio de tamaño otorga los modificadores de Defensa de la categoría de tamaño pero no los de Resistencia.', restriction: null },
];

export const ALL_WEAPONS: Weapon[] = [
    { name: 'Arma Improvisada', category: 'Armas Simples CC', damage: '1d6 - 3', damageType: 'Variable', properties: [], cost: '0 L' },
    { name: 'Daga / Cuchillo', category: 'Armas Simples CC', damage: '1d6 - 2', damageType: 'Penetrante', properties: [{ name: 'Ligera' }, { name: 'Arrojadiza', details: '5/10' }], cost: '4 L' },
    { name: 'Bastón', category: 'Armas Simples CC', damage: '1d6 - 1', damageType: 'Contundente', properties: [{ name: 'A dos manos' }], cost: '1 L' },
    { name: 'Maza Ligera', category: 'Armas Simples CC', damage: '1d6', damageType: 'Contundente', properties: [{ name: 'Ligera' }], cost: '20 L' },
    { name: 'Hoz', category: 'Armas Simples CC', damage: '1d6 - 1', damageType: 'Cortante', properties: [{ name: 'Ligera' }], cost: '5 L' },
    { name: 'Lanza Corta', category: 'Armas Simples CC', damage: '1d6', damageType: 'Penetrante', properties: [{ name: 'Arrojadiza', details: '10/20' }], cost: '10 L' },
    { name: 'Honda', category: 'Armas Simples Dist.', damage: '1d6 - 2', damageType: 'Contundente', properties: [{ name: 'Rango', details: '15/30' }], cost: '1 L' },
    { name: 'Arco Corto', category: 'Armas Simples Dist.', damage: '1d6', damageType: 'Penetrante', properties: [{ name: 'A dos manos' }, { name: 'Rango', details: '20/40' }], cost: '50 L' },
    { name: 'Ballesta Ligera', category: 'Armas Simples Dist.', damage: '1d6 + 1', damageType: 'Penetrante', properties: [{ name: 'A dos manos' }, { name: 'Rango', details: '25/50' }, { name: 'Recarga', details: 'Rápida' }], cost: '70 L' },
    { name: 'Espada Corta', category: 'Armas Marciales CC', damage: '1d6', damageType: 'Cortante', properties: [{ name: 'Ligera' }], cost: '20 L' },
    { name: 'Hacha de Mano', category: 'Armas Marciales CC', damage: '1d6', damageType: 'Cortante', properties: [{ name: 'Ligera' }, { name: 'Arrojadiza', details: '5/10' }], cost: '20 L' },
    { name: 'Estoque', category: 'Armas Marciales CC', damage: '1d6', damageType: 'Penetrante', properties: [{ name: 'Ligera' }], cost: '25 L' },
    { name: 'Cimitarra', category: 'Armas Marciales CC', damage: '1d6', damageType: 'Cortante', properties: [{ name: 'Ligera' }], cost: '25 L' },
    { name: 'Lanza', category: 'Armas Marciales CC', damage: '1d6 + 1', damageType: 'Penetrante', properties: [{ name: 'Versátil', details: '2d6-1' }, { name: 'Alcance' }], cost: '25 L' },
    { name: 'Espada Larga', category: 'Armas Marciales CC', damage: '1d6 + 1', damageType: 'Cortante', properties: [{ name: 'Versátil', details: '2d6' }], cost: '30 L' },
    { name: 'Martillo de Guerra', category: 'Armas Marciales CC', damage: '1d6 + 1', damageType: 'Contundente', properties: [{ name: 'Versátil', details: '2d6' }], cost: '30 L' },
    { name: 'Hacha de Guerra', category: 'Armas Marciales CC', damage: '1d6 + 1', damageType: 'Cortante', properties: [{ name: 'Versátil', details: '2d6' }], cost: '30 L' },
    { name: 'Maza Pesada', category: 'Armas Marciales CC', damage: '2d6 - 1', damageType: 'Contundente', properties: [{ name: 'Pesada' }], cost: '40 L' },
    { name: 'Alabarda', category: 'Armas Marciales CC', damage: '2d6', damageType: 'Cortante', properties: [{ name: 'Pesada' }, { name: 'A dos manos' }, { name: 'Alcance' }], cost: '50 L' },
    { name: 'Mandoble / Espadón', category: 'Armas Marciales CC', damage: '2d6', damageType: 'Cortante', properties: [{ name: 'Pesada' }, { name: 'A dos manos' }], cost: '55 L' },
    { name: 'Gran Hacha', category: 'Armas Marciales CC', damage: '2d6 + 1', damageType: 'Cortante', properties: [{ name: 'Pesada' }, { name: 'A dos manos' }], cost: '60 L' },
    { name: 'Martillo a Dos Manos', category: 'Armas Marciales CC', damage: '2d6 + 1', damageType: 'Contundente', properties: [{ name: 'Pesada' }, { name: 'A dos manos' }], cost: '60 L' },
    { name: 'Arco Largo', category: 'Armas Marciales Dist.', damage: '1d6 + 1', damageType: 'Penetrante', properties: [{ name: 'Pesada' }, { name: 'A dos manos' }, { name: 'Rango', details: '35/70' }], cost: '80 L' },
    { name: 'Ballesta Pesada', category: 'Armas Marciales Dist.', damage: '2d6', damageType: 'Penetrante', properties: [{ name: 'Pesada' }, { name: 'A dos manos' }, { name: 'Rango', details: '40/80' }, { name: 'Recarga', details: 'Principal' }], cost: '120 L' },
];

export const ALL_ARMORS: Armor[] = [
    { name: 'Ropas Acolchadas', type: 'Ligera', defenseBonus: 2, dexLimit: null, cuerpoRequirement: 0, sigiloPenalty: 0, cost: '10 L' },
    { name: 'Armadura de Cuero', type: 'Ligera', defenseBonus: 3, dexLimit: null, cuerpoRequirement: 0, sigiloPenalty: 0, cost: '20 L' },
    { name: 'Cota de Mallas', type: 'Media', defenseBonus: 4, dexLimit: 2, cuerpoRequirement: 2, sigiloPenalty: -1, cost: '150 L' },
    { name: 'Armadura de Escamas', type: 'Media', defenseBonus: 5, dexLimit: 2, cuerpoRequirement: 2, sigiloPenalty: -2, cost: '200 L' },
    { name: 'Armadura de Placas', type: 'Pesada', defenseBonus: 6, dexLimit: 1, cuerpoRequirement: 3, sigiloPenalty: -3, cost: '800 L' },
    { name: 'Armadura Completa', type: 'Pesada', defenseBonus: 7, dexLimit: 0, cuerpoRequirement: 4, sigiloPenalty: -4, cost: '3000 L' },
];

export const ALL_SHIELDS: Shield[] = [
    { name: 'Broquel', type: 'Ligero', defenseBonus: 1, cuerpoRequirement: 0, sigiloPenalty: null, cost: '10 L' },
    { name: 'Targe (Rodela Pequeña)', type: 'Ligero', defenseBonus: 2, cuerpoRequirement: 1, sigiloPenalty: -1, cost: '20 L' },
    { name: 'Escudo Redondo', type: 'Medio', defenseBonus: 2, cuerpoRequirement: 2, sigiloPenalty: -1, cost: '30 L' },
    { name: 'Escudo Estándar', type: 'Medio', defenseBonus: 3, cuerpoRequirement: 3, sigiloPenalty: -2, cost: '60 L' },
    { name: 'Escudo Grande (Pavés)', type: 'Pesado', defenseBonus: 3, cuerpoRequirement: 4, sigiloPenalty: -3, cost: '80 L' },
    { name: 'Escudo de Torre', type: 'Pesado', defenseBonus: 4, cuerpoRequirement: 4, sigiloPenalty: -3, cost: 'N/A' },
];

const createMap = <T extends Record<K, string | number>, K extends keyof T>(
  array: readonly T[],
  key: K
): Record<T[K], T> => {
  return array.reduce((acc: Record<T[K], T>, item) => {
    acc[item[key]] = item;
    return acc;
  }, {} as Record<T[K], T>);
};

export const ND_MAP = createMap(CHALLENGE_RATINGS, 'nd');
export const SIZE_MAP = createMap(SIZES, 'name');
export const CATEGORY_MAP = createMap(CATEGORIES, 'name');
export const WEAPON_MAP = createMap(ALL_WEAPONS, 'name');
export const ARMOR_MAP = createMap(ALL_ARMORS, 'name');
export const SHIELD_MAP = createMap(ALL_SHIELDS, 'name');