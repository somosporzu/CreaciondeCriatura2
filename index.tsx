// Fix: Import React and ReactDOM to resolve 'React' and 'ReactDOM' not found errors.
import * as React from 'react';
import ReactDOM from 'react-dom/client';

const { useState, useMemo, useEffect, useCallback, useRef } = React;

// Fix: Add declaration for html2canvas to avoid TypeScript errors on window object.
declare global {
  interface Window {
    html2canvas: (element: HTMLElement, options?: any) => Promise<HTMLCanvasElement>;
  }
}

// ===================================================
// UTILITIES
// ===================================================

let uniqueIdCounter = 0;
const generateUniqueId = (prefix: string = 'id'): string => {
  uniqueIdCounter += 1;
  return `${prefix}-${Date.now()}-${uniqueIdCounter}`;
}

// ===================================================
// TYPES
// ===================================================

type ChallengeRatingKey = '1/8' | '1/4' | '1/2' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13' | '14' | '15';
type SizeKey = 'Minúsculo' | 'Pequeño' | 'Mediano' | 'Grande' | 'Enorme' | 'Colosal';
type CategoryKey = 'Bestia' | 'Monstruo' | 'Espíritu' | 'Exaltado' | 'Corrupto' | 'Elemental' | 'Artificial';
type TraitCategory = 'Atributos y Vitalidad' | 'Ofensivos' | 'Defensivos' | 'Movilidad' | 'Aura y Percepción' | 'Control y Únicos';
type DamageType = 'Cortante' | 'Penetrante' | 'Contundente' | 'Fuego' | 'Hielo' | 'Eléctrico' | 'Corrosivo' | 'Radiante' | 'Mental' | 'Variable';
type MovementType = 'Nadar' | 'Trepar' | 'Excavar';
type StatusEffect = 'Asfixiado' | 'Asustado' | 'Aturdido' | 'Controlado' | 'Derribado' | 'Dormido' | 'Encantado' | 'Envenenado' | 'Envenenado Mayor' | 'Inmovilizado' | 'Quemado' | 'Quemado Mayor';


interface WeaponProperty {
  name: 'Ligera' | 'Pesada' | 'A dos manos' | 'Versátil' | 'Arrojadiza' | 'Alcance' | 'Rango' | 'Recarga';
  details?: string;
}

interface Weapon {
  name: string;
  category: 'Armas Simples CC' | 'Armas Simples Dist.' | 'Armas Marciales CC' | 'Armas Marciales Dist.';
  damage: string;
  damageType: DamageType;
  properties: WeaponProperty[];
  cost: string;
}

interface Armor {
    name: string;
    type: 'Ligera' | 'Media' | 'Pesada';
    defenseBonus: number;
    dexLimit: number | null;
    cuerpoRequirement: number;
    sigiloPenalty: number;
    cost: string;
}

interface Shield {
    name: string;
    type: 'Ligero' | 'Medio' | 'Pesado';
    defenseBonus: number;
    cuerpoRequirement: number;
    sigiloPenalty: number | null;
    cost: string;
}

interface EquippedWeapon {
    weapon: Weapon;
    bonus: number;
}

interface EquippedArmor {
    armor: Armor;
    bonus: number;
}

interface EquippedShield {
    shield: Shield;
    bonus: number;
}

interface ChallengeRating {
  nd: ChallengeRatingKey;
  resistencia: number;
  defensa: number;
  bonoBase: number;
  danoBase: string;
  pr: number;
}

interface Size {
  name: SizeKey;
  modResistencia: number;
  modDefensa: number;
}

interface Category {
  name: CategoryKey;
  ability: string;
}

interface Trait {
  name: string;
  cost: number | 'Gana 1' | 'Gana 2';
  category: TraitCategory;
  description: string;
  isCategoryAbility?: boolean;
  restriction: CategoryKey | 'Bestia, Monstruo' | 'Corrupto, Espíritu' | 'Exaltado, Espíritu' | 'Monstruo, Corrupto' | 'Artificial, Exaltado' | 'Bestia, Artificial' | 'Monstruo, Artificial' | 'Espíritu, Artificial' | null;
  instanceId?: string;
  appliedData?: {
    damageType?: DamageType;
    attribute?: keyof Creature['attributes'];
    concepto?: string;
    nature?: string;
    movementType?: MovementType;
    statusEffect?: StatusEffect;
  }
}

interface Attack {
  name: string;
  type: 'Melee' | 'Ranged';
  attribute: keyof Creature['attributes'];
  damageDice: string;
  damageModifier: number;
  damageType: DamageType;
  description: string;
  range?: string;
}

interface Creature {
  id?: string;
  name: string;
  nd: ChallengeRatingKey;
  size: SizeKey;
  category: CategoryKey;
  attributes: {
    cuerpo: number;
    destreza: number;
    aura: number;
  };
  traits: Trait[];
  attacks: Attack[];
  natures: string[];
  equippedWeapons: EquippedWeapon[];
  equippedArmor?: EquippedArmor;
  equippedShield?: EquippedShield;
}

// ===================================================
// CONSTANTS
// ===================================================

const CHALLENGE_RATINGS: ChallengeRating[] = [
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

const SIZES: Size[] = [
  { name: 'Minúsculo', modResistencia: -5, modDefensa: 3 },
  { name: 'Pequeño', modResistencia: -5, modDefensa: 1 },
  { name: 'Mediano', modResistencia: 0, modDefensa: 0 },
  { name: 'Grande', modResistencia: 15, modDefensa: -1 },
  { name: 'Enorme', modResistencia: 30, modDefensa: -2 },
  { name: 'Colosal', modResistencia: 60, modDefensa: -4 },
];

const CATEGORIES: Category[] = [
  { name: 'Bestia', ability: 'Instinto Primario: Tiene ventaja en las tiradas de percepción para detectar peligros.' },
  { name: 'Monstruo', ability: 'Presencia Aterradora: Quienes lo vean por primera vez deben superar una Salvación de Aura (ND 12) o quedar Asustados por 1 turno.' },
  { name: 'Espíritu', ability: 'Incorpóreo: Tiene Resistencia a los daños Cortante, Penetrante y Contundente de fuentes no mágicas' },
  { name: 'Exaltado', ability: 'Toque divino: Sus ataques infligen 1d6 de daño Radiante adicional' },
  { name: 'Corrupto', ability: 'Toque Profano: Sus ataques infligen 1d6 de daño Corrosivo adicional.' },
  { name: 'Elemental', ability: 'Toque elemental: Sus ataques infligen 1d6 de daño adicional acorde al elemento del que este hecho.' },
  { name: 'Artificial', ability: 'Mente Mecánica: Es inmune al daño Mental, al estado Asustado y a los venenos.' },
];

const NATURES: string[] = [
    "Apasionadamente", "Astutamente", "Brutalmente", "Caóticamente", "Carismáticamente",
    "Cautelosamente", "Con Optimismo", "Curiosamente", "Despiadadamente", "Elegantemente",
    "Fríamente", "Impulsivamente", "Inestablemente", "Metódicamente", "Rápidamente",
    "Silenciosamente", "Siniestrante", "Tenazmente", "Torpemente", "Valientemente"
];

const DAMAGE_TYPES: DamageType[] = [
    'Contundente', 'Cortante', 'Penetrante', 'Fuego', 'Hielo', 'Eléctrico', 'Corrosivo', 'Radiante', 'Mental', 'Variable'
];

const ALL_CONCEPTS: string[] = [
    "Agricultor", "Alfarero", "Artesano", "Astrólogo", "Bardo", 
    "Botánico", "Carpintero", "Cazador", "Cocinero", "Constructor", 
    "Cortesano", "Curandero", "Domador", "Erudito", "Espía", 
    "Espiritista", "Explorador", "Filósofo", "Guerrero", "Hechicero", 
    "Herrero", "Historiador", "Ingeniero", "Ladrón", "Lingüista", 
    "Marinero", "Mercader", "Minero", "Monje", "Noble", 
    "Naturalista", "Pescador", "Pícaro", "Profesor", "Sacerdote", 
    "Sastre", "Tintorero"
];

const MOVEMENT_TYPES: MovementType[] = ['Nadar', 'Trepar', 'Excavar'];

const STATUS_EFFECTS: StatusEffect[] = [
    'Asfixiado', 'Asustado', 'Aturdido', 'Controlado', 'Derribado', 'Dormido', 'Encantado', 'Envenenado', 'Envenenado Mayor', 'Inmovilizado', 'Quemado', 'Quemado Mayor'
];

const ALL_TRAITS: Trait[] = [
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
  // Defensivos
  { name: 'Armadura Natural', cost: 1, category: 'Defensivos', description: '+1 a la Defensa. (Comprable varias veces).', restriction: null },
  { name: 'Resistente', cost: 1, category: 'Defensivos', description: 'Gana Resistencia a un tipo de daño.', restriction: null },
  { name: 'Inmune', cost: 2, category: 'Defensivos', description: 'Gana Inmunidad a un tipo de daño.', restriction: null },
  { name: 'Inmunidad a estado', cost: 2, category: 'Defensivos', description: 'La criatura es inmune a un estado alterado seleccionado.', restriction: null },
  { name: 'Vulnerable', cost: 'Gana 2', category: 'Defensivos', description: 'Gana Vulnerabilidad a un tipo de daño. (Te devuelve 2 PR).', restriction: null },
  { name: 'Piel Gruesa', cost: 1, category: 'Defensivos', description: 'Ignora 1 punto de daño de todas las fuentes. (Comprable varias veces).', restriction: null },
  { name: 'Indomable', cost: 2, category: 'Defensivos', description: 'Es inmune a los estados Asustado y Controlado.', restriction: null },
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
  // Movilidad
  { name: 'Movimiento Especial', cost: 1, category: 'Movilidad', description: 'Gana una velocidad de Nadar, Trepar o Excavar.', restriction: null },
  { name: 'Velocidad Increíble', cost: 1, category: 'Movilidad', description: 'Su velocidad terrestre aumenta en 5 metros.', restriction: null },
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
  { name: 'Aura de Vida', cost: 3, category: 'Aura y Percepción', description: 'Los aliados que empiecen su turno a 5m de la criatura recuperan 1d6 de Resistencia.', restriction: 'Elemental' },
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
  { name: 'Absorber Elemento', cost: 3, category: 'Control y Únicos', description: 'Elige un tipo de daño elemental. Es inmune a ese daño y lo absorbe, recuperando Resistencia en lugar de sufrirlo.', restriction: 'Espíritu, Artificial' },
  { name: 'Resistencia Legendaria', cost: 2, category: 'Control y Únicos', description: 'Puede elegir superar automáticamente una Tirada de Salvación que haya fallado. (Comprable varias veces para ganar mais usos diarios).', restriction: null },
  { name: 'Múltiples Cabezas', cost: 2, category: 'Control y Únicos', description: 'Tiene ventaja en las salvaciones contra el estado Aturdido y puede realizar una Reacción adicional por ronda.', restriction: 'Bestia, Monstruo' },
  { name: 'Asimilar', cost: 4, category: 'Control y Únicos', description: 'Una vez por día, al matar a una criatura, puede gastar una Acción Principal para devorarla y ganar uno de sus Rasgos (de coste 2 PR o menos) durante 1 hora.', restriction: 'Monstruo' },
  { name: 'Reflejar Técnica', cost: 3, category: 'Control y Únicos', description: 'Si es el único objetivo de una Técnica, puede usar su Reacción para forzar al lanzador a hacer una Salvación de Aura (ND 15). Si falla, el lanzador es el objetivo en su lugar.', restriction: 'Exaltado, Espíritu' },
  { name: 'Tragar Entero', cost: 2, category: 'Control y Únicos', description: 'Si apresa a un objetivo de un tamaño inferior, puede intentar tragarlo con una maniobra. Si tiene éxito, el objetivo está dentro, Cegado, Inmovilizado y sufre daño Corrosivo cada turno.', restriction: null },
  { name: 'Afinidad con Técnicas', cost: 1, category: 'Control y Únicos', description: 'Por cada PR gastado aquí, la criatura gana 5 Puntos de Creación (PC) para diseñar sus propias Técnicas.', restriction: null },
  { name: 'Grito Reactivo', cost: 2, category: 'Control y Únicos', description: 'La primera vez que sufre daño en un combate, puede usar su Reacción para emitir un grito. Todos a 5m deben hacer una Salvación de Cuerpo (ND 13) o quedarán Aturdidos por 1 turno.', restriction: null },
  { name: 'Invocador Innato', cost: 3, category: 'Control y Únicos', description: 'Al inicio del combate, invoca automáticamente 1d6 criaturas de su misma categoría de un ND igual o inferior a 1/4.', restriction: null },
];

const ALL_WEAPONS: Weapon[] = [
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

const ALL_ARMORS: Armor[] = [
    { name: 'Ropas Acolchadas', type: 'Ligera', defenseBonus: 2, dexLimit: null, cuerpoRequirement: 0, sigiloPenalty: 0, cost: '10 L' },
    { name: 'Armadura de Cuero', type: 'Ligera', defenseBonus: 3, dexLimit: null, cuerpoRequirement: 0, sigiloPenalty: 0, cost: '20 L' },
    { name: 'Cota de Mallas', type: 'Media', defenseBonus: 4, dexLimit: 2, cuerpoRequirement: 2, sigiloPenalty: -1, cost: '150 L' },
    { name: 'Armadura de Escamas', type: 'Media', defenseBonus: 5, dexLimit: 2, cuerpoRequirement: 2, sigiloPenalty: -2, cost: '200 L' },
    { name: 'Armadura de Placas', type: 'Pesada', defenseBonus: 6, dexLimit: 1, cuerpoRequirement: 3, sigiloPenalty: -3, cost: '800 L' },
    { name: 'Armadura Completa', type: 'Pesada', defenseBonus: 7, dexLimit: 0, cuerpoRequirement: 4, sigiloPenalty: -4, cost: '3000 L' },
];

const ALL_SHIELDS: Shield[] = [
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
  // Fix: Add explicit types for the accumulator to ensure type safety.
  return array.reduce((acc: Record<T[K], T>, item) => {
    acc[item[key]] = item;
    return acc;
  }, {} as Record<T[K], T>);
};

const ND_MAP = createMap(CHALLENGE_RATINGS, 'nd');
const SIZE_MAP = createMap(SIZES, 'name');
const CATEGORY_MAP = createMap(CATEGORIES, 'name');
const WEAPON_MAP = createMap(ALL_WEAPONS, 'name');
const ARMOR_MAP = createMap(ALL_ARMORS, 'name');
const SHIELD_MAP = createMap(ALL_SHIELDS, 'name');


// ===================================================
// COMPONENTS
// ===================================================

// --- ConceptModal ---
const ConceptModal = ({ trait, isOpen, onClose, onConfirm }) => {
  const [selectedConcept, setSelectedConcept] = useState(ALL_CONCEPTS[0]);
  if (!isOpen) return null;
  const handleConfirm = () => { onConfirm(trait, selectedConcept); };
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in-fast" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="concept-modal-title">
      <div className="bg-stone-800 rounded-lg shadow-2xl border border-stone-700 w-full max-w-sm p-6 m-4 animate-fade-in" onClick={e => e.stopPropagation()}>
        <h3 id="concept-modal-title" className="text-2xl font-bold text-amber-500 mb-4 text-center">Seleccionar Concepto para "{trait.name}"</h3>
        <p className="text-stone-400 text-center mb-6">Elige el concepto que esta criatura aprenderá.</p>
        <div className="space-y-4">
            <label htmlFor="conceptSelect" className="sr-only">Concepto</label>
            <select id="conceptSelect" value={selectedConcept} onChange={e => setSelectedConcept(e.target.value)} className="w-full bg-stone-700 border border-stone-600 rounded-md shadow-sm py-2 px-3 text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-600">
                {ALL_CONCEPTS.map(concept => <option key={concept} value={concept}>{concept}</option>)}
            </select>
        </div>
        <div className="mt-8 flex justify-end gap-4">
            <button onClick={onClose} className="px-6 py-2 bg-stone-600 hover:bg-stone-500 text-stone-100 font-semibold rounded-lg shadow-md transition-colors">Cancelar</button>
            <button onClick={handleConfirm} className="px-6 py-2 bg-amber-700 hover:bg-amber-600 text-stone-100 font-semibold rounded-lg shadow-md transition-colors">Confirmar</button>
        </div>
      </div>
    </div>
  );
};

// --- DamageTypeModal ---
const DamageTypeModal = ({ trait, isOpen, onClose, onConfirm }) => {
  const [selectedType, setSelectedType] = useState(DAMAGE_TYPES[0]);
  if (!isOpen) return null;
  const handleConfirm = () => { onConfirm(trait, selectedType); };
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in-fast" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="damage-type-modal-title">
      <div className="bg-stone-800 rounded-lg shadow-2xl border border-stone-700 w-full max-w-sm p-6 m-4 animate-fade-in" onClick={e => e.stopPropagation()}>
        <h3 id="damage-type-modal-title" className="text-2xl font-bold text-amber-500 mb-4 text-center">Seleccionar Tipo de Daño para "{trait.name}"</h3>
        <p className="text-stone-400 text-center mb-6">Elige a qué tipo de daño afectará este rasgo.</p>
        <div className="space-y-4">
            <label htmlFor="damageTypeSelect" className="sr-only">Tipo de Daño</label>
            <select id="damageTypeSelect" value={selectedType} onChange={e => setSelectedType(e.target.value)} className="w-full bg-stone-700 border border-stone-600 rounded-md shadow-sm py-2 px-3 text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-600">
                {DAMAGE_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
        </div>
        <div className="mt-8 flex justify-end gap-4">
            <button onClick={onClose} className="px-6 py-2 bg-stone-600 hover:bg-stone-500 text-stone-100 font-semibold rounded-lg shadow-md transition-colors">Cancelar</button>
            <button onClick={handleConfirm} className="px-6 py-2 bg-amber-700 hover:bg-amber-600 text-stone-100 font-semibold rounded-lg shadow-md transition-colors">Confirmar</button>
        </div>
      </div>
    </div>
  );
};

// --- StatusEffectModal ---
const StatusEffectModal = ({ trait, isOpen, onClose, onConfirm }) => {
  const [selectedEffect, setSelectedEffect] = useState(STATUS_EFFECTS[0]);
  if (!isOpen) return null;
  const handleConfirm = () => { onConfirm(trait, selectedEffect); };
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in-fast" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="status-effect-modal-title">
      <div className="bg-stone-800 rounded-lg shadow-2xl border border-stone-700 w-full max-w-sm p-6 m-4 animate-fade-in" onClick={e => e.stopPropagation()}>
        <h3 id="status-effect-modal-title" className="text-2xl font-bold text-amber-500 mb-4 text-center">Seleccionar Estado para "{trait.name}"</h3>
        <p className="text-stone-400 text-center mb-6">Elige qué estado alterado afectará este rasgo.</p>
        <div className="space-y-4">
            <label htmlFor="statusEffectSelect" className="sr-only">Estado Alterado</label>
            <select id="statusEffectSelect" value={selectedEffect} onChange={e => setSelectedEffect(e.target.value)} className="w-full bg-stone-700 border border-stone-600 rounded-md shadow-sm py-2 px-3 text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-600">
                {STATUS_EFFECTS.map(effect => <option key={effect} value={effect}>{effect}</option>)}
            </select>
        </div>
        <div className="mt-8 flex justify-end gap-4">
            <button onClick={onClose} className="px-6 py-2 bg-stone-600 hover:bg-stone-500 text-stone-100 font-semibold rounded-lg shadow-md transition-colors">Cancelar</button>
            <button onClick={handleConfirm} className="px-6 py-2 bg-amber-700 hover:bg-amber-600 text-stone-100 font-semibold rounded-lg shadow-md transition-colors">Confirmar</button>
        </div>
      </div>
    </div>
  );
};

// --- MovementTypeModal ---
const MovementTypeModal = ({ trait, isOpen, onClose, onConfirm }) => {
  const [selectedType, setSelectedType] = useState(MOVEMENT_TYPES[0]);
  if (!isOpen) return null;
  const handleConfirm = () => { onConfirm(trait, selectedType); };
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in-fast" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="movement-type-modal-title">
      <div className="bg-stone-800 rounded-lg shadow-2xl border border-stone-700 w-full max-w-sm p-6 m-4 animate-fade-in" onClick={e => e.stopPropagation()}>
        <h3 id="movement-type-modal-title" className="text-2xl font-bold text-amber-500 mb-4 text-center">Seleccionar Tipo de Movimiento para "{trait.name}"</h3>
        <p className="text-stone-400 text-center mb-6">Elige qué tipo de movimiento especial ganará la criatura.</p>
        <div className="space-y-4">
            <label htmlFor="movementTypeSelect" className="sr-only">Tipo de Movimiento</label>
            <select id="movementTypeSelect" value={selectedType} onChange={e => setSelectedType(e.target.value)} className="w-full bg-stone-700 border border-stone-600 rounded-md shadow-sm py-2 px-3 text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-600">
                {MOVEMENT_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
        </div>
        <div className="mt-8 flex justify-end gap-4">
            <button onClick={onClose} className="px-6 py-2 bg-stone-600 hover:bg-stone-500 text-stone-100 font-semibold rounded-lg shadow-md transition-colors">Cancelar</button>
            <button onClick={handleConfirm} className="px-6 py-2 bg-amber-700 hover:bg-amber-600 text-stone-100 font-semibold rounded-lg shadow-md transition-colors">Confirmar</button>
        </div>
      </div>
    </div>
  );
};

// --- NatureModal ---
const NatureModal = ({ trait, isOpen, onClose, onConfirm }) => {
  const [selectedNature, setSelectedNature] = useState(NATURES[0]);
  if (!isOpen) return null;
  const handleConfirm = () => { onConfirm(trait, selectedNature); };
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in-fast" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="nature-modal-title">
      <div className="bg-stone-800 rounded-lg shadow-2xl border border-stone-700 w-full max-w-sm p-6 m-4 animate-fade-in" onClick={e => e.stopPropagation()}>
        <h3 id="nature-modal-title" className="text-2xl font-bold text-amber-500 mb-4 text-center">Seleccionar Naturaleza para "{trait.name}"</h3>
        <p className="text-stone-400 text-center mb-6">Elige la naturaleza adicional que esta criatura aprenderá.</p>
        <div className="space-y-4">
            <label htmlFor="natureSelect" className="sr-only">Naturaleza</label>
            <select id="natureSelect" value={selectedNature} onChange={e => setSelectedNature(e.target.value)} className="w-full bg-stone-700 border border-stone-600 rounded-md shadow-sm py-2 px-3 text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-600">
                {NATURES.map(nature => <option key={nature} value={nature}>{nature}</option>)}
            </select>
        </div>
        <div className="mt-8 flex justify-end gap-4">
            <button onClick={onClose} className="px-6 py-2 bg-stone-600 hover:bg-stone-500 text-stone-100 font-semibold rounded-lg shadow-md transition-colors">Cancelar</button>
            <button onClick={handleConfirm} className="px-6 py-2 bg-amber-700 hover:bg-amber-600 text-stone-100 font-semibold rounded-lg shadow-md transition-colors">Confirmar</button>
        </div>
      </div>
    </div>
  );
};

// --- ExportOptionsModal ---
const ExportOptionsModal = ({ isOpen, onClose, onConfirm }) => {
  const [options, setOptions] = useState({ includeTraits: true, includeAttacks: true, format: 'full' });
  if (!isOpen) return null;
  const handleOptionChange = (field, value) => { setOptions(prev => ({ ...prev, [field]: value })); };
  const handleConfirmClick = () => { onConfirm(options); };
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in-fast" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="export-modal-title">
      <div className="bg-stone-800 rounded-lg shadow-2xl border border-stone-700 w-full max-w-md p-6 m-4 animate-fade-in" onClick={e => e.stopPropagation()}>
        <h3 id="export-modal-title" className="text-2xl font-bold text-amber-500 mb-6 text-center">Opciones de Exportación de Texto</h3>
        <div className="space-y-6">
          <fieldset>
            <legend className="text-lg font-semibold text-stone-300 mb-2">Secciones a Incluir</legend>
            <div className="space-y-2">
              <label className="flex items-center gap-3 bg-stone-700/50 p-3 rounded-md cursor-pointer hover:bg-stone-700 transition-colors">
                <input type="checkbox" checked={options.includeAttacks} onChange={e => handleOptionChange('includeAttacks', e.target.checked)} className="h-5 w-5 rounded bg-stone-600 border-stone-500 text-amber-600 focus:ring-amber-500" />
                <span className="text-stone-200">Incluir Acciones y Ataques</span>
              </label>
              <label className="flex items-center gap-3 bg-stone-700/50 p-3 rounded-md cursor-pointer hover:bg-stone-700 transition-colors">
                <input type="checkbox" checked={options.includeTraits} onChange={e => handleOptionChange('includeTraits', e.target.checked)} className="h-5 w-5 rounded bg-stone-600 border-stone-500 text-amber-600 focus:ring-amber-500" />
                <span className="text-stone-200">Incluir Rasgos y Habilidades</span>
              </label>
            </div>
          </fieldset>
          <fieldset>
            <legend className="text-lg font-semibold text-stone-300 mb-2">Formato de Salida</legend>
            <div className="space-y-2">
              <label className="flex items-center gap-3 bg-stone-700/50 p-3 rounded-md cursor-pointer hover:bg-stone-700 transition-colors">
                <input type="radio" name="format" value="full" checked={options.format === 'full'} onChange={e => handleOptionChange('format', e.target.value)} className="h-5 w-5 bg-stone-600 border-stone-500 text-amber-600 focus:ring-amber-500" />
                <div>
                  <span className="text-stone-200 font-medium">Completo</span>
                  <p className="text-xs text-stone-400">Formato detallado, ideal para fichas de referencia.</p>
                </div>
              </label>
              <label className="flex items-center gap-3 bg-stone-700/50 p-3 rounded-md cursor-pointer hover:bg-stone-700 transition-colors">
                <input type="radio" name="format" value="simple" checked={options.format === 'simple'} onChange={e => handleOptionChange('format', e.target.value)} className="h-5 w-5 bg-stone-600 border-stone-500 text-amber-600 focus:ring-amber-500" />
                 <div>
                  <span className="text-stone-200 font-medium">Simple</span>
                  <p className="text-xs text-stone-400">Formato condensado, útil para notas rápidas.</p>
                </div>
              </label>
            </div>
          </fieldset>
        </div>
        <div className="mt-8 flex justify-end gap-4">
            <button onClick={onClose} className="px-6 py-2 bg-stone-600 hover:bg-stone-500 text-stone-100 font-semibold rounded-lg shadow-md transition-colors">Cancelar</button>
            <button onClick={handleConfirmClick} className="px-6 py-2 bg-lime-700 hover:bg-lime-600 text-stone-100 font-semibold rounded-lg shadow-md transition-colors">Copiar Texto</button>
        </div>
      </div>
    </div>
  );
};

// --- CreatureSheet ---
const getTraitDisplayInfo = (trait) => {
    let displayName = trait.name;
    let displayDescription = trait.description;
    if (trait.appliedData?.damageType) {
        displayName = `${trait.name}: ${trait.appliedData.damageType}`;
        displayDescription = displayDescription.replace('un tipo de daño', trait.appliedData.damageType);
    } else if (trait.appliedData?.attribute) {
        const attrName = trait.appliedData.attribute.charAt(0).toUpperCase() + trait.appliedData.attribute.slice(1);
        if (trait.name === 'Mejora de Atributo') {
            displayName = `${trait.name} (${attrName})`;
            displayDescription = `Aumenta ${attrName} en +1.`;
        } else if (trait.name === 'Deficiencia de Atributo') {
            displayName = `Deficiencia de Atributo (${attrName})`;
            displayDescription = `Reduce ${attrName} en -1.`;
        }
    } else if (trait.appliedData?.concepto) {
        displayName = `${trait.name} (${trait.appliedData.concepto})`;
        displayDescription = displayDescription.replace('un nuevo Concepto de la lista general', `el concepto de ${trait.appliedData.concepto}`);
    } else if (trait.appliedData?.nature) {
        displayName = `${trait.name} (${trait.appliedData.nature})`;
        displayDescription = displayDescription.replace('una nueva Naturaleza de la lista general', `la naturaleza ${trait.appliedData.nature}`);
    } else if (trait.appliedData?.movementType) {
        displayName = `${trait.name} (${trait.appliedData.movementType})`;
        displayDescription = displayDescription.replace('Nadar, Trepar o Excavar', trait.appliedData.movementType);
    } else if (trait.appliedData?.statusEffect) {
        displayName = `${trait.name} (${trait.appliedData.statusEffect})`;
        if (trait.name === 'Estado añadido') {
            displayDescription = `Al impactar con un ataque, el objetivo debe superar una Salvación de Aura (ND 12) o sufrir el estado ${trait.appliedData.statusEffect}.`;
        } else if (trait.name === 'Inmunidad a estado') {
             displayDescription = `La criatura es inmune al estado ${trait.appliedData.statusEffect}.`;
        }
    }
    return { displayName, displayDescription };
}

interface TraitItemProps {
  trait: Trait;
  count: number;
}
const TraitItem: React.FC<TraitItemProps> = ({ trait, count }) => {
    const { displayName, displayDescription } = getTraitDisplayInfo(trait);
    let finalDisplayName = displayName;
    if (count > 1) {
        const inParenMatch = displayName.match(/\(([^)]+)\)/);
        if (inParenMatch) { finalDisplayName = displayName.replace(inParenMatch[0], `(${inParenMatch[1]} x${count})`); }
        else { finalDisplayName = `${displayName} (x${count})`; }
    }
    return (<li className="py-1"><strong className="font-semibold text-amber-400">{finalDisplayName}.</strong>{' '}{displayDescription}</li>);
  };
const CreatureSheet = ({ creature }) => {
  const [copyText, setCopyText] = useState('Exportar a Texto');
  const [imageCopyText, setImageCopyText] = useState('Exportar a Imagen');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const sheetRef = useRef(null);
  const baseStats = useMemo(() => ND_MAP[creature.nd], [creature.nd]);
  const sizeMods = useMemo(() => SIZE_MAP[creature.size], [creature.size]);
  const categoryTrait = useMemo(() => creature.traits.find(t => t.isCategoryAbility), [creature.traits]);
  const concepts = useMemo(() => creature.traits.filter(t => t.name === 'Versatilidad Conceptual' && t.appliedData?.concepto).map(t => t.appliedData.concepto), [creature.traits]);
  const allNatures = useMemo(() => {
    const additionalNatures = creature.traits.filter(t => t.name === 'Versatilidad de Carácter' && t.appliedData?.nature).map(t => t.appliedData.nature);
    return [...creature.natures, ...additionalNatures];
  }, [creature.natures, creature.traits]);
  const fullCategory = useMemo(() => [creature.category, ...concepts].join(' '), [creature.category, concepts]);
  const finalResistencia = useMemo(() => {
    const base = baseStats.resistencia;
    const fromSize = sizeMods.modResistencia;
    const fromTraits = creature.traits.filter(t => t.name === 'Vitalidad Aumentada').length * 10;
    return Math.max(4, base + fromSize + fromTraits);
  }, [baseStats, sizeMods, creature.traits]);
  const finalDefensa = useMemo(() => {
    const base = baseStats.defensa;
    const fromSize = sizeMods.modDefensa;
    const fromTraits = creature.traits.filter(t => t.name === 'Armadura Natural').length;
    const fromArmor = (creature.equippedArmor?.armor.defenseBonus || 0) + (creature.equippedArmor?.bonus || 0);
    const fromShield = (creature.equippedShield?.shield.defenseBonus || 0) + (creature.equippedShield?.bonus || 0);
    return base + fromSize + fromTraits + fromArmor + fromShield;
  }, [baseStats, sizeMods, creature.traits, creature.equippedArmor, creature.equippedShield]);
  const finalIniciativa = useMemo(() => {
      return (creature.attributes.destreza + creature.attributes.aura) - 2;
  }, [creature.attributes.destreza, creature.attributes.aura]);
  const movementDisplay = useMemo(() => {
    const landSpeed = 9 + creature.attributes.destreza + (creature.traits.filter(t => t.name === 'Velocidad Increíble').length * 5);
    const specialMovements = new Set();
    creature.traits.forEach(trait => {
        if (trait.name === 'Vuelo') { specialMovements.add(`Vuelo ${landSpeed}m`); }
        if (trait.name === 'Movimiento Especial' && trait.appliedData?.movementType) { specialMovements.add(`${trait.appliedData.movementType} ${landSpeed}m`); }
    });
    return [`${landSpeed}m`, ...Array.from(specialMovements)].join(', ');
  }, [creature.attributes.destreza, creature.traits]);
  const getEquipmentNameWithBonus = (item, type) => {
      const baseItem = item[type];
      const bonus = item.bonus;
      if (bonus === 0) return baseItem.name;
      return `${baseItem.name} ${bonus > 0 ? '+' : ''}${bonus}`;
  };
  const finalAttacks = useMemo(() => {
      const weaponAttacks = creature.equippedWeapons.map(equippedWeapon => {
          const { weapon, bonus } = equippedWeapon;
          const usesDex = weapon.properties.some(p => p.name === 'Ligera');
          const attribute = usesDex ? 'destreza' : 'cuerpo';
          const damageParts = weapon.damage.split(/([+-])/).map(s => s.trim());
          const damageDice = damageParts[0];
          const baseDamageModifier = damageParts.length > 1 ? parseInt(damageParts[1] + damageParts[2]) : 0;
          const totalDamageModifier = baseDamageModifier + bonus;
          const description = weapon.properties.map(p => p.details ? `${p.name} (${p.details})` : p.name).join(', ');
          let weaponName = getEquipmentNameWithBonus({weapon, bonus}, 'weapon');
          const weaponAttack: Attack = { name: weaponName, type: weapon.category.includes('Dist.') ? 'Ranged' : 'Melee', attribute: attribute, damageDice: damageDice, damageModifier: totalDamageModifier, damageType: weapon.damageType, description: description };
          return weaponAttack;
      });
      return [...weaponAttacks, ...creature.attacks];
  }, [creature.equippedWeapons, creature.attacks]);

const { vulnerabilities, resistances, immunities, statusImmunities, otherTraits } = useMemo<{
    vulnerabilities: DamageType[];
    resistances: DamageType[];
    immunities: DamageType[];
    statusImmunities: StatusEffect[];
    otherTraits: { trait: Trait; count: number }[];
  }>(() => {
    const vulnerabilities: DamageType[] = [];
    const resistances: DamageType[] = [];
    const immunities: DamageType[] = [];
    const statusImmunities: StatusEffect[] = [];
    const otherTraitCounts = new Map<string, { trait: Trait; count: number }>();
    creature.traits.filter(trait => !trait.isCategoryAbility).forEach(trait => {
        if (trait.name === 'Vulnerable' && trait.appliedData?.damageType) { vulnerabilities.push(trait.appliedData.damageType); }
        else if (trait.name === 'Resistente' && trait.appliedData?.damageType) { resistances.push(trait.appliedData.damageType); }
        else if (trait.name === 'Inmune' && trait.appliedData?.damageType) { immunities.push(trait.appliedData.damageType); }
        else if (trait.name === 'Inmunidad a estado' && trait.appliedData?.statusEffect) { statusImmunities.push(trait.appliedData.statusEffect); }
        else {
            const key = `${trait.name}|${JSON.stringify(trait.appliedData ?? {})}`;
            if (otherTraitCounts.has(key)) {
                otherTraitCounts.get(key)!.count++;
            }
            else { otherTraitCounts.set(key, { trait: trait, count: 1 }); }
        }
    });
    return { vulnerabilities, resistances, immunities, statusImmunities, otherTraits: Array.from(otherTraitCounts.values()) };
  }, [creature.traits]);

  const handleConfirmExport = (options) => {
    let textToCopy = '';
    const equipmentList = [...creature.equippedWeapons.map(w => getEquipmentNameWithBonus(w, 'weapon')), creature.equippedArmor ? getEquipmentNameWithBonus(creature.equippedArmor, 'armor') : null, creature.equippedShield ? getEquipmentNameWithBonus(creature.equippedShield, 'shield') : null].filter(Boolean).join(', ');
    if (options.format === 'simple') {
        textToCopy += `${creature.name.toUpperCase()} (ND ${creature.nd})\n`;
        textToCopy += `Res: ${finalResistencia}, Def: ${finalDefensa}, Ini: ${finalIniciativa >= 0 ? '+' : ''}${finalIniciativa}, Mov: ${movementDisplay}\n`;
        textToCopy += `Cuerpo: ${creature.attributes.cuerpo > 0 ? '+' : ''}${creature.attributes.cuerpo}, Destreza: ${creature.attributes.destreza > 0 ? '+' : ''}${creature.attributes.destreza}, Aura: ${creature.attributes.aura > 0 ? '+' : ''}${creature.attributes.aura}\n`;
        if (options.includeAttacks && finalAttacks.length > 0) {
            const attacksText = finalAttacks.map(attack => {
                let attackBonus = creature.attributes[attack.attribute];
                const weaponSource = creature.equippedWeapons.find(w => getEquipmentNameWithBonus(w, 'weapon') === attack.name);
                if (weaponSource) { attackBonus += weaponSource.bonus; }
                const totalDamageModifier = creature.attributes[attack.attribute] + attack.damageModifier;
                const modifierString = totalDamageModifier === 0 ? '' : (totalDamageModifier > 0 ? ` + ${totalDamageModifier}` : ` - ${Math.abs(totalDamageModifier)}`);
                return `${attack.name} (${(attackBonus >= 0 ? '+' : '') + attackBonus}, ${attack.damageDice}${modifierString} ${attack.damageType})`;
            }).join('; ');
            textToCopy += `Ataques: ${attacksText}\n`;
        }
        if (options.includeTraits && (categoryTrait || otherTraits.length > 0)) {
            const traitsList = [];
            if(categoryTrait) traitsList.push(categoryTrait.name);
            otherTraits.forEach(({ trait, count }) => {
                 const { displayName } = getTraitDisplayInfo(trait);
                 const countText = count > 1 ? ` (x${count})` : '';
                 traitsList.push(`${displayName}${countText}`);
            });
            textToCopy += `Rasgos: ${traitsList.join(', ')}\n`;
        }
    } else {
        textToCopy += `${creature.name.toUpperCase()}\n`;
        textToCopy += `${creature.size} ${fullCategory} (ND ${creature.nd})\n`;
        textToCopy += `------------------------------------\n`;
        textToCopy += `Resistencia: ${finalResistencia}\nDefensa: ${finalDefensa}\nIniciativa: ${finalIniciativa >= 0 ? '+' : ''}${finalIniciativa}\nMovimiento: ${movementDisplay}\n`;
        if (vulnerabilities.length > 0) textToCopy += `Vulnerable a: ${vulnerabilities.join(', ')}\n`;
        if (resistances.length > 0) textToCopy += `Resistente a: ${resistances.join(', ')}\n`;
        if (immunities.length > 0) textToCopy += `Inmune a: ${immunities.join(', ')}\n`;
        if (statusImmunities.length > 0) textToCopy += `Inmune a Estados: ${statusImmunities.join(', ')}\n`;
        if (equipmentList) { textToCopy += `Equipo: ${equipmentList}\n`; }
        textToCopy += `Naturaleza: ${allNatures.join(', ')}.\n`;
        textToCopy += `------------------------------------\n`;
        textToCopy += `Cuerpo: ${creature.attributes.cuerpo > 0 ? '+' : ''}${creature.attributes.cuerpo} | Destreza: ${creature.attributes.destreza > 0 ? '+' : ''}${creature.attributes.destreza} | Aura: ${creature.attributes.aura > 0 ? '+' : ''}${creature.attributes.aura}\n`;
        if (options.includeAttacks && finalAttacks.length > 0) {
            textToCopy += `------------------------------------\nACCIONES\n`;
            finalAttacks.forEach(attack => {
                let attackBonus = creature.attributes[attack.attribute];
                const weaponSource = creature.equippedWeapons.find(w => getEquipmentNameWithBonus(w, 'weapon') === attack.name);
                if (weaponSource) { attackBonus += weaponSource.bonus; }
                const totalDamageModifier = creature.attributes[attack.attribute] + attack.damageModifier;
                const modifierString = totalDamageModifier === 0 ? '' : (totalDamageModifier > 0 ? ` + ${totalDamageModifier}` : ` - ${Math.abs(totalDamageModifier)}`);
                textToCopy += `* ${attack.name}. Ataque de ${attack.type}: ${(attackBonus >= 0 ? '+' : '') + attackBonus} a golpear. Impacto: ${attack.damageDice}${modifierString} de dano ${attack.damageType}.\n`;
                if(attack.description) { textToCopy += `  ${attack.description}\n`; }
            });
        }
        if (options.includeTraits && (categoryTrait || otherTraits.length > 0)) {
            textToCopy += `------------------------------------\nRASGOS E HABILIDADES\n`;
            if(categoryTrait){ textToCopy += `* ${categoryTrait.name}. ${categoryTrait.description}\n`; }
            otherTraits.forEach(({ trait, count }) => {
                const { displayName, displayDescription } = getTraitDisplayInfo(trait);
                let finalDisplayName = displayName;
                if (count > 1) {
                  const inParenMatch = displayName.match(/\(([^)]+)\)/);
                  if (inParenMatch) { finalDisplayName = displayName.replace(inParenMatch[0], `(${inParenMatch[1]} x${count})`); }
                  else { finalDisplayName = `${displayName} (x${count})`; }
                }
                textToCopy += `* ${finalDisplayName}. ${displayDescription}\n`;
            });
        }
    }
    
    const copyToClipboard = (text: string) => {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
          setCopyText('¡Copiado!');
          setTimeout(() => setCopyText('Exportar a Texto'), 2000);
        }).catch(err => {
          console.error('Error al copiar con la API moderna: ', err);
          setCopyText('Error al copiar');
          setTimeout(() => setCopyText('Exportar a Texto'), 2000);
        });
      } else {
        try {
          const textArea = document.createElement("textarea");
          textArea.value = text;
          textArea.style.position = "fixed";
          textArea.style.top = "-9999px";
          textArea.style.left = "-9999px";
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          setCopyText('¡Copiado!');
          setTimeout(() => setCopyText('Exportar a Texto'), 2000);
        } catch (err) {
          console.error('Error al copiar con el método de respaldo: ', err);
          setCopyText('Error al copiar');
          setTimeout(() => setCopyText('Exportar a Texto'), 2000);
        }
      }
    };
    
    copyToClipboard(textToCopy.trim());
    setIsExportModalOpen(false);
  };
  
  const handleExportAsImage = async () => {
      if (!sheetRef.current || typeof (window).html2canvas === 'undefined') {
        console.error('Sheet element not found or html2canvas not loaded.');
        setImageCopyText('Error');
        setTimeout(() => setImageCopyText('Exportar a Imagen'), 2000);
        return;
      }
      setImageCopyText('Generando...');
      try {
        const canvas = await (window).html2canvas(sheetRef.current, { backgroundColor: '#0c0a09', scale: 2 });
        const link = document.createElement('a');
        link.download = `${creature.name.toLowerCase().replace(/\s+/g, '-')}-sheet.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        setImageCopyText('¡Descargado!');
      } catch (error) {
        console.error('Error generating image:', error);
        setImageCopyText('Error');
      }
      finally { setTimeout(() => setImageCopyText('Exportar a Imagen'), 2000); }
    };
  const equipmentList = [...creature.equippedWeapons.map(w => getEquipmentNameWithBonus(w, 'weapon')), creature.equippedArmor ? getEquipmentNameWithBonus(creature.equippedArmor, 'armor') : null, creature.equippedShield ? getEquipmentNameWithBonus(creature.equippedShield, 'shield') : null].filter(Boolean).join(', ');
  return (
    <>
      <ExportOptionsModal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} onConfirm={handleConfirmExport} />
      <div ref={sheetRef} className="bg-stone-950 font-body-serif text-stone-300 rounded-lg border-2 border-stone-700 shadow-2xl overflow-hidden">
        <div className="p-6 bg-stone-800 border-b-4 border-amber-900/50">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-4xl font-bold text-amber-400 tracking-wider font-display">{creature.name}</h2>
              <p className="text-stone-400 italic text-lg">{creature.size} {fullCategory}</p>
            </div>
            <div className="text-center flex-shrink-0 ml-4">
                <div className="text-sm font-bold text-stone-400 tracking-widest">ND</div>
                <div className="text-3xl font-bold text-amber-500">{creature.nd}</div>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/3 bg-stone-900/50 p-6 md:border-r-2 md:border-stone-700/50">
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                            <div className="text-sm font-bold text-stone-400 tracking-widest">RESISTENCIA</div>
                            <div className="text-6xl font-bold text-red-500">{finalResistencia}</div>
                        </div>
                        <div>
                            <div className="text-sm font-bold text-stone-400 tracking-widest">DEFENSA</div>
                            <div className="text-6xl font-bold text-sky-400">{finalDefensa}</div>
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-sm font-bold text-stone-400 tracking-widest">NATURALEZA</div>
                        <div className="text-lg pt-1 font-bold text-stone-100 capitalize">{allNatures.join(', ')}</div>
                    </div>
                    <hr className="border-stone-700"/>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center bg-stone-800 p-2 px-4 rounded-md">
                            <div className="text-lg font-bold text-stone-300">CUERPO</div>
                            <div className="text-2xl font-bold text-stone-100">{creature.attributes.cuerpo >= 0 ? '+' : ''}{creature.attributes.cuerpo}</div>
                        </div>
                        <div className="flex justify-between items-center bg-stone-800 p-2 px-4 rounded-md">
                            <div className="text-lg font-bold text-stone-300">DESTREZA</div>
                            <div className="text-2xl font-bold text-stone-100">{creature.attributes.destreza >= 0 ? '+' : ''}{creature.attributes.destreza}</div>
                        </div>
                        <div className="flex justify-between items-center bg-stone-800 p-2 px-4 rounded-md">
                            <div className="text-lg font-bold text-stone-300">AURA</div>
                            <div className="text-2xl font-bold text-stone-100">{creature.attributes.aura >= 0 ? '+' : ''}{creature.attributes.aura}</div>
                        </div>
                    </div>
                    <hr className="border-stone-700"/>
                    <div className="space-y-1 text-sm">
                      <div className="p-1"><strong className="text-stone-400">Iniciativa:</strong><span className="ml-2 font-semibold text-amber-500">{finalIniciativa >= 0 ? '+' : ''}{finalIniciativa}</span></div>
                      <div className="p-1"><strong className="text-stone-400">Movimiento:</strong><span className="ml-2 font-semibold text-lime-400">{movementDisplay}</span></div>
                      {vulnerabilities.length > 0 && (<div className="p-1"><strong className="text-stone-400">Vulnerable a:</strong><span className="ml-2 font-semibold text-red-400">{vulnerabilities.join(', ')}</span></div>)}
                      {resistances.length > 0 && (<div className="p-1"><strong className="text-stone-400">Resistente a:</strong><span className="ml-2 font-semibold text-sky-300">{resistances.join(', ')}</span></div>)}
                      {immunities.length > 0 && (<div className="p-1"><strong className="text-stone-400">Inmune a:</strong><span className="ml-2 font-semibold text-amber-300">{immunities.join(', ')}</span></div>)}
                      {statusImmunities.length > 0 && (<div className="p-1"><strong className="text-stone-400">Inmune a Estados:</strong><span className="ml-2 font-semibold text-purple-300">{statusImmunities.join(', ')}</span></div>)}
                      {equipmentList && (<div className="p-1 pt-2"><strong className="text-stone-400">Equipo:</strong><span className="ml-2 font-semibold text-stone-200">{equipmentList}</span></div>)}
                    </div>
                </div>
            </div>
            <div className="w-full md:w-2/3 p-6">
                <div className="space-y-8">
                    <div>
                        <h3 className="text-2xl font-semibold text-amber-500 mb-4 pb-2 tracking-wider font-display">Acciones</h3>
                        {finalAttacks.length > 0 ? (
                            <ul className="space-y-4">
                            {finalAttacks.map((attack, index) => {
                                let attackBonus = creature.attributes[attack.attribute];
                                const weaponSource = creature.equippedWeapons.find(w => getEquipmentNameWithBonus(w, 'weapon') === attack.name);
                                if (weaponSource) { attackBonus += weaponSource.bonus; }
                                const totalDamageModifier = creature.attributes[attack.attribute] + attack.damageModifier;
                                const modifierString = totalDamageModifier === 0 ? '' : (totalDamageModifier > 0 ? ` + ${totalDamageModifier}` : ` - ${Math.abs(totalDamageModifier)}`);
                                return (
                                <li key={index} className="bg-stone-800/50 p-3 rounded-md border-l-4 border-stone-600">
                                    <p><strong className="font-bold text-amber-400 text-lg">{attack.name}.</strong> <em className="text-stone-400">({attack.type} Attack)</em></p>
                                    <p className="pl-2 mt-1"><span className="font-mono font-bold text-xl text-stone-100">{(attackBonus >= 0 ? '+' : '') + attackBonus}</span> a golpear, <span className="ml-2"><em>Impacto:</em> {attack.damageDice}{modifierString} {attack.damageType} daño.</span></p>
                                    {attack.description && <p className="pl-2 mt-1 text-sm text-stone-400">{attack.description}</p>}
                                </li>
                                );
                            })}
                            </ul>
                        ) : (<p className="text-stone-500 italic">La criatura no tiene acciones de ataque definidas.</p>)}
                    </div>
                    <div>
                        <h3 className="text-2xl font-semibold text-amber-500 mb-4 pb-2 tracking-wider font-display">Rasgos y Habilidades</h3>
                         <ul className="space-y-2 list-inside">
                           {!categoryTrait && otherTraits.length === 0 && <p className="text-stone-500 italic">Ningún rasgo añadido.</p>}
                           {categoryTrait && <TraitItem trait={categoryTrait} count={1} />}
                           {otherTraits.map(({ trait, count }) => <TraitItem key={trait.instanceId} trait={trait} count={count} />)}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
      </div>
      <div className="mt-8 flex justify-center items-center gap-4">
        <button onClick={() => setIsExportModalOpen(true)} className="px-8 py-2 bg-lime-700 hover:bg-lime-600 text-stone-100 font-semibold rounded-lg shadow-md transition-all duration-200 ease-in-out">{copyText}</button>
        <button onClick={handleExportAsImage} className="px-8 py-2 bg-sky-700 hover:bg-sky-600 text-stone-100 font-semibold rounded-lg shadow-md transition-all duration-200 ease-in-out">{imageCopyText}</button>
      </div>
    </>
  );
};

// --- ActionEditor ---
const ActionEditor = ({ creature, addAttack, removeAttack, reorderAttacks }) => {
    const getAttackStateForND = useCallback((nd) => {
        const baseStats = ND_MAP[nd];
        if (!baseStats || !baseStats.danoBase) {
            console.error(`Could not find base stats for ND: ${nd}`);
            return { name: 'Ataque Básico', type: 'Melee', attribute: 'cuerpo', damageDice: '1d6', damageModifier: '0', damageType: 'Contundente', description: '', range: '' };
        }
        const danoBase = baseStats.danoBase;
        const diceRegex = /(\d+d\d+)/;
        const modRegex = /([+-])\s*(\d+)/;
        const diceMatch = danoBase.match(diceRegex);
        const modMatch = danoBase.match(modRegex);
        const defaultDamageDice = diceMatch ? diceMatch[0] : '1d6';
        let defaultDamageModifier = 0;
        if (modMatch) {
            const sign = modMatch[1];
            const value = parseInt(modMatch[2], 10);
            defaultDamageModifier = (sign === '+') ? value : -value;
        }
        return {
            name: 'Ataque Básico',
            type: 'Melee',
            attribute: 'cuerpo',
            damageDice: defaultDamageDice,
            damageModifier: defaultDamageModifier.toString(),
            damageType: 'Contundente',
            description: '',
            range: ''
        };
    }, []);
    
    const [newAttack, setNewAttack] = useState(() => getAttackStateForND(creature.nd));
  
    useEffect(() => {
        setNewAttack(getAttackStateForND(creature.nd));
    }, [creature.nd, getAttackStateForND]);

    const dragIndex = useRef(null);
    const [dragOverIndex, setDragOverIndex] = useState(null);
    const handleDragStart = (index) => { dragIndex.current = index; };
    const handleDragEnter = (index) => { if (dragIndex.current !== null && dragIndex.current !== index) { setDragOverIndex(index); } };
    const handleDragLeave = () => { setDragOverIndex(null); };
    const handleDragEnd = () => { dragIndex.current = null; setDragOverIndex(null); };
    const handleDrop = (index) => { if (dragIndex.current !== null && dragIndex.current !== index) { reorderAttacks(dragIndex.current, index); } handleDragEnd(); };
    const handleInputChange = (field, value) => { setNewAttack(prev => ({ ...prev, [field]: value })); };
    const handleAddAttack = () => {
        // Fix: Explicitly type 'attackToAdd' as 'Attack' to allow adding the optional 'range' property.
        const attackToAdd: Attack = {
            name: newAttack.name,
            type: newAttack.type as 'Melee' | 'Ranged',
            attribute: newAttack.attribute as keyof Creature['attributes'],
            damageDice: newAttack.damageDice,
            damageModifier: parseInt(newAttack.damageModifier, 10) || 0,
            damageType: newAttack.damageType as DamageType,
            description: newAttack.description
        };
        if (newAttack.type === 'Ranged' && newAttack.range) {
            attackToAdd.range = newAttack.range;
        }
        addAttack(attackToAdd); 
        setNewAttack(getAttackStateForND(creature.nd));
    };
    const attributeBonus = useMemo(() => { return creature.attributes[newAttack.attribute]; }, [newAttack.attribute, creature.attributes]);
    const totalDamageModifier = useMemo(() => { const extraModifier = parseInt(newAttack.damageModifier, 10) || 0; return attributeBonus + extraModifier; }, [attributeBonus, newAttack.damageModifier]);
    const modifierString = useMemo(() => { if (totalDamageModifier === 0) return ''; return totalDamageModifier > 0 ? ` + ${totalDamageModifier}` : ` - ${Math.abs(totalDamageModifier)}`; }, [totalDamageModifier]);
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
            <h3 className="text-xl font-semibold text-stone-100">Añadir Nuevo Ataque</h3>
            <div>
            <label htmlFor="attackName" className="block text-sm font-medium text-stone-300 mb-1">Nombre del Ataque</label>
            <input id="attackName" type="text" value={newAttack.name} onChange={e => handleInputChange('name', e.target.value)} className="w-full bg-stone-700 border border-stone-600 rounded-md py-2 px-3 text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-600" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                <label htmlFor="attackType" className="block text-sm font-medium text-stone-300 mb-1">Tipo</label>
                <select id="attackType" value={newAttack.type} onChange={e => handleInputChange('type', e.target.value)} className="w-full bg-stone-700 border border-stone-600 rounded-md py-2 px-3 text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-600">
                    <option value="Melee">Melee</option>
                    <option value="Ranged">Ranged</option>
                </select>
                </div>
                <div>
                <label htmlFor="attackAttribute" className="block text-sm font-medium text-stone-300 mb-1">Atributo</label>
                <select id="attackAttribute" value={newAttack.attribute} onChange={e => handleInputChange('attribute', e.target.value)} className="w-full bg-stone-700 border border-stone-600 rounded-md py-2 px-3 text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-600">
                    <option value="cuerpo">Cuerpo</option>
                    <option value="destreza">Destreza</option>
                </select>
                </div>
            </div>
            {newAttack.type === 'Ranged' && (
                <div className="animate-fade-in-fast">
                    <label htmlFor="attackRange" className="block text-sm font-medium text-stone-300 mb-1">Rango (ej. 15/30m)</label>
                    <input id="attackRange" type="text" value={newAttack.range} onChange={e => handleInputChange('range', e.target.value)} className="w-full bg-stone-700 border border-stone-600 rounded-md py-2 px-3 text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-600" />
                </div>
            )}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="damageDice" className="block text-sm font-medium text-stone-300 mb-1">Dados de Daño</label>
                    <input id="damageDice" type="text" value={newAttack.damageDice} onChange={e => handleInputChange('damageDice', e.target.value)} className="w-full bg-stone-700 border border-stone-600 rounded-md py-2 px-3 text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-600" />
                </div>
                <div>
                    <label htmlFor="damageModifier" className="block text-sm font-medium text-stone-300 mb-1">Daño Extra</label>
                    <input id="damageModifier" type="number" placeholder="0" value={newAttack.damageModifier} onChange={e => handleInputChange('damageModifier', e.target.value)} className="w-full bg-stone-700 border border-stone-600 rounded-md py-2 px-3 text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-600" />
                </div>
            </div>
            <div>
                <label htmlFor="damageType" className="block text-sm font-medium text-stone-300 mb-1">Tipo de Daño</label>
                <select id="damageType" value={newAttack.damageType} onChange={e => handleInputChange('damageType', e.target.value)} className="w-full bg-stone-700 border border-stone-600 rounded-md py-2 px-3 text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-600">
                {DAMAGE_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
            </div>
            <div>
            <label htmlFor="attackDescription" className="block text-sm font-medium text-stone-300 mb-1">Descripción (Efectos Especiales)</label>
            <textarea id="attackDescription" value={newAttack.description} onChange={e => handleInputChange('description', e.target.value)} rows={2} className="w-full bg-stone-700 border border-stone-600 rounded-md py-2 px-3 text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-600" />
            </div>
            <div className="bg-stone-900/50 p-3 rounded-lg border border-stone-700 space-y-2">
                <h4 className="font-semibold text-amber-400 text-center">Vista Previa</h4>
                <div className="flex justify-between text-sm">
                    <span className="text-stone-400">Bono de Ataque:</span>
                    <span className="font-bold text-stone-100 font-mono">{(attributeBonus >= 0 ? '+' : '') + attributeBonus}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-stone-400">Daño Final:</span>
                    <span className="font-bold text-stone-100 font-mono">{newAttack.damageDice}{modifierString} {newAttack.damageType}</span>
                </div>
            </div>
            <button onClick={handleAddAttack} className="w-full py-2 bg-amber-700 hover:bg-amber-600 text-stone-100 font-semibold rounded-lg shadow-md transition-colors">Añadir Ataque</button>
        </div>
        <div className="space-y-3">
            <h3 className="text-xl font-semibold text-stone-100">Lista de Acciones</h3>
            <div className="space-y-3 max-h-[450px] overflow-y-auto pr-2" onDragLeave={handleDragLeave}>
                {creature.attacks.length === 0 ? (<p className="text-stone-500 italic text-center pt-8">Aún no se han añadido ataques.</p>) : (
                    creature.attacks.map((attack, index) => {
                        const bonus = creature.attributes[attack.attribute];
                        const totalMod = bonus + attack.damageModifier;
                        const modStr = totalMod === 0 ? '' : (totalMod > 0 ? ` + ${totalMod}` : ` - ${Math.abs(totalMod)}`);
                        const isDragging = dragIndex.current === index;
                        const isDragOver = dragOverIndex === index;
                        return (
                            <div key={index} draggable onDragStart={() => handleDragStart(index)} onDragEnter={() => handleDragEnter(index)} onDragOver={(e) => e.preventDefault()} onDragEnd={handleDragEnd} onDrop={() => handleDrop(index)} className={`bg-stone-900/70 p-3 pl-2 rounded-lg border relative flex gap-2 items-center transition-all duration-200 ${isDragging ? 'opacity-40 scale-95' : 'opacity-100'} ${isDragOver ? 'border-amber-500 scale-105 shadow-lg shadow-amber-900/50' : 'border-stone-700'}`}>
                                <div className="cursor-move text-stone-500 hover:text-stone-300 transition-colors" title="Arrastrar para reordenar">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20"><path d="M5 4.5a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm5 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM5 9.5a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm5 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM5 14.5a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm5 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" /></svg>
                                </div>
                                <div className="flex-grow pr-6">
                                    <p className="text-stone-100 font-bold">{attack.name} <span className="text-xs font-normal text-stone-400">({attack.type}{attack.range ? `, ${attack.range}` : ''}, {attack.attribute})</span></p>
                                    <p className="text-sm text-stone-300 font-mono">Ataque: {(bonus >= 0 ? '+' : '') + bonus}, Daño: {attack.damageDice}{modStr} {attack.damageType}</p>
                                    {attack.description && <p className="text-xs text-stone-400 italic mt-1">{attack.description}</p>}
                                </div>
                                <button onClick={() => removeAttack(index)} className="absolute top-2 right-2 text-red-600 hover:text-red-400 font-bold text-lg" aria-label="Eliminar ataque">&times;</button>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
        </div>
    );
};

// --- AttributeEditor ---
const AttributeControl = ({ label, value, onChange, canDecrement }) => {
  return (
    <div className="flex items-center justify-between bg-stone-700 p-3 rounded-lg">
      <span className="text-lg font-semibold text-stone-300">{label}</span>
      <div className="flex items-center gap-3">
        <button onClick={() => onChange(-1)} disabled={!canDecrement} className="w-8 h-8 rounded-full bg-stone-600 hover:bg-stone-500 text-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed">-</button>
        <span className="text-2xl font-bold text-amber-500 w-10 text-center">{value > 0 ? `+${value}` : value}</span>
        <button onClick={() => onChange(1)} className="w-8 h-8 rounded-full bg-stone-600 hover:bg-stone-500 text-xl font-bold transition-colors">+</button>
      </div>
    </div>
  );
};
const AttributeEditor = ({ creature, onAttributeChange, onReset }) => {
  return (
    <div className="max-w-md mx-auto space-y-6">
        <div className="bg-stone-900/70 p-4 rounded-lg border border-stone-700 text-center">
            <h3 className="text-lg font-semibold text-stone-100">Modificar Atributos</h3>
            <p className="text-stone-400 text-sm">Aumentar un atributo cuesta 2 Puntos de Rasgo (PR) y añade un rasgo de 'Mejora de Atributo'. Reducir un atributo otorga 1 PR y añade un rasgo de 'Deficiencia de Atributo'. Los atributos no pueden ser inferiores a -3.</p>
            <p className="text-stone-400 text-sm mt-2">Los cambios se reflejarán en tu presupuesto y lista de rasgos en el siguiente paso.</p>
        </div>
        <div className="space-y-4">
            <AttributeControl label="Cuerpo" value={creature.attributes.cuerpo} onChange={(delta) => onAttributeChange('cuerpo', delta)} canDecrement={creature.attributes.cuerpo > -3}/>
            <AttributeControl label="Destreza" value={creature.attributes.destreza} onChange={(delta) => onAttributeChange('destreza', delta)} canDecrement={creature.attributes.destreza > -3}/>
            <AttributeControl label="Aura" value={creature.attributes.aura} onChange={(delta) => onAttributeChange('aura', delta)} canDecrement={creature.attributes.aura > -3}/>
        </div>
        <button onClick={onReset} className="w-full py-2 px-4 bg-stone-600 hover:bg-stone-500 text-stone-100 font-semibold rounded-lg shadow-md transition-colors">Restablecer Atributos y Rasgos</button>
    </div>
  );
};

// --- EquipmentSelector ---
const bonusOptions = [-3, -2, -1, 0, 1, 2, 3, 4, 5];
const EquipmentSelector = ({ creature, onAddWeapon, onRemoveWeapon, onWeaponBonusChange, onArmorShieldChange, onEquipmentBonusChange }) => {
    const [selectedWeapon, setSelectedWeapon] = useState(ALL_WEAPONS[0].name);
    const handleAddWeaponClick = () => { if (selectedWeapon) { onAddWeapon(selectedWeapon); } };
    const renderRequirementWarning = (requirement) => { if (creature.attributes.cuerpo < requirement) { return <span className="text-xs text-red-500 ml-2">(Requiere Cuerpo +{requirement})</span> } return null; };
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3 md:col-span-1">
                <h3 className="text-xl font-semibold text-stone-100">Armas Equipadas</h3>
                <div className="space-y-2 mb-4 p-2 bg-stone-900/50 rounded-lg border border-stone-700 min-h-[100px] max-h-[250px] overflow-y-auto">
                    {creature.equippedWeapons.length > 0 ? (
                        creature.equippedWeapons.map((equippedWeapon, index) => {
                            const { weapon, bonus } = equippedWeapon;
                            const damageDice = weapon.damage.split(' ')[0];
                            const displayNameWithBonus = `${weapon.name}${bonus !== 0 ? ` ${bonus > 0 ? '+' : ''}${bonus}` : ''}`;
                            return (
                                <div key={index} className="bg-stone-800 p-2 rounded-md">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-grow"><p className="text-sm text-stone-300 font-semibold truncate pr-2">{displayNameWithBonus}</p><p className="text-xs text-stone-400">{damageDice} {weapon.damageType}</p></div>
                                        <button onClick={() => onRemoveWeapon(index)} className="text-red-600 hover:text-red-500 text-lg font-bold flex-shrink-0 leading-none mt-[-2px]" title="Eliminar arma" aria-label="Eliminar arma">&times;</button>
                                    </div>
                                    <div className="mt-2">
                                        <label htmlFor={`weapon-bonus-${index}`} className="text-xs text-stone-400 mr-2">Bono:</label>
                                        <select id={`weapon-bonus-${index}`} value={bonus} onChange={e => onWeaponBonusChange(index, parseInt(e.target.value, 10))} className="bg-stone-700 border border-stone-600 rounded-md py-1 px-2 text-stone-100 text-xs focus:outline-none focus:ring-1 focus:ring-amber-600">
                                            {bonusOptions.map(b => <option key={b} value={b}>{b >= 0 ? `+${b}` : b}</option>)}
                                        </select>
                                    </div>
                                </div>
                            );
                        })
                    ) : (<p className="text-stone-500 text-sm italic text-center pt-4">Ninguna arma equipada.</p>)}
                </div>
                 <div className="space-y-2">
                    <select value={selectedWeapon} onChange={e => setSelectedWeapon(e.target.value)} className="w-full bg-stone-700 border border-stone-600 rounded-md py-2 px-3 text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-600">
                        {ALL_WEAPONS.map(w => <option key={w.name} value={w.name}>{w.name}</option>)}
                    </select>
                    <button onClick={handleAddWeaponClick} className="w-full py-2 bg-amber-700 hover:bg-amber-600 text-stone-100 font-semibold rounded-lg shadow-md transition-colors">Añadir Arma</button>
                </div>
            </div>
            <div className="space-y-3">
                <h3 className="text-xl font-semibold text-stone-100">Armadura</h3>
                <select value={creature.equippedArmor?.armor.name || 'Ninguno'} onChange={e => onArmorShieldChange('armor', e.target.value)} className="w-full bg-stone-700 border border-stone-600 rounded-md py-2 px-3 text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-600">
                    <option value="Ninguno">Ninguno</option>
                    {ALL_ARMORS.map(a => (<option key={a.name} value={a.name} disabled={creature.attributes.cuerpo < a.cuerpoRequirement}>{a.name} {creature.attributes.cuerpo < a.cuerpoRequirement ? `(Req. Cuerpo +${a.cuerpoRequirement})` : ''}</option>))}
                </select>
                {creature.equippedArmor && (
                    <div className="p-3 bg-stone-900/50 rounded-lg border border-stone-700 text-sm space-y-2">
                         <div>
                            <label htmlFor="armor-bonus" className="text-sm font-medium text-stone-300 mr-2">Bono de Armadura:</label>
                            <select id="armor-bonus" value={creature.equippedArmor.bonus} onChange={e => onEquipmentBonusChange('armor', parseInt(e.target.value, 10))} className="bg-stone-700 border border-stone-600 rounded-md py-1 px-2 text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-600">
                                {bonusOptions.map(b => <option key={b} value={b}>{b >= 0 ? `+${b}` : b}</option>)}
                            </select>
                        </div>
                        <p><strong className="text-stone-400">Bono Base:</strong> +{creature.equippedArmor.armor.defenseBonus}</p>
                        <p><strong className="text-stone-400">Requisito Cuerpo:</strong> +{creature.equippedArmor.armor.cuerpoRequirement} {renderRequirementWarning(creature.equippedArmor.armor.cuerpoRequirement)}</p>
                        <p><strong className="text-stone-400">Pen. Sigilo:</strong> {creature.equippedArmor.armor.sigiloPenalty}</p>
                    </div>
                )}
            </div>
            <div className="space-y-3">
                <h3 className="text-xl font-semibold text-stone-100">Escudo</h3>
                <select value={creature.equippedShield?.shield.name || 'Ninguno'} onChange={e => onArmorShieldChange('shield', e.target.value)} className="w-full bg-stone-700 border border-stone-600 rounded-md py-2 px-3 text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-600">
                    <option value="Ninguno">Ninguno</option>
                     {ALL_SHIELDS.map(s => (<option key={s.name} value={s.name} disabled={creature.attributes.cuerpo < s.cuerpoRequirement}>{s.name} {creature.attributes.cuerpo < s.cuerpoRequirement ? `(Req. Cuerpo +${s.cuerpoRequirement})` : ''}</option>))}
                </select>
                {creature.equippedShield && (
                    <div className="p-3 bg-stone-900/50 rounded-lg border border-stone-700 text-sm space-y-2">
                        <div>
                            <label htmlFor="shield-bonus" className="text-sm font-medium text-stone-300 mr-2">Bono de Escudo:</label>
                            <select id="shield-bonus" value={creature.equippedShield.bonus} onChange={e => onEquipmentBonusChange('shield', parseInt(e.target.value, 10))} className="bg-stone-700 border border-stone-600 rounded-md py-1 px-2 text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-600">
                                {bonusOptions.map(b => <option key={b} value={b}>{b >= 0 ? `+${b}` : b}</option>)}
                            </select>
                        </div>
                        <p><strong className="text-stone-400">Bono Base:</strong> +{creature.equippedShield.shield.defenseBonus}</p>
                        <p><strong className="text-stone-400">Requisito Cuerpo:</strong> +{creature.equippedShield.shield.cuerpoRequirement} {renderRequirementWarning(creature.equippedShield.shield.cuerpoRequirement)}</p>
                        {creature.equippedShield.shield.sigiloPenalty !== null && <p><strong className="text-stone-400">Pen. Sigilo:</strong> {creature.equippedShield.shield.sigiloPenalty}</p>}
                    </div>
                )}
            </div>
        </div>
    );
};

// --- SaveLoadManager ---
const SaveLoadManager = ({ creature, savedCreatures, onSave, onLoad, onDelete, onNew }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const saveButtonText = creature.id ? 'Actualizar Criatura' : 'Guardar Criatura';
  useEffect(() => {
    const handleClickOutside = (event) => { if (dropdownRef.current && !dropdownRef.current.contains(event.target)) { setIsOpen(false); } };
    document.addEventListener('mousedown', handleClickOutside);
    return () => { document.removeEventListener('mousedown', handleClickOutside); };
  }, []);
  return (
    <div className="flex items-center gap-2">
       <button onClick={onNew} className="px-4 py-2 bg-green-700 hover:bg-green-600 text-stone-100 font-semibold rounded-lg shadow-md transition-colors" title="Crear una nueva criatura desde cero">Nuevo</button>
      <div className="relative" ref={dropdownRef}>
        <button onClick={() => setIsOpen(prev => !prev)} className="px-4 py-2 bg-sky-700 hover:bg-sky-600 text-stone-100 font-semibold rounded-lg shadow-md transition-colors" aria-haspopup="true" aria-expanded={isOpen}>Guardar / Cargar</button>
        {isOpen && (
          <div className="absolute right-0 mt-2 w-72 bg-stone-800 border border-stone-600 rounded-lg shadow-2xl z-50 animate-fade-in-fast">
            <div className="p-3 border-b border-stone-700">
              <button onClick={() => { onSave(); setIsOpen(false); }} className="w-full px-4 py-2 bg-amber-700 hover:bg-amber-600 text-stone-100 font-semibold rounded-md transition-colors text-sm">{saveButtonText}</button>
            </div>
            <div className="p-3">
              <h4 className="text-stone-300 font-semibold mb-2 text-sm">Criaturas Guardadas</h4>
              <ul className="space-y-2 max-h-60 overflow-y-auto">
                {savedCreatures.length === 0 ? (<li className="text-stone-500 text-xs italic text-center">No hay criaturas guardadas.</li>) : (
                  savedCreatures.map(c => (
                    <li key={c.id} className="bg-stone-700 p-2 rounded-md text-xs group">
                      <div className="flex justify-between items-center">
                        <span className="min-w-0 text-stone-200 font-medium truncate pr-2">{c.name} <span className="text-stone-400">(ND {c.nd})</span></span>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => { onLoad(c.id); setIsOpen(false); }} className="px-2 py-1 bg-lime-600 hover:bg-lime-500 rounded text-white" title="Cargar">Cargar</button>
                          <button onClick={() => onDelete(c.id)} className="px-2 py-1 bg-red-700 hover:bg-red-600 rounded text-white" title="Eliminar">X</button>
                        </div>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- StepNavigator ---
const steps = [ { number: 1, title: 'Concepto' }, { number: 2, title: 'Atributos' }, { number: 3, title: 'Rasgos' }, { number: 4, title: 'Equipamiento' }, { number: 5, title: 'Acciones' }, { number: 6, title: 'Ficha Final' } ];
const StepNavigator = ({ currentStep, onStepClick }) => {
  const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100;
  return (
    <div className="w-full px-4 md:px-0 mb-12">
      <div className="relative">
        <div className="absolute top-5 left-0 w-full h-1 bg-stone-700 -translate-y-1/2"></div>
        <div className="absolute top-5 left-0 h-1 bg-amber-500 -translate-y-1/2 transition-all duration-500 ease-out" style={{ width: `${progressPercentage}%` }}></div>
        <ol className="relative flex justify-between items-start">
          {steps.map((step) => {
            const isCompleted = currentStep > step.number; const isCurrent = currentStep === step.number;
            return (
              <li key={step.number}>
                <button onClick={() => onStepClick(step.number)} className="flex flex-col items-center group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-stone-900 focus:ring-amber-500 rounded-full" aria-current={isCurrent ? 'step' : undefined}>
                  <span className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-lg border-2 transition-all duration-300 ease-out ${isCurrent ? 'w-12 h-12 bg-amber-500 border-amber-400 text-white shadow-lg shadow-amber-500/30 scale-110' : isCompleted ? 'bg-amber-600 border-amber-500 text-white' : 'bg-stone-800 border-stone-600 text-stone-400 group-hover:border-amber-500'}`}>
                    {isCompleted ? (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>) : (step.number)}
                  </span>
                  <span className={`mt-2 text-xs md:text-sm font-semibold text-center transition-colors duration-300 w-20 ${isCurrent ? 'text-amber-400' : 'text-stone-400 group-hover:text-amber-500'}`}>{step.title}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
};

// --- TraitSelector ---
interface TraitCardProps {
  trait: Trait;
  onAdd: () => void;
  disabled: boolean;
}
const TraitCard: React.FC<TraitCardProps> = ({ trait, onAdd, disabled }) => {
  const cost = typeof trait.cost === 'number' ? `${trait.cost} PR` : `Gana ${trait.cost.split(' ')[1]} PR`;
  const costColor = typeof trait.cost === 'number' ? 'text-amber-400' : 'text-lime-400';
  return (
    <div className="bg-stone-800 p-4 rounded-lg border border-stone-700 flex flex-col justify-between">
      <div>
        <h4 className="font-bold text-stone-100">{trait.name} <span className={`text-sm font-mono ${costColor}`}>({cost})</span></h4>
        {trait.restriction && <p className="text-xs text-red-500 italic mt-1">Restricción: {trait.restriction}</p>}
        <p className="text-sm text-stone-400 mt-2">{trait.description}</p>
      </div>
      <button onClick={onAdd} disabled={disabled} className="mt-4 w-full bg-amber-700 hover:bg-amber-600 text-white font-semibold py-1 px-3 rounded-md text-sm disabled:bg-stone-600 disabled:cursor-not-allowed transition-colors">Añadir</button>
    </div>
  );
};
const TraitSelector = ({ creature, addTrait, removeTrait }) => {
  const [openCategory, setOpenCategory] = useState(null);
  const [configuringDamageTrait, setConfiguringDamageTrait] = useState(null);
  const [configuringConceptTrait, setConfiguringConceptTrait] = useState(null);
  const [configuringNatureTrait, setConfiguringNatureTrait] = useState(null);
  const [configuringMovementTrait, setConfiguringMovementTrait] = useState(null);
  const [configuringStatusEffectTrait, setConfiguringStatusEffectTrait] = useState(null);
  const basePr = useMemo(() => ND_MAP[creature.nd].pr, [creature.nd]);
  const { prSpent, prGained } = useMemo(() => { return creature.traits.reduce((acc, trait) => { if (typeof trait.cost === 'number') { acc.prSpent += trait.cost; } else if (typeof trait.cost === 'string' && trait.cost.startsWith('Gana')) { acc.prGained += parseInt(trait.cost.split(' ')[1], 10); } return acc; }, { prSpent: 0, prGained: 0 }); }, [creature.traits]);
  const prBudget = basePr + prGained;
  const prRemaining = prBudget - prSpent;
  const groupedTraits = useMemo(() => {
    const availableTraits = ALL_TRAITS.filter(t => t.name !== 'Mejora de Atributo' && t.name !== 'Deficiencia de Atributo');
    return availableTraits.reduce((acc, trait) => { 
        const category = trait.category; 
        if (!acc[category]) { acc[category] = []; } 
        acc[category].push(trait); 
        return acc; 
    }, {} as Record<TraitCategory, Trait[]>);
  }, []);
  const handleToggleCategory = (category) => { setOpenCategory(prev => (prev === category ? null : category)); };
  const handleAddTraitClick = (trait) => {
    if (['Vulnerable', 'Resistente', 'Inmune', 'Absorción de Daño'].includes(trait.name)) { setConfiguringDamageTrait(trait); }
    else if (['Inmunidad a estado', 'Estado añadido'].includes(trait.name)) { setConfiguringStatusEffectTrait(trait); }
    else if (trait.name === 'Versatilidad Conceptual') { setConfiguringConceptTrait(trait); }
    else if (trait.name === 'Versatilidad de Carácter') { setConfiguringNatureTrait(trait); }
    else if (trait.name === 'Movimiento Especial') { setConfiguringMovementTrait(trait); }
    else { addTrait(trait); }
  };
  const handleConfirmDamageType = (trait, selectedType) => { const newTrait = { ...trait, appliedData: { damageType: selectedType } }; addTrait(newTrait); setConfiguringDamageTrait(null); };
  const handleConfirmConcept = (trait, selectedConcept) => { const newTrait = { ...trait, appliedData: { ...trait.appliedData, concepto: selectedConcept } }; addTrait(newTrait); setConfiguringConceptTrait(null); };
  const handleConfirmNature = (trait, selectedNature) => { const newTrait = { ...trait, appliedData: { ...trait.appliedData, nature: selectedNature } }; addTrait(newTrait); setConfiguringNatureTrait(null); };
  const handleConfirmMovementType = (trait, selectedType) => { const newTrait = { ...trait, appliedData: { ...trait.appliedData, movementType: selectedType } }; addTrait(newTrait); setConfiguringMovementTrait(null); };
  const handleConfirmStatusEffect = (trait, selectedEffect) => { const newTrait = { ...trait, appliedData: { ...trait.appliedData, statusEffect: selectedEffect } }; addTrait(newTrait); setConfiguringStatusEffectTrait(null); };

  return (
    <>
      {configuringDamageTrait && (<DamageTypeModal isOpen={!!configuringDamageTrait} trait={configuringDamageTrait} onClose={() => setConfiguringDamageTrait(null)} onConfirm={handleConfirmDamageType}/>)}
      {configuringStatusEffectTrait && (<StatusEffectModal isOpen={!!configuringStatusEffectTrait} trait={configuringStatusEffectTrait} onClose={() => setConfiguringStatusEffectTrait(null)} onConfirm={handleConfirmStatusEffect}/>)}
      {configuringConceptTrait && (<ConceptModal isOpen={!!configuringConceptTrait} trait={configuringConceptTrait} onClose={() => setConfiguringConceptTrait(null)} onConfirm={handleConfirmConcept}/>)}
      {configuringNatureTrait && (<NatureModal isOpen={!!configuringNatureTrait} trait={configuringNatureTrait} onClose={() => setConfiguringNatureTrait(null)} onConfirm={handleConfirmNature}/>)}
      {configuringMovementTrait && (<MovementTypeModal isOpen={!!configuringMovementTrait} trait={configuringMovementTrait} onClose={() => setConfiguringMovementTrait(null)} onConfirm={handleConfirmMovementType}/>)}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h3 className="text-2xl font-bold text-stone-100 mb-4">Biblioteca de Rasgos Modulares</h3>
          <div className="space-y-2">
              {Object.entries(groupedTraits).map(([category, traits]) => {
                  const isOpen = openCategory === category; const categoryId = `category-panel-${category.replace(/\s+/g, '-')}`;
                  return (
                      <div key={category} className="border border-stone-700 rounded-lg bg-stone-800">
                          <button onClick={() => handleToggleCategory(category)} className="w-full flex justify-between items-center text-left p-4 hover:bg-stone-700/50 transition-colors" aria-expanded={isOpen} aria-controls={categoryId}>
                              <h4 className="text-lg font-semibold text-amber-500">{category}</h4>
                              <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                          </button>
                          <div id={categoryId} className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-[2000px]' : 'max-h-0'}`}>
                              <div className="p-4 border-t border-stone-700/50">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      {(traits as Trait[]).map(trait => (<TraitCard key={trait.name} trait={trait} onAdd={() => handleAddTraitClick(trait)} disabled={typeof trait.cost === 'number' && prRemaining < trait.cost}/>))}
                                  </div>
                              </div>
                          </div>
                      </div>
                  );
              })}
          </div>
        </div>
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <div className="bg-stone-950/50 p-4 rounded-lg border border-stone-700">
              <h3 className="text-xl font-bold text-stone-100 mb-4 text-center">Presupuesto</h3>
              <div className="flex justify-between items-center bg-stone-800 p-3 rounded-md mb-2">
                <span className="font-semibold text-stone-300">Puntos de Rasgo (PR)</span>
                <span className="text-2xl font-bold text-amber-500">{prRemaining} / {prBudget}</span>
              </div>
              <div className="text-xs text-stone-500 text-center">Base: {basePr}, Ganados: {prGained}, Gastados: {prSpent}</div>
            </div>
            <div className="bg-stone-950/50 p-4 rounded-lg border border-stone-700 mt-4">
              <h3 className="text-xl font-bold text-stone-100 mb-4">Rasgos Seleccionados</h3>
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {creature.traits.length === 0 ? (<p className="text-stone-500 italic text-sm">Ningún rasgo añadido todavía.</p>) : (
                  creature.traits.map((trait) => {
                      const isAttributeTrait = trait.name === 'Mejora de Atributo' || trait.name === 'Deficiencia de Atributo'; const isCategoryTrait = trait.isCategoryAbility;
                      let displayName = trait.name;
                      if (trait.appliedData?.damageType) { displayName = `${trait.name} (${trait.appliedData.damageType})`; }
                      else if (trait.appliedData?.attribute) { const attrName = trait.appliedData.attribute.charAt(0).toUpperCase() + trait.appliedData.attribute.slice(1); displayName = `${trait.name} (${attrName})`; }
                      else if (trait.appliedData?.concepto) { displayName = `${trait.name} (${trait.appliedData.concepto})`; }
                      else if (trait.appliedData?.nature) { displayName = `${trait.name} (${trait.appliedData.nature})`; }
                      else if (trait.appliedData?.movementType) { displayName = `${trait.name} (${trait.appliedData.movementType})`; }
                      else if (trait.appliedData?.statusEffect) { displayName = `${trait.name} (${trait.appliedData.statusEffect})`; }
                      return (
                          <div key={trait.instanceId} className={`flex justify-between items-center bg-stone-800 p-2 rounded-md ${isCategoryTrait ? 'bg-amber-900/30 border border-amber-800/50' : ''}`}>
                              <span className="flex-1 min-w-0 text-sm text-stone-300 truncate pr-2">{displayName}{isCategoryTrait && <span className="text-xs text-amber-500 italic ml-2">(Habilidad de Categoría)</span>}</span>
                              <button onClick={() => removeTrait(trait.instanceId)} disabled={isAttributeTrait || isCategoryTrait} className="text-red-600 hover:text-red-500 text-xs font-bold disabled:text-stone-600 disabled:cursor-not-allowed" title={isAttributeTrait ? "Modifica esto en el paso de Atributos" : isCategoryTrait ? "Habilidad fija de la categoría" : "Eliminar rasgo"}>X</button>
                          </div>
                      );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// ===================================================
// App
// ===================================================

const App = () => {
  const createCategoryTrait = useCallback((categoryKey) => {
      const categoryData = CATEGORY_MAP[categoryKey];
      const abilityText = categoryData.ability;
      const parts = abilityText.split(': ');
      const name = parts[0];
      const description = parts.slice(1).join(': ');

      return {
          name: name,
          description: description,
          cost: 0, 
          category: 'Control y Únicos',
          isCategoryAbility: true,
          restriction: null,
          instanceId: `category-${categoryKey}`,
      };
  }, []);

  const getInitialCreature = useCallback(() => ({
    name: 'Nueva Criatura',
    nd: '1',
    size: 'Mediano',
    category: 'Bestia',
    attributes: { cuerpo: 2, destreza: 2, aura: 2 },
    traits: [createCategoryTrait('Bestia')],
    attacks: [{ name: 'Golpe', type: 'Melee', attribute: 'cuerpo', damageDice: '1d6', damageModifier: 0, damageType: 'Contundente', description: '' }],
    natures: ['Brutalmente'],
    equippedWeapons: [],
  }), [createCategoryTrait]);
  
  const [creature, setCreature] = useState(getInitialCreature);
  const [step, setStep] = useState(1);
  const [savedCreatures, setSavedCreatures] = useState([]);

  useEffect(() => {
    try {
        const savedData = localStorage.getItem('rpg-creature-crafter-saves');
        if (savedData) { setSavedCreatures(JSON.parse(savedData)); }
    } catch (error) { console.error("Failed to load creatures from localStorage", error); setSavedCreatures([]); }
  }, []);

  const updateSavedCreatures = (newSavedCreatures) => {
      setSavedCreatures(newSavedCreatures);
      try { localStorage.setItem('rpg-creature-crafter-saves', JSON.stringify(newSavedCreatures)); }
      catch (error) { console.error("Failed to save creatures to localStorage", error); }
  };

  const handleSaveCreature = () => {
      setCreature(currentCreature => {
          const creatureToSave = { ...currentCreature };
          let newSavedCreatures;
          if (creatureToSave.id) { newSavedCreatures = savedCreatures.map(c => c.id === creatureToSave.id ? creatureToSave : c); }
          else { creatureToSave.id = generateUniqueId('creature'); newSavedCreatures = [...savedCreatures, creatureToSave]; }
          updateSavedCreatures(newSavedCreatures);
          return creatureToSave;
      });
  };

  const handleLoadCreature = (id) => {
      const creatureToLoad = savedCreatures.find(c => c.id === id);
      if (creatureToLoad) { setCreature(creatureToLoad); setStep(6); }
  };

  const handleDeleteCreature = (id) => {
      const newSavedCreatures = savedCreatures.filter(c => c.id !== id);
      updateSavedCreatures(newSavedCreatures);
      if (creature.id === id) { handleNewCreature(); }
  };

  const handleNewCreature = () => { setCreature(getInitialCreature()); setStep(1); };

  const handleReset = () => {
    setCreature(c => {
        const defaultStats = ND_MAP[c.nd];
        const categoryTrait = c.traits.find(t => t.isCategoryAbility);
        const newTraits = categoryTrait ? [categoryTrait] : [];
        return { ...c, attributes: { cuerpo: defaultStats.bonoBase, destreza: defaultStats.bonoBase, aura: defaultStats.bonoBase }, traits: newTraits };
    });
  };
  
  const handleCreatureChange = (key, value) => {
    setCreature(prev => {
        const nextCreature = { ...prev, [key]: value };
        if (key === 'nd') {
            const newBaseStats = ND_MAP[value];
            nextCreature.attributes = { cuerpo: newBaseStats.bonoBase, destreza: newBaseStats.bonoBase, aura: newBaseStats.bonoBase };
            nextCreature.traits = prev.traits.filter(t => t.name !== 'Mejora de Atributo' && t.name !== 'Deficiencia de Atributo');
        }
        if (key === 'category') {
            const newCategoryTrait = createCategoryTrait(value);
            const otherTraits = prev.traits.filter(t => !t.isCategoryAbility);
            nextCreature.traits = [...otherTraits, newCategoryTrait];
        }
        return nextCreature;
    });
  };

  const handleAttributeChange = (attr, delta) => {
    setCreature(prev => {
        const newCreature = { ...prev, attributes: { ...prev.attributes }, traits: [...prev.traits] };
        const newValue = newCreature.attributes[attr] + delta;
        if (newValue < -3) { return prev; }
        const mejoraTraitTemplate = ALL_TRAITS.find(t => t.name === 'Mejora de Atributo');
        const deficienciaTraitTemplate = ALL_TRAITS.find(t => t.name === 'Deficiencia de Atributo');
        if (!mejoraTraitTemplate || !deficienciaTraitTemplate) { return prev; }
        if (delta === 1) {
            const deficienciaIndex = newCreature.traits.findIndex(t => t.name === 'Deficiencia de Atributo' && t.appliedData?.attribute === attr);
            if (deficienciaIndex > -1) { newCreature.traits.splice(deficienciaIndex, 1); }
            else { newCreature.traits.push({ ...mejoraTraitTemplate, appliedData: { attribute: attr }, instanceId: generateUniqueId('trait') }); }
        } else {
            const mejoraIndex = newCreature.traits.findIndex(t => t.name === 'Mejora de Atributo' && t.appliedData?.attribute === attr);
            if (mejoraIndex > -1) { newCreature.traits.splice(mejoraIndex, 1); }
            else { newCreature.traits.push({ ...deficienciaTraitTemplate, appliedData: { attribute: attr }, instanceId: generateUniqueId('trait') }); }
        }
        newCreature.attributes[attr] = newValue;
        
        if (attr === 'cuerpo') {
            if (newCreature.equippedArmor && newValue < newCreature.equippedArmor.armor.cuerpoRequirement) {
                newCreature.equippedArmor = undefined;
            }
            if (newCreature.equippedShield && newValue < newCreature.equippedShield.shield.cuerpoRequirement) {
                newCreature.equippedShield = undefined;
            }
        }

        return newCreature;
    });
  };

  const handleAddWeapon = (weaponName) => {
    const weaponToAdd = WEAPON_MAP[weaponName];
    if (weaponToAdd) {
        const newEquippedWeapon = { weapon: weaponToAdd, bonus: 0 };
        setCreature(prev => ({ ...prev, equippedWeapons: [...prev.equippedWeapons, newEquippedWeapon] }));
    }
  };

  const handleRemoveWeapon = (weaponIndex) => {
    setCreature(prev => ({ ...prev, equippedWeapons: prev.equippedWeapons.filter((_, index) => index !== weaponIndex) }));
  };
  
  const handleWeaponBonusChange = (weaponIndex, bonus) => {
      setCreature(prev => {
          const newWeapons = [...prev.equippedWeapons];
          newWeapons[weaponIndex] = { ...newWeapons[weaponIndex], bonus };
          return { ...prev, equippedWeapons: newWeapons };
      });
  };

  const handleArmorShieldChange = (type, name) => {
    setCreature(prev => {
        const newCreature = { ...prev };
        if (name === "Ninguno") {
            if (type === 'armor') newCreature.equippedArmor = undefined;
            if (type === 'shield') newCreature.equippedShield = undefined;
        } else {
            if (type === 'armor') { newCreature.equippedArmor = { armor: ARMOR_MAP[name], bonus: 0 }; }
            if (type === 'shield') { newCreature.equippedShield = { shield: SHIELD_MAP[name], bonus: 0 }; }
        }
        return newCreature;
    });
  };

  const handleEquipmentBonusChange = (type, bonus) => {
    setCreature(prev => {
        if (type === 'armor' && prev.equippedArmor) { return { ...prev, equippedArmor: { ...prev.equippedArmor, bonus } }; }
        if (type === 'shield' && prev.equippedShield) { return { ...prev, equippedShield: { ...prev.equippedShield, bonus } }; }
        return prev;
    });
  };

  const addTrait = (trait) => {
    const newTrait = { ...trait, instanceId: generateUniqueId('trait') };
    setCreature(prev => ({ ...prev, traits: [...prev.traits, newTrait] }));
  };

  const removeTrait = (instanceIdToRemove) => {
    setCreature(prev => ({ ...prev, traits: prev.traits.filter(t => t.instanceId !== instanceIdToRemove) }));
  };

  const addAttack = (attack) => { setCreature(prev => ({ ...prev, attacks: [...prev.attacks, attack] })); };
  const removeAttack = (indexToRemove) => { setCreature(prev => ({ ...prev, attacks: prev.attacks.filter((_, index) => index !== indexToRemove) })); };
  
  const reorderAttacks = (fromIndex, toIndex) => {
    setCreature(prev => {
        const newAttacks = [...prev.attacks];
        if (toIndex < 0 || toIndex >= newAttacks.length) { return prev; }
        const [movedItem] = newAttacks.splice(fromIndex, 1);
        newAttacks.splice(toIndex, 0, movedItem);
        return { ...prev, attacks: newAttacks };
    });
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-3xl font-bold text-amber-500">Paso 1: Concepto y Nivel de Desafío</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-stone-300 mb-1">Nombre de la Criatura</label>
                <input id="name" type="text" value={creature.name} onChange={(e) => handleCreatureChange('name', e.target.value)} className="w-full bg-stone-700 border border-stone-600 rounded-md shadow-sm py-2 px-3 text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-600"/>
              </div>
              <div>
                <label htmlFor="nd" className="block text-sm font-medium text-stone-300 mb-1">Nivel de Desafío (ND)</label>
                <select id="nd" value={creature.nd} onChange={(e) => handleCreatureChange('nd', e.target.value)} className="w-full bg-stone-700 border border-stone-600 rounded-md shadow-sm py-2 px-3 text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-600">
                  {CHALLENGE_RATINGS.map(cr => <option key={cr.nd} value={cr.nd}>{cr.nd}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="size" className="block text-sm font-medium text-stone-300 mb-1">Tamaño</label>
                <select id="size" value={creature.size} onChange={(e) => handleCreatureChange('size', e.target.value)} className="w-full bg-stone-700 border border-stone-600 rounded-md shadow-sm py-2 px-3 text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-600">
                  {SIZES.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-stone-300 mb-1">Categoría</label>
                <select id="category" value={creature.category} onChange={(e) => handleCreatureChange('category', e.target.value)} className="w-full bg-stone-700 border border-stone-600 rounded-md shadow-sm py-2 px-3 text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-600">
                  {CATEGORIES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                </select>
              </div>
               <div>
                    <label htmlFor="nature" className="block text-sm font-medium text-stone-300 mb-1">Naturaleza Inicial</label>
                    <select id="nature" value={creature.natures[0]} onChange={(e) => { const newNatures = [...creature.natures]; newNatures[0] = e.target.value; handleCreatureChange('natures', newNatures); }} className="w-full bg-stone-700 border border-stone-600 rounded-md shadow-sm py-2 px-3 text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-600">
                      {NATURES.map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
              </div>
            </div>
            <div className="p-4 bg-stone-900/50 rounded-lg border border-stone-700">
                <h3 className="font-semibold text-lg text-amber-400">Habilidad de Categoría: {creature.category}</h3>
                <p className="text-stone-400 mt-1">{CATEGORY_MAP[creature.category].ability}</p>
            </div>
          </div>
        );
      case 2: return (<div className="animate-fade-in"><h2 className="text-3xl font-bold text-amber-500 mb-6">Paso 2: Atributos</h2><AttributeEditor creature={creature} onAttributeChange={handleAttributeChange} onReset={handleReset} /></div>);
      case 3: return (<div className="animate-fade-in"><h2 className="text-3xl font-bold text-amber-500 mb-6">Paso 3: Personalización (Rasgos)</h2><TraitSelector creature={creature} addTrait={addTrait} removeTrait={removeTrait} /></div>);
      case 4: return (<div className="animate-fade-in"><h2 className="text-3xl font-bold text-amber-500 mb-6">Paso 4: Equipamiento</h2><EquipmentSelector creature={creature} onAddWeapon={handleAddWeapon} onRemoveWeapon={handleRemoveWeapon} onWeaponBonusChange={handleWeaponBonusChange} onArmorShieldChange={handleArmorShieldChange} onEquipmentBonusChange={handleEquipmentBonusChange}/></div>);
      case 5: return (<div className="animate-fade-in"><h2 className="text-3xl font-bold text-amber-500 mb-6">Paso 5: Ataques y Acciones</h2><ActionEditor creature={creature} addAttack={addAttack} removeAttack={removeAttack} reorderAttacks={reorderAttacks}/></div>);
      case 6: return (<div className="animate-fade-in"><h2 className="text-3xl font-bold text-amber-500 mb-6">Ficha de Criatura Completa</h2><CreatureSheet creature={creature} /></div>);
      default: return null;
    }
  };
  
  const handleStepClick = (newStep) => { setStep(newStep); };

  return (
    <div className="container mx-auto p-4 md:p-8 font-sans">
      <header className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-stone-100">Creador de Criaturas <span className="text-amber-500">PP2</span></h1>
        <p className="text-stone-400 mt-2">Una herramienta para dar vida a tus adversarios.</p>
      </header>
      <div className="flex justify-center mb-8">
        <SaveLoadManager creature={creature} savedCreatures={savedCreatures} onSave={handleSaveCreature} onLoad={handleLoadCreature} onDelete={handleDeleteCreature} onNew={handleNewCreature}/>
      </div>
      <StepNavigator currentStep={step} onStepClick={handleStepClick} />
      <div className="bg-stone-800 border border-stone-700 rounded-xl shadow-2xl p-6 md:p-8 min-h-[500px]">
        {renderStep()}
      </div>
      <footer className="mt-8 flex justify-between items-center">
        <button onClick={() => setStep(s => Math.max(1, s - 1))} disabled={step === 1} className="px-6 py-2 bg-stone-700 hover:bg-stone-600 text-stone-100 font-semibold rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Anterior</button>
        {step === 6 ? (<button onClick={handleNewCreature} className="px-6 py-2 bg-amber-600 hover:bg-amber-500 text-stone-100 font-semibold rounded-lg shadow-md transition-colors">Empezar de Nuevo</button>) : (<button onClick={() => setStep(s => Math.min(6, s + 1))} disabled={step === 6} className="px-6 py-2 bg-amber-700 hover:bg-amber-600 text-stone-100 font-semibold rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Siguiente</button>)}
      </footer>
    </div>
  );
}

// ===================================================
// RENDER
// ===================================================

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);
root.render(<App />);