export type ChallengeRatingKey = '1/8' | '1/4' | '1/2' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13' | '14' | '15';
export type SizeKey = 'Minúsculo' | 'Pequeño' | 'Mediano' | 'Grande' | 'Enorme' | 'Colosal';
export type CategoryKey = 'Bestia' | 'Monstruo' | 'Espíritu' | 'Exaltado' | 'Corrupto' | 'Elemental' | 'Artificial';
export type TraitCategory = 'Atributos y Vitalidad' | 'Ofensivos' | 'Defensivos' | 'Movilidad' | 'Aura y Percepción' | 'Control y Únicos';
export type DamageType = 'Cortante' | 'Penetrante' | 'Contundente' | 'Fuego' | 'Hielo' | 'Eléctrico' | 'Corrosivo' | 'Radiante' | 'Mental' | 'Variable';
export type MovementType = 'Nadar' | 'Trepar' | 'Excavar';
export type StatusEffect = 'Asfixiado' | 'Asustado' | 'Aturdido' | 'Controlado' | 'Derribado' | 'Dormido' | 'Encantado' | 'Envenenado' | 'Envenenado Mayor' | 'Inmovilizado' | 'Quemado' | 'Quemado Mayor';

export interface WeaponProperty {
  name: 'Ligera' | 'Pesada' | 'A dos manos' | 'Versátil' | 'Arrojadiza' | 'Alcance' | 'Rango' | 'Recarga';
  details?: string;
}

export interface Weapon {
  name: string;
  category: 'Armas Simples CC' | 'Armas Simples Dist.' | 'Armas Marciales CC' | 'Armas Marciales Dist.';
  damage: string;
  damageType: DamageType;
  properties: WeaponProperty[];
  cost: string;
}

export interface Armor {
    name: string;
    type: 'Ligera' | 'Media' | 'Pesada';
    defenseBonus: number;
    dexLimit: number | null;
    cuerpoRequirement: number;
    sigiloPenalty: number;
    cost: string;
}

export interface Shield {
    name: string;
    type: 'Ligero' | 'Medio' | 'Pesado';
    defenseBonus: number;
    cuerpoRequirement: number;
    sigiloPenalty: number | null;
    cost: string;
}

export interface EquippedWeapon {
    weapon: Weapon;
    bonus: number;
}

export interface EquippedArmor {
    armor: Armor;
    bonus: number;
}

export interface EquippedShield {
    shield: Shield;
    bonus: number;
}

export interface ChallengeRating {
  nd: ChallengeRatingKey;
  resistencia: number;
  defensa: number;
  bonoBase: number;
  danoBase: string;
  pr: number;
}

export interface Size {
  name: SizeKey;
  modResistencia: number;
  modDefensa: number;
}

export interface Category {
  name: CategoryKey;
  ability: string;
}

export interface Trait {
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

export interface Attack {
  name: string;
  type: 'Melee' | 'Ranged';
  attribute: keyof Creature['attributes'];
  damageDice: string;
  damageModifier: number;
  damageType: DamageType;
  description: string;
  range?: string;
}

export interface Creature {
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
