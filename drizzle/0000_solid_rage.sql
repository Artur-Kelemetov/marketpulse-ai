CREATE TABLE `assets` (
	`id` text PRIMARY KEY NOT NULL,
	`symbol` text NOT NULL,
	`display_symbol` text NOT NULL,
	`name` text NOT NULL,
	`asset_type` text NOT NULL,
	`exchange` text NOT NULL,
	`currency` text NOT NULL,
	`active` integer NOT NULL,
	`price` real NOT NULL,
	`change_percent_24h` real NOT NULL,
	`volume_24h` real NOT NULL,
	`market_mood` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `assets_symbol_idx` ON `assets` (`symbol`);--> statement-breakpoint
CREATE INDEX `assets_asset_type_idx` ON `assets` (`asset_type`);--> statement-breakpoint
CREATE TABLE `market_idea_assets` (
	`idea_id` text NOT NULL,
	`asset_id` text NOT NULL,
	PRIMARY KEY(`idea_id`, `asset_id`),
	FOREIGN KEY (`idea_id`) REFERENCES `market_ideas`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`asset_id`) REFERENCES `assets`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `market_idea_assets_asset_id_idx` ON `market_idea_assets` (`asset_id`);--> statement-breakpoint
CREATE TABLE `market_ideas` (
	`id` text PRIMARY KEY NOT NULL,
	`content_type` text NOT NULL,
	`suggested_action` text NOT NULL,
	`conviction` text NOT NULL,
	`time_horizon` text NOT NULL,
	`market_mood` text NOT NULL,
	`status` text NOT NULL,
	`title` text NOT NULL,
	`summary` text NOT NULL,
	`thesis` text NOT NULL,
	`why_now` text NOT NULL,
	`key_factors` text NOT NULL,
	`risk_notes` text NOT NULL,
	`invalidation_scenario` text NOT NULL,
	`educational_context` text,
	`disclaimer` text NOT NULL,
	`sources` text NOT NULL,
	`metadata` text NOT NULL,
	`compliance_flags` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `market_ideas_status_idx` ON `market_ideas` (`status`);--> statement-breakpoint
CREATE INDEX `market_ideas_content_type_idx` ON `market_ideas` (`content_type`);--> statement-breakpoint
CREATE INDEX `market_ideas_created_at_idx` ON `market_ideas` (`created_at`);--> statement-breakpoint
CREATE TABLE `safety_reviews` (
	`id` text PRIMARY KEY NOT NULL,
	`idea_id` text NOT NULL,
	`passed_count` integer NOT NULL,
	`total_count` integer NOT NULL,
	`blocking_count` integer NOT NULL,
	`items` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`idea_id`) REFERENCES `market_ideas`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `safety_reviews_idea_id_idx` ON `safety_reviews` (`idea_id`);--> statement-breakpoint
CREATE INDEX `safety_reviews_created_at_idx` ON `safety_reviews` (`created_at`);