import { Description } from '@radix-ui/react-dialog';
import { Index } from 'drizzle-orm/gel-core';
import { mysqlTable, varchar, int, serial, decimal, smallint, mysqlEnum, tinyint, timestamp, bigint, char, datetime, boolean, date, longtext } from 'drizzle-orm/mysql-core';
import { Radius } from 'lucide-react';
import { string } from 'zod';

export const achievements = mysqlTable("achievements", {
  id: int("id", { unsigned: true }).primaryKey().notNull().autoincrement(),
  Name: varchar("Name", { length: 55 }).notNull(),
  File: varchar("File", { length: 255 }).notNull().default("default.swf"),
  Image: varchar("Image", { length: 255 }).notNull().default("Achievement.png"),
  Linkage: varchar("Linkage", { length: 60 }).default("Achievement"),
  Shop: int("Shop").notNull().default(0),
  Description: longtext("Description").notNull(),
});

export const areas = mysqlTable("areas", {
  id: int("id", { unsigned: true }).primaryKey().notNull().autoincrement(),
  Name: varchar("Name", { length: 32 }).notNull(),
  File: varchar("File", { length: 50 }).notNull(),
  MaxPlayers: tinyint("MaxPlayers", { unsigned: true }).notNull().default(6),
  ReqLevel: int("ReqLevel").notNull().default(1),
  ReqParty: boolean("ReqParty").notNull().default(false),
  Upgrade: boolean("Upgrade").notNull().default(false),
  Staff: boolean("Staff").notNull().default(false),
  PvP: boolean("PvP").notNull().default(false),
  Timeline: boolean("Timeline").notNull().default(false),
  Floor: boolean("Floor").notNull().default(false),
  Dungeon: boolean("Dungeon").notNull().default(false),
  DamageMultiplier: decimal("DamageMultiplier", { precision: 7, scale: 2 }).notNull().default("1.00"),
  GuildLevel: int("GuildLevel", { unsigned: true }).notNull().default(0),
  Created_At: timestamp("Created_At").notNull().defaultNow(),
  Updated_At: timestamp("Updated_At").notNull().defaultNow(),
});

export const areas_items = mysqlTable("areas_items", {
  MapID: int("MapID", { unsigned: true }).notNull(),
  ItemID: int("ItemID", { unsigned: true }).notNull(),
});

export const areas_monsters = mysqlTable("areas_monsters", {
  id: int("id", { unsigned: true }).primaryKey().notNull().autoincrement(),
  MapID: int("MapID", { unsigned: true }).notNull(),
  MonsterID: int("MonsterID", { unsigned: true }).notNull(),
  MonMapID: int("MonMapID", { unsigned: true }).notNull(),
  Frame: varchar("Frame", { length: 10 }).notNull(),
  Aggresive: tinyint("Aggresive").notNull().default(0),
  SpawnTimePeriod: mysqlEnum("SpawnTimePeriod", ["Always", "Morning", "Afternoon", "Evening", "Midnight"]).notNull().default("Always"),
  CanMove: tinyint("CanMove", { unsigned: true }).notNull().default(1),
  ReqQuestID: int("ReqQuestID", { unsigned: true }),
  Team: tinyint("Team", { unsigned: true }).notNull().default(0),
});

export const areas_npcs = mysqlTable("areas_npcs", {
  id: int("id", { unsigned: true }).primaryKey().notNull().autoincrement(),
  MapID: int("MapID", { unsigned: true }).notNull(),
  NpcID: int("NpcID", { unsigned: true }).notNull(),
  NpcMapID: int("NpcMapID", { unsigned: true }).notNull().default(1),
  Frame: varchar("Frame", { length: 60 }).notNull().default("None"),
  SpawnTimePeriod: mysqlEnum("SpawnTimePeriod", ["Always", "Morning", "Afternoon", "Evening", "Midnight"]).notNull().default("Always"),
  Behavior: mysqlEnum("Behavior", ["Neutral", "Hostile", "Ally"]).notNull().default("Neutral"),
  CanMove: tinyint("CanMove", { unsigned: true }).notNull().default(1),
  ReqQuestID: int("ReqQuestID", { unsigned: true }),
  Team: tinyint("Team", { unsigned: true }).notNull().default(1),
});

export const areas_timeline = mysqlTable("areas_timeline", {
  id: int("id", { unsigned: true }).primaryKey().notNull().autoincrement(),
  AreaID: int("AreaID", { unsigned: true }),
  Scale: decimal("Scale", { precision: 7, scale: 2 }).notNull().default("0.80"),
  Mode: varchar("Mode", { length: 10 }).notNull().default("normal"),
  Speed: int("Speed").notNull().default(11),
  Scroll: tinyint("Scroll", { unsigned: true }).notNull().default(0),
  Width: int("Width").notNull().default(1980),
  Height: int("Height").notNull().default(700),
  Frame: varchar("Frame", { length: 10 }).notNull().default("Enter"),
  Data: longtext("Data").notNull().default('[]'),
});

export const auras = mysqlTable("auras", {
  id: int("id", { unsigned: true }).primaryKey().notNull().autoincrement(),
  Name: varchar("Name", { length: 32 }).notNull(),
  Duration: smallint("Duration").notNull().default(6),
  Speed: int("Speed").notNull().default(2500),
  Category: varchar("Category", { length: 50 }).default("none"),
  Target: mysqlEnum("Target", ["h", "s", "f"]).default("h"),
  Chance: decimal("Chance", { precision: 7, scale: 2 }).notNull().default("1.00"),
  MsgOn: longtext("MsgOn"),
  MsgOff: longtext("MsgOff"),
  AnimOn: varchar("AnimOn", { length: 50 }),
  AnimOff: varchar("AnimOff", { length: 50 }),
  SpellOn: varchar("SpellOn", { length: 50 }),
  Transform: tinyint("Transform").notNull().default(0),
  MaxStack: int("MaxStack", { unsigned: true }).notNull().default(999),
  Turns: int("Turns", { unsigned: true }).notNull().default(0),
  IndicatorID: int("IndicatorID", { unsigned: true }),
});

export const auras_effects = mysqlTable("auras_effects", {
  id: int("id", { unsigned: true }).primaryKey().notNull().autoincrement(),
  AuraID: int("AuraID", { unsigned: true }).notNull(),
  Stat: varchar("Stat", { length: 3 }).notNull(),
  Value: decimal("Value", { precision: 7, scale: 2 }).notNull().default("0.00"),
  Type: varchar("Type", { length: 2 }).notNull().default("+"),
  CanStack: tinyint("CanStack", { unsigned: true }).notNull().default(0),
});

export const chat_channels = mysqlTable("chat_channels", {
  Name: varchar("Name", { length: 50 }).primaryKey().notNull(),
  Color: varchar("Color", { length: 50 }).notNull().default("FFFFFF"),
  Type: mysqlEnum("Type", ["message", "event", "whisper", "server"]).notNull().default("message"),
  Tag: varchar("Tag", { length: 50 }).notNull().default("") ,
  Rid: int("Rid", { unsigned: true }).notNull().default(0),
  Act: int("Act", { unsigned: true }).notNull().default(1),
});

export const chat_filters = mysqlTable("chat_filters", {
  id: int("id", { unsigned: true }).primaryKey().notNull().autoincrement(),
  Word: varchar("Word", { length: 50 }).notNull(),
  Mutetime: int("Mutetime").notNull().default(1000),
});

export const chat_global_messages = mysqlTable("chat_global_messages", {
  id: int("id", { unsigned: true }).primaryKey().notNull().autoincrement(),
  Message: varchar("Message", { length: 255 }).notNull(),
  Interval: int("Interval").notNull().default(60),
});

export const classes = mysqlTable("classes", {
  id: int("id").primaryKey().notNull().autoincrement(),
  ItemID: int("ItemID", { unsigned: true }).notNull(),
  Category: varchar("Category", { length: 2 }).notNull(),
  Description: longtext("Description").notNull(),
  ManaRegenerationMethods: longtext("ManaRegenerationMethods").notNull(),
  StatsDescription: longtext("StatsDescription").notNull(),
});

export const enhancements = mysqlTable("enhancements", {
  id: int("id", { unsigned: true }).primaryKey().notNull().autoincrement(),
  Name: varchar("Name", { length: 32 }).notNull(),
  PatternID: int("PatternID", { unsigned: true }).notNull().default(1),
  Rarity: tinyint("Rarity", { unsigned: true }).notNull(),
  DPS: smallint("DPS", { unsigned: true }).notNull(),
  Level: tinyint("Level", { unsigned: true }).notNull().default(1),
});

export const enhancements_patterns = mysqlTable("enhancements_patterns", {
  id: int("id", { unsigned: true }).primaryKey().notNull().autoincrement(),
  Name: varchar("Name", { length: 32 }).notNull(),
  Desc: varchar("Desc", { length: 4 }).notNull(),
  Wisdom: tinyint("Wisdom", { unsigned: true }).notNull(),
  Strength: tinyint("Strength", { unsigned: true }).notNull(),
  Luck: tinyint("Luck", { unsigned: true }).notNull(),
  Dexterity: tinyint("Dexterity", { unsigned: true }).notNull(),
  Endurance: tinyint("Endurance", { unsigned: true }).notNull(),
  Intelligence: tinyint("Intelligence", { unsigned: true }).notNull(),
});

export const factions = mysqlTable("factions", {
  id: int("id", { unsigned: true }).primaryKey().notNull().autoincrement(),
  Name: varchar("Name", { length: 20 }).notNull(),
});

export const global_drops = mysqlTable("global_drops", {
  id: int("id").primaryKey().notNull().autoincrement(),
  ItemID: int("ItemID").notNull(),
  Chance: decimal("Chance", { precision: 20, scale: 6 }).notNull(),
  Quantity: int("Quantity").notNull().default(0),
});

export const guilds = mysqlTable("guilds", {
  id: int("id", { unsigned: true }).primaryKey().notNull().autoincrement(),
  Name: varchar("Name", { length: 64 }).notNull(),
  Color: varchar("Color", { length: 64 }).notNull().default("0xFFFFFF"),
  MessageOfTheDay: varchar("MessageOfTheDay", { length: 512 }).notNull(),
  MaxMembers: tinyint("MaxMembers", { unsigned: true }).notNull().default(15),
  Wins: int("Wins", { unsigned: true }).notNull().default(0),
  Loses: int("Loses").notNull().default(0),
  TotalKills: int("TotalKills", { unsigned: true }).notNull().default(0),
  Level: int("Level", { unsigned: true }).notNull().default(1),
  Exp: int("Exp").notNull().default(0),
});

export const hairs = mysqlTable("hairs", {
  id: int("id", { unsigned: true }).primaryKey().notNull().autoincrement(),
  Gender: varchar("Gender", { length: 1 }).notNull(),
  Name: varchar("Name", { length: 16 }).notNull(),
  File: varchar("File", { length: 64 }).notNull(),
});

export const items = mysqlTable("items", {
  id: int("id", { unsigned: true }).primaryKey().notNull().autoincrement(),
  Name: varchar("Name", { length: 60 }).notNull(),
  Description: longtext("Description").notNull().default(""),
  Type: varchar("Type", { length: 16 }).notNull(),
  Element: varchar("Element", { length: 16 }).notNull().default("None"),
  File: varchar("File", { length: 120 }),
  Link: varchar("Link", { length: 64 }),
  Icon: varchar("Icon", { length: 16 }).notNull(),
  Equipment: varchar("Equipment", { length: 10 }).notNull(),
  Level: tinyint("Level", { unsigned: true }).notNull().default(1),
  DPS: smallint("DPS", { unsigned: true }).notNull().default(100),
  Range: smallint("Range", { unsigned: true }).notNull().default(50),
  Rarity: int("Rarity").notNull().default(1),
  Quantity: smallint("Quantity", { unsigned: true }).notNull().default(1),
  Stack: smallint("Stack", { unsigned: true }).notNull().default(1),
  Cost: int("Cost", { unsigned: true }).notNull().default(0),
  Silver: boolean("Silver").notNull().default(false),
  Gold: boolean("Gold").notNull().default(false),
  Sell: boolean("Sell").notNull().default(true),
  Temporary: boolean("Temporary").notNull().default(false),
  Upgrade: boolean("Upgrade").notNull().default(false),
  Staff: boolean("Staff").notNull().default(false),
  EnhID: int("EnhID", { unsigned: true }).notNull().default(1),
  FactionID: int("FactionID", { unsigned: true }).default(1),
  TitleID: int("TitleID", { unsigned: true }),
  ReqReputation: int("ReqReputation").notNull().default(0),
  ReqClassID: int("ReqClassID", { unsigned: true }),
  ReqClassPoints: int("ReqClassPoints").notNull().default(0),
  ReqTrackQuest: varchar("ReqTrackQuest", { length: 50 }),
  Meta: varchar("Meta", { length: 50 }),
});

export const item_rarities = mysqlTable("item_rarities", {
  id: int("id", { unsigned: true }).primaryKey().notNull().autoincrement(),
  Name: varchar("Name", { length: 60 }).notNull(),
  Color: varchar("Color", { length: 50 }).notNull().default("0xFFFFFF")
});

export const items_requirements = mysqlTable("items_requirements", {
  id: int("id", { unsigned: true }).primaryKey().notNull().autoincrement(),
  ItemID: int("ItemID", { unsigned: true }).notNull(),
  ReqItemID: int("ReqItemID", { unsigned: true }).notNull(),
  Quantity: smallint("Quantity", { unsigned: true }).notNull().default(0),
});

export const items_skills = mysqlTable("items_skills", {
  id: int("id", { unsigned: true }).primaryKey().notNull().autoincrement(),
  ItemID: int("ItemID", { unsigned: true }).notNull(),
  SkillID: int("SkillID", { unsigned: true }).notNull(),
});

export const monsters = mysqlTable("monsters", {
id: int("id", { unsigned: true }).primaryKey().notNull().autoincrement(),
Name: varchar("Name", { length: 30 }).notNull(),
RaceID: int("RaceID", { unsigned: true }).notNull().default(1),
File: varchar("File", { length: 128 }).notNull(),
Linkage: varchar("Linkage", { length: 32 }).notNull().default("Monster"),
Level: tinyint("Level", { unsigned: true }).notNull().default(1),
Health: int("Health", { unsigned: true }).notNull().default(100),
HealthBar: tinyint("HealthBar", { unsigned: true }).notNull().default(1),
Mana: int("Mana", { unsigned: true }).notNull().default(100),
Copper: int("Copper", { unsigned: true }).notNull().default(0),
Silver: int("Silver", { unsigned: true }).notNull().default(0),
Gold: int("Gold", { unsigned: true }).notNull().default(0),
Experience: int("Experience", { unsigned: true }).notNull().default(10),
ClassPoint: int("ClassPoint", { unsigned: true }).notNull().default(0),
Reputation: int("Reputation").notNull().default(0),
Damage: decimal("Damage", { precision: 7, scale: 2 }).notNull().default("0.10"),
Respawn: int("Respawn", { unsigned: true }).notNull().default(6),
Speed: int("Speed", { unsigned: true }).notNull().default(1500),
Immune: boolean("Immune").notNull().default(false),
FloorBoss: boolean("FloorBoss").notNull().default(false),
TeamID: int("TeamID", { unsigned: true }).notNull().default(0),
});

export const monsters_drops = mysqlTable("monsters_drops", {
  id: int("id", { unsigned: true }).primaryKey().notNull().autoincrement(),
  MonsterID: int("MonsterID", { unsigned: true }).notNull(),
  ItemID: int("ItemID", { unsigned: true }).notNull(),
  Chance: decimal("Chance", { precision: 7, scale: 2 }).notNull().default("1.00"),
  Quantity: int("Quantity", { unsigned: true }).notNull().default(1),
});

export const monsters_skills = mysqlTable("monsters_skills", {
  id: int("id", { unsigned: true }).primaryKey().notNull().autoincrement(),
  MonsterID: int("MonsterID", { unsigned: true }).notNull(),
  SkillID: int("SkillID", { unsigned: true }).notNull(),
});

export const monsters_titles = mysqlTable("monsters_titles", {
  id: int("id", { unsigned: true }).primaryKey().notNull().autoincrement(),
  Name: varchar("Name", { length: 30 }).notNull(),
  Color: varchar("Color", { length: 60 }).notNull().default("0xFFFFFF")
});

export const quests = mysqlTable("quests", {
  id: int("id", { unsigned: true }).notNull().primaryKey(),
  WarID: int("WarID", { unsigned: true }),
  AchievementID: int("AchievementID", { unsigned: true }),
  TitleID: int("TitleID"),
  FactionID: int("FactionID", { unsigned: true }).default(1),
  WarMega: tinyint("WarMega").default(0),
  ReqReputation: int("ReqReputation", { unsigned: true }).notNull().default(0),
  ReqClassID: int("ReqClassID", { unsigned: true }).notNull().default(0),
  ReqClassPoints: int("ReqClassPoints", { unsigned: true }).notNull().default(0),
  ChainID: int("ChainID"),
  Name: varchar("Name", { length: 64 }).notNull(),
  Description: longtext("Description").notNull(),
  Tier: int("Tier", { unsigned: true }).notNull().default(1),
  EndText: longtext("EndText").notNull(),
  Experience: int("Experience", { unsigned: true }).notNull().default(0),
  Copper: int("Copper", { unsigned: true }).notNull().default(0),
  Silver: int("Silver", { unsigned: true }).notNull().default(0),
  Gold: int("Gold", { unsigned: true }).notNull().default(0),
  Reputation: int("Reputation", { unsigned: true }).notNull().default(0),
  ClassPoints: int("ClassPoints", { unsigned: true }).notNull().default(0),
  RewardType: char("RewardType", { length: 1 }).notNull().default("S"),
  Level: tinyint("Level").notNull().default(1),
  Upgrade: tinyint("Upgrade").notNull().default(0),
  Once: tinyint("Once").notNull().default(0),
  Field: char("Field", { length: 15 }).notNull().default(""),
  Schedule: mysqlEnum("Schedule", ["None", "Daily", "Weekly", "Monthly"]).notNull().default("None"),
  Index: int("Index").notNull().default(-1),
});

export const quests_prerequisites = mysqlTable("quests_prerequisites", {
  id: int("id", { unsigned: true }).primaryKey().notNull().autoincrement(),
  QuestID: int("QuestID", { unsigned: true }).notNull(),
  PrerequisiteID: int("PrerequisiteID", { unsigned: true }).notNull()
});

export const quests_required_items = mysqlTable("quests_required_items", {
  id: int("id", { unsigned: true }).primaryKey().notNull().autoincrement(),
  QuestID: int("QuestID", { unsigned: true }).notNull(),
  ItemID: int("ItemID", { unsigned: true }).notNull(),
  Quantity: int("Quantity", { unsigned: true }).notNull().default(1)
});

export const quests_requirements = mysqlTable("quests_requirements", {
  id: int("id", { unsigned: true }).primaryKey().notNull().autoincrement(),
  QuestID: int("QuestID", { unsigned: true }).notNull(),
  ItemID: int("ItemID", { unsigned: true }).notNull(),
  Quantity: int("Quantity", { unsigned: true }).notNull().default(1)
});

export const quests_rewards = mysqlTable("quests_rewards", {
  id: int("id", { unsigned: true }).primaryKey().notNull().autoincrement(),
  QuestID: int("QuestID", { unsigned: true }).notNull(),
  ItemID: int("ItemID", { unsigned: true }).notNull(),
  Quantity: int("Quantity", { unsigned: true }).notNull().default(1),
  Rate: decimal("Rate", { precision: 7, scale: 2 }).notNull().default("1.00"),
  RewardType: char("RewardType", { length: 1 }).notNull().default("S"),
});

export const quests_timer = mysqlTable("quests_timer", {
  id: int("id", { unsigned: true }).primaryKey().notNull().autoincrement(),
  QuestID: int("QuestID", { unsigned: true }).notNull(),
  ExpireDate: datetime("ExpireDate").notNull(),
});

export const quests_chains = mysqlTable("quests_chains", {
  id: int("id", { unsigned: true }).primaryKey().notNull().autoincrement(),
  Name: varchar("Name", { length: 50 }).notNull(),
  Description: longtext("Description").notNull(),
});

export const races = mysqlTable("races", {
  id: int("id", { unsigned: true }).primaryKey().notNull().autoincrement(),
  Name: varchar("Name", { length: 50 }).notNull()
});

export const redeem_codes = mysqlTable("redeem_codes", {
  id: int("id").notNull().primaryKey().autoincrement(),
  Code: varchar("Code", { length: 50 }).notNull(),
  Items: varchar("Items", { length: 50 }),
  Copper: int("Copper").notNull().default(0),
  Silver: int("Silver").notNull().default(0),
  Gold: int("Gold").notNull().default(0),
  Experience: int("Experience").notNull(),
  ClassPoints: int("ClassPoints").notNull(),
  QuantityLeft: int("QuantityLeft").notNull(),
  Limited: tinyint("Limited").notNull().default(0),
  Enabled: tinyint("Enabled").notNull().default(0),
  DateExpiry: datetime("DateExpiry", { mode: "date" }).notNull(),
});

export const shops = mysqlTable("shops", {
  id: int("id", { unsigned: true }).primaryKey().notNull().autoincrement(),
  Name: varchar("Name", { length: 50 }).notNull(),
  House: boolean("House").notNull().default(false),
  Upgrade: boolean("Upgrade").notNull().default(false),
  Staff: boolean("Staff").notNull().default(false),
  Limited: boolean("Limited").notNull().default(false)
});

export const shops_items = mysqlTable("shops_items", {
  id: int("id", { unsigned: true }).primaryKey().notNull().autoincrement(),
  ShopID: int("ShopID", { unsigned: true }).notNull(),
  ItemID: int("ItemID", { unsigned: true }).notNull(),
  QuantityRemain: int("QuantityRemain", { unsigned: true }).notNull().default(0)
});

export const shops_seasonal = mysqlTable("shops_seasonal", {
  id: int("id", { unsigned: true }).primaryKey().notNull().autoincrement(),
  Name: varchar("Name", { length: 50 }).notNull(),
  Expired: date("Expired").notNull()
});

export const skills = mysqlTable("skills", {
  id: int("id", { unsigned: true }).notNull().primaryKey().autoincrement(),
  Name: varchar("Name", { length: 32 }).notNull(),
  Animation: varchar("Animation", { length: 64 }),
  Description: longtext("Description").notNull().default("N/A"),
  Damage: decimal("Damage", { precision: 7, scale: 2 }).notNull().default("1.00"),
  Mana: smallint("Mana", { unsigned: false }).notNull(),
  Icon: varchar("Icon", { length: 32 }),
  Range: smallint("Range", { unsigned: true }).notNull().default(808),
  Dsrc: varchar("Dsrc", { length: 255 }),
  Reference: char("Reference", { length: 2 }).notNull(),
  Target: char("Target", { length: 1 }).notNull().default("1"),
  Type: varchar("Type", { length: 7 }).notNull(),
  Effect: char("Effect", { length: 1 }).notNull(),
  Strl: varchar("Strl", { length: 32 }),
  Sounds: varchar("Sounds", { length: 32 }),
  Cooldown: int("Cooldown").notNull().default(1500),
  MaxHitTarget: tinyint("MaxHitTarget", { unsigned: true }).notNull().default(1),
  MinHitTarget: tinyint("MinHitTarget").notNull().default(1),
  CannotMiss: tinyint("CannotMiss").notNull().default(0),
  CannotDodge: tinyint("CannotDodge").notNull().default(0),
  CannotCrit: tinyint("CannotCrit").notNull().default(0),
  Filter: varchar("Filter", { length: 55 }),
  Message: longtext("Message"),
});

export const skills_assign = mysqlTable("skills_assign", {
  id: int("id", { unsigned: true }).primaryKey().notNull().autoincrement(),
  SkillID: int("SkillID", { unsigned: true }).notNull(),
  ItemID: int("ItemID", { unsigned: true }).notNull()
});

export const skills_auras = mysqlTable("skills_auras", {
  id: int("id", { unsigned: true }).primaryKey().notNull().autoincrement(),
  SkillID: int("SkillID", { unsigned: true }).notNull(),
  AuraID: int("AuraID", { unsigned: true }).notNull(),
  ReqAura: int("ReqAura").notNull().default(0),
  ReqStack: int("ReqStack").notNull().default(0),
});

export const skills_indicators = mysqlTable("skills_indicators", {
  id: int("id", { unsigned: true }).primaryKey().notNull().autoincrement(),
  Shape: mysqlEnum("Shape", ["Circle", "Rectangle"]).notNull().default("Circle"),
  Color: mysqlEnum("Color", ["Red", "Green"]).notNull().default("Red"),
  X: int("X").notNull().default(0),
  Y: int("Y").notNull().default(0),
  Width: int("Width").notNull().default(-1),
  Height: int("Height").notNull().default(-1),
  Radius: int("Radius").notNull().default(-1),
  SpawnType: mysqlEnum("SpawnType", ["Target", "Random", "Fixed"]).notNull().default("Target"),
});

export const users = mysqlTable("users", {
  id: int("id", { unsigned: true }).primaryKey().notNull().autoincrement(),
  Name: varchar("Name", { length: 255 }).notNull(),
  Email: varchar("Email", { length: 255 }).notNull(),
  Password: varchar("Password", { length: 255 }).notNull(),
  CharacterSlot: tinyint("CharacterSlot", { unsigned: true }).notNull().default(3),
  CreatedAt: timestamp("CreatedAt").notNull().defaultNow(),
  UpdatedAt: timestamp("UpdatedAt").notNull().defaultNow(),
});

export const users_characters = mysqlTable("users_characters", {
  id: int("id", { unsigned: true }).notNull().primaryKey().autoincrement(),
  UserID: int("UserID").notNull(),
  Name: varchar("Name", { length: 32 }).notNull(),
  TitleID: int("TitleID", { unsigned: true }),
  HairID: int("HairID", { unsigned: true }).notNull(),
  Access: tinyint("Access", { unsigned: true }).notNull().default(1),
  Difficult: tinyint("Difficult", { unsigned: true }).notNull().default(0),
  ActivationFlag: tinyint("ActivationFlag", { unsigned: true }).notNull().default(5),
  PermamuteFlag: tinyint("PermamuteFlag", { unsigned: true }).notNull().default(0),
  Country: char("Country", { length: 2 }).notNull().default("xx"),
  Age: tinyint("Age", { unsigned: true }).notNull(),
  Gender: char("Gender", { length: 1 }).notNull(),
  Level: tinyint("Level", { unsigned: true }).notNull().default(1),
  Copper: int("Copper", { unsigned: true }).notNull().default(0),
  Silver: int("Silver", { unsigned: true }).notNull().default(0),
  Gold: int("Gold", { unsigned: true }).notNull().default(0),
  Exp: int("Exp", { unsigned: true }).notNull().default(0),
  ColorHair: char("ColorHair", { length: 6 }).notNull().default("000000"),
  ColorSkin: char("ColorSkin", { length: 6 }).notNull().default("000000"),
  ColorEye: char("ColorEye", { length: 6 }).notNull().default("000000"),
  ColorBase: char("ColorBase", { length: 6 }).notNull().default("000000"),
  ColorTrim: char("ColorTrim", { length: 6 }).notNull().default("000000"),
  ColorAccessory: char("ColorAccessory", { length: 6 }).notNull().default("000000"),
  ColorChat: varchar("ColorChat", { length: 60 }).notNull().default("0xFFFFFF"),
  SlotsAuction: smallint("SlotsAuction").notNull().default(10),
  SlotsBag: smallint("SlotsBag", { unsigned: true }).notNull().default(40),
  SlotsBank: smallint("SlotsBank", { unsigned: true }).notNull().default(0),
  SlotsHouse: smallint("SlotsHouse", { unsigned: true }).notNull().default(20),
  DateCreated: datetime("DateCreated", { mode: "date" }).notNull().default(new Date()),
  LastLogin: datetime("LastLogin", { mode: "date" }).notNull().default(new Date()),
  LevelDate: datetime("LevelDate", { mode: "date" }).notNull().default(new Date()),
  BanExpire: datetime("BanExpire", { mode: "date" }).notNull().default(new Date("2000-01-01 00:00:00")),
  CpBoostExpire: timestamp("CpBoostExpire").notNull().defaultNow(),
  RepBoostExpire: timestamp("RepBoostExpire").notNull().defaultNow(),
  CopperBoostExpire: timestamp("CopperBoostExpire").notNull().defaultNow(),
  SilverBoostExpire: timestamp("SilverBoostExpire").notNull().defaultNow(),
  GoldBoostExpire: timestamp("GoldBoostExpire").notNull().defaultNow(),
  ExpBoostExpire: timestamp("ExpBoostExpire").notNull().defaultNow(),
  DropBoostExpire: timestamp("DropBoostExpire").notNull().defaultNow(),
  UpgradeExpire: timestamp("UpgradeExpire").notNull().default(new Date("1999-12-31 16:00:00")),
  UpgradeDays: smallint("UpgradeDays").notNull().default(0),
  Upgraded: tinyint("Upgraded", { unsigned: true }).notNull().default(0),
  Achievement: int("Achievement", { unsigned: true }).notNull().default(0),
  Settings: int("Settings", { unsigned: true }).notNull().default(0),
  LastArea: varchar("LastArea", { length: 64 }).notNull().default("faroff-1|Enter|Spawn"),
  CurrentServer: varchar("CurrentServer", { length: 16 }).notNull().default("Offline"),
  KillCount: int("KillCount", { unsigned: true }).notNull().default(0),
  DeathCount: int("DeathCount", { unsigned: true }).notNull().default(0),
  PlayerKill: int("PlayerKill", { unsigned: true }).notNull().default(0),
  MonsterKill: int("MonsterKill", { unsigned: true }).notNull().default(0),
  Address: varchar("Address", { length: 255 }).notNull().default("0.0.0.0"),
  GameAddress: varchar("GameAddress", { length: 255 }).notNull().default("0.0.0.0"),
  Status: mysqlEnum("Status", ["Online", "Offline"]).notNull().default("Offline"),
  Image: varchar("Image", { length: 255 }),
});

export const users_characters_items = mysqlTable("users_characters_items", {
  id: int("id", { unsigned: true }).primaryKey().notNull().autoincrement(),
  CharID: int("CharID", { unsigned: true }).notNull(),
  ItemID: int("ItemID", { unsigned: true }).notNull(),
  EnhID: int("EnhID", { unsigned: true }).notNull().default(1),
  Equipped: boolean("Equipped").notNull().default(false),
  Quantity: int("Quantity", { unsigned: true }).notNull().default(1),
  Bank: boolean("Bank").notNull().default(false),
  Favorite: boolean("Favorite").notNull().default(false),
  DatePurchased: datetime("DatePurchased", { mode: "date" }).notNull().default(new Date()),
});