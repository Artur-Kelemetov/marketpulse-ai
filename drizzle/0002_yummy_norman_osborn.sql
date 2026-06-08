CREATE TABLE `publications` (
	`id` text PRIMARY KEY NOT NULL,
	`draft_id` text NOT NULL,
	`title` text NOT NULL,
	`status` text NOT NULL,
	`scheduled_for` integer NOT NULL,
	`sent_at` integer,
	`telegram_message_id` text,
	`error_message` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`draft_id`) REFERENCES `drafts`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `publications_draft_id_idx` ON `publications` (`draft_id`);--> statement-breakpoint
CREATE INDEX `publications_status_idx` ON `publications` (`status`);--> statement-breakpoint
CREATE INDEX `publications_scheduled_for_idx` ON `publications` (`scheduled_for`);