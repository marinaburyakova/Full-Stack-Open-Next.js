CREATE TABLE "blogs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"author" text NOT NULL,
	"url" text NOT NULL,
	"likes" integer DEFAULT 0 NOT NULL
);
