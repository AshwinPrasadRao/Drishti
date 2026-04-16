export type MilitaryService = 'army' | 'navy' | 'air_force';

export type EquipmentCategory =
  // Air Force
  | 'combat_aircraft'
  | 'transport_aircraft'
  | 'trainer_aircraft'
  | 'attack_helicopter'
  | 'utility_helicopter'
  | 'uav'
  // Army
  | 'main_battle_tank'
  | 'infantry_fighting_vehicle'
  | 'armoured_personnel_carrier'
  | 'self_propelled_artillery'
  | 'towed_artillery'
  | 'multiple_rocket_launcher'
  | 'air_defence_system'
  | 'anti_tank_missile'
  // Navy
  | 'aircraft_carrier'
  | 'destroyer'
  | 'frigate'
  | 'corvette'
  | 'submarine_conventional'
  | 'submarine_nuclear'
  | 'offshore_patrol_vessel'
  | 'naval_helicopter'
  | 'maritime_patrol_aircraft'
  | 'landing_ship';

export type OriginCountry = 'india' | 'russia' | 'france' | 'usa' | 'israel' | 'uk' | 'germany' | 'sweden' | 'south_korea' | 'other';

export interface EquipmentSource {
  title: string;
  publisher: string;
  year: number;
  url?: string;
}

export interface Equipment {
  id: string;
  name: string;
  designation: string;
  service: MilitaryService;
  category: EquipmentCategory;
  origin: OriginCountry;
  inService: boolean;

  // Current inventory
  currentQuantity: number;
  quantityOnOrder?: number;

  // Unit economics (INR Crore, constant 2024 prices)
  unitProcurementCost: number;
  unitAnnualMaintenanceCost: number;

  // Procurement logistics
  leadTimeYears: number;
  lifeExpectancyYears: number;
  expectedRetirementStart?: number;
  expectedRetirementComplete?: number;
  firstIntroduced?: number;

  notes?: string;
  sources: EquipmentSource[];
}
