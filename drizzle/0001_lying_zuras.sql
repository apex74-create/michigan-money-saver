CREATE TABLE `contactReveals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`buyerId` int NOT NULL,
	`sellerId` int NOT NULL,
	`listingId` int NOT NULL,
	`transactionId` int,
	`revealedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `contactReveals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `domainShields` (
	`id` int AUTO_INCREMENT NOT NULL,
	`operatorId` int NOT NULL,
	`nameplate` varchar(128) NOT NULL,
	`tarwellDomain` varchar(256),
	`toritoDomain` varchar(256),
	`vaultDomain` varchar(256),
	`provisionType` enum('apex_provisioned','bring_your_own') NOT NULL DEFAULT 'apex_provisioned',
	`sslStatus` enum('pending','provisioning','active','failed') NOT NULL DEFAULT 'pending',
	`tristarStatus` enum('offline','initializing','routing','active') NOT NULL DEFAULT 'offline',
	`config` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `domainShields_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `inquiries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`listingId` int NOT NULL,
	`buyerId` int NOT NULL,
	`sellerId` int NOT NULL,
	`message` text NOT NULL,
	`status` enum('unread','read','replied') NOT NULL DEFAULT 'unread',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `inquiries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `listings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sellerId` int NOT NULL,
	`title` varchar(256) NOT NULL,
	`description` text,
	`category` enum('general','furniture','electronics','clothing','tools','toys','books','sports','automotive','collectibles','other') NOT NULL DEFAULT 'general',
	`address` text NOT NULL,
	`city` varchar(128) NOT NULL,
	`state` varchar(64) NOT NULL,
	`zip` varchar(16) NOT NULL,
	`lat` decimal(10,7),
	`lng` decimal(10,7),
	`saleDate` timestamp NOT NULL,
	`saleEndDate` timestamp,
	`priceMin` decimal(10,2),
	`priceMax` decimal(10,2),
	`status` enum('draft','active','ended','cancelled') NOT NULL DEFAULT 'draft',
	`viewCount` int NOT NULL DEFAULT 0,
	`contactRevealCount` int NOT NULL DEFAULT 0,
	`photos` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `listings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`type` enum('subscription','contact_reveal','listing_boost','franchise_fee') NOT NULL,
	`buyerId` int NOT NULL,
	`sellerId` int,
	`listingId` int,
	`operatorId` int,
	`amount` decimal(10,2) NOT NULL,
	`platformFee` decimal(10,2) NOT NULL,
	`operatorCommission` decimal(10,2) NOT NULL DEFAULT '0.00',
	`sellerPayout` decimal(10,2) NOT NULL DEFAULT '0.00',
	`platformPercentage` decimal(5,2) NOT NULL DEFAULT '15.00',
	`operatorPercentage` decimal(5,2) NOT NULL DEFAULT '5.00',
	`status` enum('pending','completed','refunded','failed') NOT NULL DEFAULT 'pending',
	`provenanceHash` varchar(128),
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `transactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('user','admin','operator') NOT NULL DEFAULT 'user';--> statement-breakpoint
ALTER TABLE `users` ADD `subscriptionTier` enum('free','basic','pro') DEFAULT 'free' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `subscriptionExpiresAt` timestamp;--> statement-breakpoint
ALTER TABLE `users` ADD `phone` varchar(32);--> statement-breakpoint
ALTER TABLE `users` ADD `address` text;--> statement-breakpoint
ALTER TABLE `users` ADD `city` varchar(128);--> statement-breakpoint
ALTER TABLE `users` ADD `state` varchar(64);--> statement-breakpoint
ALTER TABLE `users` ADD `zip` varchar(16);--> statement-breakpoint
ALTER TABLE `users` ADD `bio` text;--> statement-breakpoint
ALTER TABLE `users` ADD `avatarUrl` text;--> statement-breakpoint
ALTER TABLE `users` ADD `operatorId` int;