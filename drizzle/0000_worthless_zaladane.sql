CREATE TABLE `achievements` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`Name` varchar(55) NOT NULL,
	`File` varchar(255) NOT NULL DEFAULT 'default.swf',
	`Image` varchar(255) NOT NULL DEFAULT 'Achievement.png',
	`Linkage` varchar(60) DEFAULT 'Achievement',
	`Shop` int NOT NULL DEFAULT 0,
	`Description` longtext NOT NULL,
	CONSTRAINT `achievements_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `areas` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`Name` varchar(32) NOT NULL,
	`File` varchar(50) NOT NULL,
	`MaxPlayers` tinyint unsigned NOT NULL DEFAULT 6,
	`ReqLevel` int NOT NULL DEFAULT 1,
	`ReqParty` boolean NOT NULL DEFAULT false,
	`Upgrade` boolean NOT NULL DEFAULT false,
	`Staff` boolean NOT NULL DEFAULT false,
	`PvP` boolean NOT NULL DEFAULT false,
	`Timeline` boolean NOT NULL DEFAULT false,
	`Floor` boolean NOT NULL DEFAULT false,
	`Dungeon` boolean NOT NULL DEFAULT false,
	`DamageMultiplier` decimal(7,2) NOT NULL DEFAULT '1.00',
	`GuildLevel` int unsigned NOT NULL DEFAULT 0,
	`Created_At` timestamp NOT NULL DEFAULT (now()),
	`Updated_At` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `areas_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `areas_items` (
	`MapID` int unsigned NOT NULL,
	`ItemID` int unsigned NOT NULL
);
--> statement-breakpoint
CREATE TABLE `areas_monsters` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`MapID` int unsigned NOT NULL,
	`MonsterID` int unsigned NOT NULL,
	`MonMapID` int unsigned NOT NULL,
	`Frame` varchar(10) NOT NULL,
	`Aggresive` tinyint NOT NULL DEFAULT 0,
	`SpawnTimePeriod` enum('Always','Morning','Afternoon','Evening','Midnight') NOT NULL DEFAULT 'Always',
	`CanMove` tinyint unsigned NOT NULL DEFAULT 1,
	`ReqQuestID` int unsigned,
	`Team` tinyint unsigned NOT NULL DEFAULT 0,
	CONSTRAINT `areas_monsters_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `areas_npcs` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`MapID` int unsigned NOT NULL,
	`NpcID` int unsigned NOT NULL,
	`NpcMapID` int unsigned NOT NULL DEFAULT 1,
	`Frame` varchar(60) NOT NULL DEFAULT 'None',
	`SpawnTimePeriod` enum('Always','Morning','Afternoon','Evening','Midnight') NOT NULL DEFAULT 'Always',
	`Behavior` enum('Neutral','Hostile','Ally') NOT NULL DEFAULT 'Neutral',
	`CanMove` tinyint unsigned NOT NULL DEFAULT 1,
	`ReqQuestID` int unsigned,
	`Team` tinyint unsigned NOT NULL DEFAULT 1,
	CONSTRAINT `areas_npcs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `areas_timeline` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`AreaID` int unsigned,
	`Scale` decimal(7,2) NOT NULL DEFAULT '0.80',
	`Mode` varchar(10) NOT NULL DEFAULT 'normal',
	`Speed` int NOT NULL DEFAULT 11,
	`Scroll` tinyint unsigned NOT NULL DEFAULT 0,
	`Width` int NOT NULL DEFAULT 1980,
	`Height` int NOT NULL DEFAULT 700,
	`Frame` varchar(10) NOT NULL DEFAULT 'Enter',
	`Data` longtext NOT NULL DEFAULT '[]',
	CONSTRAINT `areas_timeline_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `auras` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`Name` varchar(32) NOT NULL,
	`Duration` smallint NOT NULL DEFAULT 6,
	`Speed` int NOT NULL DEFAULT 2500,
	`Category` varchar(50) DEFAULT 'none',
	`Target` enum('h','s','f') DEFAULT 'h',
	`Chance` decimal(7,2) NOT NULL DEFAULT '1.00',
	`MsgOn` longtext,
	`MsgOff` longtext,
	`AnimOn` varchar(50),
	`AnimOff` varchar(50),
	`SpellOn` varchar(50),
	`Transform` tinyint NOT NULL DEFAULT 0,
	`MaxStack` int unsigned NOT NULL DEFAULT 999,
	`Turns` int unsigned NOT NULL DEFAULT 0,
	`IndicatorID` int unsigned,
	CONSTRAINT `auras_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `auras_effects` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`AuraID` int unsigned NOT NULL,
	`Stat` varchar(3) NOT NULL,
	`Value` decimal(7,2) NOT NULL DEFAULT '0.00',
	`Type` varchar(2) NOT NULL DEFAULT '+',
	`CanStack` tinyint unsigned NOT NULL DEFAULT 0,
	CONSTRAINT `auras_effects_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `chat_channels` (
	`Name` varchar(50) NOT NULL,
	`Color` varchar(50) NOT NULL DEFAULT 'FFFFFF',
	`Type` enum('message','event','whisper','server') NOT NULL DEFAULT 'message',
	`Tag` varchar(50) NOT NULL DEFAULT '',
	`Rid` int unsigned NOT NULL DEFAULT 0,
	`Act` int unsigned NOT NULL DEFAULT 1,
	CONSTRAINT `chat_channels_Name` PRIMARY KEY(`Name`)
);
--> statement-breakpoint
CREATE TABLE `chat_filters` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`Word` varchar(50) NOT NULL,
	`Mutetime` int NOT NULL DEFAULT 1000,
	CONSTRAINT `chat_filters_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `chat_global_messages` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`Message` varchar(255) NOT NULL,
	`Interval` int NOT NULL DEFAULT 60,
	CONSTRAINT `chat_global_messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `classes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ItemID` int unsigned NOT NULL,
	`Category` varchar(2) NOT NULL,
	`Description` longtext NOT NULL,
	`ManaRegenerationMethods` longtext NOT NULL,
	`StatsDescription` longtext NOT NULL,
	CONSTRAINT `classes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `enhancements` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`Name` varchar(32) NOT NULL,
	`PatternID` int unsigned NOT NULL DEFAULT 1,
	`Rarity` tinyint unsigned NOT NULL,
	`DPS` smallint unsigned NOT NULL,
	`Level` tinyint unsigned NOT NULL DEFAULT 1,
	CONSTRAINT `enhancements_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `enhancements_patterns` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`Name` varchar(32) NOT NULL,
	`Desc` varchar(4) NOT NULL,
	`Wisdom` tinyint unsigned NOT NULL,
	`Strength` tinyint unsigned NOT NULL,
	`Luck` tinyint unsigned NOT NULL,
	`Dexterity` tinyint unsigned NOT NULL,
	`Endurance` tinyint unsigned NOT NULL,
	`Intelligence` tinyint unsigned NOT NULL,
	CONSTRAINT `enhancements_patterns_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `factions` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`Name` varchar(20) NOT NULL,
	CONSTRAINT `factions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `global_drops` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ItemID` int NOT NULL,
	`Chance` decimal(20,6) NOT NULL,
	`Quantity` int NOT NULL DEFAULT 0,
	CONSTRAINT `global_drops_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `guilds` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`Name` varchar(64) NOT NULL,
	`Color` varchar(64) NOT NULL DEFAULT '0xFFFFFF',
	`MessageOfTheDay` varchar(512) NOT NULL,
	`MaxMembers` tinyint unsigned NOT NULL DEFAULT 15,
	`Wins` int unsigned NOT NULL DEFAULT 0,
	`Loses` int NOT NULL DEFAULT 0,
	`TotalKills` int unsigned NOT NULL DEFAULT 0,
	`Level` int unsigned NOT NULL DEFAULT 1,
	`Exp` int NOT NULL DEFAULT 0,
	CONSTRAINT `guilds_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `hairs` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`Gender` varchar(1) NOT NULL,
	`Name` varchar(16) NOT NULL,
	`File` varchar(64) NOT NULL,
	CONSTRAINT `hairs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `item_rarities` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`Name` varchar(60) NOT NULL,
	`Color` varchar(50) NOT NULL DEFAULT '0xFFFFFF',
	CONSTRAINT `item_rarities_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `items` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`Name` varchar(60) NOT NULL,
	`Description` longtext NOT NULL DEFAULT '',
	`Type` varchar(16) NOT NULL,
	`Element` varchar(16) NOT NULL DEFAULT 'None',
	`File` varchar(120),
	`Link` varchar(64),
	`Icon` varchar(16) NOT NULL,
	`Equipment` varchar(10) NOT NULL,
	`Level` tinyint unsigned NOT NULL DEFAULT 1,
	`DPS` smallint unsigned NOT NULL DEFAULT 100,
	`Range` smallint unsigned NOT NULL DEFAULT 50,
	`Rarity` int NOT NULL DEFAULT 1,
	`Quantity` smallint unsigned NOT NULL DEFAULT 1,
	`Stack` smallint unsigned NOT NULL DEFAULT 1,
	`Cost` int unsigned NOT NULL DEFAULT 0,
	`Silver` boolean NOT NULL DEFAULT false,
	`Gold` boolean NOT NULL DEFAULT false,
	`Sell` boolean NOT NULL DEFAULT true,
	`Temporary` boolean NOT NULL DEFAULT false,
	`Upgrade` boolean NOT NULL DEFAULT false,
	`Staff` boolean NOT NULL DEFAULT false,
	`EnhID` int unsigned NOT NULL DEFAULT 1,
	`FactionID` int unsigned DEFAULT 1,
	`TitleID` int unsigned,
	`ReqReputation` int NOT NULL DEFAULT 0,
	`ReqClassID` int unsigned,
	`ReqClassPoints` int NOT NULL DEFAULT 0,
	`ReqTrackQuest` varchar(50),
	`Meta` varchar(50),
	CONSTRAINT `items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `items_requirements` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`ItemID` int unsigned NOT NULL,
	`ReqItemID` int unsigned NOT NULL,
	`Quantity` smallint unsigned NOT NULL DEFAULT 0,
	CONSTRAINT `items_requirements_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `items_skills` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`ItemID` int unsigned NOT NULL,
	`SkillID` int unsigned NOT NULL,
	CONSTRAINT `items_skills_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `monsters` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`Name` varchar(30) NOT NULL,
	`RaceID` int unsigned NOT NULL DEFAULT 1,
	`File` varchar(128) NOT NULL,
	`Linkage` varchar(32) NOT NULL DEFAULT 'Monster',
	`Level` tinyint unsigned NOT NULL DEFAULT 1,
	`Health` int unsigned NOT NULL DEFAULT 100,
	`HealthBar` tinyint unsigned NOT NULL DEFAULT 1,
	`Mana` int unsigned NOT NULL DEFAULT 100,
	`Copper` int unsigned NOT NULL DEFAULT 0,
	`Silver` int unsigned NOT NULL DEFAULT 0,
	`Gold` int unsigned NOT NULL DEFAULT 0,
	`Experience` int unsigned NOT NULL DEFAULT 10,
	`ClassPoint` int unsigned NOT NULL DEFAULT 0,
	`Reputation` int NOT NULL DEFAULT 0,
	`Damage` decimal(7,2) NOT NULL DEFAULT '0.10',
	`Respawn` int unsigned NOT NULL DEFAULT 6,
	`Speed` int unsigned NOT NULL DEFAULT 1500,
	`Immune` boolean NOT NULL DEFAULT false,
	`FloorBoss` boolean NOT NULL DEFAULT false,
	`TeamID` int unsigned NOT NULL DEFAULT 0,
	CONSTRAINT `monsters_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `monsters_drops` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`MonsterID` int unsigned NOT NULL,
	`ItemID` int unsigned NOT NULL,
	`Chance` decimal(7,2) NOT NULL DEFAULT '1.00',
	`Quantity` int unsigned NOT NULL DEFAULT 1,
	CONSTRAINT `monsters_drops_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `monsters_skills` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`MonsterID` int unsigned NOT NULL,
	`SkillID` int unsigned NOT NULL,
	CONSTRAINT `monsters_skills_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `monsters_titles` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`Name` varchar(30) NOT NULL,
	`Color` varchar(60) NOT NULL DEFAULT '0xFFFFFF',
	CONSTRAINT `monsters_titles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quests` (
	`id` int unsigned NOT NULL,
	`WarID` int unsigned,
	`AchievementID` int unsigned,
	`TitleID` int,
	`FactionID` int unsigned DEFAULT 1,
	`WarMega` tinyint DEFAULT 0,
	`ReqReputation` int unsigned NOT NULL DEFAULT 0,
	`ReqClassID` int unsigned NOT NULL DEFAULT 0,
	`ReqClassPoints` int unsigned NOT NULL DEFAULT 0,
	`ChainID` int,
	`Name` varchar(64) NOT NULL,
	`Description` longtext NOT NULL,
	`Tier` int unsigned NOT NULL DEFAULT 1,
	`EndText` longtext NOT NULL,
	`Experience` int unsigned NOT NULL DEFAULT 0,
	`Copper` int unsigned NOT NULL DEFAULT 0,
	`Silver` int unsigned NOT NULL DEFAULT 0,
	`Gold` int unsigned NOT NULL DEFAULT 0,
	`Reputation` int unsigned NOT NULL DEFAULT 0,
	`ClassPoints` int unsigned NOT NULL DEFAULT 0,
	`RewardType` char(1) NOT NULL DEFAULT 'S',
	`Level` tinyint NOT NULL DEFAULT 1,
	`Upgrade` tinyint NOT NULL DEFAULT 0,
	`Once` tinyint NOT NULL DEFAULT 0,
	`Field` char(15) NOT NULL DEFAULT '',
	`Schedule` enum('None','Daily','Weekly','Monthly') NOT NULL DEFAULT 'None',
	`Index` int NOT NULL DEFAULT -1,
	CONSTRAINT `quests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quests_chains` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`Name` varchar(50) NOT NULL,
	`Description` longtext NOT NULL,
	CONSTRAINT `quests_chains_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quests_prerequisites` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`QuestID` int unsigned NOT NULL,
	`PrerequisiteID` int unsigned NOT NULL,
	CONSTRAINT `quests_prerequisites_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quests_required_items` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`QuestID` int unsigned NOT NULL,
	`ItemID` int unsigned NOT NULL,
	`Quantity` int unsigned NOT NULL DEFAULT 1,
	CONSTRAINT `quests_required_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quests_requirements` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`QuestID` int unsigned NOT NULL,
	`ItemID` int unsigned NOT NULL,
	`Quantity` int unsigned NOT NULL DEFAULT 1,
	CONSTRAINT `quests_requirements_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quests_rewards` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`QuestID` int unsigned NOT NULL,
	`ItemID` int unsigned NOT NULL,
	`Quantity` int unsigned NOT NULL DEFAULT 1,
	`Rate` decimal(7,2) NOT NULL DEFAULT '1.00',
	`RewardType` char(1) NOT NULL DEFAULT 'S',
	CONSTRAINT `quests_rewards_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quests_timer` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`QuestID` int unsigned NOT NULL,
	`ExpireDate` datetime NOT NULL,
	CONSTRAINT `quests_timer_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `races` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`Name` varchar(50) NOT NULL,
	CONSTRAINT `races_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `redeem_codes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`Code` varchar(50) NOT NULL,
	`Items` varchar(50),
	`Copper` int NOT NULL DEFAULT 0,
	`Silver` int NOT NULL DEFAULT 0,
	`Gold` int NOT NULL DEFAULT 0,
	`Experience` int NOT NULL,
	`ClassPoints` int NOT NULL,
	`QuantityLeft` int NOT NULL,
	`Limited` tinyint NOT NULL DEFAULT 0,
	`Enabled` tinyint NOT NULL DEFAULT 0,
	`DateExpiry` datetime NOT NULL,
	CONSTRAINT `redeem_codes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `shops` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`Name` varchar(50) NOT NULL,
	`House` boolean NOT NULL DEFAULT false,
	`Upgrade` boolean NOT NULL DEFAULT false,
	`Staff` boolean NOT NULL DEFAULT false,
	`Limited` boolean NOT NULL DEFAULT false,
	CONSTRAINT `shops_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `shops_items` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`ShopID` int unsigned NOT NULL,
	`ItemID` int unsigned NOT NULL,
	`QuantityRemain` int unsigned NOT NULL DEFAULT 0,
	CONSTRAINT `shops_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `shops_seasonal` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`Name` varchar(50) NOT NULL,
	`Expired` date NOT NULL,
	CONSTRAINT `shops_seasonal_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `skills` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`Name` varchar(32) NOT NULL,
	`Animation` varchar(64),
	`Description` longtext NOT NULL DEFAULT 'N/A',
	`Damage` decimal(7,2) NOT NULL DEFAULT '1.00',
	`Mana` smallint NOT NULL,
	`Icon` varchar(32),
	`Range` smallint unsigned NOT NULL DEFAULT 808,
	`Dsrc` varchar(255),
	`Reference` char(2) NOT NULL,
	`Target` char(1) NOT NULL DEFAULT '1',
	`Type` varchar(7) NOT NULL,
	`Effect` char(1) NOT NULL,
	`Strl` varchar(32),
	`Sounds` varchar(32),
	`Cooldown` int NOT NULL DEFAULT 1500,
	`MaxHitTarget` tinyint unsigned NOT NULL DEFAULT 1,
	`MinHitTarget` tinyint NOT NULL DEFAULT 1,
	`CannotMiss` tinyint NOT NULL DEFAULT 0,
	`CannotDodge` tinyint NOT NULL DEFAULT 0,
	`CannotCrit` tinyint NOT NULL DEFAULT 0,
	`Filter` varchar(55),
	`Message` longtext,
	CONSTRAINT `skills_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `skills_assign` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`SkillID` int unsigned NOT NULL,
	`ItemID` int unsigned NOT NULL,
	CONSTRAINT `skills_assign_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `skills_auras` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`SkillID` int unsigned NOT NULL,
	`AuraID` int unsigned NOT NULL,
	`ReqAura` int NOT NULL DEFAULT 0,
	`ReqStack` int NOT NULL DEFAULT 0,
	CONSTRAINT `skills_auras_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `skills_indicators` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`Shape` enum('Circle','Rectangle') NOT NULL DEFAULT 'Circle',
	`Color` enum('Red','Green') NOT NULL DEFAULT 'Red',
	`X` int NOT NULL DEFAULT 0,
	`Y` int NOT NULL DEFAULT 0,
	`Width` int NOT NULL DEFAULT -1,
	`Height` int NOT NULL DEFAULT -1,
	`Radius` int NOT NULL DEFAULT -1,
	`SpawnType` enum('Target','Random','Fixed') NOT NULL DEFAULT 'Target',
	CONSTRAINT `skills_indicators_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`Name` varchar(255) NOT NULL,
	`EmailL` varchar(255) NOT NULL,
	`Password` varchar(255) NOT NULL,
	`CharacterSlot` tinyint unsigned NOT NULL DEFAULT 3,
	`CreatedAt` timestamp NOT NULL DEFAULT (now()),
	`UpdatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users_characters` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`UserID` int NOT NULL,
	`Name` varchar(32) NOT NULL,
	`TitleID` int unsigned,
	`HairID` int unsigned NOT NULL,
	`Access` tinyint unsigned NOT NULL DEFAULT 1,
	`Difficult` tinyint unsigned NOT NULL DEFAULT 0,
	`ActivationFlag` tinyint unsigned NOT NULL DEFAULT 5,
	`PermamuteFlag` tinyint unsigned NOT NULL DEFAULT 0,
	`Country` char(2) NOT NULL DEFAULT 'xx',
	`Age` tinyint unsigned NOT NULL,
	`Gender` char(1) NOT NULL,
	`Level` tinyint unsigned NOT NULL DEFAULT 1,
	`Copper` int unsigned NOT NULL DEFAULT 0,
	`Silver` int unsigned NOT NULL DEFAULT 0,
	`Gold` int unsigned NOT NULL DEFAULT 0,
	`Exp` int unsigned NOT NULL DEFAULT 0,
	`ColorHair` char(6) NOT NULL DEFAULT '000000',
	`ColorSkin` char(6) NOT NULL DEFAULT '000000',
	`ColorEye` char(6) NOT NULL DEFAULT '000000',
	`ColorBase` char(6) NOT NULL DEFAULT '000000',
	`ColorTrim` char(6) NOT NULL DEFAULT '000000',
	`ColorAccessory` char(6) NOT NULL DEFAULT '000000',
	`ColorChat` varchar(60) NOT NULL DEFAULT '0xFFFFFF',
	`SlotsAuction` smallint NOT NULL DEFAULT 10,
	`SlotsBag` smallint unsigned NOT NULL DEFAULT 40,
	`SlotsBank` smallint unsigned NOT NULL DEFAULT 0,
	`SlotsHouse` smallint unsigned NOT NULL DEFAULT 20,
	`DateCreated` datetime NOT NULL DEFAULT '2025-09-13 11:50:36.718',
	`LastLogin` datetime NOT NULL DEFAULT '2025-09-13 11:50:36.718',
	`LevelDate` datetime NOT NULL DEFAULT '2025-09-13 11:50:36.718',
	`BanExpire` datetime NOT NULL DEFAULT '1999-12-31 16:00:00.000',
	`CpBoostExpire` timestamp NOT NULL DEFAULT (now()),
	`RepBoostExpire` timestamp NOT NULL DEFAULT (now()),
	`CopperBoostExpire` timestamp NOT NULL DEFAULT (now()),
	`SilverBoostExpire` timestamp NOT NULL DEFAULT (now()),
	`GoldBoostExpire` timestamp NOT NULL DEFAULT (now()),
	`ExpBoostExpire` timestamp NOT NULL DEFAULT (now()),
	`DropBoostExpire` timestamp NOT NULL DEFAULT (now()),
	`UpgradeExpire` timestamp NOT NULL DEFAULT '1999-12-31 08:00:00.000',
	`UpgradeDays` smallint NOT NULL DEFAULT 0,
	`Upgraded` tinyint unsigned NOT NULL DEFAULT 0,
	`Achievement` int unsigned NOT NULL DEFAULT 0,
	`Settings` int unsigned NOT NULL DEFAULT 0,
	`LastArea` varchar(64) NOT NULL DEFAULT 'faroff-1|Enter|Spawn',
	`CurrentServer` varchar(16) NOT NULL DEFAULT 'Offline',
	`KillCount` int unsigned NOT NULL DEFAULT 0,
	`DeathCount` int unsigned NOT NULL DEFAULT 0,
	`PlayerKill` int unsigned NOT NULL DEFAULT 0,
	`MonsterKill` int unsigned NOT NULL DEFAULT 0,
	`Address` varchar(255) NOT NULL DEFAULT '0.0.0.0',
	`GameAddress` varchar(255) NOT NULL DEFAULT '0.0.0.0',
	`Status` enum('Online','Offline') NOT NULL DEFAULT 'Offline',
	`Image` varchar(255),
	CONSTRAINT `users_characters_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users_characters_items` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`CharID` int unsigned NOT NULL,
	`ItemID` int unsigned NOT NULL,
	`EnhID` int unsigned NOT NULL DEFAULT 1,
	`Equipped` boolean NOT NULL DEFAULT false,
	`Quantity` int unsigned NOT NULL DEFAULT 1,
	`Bank` boolean NOT NULL DEFAULT false,
	`Favorite` boolean NOT NULL DEFAULT false,
	`DatePurchased` datetime NOT NULL DEFAULT '2025-09-13 11:50:36.719',
	CONSTRAINT `users_characters_items_id` PRIMARY KEY(`id`)
);
