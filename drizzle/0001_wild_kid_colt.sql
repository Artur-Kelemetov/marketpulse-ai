CREATE TABLE `drafts` (
	`id` text PRIMARY KEY NOT NULL,
	`idea_id` text NOT NULL,
	`title` text NOT NULL,
	`telegram_text` text NOT NULL,
	`status` text NOT NULL,
	`has_disclaimer` integer NOT NULL,
	`has_risk_notes` integer NOT NULL,
	`has_invalidation_scenario` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`idea_id`) REFERENCES `market_ideas`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `drafts_idea_id_idx` ON `drafts` (`idea_id`);--> statement-breakpoint
CREATE INDEX `drafts_status_idx` ON `drafts` (`status`);--> statement-breakpoint
CREATE INDEX `drafts_updated_at_idx` ON `drafts` (`updated_at`);